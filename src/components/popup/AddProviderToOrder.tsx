import React, { useEffect, useState } from "react"
import { Paper } from "../paper/paper"
import Button from "components/button/button"
import { useGet } from "hooks/useGet"
import { IProviderData } from "helpers/interfaces"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { TextField } from "@material-ui/core"

export const AddProviderToOrder = ({
    providerId,
    onClose,
    onAdd,
    onChange,
}: {
    providerId: number | null
    onClose: () => void
    onChange: (providerId: number | null) => void
    onAdd: () => Promise<void>
}) => {
    const { data: allProviders, isReady } = useGet<IProviderData[]>(
        `/api/v2/providers`,
        []
    )

    const [inputVal, setInputVal] = useState("")

    useEffect(() => {
        if (isReady) {
            setInputVal(
                allProviders.find(item => item.user.id === providerId)?.user
                    .first_name || ""
            )
        }
    }, [isReady])

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onAdd();
        }finally {
            setIsSaving(false);
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
                                    Change <span>{"Provider"} </span>
                                </h2>
                            </div>
                            <Autocomplete
                                className="w-100 mt-4"
                                id="disabled-options-demo"
                                options={allProviders}
                                getOptionLabel={option => {
                                    return option.user.first_name
                                }}
                                disabled={isSaving}
                                getOptionSelected={option =>
                                    option.user.id === providerId
                                }
                                inputValue={inputVal}
                                onInputChange={(e,val) => setInputVal(val)}
                                value={
                                    allProviders.find(
                                        item => item.user.id === providerId
                                    ) || null
                                }
                                style={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        onChange(newValue.user.id)
                                    } else {
                                        onChange(null)
                                    }
                                }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Select Provider"
                                        variant="outlined"
                                    />
                                )}
                            />

                            <div className="Add-user text-center">
                                <Button
                                    loading={isSaving}
                                    onClick={handleSave}
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
