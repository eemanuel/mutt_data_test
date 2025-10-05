from datetime import timedelta, date
from django.db.models import FloatField, Index, Q

from crypto_values.constants import DAYS_PERIOD
from utils.models import TimeStampModel


__all__ = (
    "BitcoinDailyValues",
    "EthereumDailyValues",
    "get_model_class",
)


def _get_created_index(name):
    return Index(  # partial index
        fields=["created"],
        name=f"{name}_created_index",
        condition=Q(created__gte=date.today() - timedelta(days=DAYS_PERIOD)),
    )


class CryptoValuesBase(TimeStampModel):
    usd_max_value = FloatField(max_length=20)
    usd_min_value = FloatField(max_length=20)
    usd_avg_value = FloatField(max_length=20)

    ars_max_value = FloatField(max_length=20)
    ars_min_value = FloatField(max_length=20)
    ars_avg_value = FloatField(max_length=20)

    class Meta:
        abstract = True
        ordering = ["-created"]

    def __str__(self):
        return f"id={self.id} usd_avg_value={self.usd_avg_value}"


class BitcoinDailyValues(CryptoValuesBase):
    class Meta(CryptoValuesBase.Meta):
        db_table = "bitcoin_daily_values"
        indexes = [_get_created_index("bitcoin")]


class EthereumDailyValues(CryptoValuesBase):
    class Meta(CryptoValuesBase.Meta):
        db_table = "ethereum_daily_values"
        indexes = [_get_created_index("ethereum")]


def get_model_class(crypto_id):
    if crypto_id == "bitcoin":
        return BitcoinDailyValues
    elif crypto_id == "ethereum":
        return EthereumDailyValues
