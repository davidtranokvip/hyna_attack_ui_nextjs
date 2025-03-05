import { axiosInstance } from "@/shared/utils/ApiUtils";

const apiUrl = "permissions";

export interface IPermissionRes {
  status: string;
  message: string;
  data: IPermissionItem[];
}

export interface IPermissionItem {
  id: number;
  route: string;
  module: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPermissionReq = Omit<IPermissionItem, 'id'>;

export type IPermissionId = Pick<IPermissionItem, 'id'>;

export const createPermission = async (body: IPermissionReq) => {
  const result = await axiosInstance.post<IPermissionRes>(apiUrl, body);
  return result.data;
};

export const getPermissionList = async () => {
  const result = await axiosInstance.get<IPermissionRes>(apiUrl);
  return result.data;
};   
export const updatePermission = async (data: IPermissionItem) => {
  const result = await axiosInstance.put(`${apiUrl}/${data?.id}`, data);
  return result.data;
}

export const deletePermission = async (id: number) => {
  const result = await axiosInstance.delete<IPermissionRes>(`${apiUrl}/${id}`);
  return result.data;
};

export const getPermissionsByUser = async () => {
  const result = await axiosInstance.get<{data: IPermissionItem[]}>(`${apiUrl}/user`);
  return result.data;
};