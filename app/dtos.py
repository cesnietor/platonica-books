from dataclasses import dataclass
from typing import List, Optional


@dataclass
class BookInfo:
    uuid: str
    title: str
    authors: Optional[List[str]] = None
    pub_date: Optional[str] = None
    page_count: Optional[int] = None
    thumbnail_url: Optional[str] = None
    small_thumbnail_url: Optional[str] = None
    image_small_url: Optional[str] = None
    image_medium_url: Optional[str] = None
    google_books_id: Optional[str] = None


@dataclass
class ReviewInfo:
    uuid: str
    text: str
    book: Optional[BookInfo]
