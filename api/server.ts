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
  thread: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IServerReq = Omit<IServerItem, 'id'>;

export const serverApi = {
  getAll: async () => {
    const response = await axiosInstance.get<IServerRes>(apiUrl);
    return response.data;
  },

  getServerForTeam: async (teamId: number) => {
    const response = await axiosInstance.get(`${apiUrl}/team`, {
      params: {
        team_id: teamId
      }
    });
    return response.data;
  },
  
  create: async (body: IServerReq) => {
    const response = await axiosInstance.post<IServerRes>(apiUrl, body);
    return response.data;
  },
  
  update: async (data: IServerItem) => {
    const response = await axiosInstance.put(`${apiUrl}/${data.id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete<IServerRes>(`${apiUrl}/${id}`);
    return response.data;
  }
};