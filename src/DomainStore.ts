export interface PageInfo {
  currentPage?: number
  pageSize?: number
  totalCount?: number
  isLastPage?: boolean
}

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

export default interface DomainStore<E extends Entity=Entity> {
  currentItem: E;
  allList: E[];
  pageList: E[];
  pageInfo: PageInfo;
}
