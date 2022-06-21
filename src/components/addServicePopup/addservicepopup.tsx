import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useToasts } from "react-toast-notifications"
import { IService } from "../../helpers/interfaces"
import { ProviderService } from "../../helpers/ProviderService"
import { ServicesService } from "../../helpers/ServicesService"
import Button from "../button/button"
import { Paper } from "../paper/paper"
import SelectInput from "../../components/Selectinput/selectinput"

export default function AddServicePopup({
    providerId,
    onClose,
    onAdd,
}: {
    providerId: string
    onClose?: () => void
    onAdd?: () => void
}) {
    const [isCreating, setIsCreating] = useState(false)

    const [services, setServices] = useState<IService[]>([])

    const [selectedService, setSelectedService] = useState(0)
    useEffect(() => {
        ServicesService.getServices().then(setServices)
    }, [])
    const { addToast } = useToasts()
    const handleAddition = async () => {
        setIsCreating(true)
        try {
            await ProviderService.addService(
                providerId,
                services[selectedService].id
            )
            addToast("Service added To Provider", {
                autoDismiss: true,
                appearance: "success",
            })
            onAdd && onAdd()
            onClose && onClose()
        } catch (e) {
            addToast("An Error Occurred", {
                autoDismiss: true,
                appearance: "error",
            })
        } finally {
            setIsCreating(false)
        }
    }

    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="container service-popup">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Paper
                            onClick={e => e.stopPropagation()}
                            className="p-5"
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">
                                    Add a new <span>Service</span>
                                </h2>
                            </div>

                             <div className="User-role">
                                <label className="popup-role">Service</label>
                                <SelectInput
                                    disabled={isCreating}
                                    onChange={(e : React.ChangeEvent )=> {
                                        setSelectedService(
                                            parseInt((e.target as HTMLInputElement).value)
                                        )
                                    }}
                                    name="role"
                                    className="User-select"
                                >
                                    {services.map((service, i) => {
                                        return (
                                            <option
                                                key={service.id}
                                                value={i}
                                                selected={i === selectedService}
                                            >
                                                {service.name}
                                            </option>
                                        )
                                    })}
                                </SelectInput>
                            </div> 

                            <div className="Add-user text-center">
                                <Button
                                    loading={isCreating}
                                    onClick={handleAddition}
                                    variant="green"
                                    className="mt-5 text-center"
                                >
                                    Add
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
