import { IDataResponse } from "@/shared/types/ApiResponse";
import { axiosInstance } from "@/shared/utils/ApiUtils";

export interface IGetSettingRes {
  meta: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  settings?: ISettingItem[];
}

export interface ISettingItem {
  id: number;
  value: Array<{[key: string]: string | number}>;
  group: string;
  type: string;
}
export type ISettingReq = Omit<ISettingItem, 'id'>;
export const addSettingApi = async (req: ISettingReq[]) => {
  const result = await axiosInstance.post<IDataResponse>("settings", req);
  return result.data;
};

export const getSettingApi = async () => {
  const result = await axiosInstance.get<IGetSettingRes>("settings");
  return result.data;
};

export const deleteSettingApi = async (id: number) => {
  const result = await axiosInstance.delete<IDataResponse>(`settings/${id}`);
  return result.data;
};

export const updateSettingApi = async (data: ISettingItem) => {
  const result = await axiosInstance.put(`settings/${data?.id}`, data);
  return result.data;
}