import React, { useState } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { Paper } from "../../components/paper/paper"
import { Table } from "../../components/table/table"
import { BsEye } from "react-icons/bs"
import { IProviderData } from "../../helpers/interfaces"
import { navigate } from "gatsby"
import withAuth from "../../components/withAuth/withAuth"
import { AiOutlinePlus } from "react-icons/ai"
import { AddProviderTypePopup } from "../../components/popup/AddProviderTypePopup"
import { AddNewCarProvider } from "../../components/popup/AddnewVehicle"
import { useToasts } from "react-toast-notifications"
import { useGet } from "hooks/useGet"
import FilterInputGroup from "components/filterinputgroup/filterinputgroup"
import SelectInput from "../../components/Selectinput/selectinput"
import Button from "../../components/button/button"
import { useDidUpdate } from "hooks/useDidUpdate"

const Provider = () => {
    const [selectedVal, setSelected] = useState<
        "balance" | "rating" | "rate_count" | "Default"
    >("balance")
    const [firstname, setFirstname] = useState("")

    const [isAddOpen, setAddOpen] = useState(false)
    const [lastname, setLastname] = useState("")
    const [mobile, setMobile] = useState("")
    const [order, setOrder] = useState<0 | 1>(0)
    const [is_scheduled, setIsScheduled] = useState<true | false | "All">("All")
    const { isReady, data, refetchData } = useGet<
        IProviderData[],
        {
            page: number
            last_name: string
            first_name: string
            mobile: string
            order_by: string
            order: 0 | 1
            is_scheduled: boolean
        }
    >(`/api/v2/providers`, [])

    const [pagenumber, setPagenumber] = useState(1)
    const [isOpen, setIsOpen] = useState(false)

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

    useDidUpdate(() => {
        refetchData({
            page: pagenumber,
            first_name: firstname ? firstname : undefined,
            last_name: lastname ? lastname : undefined,
            mobile: mobile ? mobile : undefined,
            order,
            is_scheduled: is_scheduled === "All" ? undefined: is_scheduled,
            order_by: selectedVal !== "Default" ? selectedVal : undefined,
        }).then(data => {
            if (data && data.length === 0) {
                addToast("No more Providers", {
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

    const handleFilter = () => {
        setPagenumber(1)
        refetchData({
            page: pagenumber,
            first_name: firstname ? firstname : undefined,
            last_name: lastname ? lastname : undefined,
            mobile: mobile ? mobile : undefined,
            order,
            is_scheduled: is_scheduled === "All" ? undefined: is_scheduled,
            order_by: selectedVal === "Default" ? undefined : selectedVal,
        })
    }

    return (
        <AdminLayout title="Providers">
            <div className="mt-5">
                {isOpen && (
                    <AddProviderTypePopup
                        onAdd={refetchData}
                        onClose={() => setIsOpen(false)}
                        page={pagenumber}
                        last_name={lastname ? lastname : undefined}
                        first_name={firstname ? firstname : undefined}
                        mobile={mobile ? mobile : undefined}
                        order_by={
                            selectedVal === "Default" ? undefined : selectedVal
                        }
                        order={order}
                    />
                )}
                <Button onClick={() => setIsOpen(true)}>
                    <AiOutlinePlus className="plus-icon" />
                    Add
                </Button>
            </div>

            <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <button
                        className="btn filter-search"
                        onClick={handleFilter}
                    >
                        Go
                    </button>
                </div>
                <div className="row">
                    <div className="col-md">
                        <FilterInputGroup
                            type="text"
                            label="First name"
                            placeholder="Enter First Name"
                            onChange={e => {
                                setFirstname(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md">
                        <FilterInputGroup
                            type="text"
                            label="Last name"
                            placeholder="Enter Last Name"
                            onChange={e => {
                                setLastname(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md">
                        <FilterInputGroup
                            type="tel"
                            label="Mobile"
                            placeholder="Enter Mobile Number"
                            onChange={e => {
                                setMobile(e.target.value)
                            }}
                        />
                    </div>
                    <div className="col-md">
                        <SelectInput
                            label="Is Scheduled"
                            name="role"
                            onChange={(e: React.ChangeEvent<any>) => {
                              const map = {
                                  True: true,
                                  False: false,
                                  All: "All"
                              }
                              setIsScheduled(map[e.target.value as "True"])
                            }}
                        >
                            <option value="All" selected>
                                All
                            </option>
                            <option value="True"> True </option>
                            <option value="False"> False </option>
                        </SelectInput>
                    </div>
                </div>
            </Paper>
            <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Order by</h3>
                </div>
                <div className="row justify-content-center justify-content-lg-left">
                    <div className="col-md-4  px-0">
                        <div className="order-id">
                            <SelectInput
                                onChange={(e: React.ChangeEvent) => {
                                    setSelected(
                                        (e.target as HTMLInputElement)
                                            .value as "balance"
                                    )
                                    console.log(selectedVal)
                                }}
                            >
                                <option value="balance">Balance</option>
                                <option value="rating">Rating</option>
                                <option value="rate_count">Rate count</option>
                            </SelectInput>
                        </div>
                    </div>
                    <div className="col-md-8 col-lg-6 radio text-center">
                        <div className="order-radios">
                            <input
                                type="radio"
                                className="input-radio"
                                value="As Sending"
                                name="order"
                                checked={order === 0}
                                onChange={e => {
                                    setOrder(0)
                                }}
                            />{" "}
                            Ascending
                            <input
                                type="radio"
                                checked={order === 1}
                                className="input-radio"
                                value="Dis Sending"
                                name="order"
                                onChange={e => {
                                    setOrder(1)
                                }}
                            />{" "}
                            Descending
                        </div>
                    </div>
                    <div className="col-md-2 text-center">
                        <button
                            className="btn order-search"
                            onClick={handleFilter}
                        >
                            Go
                        </button>
                    </div>
                </div>
            </Paper>

            <Table
                loading={!isReady}
                title="Latest Providers"
                pagesnext={handleNext}
                pagesprevious={handlePrev}
                pagination={true}
                pageNo={pagenumber}
            >
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Roles</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Rate</th>
                        <th scope="col">Rate Count</th>
                        <th scope="col">Status</th>
                        <th scope="col">Scheduled</th>
                        <th scope="col">Vehicle</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        return (
                            <tr key={item.user.id}>
                                <td scope="row"> {item.user.id} </td>
                                <td>{item.user.first_name}</td>
                                <td>{item.user.last_name}</td>
                                <td>{item.user.mobile}</td>
                                <td>{item.role.name}</td>
                                <td>{item.provider.balance} </td>
                                <td>{item.provider.rating} </td>
                                <td>{item.provider.rate_count} </td>
                                <td>
                                    {item.user.is_active
                                        ? "Active"
                                        : "Disabled"}
                                </td>
                                <td>
                                    {item.provider.is_scheduled
                                        ? "True"
                                        : "False"}
                                </td>
                                <td>
                                    {item.provider.vehicle &&
                                        item.provider.vehicle.name}
                                </td>
                                <td
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/providerdetail?id=${item.user.id}`
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
            {isAddOpen && (
                <AddNewCarProvider
                    onClose={() => {
                        setAddOpen(false)
                    }}
                />
            )}
        </AdminLayout>
    )
}

export default withAuth(Provider)
