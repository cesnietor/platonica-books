from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView

from . import views
from .graphql.schema import schema

urlpatterns = [
    path("", views.index, name="index"),
    # FOR PRODUCTION handle CSRF tokens properly and remove exemption
    path("graphql", csrf_exempt(GraphQLView.as_view(schema=schema)), name="graphql"),
]
