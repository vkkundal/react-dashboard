import React, { useState } from "react"
import { Paper } from "../paper/paper"
import InputGroup from "../inputgroup/inputgroup"
import Button from "../button/button"
import { usePost } from "hooks/usePost"
import { useQueryParam } from "hooks/useQueryParam"
import { useToasts } from "react-toast-notifications"
import { createPortal } from "react-dom"
import { handleErrors, validateFields } from "helpers/helpers"

const warehouseitemaddpopup = ({
    serialNumber,
    onAdd,
    onClose,
    quantity: quantityProp
}: {
    onAdd?: () => void
    serialNumber?: string
    quantity?: number
    onClose?: () => void
}) => {
    const id = useQueryParam("id")

    const { isSending, post } = usePost<{ serial_number: string; quantity: number  }>(
        `/api/v2/warehouses/${id}/items`
    )

    const { addToast } = useToasts()

    const [serial_number, setSerialnumber] = useState(serialNumber || "")
    const [quantity, setQuantity] = useState(quantityProp || 0)

    const handleAdd = async () => {


        const data = {
            serial_number: serial_number,
            quantity: quantity,
        }

        const arrayClientErrors = validateFields(data,addToast);

        try {
            await post({
                ...data
            })
            onAdd && onAdd()
            onClose && onClose()
            addToast("Item Added", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {

            handleErrors(e , addToast , arrayClientErrors)
      
        }
    }

    return createPortal(
        <div className="popup-overlay">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <Paper className="p-5">
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    {serialNumber ? (
                                        <>
                                            Edit <span> Item</span>
                                        </>
                                    ) : (
                                        <>
                                            Add a new <span> Item</span>
                                        </>
                                    )}
                                </h2>
                            </div>
                            
                                <InputGroup
                                    labelClass="popup-label popup-name-id"
                                    wrapperClass="mb-2"
                                    type="text"
                                    name="serial_number"
                                    disabled={isSending}
                                    value={serial_number}
                                    onChange={e => setSerialnumber(e.target.value)}
                                    label="Serial Number"
                                />
                            
                            <InputGroup
                                labelClass="popup-label popup-name-quality"
                                wrapperClass="mb-2"
                                type="number"
                                disabled={isSending}
                                value={quantity}
                                onChange={(e) => {
                                     setQuantity(parseInt(e.target.value) as number)
                                    }}
                                name="quantity"
                                label="Quantity"
                            />

                            <div className="Add-user text-center">
                                <Button
                                    loading={isSending}
                                    onClick={handleAdd}
                                    className="mt-5 text-center popup-button"
                                >
                                    {serialNumber ? "Update" : "Add"}
                                </Button>
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
        </div>, document.body
    )
}
export default warehouseitemaddpopup
