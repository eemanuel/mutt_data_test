from crypto_values import views

from rest_framework import routers


router = routers.SimpleRouter()
router.register("", views.CryptoViewSet, basename="crypto-views")

urlpatterns = router.urls
