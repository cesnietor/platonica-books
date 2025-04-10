from typing import List

import strawberry
import strawberry_django
from strawberry import auto

from .models import Book


@strawberry_django.type(Book)
class BookType:
    id: auto
    name: auto
    pub_date: auto


@strawberry.type
class Query:
    books: List[BookType] = strawberry_django.field()


schema = strawberry.Schema(query=Query)
