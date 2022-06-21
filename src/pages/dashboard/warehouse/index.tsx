import React, { useState, useEffect } from "react"
import AdminLayout from "../../../components/adminlayout/adminlayout"
import { AiOutlinePlus } from "react-icons/ai"
import { Paper } from "../../../components/paper/paper"
import { Table } from "../../../components/table/table"
import { BsEye } from "react-icons/bs"
import { useGet } from "../../../hooks/useGet"
import Warehouseaddpopup from "../../../components/popup/warehouseaddpopup"
import { IWarehouse } from "../../../helpers/interfaces"
import { navigate } from "gatsby"
import { useToasts } from "react-toast-notifications"
import withAuth from "../../../components/withAuth/withAuth"
import SelectInput from "../../../components/Selectinput/selectinput"
import Button from "components/button/button"

const Warehouse = () => {
    const { isReady, data, refetchData } = useGet<
        IWarehouse[],
        {
            active_only: boolean
        }
    >(`/api/v2/warehouses`, [], [null])

    const [pagenumber, setPagenumber] = useState(1)

    const { addToast } = useToasts()

    useEffect(() => {
        refetchData({
            active_only: selectedVal === "True",
        }).then(data => {
            if (data && data.length === 0) {
                addToast("No more Invoices", {
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

    const [isOpen, setIsOpen] = useState(false)
    const [selectedVal, setSelected] = useState<"True" | "False">("False")

    return (
        <AdminLayout title="Warehouses">
            {isOpen && (
                <Warehouseaddpopup
                    onAdd={refetchData}
                    onClose={() => setIsOpen(false)}
                />
            )}
            <div className="mt-5">
                <Button onClick={() => setIsOpen(true)}>
                    <AiOutlinePlus className="plus-icon" />
                    Add
                </Button>
            </div>
            <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <Button
                        onClick={() => {
                            setPagenumber(1)
                            refetchData({
                                active_only: selectedVal === "True",
                            })
                        }}
                        className="filter-search"
                    >
                        Go
                    </Button>
                </div>
                <div className="row">
                    <div className="col-md">
                        
                        <SelectInput
                                        label="Only Active"
                                        name="role"  
                                        onChange={(e : React.ChangeEvent) => {
                                            setSelected((e.target as HTMLInputElement).value as "True")
                                        }}>
                                    <option value="True"> True </option>
                                    <option selected value="False"> False </option>
                         
                        </SelectInput>
                    </div>
                </div>
            </Paper>
            <Table loading={!isReady} title="Warehouses">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Location</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Is Active</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        return (
                            <tr>
                                <td scope="row"> {item.id} </td>
                                <td>{item.name}</td>
                                <td>
                                    Lat: {item.location.lat} Long:{" "}
                                    {item.location.long}{" "}
                                </td>
                                <td>{item.mobile}</td>
                                <td>{item.is_active ? "True": "False"}</td>
                                <td
                                    onClick={() => {
                                        navigate(
                                            `/dashboard/warehouse/detail?id=${item.id}`
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

export default withAuth(Warehouse)
