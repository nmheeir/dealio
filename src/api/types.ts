export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type BaseTimeStamp = {
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

// Generic pagination response
export type PaginationResponse<T> = {
  statusCode: number;
  message: string;
  data: PaginationData<T>;
};

export type PaginationData<T> = {
  data: T[];
  total: number;
  page: number;
  pageCount: number;
};
