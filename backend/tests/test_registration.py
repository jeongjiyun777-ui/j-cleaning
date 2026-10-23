from datetime import datetime
from unittest.mock import MagicMock
import pytest
from fastapi import BackgroundTasks, HTTPException

def payload(api):
    return api.Register(name='테스트',username=' TEST@EXAMPLE.COM ',password='Example123!',birth_date='2000-01-01',phone='01012345678')

@pytest.fixture
def connection(api, monkeypatch):
    connection = MagicMock()
    engine = MagicMock()
    engine.begin.return_value.__enter__.return_value = connection
    monkeypatch.setattr(api,'engine',engine)
    return connection

@pytest.mark.parametrize('username_exists,phone_exists', [(True,False),(False,True)])
def test_duplicate_registration_does_not_insert_or_send_mail(api, connection, username_exists, phone_exists):
    connection.execute.return_value.mappings.return_value.one.return_value = {'username_exists':username_exists,'phone_exists':phone_exists}
    tasks = BackgroundTasks()
    with pytest.raises(HTTPException) as caught:
        api.register_customer(payload(api),tasks)
    assert caught.value.status_code == 409
    assert connection.execute.call_count == 1
    assert tasks.tasks == []

def test_registration_hashes_password_and_schedules_mail_after_insert(api, connection):
    duplicate, inserted = MagicMock(), MagicMock()
    duplicate.mappings.return_value.one.return_value = {'username_exists':False,'phone_exists':False}
    inserted.mappings.return_value.one.return_value = {'id':9,'name':'테스트','username':'test@example.com','created_at':datetime(2026,1,1)}
    connection.execute.side_effect = [duplicate,inserted]
    tasks = BackgroundTasks()
    api.register_customer(payload(api),tasks)
    params = connection.execute.call_args_list[1].args[1]
    assert params['username'] == 'test@example.com'
    assert params['password_hash'] != 'Example123!'
    assert api.password_hasher.verify('Example123!',params['password_hash'])
    assert len(tasks.tasks) == 1
    assert tasks.tasks[0].func is api.send_registration_emails
    assert tasks.tasks[0].args[1] == 'test@example.com'
