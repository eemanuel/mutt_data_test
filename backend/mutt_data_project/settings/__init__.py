import os

environment = os.environ.get("ENVIRONMENT")
if environment == "local":
    from backend.mutt_data_project.settings.local import *
elif environment == "testing":
    from backend.mutt_data_project.settings.testing import *
