import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "components/adminlayout/adminlayout"
import { Paper } from "components/paper/paper"

import Switch from "react-ios-switch"
import Button from "components/button/button"
import { Table } from "components/table/table"
import { AiOutlinePlus } from "react-icons/ai"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useQueryParam } from "hooks/useQueryParam"
import { useGet } from "hooks/useGet"
import {
    IVehicleDetails,
    IServiceType,
    IProviderTypeVehicle,
    ILocations,
} from "helpers/interfaces"
import { usePut } from "hooks/usePut"
import { useToasts } from "react-toast-notifications"
import { api } from "api"
import withAuth from "../../components/withAuth/withAuth"
import DetailInputGroup from "../../components/inputdetails/inputdetails"
import { handleErrors, validateFields } from "helpers/helpers"
import { AddServiceTypetoVehiclePopup } from "../../components/popup/addServicetypeToVehicle"
import ShiftPopup from "../../components/popup/AddShiftPopUp"
import { AddProvidertoVehiclePopup } from "../../components/popup/addProviderToVehiclepopup"
import { BsEye } from "react-icons/bs"
import { navigate } from "gatsby"
import { AddLocationtoVehiclePopup } from "components/popup/AddLocationToVehiclePopup"
import TextField from "@material-ui/core/TextField"

const ServiceTableRow = ({
    service,
    refresh,
}: {
    service: IServiceType
    refresh: () => void
}) => {
    const handleNavigate = async () => {
        navigate(`/dashboard/servicesdetail?id=${service.id}`)
    }

    return (
        <tr>
            <td scope="row">{service.id}</td>
            <td>{service.name}</td>
            <td>{service.name_ar}</td>

            <td onClick={handleNavigate} className="eye-icon cursor-pointer">
                <BsEye />
            </td>
        </tr>
    )
}

const ProvidersTableRow = ({
    provider,
}: {
    provider: IProviderTypeVehicle
}) => {
    return (
        <tr>
            <td scope="row">{provider.user.id}</td>
            <td scope="row">
                {provider.user.first_name} {provider.user.last_name}
            </td>
        </tr>
    )
}

const LocationsTableRow = ({
    location,
    refresh,
    id,
}: {
    location: ILocations
    refresh: () => void
    id: string
}) => {
    const { addToast } = useToasts()

    const handleDelete = async () => {
        try {
            await api.delete("/api/v2/providers/vehicles/locations", {
                headers: {},
                data: {
                    location_id: location.id,
                    vehicle_id: id,
                },
            })

            addToast("Location Deleted", {
                autoDismiss: true,
                appearance: "success",
            })
            refresh()
        } catch (e) {
            addToast("An Error Occurred", {
                autoDismiss: true,
                appearance: "error",
            })
        }
    }

    return (
        <tr>
            <td scope="row">{location.id}</td>
            <td scope="row">{location.area}</td>
            <td>{location.city}</td>
            <td>{location.is_active.toString()}</td>
            <td onClick={handleDelete} className="eye-icon cursor-pointer">
                <RiDeleteBin6Line />
            </td>
        </tr>
    )
}

const ShiftRow = ({
    title,
    startTime,
    endTime,
    active,
}: {
    title: string
    startTime: string
    endTime: string
    active: boolean
}) => {
    return (
        <tr className="mb-5">
            <td>{title}</td>
            <td>
                <TextField
                    id="startTime"
                    type="time"
                    disabled
                    value={startTime}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
            </td>
            <td>
                <TextField
                    disabled
                    id="startTime"
                    type="time"
                    value={endTime}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
            </td>
            <td>
                <input
                    style={{
                        height: "21px",
                        zIndex: 999,
                        position: "relative",
                    }}
                    
                    checked={active}
                    className="py-3 my-2 w-100"
                    type="checkbox"
                />
            </td>
        </tr>
    )
}

const Servicedetail = () => {
    const id = useQueryParam("id")

    const { data: serviceData, refetchData } = useGet<IVehicleDetails | null>(
        `/api/v2/providers/vehicles/${id}`,
        null,
        [id]
    )

    const [service, setState] = useState<IVehicleDetails | null>(null)
    const savedState = useRef<IVehicleDetails | null>(null)
    const { addToast } = useToasts()

    useEffect(() => {
        if (serviceData) {
            setState(serviceData)

            savedState.current = serviceData
        }
    }, [serviceData])

    const handleChange = (name: keyof IVehicleDetails) => (
        e: React.ChangeEvent<any>
    ) => {
        const val = e.target.value
        setState(old => (!old ? old : { ...old, [name]: val }))
    }

    const toggleIsCary = () => {
        setState(old => {
            if (!old) {
                return old
            }
            return { ...old, is_cary: !old.is_cary }
        })
    }

    const toggleIsActive = () => {
        setState(old => {
            if (!old) {
                return old
            }
            return { ...old, is_active: !old.is_active }
        })
    }

    const { put } = usePut<Omit<IVehicleDetails, "id">>(
        "/api/v2/providers/vehicles/" + id
    )

    const saveChanges = async () => {

        setIsSaving(true)
        let arrayClientErrors: string[] = []
        try {
            if (!service) {
                return
            }

            const { id, name, is_active, is_cary } = service
            arrayClientErrors = validateFields(
                { id, name, is_active, is_cary },
                addToast
            )

            if (arrayClientErrors.length > 0) return

            await put({ name: name, is_active: is_active, is_cary: is_cary })
            savedState.current = { ...service }

            addToast("Details Saved", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
            refetchData()
            handleErrors(e, addToast, arrayClientErrors, "image_url")
        }

        finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        setState(savedState.current)
    }

    const [isSaving , setIsSaving] = useState(false)
    const [addSerivicePopup, SE] = useState(false)
    const [addProvider, setAddProvider] = useState(false)
    const [locationPopup, setLocationPopup] = useState(false)
    const [addshiftPopup, setAddShifTPopup] = useState(false)

    return (
        <AdminLayout title="Vehicles">
            <Paper className="mt-5 p-5">
                <div className="filter">
                    <h3 className="font-weight-normal">Vehicle details</h3>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <DetailInputGroup
                            type="number"
                            label="ID"
                            disabled
                            value={service?.id}
                        />
                        <div>
                            <div className="text-center mt-4">
                                <span className="popup-switch mr-2">
                                    Is Cary
                                </span>
                                <Switch
                                    checked={service?.is_cary}
                                    handleColor="white"
                                    offColor="white"
                                    onColor="#007BFF"
                                    onChange={toggleIsCary}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div>
                            <DetailInputGroup
                                type="text"
                                label="Name"
                                name="name"
                                onChange={handleChange("name")}
                                value={service?.name}
                            />
                        </div>
                        <div>
                            <div className="text-center mt-4">
                                <span className="popup-switch mr-2">
                                    Is Active
                                </span>
                                <Switch
                                    checked={service?.is_active}
                                    handleColor="white"
                                    offColor="white"
                                    onColor="#007BFF"
                                    onChange={toggleIsActive}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12  text-right">
                        <div className="User-submit text-right">
                            <Button
                                className="btn mt-5 text-right"
                                onClick={saveChanges}
                                loading={isSaving}
                            >
                                Save Changes
                            </Button>
                            <Button onClick={handleReset} variant="outline">
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </Paper>

            <Table
                title="Service Types"
                button={
                    <Button
                        onClick={() => SE(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus /> Add
                    </Button>
                }
            >
                {addSerivicePopup && (
                    <AddServiceTypetoVehiclePopup
                        id={id}
                        onAdd={refetchData}
                        onClose={() => {
                            SE(false)
                        }}
                    />
                )}
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name_Ar</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {serviceData?.service_types?.map(item => {
                        return (
                            <ServiceTableRow
                                refresh={refetchData}
                                service={item}
                            />
                        )
                    })}
                </tbody>
            </Table>
            <Table
                title="Providers"
                button={
                    <Button
                        onClick={() => setAddProvider(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus /> Add
                    </Button>
                }
            >
                {addProvider && (
                    <AddProvidertoVehiclePopup
                        id={id}
                        onAdd={refetchData}
                        onClose={() => {
                            setAddProvider(false)
                        }}
                    />
                )}
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                    </tr>
                </thead>
                <tbody>
                    {serviceData?.providers?.map(item => {
                        return <ProvidersTableRow provider={item} />
                    })}
                </tbody>
            </Table>
            <Table
                title="Locations"
                button={
                    <Button
                        onClick={() => setLocationPopup(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus /> Add
                    </Button>
                }
            >
                {locationPopup && (
                    <AddLocationtoVehiclePopup
                        id={id}
                        onAdd={refetchData}
                        onClose={() => setLocationPopup(false)}
                    />
                )}
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Area</th>
                        <th scope="col">City</th>
                        <th scope="col">Is Active</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {serviceData?.locations?.map(item => {
                        return (
                            <LocationsTableRow
                                refresh={refetchData}
                                location={item}
                                id={id}
                            />
                        )
                    })}
                </tbody>
            </Table>

            <Table
                title="Shifts"
                button={
                    <>
                        <Button
                            onClick={() => setAddShifTPopup(true)}
                            className="Add-btn ml-2 p-2 px-3"
                        >
                            Update
                        </Button>
                    </>
                }
            >
                {addshiftPopup && (
                    <ShiftPopup
                        onAdd={refetchData}
                        previousShifts={serviceData?.shifts || []}
                        onClose={() => {
                            setAddShifTPopup(false)
                        }}
                    />
                )}
                <thead className="table-head">
                    <tr>
                        <th scope="col">Day</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">End Time</th>
                        <th scope="col">Is Enabled</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ].map(day => {
                        const shift = serviceData?.shifts?.find(item => item.day === day);
                        const endTime = shift?.end_time || "00:00";
                        const startTime = shift?.start_time || "00:00";

                        return (
                            <ShiftRow
                                title={day}
                                active={!!shift}
                                endTime={endTime}
                                startTime={startTime}
                            />
                        )
                    })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(Servicedetail)
