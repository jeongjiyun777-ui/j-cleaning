from locust import HttpUser, between, task


class CleaningUser(HttpUser):
    host = "https://j-cleaning-api.onrender.com"

    wait_time = between(1, 3)

    @task
    def calculate_estimate(self):
        self.client.get(
            "/estimate",
            params={
                "cleaning_type": "move_in",
                "detail_type": "apartment",
                "area_range": "10-20",
            },
            name="GET /estimate (입주·아파트·10~20평)",
            timeout=60,
        )
