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
