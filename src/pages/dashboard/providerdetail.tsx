import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { Paper } from "../../components/paper/paper"
import { Table } from "../../components/table/table"
import { useQueryParam } from "../../hooks/useQueryParam"
import { ProviderService } from "../../helpers/ProviderService"
import {
    IProviderData,
    IProviderWithServices,
    IRole,
} from "../../helpers/interfaces"
import Spinner from "../../components/spinner/spinner"
import { saveRole, saveUserInfo } from "../../helpers/helpers"
import { useToasts } from "react-toast-notifications"
import Button from "../../components/button/button"
import AddServicePopup from "../../components/addServicePopup/addservicepopup"
import { DevicesTable } from "../../components/DevicesTable/devicestable"
import withAuth from "../../components/withAuth/withAuth"
import { AiOutlinePlus } from "react-icons/ai"
import Switch from "react-ios-switch"
import { ImageComp } from "components/imagecomp/imagecomp"
import { usePut } from "hooks/usePut"
import { useFirebase } from "providers/FirebaseProvider"
import DetailInputGroup from "../../components/inputdetails/inputdetails"
import SelectInput from "../../components/Selectinput/selectinput"
import { handleErrors, validateFields } from "helpers/helpers"
import { AddVehicleToProviderPopup } from "../../components/popup/addVehicleToProviderPopup"
import { BsEye } from "react-icons/bs"
import { navigate } from "gatsby"
import { useGet } from "hooks/useGet"

const ProviderDetail = () => {
    const [imageFile, setImageFile] = useState<File | null>(null)

    const id = useQueryParam("id")
    const [
        providerDetails,
        setproviderDetails,
    ] = useState<IProviderWithServices | null>(null)
    const providerDetailsRef = useRef<IProviderWithServices | null>(null)
    const { data: roles } = useGet<IRole[]>(`/api/v2/providers/roles`, [])

    const { addToast } = useToasts()

    const [isSaving, setIsSaving] = useState(false)
    const [assignVehicle, setAssignVehicle] = useState(false)

    const { put } = usePut<{
        image_url: string
        iban: string
        is_scheduled: boolean
    }>(`/api/v2/providers/${id}`)

    const firebase = useFirebase()

    const onSave = async () => {
        setIsSaving(true)
        let arrayClientErrors: any = []

        try {
            if (providerDetails) {
                arrayClientErrors = validateFields(
                    providerDetails.user,
                    addToast
                )

                console.log(providerDetails)

                await saveUserInfo(id, providerDetails.user)
                await saveRole("providers", id, providerDetails.role.id)
                let image_url = providerDetails.provider.image_url

                if (imageFile) {
                    const storage = firebase.storage().ref()
                    const snap = await storage
                        .child(
                            `/${process.env.GATSBY_FIREBASE_PREFIX}/Providers/` +
                                id +
                                ".png"
                        )
                        .put(imageFile)
                    const url = await snap.ref.getDownloadURL()
                    image_url = url
                }

                await put({
                    iban: providerDetails.provider.iban,
                    image_url: image_url || "",
                    is_scheduled: providerDetails.provider.is_scheduled,
                })
                providerDetails.provider.image_url = image_url
            }
            providerDetailsRef.current = providerDetails
            addToast("Details Saved", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
            handleErrors(e, addToast, arrayClientErrors)
        } finally {
            setIsSaving(false)
        }
    }

    const refreshData = () => {
        ProviderService.getProviderById(id).then(val => {
            providerDetailsRef.current = val
            setproviderDetails(val)
        })
    }

    useEffect(() => {
        if (id) {
            refreshData()
        }
    }, [id])

    const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof IProviderData["user"]
        const value = e.target.value
        setproviderDetails(old => {
            if (!old) {
                return null
            }
            return {
                ...old,
                user: { ...old.user, [name]: value },
            }
        })
    }

    const handleChangeRole = (index: number) => {
        setproviderDetails(old => {
            if (!old) {
                return old
            }
            return {
                ...old,
                role: roles[index],
            }
        })
    }

    const handleChangeIban = (e: React.ChangeEvent<any>) => {
        const val = e.target.value
        setproviderDetails(old => {
            if (!old) {
                return old
            }
            return {
                ...old,
                provider: { ...old.provider, iban: val },
            }
        })
    }

    const handleReset = () => {
        setproviderDetails(providerDetailsRef.current)
    }

    const changeIsActive = () => {
        setproviderDetails(old => {
            if (!old) {
                return old
            }
            return {
                ...old,
                user: { ...old.user, is_active: !old.user.is_active },
            }
        })
    }

    const toggleIsSheduled = () => {
        setproviderDetails(old => {
            if (!old) {
                return old
            }
            return {
                ...old,
                provider: {
                    ...old.provider,
                    is_scheduled: !old.provider.is_scheduled,
                },
            }
        })
    }

    const [isOpen, setOpen] = useState(false)

    return (
        <AdminLayout title="Providers Details">
            {isOpen && providerDetails && (
                <AddServicePopup
                    providerId={providerDetails.user.id.toString()}
                    onAdd={refreshData}
                    onClose={() => setOpen(false)}
                />
            )}
            {!providerDetails && (
                <Paper className="mt-5 p-5 d-flex align-items-center justify-content-center">
                    <Spinner color="#333" />
                </Paper>
            )}
            {providerDetails && (
                <>
                    <Paper className="mt-5 p-5">
                        <div className="filter">
                            <h3 className="font-weight-normal">User Details</h3>
                        </div>
                        <>
                            <div className="x   ">
                                <div className="col-md-6">
                                    <div className="User-details">
                                        <ImageComp
                                            variant="circle"
                                            file={imageFile}
                                            handleChange={setImageFile}
                                            imgUrl={
                                                providerDetails.provider
                                                    .image_url
                                            }
                                        />
                                    </div>
                                    <div className="first-name">
                                        <DetailInputGroup
                                            type="text"
                                            label="First Name"
                                            name="first_name"
                                            disabled={isSaving}
                                            onChange={handleChangeUserData}
                                            value={
                                                providerDetails.user.first_name
                                            }
                                        />
                                    </div>
                                    <div className="User-phone">
                                        <DetailInputGroup
                                            type="number"
                                            label="Mobile"
                                            name="mobile"
                                            disabled={isSaving}
                                            onChange={handleChangeUserData}
                                            value={providerDetails.user.mobile}
                                        />
                                    </div>
                                    <div className="popup-status text-center mt-4">
                                        <span className="popup-switch mr-2">
                                            Is Active
                                        </span>
                                        <Switch
                                            checked={
                                                providerDetails.user.is_active
                                            }
                                            onChange={changeIsActive}
                                            handleColor="white"
                                            offColor="white"
                                            onColor="#007BFF"
                                        />
                                    </div>

                                    <div className="popup-status text-center mt-4">
                                        <span className="popup-switch mr-2">
                                            Is Scheduled
                                        </span>
                                        <Switch
                                            checked={
                                                providerDetails?.provider
                                                    .is_scheduled
                                            }
                                            handleColor="white"
                                            offColor="white"
                                            onColor="#007BFF"
                                            onChange={toggleIsSheduled}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="User-details">
                                        <DetailInputGroup
                                            type="number"
                                            label="User ID"
                                            disabled
                                            onChange={handleChangeUserData}
                                            value={providerDetails.user.id}
                                        />
                                    </div>
                                    <div className="last-name">
                                        <DetailInputGroup
                                            type="text"
                                            label="Last Name"
                                            name="last_name"
                                            disabled={isSaving}
                                            onChange={handleChangeUserData}
                                            value={
                                                providerDetails.user.last_name
                                            }
                                        />
                                    </div>
                                    <div className="User-role">
                                        <SelectInput
                                            onChange={(
                                                e: React.ChangeEvent
                                            ) => {
                                                const index = roles.findIndex(
                                                    item =>
                                                        parseInt(
                                                            item.id as any
                                                        ) ===
                                                        parseInt(
                                                            (e.target as HTMLInputElement)
                                                                .value
                                                        )
                                                )
                                                handleChangeRole(index)
                                            }}
                                            name="role"
                                            disabled={isSaving}
                                            value={providerDetails.role.id}
                                            label="Role"
                                        >
                                            {roles.map((role, i) => {
                                                return (
                                                    <option
                                                        key={role.name}
                                                        value={role.id}
                                                    >
                                                        {role.name}
                                                    </option>
                                                )
                                            })}
                                        </SelectInput>
                                    </div>
                                    <div className="User-phone">
                                        <DetailInputGroup
                                            type="text"
                                            label="IBan"
                                            name="iban"
                                            disabled={isSaving}
                                            onChange={handleChangeIban}
                                            value={
                                                providerDetails.provider.iban
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 User-submit text-right">
                                    <Button
                                        loading={isSaving}
                                        onClick={onSave}
                                        className=" mt-5 text-right"
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        onClick={handleReset}
                                        variant="outline"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </>
                    </Paper>
                    <DevicesTable devices={[providerDetails.device]} />

                    <Table
                        title="Vehicles"
                        button={
                            <Button
                                onClick={() => setAssignVehicle(true)}
                                className="Add-btn p-2 px-3"
                            >
                                <AiOutlinePlus className="plus-icon" />
                                Assign New Vehicle
                            </Button>
                        }
                    >
                        {assignVehicle && (
                            <AddVehicleToProviderPopup
                                id={id}
                                vehicleId={
                                    providerDetails.provider.vehicle?.id || null
                                }
                                onAdd={refreshData}
                                onClose={() => setAssignVehicle(false)}
                            />
                        )}

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
                            {providerDetails.provider.vehicle && (
                                <tr>
                                    <td scope="row">
                                        {providerDetails.provider.vehicle.id}
                                    </td>
                                    <td>
                                        {providerDetails.provider.vehicle.name}
                                    </td>
                                    <td>
                                        {providerDetails.provider.vehicle.is_active.toString()}
                                    </td>
                                    <td>
                                        {providerDetails.provider.vehicle.is_cary.toString()}
                                    </td>
                                    <td
                                        onClick={e => {
                                            navigate(
                                                `/dashboard/vehicledetail?id=${providerDetails.provider.vehicle?.id}`
                                            )
                                        }}
                                        className="eye-icon cursor-pointer"
                                    >
                                        <BsEye />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <Table title="Items">
                        <thead className="table-head">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Name - Ar</th>
                                <th scope="col">Quantity </th>
                            </tr>
                        </thead>
                        <tbody>
                            {providerDetails.items.map(({ item, quantity }) => {
                                return (
                                    <tr>
                                        <td scope="row">{item.id} </td>
                                        <td>{item.title}</td>
                                        <td>{item.title_ar}</td>
                                        <td>{quantity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </>
            )}
        </AdminLayout>
    )
}

export default withAuth(ProviderDetail)
