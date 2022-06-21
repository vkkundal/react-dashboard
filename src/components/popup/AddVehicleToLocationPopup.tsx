import React, { useState, useEffect } from "react";
import { Paper } from "../paper/paper";
import Button from "components/button/button";
import { useToasts } from "react-toast-notifications";
import {  validateFields } from "helpers/helpers";
import { usePost } from "hooks/usePost";
import { api } from "../../api";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

export const AddVehicleToLocationPopup = ({
  id,
  onClose,
  onAdd,
}: {
  id: string;
  onClose: () => void;
  onAdd?: () => void;
}) => {
  const { post } = usePost<{
    location_id : number,
    vehicle_id : number
  }>(`/api/v2/providers/vehicles/locations`);
  const [allvehicles, setAllvehicles] = useState<{
    id: number
    is_active: boolean
    is_cary: boolean
    name: string
  }[]>([]);

  useEffect(() => {
      api.get("/api/v2/providers/vehicles").then((response) => {
      setAllvehicles(response.data);
    });
  }, []);

  const [vehicleId, setVehicleid] = useState(0);
  const [isSaving , setIsSaving] = useState(false)
  console.log("times");
  console.log(allvehicles);

  const { addToast } = useToasts();

  const handleAdd = async () => {

    setIsSaving(true)
    let arrayClientErrors = validateFields(
        {
            provider_user_id: +id,
            vehicle_id: +vehicleId,
          },
        addToast
      );

    if (arrayClientErrors.length > 0) return;

    try {
      await post({
        location_id: +id,
        vehicle_id: +vehicleId,
      });

      addToast("Vehicle assigned", {
        autoDismiss: true,
        appearance: "success",
      });

      onAdd && onAdd();
      onClose && onClose();
    } catch (e) {
      addToast("Invalid id or internet error", {
        autoDismiss: true,
        appearance: "error",
      });

      onClose();
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h2 className="popup-heading">
                  Assign <span> Vehicle</span>
                </h2>
              </div>
              <div className="row">
                <div className="col-md-6"></div>
              </div>
              
              <Autocomplete
                className='w-100 mt-4'
                id="disabled-options-demo"
                options={allvehicles}
                getOptionLabel={(option:any) => { return option.name}}
                style={{ width: 300 }}
                onChange={(event, newValue) => {

                    newValue && setVehicleid(newValue.id)

                  }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Car"
                    variant="outlined"
                  />
                )}
              />
              <div className="Add-user text-center">
                <Button
                  onClick={handleAdd}
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
  );
};
