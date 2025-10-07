from rest_framework.serializers import FloatField, Serializer

from crypto_values.constants import CRYPTO_DECIMAL_SPACES


__all__ = ("CryptoSerializer",)


class CurrencySerializer(Serializer):
    usd = FloatField(required=True)
    usd_market_cap = FloatField(required=True)
    usd_24h_vol = FloatField(required=True)

    ars = FloatField(required=True)
    ars_market_cap = FloatField(required=True)
    ars_24h_vol = FloatField(required=True)

    def validate(self, data):
        data["usd"] = round(data["usd"], CRYPTO_DECIMAL_SPACES)
        data["usd_market_cap"] = round(data["usd_market_cap"], CRYPTO_DECIMAL_SPACES)
        data["usd_24h_vol"] = round(data["usd_24h_vol"], CRYPTO_DECIMAL_SPACES)

        data["ars"] = round(data["ars"], CRYPTO_DECIMAL_SPACES)
        data["ars_market_cap"] = round(data["ars_market_cap"], CRYPTO_DECIMAL_SPACES)
        data["ars_24h_vol"] = round(data["ars_24h_vol"], CRYPTO_DECIMAL_SPACES)
        return super().validate(data)


class CryptoSerializer(Serializer):
    bitcoin = CurrencySerializer(required=True)
    ethereum = CurrencySerializer(required=True)
