import os

environment = os.environ.get("ENVIRONMENT")
if environment == "local":
    from mutt_data_project.settings.local import *
elif environment == "testing":
    from mutt_data_project.settings.testing import *
