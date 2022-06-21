import React, { useState, useEffect } from "react"
import Button from "../../components/button/button"

import AdminLayout from "../../components/adminlayout/adminlayout"
import { AiOutlinePlus } from "react-icons/ai"
import { Paper } from "../../components/paper/paper"
import { Table } from "../../components/table/table"
import { BsEye } from "react-icons/bs"
import { useGet } from "hooks/useGet"
import { IItem, IItemType, IRole } from "helpers/interfaces"
import withAuth from "components/withAuth/withAuth"
import AddItemtypepopup from "../../components/popup/itemtypepopup"
import AddItempopup from "../../components/popup/itempopup"
import { RiDeleteBin6Line } from "react-icons/ri"
import { api } from "api"
import { navigate } from "gatsby"
import { useToasts } from "react-toast-notifications"
import FilterInputGroup from "components/filterinputgroup/filterinputgroup"
import SelectInput from "../../components/Selectinput/selectinput"
import { BiPencil } from "react-icons/bi";

const Item = () => {
    const [pagenumber, setPagenumber] = useState(1)
    const [name, setName] = useState("")
    const [itemtypeid, setItemtypeid] = useState("")

    const [carmakeId, setCarMakeId] = useState<string | null>(null)

    const { data: carMakes } = useGet<IRole[]>(`/api/v2/cars/makes`, [])

    const { data: carModels } = useGet<IRole[]>(
        `/api/v2/cars/makes/${carmakeId}/models`,
        [],
        [carmakeId]
    )

    const [carmodelid, setCarmodelid] = useState("")
    const [yearto, setYearto] = useState("")

    const [serialnumber, setSerialnumber] = useState("")

    const {
        data: itemType,
        isReady: itemTypeReady,
        refetchData: refetchTypes,
    } = useGet<IItemType[]>("/api/v2/items/types", [])

    const { addToast } = useToasts()

    const getItemType = (id: number) => {
        const index = itemType.findIndex(type => type.id === id)
        if (index === -1) {
            return null
        }
        return itemType[index]
    }

    const { data, isReady, refetchData } = useGet<
        IItem[],
        {
            name: string
            item_type_id: number
            car_model_id: number
            year: number
            serial_number: string
            available_only: boolean
            page: number
        }
    >(`/api/v2/items`, [], [null])

    useEffect(() => {
        refetchData({
            name: name ? name : undefined,
            item_type_id: itemtypeid ? parseInt(itemtypeid) : undefined,
            car_model_id: carmodelid ? parseInt(carmodelid) : undefined,
            year: yearto ? parseInt(yearto) : undefined,
            serial_number: serialnumber ? serialnumber : undefined,
            page: pagenumber,
        }).then(data => {
            if (data && data.length === 0) {
                addToast("No more Items", {
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

    const handleDelete = (item: IItemType) => async () => {
        try {
            const result = await api.delete(`/api/v2/items/types/${item.id}`)
            console.log(result)

            addToast(
                "Item deleted",
                {
                    autoDismiss: true,
                    appearance: "success",
                }
            )
        } catch (e) {
            addToast(
                "Item type contain items, It cannot be deleted or it can be due to lost internet connection",
                {
                    autoDismiss: true,
                    appearance: "error",
                }
            )
            return
        }

        refetchTypes()
    }

    const [isOpen, setIsOpen] = useState(false)
    const [isEditOpen, setEditIsOpen] = useState(false)
    const [item , setItem] = useState<any>('')
    const [isAddOpen, setIsAddOpen] = useState(false)

    function gotonextpage() {
        setPagenumber(pagenumber + 1)
    }

    function gotopreviouspage() {
        if (pagenumber == 1) return
        setPagenumber(pagenumber - 1)
    }

    function handleEdit (item: IItemType) {
        console.log(item)
        setEditIsOpen(true)
        setItem({...item})
    }

    const [selectedVal, setSelected] = useState<"True" | "False">("False")

    const onButtonClick = () => {
        refetchData({
            name: name ? name : undefined,
            item_type_id: itemtypeid ? parseInt(itemtypeid) : undefined,
            car_model_id: carmodelid ? parseInt(carmodelid) : undefined,
            year: yearto ? parseInt(yearto) : undefined,
            serial_number: serialnumber ? serialnumber : undefined,
            available_only: selectedVal === "True",
        })
    }

    return (
        <AdminLayout title="Item">
            <div className="mt-5">
                {isAddOpen && (
                    <AddItempopup
                        onAdd={refetchData}
                        onClose={() => setIsAddOpen(false)}
                    />
                )}
                {isOpen && (
                    <AddItemtypepopup

                        onAdd={refetchTypes}
                        onClose={() => setIsOpen(false)}
                    />
                )}
                {isEditOpen && (
                    <AddItemtypepopup
                        editPopUp={true}
                        item={item}
                        onAdd={refetchTypes}
                        onClose={() => setEditIsOpen(false)}
                    />
                )}
            </div>
            <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <Button onClick={onButtonClick} className="filter-search">
                        Go
                    </Button>
                </div>
                <div className="row mt-2">
                    <div className="col-md-4 mt-md-0 mt-3 px-lg-2 col-lg">
                        <FilterInputGroup
                            type="text"
                            label="Name"
                            placeholder="Enter Name"
                            onChange={e => {
                                setName(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md-4 mt-md-0 mt-3 px-lg-2  col-lg">
                        <FilterInputGroup
                            type="number"
                            label="Item type ID"
                            placeholder="Enter Item type ID"
                            onChange={e => {
                                setItemtypeid(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md-4 mt-md-0 mt-3 px-lg-2  col-lg-2">
                        <SelectInput
                            label="Select Car Make"
                            name="role"
                            onChange={(e: React.ChangeEvent) => {
                                if (
                                    (e.target as HTMLInputElement).value ===
                                    "Null"
                                ) {
                                    setCarmodelid("")
                                    return setCarMakeId(null)
                                }
                                setCarMakeId(
                                    (e.target as HTMLInputElement).value
                                )
                            }}
                        >
                            {carMakes.map(status => {
                                return (
                                    <option value={status.id}>
                                        {status.name}
                                    </option>
                                )
                            })}
                            <option selected value={"Null"}>
                                None
                            </option>
                        </SelectInput>
                        {carmakeId !== null && (
                            <>
                                <SelectInput
                                    label="Select Car Model"
                                    name="role"
                                    onChange={(e: React.ChangeEvent) => {
                                        if (
                                            (e.target as HTMLInputElement)
                                                .value === "Null"
                                        ) {
                                            return setCarmodelid("")
                                        }
                                        setCarmodelid(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }}
                                >
                                    {carModels.map(status => {
                                        return (
                                            <option value={status.id}>
                                                {status.name}
                                            </option>
                                        )
                                    })}
                                    <option selected value="Null">
                                        None
                                    </option>
                                </SelectInput>
                            </>
                        )}
                    </div>

                    <div className="col-md-4 mt-md-0 mt-3 px-lg-2  col-lg">
                        <FilterInputGroup
                            type="number"
                            label="Year"
                            placeholder="Enter Year"
                            onChange={e => {
                                setYearto(e.target.value)
                            }}
                        />
                    </div>

                    <div className="col-md-4 mt-md-0 mt-3 px-lg-2 col-lg">
                        <FilterInputGroup
                            type="text"
                            label="Serial Number"
                            placeholder="Enter Serial Number"
                            onChange={e => {
                                setSerialnumber(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md-4 mt-md-0 mt-3 px-lg-2 col-lg">
                        <SelectInput
                            label="Available Only"
                            name="role"
                            onChange={(e: React.ChangeEvent) => {
                                setSelected(
                                    (e.target as HTMLInputElement)
                                        .value as "True"
                                )
                            }}
                        >
                            <option value="True"> True </option>
                            <option selected value="False">
                                False
                            </option>
                        </SelectInput>
                    </div>
                </div>
            </Paper>
            <Table
                loading={!itemTypeReady}
                button={
                    <Button onClick={() => setIsOpen(true)}>
                        <AiOutlinePlus className="plus-icon" /> Add
                    </Button>
                }
                title="Item types"
            >
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name - Ar</th>
                        <th scope="col">Uniqure ID</th>
                        <th scope="col">Is Active</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {itemType.map(item => {
                        return (
                            <tr>
                                <td scope="row">{item.id} </td>
                                <td>{item.name} </td>
                                <td>{item.name_ar} </td>
                                <td>{item.unique_identifier}</td>
                                <td>
                                    {item.is_active ? "Is Active" : "Disabled"}
                                </td>
                                <td
                                >
                                    <span style={{width:'30px',display:'inline-block'}} className='mr-4 bin-icon cursor-pointer' onClick={handleDelete(item)}>
                                        <RiDeleteBin6Line />
                                    </span>
                                    <span style={{width:'35px',display:'inline-block'}} className='bin-icon cursor-pointer' onClick={() => {handleEdit(item)}}>
                                        <BiPencil/>
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Table
                loading={!isReady}
                title="Items"
                pagesnext={gotonextpage}
                pagesprevious={gotopreviouspage}
                pagination={true}
                pageNo={pagenumber}
                button={
                    <Button onClick={() => setIsAddOpen(true)}>
                        <AiOutlinePlus className="plus-icon" /> Add
                    </Button>
                }
            >
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name - Ar</th>
                        <th scope="col">Serial Number</th>
                        <th scope="col">Price</th>
                        <th scope="col">Description</th>
                        <th scope="col">Description_Ar</th>
                        <th scope="col">Item type</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Is Active</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        return (
                            <tr>
                                <td scope="row">{item.id}</td>
                                <td scope="row">{item.title}</td>
                                <td scope="row">{item.title_ar}</td>
                                <td scope="row">{item.serial_number}</td>
                                <td scope="row">{item.price}</td>
                                <td scope="row">{item.description}</td>
                                <td scope="row">{item.description_ar}</td>
                                <td scope="row">
                                    {getItemType(item.item_type_id)?.name}
                                </td>
                                <td scope="row">{item.total_quantity}</td>
                                <td scope="row">
                                    {item.is_active ? "Is Active" : "Disabled"}
                                </td>
                                <td
                                    onClick={() =>
                                        navigate(
                                            "/dashboard/itemdetail?id=" +
                                                item.id +
                                                "&total=" +
                                                item.total_quantity
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

export default withAuth(Item)
