export interface IPagination {
  page: number;
  size: number;
  totalCount: number;
  lastPage: number;

  searchQuery: string
  type: string;
  name: string;
  privacy: string;

  // this allows me to use bracket notion on the query object
  [key: string]: string | undefined | number | boolean
}
