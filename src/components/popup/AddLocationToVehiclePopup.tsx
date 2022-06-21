import React, {  useState } from "react";
import { Paper } from "../paper/paper";
import Button from "components/button/button";
import { useToasts } from "react-toast-notifications";
import { usePost } from "hooks/usePost"
import InputGroup from "components/inputgroup/inputgroup"

export const AddLocationtoVehiclePopup = ({
    id,
    onClose,
    onAdd,
}: {

    id : string
    onClose: () => void;
    onAdd?: () => void;

}) => { 
    
    
    const { post } = usePost<{
        location_id : number,
        vehicle_id : number
    }>(`/api/v2/providers/vehicles/locations`)

    const [isSaving , setIsSaving] = useState(false)
    const [providerId, setProviderid] = useState('');
      

    const { addToast } = useToasts();

 
    const handleAdd = async () => {
        
        setIsSaving(true)
        try {

            await post({
                location_id : +providerId,
                vehicle_id : +id
            })

            addToast("Assigned to location", {
                autoDismiss: true,
                appearance: "success",
            
            });
            
            onAdd && onAdd();
            onClose && onClose();
        } catch (e) {
            addToast("Invalid location id or internet error", {
                autoDismiss: true,
                appearance: "error",
            
            });
            onClose()

        } 
        finally {
            setIsSaving(false)
        }
    };



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
                                    Assign to  <span> Location Id</span>
                                </h2>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                </div>
                            </div>
                            <InputGroup
                                        labelClass="popup-label popup-name"
                                        wrapperClass="mb-2"
                                        type="text"
                                        name="Location Id"
                                        onChange={(e) => {  setProviderid(e.target.value) }}
                                        label="Id"
                                    />
                           
                            <div className="Add-user text-center">
                                <Button
                                    onClick={handleAdd}
                                    loading={isSaving}
                                    className="mt-5 text-center popup-button"
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

        </div>


    );
};
