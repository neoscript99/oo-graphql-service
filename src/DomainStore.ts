export interface PageInfo {
  currentPage: number
  pageSize: number
  totalCount?: number
  isLastPage?: boolean
}

export const DEFAULT_PAGE_INFO = { currentPage: 1, totalCount: -1, isLastPage: false, pageSize: 10 }

export interface FieldError {
  field?: String
  message?: String
}

export interface Entity {
  id?: string
  lastUpdated?: Date
  dateCreated?: Date
  version?: number
  errors?: FieldError[]

  [key: string]: any
}

export interface DomainStore {
  currentItem: Entity;
  allList: Entity[];
  pageList: Entity[];
  pageInfo: PageInfo;
}
