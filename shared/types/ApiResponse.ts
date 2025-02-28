export interface DataListResponse<T> {
    data: T[];
    status: string;
    meta?: IMetaResponse;
  }
  
  export interface IMetaResponse {
    currentPage?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  }
  
  export const metaDataDefault: IMetaResponse = {
    currentPage: 1,
    pageSize: 10,
  };
  
  interface IFieldErrors {
    [fieldName: string]: string[]; 
  }
  
  export interface IDataResponse {
    message?: string | IFieldErrors;
    status?: string;
  }