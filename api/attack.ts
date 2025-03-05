
import { encryptData } from "@/helpers/payloadData";
import { DataListResponse } from "@/shared/types/ApiResponse";
import { axiosInstance } from "@/shared/utils/ApiUtils";

const apiUrl = "attacks";

export interface IAttackQueryReq {
  page?: number;
  limit?: number;
}

export interface IUser {
  id: number;
  email: string;
}
interface IAttackServerLog {
  attackLogId: number;
  createdAt: string;
  id: number;
  output: string | null;
  serverHostname: string;
  status: string;
  updatedAt: string;
}
export interface IAttackLog {
  id: number;
  command: string;
  concurrent: number;
  createdAt: Date;
  domainName: string;
  headers: string;
  output: string;
  request: number;
  status: string;
  time: number;
  updatedAt: Date;
  user: IUser;
  userId: number;
  serverLogs: IAttackServerLog[];
}

export interface IAttackPayload {
  domain: string;
  concurrents: number;  
  mode: string;
  attack_time: number;
  request: number;
  coreStrength: string;
  bypass_rateLimit: string;
  death_sword_http: string;
  spoof: boolean;
  warriorType: string;
  servers: string[];
}
export interface IInitiateAttackResponse {
  status: string;
  message: string;
  attackLogId: number;
  successfulServers: string[];
  errors: string[] | null;
}

export const getAttackList = async (query: IAttackQueryReq = {}) => {
  const result = await axiosInstance.get<DataListResponse<IAttackLog>>(apiUrl, {
    params: query,
  });
  return result.data;
};

export const getAttackById = async (id: number) => {
  const result = await axiosInstance.get<IAttackLog>(`${apiUrl}/${id}`);
  return result.data;
};

export const createAttack = async (body: any) => {
  const encryptedData = encryptData(body);
  const result = await axiosInstance.post<IAttackLog>(apiUrl, {encryptedData: encryptedData.encryptedData,
    encryptedKey: encryptedData.encryptedKey,
    iv: encryptedData.iv,  });
  return result.data;
};

export const deleteAttack = async (id: number) => {
  const result = await axiosInstance.delete<IAttackLog>(`${apiUrl}/${id}`);
  return result.data;
};

export const initiateAttack = async (payload: IAttackPayload) => {
  const result = await axiosInstance.post<IAttackLog>(apiUrl, payload);
  return result.data;
};

export const terminateServerAttack = async (
  attackLogId: number,
  hostname: string
) => {
  const result = await axiosInstance.post(
    `${apiUrl}/terminate/${attackLogId}/server/${hostname}`
  );
  return result.data;
};