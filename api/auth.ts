import { encryptData } from "@/helpers/payloadData";
import { axiosInstancePublic } from "@/shared/utils/ApiUtils";

export interface ILoginReq {
  nameAccount?: string;
  password?: string;
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
  const result = await axiosInstancePublic.post<ILoginRes>("auth/login", {
    encryptedData: encryptedData.encryptedData,
    encryptedKey: encryptedData.encryptedKey,
    iv: encryptedData.iv,  
  });
  return result.data;
};

