from typing import List, Optional

import strawberry


@strawberry.type
class BookInfoType:
    uuid: str
    title: str
    authors: Optional[List[str]] = None
    date_published: Optional[str] = None
    date_started: Optional[str] = None
    date_finished: Optional[str] = None
    page_count: Optional[int] = None
    thumbnail_url: Optional[str] = None
    small_thumbnail_url: Optional[str] = None
    image_small_url: Optional[str] = None
    image_medium_url: Optional[str] = None
    google_books_id: Optional[str] = None


@strawberry.type
class ReviewInfoType:
    uuid: str
    title: str
    text: str
    book: Optional[BookInfoType]
    content: Optional[str]


@strawberry.input
class UpdateReviewInput:
    uuid: str
    title: str
    content: str  # stringified JSON
