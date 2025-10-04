from rest_framework.serializers import FloatField, Serializer
from django.conf import settings

from crypto_values.constants import CRYPTO_DECIMAL_SPACES


__all__ = (
    "CryptoSerializer",
)


class CurrencySerializer(Serializer):
    usd = FloatField()
    ars = FloatField()

    def validate(self, data):
        data["usd"] = round(data["usd"], CRYPTO_DECIMAL_SPACES)
        data["ars"] = round(data["ars"], CRYPTO_DECIMAL_SPACES)
        return super().validate(data)


class CryptoSerializer(Serializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for crypto_id in settings.COIN_IDS:
            setattr(self, crypto_id, CurrencySerializer())
