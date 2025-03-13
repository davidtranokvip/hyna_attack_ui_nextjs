import { axiosInstance } from "@/shared/utils/ApiUtils";
import { IPermissionId } from "./permissions";
import { Dayjs } from "dayjs";

const apiUrl = "users";

export interface IUserRes {
  status: string;
  message: string;
  data: IUserItem[];
}

export interface IUserItem {
    id: number;
    email: string;
    password: string;
    rawPassword: string;
    nameAccount: string;  
    team_id: number;  
    entryTime: string | Dayjs;
    exitTime: string | Dayjs;
    server_id: number;  
    thread: number;  
    team_name: string;  
    server_name: string;  
    permissions: IPermissionId[];
}

export interface IUserLog {
    data: {
        id: number;
        ip: string;
        name_account: string;
        detail: string;
        time_active: string;
    }[];
    status: string;
} 
  
export type IUserReq = Omit<IUserItem, 'id'>;

export const createUserApi = async (body: IUserReq) => {
    const result = await axiosInstance.post<IUserRes>(apiUrl, body);
    return result.data;
};
  
export const getListUserApi = async () => {
    const result = await axiosInstance.get<IUserRes>(apiUrl);
    return result.data;
};
  
export const updateUserApi = async (data: IUserItem) => {
    const result = await axiosInstance.put(`${apiUrl}/${data.id}`, data);
    return result.data;
};

export const deleteUserApi = async (id: number) => {
    const result = await axiosInstance.delete(`${apiUrl}/${id}`);
    return result.data;
};

export const getUserLog = async () => {
    const result = await axiosInstance.get<IUserLog>(`${apiUrl}/log`);
    return result.data;
}
  