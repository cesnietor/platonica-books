from typing import List

import strawberry
import requests
import strawberry_django
from strawberry import auto
from dataclasses import dataclass

from .models import Book

from typing import Optional

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes/{volume_id}"


@strawberry_django.type(Book)
class BookType:
    id: auto
    name: auto
    pub_date: auto

    @strawberry_django.field
    def image_url(self, info) -> str:
        bookItem = Book.objects.get(pk=self.id)
        if bookItem.google_books_id is not None:
            data = fetch_book_data(bookItem.google_books_id)
            return data.thumbnail_url
        return ""


@strawberry.type
class Query:
    books: List[BookType] = strawberry_django.field()


schema = strawberry.Schema(query=Query)


# FIXME: refactor this, move to its own file
@dataclass
class BookInfo:
    id: str
    title: str
    thumbnail_url: Optional[str] = None
    small_thumbnail_url: Optional[str] = None


def fetch_book_data(volume_id: str) -> Optional[BookInfo]:
    """Fetches book metadata from Google Books API and returns selected fields."""
    try:
        response = requests.get(GOOGLE_BOOKS_API_URL.format(volume_id=volume_id))
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"[ERROR] Failed to fetch book '{volume_id}': {e}")
        return None

    data = response.json()
    volume_info = data.get("volumeInfo", {})
    image_links = volume_info.get("imageLinks", {})

    return BookInfo(
        id=volume_id,
        title=volume_info.get("title", "Untitled"),
        thumbnail_url=image_links.get("thumbnail"),
        small_thumbnail_url=image_links.get("smallThumbnail"),
    )
