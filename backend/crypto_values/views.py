from django.db.models import Avg, DateField
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, Round
from datetime import timedelta, date
from django.conf import settings
from django.core.cache import cache

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from crypto_values.models import get_model_class
from crypto_values.constants import DAYS_PERIOD, CRYPTO_DECIMAL_SPACES
from crypto_values.utils import get_crypto_keys_from_cache


__all__ = ("CryptoViewSet",)


class CryptoViewSet(viewsets.ViewSet):
    GRANULARITY = ["daily", "weekly", "monthly"]
    permission_classes = (AllowAny,)

    @action(detail=False, methods=["get"])
    def lasts_values(self, request):
        data = self._get_last_data_from_cache()
        return Response(data)

    def _get_last_data_from_cache(self):
        last_key = cache.get("crypto_last_key")
        items = cache.get(last_key)
        data_2 = list()
        for item in items:
            date_time = item.pop("datetime")
            data_2.append(item | {"hour_requested": date_time.strftime("%H:%M")})
        return data_2

    @action(detail=False, methods=["get"])
    def today_values(self, request):
        data = list()
        for items in self._get_all_data_from_cache():
            for item in items:
                date_time = item.pop("datetime")
                data.append(item | {"hour_requested": date_time.strftime("%H:%M")})
        data.sort(key=lambda item: item["hour_requested"], reverse=True)
        return Response(data)

    def _get_all_data_from_cache(self):
        keys = get_crypto_keys_from_cache()
        return [cache.get(key) for key in keys]

    @action(detail=False, methods=["get"])
    def last_90_days(self, request):
        crypto_id = request.query_params.get("crypto_id")
        granularity = request.query_params.get("granularity", "daily")

        response_400 = self._validate_query_params(crypto_id, granularity)
        if response_400:
            return response_400

        data = self._get_granularized_queryset(crypto_id, granularity)
        return Response(list(data))

    def _validate_query_params(self, crypto_id, granularity):
        if crypto_id not in settings.COIN_IDS:
            return Response({"error": f"'crypto_id' must be in {settings.COIN_IDS}"}, status=400)

        if granularity not in self.GRANULARITY:
            return Response({"error": f"'granularity' must be in {self.GRANULARITY}"}, status=400)

    def _get_granularized_queryset(self, crypto_id, granularity):
        start_date = date.today() - timedelta(days=DAYS_PERIOD)

        model_class = get_model_class(crypto_id)
        queryset = model_class.objects.filter(created__gte=start_date)

        arguments = {"expression": "created", "output_field": DateField()}
        if granularity == "weekly":
            # annotate (for each week) dividing into periods like:
            # queryset.filter(created__gte="2025-09-22", created__lt="2025-09-29")
            queryset = queryset.annotate(period=TruncWeek(**arguments))
        elif granularity == "monthly":
            queryset = queryset.annotate(period=TruncMonth(**arguments))
        else:
            queryset = queryset.annotate(period=TruncDay(**arguments))

        queryset = (
            queryset.values("period")
            .annotate(
                period_usd_avg=Round(Avg("usd_avg_value", distinct=True), CRYPTO_DECIMAL_SPACES),
                period_usd_avg_market_cap=Round(Avg("usd_avg_market_cap", distinct=True), CRYPTO_DECIMAL_SPACES),
                period_usd_avg_24h_vol=Round(Avg("usd_avg_24h_vol", distinct=True), CRYPTO_DECIMAL_SPACES),
                period_ars_avg=Round(Avg("ars_avg_value", distinct=True), CRYPTO_DECIMAL_SPACES),
                period_ars_avg_market_cap=Round(Avg("ars_avg_market_cap", distinct=True), CRYPTO_DECIMAL_SPACES),
                period_ars_avg_24h_vol=Round(Avg("ars_avg_24h_vol", distinct=True), CRYPTO_DECIMAL_SPACES),
            )
            .order_by("-period")
        )

        return queryset
