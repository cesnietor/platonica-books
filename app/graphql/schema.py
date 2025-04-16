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
        review_data = get_review_info(uuid)
        if review_data is not None:
            return ReviewInfoType(
                uuid=review_data.uuid,
                text=review_data.text,
                book=review_data.book,
            )

    @strawberry.field
    def book(self, uuid: UUID) -> Optional[BookInfoType]:
        # Fetch data from your data source
        book_data = get_book_info(uuid)
        if book_data is not None:
            return BookInfoType(
                uuid=book_data.uuid,
                title=book_data.title,
                authors=book_data.authors,
                pub_date=book_data.pub_date,
                page_count=book_data.page_count,
                thumbnail_url=book_data.thumbnail_url,
                small_thumbnail_url=book_data.small_thumbnail_url,
                google_books_id=book_data.google_books_id,
            )
        return None


schema = strawberry.Schema(query=Query)
