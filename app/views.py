from datetime import timedelta

from django.http import HttpResponse, JsonResponse
from rest_framework import permissions, status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from strawberry.django.views import GraphQLView

from app.authentication import ACCESS_COOKIE, REFRESH_COOKIE, CookieJWTAuthentication
from project import settings


class JWTProtectedGraphQLView(GraphQLView):
    def dispatch(self, request, *args, **kwargs):
        try:
            auth_res = CookieJWTAuthentication().authenticate(request)
            if auth_res is None:
                raise AuthenticationFailed(
                    "Authentication credentials were not provided"
                )
            request.user, request.auth = auth_res
        except AuthenticationFailed as e:
            return JsonResponse({"errors": [{"message": str(e)}]}, status=401)
        return super().dispatch(request, *args, **kwargs)


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/token/
    Response sets two HttpOnly cookies: access & refresh
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        # call the built‑in method from TokenObtainPairView to validate credentials
        response = super().post(request, *args, **kwargs)
        if response.status_code != status.HTTP_200_OK:
            return response

        # response as:
        #     {
        #     "refresh": "<string>",
        #     "access": "<string>"
        # }
        tokens = response.data
        access_token = tokens["access"]
        refresh_token = tokens["refresh"]

        # Build a new response (drop tokens from body if you like)
        data = {"detail": "Login successful"}
        cookie_resp = Response(data, status=status.HTTP_200_OK)

        # Set the cookies
        _set_access_cookie(http_response=cookie_resp, value=access_token)
        _set_refresh_cookie(http_response=cookie_resp, value=refresh_token)
        return cookie_resp


class CookieTokenRefreshView(TokenRefreshView):
    """
    POST /api/token/refresh/
    Reads refresh cookie, rotates tokens in cookies
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        # Inject the cookie into request.data for DRF to pick it up
        request.data["refresh"] = request.COOKIES.get(REFRESH_COOKIE, "")

        response = super().post(request, *args, **kwargs)
        if response.status_code != status.HTTP_200_OK:
            return response

        tokens = response.data
        new_access = tokens["access"]
        new_refresh = tokens["refresh"]

        data = {"detail": "Token refreshed"}
        cookie_resp = Response(data, status=status.HTTP_200_OK)

        _set_access_cookie(http_response=cookie_resp, value=new_access)
        _set_refresh_cookie(http_response=cookie_resp, value=new_refresh)
        return cookie_resp


def _set_access_cookie(http_response: Response, value: str):
    http_response.set_cookie(
        key=ACCESS_COOKIE,
        value=value,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=_cookie_expiry(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]),
    )


def _set_refresh_cookie(http_response: Response, value: str):
    http_response.set_cookie(
        key=REFRESH_COOKIE,
        value=value,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=_cookie_expiry(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]),
    )


def _cookie_expiry(delta: timedelta) -> int:
    """Return max_age in seconds for a timedelta"""
    return int(delta.total_seconds())


class LogoutAndBlacklistView(APIView):
    """
    POST /api/logout/
    Reads refresh cookie, invalidates it, stores in blacklist and deletes cookies
    """

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        refresh_token = request.COOKIES.get(REFRESH_COOKIE, None)
        if not refresh_token:
            return Response(
                {"detail": "No refresh token provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass  # malformed or already expired; ignore

        # clear cookies
        resp = Response({"detail": "Logged out"}, status=status.HTTP_205_RESET_CONTENT)
        resp.delete_cookie(ACCESS_COOKIE)
        resp.delete_cookie(REFRESH_COOKIE)
        return resp


def index(request):
    return HttpResponse("Hello, world. You're at the apps index.")
