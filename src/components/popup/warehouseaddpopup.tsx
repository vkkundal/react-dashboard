import React, { useCallback, useState } from "react";
import { Paper } from "../paper/paper";
import InputGroup from "../inputgroup/inputgroup";
import Button from "../button/button";
import { usePost } from "../../hooks/usePost";
import { useToasts } from "react-toast-notifications";
import produce from "immer";
import { passTargetVal } from "helpers/helpers";
import Switch from "react-ios-switch";
import { handleErrors, validateFields } from "helpers/helpers"

const Warehouseaddpopup = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd?: () => void;
}) => {
  const [isActive, setIsActive] = useState(true);
  const [state, setState] = useState({
    name: "",
    location: { lat: "", long: "" },
    is_active: isActive,
    mobile: "",
  });

  const { isSending, post } = usePost<typeof state>("/api/v2/warehouses");

  const { addToast } = useToasts();

  const handleSave = useCallback(async () => {

    const arrayClientErrors = validateFields(state,addToast, 'mobile');

  
    try {
      await post(state);
      onAdd && onAdd();

      addToast("A new Warehouse Added", {
        autoDismiss: true,
        appearance: "success",
      });
      onClose && onClose();
    } catch (e) {

      handleErrors(e , addToast , arrayClientErrors)

    }
  }, [state, onAdd]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <Paper className="p-5" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <h2 className="popup-heading">
                  Add a new <span> warehouse</span>
                </h2>
              </div>
              <InputGroup
                labelClass="popup-label popup-name"
                wrapperClass="mb-2"
                type="text"
                name="full_name"
                label="Name"
                onChange={passTargetVal((val) =>
                  setState((old) =>
                    produce(old, (draft) => {
                      draft.name = val;
                    })
                  )
                )}
                disabled={isSending}
                value={state.name}
              />
              <InputGroup
                labelClass="popup-label popup-name-lat"
                wrapperClass="mb-2"
                type="number"
                name="full_name"
                label="Lat"
                disabled={isSending}
                onChange={passTargetVal((e) =>
                  setState((old) =>
                    produce(old, (draft) => {
                      draft.location.lat = e;
                    })
                  )
                )}
                value={state.location.lat}
              />
              <InputGroup
                labelClass="popup-label popup-name-long"
                wrapperClass="mb-2"
                type="number"
                name="full_name"
                label="Long"
                onChange={passTargetVal((e) =>
                  setState((old) =>
                    produce(old, (draft) => {
                      draft.location.long = e;
                    })
                  )
                )}
                disabled={isSending}
                value={state.location.long}
              />
              <InputGroup
                labelClass="popup-label popup-name-long"
                wrapperClass="mb-2"
                type="number"
                name="mobile"
                label="Mobile"
                onChange={passTargetVal((e) =>
                  setState((old) =>
                    produce(old, (draft) => {
                      draft.mobile = e;
                    })
                  )
                )}
                disabled={isSending}
                value={state.mobile}
              />
              <div className="popup-status text-center mt-2">
                <span className="popup-switch mr-2">Is Active </span>
                <Switch
                  checked={isActive}
                  handleColor="white"
                  offColor="white"
                  onChange={() => setIsActive((val) => !val)}
                  onColor="#007BFF"
                />
              </div>
              <div className="Add-user text-center">
                <Button
                  onClick={handleSave}
                  loading={isSending}
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

export default Warehouseaddpopup;
