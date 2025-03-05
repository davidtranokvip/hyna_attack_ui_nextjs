import { axiosInstance } from "@/shared/utils/ApiUtils";

const apiUrl = "settings";

export interface ISettingRes {
  status: string;
  message: string;
  data: ISettingItem[];
}

export interface ISettingItem {
  id: number;
  stt: number;
  value: Array<{
    key: string;
    label: string;
    value: string | number;
  }>;
  group: string;
  description: string;
  type: string;
  input: string;
}

export type ISettingReq = Omit<ISettingItem, 'id'>;

export const createSetting = async (req: ISettingReq[]) => {
  const result = await axiosInstance.post<ISettingRes>(`${apiUrl}`, req);
  return result.data;
};

export const getSettingApi = async () => {
  const result = await axiosInstance.get<ISettingRes>(`${apiUrl}`);
  return result.data;
};

export const deleteSettingApi = async (id: number) => {
  const result = await axiosInstance.delete<ISettingRes>(`${apiUrl}/${id}`);
  return result.data;
};

export const updateSettingApi = async (data: ISettingItem) => {
  const result = await axiosInstance.put(`${apiUrl}/${data?.id}`, data);
  return result.data;
}