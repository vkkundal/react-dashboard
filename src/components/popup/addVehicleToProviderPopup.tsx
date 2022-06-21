import React, { useEffect, useState } from "react"
import { Paper } from "../paper/paper"
import Button from "components/button/button"
import { useToasts } from "react-toast-notifications"
import { validateFields } from "helpers/helpers"
import { usePost } from "hooks/usePost"
import { useGet } from "hooks/useGet"
import { IVehicleDetails } from "helpers/interfaces"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { TextField } from "@material-ui/core"
import Spinner from "components/spinner/spinner"

export const AddVehicleToProviderPopup = ({
    id,
    onClose,
    onAdd,
    vehicleId: propVehicleId,
}: {
    id: string
    vehicleId: number | null
    onClose: () => void
    onAdd?: () => void
}) => {
    const { post, isSending } = usePost<{
        provider_user_id: number
        vehicle_id: number | null
    }>(`/api/v2/providers/vehicles/assign`)

    const { data: allVehicles, isReady } = useGet<IVehicleDetails[]>(
        `/api/v2/providers/vehicles`,
        []
    )

    const [vehicleId, setVehicleid] = useState<number | null>(propVehicleId)
    const [inputVal, setInputVal] = useState("")
    const { addToast } = useToasts()

    const handleAdd = async () => {
        let arrayClientErrors = validateFields(
            {
                provider_user_id: parseInt(id),
                vehicle_id: vehicleId,
            },
            addToast
        )

        if (arrayClientErrors.length > 0) return

        try {
            await post({
                provider_user_id: parseInt(id),
                vehicle_id: vehicleId,
            })

            addToast("Vehicle Assigned", {
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
    useEffect(() => {
        if(isReady){
            setInputVal(allVehicles.find(item => item.id === propVehicleId)?.name || "");
        }
    }, [isReady])

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col-md-8">
                        <Paper
                            className="p-5 align-content-center bg"
                            onClick={e => e.stopPropagation()}
                        >
                            {isReady ? (
                                <>
                                    <div className="text-center">
                                        <h2 className="popup-heading">
                                            Assign <span>{"Vehicle"} </span>
                                        </h2>
                                    </div>
                                    <Autocomplete
                                        disabled={isSending}
                                        className="w-100 mt-4"
                                        id="disabled-options-demo"
                                        options={allVehicles}
                                        getOptionLabel={option => {
                                            return option.name
                                        }}
                                        inputValue={
                                            inputVal
                                        }
                                        value={allVehicles.find(
                                            item => item.id === vehicleId
                                        ) || vehicleId as null}
                                        onInputChange={(e, val) => {
                                            setInputVal(val)
                                        }}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                setVehicleid(newValue.id)
                                            } else {
                                                setVehicleid(newValue)
                                            }
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Select Vehicle"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                    <div className="Add-user text-center">
                                        <Button
                                            loading={isSending}
                                            onClick={handleAdd}
                                            className="mt-5 text-center popup-button"
                                        >
                                            Assign
                                        </Button>
                                        <Button
                                            onClick={onClose}
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <Spinner />
                            )}
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}
