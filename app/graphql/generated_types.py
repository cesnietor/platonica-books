import strawberry


@strawberry.type
class BookInfoType:
    uuid: str
    title: str
    authors: list[str] | None
    date_published: str | None
    date_started: str | None
    date_finished: str | None
    page_count: int | None
    thumbnail_url: str | None
    image_small_url: str | None
    image_medium_url: str | None
    google_books_id: str | None


@strawberry.input
class CreateReviewInput:
    book_uuid: str
    title: str


@strawberry.type
class ReviewInfoType:
    uuid: str
    title: str
    book: BookInfoType | None
    content: str | None


@strawberry.input
class UpdateReviewInput:
    uuid: str
    title: str
    content: str
