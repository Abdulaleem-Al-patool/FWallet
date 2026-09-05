import { httpClient } from "./HttClient";
export async function fetchData(url,token){
    try{
        const response =await httpClient.get(url,token);
        if (!Array.isArray(response)) {
            return response;
        }

        const isTokenWrapped = response.some(item => item?.token);
        if (!isTokenWrapped) {
            return response;
        }

        const user = response.find(item => item.token === token);
        return user?.data ?? [];
    }catch(error){
        return null;
    }
}