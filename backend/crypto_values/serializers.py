from rest_framework.serializers import FloatField, Serializer

from crypto_values.constants import CRYPTO_DECIMAL_SPACES


__all__ = ("CryptoSerializer",)


class CurrencySerializer(Serializer):
    usd = FloatField(required=True)
    ars = FloatField(required=True)

    def validate(self, data):
        data["usd"] = round(data["usd"], CRYPTO_DECIMAL_SPACES)
        data["ars"] = round(data["ars"], CRYPTO_DECIMAL_SPACES)
        return super().validate(data)


class CryptoSerializer(Serializer):
    bitcoin = CurrencySerializer(required=True)
    ethereum = CurrencySerializer(required=True)
