import React, { useState } from "react"
import { Paper } from "../paper/paper"
import Button from "components/button/button"
import { useToasts } from "react-toast-notifications"
import { usePost } from "hooks/usePost"
import InputGroup from "components/inputgroup/inputgroup"

export const AddProvidertoVehiclePopup = ({
    id,
    onClose,
    onAdd,
}: {
    id: string
    onClose: () => void
    onAdd?: () => void
}) => {
    const { post } = usePost<{
        vehicle_id: number
        provider_user_id: number
    }>(`/api/v2/providers/vehicles/assign`)

    const [isSaving, setIsSaving] = useState(false)
    const [providerId, setProviderid] = useState("")

    const { addToast } = useToasts()

    const handleAdd = async () => {
        setIsSaving(true)
        try {
            await post({
                provider_user_id: +providerId,
                vehicle_id: +id,
            })

            addToast("Assigned to Provider", {
                autoDismiss: true,
                appearance: "success",
            })

            onAdd && onAdd()
            onClose && onClose()
        } catch (e) {
            addToast("Invalid id or internet error", {
                autoDismiss: true,
                appearance: "error",
            })
            onClose()
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col-md-8">
                        <Paper
                            className="p-5 align-content-center bg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Assign to <span> Provider</span>
                                </h2>
                            </div>
                            <div className="row">
                                <div className="col-md-6"></div>
                            </div>
                            <InputGroup
                                labelClass="popup-label popup-name"
                                wrapperClass="mb-2"
                                type="text"
                                name="Provider Id"
                                onChange={e => {
                                    setProviderid(e.target.value)
                                }}
                                label="Id"
                            />

                            <div className="Add-user text-center">
                                <Button
                                    onClick={handleAdd}
                                    className="mt-5 text-center popup-button"
                                    loading={isSaving}
                                >
                                    Add
                                </Button>
                                <Button onClick={onClose} variant="outline">
                                    Cancel
                                </Button>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}
