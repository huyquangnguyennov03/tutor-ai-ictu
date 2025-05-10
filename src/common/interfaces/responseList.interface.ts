export interface MetaDataList {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy?: [string, string][];
}

export interface ResponseList {
  data: any;
  meta: MetaDataList;
  links: {
    first?: string,
    previous?: string
    current: string;
    next?: string;
    last?: string;
  };
}
