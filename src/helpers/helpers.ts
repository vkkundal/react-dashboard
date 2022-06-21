import { api } from "../api"
import { IAdminDetail, IRole, IUser, ErrorsObject } from "./interfaces"
import qs from "querystring"
import { AddToast } from "react-toast-notifications"
export const fetchAdminDetail = async (userId: string) => {
    const res = await api.get("/api/v2/admins/" + userId)
    return res.data as IAdminDetail
}

export const saveUserInfo = async (userId: string, user: IUser) => {
    await api.put("/api/v2/users/" + userId, user)
}

export const saveRole = async (
    type: "admins" | "providers",
    userId: string,
    role_id: number
) => {
    await api.put(`/api/v2/${type}/${userId}/role`, { role_id })
}

export const updateAdminEmailPass = async (
    user_id: string,
    email: string,
    password: string
) => {
    await api.put(`/api/v2/admins/${user_id}`, { email, password })
}

export const createNewAdmin = async (args: {
    first_name: string
    last_name: string
    mobile: string
    email: string
    password: string
    role_id: number
    is_active: boolean
}) => {
    await api.post("/api/v2/admins/create", args)
}

export const createNewShift = async (
    args: {
        day: string
        start_time: string
        end_time: string
    }[],
    id: string
) => {
    await api.post(`/api/v2/providers/vehicles/${id}/shifts`, args)
}

export const fetchAdminRoles = async () => {
    const res = await api.get("/api/v2/admins/roles")
    return res.data as IRole[]
}

export const fetchUserRoles = async () => {
    const res = await api.get(`/api/v2/users/roles`)
    return res.data as IRole[]
}

export const fetchCustomerRoles = async () => {
    const res = await api.get(`/api/v2/customers/roles`)
    return res.data as IRole[]
}

export const fetchAdmins = async ({
    page = 1,
    ...rest
}: Partial<{
    page: number
    first_name: string
    last_name: string
    mobile: string
    email: string
}> = {}) => {
    return await api.get("/api/v2/admins/?" + qs.stringify({ page, ...rest }))
}

export const createNewLocation = async (args: {
    city: string
    area: string
    polygon:
        | {
              lat: string
              long: string
          }[]
        | null
    is_active: boolean
}) => {
    await api.post("/api/v2/orders/allowed_locations", args)
}

export const updatLocation = async (args: {
    id?: string
    city: string
    area: string
    polygon:
        | {
              lat: string
              long: string
          }[]
        | null
    is_active: boolean
}) => {
    await api.put(`/api/v2/orders/allowed-locations/${args.id}`, args)
}

export const deleteLocation = async (id: { id: string }) => {
    await api.delete(`/api/v2/orders/allowed-locations/${id.id}`)
}

export const passTargetVal = (callback: (val: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        callback(val)
    }
}
export function handleErrors(
    errors: any,
    addtoast: any,
    arrayClientErrors: string[] | undefined,
    fieldtoskip?: string
) {
    try {
        if (!errors.response) {
            addtoast(`Cors error or internet error`, {
                autoDismiss: true,
                appearance: "error",
            })
    
            return
        }
    
        if ((errors.response?.data.detail as any) === "Items Not found") {
            addtoast(`${errors.response?.data.detail} . Enter correct Serial No`, {
                autoDismiss: true,
                appearance: "error",
            })
    
            return
        }
        if (
            (errors.response?.data.detail as any) ===
            "invalid item quantity, result count is less than zero"
        ) {
            addtoast(`Enter quantity less than that available in stock`, {
                autoDismiss: true,
                appearance: "error",
            })
    
            return
        }
    
        if ((errors.response?.data.detail as any) === "User not found") {
            addtoast(
                `${errors.response?.data.detail}. Enter correct mobile number`,
                {
                    autoDismiss: true,
                    appearance: "error",
                }
            )
    
            return
        }
        if ((errors.response?.data.detail as any) === "Car not found") {
            addtoast(`${errors.response?.data.detail}. Enter valid model id`, {
                autoDismiss: true,
                appearance: "error",
            })
    
            return
        }
        if (typeof errors.response?.data.detail === "string") {
            addtoast(`${errors.response?.data.detail}`, {
                autoDismiss: true,
                appearance: "error",
            })
    
            return
        }
    
        let errorsArray =
            typeof errors.response.data.detail !== "string"
                ? errors.response?.data?.detail.map(
                      (obj: ErrorsObject, index: number) => {
                          if (obj.loc[1] == fieldtoskip) {
                              return
                          }
    
                          switch (obj?.type) {
                              case "value_error.any_str.min_length":
                                  if (arrayClientErrors?.includes(`${obj.loc[1]}`))
                                      return
    
                                  if (obj.loc[1] == "title") {
                                      obj.loc[1] = "Name"
                                  }
    
                                  if (obj.loc[1] == "title_ar") {
                                      obj.loc[1] = "Name_ar"
                                  }
    
                                  return `Ensure ${obj.loc[1].replace(
                                      /_/g,
                                      " "
                                  )} has at least ${
                                      obj?.ctx?.limit_value
                                  } characters`
                                  break
    
                              case "value_error.any_str.max_length":
                                  return `Ensure ${obj.loc[1].replace(
                                      /_/g,
                                      " "
                                  )} has at most ${
                                      obj?.ctx?.limit_value
                                  } characters`
                                  break
    
                              case "value_error.email":
                                  return `Invalid Email`
                                  break
    
                              case "type_error.float":
                                  return `${obj.loc[1].replace(
                                      /_/g,
                                      " "
                                  )} cannot be empty`
                                  break
    
                              case "type_error.none.not_allowed":
                                  return `${obj.loc[1].replace(
                                      /_/g,
                                      " "
                                  )} cannot be empty`
                                  break
    
                              case "value_error.number.not_gt":
                                  return `${obj.loc[1].replace(
                                      /_/g,
                                      " "
                                  )} must be greater than 0`
                                  break
    
                              case "type_error.integer":
                                  return `${obj.loc[1].replace(
                                      /_/g,
                                      " "
                                  )} is not a valid integer`
                                  break
    
                              case "value_error.number.not_lt":
                                  return `Ensure ${obj.loc[1].replace(
                                      /_/g,
                                      " "
                                  )} is less than 1000`
                                  break
    
                              case "value_error.time":
                                  return `Ensure ${obj.loc[2].replace(
                                      /_/g,
                                      " "
                                  )} is valid time`
                                  break
    
                              case "value_error.missing":
                                  return `Ensure ${obj.loc[2].replace(
                                      /_/g,
                                      " "
                                  )} is valid time`
    
                              default:
                                  return "Internet Error"
                          }
                      }
                  )
                : undefined
    
        errorsArray?.map(function (msg: string[]) {
            if (msg == null) return
    
            addtoast(`${msg}`, {
                autoDismiss: true,
                appearance: "error",
            })
        })
    }catch(e){
        console.log(e);
        addtoast("Error Occurred", { autoDismiss: true,
            appearance: "error",})
    }
  
}

export function validateFields(
    data: any,
    addtoast: AddToast,
    fieldtoskip?: string
) {
    let clientErrors: any = []

    for (let property in data) {
        if (property == fieldtoskip) {
            continue
        }
        if (!String(data[property])) {
            if (property == "title") {
                property = "Name"
            }
            if (property == "title_ar") {
                property = "Name ar"
            }
            clientErrors.push(property)
        }
    }

    clientErrors?.map(function (msg: string) {
        addtoast(`${msg.replace("_", " ")} cannot be empty`, {
            autoDismiss: true,
            appearance: "error",
        })
    })

    return clientErrors
}
