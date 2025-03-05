
import { axiosInstance } from "@/shared/utils/ApiUtils";

const apiUrl = "teams";

export interface ITeamRes {
  status: string;
  message: string;
  data: ITeamItem[];
}

export interface ITeamItem {
    id: number;
    name: string;
    parent_name: string;
    parent_id: number | null;
    servers: number[];
    server_name: string[];
}

export interface ParentItem {
    id: number;
    name: string;
    children: ParentItem[];
}

export interface IParetRes {
    data: ParentItem[];
    status: string;
}

export interface TreeNode {
    title: string;
    value: number | string;
    children: TreeNode[];
}

export type ITeamReq = Omit<ITeamItem, 'id'>;

export const addTeamApi = async (req: ITeamReq) => {
    const result = await axiosInstance.post<ITeamRes>(`${apiUrl}`, req);
    return result.data;
};

export const getTeamApi = async () => {
    const result = await axiosInstance.get<ITeamRes>(`${apiUrl}`);
    return result.data;
};

export const getParentApi = async () => {
    const result = await axiosInstance.get<IParetRes>(`${apiUrl}/parent`);
    return result.data;
};

export const deleteTeamApi = async (id: number) => {
    const result = await axiosInstance.delete<ITeamRes>(`${apiUrl}/${id}`);
    return result.data;
};

export const updateTeamApi = async (data: ITeamItem) => {
    const result = await axiosInstance.put(`${apiUrl}/${data?.id}`, data);
    return result.data;
}