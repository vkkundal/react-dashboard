import { api } from "../api"
import qs from "querystring"
import { ICustomerData } from "./interfaces"


export class CustomerService {
    static getCustomers = async ({
        page = 1,
        ...rest
    }: Partial<{
        page: number
        first_name: string
        last_name: string
        mobile: string
    }> = {}) => {
        const res = await api.get(
            "/api/v2/customers/?" + qs.stringify({ page, ...rest })
        )
        return res.data as ICustomerData[]
    }


    static getCustomerById = async (customer_user_id: string) => {
        const res = await api.get(`/api/v2/customers/${customer_user_id}`);
        return res.data;
    }

    static updateCustomer = async() => {
        
    }

}