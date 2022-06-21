import { api } from "../api"
import qs from "querystring"
import {  IProviderData, IProviderWithServices } from "./interfaces"

export class ProviderService {
    static getProviders = async ({
        page = 1,
        ...rest
    }: Partial<{
        page: number
        first_name: string
        last_name: string
        mobile: string
    }> = {}) => {
        const res = await api.get(
            "/api/v2/providers/?" + qs.stringify({ page, ...rest })
        )
        return res.data as IProviderData[]
    }

    static getProviderById = async (id: string) => {
        const res = await api.get("/api/v2/providers/" + id)
        return res.data as IProviderWithServices
    }



    static deleteService = async (
        provider_user_id: string,
        service_type_id: string
    ) => {
        await api.delete(
            `/api/v2/providers/${provider_user_id}/service-type/${service_type_id}`
        )
    }

    static addService = async (
        provider_user_id: string,
        service_type_id: number
    ) => {
        await api.post(`/api/v2/providers/${provider_user_id}/service-type`, {
            service_type_id,
        })
    }
}
