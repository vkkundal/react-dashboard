import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "../../../components/adminlayout/adminlayout"
import { Paper } from "../../../components/paper/paper"
import Button from "../../../components/button/button"
import { useQueryParam } from "../../../hooks/useQueryParam"
import { useGet } from "../../../hooks/useGet"
import { Orderdetails } from "../../../helpers/interfaces"
import { useToasts } from "react-toast-notifications"
import { Table } from "../../../components/table/table"
import { RiDeleteBin6Line } from "react-icons/ri"
import moment from "moment"
//import { CarySelect } from "components/caryselect"
import { usePut } from "hooks/usePut"
import { api } from "api"
import withAuth from "../../../components/withAuth/withAuth"
import DetailInputGroup from "../../../components/inputdetails/inputdetails"
import { AiOutlinePlus } from "react-icons/ai"
import { navigate } from "gatsby"
import { BsEye } from "react-icons/bs"
import { AddServiceToOrder } from "../../../components/popup/AddServiceToOrderdetails"
import TextField from "@material-ui/core/TextField"
import { AddVehicleToOrderPopup } from "components/popup/AddVehicleToOrder"
import { AddProviderToOrder } from "components/popup/AddProviderToOrder"
import { RescheduleOrderPopup } from "components/popup/RescheduleOrderPopup"
import { ILocations } from "../../../helpers/interfaces";
var classifyPoint = require("robust-point-in-polygon")

type IIOrderStatus = { id: number; name: string }

type IIOrderUpdateState = {
    service_date: string
    vehicle_id: number | null
    service_time: string
    provider_user_id: number | null
}

const OrderDetail = () => {
    const id = useQueryParam("id")

    const {
        data: order,
        isReady: itemTypeReady,
        refetchData,
    } = useGet<Orderdetails | null>(`/api/v2/orders/${id}`, null, [id])

    const { data: orderStatuses } = useGet<IIOrderStatus[]>(
        `/api/v2/orders/status`,
        []
    )

    const {  data: locations, refetchData:refetchLocation } = useGet<
    ILocations[],
    {
      city: string;
      area: string;
      polygon: { lat: string; long: string }[];
      is_active: boolean;
    }
  >(`/api/v2/orders/allowed-locations`, [], [null]);

    const { isSending, put } = usePut<{ status_id: number }>(
        `/api/v2/orders/${id}/status`
    )

    const { put: putProvider } = usePut<{ provider_user_id: number | null }>(
        `/api/v2/orders/${id}/provider`
    )



    const [orderStatus, setOrderStatus] = useState<IIOrderStatus | null>(null)
    const [assignVehicle, setAssignVehicle] = useState(false)
    const [reshcedulePopupOpen, setReschedulePopup] = useState(false);
    const [orderArray, setOrderArray] = useState<any>([])
    const [location, setlocation] =  useState<any>()

    console.log(orderArray)

    const [
        orderUpdateState,
        setOrderUpdateState,
    ] = useState<IIOrderUpdateState>({
        provider_user_id: null,
        service_date: "",
        service_time: "",
        vehicle_id: null,
    })
    const oldRef = useRef<IIOrderStatus | null>(null)
    const oldStateRef = useRef<IIOrderUpdateState>({
        provider_user_id: null,
        service_date: "",
        service_time: "",
        vehicle_id: null,
    })



    useEffect(() => {
        console.log("hhhhhhhhh")

        let polygonarr = locations.map((item) => {
            return item.polygon.slice(10)
            .replace(/\)/g, "")
            .split(",")
            .map((el) => {
              let arr = el.trim().split(" ");
              return [ +arr[1], +arr[0] ];
            })

        })
  
        refetchLocation()
        setOrderArray([...orderStatuses])
        if (order) {

        let indexOfLocation;
            
        polygonarr.forEach((item,index) => {
            let pointfind = classifyPoint(  item ,[order.order.location.lat, order.order.location.long ] )
            if( pointfind === -1 || pointfind === 0) 
            {
                indexOfLocation = index

            }
        })

        indexOfLocation && setlocation({...locations[indexOfLocation]})
        console.log(indexOfLocation)
            if (order.order.provider) {
                console.log("ddddd")

                const {
                    order: {
                        vehicle,
                        service_date,
                        service_time,
                        provider: {
                            user: { id: provider_user_id },
                        },
                    },
                } = order
                let vehicle_id = null
                if (vehicle) {
                    vehicle_id = vehicle.id
                }

                console.log("hhhhhhhhh")
                const updateState = {
                    provider_user_id,
                    service_date,
                    service_time,
                    vehicle_id,
                }

                console.log(order.order.status)
                setOrderUpdateState(updateState)
                setOrderStatus(order.order.status)
                oldRef.current = order.order.status
                oldStateRef.current = updateState
            } else {


                const {
                    order: { vehicle, service_date, service_time },
                } = order
                let vehicle_id = null
                if (vehicle) {
                    vehicle_id = vehicle.id
                }

                const updateState = {
                    provider_user_id: null,
                    service_date,
                    service_time,
                    vehicle_id,
                }

                console.log(order.order.status)
                setOrderUpdateState(updateState)
                setOrderStatus(order.order.status)
                oldRef.current = order.order.status
                oldStateRef.current = updateState
            }
        }
    }, [order])

    const [addservicePopup, setAddservicepopup] = useState(false)
    const [assignProviderPopup, setassignProviderPopup] = useState(false)

    const { addToast } = useToasts()

    const updateStatus = async () => {
        await put({ status_id: orderStatus?.id as number })
        addToast("Order Status Updated", {
            autoDismiss: true,
            appearance: "success",
        })
        oldRef.current = orderStatus
    }

    const handleOrderStateChange = <T extends keyof IIOrderUpdateState>(
        key: T
    ) => (val: IIOrderUpdateState[T]) => {
        setOrderUpdateState(old => ({ ...old, [key]: val }))
    }

    // const updateOrder = async () => {
    //     if (orderUpdateState) {
    //         await putisSendingOrder(orderUpdateState)
    //         oldStateRef.current = orderUpdateState
    //         addToast("Order Updated", {
    //             autoDismiss: true,
    //             appearance: "success",
    //         })
    //     }
    // }

    const updateProviderOrder = async () => {
        if (orderUpdateState) {
            let { provider_user_id } = orderUpdateState
            await putProvider({ provider_user_id: provider_user_id })
            oldStateRef.current = orderUpdateState
            addToast("Provider Updated", {
                autoDismiss: true,
                appearance: "success",
            })
        }
    }

    const handleSave = async () => {
        try {
            // await updateOrder()
            await updateStatus()
            refetchData()
        } catch (e) {
            addToast("Cannot update Completed order", {
                autoDismiss: true,
                appearance: "error",
            })
        }
    }

    const handleReset = () => {
        setOrderStatus(oldRef.current)
        setOrderUpdateState(oldStateRef.current)
    }

    const handleServiceDelete = async (serviceId: number) => {
        await api.delete(`/api/v2/orders/${id}/services/${serviceId}`)
        refetchData()
    }

    const handlePurchaseDelete = async (purchase_id: number) => {
        await api.delete(`/api/v2/orders/${id}/purchases/${purchase_id}`)
        refetchData()
    }

    const handleItemDelete = async (item_id: number) => {
        await api.delete(`/api/v2/orders/${id}/items/${item_id}`)
        refetchData()
    }




    return (
        <AdminLayout title="Orders">
            <Paper className="mt-5 p-5">
                <div className="filter">
                    <h3 className="font-weight-normal">Order Details</h3>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <div>
                            <DetailInputGroup
                                type="number"
                                label="ID"
                                disabled
                                value={id}
                            />
                        </div>
                          {/* <CarySelect
                            variant="User"
                            options={[...orderStatuses]}
                            onChange={setOrderStatus}
                            getName={val => val?.name || ""}
                            selectedOption={orderStatus}
                            title="Status"
                        />   */}
                        <label className="User-label">Status</label>
                        <select onChange={(e) =>{
                           let index = orderStatuses.findIndex((item) => {

                            console.log(item.name == e.target.value)
                            return item.name == e.target.value
                            })
                            console.log(orderStatuses)
                            console.log(e.target.value)
                            console.log(index)
                            setOrderStatus(orderStatuses[index])
                        }} className="User-select">
                            {orderStatus &&  orderStatuses.map((item)=>{

                                return (
                                    <option selected={(item.id == orderStatus.id) ? true: false} value={item.name}>{item.name}</option>
                                )
                            })}
                        </select>
                        <div>
                            <DetailInputGroup
                                type="number"
                                label="Total Price"
                                disabled
                                value={order?.order.price_total}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 offset-md-1">
                        <div className="first-name">
                            <DetailInputGroup
                                type="text"
                                name="service type"
                                label="Service type"
                                disabled
                                value={order?.order.service_type.name}
                            />
                        </div>
                        <div className="first-name">
                            <DetailInputGroup
                                type="text"
                                name="created At"
                                label="Created At"
                                disabled
                                value={moment(order?.order.created_at).format(
                                    "DD-MM-YYYY"
                                )}
                            />
                        </div>

                        <label className="filter-label">Service Date</label>
                        <TextField
                            id="date"
                            label=""
                            type="date"
                            disabled
                            value={orderUpdateState.service_date}
                          
                            className={"User-input mb-3"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <label className="filter-label">Service Time</label>
                        <TextField
                            id="time"
                            type="time"
                            value={orderUpdateState.service_time}
                            disabled
                           
                            className={"User-input"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                    </div>
                </div>
                <div className="row justify-content-end mt-3">
                   
                    {reshcedulePopupOpen && <RescheduleOrderPopup orderId={id} onClose={() =>{ setReschedulePopup(false);refetchData()}} />}
                    <div className="Add-user text-center">
                    <Button
                        onClick={() => setReschedulePopup(true)}
                        className="Add-btn  mr-5"
                    >
                        <AiOutlinePlus className="plus-icon" />
                        Reschedule
                    </Button>
                        <Button
                            loading={isSending}
                            onClick={handleSave}
                            className="mt-5 text-center popup-button"
                        >
                            Save Changes
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            Reset
                        </Button>
                    </div>
                </div>
            </Paper>
            <Table
                title="Vehicles"
                loading={!itemTypeReady}
                button={
                    <Button
                        onClick={() => setAssignVehicle(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus className="plus-icon" />
                        Change
                    </Button>
                }
            >
                {assignVehicle && (
                    <AddVehicleToOrderPopup
                        vehicleId={orderUpdateState.vehicle_id}
                        onChange={handleOrderStateChange("vehicle_id")}
                        onAdd={handleSave}
                        onClose={() => {
                            handleReset()
                            setAssignVehicle(false)
                        }}
                    />
                )}

                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Is active</th>
                        <th scope="col">Is cary</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.order.vehicle && (
                        <tr>
                            <td scope="row">{order.order.vehicle.id}</td>
                            <td>{order.order.vehicle.name}</td>
                            <td>{order.order.vehicle.is_active.toString()}</td>
                            <td>{order.order.vehicle.is_cary.toString()}</td>
                            <td
                                onClick={e => {
                                    navigate(
                                        `/dashboard/vehicledetail?id=${order.order.vehicle?.id}`
                                    )
                                }}
                                className="eye-icon cursor-pointer"
                            >
                                <BsEye />
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Table loading={!itemTypeReady} title="Customer">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name </th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">{order?.order.customer.user.id} </td>
                        <td scope="row">
                            {order?.order.customer.user.first_name}{" "}
                        </td>
                        <td scope="row">
                            {order?.order.customer.user.last_name}
                        </td>
                        <td scope="row">{order?.order.customer.user.mobile}</td>
                    </tr>
                </tbody>
            </Table>
            <Table
                loading={!itemTypeReady}
                title="Provider"
                button={
                    <Button
                        onClick={() => setassignProviderPopup(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus className="plus-icon" />
                        Change
                    </Button>
                }
            >
                {assignProviderPopup && (
                    <AddProviderToOrder
                        providerId={orderUpdateState.provider_user_id}
                        onChange={handleOrderStateChange("provider_user_id")}
                        onAdd={async () => {
                            await updateProviderOrder()
                            refetchData()
                            setassignProviderPopup(false)
                        }}
                        onClose={() => {
                            handleReset()
                            setassignProviderPopup(false)
                        }}
                    />
                )}
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name </th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">
                            {order?.order.provider &&
                                order?.order.provider.user.id}{" "}
                        </td>
                        <td scope="row">
                            {order?.order.provider &&
                                order?.order.provider.user.first_name}{" "}
                        </td>
                        <td scope="row">
                            {order?.order.provider &&
                                order?.order.provider.user.last_name}
                        </td>
                        <td scope="row">
                            {order?.order.provider &&
                                order?.order.provider.user.mobile}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Table
                loading={!itemTypeReady}
                title="Services"
                button={
                    <Button
                        onClick={() => setAddservicepopup(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus className="plus-icon" />
                        Add Service
                    </Button>
                }
            >
                {addservicePopup && (
                    <AddServiceToOrder
                        id={order?.order.service_type.id as number}
                        orderId={id}
                        onAdd={refetchData}
                        onClose={() => setAddservicepopup(false)}
                    />
                )}
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Buy Price</th>
                        <th scope="col">Action </th>
                    </tr>
                </thead>
                <tbody>
                    {order?.order.services.map(item => {
                        return (
                            <tr>
                                <td scope="row">{item.service.id}</td>
                                <td scope="row">{item.service.name}</td>
                                <td scope="row">{item.buy_price}</td>
                                <td
                                    scope="row"
                                    onClick={() =>
                                        handleServiceDelete(item.service.id)
                                    }
                                    className="bin-icon cursor-pointer"
                                >
                                    <RiDeleteBin6Line />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Table loading={!itemTypeReady} title="Items">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Buy Price</th>
                        <th scope="col">Action </th>
                    </tr>
                </thead>
                {order && (
                    <tbody>
                        {order?.order.items.map(item => {
                            return (
                                <tr>
                                    <td scope="row">{item.item.id}</td>
                                    <td>{item.item.title}</td>
                                    <td>{item.buy_price}</td>
                                    <td
                                        onClick={() => {
                                            handleItemDelete(item.item.id)
                                        }}
                                        className="bin-icon cursor-pointer"
                                    >
                                        <RiDeleteBin6Line />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                )}
            </Table>

            <Table loading={!itemTypeReady} title="Items Preferences">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Description Ar</th>
                        <th scope="col">Price</th>
                        <th scope="col">Action </th>
                    </tr>
                </thead>
                {order && (
                    <tbody>
                        {order?.order.item_preferences.map(item => {
                            return (
                                <tr>
                                    <td scope="row">{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.description_ar}</td>
                                    <td>{item.price}</td>
                                    <td
                                        onClick={() => {
                                            //handleItemDelete(item.id)
                                        }}
                                        className="bin-icon cursor-pointer"
                                    >
                                        <RiDeleteBin6Line />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                )}
            </Table>

            <Table loading={!itemTypeReady} title="Purchases">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Receipt Image </th>
                        <th scope="col">Price</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                {order && (
                    <tbody>
                        {order.order.external_purchases.length > 0 &&
                            order?.order.external_purchases.map(item => {
                                return (
                                    <tr>
                                        <td scope="row">{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <img
                                                className="img-fluid"
                                                src={item.receipt_image_url}
                                            />
                                        </td>
                                        <td>{item.price}</td>
                                        <td
                                            onClick={() => {
                                                handlePurchaseDelete(item.id)
                                            }}
                                            className="bin-icon cursor-pointer"
                                        >
                                            <RiDeleteBin6Line />
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                )}
            </Table>
            <Table loading={!itemTypeReady} title="Car">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Make </th>
                        <th scope="col">Model</th>
                        <th scope="col">Year</th>
                        <th scope="col">Last Mileage</th>
                        <th scope="col">Next Mileage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">{order?.order.car.id} </td>
                        <td scope="row">
                            {order?.order.car.car_model.car_make.name}{" "}
                        </td>
                        <td scope="row">{order?.order.car.car_model.name}</td>
                        <td scope="row">{order?.order.car.year}</td>
                        <td scope="row">{order?.order.car.last_mileage}</td>
                        <td scope="row">{order?.order.car.next_mileage} </td>
                    </tr>
                </tbody>
            </Table>
            <Table loading={!itemTypeReady} title="Invoice">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Payment Method</th>
                        <th scope="col">Price no Vat</th>
                        <th scope="col">Vat Price</th>
                        <th scope="col">Vat Amount</th>
                        <th scope="col">Price Total</th>
                        <th scope="col">Created at</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">
                            {order?.order.invoice && order?.order.invoice.id}{" "}
                        </td>
                        <td scope="row">
                            {order?.order.invoice &&
                                order?.order.invoice.payment_method &&
                                order?.order.invoice.payment_method.name}
                        </td>
                        <td scope="row">
                            {order?.order.invoice &&
                                order?.order.invoice.price_no_vat}
                        </td>
                        <td scope="row">
                            {order?.order.invoice &&
                                order?.order.invoice.vat_price}
                        </td>
                        <td scope="row">
                            {order?.order.invoice &&
                                order?.order.invoice.vat_amount}
                        </td>
                        <td scope="row">
                            {order?.order.invoice &&
                                order?.order.invoice.price_total}{" "}
                        </td>
                        <td scope="row">
                            {order?.order.invoice &&
                                moment(order?.order.invoice.created_at).format(
                                    "DD-MM-YYYY"
                                )}{" "}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Table loading={!itemTypeReady} title="Rating">
                <thead className="table-head">
                    <tr>
                        <th scope="col">Order Rating</th>
                        <th scope="col">Provider Rating</th>
                        <th scope="col">Comment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">
                            {order?.order.rating &&
                                order?.order.rating.order_rate}{" "}
                        </td>
                        <td scope="row">
                            {order?.order.rating &&
                                order?.order.rating.provider_rate}
                        </td>
                        <td scope="row">
                            {order?.order.rating && order?.order.rating.comment}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Table loading={!itemTypeReady} title="Location">
                <thead className="table-head">
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Area</th>
                        <th scope="col">City</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">
                            {location && location.id}
                        </td>
                        <td scope="row">
                            {location && location.area}
                        </td>
                        <td scope="row">
                            {location && location.city}
                        </td>
                    </tr>
                </tbody>
            </Table>

            <Table
                loading={!itemTypeReady}
                title="Order Location"
                content={
                    <>
                        <iframe
                            src={`https://maps.google.com/maps?q=${order?.order.location.lat}, ${order?.order.location.long}&z=15&output=embed`}
                            width="100%"
                            height="400"
                            frameBorder="0"
                            style={{ border: 0 }}
                        ></iframe>
                    </>
                }
            />
        </AdminLayout>
    )
}

export default withAuth(OrderDetail)
