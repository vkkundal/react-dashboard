import React, { useCallback, useEffect, useRef, useState } from "react"
import AdminLayout from "components/adminlayout/adminlayout"
import { Paper } from "components/paper/paper"

import Switch from "react-ios-switch"
import Button from "components/button/button"
import { Table } from "components/table/table"
import { AiOutlinePlus } from "react-icons/ai"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useQueryParam } from "hooks/useQueryParam"
import { useGet } from "hooks/useGet"
import { IServiceDetail, IServiceType } from "helpers/interfaces"
import { BiPencil } from "react-icons/bi"
import { usePut } from "hooks/usePut"
import { useToasts } from "react-toast-notifications"
import Addservice from "components/popup/addnewservice"
import UpdateServicePopup from "components/popup/updateservicepopup"
import { api } from "api"
import { useFirebase } from "providers/FirebaseProvider"
import { ImageComp } from "components/imagecomp/imagecomp"
import withAuth from "../../components/withAuth/withAuth"
import DetailInputGroup from "../../components/inputdetails/inputdetails"
import { handleErrors, validateFields } from "helpers/helpers"

const ServiceTableRow = ({
    service,
    refresh,
}: {
    service: IServiceType
    refresh: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const { addToast } = useToasts()

    const handleDelete = async () => {
        try {
            await api.delete("/api/v2/services/" + service.id)
            addToast("Service Deleted", {
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
            {isOpen && (
                <UpdateServicePopup
                    service={service}
                    onAdd={refresh}
                    onClose={() => setIsOpen(false)}
                />
            )}
            <td scope="row">{service.id}</td>
            <td>{service.name}</td>
            <td>{service.name_ar}</td>
            <td>{service.unique_identifier}</td>
            <td>{service.price}</td>
            <td>{service.is_active ? "Active" : "Disabled"}</td>
            <td onClick={() => setIsOpen(true)} className="edit cursor-pointer">
                <BiPencil />
            </td>
            <td onClick={handleDelete} className="eye-icon cursor-pointer">
                <RiDeleteBin6Line />
            </td>
        </tr>
    )
}

const servicedetail = () => {
    const id = useQueryParam("id")

    const { data: serviceData } = useGet<IServiceDetail | null>(
        `/api/v2/services/types/${id}`,
        null,
        [id]
    )

    const [service, setState] = useState<IServiceDetail | null>(null)
    const savedState = useRef<IServiceDetail | null>(null)
    const { addToast } = useToasts()
    const firebase = useFirebase()
    useEffect(() => {
        if (serviceData) {
            setState(serviceData)
            savedState.current = serviceData
        }
    }, [serviceData])

    const { data: typeServices, isReady, refetchData } = useGet<
        IServiceType[] | null
    >(`/api/v2/services/types/${id}/services?active_only=false`, null, [id])

    const handleChange = (name: keyof IServiceDetail) => (
        e: React.ChangeEvent<any>
    ) => {
        const val = e.target.value
        setState(old => (!old ? old : { ...old, [name]: val }))
    }

    const toggleRequireCar = () => {
        setState(old => {
            if (!old) {
                return old
            }
            return { ...old, requires_car: !old.requires_car }
        })
    }
    const toggleIsSheduled = () => {
        setState(old => {
            if (!old) {
                return old
            }
            return { ...old, is_scheduled: !old.is_scheduled }
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

    const [imageFile, setImageFile] = useState<File | null>(null)
    const removeImage = () => {
        if (service) {
            setState({ ...service, image_url: "" })
        }
    }

    const { isSending, put, setIsSending } = usePut<Omit<IServiceDetail, "id">>(
        "/api/v2/services/types/" + id
    )

    const saveChanges = async () => {
        let arrayClientErrors: string[] = []
        try {
            setIsSending(true)
            if (!service) {
                return
            }
            if (!imageFile && !service.image_url) {
                addToast("Please Select an Image File", {
                    autoDismiss: true,
                    appearance: "error",
                })
            }

            const { id, ...data } = service
            arrayClientErrors = validateFields(data, addToast, "image_url")

            let imageUrl = service.image_url
            if (imageFile) {
                const storage = firebase.storage().ref()
                const snap = await storage
                    .child(
                        `${process.env.GATSBY_FIREBASE_PREFIX}/Services/` +
                            service.id +
                            ".png"
                    )
                    .put(imageFile)
                const url = await snap.ref.getDownloadURL()
                imageUrl = url
            }

            await put({ ...data, image_url: imageUrl })
            savedState.current = { ...service, image_url: imageUrl }

            addToast("Details Saved", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
            handleErrors(e, addToast, arrayClientErrors, "image_url")
        }
    }

    const handleReset = useCallback(() => {
        setState(savedState.current)
    }, [])

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <AdminLayout title="Services">
            <Paper className="mt-5 p-5">
                <div className="filter">
                    <h3 className="font-weight-normal">Service type details</h3>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="User-details">
                            <DetailInputGroup
                                type="number"
                                label="ID"
                                disabled
                                value={service?.id}
                            />
                        </div>
                        <div className="first-name">
                            <DetailInputGroup
                                type="text"
                                label="Name"
                                name="name"
                                onChange={handleChange("name")}
                                disabled={isSending}
                                value={service?.name}
                            />
                        </div>
                        <div className="Description">
                            <label className="User-label">Description</label>
                            <textarea
                                className="User-input"
                                name="name"
                                placeholder="Type..."
                                value={service?.description}
                                rows={5}
                                disabled={isSending}
                                onChange={handleChange("description")}
                            />
                        </div>
                        <div className="Price">
                            <div className="popup-status text-center mt-4">
                                <span className="popup-switch mr-2">
                                    Requires Car
                                </span>
                                <Switch
                                    checked={service?.requires_car}
                                    handleColor="white"
                                    offColor="white"
                                    onColor="#007BFF"
                                    onChange={toggleRequireCar}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="popup-status text-center mt-4 mb-4">
                            <span className="popup-switch mr-2">
                                Is Active{" "}
                            </span>
                            <Switch
                                checked={service?.is_active}
                                handleColor="white"
                                offColor="white"
                                onColor="#007BFF"
                                onChange={toggleIsActive}
                            />
                        </div>
                        <div className="Description">
                            <div className="Name">
                                <DetailInputGroup
                                    type="text"
                                    label="Name_Ar"
                                    name="name"
                                    onChange={handleChange("name_ar")}
                                    disabled={isSending}
                                    value={service?.name_ar}
                                />
                            </div>
                            <label className="User-label">Description_Ar</label>
                            <textarea
                                className="User-input"
                                name="name"
                                placeholder="Type..."
                                rows={5}
                                disabled={isSending}
                                onChange={handleChange("description_ar")}
                                value={service?.description_ar}
                            />
                        </div>
                        <div className="popup-status text-center mt-4">
                            <span className="popup-switch mr-2">
                                Is Scheduled
                            </span>
                            <Switch
                                checked={service?.is_scheduled}
                                handleColor="white"
                                offColor="white"
                                onColor="#007BFF"
                                onChange={toggleIsSheduled}
                            />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-md-10 col-lg-7 ">
                        <ImageComp
                            file={imageFile}
                            removeImage={removeImage}
                            handleChange={setImageFile}
                            imgUrl={service?.image_url}
                        />
                        <div className="Add-user text-center">
                            <Button
                                loading={isSending}
                                onClick={saveChanges}
                                className="mt-5 text-center popup-button"
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
                title="Services"
                loading={!isReady}
                button={
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="Add-btn p-2 px-3"
                    >
                        <AiOutlinePlus /> Add
                    </Button>
                }
            >
                {isDialogOpen && (
                    <Addservice
                        onAdd={refetchData}
                        onClose={() => {
                            setIsDialogOpen(false)
                        }}
                    />
                )}
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Name_Ar</th>
                        <th scope="col">Unique Identifier</th>
                        <th scope="col">Price</th>
                        <th scope="col">Is Active</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {typeServices?.map(item => {
                        return (
                            <ServiceTableRow
                                refresh={refetchData}
                                service={item}
                            />
                        )
                    })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(servicedetail)
