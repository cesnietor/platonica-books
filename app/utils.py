from functools import lru_cache
from typing import List, Optional
from uuid import UUID

import requests

from app.models import Book, Review

from .dtos import BookInfo, ReviewInfo

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes/{volume_id}"


def get_reviews() -> Optional[List[ReviewInfo]]:
    reviews_info: List[ReviewInfo] = []

    objs = Review.objects.all()

    for obj in objs:
        info = get_data_for_review(obj)
        reviews_info.append(info)
    return reviews_info


def get_data_for_review(review: Optional[Review]) -> Optional[ReviewInfo]:
    book = get_data_for_book(review.book)
    return ReviewInfo(uuid=review.uuid, text=review.text, book=book)


def get_data_for_book(book: Optional[Book]) -> Optional[BookInfo]:
    if book is None:
        return None

    default_info = BookInfo(
        uuid=book.uuid,
        title=book.name,
    )

    if book.google_books_id is not None:
        data = fetch_book_data(
            uuid=book.uuid,
            volume_id=book.google_books_id,
        )
        if data is not None:
            return data

    return default_info


def get_review_info(uuid: UUID) -> Optional[ReviewInfo]:
    obj = get_review_from_db(uuid)
    if obj is None:
        return None
    return get_data_for_review(obj)


def get_review_from_db(uuid: UUID) -> Optional[Review]:
    try:
        return Review.objects.get(uuid=uuid)
    except Review.DoesNotExist:
        return None


def get_book_info(uuid: UUID) -> Optional[BookInfo]:
    """Returns Book info from Book repository else returns fallback using db info"""
    obj = get_book_from_db(uuid)
    if obj is None:
        return None

    return get_data_for_book(obj)


def get_book_from_db(uuid: UUID) -> Optional[Book]:
    try:
        return Book.objects.get(uuid=uuid)
    except Book.DoesNotExist:
        return None


@lru_cache(maxsize=1024)
def fetch_book_data(uuid: UUID, volume_id: str) -> Optional[BookInfo]:
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
        uuid=uuid,
        google_books_id=volume_id,
        title=volume_info.get("title", "Untitled"),
        authors=volume_info.get("authors"),
        pub_date=volume_info.get("publishedDate"),
        page_count=volume_info.get("pageCount"),
        thumbnail_url=image_links.get("thumbnail"),
        small_thumbnail_url=image_links.get("smallThumbnail"),
    )
