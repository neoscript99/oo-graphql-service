export interface PageInfo {
  currentPage?: number
  pageSize?: number
  totalCount?: number
  isLastPage?: boolean
}

export interface Domain {
  id?: string
  lastUpdated?: Date
  dateCreated?: Date
  version?: number

  [key: string]: any
}

export default interface DomainStore {
  currentItem: Domain;
  allList: Array<Domain>;
  pageList: Array<Domain>;
  pageInfo: PageInfo;
}
