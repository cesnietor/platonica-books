from datetime import datetime, timedelta, timezone

import jwt
import pytest
from django.conf import settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from app.authentication import ACCESS_COOKIE, REFRESH_COOKIE

# Reusable credentials
USERNAME = "alice"
PASSWORD = "StrongPass!123"


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create_user(username=USERNAME, password=PASSWORD)


@pytest.fixture
def raw_login_response(api_client, user):
    """
    Calls the login endpoint, returning the full response so we can
    inspect its cookies.
    """
    return api_client.post(
        reverse("token_obtain_pair"),
        {"username": user.username, "password": PASSWORD},
    )


@pytest.fixture
def tokens(raw_login_response):
    """
    Extracts access & refresh tokens from the cookies set on login.
    """
    resp = raw_login_response
    assert resp.status_code == status.HTTP_200_OK
    # response.cookies is a SimpleCookie
    access = resp.cookies[ACCESS_COOKIE].value
    refresh = resp.cookies[REFRESH_COOKIE].value
    return access, refresh


@pytest.mark.parametrize(
    "username,password",
    [
        ("noone", "wrongpass"),
        (USERNAME, "badpass"),
    ],
)
@pytest.mark.django_db
def test_invalid_credentials_fail_obtain(api_client, username, password):
    resp = api_client.post(
        reverse("token_obtain_pair"),
        {
            "username": username,
            "password": password,
        },
    )
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    # no cookies should be set
    assert ACCESS_COOKIE not in resp.cookies
    assert REFRESH_COOKIE not in resp.cookies


@pytest.mark.django_db
def test_obtain_token_pair(raw_login_response):
    assert raw_login_response.status_code == status.HTTP_200_OK
    cookies = raw_login_response.cookies
    assert ACCESS_COOKIE in cookies, "access cookie missing"
    assert REFRESH_COOKIE in cookies, "refresh cookie missing"


@pytest.mark.django_db
def test_refresh_rotates_and_returns_new_pair(api_client, tokens):
    old_access, old_refresh = tokens

    # load the refresh token into the client's cookie jar
    api_client.cookies[REFRESH_COOKIE] = old_refresh

    # call the refresh endpoint (no body needed)
    resp = api_client.post(reverse("token_refresh"))

    assert resp.status_code == status.HTTP_200_OK

    # ensure both cookies were updated
    new_access = resp.cookies[ACCESS_COOKIE].value
    new_refresh = resp.cookies[REFRESH_COOKIE].value

    assert new_access != old_access, "access token was not rotated"
    assert new_refresh != old_refresh, "refresh token was not rotated"


@pytest.mark.django_db
def test_logout_revokes_refresh_and_prevents_further_refresh(api_client, tokens):
    access, refresh = tokens

    # set both cookies so logout can read them
    api_client.cookies[ACCESS_COOKIE] = access
    api_client.cookies[REFRESH_COOKIE] = refresh

    # perform logout
    resp = api_client.post(reverse("auth_logout"))
    assert resp.status_code == status.HTTP_205_RESET_CONTENT

    # the response should clear the cookies (max_age=0)
    cleared = resp.cookies
    assert ACCESS_COOKIE in cleared and cleared[ACCESS_COOKIE]["max-age"] == 0
    assert REFRESH_COOKIE in cleared and cleared[REFRESH_COOKIE]["max-age"] == 0

    # attempt to refresh again
    api_client.cookies.clear()  # no refresh cookie
    retry = api_client.post(reverse("token_refresh"))
    assert retry.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_refresh_with_invalid_token(api_client):
    api_client.cookies[REFRESH_COOKIE] = "not.a.valid.jwt"
    resp = api_client.post(reverse("token_refresh"))
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_refresh_with_expired_token(api_client, user):
    # Arrange: craft a refresh token that's already expired
    payload = {
        "token_type": "refresh",
        "user_id": user.id,
        "exp": datetime.now(timezone.utc) - timedelta(hours=1),
    }
    expired_token = jwt.encode(
        payload, settings.SECRET_KEY, algorithm=settings.SIMPLE_JWT["ALGORITHM"]
    )

    api_client.cookies[REFRESH_COOKIE] = expired_token
    response = api_client.post(reverse("token_refresh"))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
