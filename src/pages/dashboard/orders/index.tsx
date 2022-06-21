import React, { useState, useEffect } from "react"
import { Orders } from "../../../helpers/interfaces"
import AdminLayout from "../../../components/adminlayout/adminlayout"
import { Paper } from "../../../components/paper/paper"
import { Table } from "../../../components/table/table"
import { BsEye } from "react-icons/bs"
import { useGet } from "hooks/useGet"
import { navigate } from "gatsby"
import { useToasts } from "react-toast-notifications"
import withAuth from "../../../components/withAuth/withAuth"
import SelectInput from "../../../components/Selectinput/selectinput"
import Button from "../../../components/button/button"
import { TextField } from "@material-ui/core"
import { DatePicker } from "@material-ui/pickers"

const Item = () => {
    const { isReady, data, refetchData } = useGet<
        Orders[],
        {
            page: number
            order_id: number
            customer_mobile: number
            provider_mobile: number
            status_id: number
            service_time: string
            service_date: string
            order_by: string
            order: number | undefined,
            service_type_id : number
        }
    >(`/api/v2/orders`, [])

    const { data: statuses } = useGet<
        {
            id: number
            name: string
            name_ar: string
        }[]
    >(`/api/v2/orders/status`, [])
    
    const { data: servicetypes } = useGet<
        {
            id: number
            name: string
            name_ar: string
        }[]
    >(`/api/v2/services/types`, [])

    const [pagenumber, setPagenumber] = useState(1)

    const handleNext = () => {
        setPagenumber(pagenumber + 1)
    }

    const handlePrev = () => {
        if (pagenumber === 1) {
            return
        }
        setPagenumber(pagenumber - 1)
    }

    const { addToast } = useToasts()
    const [status_id, setStatusId] = useState("None")
    const [orderby, setOrderby] = useState("None")
    const [order, setOrder] = useState<boolean>(true)

    const [order_id, setOrderid] = useState("")
    const [service_id, setServiceId] = useState("")
    const [customer_mobile, setCustMobile] = useState("")
    const [provider_mobile, setProviderMobile] = useState("")
    const [timestring, setTimestring] = useState("")
    const [datestring, setDateString] = useState("")
    const [selectnone, setSelectNone] = useState(false)

    useEffect(() => {
        refetchData({
            page: pagenumber,
            order_id: order_id ? parseInt(order_id) : undefined,
            customer_mobile: customer_mobile
                ? parseInt(customer_mobile)
                : undefined,
            provider_mobile: provider_mobile
                ? parseInt(provider_mobile)
                : undefined,
            status_id: status_id === "None" ? undefined : parseInt(status_id),
            service_time: timestring ? timestring : undefined,
            service_date: datestring ? datestring : undefined,
            order_by: orderby === "None" ? undefined : orderby,
            order: order ? 1 : 0,
            service_type_id: service_id ? +service_id : undefined
        }).then(data => {
            if (data && data.length === 0) {
                addToast("No more Orders", {
                    autoDismiss: true,
                    appearance: "error",
                })
                if (pagenumber == 1) {
                    return
                }
                setPagenumber(pagenumber - 1)
            }
        })
    }, [pagenumber])

    return (
        <AdminLayout title="Orders">
            <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <div style={{ minWidth: "200px" }}>
                        <Button
                            style={{ width: "40%" }}
                            onClick={() => {
                                refetchData({
                                    page: pagenumber ? pagenumber : undefined,
                                    order_id: order_id
                                        ? parseInt(order_id)
                                        : undefined,
                                    status_id:
                                        status_id === "None"
                                            ? undefined
                                            : parseInt(status_id),
                                    order_by:
                                        orderby === "None"
                                            ? undefined
                                            : orderby,
                                    customer_mobile: customer_mobile
                                        ? parseInt(customer_mobile)
                                        : undefined,
                                    provider_mobile: provider_mobile
                                        ? parseInt(provider_mobile)
                                        : undefined,
                                    service_time: timestring
                                        ? timestring
                                        : undefined,
                                    service_date: datestring
                                        ? datestring
                                        : undefined,
                                    order: order ? 1 : 0,
                                    service_type_id: service_id ? +service_id : undefined
                                })
                            }}
                            className="filter-search"
                        >
                            Go
                        </Button>
                        <Button
                            style={{ width: "40%" }}
                            onClick={() => {
                                setSelectNone(true)
                                setStatusId("None")
                                setOrderby("None")
                                setProviderMobile("")
                                setCustMobile("")
                                setOrderid("")
                                setOrder(true)
                                setDateString("")
                                setTimestring("")
                                refetchData({
                                    page: pagenumber ? pagenumber : undefined,
                                    order_id: undefined,
                                    status_id: undefined,
                                    order_by: undefined,
                                    customer_mobile: undefined,
                                    provider_mobile: undefined,
                                    service_time: undefined,
                                    service_date: undefined,
                                    order: undefined,
                                })
                            }}
                            className="filter-search ml-3"
                        >
                            Clear
                        </Button>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-4 col-lg-4 col-4">
                        <label className="filter-label">Order ID</label>
                        <input
                            type="number"
                            name="id"
                            value={order_id ? order_id : ""}
                            placeholder="Enter order ID"
                            className="filter-input"
                            onChange={e => {
                                setOrderid(e.target.value)
                            }}
                        />
                    </div>

                    <div className="col-md-4 col-lg-4 col-4">
                        <SelectInput
                            name="role"
                            label="Service Type"
                            onChange={(e: React.ChangeEvent) => {
                                setSelectNone(false)
                                setServiceId(
                                    (e.target as HTMLInputElement)
                                        .value as "True"
                                )
                            }}
                        >
                            {selectnone && 
                                <option selected value="None">
                                    None
                                </option>
                             || <option  value="None">None</option>}
                            {servicetypes.map(status => {
                                return (
                                    <option value={status.id}>
                                        {" "}
                                        {status.name}{" "}
                                    </option>
                                )
                            })}
                            
                        </SelectInput>
                    </div>
                    <div className="col-md-4 col-lg-4 col-4">
                        <SelectInput
                            name="role"
                            label="Order Status"
                            onChange={(e: React.ChangeEvent) => {
                                setSelectNone(false)
                                setStatusId(
                                    (e.target as HTMLInputElement)
                                        .value as "True"
                                )
                            }}
                        >
                            {selectnone && 
                                <option selected value="None">
                                    None
                                </option>
                             || <option  value="None">None</option>}
                            {statuses.map(status => {
                                return (
                                    <option value={status.id}>
                                        {" "}
                                        {status.name}{" "}
                                    </option>
                                )
                            })}
                            
                        </SelectInput>
                    </div>
                    <div className="col-md-4 col-lg-4 col-4">
                        <SelectInput
                            name="role"
                            label="Order By"
                            onChange={(e: React.ChangeEvent) => {
                                setSelectNone(false)
                                setOrderby(
                                    (e.target as HTMLInputElement)
                                        .value as "True"
                                )
                            }}
                        >
                            {selectnone && 
                                <option selected value="None">
                                    None
                                </option>
                             || <option  value="None">None</option>}
                            <option value="created_at">Created At</option>
                            <option value="updated_at">Updated At </option>
                            <option value="service_date">Service Date</option>
                            <option value="service_time">Service Time</option>
                        </SelectInput>
                    </div>
                    <div className="col-md-4 col-lg-4 col-4">
                        <SelectInput
                            name="role"
                            label="Order"
                            onChange={(e: React.ChangeEvent) => {

                                setSelectNone(false)
                                setOrder(
                                    Number(
                                        (e.target as HTMLInputElement).value as
                                            | "0"
                                            | "1"
                                    ) as unknown as boolean
                                )
                            }}
                        >
                            {
                                selectnone && <option selected value="1">
                                None
                            </option> || <option  value="1">
                                None
                            </option>
                            }
                            <option value="0">Increasing</option>
                            
                            
                        </SelectInput>
                    </div>

                    <div className="col-md-4 col-lg-4 col-4">
                        <label className="filter-label">Customer Mobile</label>
                        <input
                            type="number"
                            name="Customer number"
                            value={customer_mobile ? customer_mobile : ""}
                            placeholder="Enter customer mobile"
                            className="filter-input"
                            onChange={e => {
                                setCustMobile(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md-4 col-lg-4 col-4">
                        <label className="filter-label">Provider Mobile</label>
                        <input
                            type="number"
                            name="Provider number"
                            placeholder="Enter provider mobile"
                            className="filter-input"
                            value={provider_mobile ? provider_mobile : ""}
                            onChange={e => {
                                setProviderMobile(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md-4 col-lg-4 col-4 mt-2">
                        <label className="filter-label">Service Date</label>
                        <DatePicker
                            variant="dialog"
                            openTo="date"
                            format="DD-MM-yyyy"
                            TextFieldComponent={TextField}
                            views={["year", "month", "date"]}
                            value={datestring || new Date()}
                            onChange={val => {
                                val &&
                                    setDateString(
                                        new Date(Date.parse(val.toString()))
                                            .toISOString()
                                            .slice(0, 10) || ""
                                    )
                            }}
                        />
                    </div>
                    <div className="col-md-4 col-lg-4 col-4 mt-2">
                        <label className="filter-label">Service Time</label>
                        <TextField
                            type="time"
                            value={timestring || "00:00"}
                            onChange={e => {
                                console.log(e.target.value)
                                setTimestring(e.target.value)
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                    </div>
                </div>
            </Paper>
            <Table
                loading={!isReady}
                pagination
                pageNo={pagenumber}
                pagesnext={handleNext}
                pagesprevious={handlePrev}
                title="Orders"
            >
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Customer Mobile</th>
                        <th scope="col">Service Type</th>
                        <th scope="col">Service Date</th>
                        <th scope="col">Service Time</th>
                        <th scope="col">Vehicle</th>
                        <th scope="col">Status</th>
                        <th scope="col">Provider Mobile</th>
                        <th scope="col">Provider Name</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Location</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        return (
                            <tr>
                                <td scope="row">{item.id} </td>
                                <td scope="row">
                                    {item.customer.user.first_name}
                                    {item.customer.user.last_name}
                                </td>
                                <td scope="row">{item.customer.user.mobile}</td>
                                <td scope="row">{item.service_type.name}</td>
                                <td scope="row">{item.service_date}</td>
                                <td scope="row">{item.service_time}</td>
                                <td scope="row">
                                    {item.vehicle && item.vehicle.name}
                                </td>
                                <td scope="row">{item.status.name}</td>
                                <td scope="row">
                                    {item.provider && item.provider.user.mobile}
                                </td>
                                <td scope="row">
                                    {item.provider &&
                                        item.provider.user.first_name}{" "}
                                    {item.provider &&
                                        item.provider.user.last_name}
                                </td>
                                <td scope="row">
                                    {item.rating?.order_rate
                                        ? item.rating?.order_rate
                                        : 0}
                                </td>
                                <td scope="row">
                                    {item.rating?.order_rate
                                        ? item.rating?.order_rate
                                        : 0}
                                </td>
                                <td
                                    scope="row"
                                    onClick={() => {
                                        navigate(
                                            `/dashboard/orders/detail?id=${item.id}`
                                        )
                                    }}
                                    className="eye-icon cursor-pointer"
                                >
                                    <BsEye />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(Item)
