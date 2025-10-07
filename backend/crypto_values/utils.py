from django.core.cache import cache


__all__ = ("get_crypto_keys_from_cache",)


def get_crypto_keys_from_cache():
    keys = cache.keys("crypto_values_*")
    keys.sort(reverse=True)
    return keys
