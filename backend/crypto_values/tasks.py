from datetime import datetime

from django.conf import settings
from django.core.cache import cache

from crypto_values.constants import CRYPTO_DECIMAL_SPACES
from crypto_values.models import get_model_class
from crypto_values.serializers import CryptoSerializer
from crypto_values.utils import get_crypto_keys_from_cache
from utils.celery_app import celery_app
from utils.requester import CryptoRequester


__all__ = (
    "obtain_crypto_values",
    "save_daily_crypto_values",
)


COIN_IDS = ",".join(settings.COIN_IDS)
WHOLE_DAY_IN_SECS = 86_400  # 86_400 secs == 1 day


@celery_app.task(name="crypto_values.tasks.obtain_crypto_values")
def obtain_crypto_values():
    requester = CryptoRequester()
    response = requester.send_request(
        f"/simple/price/?ids={COIN_IDS}&vs_currencies=usd,ars&precision={CRYPTO_DECIMAL_SPACES}"
        "&include_market_cap=true&include_24hr_vol=true"
    )

    serializer = CryptoSerializer(data=response.json())
    now = datetime.now()
    if serializer.is_valid():
        data = [value | {"crypto_id": key, "datetime": now} for key, value in serializer.validated_data.items()]
    else:
        data = {"errors": serializer.errors, "datetime": now}

    timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M")
    cache_key = f"crypto_values_{timestamp}"
    cache.set(cache_key, data, timeout=WHOLE_DAY_IN_SECS)
    cache.set("crypto_last_key", cache_key, timeout=WHOLE_DAY_IN_SECS)

    keys_amount = cache.get("crypto_keys_amount", 0)
    cache.set("crypto_keys_amount", keys_amount + 1, timeout=WHOLE_DAY_IN_SECS)

    if settings.DEBUG:
        print(f"ADDED TO CACHE: {{'{cache_key}': {data}}}")


ALL_KEYS = (
    "usd",
    "usd_market_cap",
    "usd_24h_vol",
    "ars",
    "ars_market_cap",
    "ars_24h_vol",
)


@celery_app.task(name="crypto_values.tasks.save_daily_crypto_values")
def save_daily_crypto_values():
    keys = get_crypto_keys_from_cache()

    all_daily_values = dict()  # usefull to calculate averages
    for key in keys:
        items = cache.get(key, dict())
        for item in items:
            crypto_id = item["crypto_id"]
            if crypto_id in all_daily_values:
                for key_2 in ALL_KEYS:
                    all_daily_values[crypto_id][key_2].append(item[key_2])
            else:
                all_daily_values[crypto_id] = {key_2: [item[key_2]] for key_2 in ALL_KEYS}

    for crypto_id in settings.COIN_IDS:
        data = all_daily_values[crypto_id]
        model_class = get_model_class(crypto_id)
        model_class.objects.create(
            usd_max_value=max(data["usd"]),
            usd_min_value=min(data["usd"]),
            usd_avg_value=round(sum(data["usd"]) / len(data["usd"]), CRYPTO_DECIMAL_SPACES),
            usd_avg_market_cap=round(sum(data["usd_market_cap"]) / len(data["usd_market_cap"]), CRYPTO_DECIMAL_SPACES),
            usd_avg_24h_vol=round(sum(data["usd_24h_vol"]) / len(data["usd_24h_vol"]), CRYPTO_DECIMAL_SPACES),
            ars_max_value=max(data["ars"]),
            ars_min_value=min(data["ars"]),
            ars_avg_value=round(sum(data["ars"]) / len(data["ars"]), CRYPTO_DECIMAL_SPACES),
            ars_avg_market_cap=round(sum(data["ars_market_cap"]) / len(data["ars_market_cap"]), CRYPTO_DECIMAL_SPACES),
            ars_avg_24h_vol=round(sum(data["ars_24h_vol"]) / len(data["ars_24h_vol"]), CRYPTO_DECIMAL_SPACES),
        )
    cache.clear()


@celery_app.task(name="crypto_values.tasks.print_info")
def print_info():
    keys_amount = cache.get("crypto_keys_amount")
    keys_amount = keys_amount if keys_amount is not None else 0
    print(f"#{keys_amount} keys in the cache")
