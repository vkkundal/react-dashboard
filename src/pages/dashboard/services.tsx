import React, { useState, useEffect } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { AiOutlinePlus } from "react-icons/ai"
import { Paper } from "../../components/paper/paper"
import { Table } from "../../components/table/table"
import { BsEye } from "react-icons/bs"
import { useGet } from "../../hooks/useGet"
import { IService } from "../../helpers/interfaces"
import { navigate } from "gatsby"
import { AddServiceTypePopup } from "../../components/popup/AddServiceTypePopup"
import { useToasts } from "react-toast-notifications"
import withAuth from "../../components/withAuth/withAuth"
import SelectInput from "../../components/Selectinput/selectinput"
import Button from "../../components/button/button"

const Services = () => {
    const { isReady, data, refetchData } = useGet<
        IService[],
        {
            active_only: boolean
        }
    >(`/api/v2/services/types`, [], [null])

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

    useEffect(() => {
        refetchData({
            active_only:
                selectedVal === "Default" ? undefined : selectedVal === "True",
        }).then(data => {
            if (data && data.length === 0) {
                addToast("No more Services", {
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
    const [selectedVal, setSelected] = useState<"True" | "False" | "Default">(
        "Default"
    )

    return (
        <AdminLayout title="Services">
            {isOpen && (
                <AddServiceTypePopup
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
                                active_only:
                                    selectedVal === "Default"
                                        ? undefined
                                        : selectedVal === "True",
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
                            label="Requires car"
                            name="role"
                            onChange={(e: React.ChangeEvent) => {
                                setSelected(
                                    (e.target as HTMLInputElement)
                                        .value as "True"
                                )
                            }}
                        >
                            <option value="True"> Yes </option>
                            <option value="False"> No </option>
                            <option selected value="Default">
                                {" "}
                                Default{" "}
                            </option>
                        </SelectInput>
                    </div>
                </div>
            </Paper>
            <Table
                loading={!isReady}
                title="Latest Services type"
                pageNo={pagenumber}
                pagination
                pagesnext={handleNext}
                pagesprevious={handlePrev}
            >
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name - Ar</th>
                        <th scope="col">Description</th>
                        <th scope="col">Description - Ar</th>
                        <th scope="col">Requires car</th>
                        <th scope="col">Is Active</th>
                        <th scope="col">Is Scheduled</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        return (
                            <tr key={item.id}>
                                <td scope="row"> {item.id} </td>
                                <td scope="row">{item.name}</td>
                                <td scope="row">{item.name_ar} </td>
                                <td scope="row">{item.description}</td>
                                <td scope="row">{item.description_ar}</td>
                                <td scope="row">
                                    {item.requires_car ? "Yes" : "No"}
                                </td>
                                <td scope="row">
                                    {item.is_active ? "Active" : "Disabled"}
                                </td>
                                <td scope="row">
                                    {item.is_scheduled ? "True" : "False"}
                                </td>
                                <td
                                    className="cursor-pointer eye-icon"
                                    onClick={() => {
                                        navigate(
                                            `/dashboard/servicesdetail?id=${item.id}`
                                        )
                                    }}
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

export default withAuth(Services)
