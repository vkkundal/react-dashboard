import { InputGroup } from "components/inputgroup";
import { Paper } from "components/paper/paper";
import React, { useState, useEffect } from "react";
import Button from "../button/button";
import { useInputState } from "hooks/useInputState";
import Switch from "react-ios-switch";
import { Table } from "components/table/table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { updatLocation } from "../../helpers/helpers";
import { useToasts } from "react-toast-notifications";
import { BiPencil } from "react-icons/bi";
import { ILocations } from "../../helpers/interfaces";
import { handleErrors, validateFields } from "helpers/helpers";

const LocationRow = ({
  coordinate,
  coordinateDelete,
  index,
  handleChange,
  reset,
}: {
  coordinate: { lat: string; long: string };
  coordinateDelete: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => void;
  index: number;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    { lat, long }: { lat: string; long: string }
  ) => void;
  reset: boolean;
}) => {
  const [lat, setLat] = useState(coordinate.lat);
  const [long, setLong] = useState(coordinate.long);

  const [placelat, setPlaceLat] = useState("");
  const [placelong, setPlaceLong] = useState("");

  useEffect(() => {
    setPlaceLat(coordinate.lat);
    setPlaceLong(coordinate.long);
  });

  return (
    <tr>
      {
        <>
          <td>
            <input
              className="input p-2 w-100"
              onChange={(e) => {
                setLat(e.target.value);
                handleChange(e, index, { lat: e.target.value, long: long });
              }}
              placeholder={placelat}
              disabled={reset}
              value={!reset ? undefined : lat}
            />
          </td>
          <td>
            <input
              className="input p-2 w-100"
              onChange={(e) => {
                setLong(e.target.value);
                handleChange(e, index, { lat: lat, long: e.target.value });
              }}
              disabled={reset}
              value={!reset ? undefined : long}
              placeholder={placelong}
            />
          </td>
        </>
      }

      <td>
        <span
          style={{ display: "inline-block" }}
          onClick={(e) => {
            coordinateDelete(e, index);
          }}
          className="bin-icon w-50  cursor-pointer"
        >
          <RiDeleteBin6Line />
        </span>
      </td>
    </tr>
  );
};

const EditLocationPopup = ({
  modelValues,
  onClose,
  onAdd,
}: {
  modelValues: ILocations;
  onClose?: () => void;
  onAdd?: () => void;
}) => {
  const [city, setCity] = useState(modelValues.city);
  const [area, setArea] = useState(modelValues.area);
  const [lat, setLat] = useInputState();
  const [long, setLong] = useInputState();
  const [isCreating, setIsCreating] = useState(false);
  const [isActive, setIsActive] = useState(modelValues.is_active);
  const [coordinates, setCoordinates] = useState<
    null | { lat: string; long: string }[]
  >(
    modelValues.polygon
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace("POLYGON", "")
      .split(",")
      .map((e: string) => {
        let arr = e.trim().split(" ");
        return { lat: arr[1], long: arr[0] };
      })
  );
  const [EditedCoordinates, setEditCoord] = useState<
    { lat: string; long: string }[] | null
  >();

  const [Clearinputs, setClearinputs] = useState(true);

  const { addToast } = useToasts();

  const handleAddition = async () => {
    setIsCreating(true);

    if (!Clearinputs) {
      addToast("Save coordinates first", {
        autoDismiss: true,
        appearance: "error",
      });

      setIsCreating(false)
      return;
    }

    const data = {
      id: modelValues.id,
      city: city,
      area: area,
      polygon: coordinates,
      is_active: isActive,
    };

    const arrayClientErrors = validateFields(data, addToast, "polygon");

    if (arrayClientErrors.length > 0) {
      setIsCreating(false);
      return;
    }

    console.log(data);
    try {
      if (1) {
        await updatLocation({
          ...data,
        });

        addToast("Location Updated", {
          autoDismiss: true,
          appearance: "success",
        });
      }
    } catch (e) {
      handleErrors(e, addToast, arrayClientErrors);
    } finally {
      setIsCreating(false);
      onAdd && onAdd();
      onClose && onClose();
    }
  };

  const handleCoordinateAddition = async () => {
    setClearinputs(true);
    setEditCoord(null);

    let newCordinateArray: { lat: string; long: string } = {
      lat: lat,
      long: long,
    };

    let oldArray: { lat: string; long: string }[] | null = coordinates;
    oldArray?.push(newCordinateArray);

    setCoordinates([...(oldArray as [])]);
  };

  const coordinateDelete = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => {
    let oldArray: { lat: string; long: string }[] | null = coordinates;
    oldArray?.splice(index, 1);
    setCoordinates([...(oldArray as [])]);

    setEditCoord(null);
    setClearinputs(true);
    addToast("Coordinate deleted", {
      autoDismiss: true,
      appearance: "success",
    });
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    obj: { lat: string; long: string }
  ) => {
    let oldArray: { lat: string; long: string }[] | null = [
      ...(EditedCoordinates ? EditedCoordinates : (coordinates as [])),
    ];

    if (oldArray) {
      oldArray[index] = {
        lat: obj.lat ? obj.lat : oldArray[index].lat,
        long: obj.long ? obj.long : oldArray[index].long,
      };
    }

    console.log(oldArray);

    setEditCoord([...oldArray]);
  };

  const saveCoordiantes = () => {
    console.log(EditedCoordinates);

    if (EditedCoordinates && EditedCoordinates?.length > 0) {
      let oldArray = [...EditedCoordinates];
      setCoordinates([...oldArray]);
    }

    addToast("Coordinate saved", {
      autoDismiss: true,
      appearance: "success",
    });

    setEditCoord(null);
    setClearinputs(true);
  };
  return (
    <div className="popup-overlay">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Paper onClick={(e) => e.stopPropagation()} className="p-5">
              <div className="text-center">
                <h2 className="popup-heading">
                  Edit <span>Location</span>
                </h2>
              </div>
              <InputGroup
                labelClass="popup-label"
                wrapperClass="mb-2"
                type="text"
                value={modelValues.id}
                name="id"
                label="Id"
                disabled={true}
              />
              <InputGroup
                labelClass="popup-label"
                wrapperClass="mb-2"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                name="city"
                label="City"
                disabled={isCreating}
              />
              <InputGroup
                labelClass="popup-label"
                wrapperClass="mb-2"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                name="area"
                label="Area"
                disabled={isCreating}
              />
              <p className="popup-label ml-0">Add Polygons</p>
              <div className="row no-gutters">
                <div className="col-5 pr-2">
                  <InputGroup
                    labelClass="popup-label"
                    wrapperClass="mb-2"
                    type="number"
                    name="lat"
                    value={lat}
                    onChange={setLat}
                    label="Lat"
                    disabled={isCreating}
                  />
                </div>
                <div className="col-5 pr-2">
                  <InputGroup
                    labelClass="popup-label"
                    wrapperClass="mb-2"
                    type="number"
                    value={long}
                    onChange={setLong}
                    name="long"
                    label="Long"
                    disabled={isCreating}
                  />
                </div>
                <div className="col-2">
                  <Button
                    variant="green"
                    className="mt-3 text-center popup-button w-100 px-2"
                    onClick={handleCoordinateAddition}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <Table
                title="Polygons"
                button={
                  <>
                    <Button
                      className="btn mt-1 mr-3 px-2 py-2 text-right"
                      onClick={() => {
                        setEditCoord(null);
                        setClearinputs(true);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      className="btn mt-1 px-2 py-2 text-right"
                      onClick={saveCoordiantes}
                    >
                      Save
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.144)",
                        color: "#000",
                      }}
                      className="btn mt-1 ml-3 px-4 py-2 text-right"
                      onClick={() => {
                        setClearinputs(false);
                      }}
                    >
                      <BiPencil />
                    </Button>
                  </>
                }
              >
                <colgroup>
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead className="table-head">
                  <tr>
                    <th scope="col">Lat</th>
                    <th scope="col">Long</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody id="adminbody">
                  {coordinates &&
                    coordinates.map((coordinate, i) => {
                      return (
                        <LocationRow
                          index={i}
                          coordinateDelete={coordinateDelete}
                          handleChange={handleChange}
                          coordinate={coordinate}
                          reset={Clearinputs}
                        />
                      );
                    })}
                </tbody>
              </Table>

              <div className="popup-status text-center mt-5">
                <span className="popup-switch mr-2">Is Active </span>
                <Switch
                  checked={isActive}
                  handleColor="white"
                  offColor="white"
                  onChange={() => setIsActive((val: boolean) => !val)}
                  onColor="#007BFF"
                />
              </div>
              <div className="Add-user text-center">
                <Button
                  variant="green"
                  className="mt-5 text-center popup-button"
                  onClick={handleAddition}
                  loading={isCreating}
                >
                  Update
                </Button>
                <Button variant="outline" onClick={onClose}>
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

export default EditLocationPopup;
