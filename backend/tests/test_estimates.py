import pytest
from fastapi import BackgroundTasks, HTTPException
from pydantic import ValidationError

@pytest.mark.parametrize('kind,detail,area,expected,starting', [
    ('move_in','apartment','under-10',120000,False),
    ('move_in','villa','10-20',180000,False),
    ('move_in','apartment','20-30',300000,False),
    ('move_out','house','30-40',455000,False),
    ('residence','officetel','40-50',675000,False),
    ('office','office','over-50',750000,True),
    ('partial','bathroom',None,80000,False),
    ('partial','air-conditioner',None,120000,False),
    ('special','hoarding-home',None,750000,False),
    ('special','large-waste',None,300000,False),
])
def test_estimate_amount(client, kind, detail, area, expected, starting):
    params = {'cleaning_type':kind, 'detail_type':detail}
    if area is not None: params['area_range'] = area
    response = client.get('/estimate', params=params)
    assert response.status_code == 200
    result = response.json()
    assert result['estimated_amount'] == expected
    assert result['currency'] == 'KRW'
    assert result['is_starting_estimate'] is starting
    assert result['pricing_basis'] == ('fixed_reference' if kind in ('partial','special') else 'per_pyeong')

@pytest.mark.parametrize('payload', [
    {'cleaning_type':'move_in','detail_type':'apartment'},
    {'cleaning_type':'move_in','detail_type':'bathroom','area_range':'10-20'},
    {'cleaning_type':'office','detail_type':'apartment','area_range':'10-20'},
    {'cleaning_type':'partial','detail_type':'bathroom','area_range':'10-20'},
    {'cleaning_type':'special','detail_type':'kitchen'},
    {'cleaning_type':'unknown','detail_type':'apartment'},
    {'cleaning_type':'move_in','detail_type':'apartment','area_range':'100-200'},
])
def test_invalid_combination_returns_422(client, payload):
    assert client.get('/estimate', params=payload).status_code == 422

def test_dropdown_values_are_trimmed(api):
    request = api.EstimateRequest(cleaning_type=' move_in ', detail_type=' apartment ', area_range=' 20-30 ')
    assert api.get_estimate(request)['estimated_amount'] == 300000

def test_email_without_configuration_is_not_accepted(api, monkeypatch):
    monkeypatch.delenv('BREVO_API_KEY', raising=False)
    monkeypatch.delenv('BREVO_SENDER_EMAIL', raising=False)
    tasks = BackgroundTasks()
    request = api.EstimateEmailRequest(cleaning_type='partial', detail_type='bathroom', recipient_email='test@example.com')
    with pytest.raises(HTTPException) as caught:
        api.email_estimate(request, tasks)
    assert caught.value.status_code == 503
    assert tasks.tasks == []

def test_email_uses_same_amount_as_screen_and_correct_recipient(api, monkeypatch):
    monkeypatch.setenv('BREVO_API_KEY','test-only')
    monkeypatch.setenv('BREVO_SENDER_EMAIL','sender@example.com')
    request = api.EstimateEmailRequest(cleaning_type='move_in',detail_type='apartment',area_range='20-30',recipient_email=' TEST@EXAMPLE.COM ')
    tasks = BackgroundTasks()
    api.email_estimate(request, tasks)
    assert len(tasks.tasks) == 2
    customer_task, admin_task = tasks.tasks
    assert customer_task.func is api.send_email_in_background
    message = customer_task.args[0]
    assert message['To'] == 'test@example.com'
    assert '300,000원' in message.get_content()
    assert admin_task.func is api.send_estimate_admin_notification
    assert admin_task.args[0] == 'test@example.com'
    # BackgroundTasks를 실행하지 않아 실제 이메일은 전송하지 않습니다.

@pytest.mark.parametrize('email', ['not-an-email','test@','test@example'])
def test_invalid_email_rejected(api, email):
    with pytest.raises(ValidationError):
        api.EstimateEmailRequest(cleaning_type='partial',detail_type='bathroom',recipient_email=email)
