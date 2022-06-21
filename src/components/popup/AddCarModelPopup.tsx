import React, { useState } from "react"
import { Paper } from "../paper/paper"
import InputGroup from "../inputgroup/inputgroup"
import Button from "../button/button"
import { usePost } from "hooks/usePost"
import { useToasts } from "react-toast-notifications"
import { createPortal } from "react-dom"
import Switch from "react-ios-switch"
import { CarySelect } from "components/caryselect"
import { usePut } from "hooks/usePut"
import { handleErrors, validateFields } from "helpers/helpers"
const AddCarModelPopup = ({
    car_make_id,
    onAdd,
    onClose,
    nameModel,
    name_ar,
    edit,
    model_id,
    model_size,
    model_oilChange,
}: {
    onAdd?: () => void
    car_make_id?: string
    onClose?: () => void
    nameModel?: string
    name_ar?: string
    edit?: boolean
    model_id?: number
    model_size?: string
    model_oilChange?: boolean
}) => {
    const { isSending: isCreating, post } = usePost<{
        car_make_id: number
        name: string
        name_ar: string
        allow_oil_change: boolean
        size: string
    }>(`/api/v2/cars/models`)

    const { isSending: isUpdating, put } = usePut<{
        name: string
        name_ar: string
        allow_oil_change: boolean
        size: string
    }>(`/api/v2/cars/models/${model_id}`)

    const { addToast } = useToasts()
    const [isActive, setIsActive] = useState(model_oilChange || false)
    const [name, setName] = useState(nameModel || "")
    const [namear, setName_ar] = useState(name_ar || "")
    const [size, setSize] = useState(model_size || "S")
    const handleAdd = async () => {


        const data: {
            car_make_id: number,
            name: string,
            name_ar: string,
            allow_oil_change: boolean,
            size:string,
        } = {
            car_make_id: parseInt(car_make_id as string),
            name,
            name_ar: namear,
            allow_oil_change: isActive,
            size,
        }

        const arrayClientErrors = validateFields(data,addToast);

        console.log(arrayClientErrors)
    
        try {
            await post({
                ...data
            })
            onAdd && onAdd()
            onClose && onClose()
            addToast("Car Model Added", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
             
            handleErrors(e , addToast , arrayClientErrors)

        }
    }
    const handleEdit = async () => {


        const data: {
            allow_oil_change : boolean,
            name: string,
            name_ar : string,
            size : string
        } = {
            allow_oil_change: isActive,
            name,
            name_ar: namear,
            size,
        }

        const arrayClientErrors = validateFields(data,addToast);

        console.log(arrayClientErrors)

        try {
            await put({
                ...data
            })
            onAdd && onAdd()
            onClose && onClose()
            addToast("Car Model Added", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
               
            handleErrors(e , addToast , arrayClientErrors)

        }
    }

    const isSending = isCreating || isUpdating
    return createPortal(
        <div className="popup-overlay">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <Paper className="p-5">
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    {edit ? (
                                        <>
                                            Edit <span> Car model</span>
                                        </>
                                    ) : (
                                        <>
                                            Add a new <span> Car Model</span>
                                        </>
                                    )}
                                </h2>
                            </div>

                            <InputGroup
                                labelClass="popup-label popup-name"
                                wrapperClass="mb-2"
                                type="text"
                                disabled={isSending}
                                value={name}
                                onChange={e => {
                                    setName(e.target.value)
                                }}
                                name="name"
                                label="Name"
                            />
                            <InputGroup
                                labelClass="popup-label popup-name-ar"
                                wrapperClass="mb-2"
                                type="text"
                                disabled={isSending}
                                value={namear}
                                onChange={e => setName_ar(e.target.value)}
                                name="name_ar"
                                label="Name_ar"
                            />
                            <div className="User-role">
                                <CarySelect
                                    options={["S", "L"]}
                                    getName={item => item}
                                    selectedOption={size}
                                    onChange={setSize}
                                    title="Size"
                                />
                            </div>
                            <div className="popup-status text-center mt-5">
                                <span className="popup-switch mr-2">
                                    Allow Oil Changes{" "}
                                </span>
                                <Switch
                                    checked={isActive}
                                    handleColor="white"
                                    offColor="white"
                                    onChange={() => setIsActive(val => !val)}
                                    onColor="#007BFF"
                                />
                            </div>
                            <div className="Add-user text-center">
                                {edit && (
                                    <Button
                                        loading={isSending}
                                        onClick={handleEdit}
                                        className="mt-5 text-center popup-button"
                                    >
                                        Update
                                    </Button>
                                )}
                                {!edit && (
                                    <Button
                                        loading={isSending}
                                        onClick={handleAdd}
                                        className="mt-5 text-center popup-button"
                                    >
                                        Add
                                    </Button>
                                )}

                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
export default AddCarModelPopup
