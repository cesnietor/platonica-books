from typing import List, Optional

import strawberry


@strawberry.type
class BookInfoType:
    uuid: str
    title: str
    authors: Optional[List[str]] = None
    pub_date: Optional[str] = None
    page_count: Optional[int] = None
    thumbnail_url: Optional[str] = None
    small_thumbnail_url: Optional[str] = None
    google_books_id: Optional[str] = None


@strawberry.type
class ReviewInfoType:
    uuid: str
    text: str
    book: Optional[BookInfoType]
