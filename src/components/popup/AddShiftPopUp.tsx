import React, {  useState } from "react"
import { Paper } from "../paper/paper"
import { createPortal } from "react-dom"
import Button from "../button/button"
import { createNewShift } from "../../helpers/helpers"
import { useToasts } from "react-toast-notifications"
import { handleErrors } from "helpers/helpers"
import { useQueryParam } from "hooks/useQueryParam"
import { IShiftType } from "helpers/interfaces"
import TextField from "@material-ui/core/TextField"
import { useDidUpdate } from "hooks/useDidUpdate"
import produce from "immer"

function ShiftTimeRow({
    day,
    handleChange,
    shift,
}: {
    day: string
    shift: IShiftType | null
    handleChange: (shift: IShiftType | null) => void
}) {
    const [starttime, setStartTime] = useState(shift?.start_time || "00:00")
    const [endtime, setEndTime] = useState(shift?.end_time || "00:00")

    useDidUpdate(() => {
        handleChange({
            day,
            start_time: starttime,
            end_time: endtime,
        })
    }, [endtime, starttime])

    return (
        <p className="position-relative">
            <div className={`row`}>
                <div className="col-4 text-center">
                    <TextField
                        id="startTime"
                        type="time"
                        value={starttime}
                        disabled={!shift}
                        onChange={e => {
                            setStartTime(e.target.value)
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                </div>
                <div className="col-4 text-center">
                    <div>
                        <TextField
                            id="startTime"
                            type="time"
                            value={endtime}
                            disabled={!shift}
                            onChange={e => {
                                setEndTime(e.target.value)
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                    </div>
                </div>
                <div className="col-4">
                    <div>
                        <input
                            style={{
                                height: "21px",
                                zIndex: 999,
                                position: "relative",
                            }}
                            checked={!!shift}
                            onChange={e => {
                                const boolVal = e.target.checked

                                handleChange(
                                    !boolVal
                                        ? null
                                        : {
                                              day,
                                              start_time: starttime,
                                              end_time: endtime,
                                          }
                                )
                            }}
                            className="py-3 my-2 w-100"
                            type="checkbox"
                        />
                        <br></br>
                    </div>
                </div>
            </div>
        </p>
    )
}

const ShiftPopup = ({
    onClose,
    onAdd,
    previousShifts,
}: {
    onClose?: () => void
    onAdd?: () => void
    previousShifts: IShiftType[]
}) => {
    const id = useQueryParam("id")

    const [arrayShifts, setArrayShifts] = useState<IShiftType[]>(previousShifts)
    const [isCreating, setIsCreating] = useState(false)
    const { addToast } = useToasts()

    const handleChange = (day: string) => (shift: IShiftType | null) => {
        // console.log(shift);/
        setArrayShifts(old => {
            const newState = produce(old, draft => {
                const index = old?.findIndex(item => item.day === day)
                console.log(old, index, shift)
                if (index === -1 && shift) {
                    draft.push(shift)
                    console.log("called")
                } else {
                    if (shift) {
                        draft[index] = shift
                    } else {
                        draft.splice(index, 1)
                    }
                }
            })
            return newState
        })
    }

    const formatTime = (str: string) => {
      const splits = str.split(":");
      if(splits.length === 2){
        return str +":00";
      }
      return str;
    }

    const handleAddition = async () => {
        setIsCreating(true)

        try {
            await createNewShift(arrayShifts.map(old => ({...old, start_time: formatTime(old.start_time), end_time: formatTime(old.end_time)})), id)
            console.log(arrayShifts, "array")
            addToast("Shifts Updated ", {
                autoDismiss: true,
                appearance: "success",
            })
            onAdd && onAdd()
            onClose && onClose()
        } catch (e) {
            handleErrors(e, addToast, undefined)
        } finally {
            setIsCreating(false)
        }
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <Paper
                            onClick={e => e.stopPropagation()}
                            className="p-5 w-80"
                        >
                            <div className="text-center">
                                <h2 className="popup-heading mb-5">
                                    Update <span>Shift</span>
                                </h2>
                            </div>
                            <div className="container">
                                <div className="row no-gutters">
                                    <div
                                        style={{
                                            borderBottom: "1px solid #C9C7C7",
                                        }}
                                        className="col-12 pt-4 pb-3"
                                    >
                                        <div className="row no-gutters">
                                            <div
                                                style={{
                                                    fontWeight: 500,
                                                    color: "#000",
                                                }}
                                                className="col-3 text-center"
                                            >
                                                Days
                                            </div>
                                            <div
                                                style={{
                                                    fontWeight: 500,
                                                    color: "#000",
                                                }}
                                                className="col-3 px-2 text-center"
                                            >
                                                Start Time
                                            </div>
                                            <div
                                                style={{
                                                    fontWeight: 500,
                                                    color: "#000",
                                                }}
                                                className="col-3 px-2 text-center"
                                            >
                                                End Time
                                            </div>
                                            <div
                                                style={{
                                                    fontWeight: 500,
                                                    color: "#000",
                                                }}
                                                className="col-3 px-2 text-center"
                                            >
                                                Enabled
                                            </div>
                                        </div>
                                    </div>
                                    {[
                                        "Sunday",
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                    ].map(day => {
                                        const currentShift =
                                            arrayShifts.find(
                                                item => item.day === day
                                            ) || null

                                        return (
                                            <div
                                                key={day}
                                                style={{
                                                    borderBottom:
                                                        "1px solid #C9C7C7",
                                                }}
                                                className="col-12 pt-4"
                                            >
                                                <div className="row no-gutters">
                                                    <div className="col-3">
                                                        {day}
                                                    </div>
                                                    <div className="col-9 px-2">
                                                        <ShiftTimeRow
                                                            day={day}
                                                            handleChange={handleChange(
                                                                day
                                                            )}
                                                            shift={currentShift}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="Add-user text-center">
                                <Button
                                    loading={isCreating}
                                    onClick={handleAddition}
                                    variant="green"
                                    className="mt-5 text-center popup-button"
                                >
                                    Update
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

export default ShiftPopup
