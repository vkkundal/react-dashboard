
import { ThunkAction } from "redux-thunk"
import { IStoreState } from "../reducers"

export type APP_THUNK = ThunkAction<void, IStoreState, null, any>
export type IRole = { id: number; name: string }
export type IUser = {
    id: number
    first_name: string
    last_name: string
    mobile: string
    is_active: boolean
}

export type ILocations = {
    id: string
    city: string,
    area: string,
    polygon: string,
    is_active: boolean
}

export type IAdminDetail = {
    admin: {
        email: string
    }
    user: IUser
    role: IRole
}

export type IProviderData = {
    provider: {
        image_url: string
        balance: number
        iban: string
        rate_count: number
        rating: number
        status: {
            id: number
            name: string
        }
        is_scheduled: boolean
        vehicle: {
            id: number
            is_active: boolean
            is_cary: boolean
            name: string
        } | null
    }
    device: IDevice
    user: IUser
    role: IRole
    iban: string;
    image_url: string;
}

export type IProviderWithServices = IProviderData & {
    items: {
        item: {
            description: string
            description_ar: string
            id: number
            image_url: string
            title: string
            title_ar: string
        }
        quantity: number
    }[]
}

export type IDevice = {
    id: number
    app_id: number
    name: string
    model: string
    platform: string
    version: string
    push_id: string
    uuid: string
    created_at: string
    updated_at: string
}

export type IService = {
    id: number
    name: string
    name_ar: string
    is_active: boolean
    description: string
    description_ar: string
    requires_car: boolean
    image_url: string
    is_scheduled: boolean
}

export type ICustomerData = {
    customer: {
        balance: number
    }
    user: IUser
    role: IRole
}

export type ICarData = {
    id: number
    year: number
    last_mileage: number
    next_mileage: number
    car_model: {
        name: string
        name_ar: string
        car_make: {
            name: string
            name_ar: string
        }
    }
}

export type IServiceDetail = {
    id: number
    name: string
    name_ar: string
    is_active: boolean
    description: string
    description_ar: string
    requires_car: boolean
    image_url?: string
    is_scheduled: boolean
}

export type ICustomerDataWithCars = ICustomerData & {
    device: {
        id: number
        app_id: number
        name: string
        model: string
        platform: string
        version: string
        push_id: string
        uuid: string
        created_at: string
        updated_at: string
    }
    cars: ICarData[]
}

export type IServiceType = {
    id: number
    name: string
    name_ar: string
    price: number
    is_active: boolean
    unique_identifier: string
}

export type IWarehouse = {
    id: number
    name: string
    is_active: boolean
    mobile: number
    location: {
        lat: number
        long: number
    }
}

export type IItem = {
    id: number
    title: string
    title_ar: string
    description: string
    description_ar: string
    image_url: string
    item_type_id: number
    price: number
    is_active: boolean
    total_quantity: number
    serial_number: number
}

export type IItemType = {
    id: number
    name: string
    name_ar: string
    is_active: boolean
    unique_identifier: string
}

export type IITemDetails = {
    item_type_id: number
    serial_number: string
    tags: string[]
    title: string
    title_ar: string
    description: string
    description_ar: string
    is_active: boolean
    price: number
}

export type IITemDetailWithImage = {
    image_url: string
} & IITemDetails

export type IItemDetailById = {
    car_models: { car_model: { id: number, name: string, name_ar: string, car_make: { id: number, name: string, name_ar: string } }; year_from: number; year_to: number }[]
    warehouses: { quantity: number; warehouse: { id: string; name: string } }[]
} & IITemDetailWithImage

export type IProviderType = {
    id: number
    first_name: string
    last_name: string
    mobile: string
    iban: string
    is_scheduled: boolean
}


export type IShiftType = {
    day: string
    end_time: string
    start_time: string
}

export type IProviderTypeVehicle = {
    user: {
        first_name: string
        id: number
        is_active: boolean
        last_name: string
        mobile: number
    }
}



export type IWarehouseitemManagement = {
    quantity: number
    created_at: string
    updated_at: string
    item: {
        id: number
        title: string
        title_ar: string
        description: string
        description_ar: string
        image_url: string
        price: number
        item_type_id: number
        is_active: boolean
        serial_number: string
        tags: string[]
    }
}

export type IGetWarehouseItemMovement = {
    id: number
    quantity: number
    is_returning: boolean
    created_at: string
    updated_at: string
    item: {
        id: number
        title: string
        title_ar: string
        description: string
        description_ar: string
        image_url: string
    }
    provider: {
        image_url: string
        balance: number
        rate_count: number
        rating: number
        user: {
            id: number
            first_name: string
            last_name: string
            mobile: string
            is_active: boolean
        }
    }
}

export type AllCarMakes = {
    id: number
    name: string
    name_ar: string
}

export type CarDetailById = {
    id: number
    name: string
    name_ar: string
    size: string
    allow_oil_change: boolean
}

export type Orders = {
    id: number
    created_at: string
    customer: {
        user: {
            first_name: string
            id: number
            is_active: boolean
            last_name: string
            mobile: number
        }
    }
    price_total: number
    provider: {
        image_url: string
        rate_count: number
        rating: number
        user: {
            first_name: string
            id: number
            is_active: boolean
            last_name: string
            mobile: number
        }
        vehicle: {
            id: number
            is_active: boolean
            is_cary: boolean
            name: string
        } | null
    }
    service_date: string
    service_time: string
    service_type: {
        id: number
        name: string
        name_ar: string
    }
    status: {
        id: number
        name: string
        name_ar: string
    }
    rating: {
        comment: string
        order_rate: number
        provider_rate: number
    }
    vehicle: {
        id: number
        is_active: boolean
        is_cary: boolean
        name: string
    }
}

export type Orderdetails = {
    id: number
    next_status: any
    order: {
        vehicle: IVehicleDetails | null
        service_date: string
        service_time: string
        car: {
            last_mileage: 0
            next_mileage: 0
            year: 2009
            id: number
            car_model: {
                id: number
                name: string
                name_ar: string
                car_make: {
                    id: number
                    name: string
                    name_ar: string
                }
            }
        }
        created_at: string
        customer: {
            user: {
                first_name: string
                id: number
                is_active: boolean
                last_name: string
                mobile: string
            }
        }
        external_purchases: {
            id: number
            name: string
            description: string
            price: number
            receipt_image_url: string
        }[];
        id: number
        items: { buy_price: number; item: IItem; quantity: number }[]
        price_total: number
        provider: {
            image_url: string
            rate_count: number
            rating: number
            user: {
                first_name: string
                id: number
                is_active: boolean
                last_name: string
                mobile: number
            }
            vehicle: {
                id: number
                is_active: boolean
                is_cary: boolean
                name: string
            } | null
        }
        service_type: {
            id: number
            name: string
            name_ar: string
        }
        services: {
            service: {
                id: number
                name: string
                name_ar: string
            }
            buy_price: number
        }[]

        status: {
            id: number
            name: string
            name_ar: string
        }
        invoice: {
            created_at: string
            id: number
            is_closed: boolean
            order_id: number
            payment_method: {
                id: number
                name: string
                name_ar: string
                image_url: string
            }
            price_no_vat: number
            price_total: number
            updated_at: string
            vat_amount: number
            vat_price: number
        }
        location: {
            lat: number
            long: number
        }
        rating: {
            comment: string
            order_rate: number
            provider_rate: number
        },
        item_preferences: {
            id: number
            title: string
            title_ar: string
            description: string
            description_ar: string
            image_url: string
            price: number
        }[]
    }
}

export type IInvoice = {
    id: number
    order_id: number
    is_closed: boolean
    created_at: string
    updated_at: string
    payment_method: {
        id: number
        name: string
        name_ar: string
        image_url: string
    } | null
    price_no_vat: number
    vat_price: number
    vat_amount: number
    price_total: number
}

export type IInvoiceDetail = {
    id: number
    order_id: number
    is_closed: boolean
    created_at: string
    updated_at: string
    payment_method: {
        id: number
        name: string
        name_ar: string
        image_url: string
    }
    price_no_vat: number
    vat_price: number
    vat_amount: number
    price_total: number
    order: {
        id: number
        status: {
            id: number
            name: string
            name_ar: string
        }
        service_type: {
            id: number
            name: string
            name_ar: string
        }
        customer: {
            user: {
                id: number
                first_name: string
                last_name: string
                mobile: string
                is_active: boolean
            }
        }
        provider: {
            image_url: string
            rate_count: number
            rating: number
            user: {
                id: number
                first_name: string
                last_name: string
                mobile: string
                is_active: boolean
            }
        }
        created_at: string
        price_total: number
        invoice: {
            id: number
            order_id: number
            is_closed: boolean
            created_at: string
            updated_at: string
            payment_method: {
                id: number
                name: string
                name_ar: string
                image_url: string
            }
            price_no_vat: number
            vat_price: number
            vat_amount: number
            price_total: number
        }
        services: [
            {
                service: {
                    id: number
                    name: string
                    name_ar: string
                }
                buy_price: number
            }
        ]
        items: { buy_price: number; item: IItem; quantity: number }[]
        external_purchases: [
            {
                id: number
                name: string
                description: string
                price: number
                receipt_image_url: string
            }
        ]
        location: {
            lat: number
            long: number
        }
        car: {
            id: number
            year: number
            last_mileage: number
            next_mileage: number
            car_model: {
                id: number
                name: string
                name_ar: string
                car_make: {
                    id: number
                    name: string
                    name_ar: string
                }
            }
        }
    }
}

export type ErrorsObject = {

    type: string
    loc: any
    ctx: {
        limit_value: string
    }
}


export type AuthMenu = {

    create: boolean
    menu: string
    read: boolean
    update: boolean

}


export type IVehicleDetails = {

    name: string
    is_active: boolean
    is_cary: boolean
    id: number
    locations?: ILocations[]
    providers?: IProviderTypeVehicle[]
    service_types?: IServiceType[]
    shifts?: IShiftType[]
}