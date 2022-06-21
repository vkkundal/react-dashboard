import { api } from "../api"
import { IService, IServiceType } from "./interfaces";

export class ServicesService {
    static getServices = async () => {
       const res = await api.get(`/api/v2/services/types`);
       return res.data as IService[];
    }

    static getServiceTypes = async(type_id: number) => {
        const res = await api.get(`/api/v2/services/types/${type_id}/services`);

        return res.data as IServiceType[];
    }

}