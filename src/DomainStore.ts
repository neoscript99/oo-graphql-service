export declare type PageInfo = {
  currentPage?: number
  pageSize?: number
  totalCount?: number
  isLastPage?: boolean
}

export default interface DomainStore {
  currentItem: any;
  allList: Array<any>;
  pageList: Array<any>;
  pageInfo: PageInfo;
}
