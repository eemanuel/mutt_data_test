from django.db.models import DateField, Model


class TimeStampModel(Model):
    created = DateField(auto_now_add=True, null=False)

    class Meta:
        abstract = True
