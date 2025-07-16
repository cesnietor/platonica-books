import json
from typing import List, Optional
from uuid import UUID

import strawberry

from app.graphql.types import BookInfoType, ReviewInfoType, UpdateReviewInput
from app.utils import (
    get_book_info,
    get_data_for_review,
    get_review_from_db,
    get_review_info,
    get_reviews,
)


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
                content=info.content,
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


@strawberry.type
class Mutation:
    @strawberry.mutation
    def update_review(self, input: UpdateReviewInput) -> ReviewInfoType:
        try:
            parsed_content = json.loads(input.content)
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON string in 'content'")

        # Save to DB as real JSON
        review = get_review_from_db(uuid=input.uuid)
        if review is None:
            print(f"[ERROR] Book not found '{input.uuid}'")
            return None

        review.content = parsed_content
        review.save()

        # TODO: might want just to return and make the UI refresh
        reviewInfo = get_data_for_review(review)

        return ReviewInfoType(
            uuid=reviewInfo.uuid,
            title=reviewInfo.title,
            text=reviewInfo.text,
            book=reviewInfo.book,
            content=reviewInfo.content,
        )


schema = strawberry.Schema(query=Query, mutation=Mutation)
