import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../components/adminlayout/adminlayout";
import { Paper } from "../../components/paper/paper";
import Spinner from "../../components/spinner/spinner";
import { useQueryParam } from "../../hooks/useQueryParam";
import DetailInputGroup from "../../components/inputdetails/inputdetails";
import { useGet } from "hooks/useGet";
import Switch from "react-ios-switch";
import { useToasts } from "react-toast-notifications";
import Button from "../../components/button/button";
import { handleErrors, validateFields } from "../../helpers/helpers";
import withAuth from "../../components/withAuth/withAuth";
import { IVehicleDetails, ILocations } from "../../helpers/interfaces";
import { Table } from "components/table/table";
import { BiPencil } from "react-icons/bi";
import { updatLocation } from "../../helpers/helpers";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsEye } from "react-icons/bs";
import { navigate } from "gatsby";
import { AiOutlinePlus } from "react-icons/ai";
import { AddVehicleToLocationPopup } from "../../components/popup/AddVehicleToLocationPopup";

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
  reset?: boolean;
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
              value={!reset ? lat : ""}
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
              value={!reset ? long : ""}
              placeholder={placelong}
            />
          </td>
        </>
      }

      <td>
        <span
          style={{ display: "inline-block", color: "#b75555" }}
          className="bin-icon w-50  cursor-pointer"
          onClick={(e) => {
            coordinateDelete(e, index);
          }}
        >
          <RiDeleteBin6Line />
        </span>
      </td>
    </tr>
  );
};

const Locationdetail = () => {
  const id = useQueryParam("id");

  const [addVehiclePopUp, setAddVehiclePopup] = useState(false);

  var { isReady, data, refetchData } = useGet<
    ILocations[],
    {
      city: string;
      area: string;
      polygon: { lat: string; long: string }[];
      is_active: boolean;
    }
  >(`/api/v2/orders/allowed-locations`, []);

  var {
    isReady: isReadyVehicles,
    data: dataVehicles,
    refetchData: refetchVehicles,
  } = useGet<
    IVehicleDetails[],
    {
      city: string;
      area: string;
      polygon: { lat: string; long: string }[];
      is_active: boolean;
    }
  >(`/api/v2/providers/vehicles?location_id=${id}`, []);

  const locationdetailsRef = useRef<ILocations | null>(null);

  const [locationdetails, setLocationDetails] = useState<ILocations | null>(
    null
  );

  const [isActive, setIsActive] = useState(false);

  const [city, setCity] = useState("");
  const [area, setArea] = useState<string | null>("");
  const [polygonArray, setPolygonArray] = useState<
    { lat: string; long: string }[]
  >([]);
  const [tempPolygonArray, settempPolygonArray] = useState<
    { lat: string; long: string }[] | null
  >([]);
  const [Clearinputs, setClearinputs] = useState(true);

  const { addToast } = useToasts();

  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    if (!Clearinputs) {
      addToast("Save coordinates first", {
        autoDismiss: true,
        appearance: "error",
      });

      setIsSaving(false);
      return;
    }
    const data = {
      id: locationdetails?.id,
      city: city,
      area: area as string,
      polygon: polygonArray,
      is_active: isActive,
    };

    const arrayClientErrors = validateFields(data, addToast, "polygon");
    console.log(data);

    if (arrayClientErrors.length > 0) {
      setIsSaving(false);
      return;
    }

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
      setIsSaving(false);
      refetchData();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    obj: { lat: string; long: string }
  ) => {
    const [...temparr] =
      tempPolygonArray && tempPolygonArray.length > 0
        ? tempPolygonArray
        : polygonArray;

    temparr[index] = obj;

    settempPolygonArray([...(temparr as [])]);

    console.log(temparr);
  };

  const handleSave = () => {
    if (tempPolygonArray && tempPolygonArray.length > 0)
      setPolygonArray([...tempPolygonArray]);

    setClearinputs(true);
  };

  const onReset = () => {
    if (locationdetailsRef.current !== null) {
      setArea(locationdetailsRef.current.area);
      setCity(locationdetailsRef.current.city);
      setIsActive(locationdetailsRef.current.is_active);
    }
  };

  useEffect(() => {
    console.log(dataVehicles);
    if (data.length > 0) {
      data.map((item) => {
        if (item.id == id) {
          locationdetailsRef.current = item;

          setLocationDetails(item);
          setArea(item.area);
          setCity(item.city);

          setIsActive(item.is_active);
          setPolygonArray(
            item.polygon
              .replace(/\(/g, "")
              .replace(/\)/g, "")
              .replace("POLYGON", "")
              .split(",")
              .map((e: string) => {
                let arr = e.trim().split(" ");
                return { lat: arr[1], long: arr[0] };
              })
          );
        }
      });
    }
  }, [isReady, isReadyVehicles]);

  const coordinateDelete = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => {
    let oldArray: { lat: string; long: string }[] | null = polygonArray;
    oldArray?.splice(index, 1);
    setPolygonArray([...(oldArray as [])]);

    settempPolygonArray(null);
    setClearinputs(true);
    addToast("Coordinate deleted", {
      autoDismiss: true,
      appearance: "success",
    });
  };

  return (
    <AdminLayout title="Location Details">
      {!locationdetails && (
        <Paper className="mt-5 p-5 d-flex align-items-center justify-content-center">
          <Spinner color="#333" />
        </Paper>
      )}
      {locationdetails && (
        <>
          <Paper className="mt-5 p-5">
            <div className="row">
              <div className="col-md-6">
                <div className="User-details">
                  <DetailInputGroup
                    type="number"
                    label="Location ID"
                    disabled
                    value={locationdetails.id}
                  />
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-start">
                <div className="is-active">
                  <span>Is Active</span>
                  <Switch
                    checked={isActive}
                    handleColor="white"
                    offColor="white"
                    onChange={() => {
                      setIsActive(!isActive);
                    }}
                    onColor="#007BFF"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="first-name">
                  <DetailInputGroup
                    type="text"
                    label="City"
                    name="first_name"
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                    value={city}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="last-name">
                  <DetailInputGroup
                    type="text"
                    label="Area"
                    name="last_name"
                    onChange={(e) => {
                      setArea(e.target.value);
                    }}
                    value={area as string}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <Table
                  title="Polygons"
                  button={
                    <>
                      <Button
                        className="btn Add-btn mt-1 px-2 py-2 text-right"
                        onClick={() => {
                          setClearinputs(true);
                          handleSave();
                        }}
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
                    {polygonArray &&
                      polygonArray.map((coordinate, i) => {
                        return (
                          <LocationRow
                            index={i}
                            coordinate={coordinate}
                            coordinateDelete={coordinateDelete}
                            reset={Clearinputs}
                            handleChange={handleChange}
                          />
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="User-form">
              <div className="User-submit text-right">
                <Button
                  loading={isSaving}
                  onClick={onSave}
                  className="btn mt-5 text-right"
                >
                  Save Changes
                </Button>
                <Button onClick={onReset} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          </Paper>

          <Table
            title="Vehicles"
            button={
              <Button
                className="Add-btn p-2 px-3"
                onClick={() => setAddVehiclePopup(true)}
              >
                <AiOutlinePlus className="plus-icon" />
                Add
              </Button>
            }
          >
            {addVehiclePopUp && (
              <AddVehicleToLocationPopup
                id={id}
                onAdd={refetchVehicles}
                onClose={() => setAddVehiclePopup(false)}
              />
            )}

            <thead className="table-head">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Is active</th>
                <th scope="col">Is cary</th>
                <th scope="col">View</th>
              </tr>
            </thead>
            <tbody>
              {dataVehicles &&
                dataVehicles.map((vehicle) => {
                  return (
                    <tr>
                      <td scope="row">{vehicle && vehicle.id}</td>
                      <td>{vehicle && vehicle.name}</td>
                      <td>{vehicle && vehicle.is_active.toString()}</td>
                      <td>{vehicle && vehicle.is_cary.toString()}</td>
                      <td
                        onClick={(e) => {
                          navigate(`/dashboard/vehicledetail?id=${vehicle.id}`);
                        }}
                        className="eye-icon cursor-pointer"
                      >
                        <BsEye />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </>
      )}
    </AdminLayout>
  );
};

export default withAuth(Locationdetail);
