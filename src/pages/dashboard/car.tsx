import React, { useState } from "react"
import { AllCarMakes } from "../../helpers/interfaces"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { AiOutlinePlus } from "react-icons/ai"
import { Table } from "../../components/table/table"
import { BsEye } from "react-icons/bs"
import { useGet } from "hooks/useGet"
import withAuth from "components/withAuth/withAuth"
import { navigate } from "gatsby"
import { BiPencil } from "react-icons/bi"
import { AddCarMakePopup } from "components/popup/AddCarMakePopup"
import Button from "../../components/button/button"

const CarRow = ({
    item,
    refetchData,
}: {
    item: AllCarMakes
    refetchData: () => void
}) => {
    const [isEditOpen, setIsEditOpen] = useState(false)

    return (
        <tr>
            {isEditOpen && (
                <AddCarMakePopup
                    editItem={item}
                    onClose={() => setIsEditOpen(false)}
                    onDone={refetchData}
                />
            )}
            <td scope="row">{item.id} </td>
            <td>{item.name}</td>
            <td>{item.name_ar}</td>
            <td>
                <span
                    style={{
                        width: "52px",
                        display: "inline-block",
                        height: "45px",
                    }}
                    onClick={() => setIsEditOpen(true)}
                    className="bin-icon cursor-pointer"
                >
                    <BiPencil style={{ marginTop: "13px" }} />
                </span>

                <span
                    style={{
                        width: "52px",
                        display: "inline-block",
                        marginLeft: "10px",
                        height: "45px",
                    }}
                    onClick={() =>
                        navigate("/dashboard/cardetail?id=" + item.id)
                    }
                    className="eye-icon cursor-pointer"
                >
                    <BsEye style={{ marginTop: "13px" }} />
                </span>
            </td>
        </tr>
    )
}

const Item = () => {
    const {
        data: itemType,
        isReady: itemTypeReady,
        refetchData: refetchTypes,
    } = useGet<AllCarMakes[]>("/api/v2/cars/makes", [])

    const [isAddOpen, setIsAddOpen] = useState(false)

    return (
        <AdminLayout title="Cars">
            <div className="mt-5">
                {isAddOpen && (
                    <AddCarMakePopup
                        onDone={refetchTypes}
                        onClose={() => setIsAddOpen(false)}
                    />
                )}

                <Button
                    onClick={() => setIsAddOpen(true)}
                >
                    <AiOutlinePlus className="plus-icon" />
                    Add
                </Button>
            </div>
            <Table loading={!itemTypeReady} title="Cars">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name - Ar</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {itemType.map(item => {
                        return (
                            <CarRow
                                refetchData={refetchTypes}
                                key={item.id}
                                item={item}
                            />
                        )
                    })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(Item)
