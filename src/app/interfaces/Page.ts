export interface Page {
  content: [],
  pageable: {
      sort: {
          sorted: boolean,
          unsorted: boolean,
          empty: boolean
      },
      offset: number,
      pageNumber: number,
      pageSize: number,
      unpaged: boolean,
      paged: boolean
  },
  last: boolean,
  totalPages: number,
  totalElements: number,
  size: number,
  number: number,
  sort: {
      sorted: boolean,
      unsorted: boolean,
      empty: boolean
  },
  first: boolean,
  numberOfElements: number,
  empty: boolean
}

