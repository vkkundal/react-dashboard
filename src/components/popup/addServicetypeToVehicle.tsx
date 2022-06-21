import React, {  useState } from "react";
import { Paper } from "../paper/paper";
import Button from "components/button/button";
import { useToasts } from "react-toast-notifications";
import { useGet } from "hooks/useGet";
import { usePost } from "hooks/usePost"
import {
    IService
  } from "../../helpers/interfaces";
export const AddServiceTypetoVehiclePopup = ({
    id,
    onClose,
    onAdd,
}: {

    id : string
    onClose: () => void;
    onAdd?: () => void;

}) => { 
    
    
    const { post } = usePost<{service_type_id : number}>(`/api/v2/providers/vehicles/${id}/service-types`)

    const { data: allServicetypes } = useGet<IService[] | null>(
        `/api/v2/services/types`,
        null,
        []
      );
    const [selectedItemType, setSelectedItemType] = useState('11');
    console.log('times')
      
    const { addToast } = useToasts();

    const [isSaving , setIsSaving] = useState(false)

    const handleAdd = async () => {
        
        setIsSaving(true)
        try {

            await post({
                service_type_id : +selectedItemType
            })

            addToast("A new Service Type Added", {
                autoDismiss: true,
                appearance: "success",
            
            });
            
            onAdd && onAdd();
            onClose && onClose();
        } catch (e) {
            console.dir(e)
            addToast("Provider already has this service or internet error ", {
                autoDismiss: true,
                appearance: "error",
            
            });
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
                                    Add a new <span> SERVICE TYPE </span>
                                </h2>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                </div>
                            </div>
                            <label className="popup-role  mb-2">Item Type</label>
                            <select name="role mb-2" value={selectedItemType} onChange={e => {
                                setSelectedItemType(e.target.value)
                            }} className="popup-select">
                                {allServicetypes &&  allServicetypes.map((item: any) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </select>
                           
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
