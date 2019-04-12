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

export default interface DomainStore {
  currentItem: Entity;
  allList: Entity[];
  pageList: Entity[];
  pageInfo: PageInfo;
}
