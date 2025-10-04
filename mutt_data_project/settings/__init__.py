import os

environment = os.environ.get("ENVIRONMENT")
if environment == "local":
    from .local import *
elif environment == "testing":
    from .testing import *
