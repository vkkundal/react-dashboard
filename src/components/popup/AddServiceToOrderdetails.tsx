import React, { useState } from "react"
import { Paper } from "../paper/paper"
import Button from "components/button/button"
import { useToasts } from "react-toast-notifications"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import { usePut } from "hooks/usePut"
import { useGet } from "hooks/useGet"
import { IServiceType } from "helpers/interfaces"

export const AddServiceToOrder = ({
    id,
    onClose,
    onAdd,
    orderId,
}: {
    id: number
    onClose: () => void
    onAdd?: () => void
    orderId: string
}) => {
    const { put: putisSendingOrder, isSending } = usePut<{
        service_id: number
    }>(`/api/v2/orders/${orderId}/services`)

    const { data: allServices } = useGet<IServiceType[]>(
        `/api/v2/services/types/${id}/services`,
        [],
        [id]
    )

    const [serviceId, setserviceId] = useState(0)

    const { addToast } = useToasts()

    const handleAdd = async () => {
        try {
            await putisSendingOrder({
                service_id: serviceId,
            })

            addToast("Service Added", {
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
                                    Assign <span> Service</span>
                                </h2>
                            </div>
                            <div className="row">
                                <div className="col-md-6"></div>
                            </div>

                            <Autocomplete
                                disabled={isSending}
                                className="w-100 mt-4"
                                id="disabled-options-demo"
                                options={allServices}
                                getOptionLabel={option => {
                                    return option.name
                                }}
                                style={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setserviceId(newValue.id)
                                    }
                                }}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        label="Select Service"
                                        variant="outlined"
                                    />
                                )}
                            />
                            <div className="Add-user text-center">
                                <Button
                                    disabled={isSending}
                                    onClick={handleAdd}
                                    className="mt-5 text-center popup-button"
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
