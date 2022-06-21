import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { Paper } from "../../components/paper/paper"
import Switch from "react-ios-switch"
import Button from "../../components/button/button"
import { Table } from "../../components/table/table"
import { AiOutlinePlus } from "react-icons/ai"
import { useQueryParam } from "hooks/useQueryParam"
import { useGet } from "hooks/useGet"
import { IItemDetailById, IITemDetailWithImage } from "helpers/interfaces"
import { usePut } from "hooks/usePut"
import { useToasts } from "react-toast-notifications"
import { ImageComp } from "components/imagecomp/imagecomp"
import { useFirebase } from "providers/FirebaseProvider"
import produce from "immer"
import { ChipInput } from "components/chipinput"
import { AddCarPopup } from "components/popup/AddCarPopup"
import withAuth from "../../components/withAuth/withAuth"
import DetailInputGroup from "../../components/inputdetails/inputdetails"
import { handleErrors, validateFields } from "helpers/helpers"

const CarsTable = ({
    setopen,
    isAddCarOpen,
}: {
    setopen: any
    isAddCarOpen: boolean
}) => {
    const id = useQueryParam("id")
    const { data, isReady, refetchData } = useGet<IItemDetailById[] | null>(
        `/api/v2/items/${id}/cars`,
        null,
        [id]
    )

    

    return (
        <Table
            title="Cars"
            loading={!isReady}
            button={
                <Button
                    onClick={() => setopen(true)}
                    className="Add-btn p-2 px-3"
                >
                    <AiOutlinePlus /> Add Car
                </Button>
            }
        >
            {isAddCarOpen && (
                <AddCarPopup
                    onDone={refetchData}
                    onClose={() => setopen(false)}
                />
            )}
            <thead className="table-head">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Make</th>
                    <th scope="col">Model</th>
                    <th scope="col">Year From</th>
                    <th scope="col">Year To</th>
                </tr>
            </thead>
            <tbody>
                {data &&
                    data.map((car: any) => {
                        return (
                            <tr>
                                <td scope="row">{car.car_model.id}</td>
                                <td>{car.car_model.car_make.name}</td>
                                <td>{car.car_model.name}</td>
                                <td>{car.year_from}</td>
                                <td>{car.year_to}</td>
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
    )
}

const Itemdetail = () => {
    const id = useQueryParam("id")
    const total = useQueryParam("total")

    var { data, isReady } = useGet<IItemDetailById | null>(
        `/api/v2/items/${id}`,
        null,
        [id]
    )

    function setopen(value: boolean) {
        if (value) {
            setIsAddOpen(true)
        } else {
            setIsAddOpen(false)
        }
    }

    const { data: providers, isReady: isProvideReady } = useGet<
        {
            provider: {
                user: {
                    id: number
                    first_name: string
                    last_name: string
                    mobile: string
                    is_active: boolean
                }
            }
            quantity: 0
        }[]
    >(`/api/v2/items/${id}/providers`, [], [id])
    const [item, setItem] = useState<IITemDetailWithImage | null>(null)
    const itemRef = useRef<IITemDetailWithImage | null>(null)

    useEffect(() => {
        if (isReady) {
            setItem(data)
            itemRef.current = data
        }
    }, [isReady])

    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleChange = <K extends keyof IITemDetailWithImage>(key: K) => (
        e: React.ChangeEvent<any>
    ) => {
        const val = e.target.value
        setItem(old => {
            if (!old) {
                return old
            }
            return { ...old, [key]: val }
        })
    }

    const handleIsActive = () => {
        setItem(old => {
            if (!old) {
                return old
            }
            return { ...old, is_active: !old.is_active }
        })
    }

    const { isSending, put } = usePut<IITemDetailWithImage>(
        `/api/v2/items/${id}`
    )
    const firebase = useFirebase()
    const { addToast } = useToasts()
    const handleSave = async () => {
        let arrayClientErrors: string[] = []

        try {
            if (!item) {
                return
            }
            let imageUrl = item.image_url
            if (imageFile) {
                const storage = firebase.storage().ref()

                const snap = await storage
                    .child(
                        `/${process.env.GATSBY_FIREBASE_PREFIX}/Items/` +
                            id +
                            ".png"
                    )
                    .put(imageFile)
                const url = await snap.ref.getDownloadURL()
                imageUrl = url
            }

            const newItem = { ...item, image_url: imageUrl }

            arrayClientErrors = validateFields(newItem, addToast, "warehouses")

            await put(newItem)

            itemRef.current = newItem

            addToast("Item Updated", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
            handleErrors(e, addToast, arrayClientErrors)
        }
    }

    const handleReset = () => {
        setItem(itemRef.current)
    }

    const [isAddCarOpen, setIsAddOpen] = useState(false)

    return (
        <AdminLayout title="Item">
            <Paper className="mt-5 p-5">
                <div className="filter">
                    <h3 className="font-weight-normal">Item Details</h3>
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
                                disabled={isSending}
                                value={item?.title}
                                onChange={handleChange("title")}
                            />
                        </div>
                        <div className="User-details">
                            <DetailInputGroup
                                type="text"
                                label="Serial Number"
                                value={item?.serial_number}
                                onChange={handleChange("serial_number")}
                            />
                        </div>
                        <div className="Description">
                            <label className="User-label">Description</label>
                            <textarea
                                className="User-input"
                                name="name"
                                placeholder="Type..."
                                rows={5}
                                value={item?.description}
                                disabled={isSending}
                                onChange={handleChange("description")}
                            />
                        </div>
                        <div className="Price">
                            <DetailInputGroup
                                type="number"
                                name="name"
                                label="Price"
                                value={item?.price}
                                disabled={isSending}
                                onChange={handleChange("price")}
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
                                    disabled={isSending}
                                    value={item?.title_ar}
                                    onChange={handleChange("title_ar")}
                                />
                            </div>
                            <div className="Name">
                                <DetailInputGroup
                                    type="number"
                                    label="Total Quantity"
                                    name="quantity"
                                    disabled={true}
                                    value={total}
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
                                value={item?.description_ar}
                            />
                        </div>
                        <ChipInput
                            tags={item?.tags || []}
                            onAdd={val => {
                                setItem(old => {
                                    if (!old) {
                                        return old
                                    }
                                    const tags = old.tags
                                        ? [...old.tags, val]
                                        : [val]
                                    return { ...old, tags }
                                })
                            }}
                            onRemove={val => {
                                setItem(old => {
                                    if (!old) {
                                        return old
                                    }
                                    return produce(old, draft => {
                                        draft.tags.splice(val, 1)
                                    })
                                })
                            }}
                        />
                        <div className="popup-status text-center mt-4">
                            <span className="popup-switch mr-2">
                                Is Active{" "}
                            </span>
                            <Switch
                                checked={item?.is_active}
                                onChange={handleIsActive}
                                handleColor="white"
                                offColor="white"
                                onColor="#007BFF"
                            />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-md-10 col-lg-6 ">
                        <ImageComp
                            imgUrl={item?.image_url}
                            file={imageFile}
                            handleChange={setImageFile}
                            removeImage={() =>
                                item && setItem({ ...item, image_url: "" })
                            }
                        />
                        <div className="Add-user text-center">
                            <Button
                                loading={isSending}
                                onClick={handleSave}
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
            <CarsTable setopen={setopen} isAddCarOpen={isAddCarOpen} />

            <Table title="Providers" loading={!isProvideReady}>
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map(provider => {
                        return (
                            <tr>
                                <td scope="row">{provider.provider.user.id}</td>
                                <td>{provider.provider.user.first_name}</td>
                                <td>{provider.provider.user.mobile}</td>
                                <td>{provider.quantity}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Table loading={!isReady} title="Warehouses">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.warehouses.map(item => {
                        return (
                            <tr>
                                <td scope="row">{item.warehouse.id}</td>
                                <td>{item.warehouse.name}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export default withAuth(Itemdetail)
