
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

export interface IAttack {
  status: string,
  data: {
    attack: number
  },
  message: string
}

interface IListProcesses {
  domain: string;
  attack_time: string;
  remaining_time: string;
  concurrents: number;
  pid: number;
}

export const stopProcesses = async (pid: number) => {
  const result = await axiosInstance.post<DataListResponse<IListProcesses>>(`${apiUrl}/stop_process/${pid}`);
  return result.data;
};

export const getListProcesses = async () => {
  const result = await axiosInstance.get<DataListResponse<IListProcesses>>(`${apiUrl}/list_processes`);
  return result.data;
};

export const createAttack = async (body: any) => {
  const encryptedData = encryptData(body);
  const result = await axiosInstance.post<IAttack>(apiUrl, {encryptedData: encryptedData.encryptedData,
    encryptedKey: encryptedData.encryptedKey,
    iv: encryptedData.iv,  });
  return result.data;
};