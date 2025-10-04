from celery import Celery


__all__ = (
    "celery_app",
)

# Initial Celery app configuration
celery_app = Celery("Celery Mutt Data")
celery_app.config_from_object("django.conf:settings", namespace="CELERY")
celery_app.autodiscover_tasks()
