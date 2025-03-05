import { DataListResponse } from "@/shared/types/ApiResponse";
import { axiosInstance } from "@/shared/utils/ApiUtils";

const apiUrl = "permissions";

export interface ICreatePermissionReq {
  name?: string;
  module?: string;
  route?: string;
}

export interface IPermission {
  id?: number;
  route: string;
  module?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}

export interface IPermissionQueryReq {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  route?: string;
}

export const createPermission = async (body: ICreatePermissionReq) => {
  const result = await axiosInstance.post<IPermission>(apiUrl, body);
  return result.data;
};

// export const getPermissionList = async (query: IPermissionQueryReq = {}) => {
//   const result = await axiosInstance.get<DataListResponse<IPermission>>(
//     apiUrl,
//     {
//       params: query,
//     }
//   );
//   return result.data;
// };   

export const updatePermission = async (
  id: number,
  body: ICreatePermissionReq
) => {
  const result = await axiosInstance.put<IPermission>(`${apiUrl}/${id}`, body);
  return result.data;
};

export const deletePermission = async (id: number) => {
  const result = await axiosInstance.delete<IPermission>(`${apiUrl}/${id}`);
  return result.data;
};

export const getPermissionsByUser = async () => {
  const result = await axiosInstance.get<{data: IPermission[]}>(`${apiUrl}/user`);
  return result.data;
};