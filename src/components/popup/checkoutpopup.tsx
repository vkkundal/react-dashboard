import React, { useState } from "react"
import { Paper } from "../paper/paper"
import InputGroup from "components/inputgroup/inputgroup"
import Button from "components/button/button"
import { createPortal } from "react-dom"
import { usePost } from "hooks/usePost"
import { useQueryParam } from "hooks/useQueryParam"
import { useToasts } from "react-toast-notifications"
import { handleErrors } from "helpers/helpers"

const Checkoutpopup = ({
    onClose,
    onDone,
    item_id,
}: {
    onClose?: () => void
    item_id: number
    onDone?: () => void
}) => {
    const warehouse_id = useQueryParam("id")

    const { post, isSending } = usePost<{
        provider_mobile: string
        quantity: number
    }>(`/api/v2/warehouses/${warehouse_id}/items/${item_id}/checkout`)

    const [mobile, setMobile] = useState("")
    const [quantity, setQuantity] = useState(0)
    const { addToast } = useToasts()
    const handleCheckout = async () => {

        const rest = {
            provider_mobile: mobile,
            quantity: quantity,
        }

        let arrayClientErrors: any = [];

        const clientErrors: any = rest;
        for (const property in clientErrors) {
          console.log(`obj.${property} = ${clientErrors[property]}`);
          console.log(`${clientErrors[property]}`);
    
          if (!String(clientErrors[property])) {
            arrayClientErrors.push(property);
          }
        }
    
        arrayClientErrors?.map(function (msg: string) {
          addToast(`${msg.replace('_' , ' ')} cannot be empty`, {
            autoDismiss: true,
            appearance: "error",
          });
        });
        try {
            await post({
              ...rest
            })
            onDone && onDone()
            onClose && onClose()
            addToast("Item Checked Out", {
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
                                <h2 className="popup-heading">Checkout</h2>
                            </div>
                            <InputGroup
                                labelClass="popup-label popup-mobile"
                                wrapperClass="mb-2"
                                type="tel"
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
                                    onClick={handleCheckout}
                                    className="mt-5 text-center popup-button"
                                >
                                    Checkout
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

export default Checkoutpopup
