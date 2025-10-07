import factory
from datetime import date
from random import uniform

from crypto_values.constants import CRYPTO_DECIMAL_SPACES
from crypto_values.models import BitcoinDailyValues, EthereumDailyValues


__all__ = (
    "BitcoinDailyValuesFactory",
    "EthereumDailyValuesFactory",
)


ARS_VALUE = 1500


def _get_ars_max_value(obj):
    ars_avg_value = obj.usd_avg_value * ARS_VALUE
    return round(uniform(ars_avg_value + 1, ars_avg_value + 10), 2)


def _get_ars_min_value(obj):
    ars_avg_value = obj.usd_avg_value * ARS_VALUE
    return round(uniform(ars_avg_value - 10, ars_avg_value - 1), 2)


class DailyValuesFactoryBase(factory.django.DjangoModelFactory):
    usd_avg_value = factory.Faker(
        "pyfloat", positive=True, right_digits=CRYPTO_DECIMAL_SPACES, min_value=10_000, max_value=50_000
    )
    usd_max_value = factory.LazyAttribute(lambda obj: round(uniform(obj.usd_avg_value + 1, obj.usd_avg_value + 10), 2))
    usd_min_value = factory.LazyAttribute(lambda obj: round(uniform(obj.usd_avg_value - 10, obj.usd_avg_value - 1), 2))

    ars_avg_value = factory.LazyAttribute(lambda obj: round(obj.usd_avg_value * ARS_VALUE, 2))
    ars_max_value = factory.LazyAttribute(_get_ars_max_value)
    ars_min_value = factory.LazyAttribute(_get_ars_min_value)

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        daily_values = super()._create(model_class, *args, **kwargs)

        if kwargs.get("created"):
            # allow create a daily_values with a specific "created" datetime
            daily_values.created = (
                kwargs["created"]
                if isinstance(kwargs["created"], date)
                else date.strptime(kwargs["created"], "%Y-%m-%d")
            )
            daily_values.save(update_fields=["created"])

        return daily_values


class BitcoinDailyValuesFactory(DailyValuesFactoryBase):
    class Meta:
        model = BitcoinDailyValues


class EthereumDailyValuesFactory(DailyValuesFactoryBase):
    class Meta:
        model = EthereumDailyValues
