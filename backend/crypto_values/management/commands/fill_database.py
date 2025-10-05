from datetime import date, timedelta

from django.core.management.base import BaseCommand

from crypto_values.constants import DAYS_PERIOD
from crypto_values.factories import BitcoinDailyValuesFactory


class Command(BaseCommand):
    help = "Fill BitcoinDailyValues with fake daily data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--since-days-ago",
            type=int,
            default=100,
            help="Generate data since this created date.",
        )

    def handle(self, *args, **options):
        for num in range(options["since_days_ago"]):
            BitcoinDailyValuesFactory(created=date.today() - timedelta(days=num))
