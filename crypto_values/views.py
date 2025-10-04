from django.db.models import Avg, DateField
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, Round
from datetime import timedelta, date
from django.conf import settings

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from crypto_values.models import get_model_class
from crypto_values.constants import DAYS_PERIOD, CRYPTO_DECIMAL_SPACES


__all__ = (
    "CryptoViewSet",
)


class CryptoViewSet(viewsets.ViewSet):
    GRANULARITY = ["daily", "weekly", "monthly"]
    permission_classes = (
        AllowAny,
    )

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

        arguments = {"expression": 'created', "output_field": DateField()}
        if granularity == "weekly":
            # annotate (for each week) dividing into periods like:
            # queryset.filter(created__gte="2025-09-22", created__lt="2025-09-29")
            queryset = queryset.annotate(period=TruncWeek(**arguments))
        elif granularity == "monthly":
            queryset = queryset.annotate(period=TruncMonth(**arguments))
        else:
            queryset = queryset.annotate(period=TruncDay(**arguments))

        queryset = queryset.values("period").annotate(
            period_usd_avg=Round(Avg("usd_avg_value", distinct=True), CRYPTO_DECIMAL_SPACES),
            period_avg_ars=Round(Avg("ars_avg_value", distinct=True), CRYPTO_DECIMAL_SPACES),
        ).order_by("-period")

        return queryset
