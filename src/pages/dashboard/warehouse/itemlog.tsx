import React, { useEffect, useState } from "react"
import AdminLayout from "components/adminlayout/adminlayout"
import { Table } from "components/table/table"
import { useGet } from "hooks/useGet"
import { IGetWarehouseItemMovement } from "helpers/interfaces"
import { useQueryParam } from "hooks/useQueryParam"
import moment from "moment";
import { useToasts } from "react-toast-notifications"
import withAuth from "../../../components/withAuth/withAuth"

const Warehouseitemlog = () => {
    const id = useQueryParam("id")
    const [pagenumber, setPagenumber] = useState(1)

    const { data, isReady } = useGet<IGetWarehouseItemMovement[]>(
        `/api/v2/warehouses/${id}/item-movement?page=${pagenumber}`,
        [],
        [id, pagenumber]
    )

    const { addToast } = useToasts()

    useEffect(() => {

        if(data.length == 0 && pagenumber != 1) {

            addToast("No more items", {
                        autoDismiss: true,
                        appearance: "error",
                    })
            
                    setPagenumber(pagenumber - 1)

        }
       
       
       
    }, [ data])

    function gotonextpage() {
        if(pagenumber == 1) return; 
        setPagenumber(pagenumber - 1)
    }

    function gotopreviouspage() {
        setPagenumber(pagenumber + 1)
    }
    return (
        <AdminLayout title="Warehouses">
            {/* <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <button className="btn filter-search">Go</button>
                </div>
                <div className="row">
                    <div className="col-md">
                        <label className="filter-label">Item ID</label>
                        <input
                            type="text"
                            name="first_name"
                            className="filter-input"
                        />
                    </div>
                    <div className="col-md">
                        <label className="filter-label">Date from</label>
                        <input
                            type="text"
                            name="first_name"
                            className="filter-input"
                        />
                    </div>
                    <div className="col-md">
                        <label className="filter-label">Date to</label>
                        <input
                            type="text"
                            name="first_name"
                            className="filter-input"
                        />
                    </div>
                    <div className="col-md">
                        <label className="filter-label">Movement type</label>
                        <select name="role" className="User-select">
                            <option> Return </option>
                            <option> All </option>
                        </select>
                    </div>
                    <div className="col-md">
                        <label className="filter-label">
                            {" "}
                            Provider Mobile{" "}
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            className="filter-input"
                        />
                    </div>
                </div>
            </Paper> */}

            <Table loading={!isReady} title="Item movement log" pagesnext={gotopreviouspage} pagesprevious={ gotonextpage} pagination={true} pageNo={pagenumber}>
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Item ID</th>
                        <th scope="col">Provider ID</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Is Return</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(log => {
                        return (
                            <tr>
                                <td scope="row"> {log.id} </td>
                                <td>{log.item.id}</td>
                                <td>{log.provider.user.id} </td>
                                <td>{log.provider.user.first_name} </td>
                                <td>{log.provider.user.last_name} </td>
                                <td>{log.provider.user.mobile} </td>
                                <td>{log.quantity}</td>
                                <td>{log.is_returning ? "True": "False"} </td>
                                <td>{moment(log.created_at).format("DD/MM/YYYY")}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(Warehouseitemlog)
