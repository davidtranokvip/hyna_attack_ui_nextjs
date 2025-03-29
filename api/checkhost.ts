import { axiosInstancePublic } from "@/shared/utils/ApiUtils";

const apiUrl = "check_host";

export const checkHostApi = async (body: { host: string }) => {
    const result = await axiosInstancePublic.post(`${apiUrl}/get_list`, body);
    return result.data;
}