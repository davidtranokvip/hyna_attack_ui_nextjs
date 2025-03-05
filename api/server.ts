import { axiosInstance } from "@/shared/utils/ApiUtils";

const apiUrl = "servers";

export interface IServerRes {
  status: string;
  message: string;
  data: IServerItem[]; 
}

export interface IServerItem {
    id: number;
    ip: string;
    name: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
  
export type IServerReq = Omit<IServerItem, 'id'>;

export const createServer = async (body: IServerReq) => {
  const result = await axiosInstance.post<IServerRes>(apiUrl, body);
  return result.data;
};

export const getServerList = async () => {
  const result = await axiosInstance.get<IServerRes>(apiUrl);
  return result.data;
};

export const deleteServer = async (id: number) => {
  const result = await axiosInstance.delete<IServerRes>(`${apiUrl}/${id}`);
  return result.data;
};

export const updateServer = async (data: IServerItem) => {
  const result = await axiosInstance.put(`${apiUrl}/${data?.id}`, data);
  return result.data;
}