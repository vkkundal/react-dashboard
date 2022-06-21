import Button from "components/button/button"
import { InputGroup } from "components/inputgroup"
import { Paper } from "components/paper/paper"
import { handleErrors, validateFields } from "helpers/helpers"
import { usePost } from "hooks/usePost"
import { useQueryParam } from "hooks/useQueryParam"
import React, { useState } from "react"
import { createPortal } from "react-dom"
import { useToasts } from "react-toast-notifications"



export const WarehouseReturnPopup = ({
    onClose,
    onDone,
}: {
    onClose?: () => void
    onDone?: () => void
}) => {
    const warehouse_id = useQueryParam("id")

    const { post, isSending } = usePost<{
        provider_mobile: string
        quantity: number
        serial_number?: string
    }>(`/api/v2/warehouses/${warehouse_id}/items/return`)

    const [mobile, setMobile] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [serial_number, setserialNumber] = useState<string>('')
    const { addToast } = useToasts()
    const handleReturn = async () => {

        const data = {
            serial_number,
            provider_mobile: mobile,
            quantity: quantity,
        }

        
        const arrayClientErrors = validateFields(data,addToast);

        try {
            await post({
                ...data
            })
            onDone && onDone()
            onClose && onClose()
            addToast("Item is Scheduled For Return", {
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
                                    Return <span>Item</span>
                                </h2>
                            </div>
                            <InputGroup
                                labelClass="popup-label popup-mobile"
                                wrapperClass="mb-2"
                                type="text"
                                name="Serial"
                                value={serial_number as any}
                                onChange={e => setserialNumber(e.target.value as any)}
                                disabled={isSending}
                                label="Serial Number"
                            />
                            
                            <InputGroup
                                labelClass="popup-label popup-mobile"
                                wrapperClass="mb-2"
                                type="number"
                                name="mobile"
                                value={mobile}
                                onChange={e => setMobile(e.target.value)}
                                disabled={isSending}
                                label="Provider Mobile"
                            />
                            <InputGroup
                                labelClass="popup-label popup-quality"
                                wrapperClass="mb-2"
                                type="number"
                                name="Quantity"
                                value={quantity}
                                onChange={e => setQuantity(parseInt(e.target.value))}
                                disabled={isSending}
                                label="Quantity"
                            />

                            <div className="Add-user text-center">
                                <Button
                                    loading={isSending}
                                    onClick={handleReturn}
                                    className="mt-5 text-center popup-button"
                                >
                                    Return
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
        </div>,
        document.body
    )
}
