from abc import ABC, abstractmethod
from urllib3.util.retry import Retry

from requests import get, Session
from requests.adapters import HTTPAdapter

from django.conf import settings


__all__ = (
    "CryptoRequester",
)


class RequesterBase(ABC):
    URL_BASE = ""
    TIMEOUT = 3  # seconds
    MAX_RETRIES = 3  # retry MAX_RETRIES times in case of requests.exceptions.ConnectionError
    _instance = None

    @classmethod
    def __new__(cls, *args, **kwargs):  # This converts the class in a singleton.
        if isinstance(cls._instance, cls):
            return cls._instance
        cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        session = Session()
        retry = Retry(connect=self.MAX_RETRIES, backoff_factor=1)
        http_adapter = HTTPAdapter(max_retries=retry)
        session.mount("http://", http_adapter)
        session.mount("https://", http_adapter)
        self.session = session

    @abstractmethod
    def send_request(self, method, url_path, data):
        """
        Must return a response
        """
        pass


class CryptoRequester(RequesterBase):
    URL_BASE = settings.COINGECKO_ROOT_URL
    TIMEOUT = 15  # seconds
    MAX_RETRIES = 3  # retry MAX_RETRIES times in case of requests.exceptions.ConnectionError
    _instance = None

    def send_request(self, url_path):
        response = get(
            self.URL_BASE + url_path, timeout=self.TIMEOUT,
            headers={"x-cg-demo-api-key": settings.COINGECKO_API_KEY},
        )
        response.raise_for_status()  # raise HTTPError if response.status_code != 200
        return response

    def __repr__(self):
        return "<CryptoRequester>"




