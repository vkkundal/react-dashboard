import React, { useEffect, useRef, useState } from "react"
import { useToasts } from "react-toast-notifications"
import AdminLayout from "../../components/adminlayout/adminlayout"
import Button from "../../components/button/button"
import { DevicesTable } from "../../components/DevicesTable/devicestable"
import { Paper } from "../../components/paper/paper"
import Spinner from "../../components/spinner/spinner"
import { Table } from "../../components/table/table"
import DetailInputGroup from "../../components/inputdetails/inputdetails"
import SelectInput from "../../components/Selectinput/selectinput"

import Switch from "react-ios-switch"
import withAuth from "../../components/withAuth/withAuth"
import { CustomerService } from "../../helpers/CustomerService"
import {
    fetchCustomerRoles,
    saveUserInfo,
} from "../../helpers/helpers"
import {
    ICustomerData,
    ICustomerDataWithCars,
    IRole,
} from "../../helpers/interfaces"
import { useQueryParam } from "../../hooks/useQueryParam"
import produce from "immer"
import { handleErrors, validateFields } from "helpers/helpers"

const Customerdetail = () => {
    const id = useQueryParam("id")

    const [
        customerData,
        setCustomerData,
    ] = useState<ICustomerDataWithCars | null>(null)

    const [roles, setRoles] = useState<IRole[]>([])

    const { addToast } = useToasts()

    const customerDataRef = useRef<ICustomerDataWithCars | null>(null)

    const [isSaving, setIsSaving] = useState(false)

    const onSave = async () => {
        setIsSaving(true)

        const arrayClientErrors = validateFields(customerData?.user,addToast);

        console.log(arrayClientErrors)
    
    
        try {
            if (customerData) {
                await saveUserInfo(id, customerData.user)
            }
            customerDataRef.current = customerData
            addToast("Details Saved", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
            
            handleErrors(e , addToast , arrayClientErrors)

        } finally {
            setIsSaving(false)
        }
    }



    useEffect(() => {
        if (id) {
            CustomerService.getCustomerById(id).then(data => {
                customerDataRef.current = data
                setCustomerData(data)
            })

            fetchCustomerRoles().then(setRoles)
        }
    }, [id])

    const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof ICustomerData["user"]
        const value = e.target.value
        setCustomerData(old => {
            if (!old) {
                return null
            }
            return {
                ...old,
                user: { ...old.user, [name]: value },
            }
        })
    }

    const onReset = () => {
        setCustomerData(customerDataRef.current)
    }

    const onChangeIsActive = () => {
        setCustomerData(old => !old ? old: produce(old, draft => {
            draft.user.is_active = !old.user.is_active
        }))
    }

    const renderPanels = () => {
        if (customerData) {
            return (
                <>
                    <Paper className="mt-5 p-4">
                        <div className="filter py-2">
                            <h3 className="font-weight-normal">User Details</h3>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="User-details">

                                    <DetailInputGroup
                                        type="number"
                                        label="User ID"
                                        className="disabled"

                                        disabled={isSaving}
                                        value={customerData.user.id}
                                    />
                                </div>
                                <div className="first-name">
                                    
                                    <DetailInputGroup
                                        type="text"
                                        label="First Name"
                                        name="first_name"
                                        onChange={handleChangeUserData}
                                        disabled={isSaving}
                                        value={customerData.user.first_name}
                                    />
                                </div>
                                <div className="User-phone">
                                   
                                    <DetailInputGroup
                                        type="number"
                                        label="Mobile"
                                        name="mobile"
                                        onChange={handleChangeUserData}
                                        disabled={isSaving}
                                        value={customerData.user.mobile}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="is-active">
                                    <span>Is Active</span>
                                    <Switch
                                        checked={customerData.user.is_active}
                                        onChange={onChangeIsActive}
                                    />
                                </div>
                                <div className="last-name mt-3">
                                    
                                     <DetailInputGroup
                                        type="text"
                                        label="Last Name"
                                        name="last_name"
                                        onChange={handleChangeUserData}
                                        disabled={isSaving}
                                        value={customerData.user.last_name}
                                    />
                                </div>
                                <div className="User-role">
                                    <SelectInput
                                        label='Role'
                                        name="role"
                                        disabled={isSaving}
                                        value={customerData.role.id}
                                        onChange={(e : React.ChangeEvent) => {
                                            const newRoleId = parseInt(
                                                (e.target as HTMLInputElement).value
                                            )
                                            const index = roles.findIndex(
                                                item =>
                                                    parseInt(item.id as any) ===
                                                    newRoleId
                                            )

                                            const newRole = roles[index]

                                            setCustomerData(old => {
                                                if (!old) {
                                                    return old
                                                }
                                                return {
                                                    ...old,
                                                    role: newRole,
                                                }
                                            })
                                        }}
                                    >
                                        {roles.map(role => {
                                            return (
                                                <option
                                                    value={role.id}
                                                    key={role.id}
                                                >
                                                    {role.name}
                                                </option>
                                            )
                                        })}
                                    </SelectInput>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="User-submit text-right">
                                    <Button
                                        onClick={onSave}
                                        loading={isSaving}
                                        type="submit"
                                        className="mt-5 text-right"
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        onClick={onReset}
                                        variant = "outline"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Paper>
                    <DevicesTable devices={[customerData.device]} />
                    <Paper className="mt-5">
                        <div className="customer py-2">
                            <h3 className="font-weight-normal">
                                Customer Info
                            </h3>
                        </div>
                        <div className="row p-4">
                            <div className="col-md-6 pt-3">
                                
                                <DetailInputGroup
                                        type="tel"
                                        label="Balance"
                                        name="mobile"
                                        value={customerData.customer.balance}
                                    />
                            </div>
                        </div>
                    </Paper>
                    <Table title="Cars">
                        <thead className="table-head">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Make</th>
                                <th scope="col">Model</th>
                                <th scope="col">Year</th>
                                <th scope="col">Last Mileage</th>
                                <th scope="col">Next Mileage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerData.cars.map(car => {
                                return (
                                    <tr key={car.id}>
                                        <td scope="row"> {car.id} </td>
                                        <td>{car.car_model.car_make.name}</td>
                                        <td>{car.car_model.name}</td>
                                        <td>{car.year}</td>
                                        <td>{car.last_mileage}</td>
                                        <td>{car.next_mileage}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </>
            )
        }
    }

    return (
        <AdminLayout title="Customers Details">
            {!customerData && (
                <Paper className="mt-5 p-5 d-flex align-items-center justify-content-center">
                    <Spinner color="#333" />
                </Paper>
            )}
            {renderPanels()}
        </AdminLayout>
    )
}

export default withAuth(Customerdetail)
