import React, { useState } from "react"
import AdminLayout from "../../../components/adminlayout/adminlayout"
import { AiOutlinePlus } from "react-icons/ai"
import { Table } from "../../../components/table/table"
import { useQueryParam } from "../../../hooks/useQueryParam"
import { useGet } from "../../../hooks/useGet"
import { IWarehouseitemManagement } from "../../../helpers/interfaces"
import { BiPencil } from "react-icons/bi"
import Warehouseitemaddpopup from "components/popup/warehouseitemaddpopup"
import withAuth from "../../../components/withAuth/withAuth"
import Button from "components/button/button"

const WarehouseItemRow = ({
    item,
    refetch,
}: {
    item: IWarehouseitemManagement
    refetch: () => void
}) => {
    const [isEditOpen, setIsEditOpen] = useState(false)

    return (
        <tr>
            {isEditOpen && (
                <Warehouseitemaddpopup
                    serialNumber={item.item.serial_number}
                    onAdd={refetch}
                    quantity={+item.quantity.toFixed()}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
            <td scope="row"> {item.item.id} </td>
            <td>{item.item.title}</td>
            <td>{item.item.title_ar}</td>
            <td>{item.item.price}</td>
            <td>{item.quantity}</td>
            <td
                onClick={() => setIsEditOpen(true)}
                className="edit cursor-pointer"
            >
                <BiPencil />
            </td>
        </tr>
    )
}

const WarehouseItemManagment = () => {
    const id = useQueryParam("id")

    const { data, isReady, refetchData } = useGet<
        IWarehouseitemManagement[] | null
    >(`/api/v2/warehouses/${id}/items`, null, [id])

    const [isAddOpen, setAddOpen] = useState(false)

    return (
        <AdminLayout title="Warehouses">
            {isAddOpen && (
                <Warehouseitemaddpopup
                    onAdd={refetchData}
                    onClose={() => setAddOpen(false)}
                />
            )}
            <div className="mt-5">
                <Button
                    onClick={() => setAddOpen(true)}
                >
                    <AiOutlinePlus className="plus-icon" />
                    Add
                </Button>
            </div>
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
                            <option> All </option>
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
            <Table loading={!isReady} title="Item management">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name_ar</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(item => {
                        return (
                            <WarehouseItemRow
                                item={item}
                                refetch={refetchData}
                            />
                        )
                    })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(WarehouseItemManagment)
