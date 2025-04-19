from typing import List, Optional
from uuid import UUID

import strawberry

from app.graphql.types import BookInfoType, ReviewInfoType
from app.utils import get_book_info, get_review_info, get_reviews


@strawberry.type
class Query:
    @strawberry.field
    def reviews(self) -> List[ReviewInfoType]:
        return get_reviews()

    @strawberry.field
    def review(self, uuid: UUID) -> Optional[ReviewInfoType]:
        info = get_review_info(uuid)
        if info is not None:
            return ReviewInfoType(
                uuid=info.uuid,
                title=info.title,
                text=info.text,
                book=info.book,
            )

    @strawberry.field
    def book(self, uuid: UUID) -> Optional[BookInfoType]:
        # Fetch data from your data source
        info = get_book_info(uuid)
        if info is not None:
            return BookInfoType(
                uuid=info.uuid,
                title=info.title,
                authors=info.authors,
                date_published=info.date_published,
                page_count=info.page_count,
                thumbnail_url=info.thumbnail_url,
                small_thumbnail_url=info.small_thumbnail_url,
                image_small_url=info.image_small_url,
                image_medium_url=info.image_medium_url,
                google_books_id=info.google_books_id,
            )
        return None


schema = strawberry.Schema(query=Query)
