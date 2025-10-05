from datetime import datetime

from django.conf import settings
from django.core.cache import cache

from crypto_values.constants import CRYPTO_DECIMAL_SPACES
from crypto_values.models import get_model_class
from crypto_values.serializers import CryptoSerializer
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
    )

    serializer = CryptoSerializer(data=response.json())
    if serializer.is_valid():
        data = serializer.validated_data
    else:
        data = {"errors": serializer.errors}

    timestamp = datetime.now().strftime("%Y_%m_%d_%H_%M")
    cache.set(f"crypto_values_{timestamp}", data, timeout=WHOLE_DAY_IN_SECS)
    cache.set("crypto_values_last_key", f"crypto_values_{timestamp}", timeout=WHOLE_DAY_IN_SECS)

    keys_amount = cache.get("crypto_values_keys_amount", 0)
    cache.set("crypto_values_keys_amount", keys_amount + 1, timeout=WHOLE_DAY_IN_SECS)

    if settings.DEBUG:
        print(f"ADDED TO CACHE: {{crypto_values_{timestamp}: {data}}}")


@celery_app.task(name="crypto_values.tasks.save_daily_crypto_values")
def save_daily_crypto_values():
    keys = cache.keys("crypto_values*")

    all_daily_values = dict()
    for key in keys:
        crypto_values = cache.get(key, dict())
        for crypto_id in settings.COIN_IDS:
            # crypto_values: {"usd": 123, "ars": 345}
            if crypto_id in all_daily_values:
                all_daily_values[crypto_id]["usd"].append(crypto_values[crypto_id]["usd"])
                all_daily_values[crypto_id]["ars"].append(crypto_values[crypto_id]["ars"])
            else:
                all_daily_values[crypto_id] = {"usd": list(), "ars": list()}

    for crypto_id in settings.COIN_IDS:
        usd = all_daily_values[crypto_id]["usd"]
        ars = all_daily_values[crypto_id]["ars"]

        model_class = get_model_class(crypto_id)
        model_class.objects.create(
            usd_max_value=max(usd),
            usd_min_value=min(usd),
            usd_avg_value=round(sum(usd) / len(usd), CRYPTO_DECIMAL_SPACES),
            ars_max_value=max(ars),
            ars_min_value=min(ars),
            ars_avg_value=round(sum(ars) / len(ars), CRYPTO_DECIMAL_SPACES),
        )

    cache.clear()


@celery_app.task(name="crypto_values.tasks.print_info")
def print_info():
    keys_amount = cache.get("crypto_values_keys_amount")
    print(f"#{keys_amount} keys in the cache")
