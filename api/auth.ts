import { encryptData } from "@/helpers/payloadData";
import { axiosInstance, axiosInstancePublic } from "@/shared/utils/ApiUtils";

const apiUrl = "auth";

export interface ILoginReq {
  nameAccount?: string;
  password?: string;
}

export interface IUpdateReq {
  currentPassword: string;
  newPassword?: string;
  repeatPassword?: string;
}

interface ILoginRes {
  data: {
    token: string;
  };
  message: string;
  status: string;
}

export const loginApi = async (req: ILoginReq) => {
  const encryptedData = encryptData(req);
  const result = await axiosInstancePublic.post<ILoginRes>(`${apiUrl}/login`, {
    encryptedData: encryptedData.encryptedData,
    encryptedKey: encryptedData.encryptedKey,
    iv: encryptedData.iv,  
  });
  return result.data;
};

export const updatePassword = async (req: IUpdateReq) => {
  const encryptedData = encryptData(req);
  const result = await axiosInstance.post<ILoginRes>(`${apiUrl}/change_password`, {
    encryptedData: encryptedData.encryptedData,
    encryptedKey: encryptedData.encryptedKey,
    iv: encryptedData.iv,  
  });
  return result.data;
};

