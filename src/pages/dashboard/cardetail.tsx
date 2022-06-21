import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { Paper } from "../../components/paper/paper"
import { Table } from "../../components/table/table"
import { AiOutlinePlus } from "react-icons/ai"
import { useQueryParam } from "hooks/useQueryParam"
import { useGet } from "hooks/useGet"
import {
    AllCarMakes,
    CarDetailById,
} from "helpers/interfaces"
import { usePut } from "hooks/usePut"
import AddCarModelPopup from "components/popup/AddCarModelPopup"
import { BiPencil } from "react-icons/bi"
import Button from "../../components/button/button"
import { find } from "lodash"
import { useToasts } from "react-toast-notifications"
import withAuth from "../../components/withAuth/withAuth"
import DetailInputGroup from "../../components/inputdetails/inputdetails"
import { validateFields, handleErrors } from "helpers/helpers"

const CarDetailRow = ({
    item,
    refetch,
    queryId,
}: {
    item: CarDetailById
    refetch: () => void
    queryId: any
}) => {
    const [isEditOpen, setIsEditOpen] = useState(false)

    return (
        <tr>
            {isEditOpen && (
                <AddCarModelPopup
                    car_make_id={queryId}
                    onAdd={refetch}
                    onClose={() => setIsEditOpen(false)}
                    nameModel={item.name}
                    name_ar={item.name_ar}
                    edit
                    model_id={item.id}
                    model_oilChange={item.allow_oil_change}
                    model_size={item.size}
                />
            )}
            <td scope="row"> {item.id} </td>
            <td>{item.name}</td>
            <td>{item.name_ar}</td>
            <td>{item.size}</td>
            <td>{item.allow_oil_change ? "True" : "False"}</td>
            <td
                onClick={() => setIsEditOpen(true)}
                className="bin-icon edit cursor-pointer"
            >
                <BiPencil />
            </td>
        </tr>
    )
}

const Cardetail = () => {
    const id = useQueryParam("id")

    const {
        data: itemType,
        isReady: itemTypeReady,
    } = useGet<AllCarMakes[]>("/api/v2/cars/makes", [])
    const { data, isReady, refetchData } = useGet<CarDetailById[] | null>(
        `/api/v2/cars/makes/${id}/models`,
        null,
        [id]
    )

    const CarMake = itemTypeReady
        ? find(itemType, item => item.id === parseInt(id))
        : undefined

    const [carmake, setCarmake] = useState<AllCarMakes | null>(null)

    const { isSending, put } = usePut<{
        name: string
        name_ar: string
    }>(`/api/v2/cars/makes/${id}`)

    const { addToast } = useToasts()

    const oldRef = useRef<AllCarMakes | null>(null);

    const handleSave = async () => {

        const arrayClientErrors = validateFields(carmake,addToast);

        console.log(arrayClientErrors)

        try {
            if (carmake) {
                await put(carmake)
                oldRef.current = carmake
                addToast("Car Make Updated", {
                    autoDismiss: true,
                    appearance: "success",
                })
            }
        } catch (e) {
            handleErrors(e , addToast , arrayClientErrors)

        }
    }


    const onReset = () => {
        setCarmake(oldRef.current);
    }

    useEffect(() => {
        if (CarMake) {
            setCarmake(CarMake)
            oldRef.current = CarMake;
        }
    }, [CarMake])

    const handleChange = (k: keyof AllCarMakes) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCarmake(old  => !old ? old: ({...old, [k]:val }))
    }

    const [isAddOpen, setAddOpen] = useState(false)

    return (
        <AdminLayout title="Cars">
            {isAddOpen && (
                <AddCarModelPopup
                    onAdd={refetchData}
                    onClose={() => setAddOpen(false)}
                    car_make_id={id}
                />
            )}
            <Paper className="mt-5 p-5">
                <div className="filter">
                    <h3 className="font-weight-normal">Car Details</h3>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="User-details">
                           
                            <DetailInputGroup

                                        type="number"
                                        label="ID"
                                        disabled
                                        value={id}
                                    />
                        </div>
                        <div className="first-name">
                            
                            <DetailInputGroup
                                        type="text"
                                        label="Name"
                                        name="name"
                                        onChange={handleChange("name")}
                                        disabled={isSending}
                                        value={carmake?.name}
                                    />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-none d-sm-block mb-3">
                            <br />
                            <br />
                            <br />{" "}
                        </div>
                        <div className="Description">
                            <div className="Name">
                               
                                <DetailInputGroup
                                        type="text"
                                        label="Name Ar"
                                        name="name"
                                        onChange={handleChange("name_ar")}
                                        disabled={isSending}
                                        value={carmake?.name_ar}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="User-form">
                    <div className="User-submit text-right">
                        <Button loading={isSending} onClick={handleSave} className="btn mt-5 text-right">
                            Save Changes
                        </Button>
                        <Button onClick={onReset}  variant = "outline">
                            Reset
                        </Button>
                    </div>
                </div>
            </Paper>
            <Table
                title="Car Models"
                loading={!isReady}
                button={
                    <Button
                        onClick={() => setAddOpen(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus /> Add
                    </Button>
                }
            >
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name_ar</th>
                        <th scope="col">Size</th>
                        <th scope="col">Allow Size Change</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.map(car => {
                            return (
                                <CarDetailRow
                                    item={car}
                                    refetch={refetchData}
                                    queryId={id}
                                />
                            )
                        })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(Cardetail)
