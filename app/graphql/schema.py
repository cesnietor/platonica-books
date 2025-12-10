import json
from typing import List, Optional
from uuid import UUID

import strawberry

from app.graphql.generated_types import (
    BookInfoType,
    CreateReviewInput,
    ReviewInfoType,
    UpdateReviewInput,
)
from app.utils import (
    create_review,
    get_book_info,
    get_data_for_review,
    get_review_from_db,
    get_review_info,
    get_reviews,
)


# Queries and Mutations manually defined here
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
                content=info.content,
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
                date_started=info.date_started,
                date_finished=info.date_finished,
                date_published=info.date_published,
                page_count=info.page_count,
                thumbnail_url=info.thumbnail_url,
                image_small_url=info.image_small_url,
                image_medium_url=info.image_medium_url,
                google_books_id=info.google_books_id,
            )
        return None


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_review(self, input: CreateReviewInput) -> ReviewInfoType:
        created = create_review(book_uuid=input.book_uuid, title=input.title)
        if created is None:
            print(
                f"""
                [ERROR] Review not created for book_uuid: 
                '{input.book_uuid}', title: '{input.title}'
                """
            )
            return None
        return created

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

        reviewInfo = get_data_for_review(review)
        return ReviewInfoType(
            uuid=reviewInfo.uuid,
            title=reviewInfo.title,
            content=reviewInfo.content,
            book=reviewInfo.book,
        )


schema = strawberry.Schema(query=Query, mutation=Mutation)
