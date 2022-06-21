import React, { useEffect, useState } from "react"
import { Paper } from "../paper/paper"
import Button from "components/button/button"
import { useGet } from "hooks/useGet"
import { IVehicleDetails } from "helpers/interfaces"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { TextField } from "@material-ui/core"

export const AddVehicleToOrderPopup = ({
    vehicleId,
    onClose,
    onAdd,
    onChange,
}: {
    vehicleId: number | null
    onClose: () => void
    onChange: (vehicleId: number | null) => void
    onAdd: () => Promise<void>
}) => {



    const [inputVal, setInputVal] = useState("");

    const { data: allVehicles, isReady } = useGet<IVehicleDetails[]>(
        `/api/v2/providers/vehicles`,
        []
    )
    const [isSaving, setIsSaving]= useState(false);
    const handleSave =async () => {
        setIsSaving(true);
        try {
            await onAdd();
            onClose();
        }finally {
            setIsSaving(false)
        }
    }

    useEffect(() => {
        if(isReady && vehicleId){
            setInputVal(allVehicles.find(item => item.id === vehicleId)?.name || "");
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
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Change <span>{"Vehicle"} </span>
                                </h2>
                            </div>
                            <Autocomplete
                                className="w-100 mt-4"
                                id="disabled-options-demo"
                                options={allVehicles}
                                disabled={isSaving}
                                getOptionLabel={option => {
                                    return option.name
                                }}
                                inputValue={inputVal}
                                value={allVehicles.find(item => item.id === vehicleId) || null}
                                onInputChange={(e,val) => setInputVal(val)}
                                getOptionSelected={option =>
                                    option.id === vehicleId
                                }
                                style={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        onChange(newValue.id)
                                    } else {
                                        onChange(null)
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Vehicle"
                                        variant="outlined"
                                    />
                                )}
                            />

                            <div className="Add-user text-center">
                                <Button
                                    onClick={handleSave}
                                    loading={isSaving}
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
