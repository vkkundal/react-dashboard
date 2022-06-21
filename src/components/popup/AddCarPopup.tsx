import { Paper } from "@material-ui/core"
import Button from "components/button/button"
import InputGroup from "components/inputgroup/inputgroup"
import { useInputState } from "hooks/useInputState"
import { usePost } from "hooks/usePost"
import { useQueryParam } from "hooks/useQueryParam"
import React, { useState } from "react"
import { createPortal } from "react-dom"
import { useToasts } from "react-toast-notifications"
import { handleErrors, validateFields } from "helpers/helpers"
import { ChipInput } from "components/chipinput"
import produce from "immer"
import { number } from "prop-types"

export const AddCarPopup = ({
    onClose,
    onDone,
}: {
    onClose?: () => void
    onDone?: () => void
}) => {
    const item_id = useQueryParam("id")

    const { isSending: isCreating, post } = usePost<{
        car_model_ids: number[]
        year_from: number
        year_to: number
    }>(`/api/v2/items/${item_id}/cars`)

    const [car_ids, setcar_ids] = useState<string[]>([])
    const [year_from, setYearfrom] = useInputState()
    const [year_to, setYearto] = useInputState()

    const { addToast } = useToasts()
    const handleAddition = async (ids: number[]) => {
        const data = {
            car_model_ids: ids,
            year_from: parseInt(year_from),
            year_to: parseInt(year_to),
        }
        
        const arrayClientErrors = validateFields(data, addToast)

        try {
            await post({
                ...data,
            })
            addToast("Car Models Added", {
                autoDismiss: true,
                appearance: "success",
            })
            onDone && onDone()
            onClose && onClose()
        } catch (e) {
            handleErrors(e, addToast, arrayClientErrors)
        }
    }

    const handleAdd = () => {
        var car_model_ids: number[] = []
        car_ids.forEach(id => {
            car_model_ids.push(parseInt(id))
        })
        handleAddition(car_model_ids)
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <Paper
                            onClick={e => e.stopPropagation()}
                            className="p-5"
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Add a new <span>Car item</span>
                                </h2>
                            </div>
                            <ChipInput
                                variant
                                withfloatingLabel
                                label="Car Model Ids"
                                placeholder="Add a Car Model Id and Press Enter"
                                tags={car_ids}
                                onAdd={val => {
                                    setcar_ids(old => {
                                        return [...old, val]
                                    })
                                }}
                                onRemove={val => {
                                    setcar_ids(old => {
                                        return produce(old, draft => {
                                            draft.splice(val, 1)
                                        })
                                    })
                                }}
                            />
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="number"
                                name="last_name"
                                disabled={isCreating}
                                value={year_from}
                                onChange={setYearfrom}
                                label="Year From"
                            />
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="number"
                                name="last_name"
                                disabled={isCreating}
                                value={year_to}
                                onChange={setYearto}
                                label="Year To"
                            />

                            <div className="Add-user text-center">
                                <Button
                                    loading={isCreating}
                                    onClick={handleAdd}
                                    variant="green"
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
        </div>,
        document.body
    )
}
