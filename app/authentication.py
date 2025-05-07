from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken

# cookie names
ACCESS_COOKIE = "access"
REFRESH_COOKIE = "refresh"


class CookieJWTAuthentication(JWTAuthentication):
    """
    Uses "access" cookie to to authenticate
    """

    def authenticate(self, request: Request):
        raw_token = request.COOKIES.get(ACCESS_COOKIE)
        if not raw_token:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except (InvalidToken, AuthenticationFailed):
            return None
