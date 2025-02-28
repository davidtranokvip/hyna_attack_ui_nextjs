import { axiosInstancePublic } from "@/shared/utils/ApiUtils";

export interface ILoginReq {
  nameAccount?: string;
  password?: string;
}

interface ILoginRes {
  token?: string;
  message: string;
  status?: string;
}

export const loginApi = async (req: ILoginReq) => {
  const result = await axiosInstancePublic.post<ILoginRes>("auth/login", req);
  return result.data;
};

