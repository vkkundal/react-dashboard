import React, { useState } from "react";
import { Paper } from "../../components/paper/paper";
import InputGroup from "../inputgroup/inputgroup";
import Button from "../button/button";

import Switch from "react-ios-switch";
import { usePost } from "hooks/usePost";
import { useToasts } from "react-toast-notifications";
import { IItemType } from "helpers/interfaces";
import { handleErrors, validateFields } from "helpers/helpers";
import { usePut } from "hooks/usePut"

const AddItemtypepopup = ({
  onAdd,
  onClose,
  editPopUp,
  item
}: {
  onAdd: () => void;
  onClose: () => void;
  editPopUp?: boolean;
  item?: any;
}) => {
  const [name, setName] = useState(editPopUp ? item.name : "");
  
  const [name_ar, setName_ar] = useState(editPopUp ?  item.name_ar : "");
  const [isActive, setIsActive] = useState(false);
  const [isActiveEdit, setIsActiveEdit] = useState(editPopUp ? item.is_active : "");
  const [unique_identifier, setunique_identifier] = useState(editPopUp ? item.unique_identifier : "");
  const { isSending, post } = usePost<Omit<IItemType, "id">>(
    "/api/v2/items/types"
  );


  const {  put } = usePut<{
    name: string
    name_ar: string
    is_active: boolean
    unique_identifier: string
}>(`/api/v2/items/types/${editPopUp ? item.id :''}`)

  const { addToast } = useToasts();

  const handleAddition = async () => {
    const data= {
      is_active: isActive,
      name,
      name_ar,
      unique_identifier
    };

    const arrayClientErrors = validateFields(data, addToast, "tags");


    try {
      await post({ ...data });
      addToast("Item Type Added", {
        autoDismiss: true,
        appearance: "success",
      });
      onAdd && onAdd();
      onClose && onClose();
    } catch (e) {
      handleErrors(e, addToast, arrayClientErrors);
    }
  };

  const handleEdit = async () => {

    const data= {
      is_active: isActiveEdit,
      name,
      name_ar,
      unique_identifier
    };

    const arrayClientErrors = validateFields(data, addToast, "tags");


    try {
      await put({ ...data });
      addToast("Item Type Updated", {
        autoDismiss: true,
        appearance: "success",
      });
      onAdd && onAdd();
      onClose && onClose();
    } catch (e) {
      handleErrors(e, addToast, arrayClientErrors);
    }
    console.log('hhhh')
  }
  return (
    <div className="popup-overlay">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Paper className="p-5">
              <div className="text-center">
                <h2 className="popup-heading">
                  {editPopUp && 'Edit' || 'Add a new'}<span> item type</span>
                </h2>
              </div>
              <InputGroup
                labelClass="popup-label popup-name"
                wrapperClass="mb-2"
                type="text"
                name="full_name"
                label="Name"
                value={name}
                disabled={isSending}
                onChange={(e) => setName(e.target.value)}
              />
              <InputGroup
                labelClass="popup-label popup-name-ar"
                wrapperClass="mb-2"
                type="text"
                name="full_name"
                label="Name_Ar"
                disabled={isSending}
                value={ name_ar}
                onChange={(e) => setName_ar(e.target.value)}
              />
              <InputGroup
                labelClass="popup-label popup-name-ar"
                wrapperClass="mb-2"
                type="text"
                name="Unique ID"
                label="Unique ID"
                disabled={isSending}
                value={ unique_identifier}
                onChange={(e) => setunique_identifier(e.target.value)}
              />
              
              <div className="popup-status text-center mt-4">
                <span className="popup-switch mr-2">Is Active </span>
                <Switch
                  checked={editPopUp ? isActiveEdit  : isActive }
                  onChange={() =>{ 
                    editPopUp && setIsActiveEdit((val:any) => !val)
                    || setIsActive((val) => !val)

                  }}
                  handleColor="white"
                  offColor="white"
                  onColor="#007BFF"
                />
              </div>
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="Add-user text-center">
                    <Button
                      loading={isSending}
                      onClick={editPopUp ? handleEdit : handleAddition}
                      className="mt-5 text-center popup-button"
                    >
                       {editPopUp ? 'Update' : 'Add' }
                    </Button>
                    <Button onClick={onClose} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddItemtypepopup;
