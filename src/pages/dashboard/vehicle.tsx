import React, {  useState } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { Table } from "../../components/table/table"
import { BsEye } from "react-icons/bs"
import { navigate } from "gatsby"
import withAuth from "../../components/withAuth/withAuth"
import { AiOutlinePlus } from "react-icons/ai"
import { AddNewCarProvider } from "../../components/popup/AddnewVehicle"
import { useGet } from "hooks/useGet"
import Button from "../../components/button/button"
import { IVehicleDetails } from "../../helpers/interfaces"
const Vehicle = () => {
    const [isAddOpen, setAddOpen] = useState(false)

    const { isReady, data: Cars, refetchData: refetchCars } = useGet<
        IVehicleDetails[]
    >(`/api/v2/providers/vehicles`, [])

    const [isOpen, setIsOpen] = useState(false)

    return (
        <AdminLayout title="Vehicles">
            <div className="mt-5">
                {isOpen && (
                    <AddNewCarProvider
                        onClose={() => setIsOpen(false)}
                        onDone={() => {
                            refetchCars()
                        }}
                    />
                )}
                <Button onClick={() => setIsOpen(true)}>
                    <AiOutlinePlus className="plus-icon" />
                    Add
                </Button>
            </div>

            {isAddOpen && (
                <AddNewCarProvider
                    onClose={() => {
                        setAddOpen(false)
                    }}
                />
            )}
            <Table loading={!isReady} title="All Vehicles">
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
                    {Cars.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td scope="row"> {item.id} </td>
                                <td>{item.name}</td>
                                <td scope="row">
                                    {" "}
                                    {item.is_active.toString()}{" "}
                                </td>
                                <td scope="row"> {item.is_cary.toString()} </td>
                                <td
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/vehicledetail?id=${item.id}`
                                        )
                                    }
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

export default withAuth(Vehicle)
