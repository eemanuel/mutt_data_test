import pytest
from datetime import date, timedelta
from urllib.parse import urlencode

from django.urls import reverse
from rest_framework.test import APIClient

from crypto_values.constants import DAYS_PERIOD
from crypto_values.models import BitcoinDailyValues
from crypto_values.tests.factories import BitcoinDailyValuesFactory


@pytest.mark.django_db
class TestCryptoViewSet:
    @pytest.fixture(autouse=True)
    def set_up(self):
        self.client = APIClient()
        for num in range(DAYS_PERIOD + 5):
            BitcoinDailyValuesFactory(created=date.today() - timedelta(days=num))

    def _get_data(self, url, query_params=None):
        query_params_str = f"?{urlencode(query_params)}" if query_params else ""
        return self.client.get(f"{url}{query_params_str}", format="json")

    @pytest.mark.parametrize(
        "granularity",
        [
            "daily",
            "weekly",
            "monthly",
        ],
    )
    @pytest.mark.django_db
    @pytest.mark.success
    @pytest.mark.bitcoin
    def test_last_90_days_success(self, granularity):
        assert BitcoinDailyValues.objects.count() == 95

        url = reverse("crypto-views-last-90-days")
        query_params = {"crypto_id": "bitcoin", "granularity": granularity}
        response = self._get_data(url, query_params)

        assert response.status_code == 200
        data = response.json()

        for item in data:
            assert item["period"] is not None
            assert item["period_usd_avg"] is not None
            assert item["period_usd_avg_24h_vol"] is not None
            assert item["period_usd_avg_market_cap"] is not None
            assert item["period_ars_avg"] is not None
            assert item["period_ars_avg_24h_vol"] is not None
            assert item["period_ars_avg_market_cap"] is not None

    @pytest.mark.django_db
    @pytest.mark.error
    @pytest.mark.bitcoin
    def test_wrong_query_params(self):
        assert BitcoinDailyValues.objects.count() == 95

        url = reverse("crypto-views-last-90-days")
        query_params = {"crypto_id": "wrong_id", "granularity": "wrong"}
        response = self._get_data(url, query_params)

        assert response.status_code == 400
