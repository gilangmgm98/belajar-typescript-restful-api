export type Paging = {
    current_page: number,
    total_pages: number,
    size: number
}

export type Pageable<T> = {
    data: Array<T>,
    paging: Paging
}