import { TextField } from "@material-ui/core"
import { DatePicker } from "@material-ui/pickers"
import React, { useState } from "react"
import { Popup } from "./Popup"
import Button from "components/button/button"
import { usePut } from "hooks/usePut"
import { usePost } from "hooks/usePost"
import Spinner from "components/spinner/spinner"
import moment from "moment"
import { CarySelect } from "components/caryselect"
import { useToasts } from "react-toast-notifications"

type IScheduleVehicle = {
    is_cary: boolean
    id: number
    is_active: boolean
    name: string
}
type ISchedule = {
    time: string
    available: boolean
    vehicles: IScheduleVehicle[]
}

type IScheduleData = {
    day: string
    date: string
    schedule: ISchedule[]
    allowed_booking_days: {
        day_id: number
        day: string
        date: string
    }[]
}

export const RescheduleOrderPopup = ({
    orderId,
    onClose,
}: {
    orderId: string
    onClose: () => void
}) => {
    const [date, setDate] = useState("")
    const [step, setStep] = useState(1)
    const { isSending, put } = usePut(`/api/v2/orders/${orderId}/schedule`)

    const [schedulesData, setScheduleData] = useState<IScheduleData | null>(
        null
    )

    const { addToast } = useToasts()

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedVehicle, setSelectedVehicle] = useState<null | number | undefined>(null)
    const [timeSelected, setTimeSelected] = useState<ISchedule | null>(null)

    console.log(timeSelected)
    const { post, isSending: isFetching } = usePost<{ service_date: string }>(
        `/api/v2/orders/${orderId}/schedule`
    )

    const loadSchedules = async (date: string) => {
        date = moment(date).format("yyyy-MM-DD")
        const res = await post({ service_date: date })
        setScheduleData(res.data)
    }

    const handleUpdate = async () => {
        if (step === 2) {

            try {

                await put({ service_date: moment(date).format("yyyy-MM-DD") , vehicle_id: selectedVehicle , service_time :  timeSelected?.time  })
                addToast("Order Rescheduled", {
                    autoDismiss: true,
                    appearance: "success",
                })
            }
            catch{

                addToast("Some error occured", {
                    autoDismiss: true,
                    appearance: "error",
                })
            }
            finally {

            }
            
            onClose()
            
            return
        }
        if (date) {
            setStep(2)

            loadSchedules(date)
        }
    }

    const [] = useState()

    const renderDate = () => {
        if (step === 1) {
            console.log("step 1")

            return (
                <>
                    <label className="filter-label">Pick a Date</label>
                    <DatePicker
                        variant="dialog"
                        openTo="date"
                        format="DD-MM-yyyy"
                        inputVariant="outlined"
                        TextFieldComponent={TextField}
                        views={["year", "month", "date"]}
                        value={date || new Date()}
                        onChange={val => {
                            const date = val?.toString()
                            if (date) {
                                setDate(date || "")
                            }
                        }}
                    />
                </>
            )
        }
        if (step === 2) {
            console.log("step 2")
            if (isFetching || !schedulesData) {
                return (
                    <div className="d-flex justify-content-center">
                        <Spinner color="black" />
                    </div>
                )
            }
            const { schedule, allowed_booking_days } : { schedule:any[] , allowed_booking_days : any} = schedulesData

            
            return (
                <>
                    <CarySelect
                        variant="User"
                        options={allowed_booking_days}
                        getName={val =>
                            new Date(Date.parse(val.date)).toDateString() || ""
                        }
                        title="More Available Days"
                        selectedOption={allowed_booking_days.find(
                            (item:any )=> item.date == selectedDate
                        )}
                        onChange={e => {
                            e && loadSchedules(e.date)
                            e && setSelectedDate(e.date)
                            e && setDate(e.date)
                            e && setTimeSelected(null)
                        }}
                    />
                    
                    <CarySelect
                        variant="User"
                        options={schedule}
                        getName={val => val.time || ""}
                        title={`Available Time for ${new Date(
                            Date.parse(date)
                        ).toDateString()}`}
                        onChange={(e) => { 

                            setSelectedVehicle(
                                schedule.find(
                                    item => item.time == e.time
                                )?.vehicles &&
                                schedule.find(
                                item => item.time == e.time
                            )?.vehicles[0].id)

                            setTimeSelected(e)
                        }}
                    />
                    
                    {timeSelected &&  (
                        <>
                        {
                        !schedule.find(
                            item => item.time == timeSelected.time
                        ).vehicles  && "No vehicles found"
                        }
                            <CarySelect
                                variant="User"
                                
                                options={
                                     schedule &&
                                     schedule.find(
                                        item => item.time == timeSelected.time
                                    ).vehicles
                                }
                                getName={(val:any) => val.name + " " + val.id || ""}
                                title="Available Vehicle"
                                onChange={(e) => {

                                    setSelectedVehicle(e.id)
                                }
                                }
                            />
                        </>
                    )}
                </>
            )
        }
        
    }

    return (
        <Popup
            title={
                <>
                    Update Order <span>Schedule</span>
                </>
            }
            onClose={onClose}
        >
            {renderDate()}

            <div className="Add-user text-center">
                {step === 2 && (
                    <Button
                        onClick={() => {
                            setStep(1)
                            setSelectedDate("")
                            setTimeSelected(null)
                            setSelectedVehicle(null)
                        }}
                        className="mt-5 text-center popup-button"
                    >
                        Go Back
                    </Button>
                )}
                {step === 3 && (
                    <Button
                        onClick={() => {
                            setStep(2)
                        }}
                        className="mt-5 text-center popup-button"
                    >
                        Go Back
                    </Button>
                )}
                <Button
                    onClick={handleUpdate}
                    className="mt-5 ml-5 text-center popup-button"
                    loading={isSending}
                >
                    Next
                </Button>
                <Button onClick={onClose} variant="outline">
                    Cancel
                </Button>
            </div>
        </Popup>
    )
}
