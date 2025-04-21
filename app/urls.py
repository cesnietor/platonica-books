from django.urls import path, re_path
from django.views.decorators.csrf import csrf_exempt

from . import views
from .graphql.schema import schema
from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    JWTProtectedGraphQLView,
    LogoutAndBlacklistView,
)

urlpatterns = [
    path("", views.index, name="index"),
    re_path(
        r"^api/token/?$",
        csrf_exempt(CookieTokenObtainPairView.as_view()),
        name="token_obtain_pair",
    ),
    re_path(
        r"^api/token/refresh/?$",
        csrf_exempt(CookieTokenRefreshView.as_view()),
        name="token_refresh",
    ),
    re_path(
        "^api/logout/?$",
        csrf_exempt(LogoutAndBlacklistView.as_view()),
        name="auth_logout",
    ),
    # FIXME: FOR PRODUCTION handle CSRF tokens properly and remove exemption
    re_path(
        r"^graphql/?$",
        csrf_exempt(JWTProtectedGraphQLView.as_view(schema=schema, graphiql=True)),
        name="graphql",
    ),
]
