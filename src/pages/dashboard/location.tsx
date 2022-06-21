import AdminLayout from "components/adminlayout/adminlayout";
import Button from "components/button/button";
import EditLocationPopup from "components/popup/editLocationPopup";
import LocationPopup from "components/popup/AddLocationPopup";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Table } from "components/table/table";
import { useGet } from "hooks/useGet";
import { ILocations } from "../../helpers/interfaces";
import { BiPencil } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { navigate } from "gatsby";

const LocationRow = ({
  coordinate,
  onAdd,
}: {
  coordinate: ILocations;
  onAdd: () => void;
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [coordinatesArr] = useState(
    coordinate.polygon
      .slice(10)
      .replace(/\)/g, "")
      .split(",")
      .map((el) => {
        let arr = el.trim().split(" ");
        return { lat: arr[1], long: arr[0] };
      })
  );

  return (
    <tr>
      {isPopupOpen && (
        <EditLocationPopup
          onAdd={onAdd}
          modelValues={coordinate}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
      <td>{coordinate.id}</td>
      <td>{coordinate.city}</td>
      <td>{coordinate.area}</td>
      <td>{coordinate.is_active ? "Active" : "Inactive"}</td>
      <td
        style={{
          textAlign: "right",
          display: "flex",
          justifyContent: "space-between",
          minWidth: "58%",
          margin: "auto",
        }}
      >
        <div className='mr-3' style={{ display: "inline-block" }}>
          <h5 style={{textAlign:"center"}}>Lat</h5>
          {coordinatesArr.map((el) => {
            return (
              <>
                <span>{(+el.lat).toFixed(2)}</span>
                <br></br>
              </>
            );
          })}
        </div>
        <div style={{ display: "inline-block" }}>
          <h5 style={{textAlign:"center"}}>Long</h5>
          {coordinatesArr.map((el) => {
            return (
              <>
                <span>{(+el.long).toFixed(2)}</span>
                <br></br>
              </>
            );
          })}
        </div>
      </td>
      <td>
        <span
          style={{
            width: "42px",
            display: "inline-block",
            height: "35px",
            verticalAlign: "middle",
            fontSize: "14px",
          }}
          onClick={() => setIsPopupOpen(true)}
          className="bin-icon cursor-pointer mr-2"
        >
          <BiPencil style={{ marginTop: "13px" }} />
        </span>

        <span
          style={{
            width: "42px",
            display: "inline-block",
            height: "35px",
            verticalAlign: "middle",
          }}
          onClick={(e) => {
            navigate(`/dashboard/locationsdetail?id=${coordinate.id}`);
          }}
          className="eye-icon cursor-pointer ml-2"
        >
          <BsEye />
        </span>
      </td>
    </tr>
  );
};

const Location = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { isReady, data, refetchData } = useGet<
    ILocations[],
    {
      city: string; 
      area: string;
      polygon: { lat: string; long: string }[];
      is_active: boolean;
    }
  >(`/api/v2/orders/allowed-locations`, [], [null]);


  useEffect(() => {
    console.log("in useeffect");
    refetchData()
  }, []);

  return (
    <>
      <AdminLayout title="Locations">
        <div className="mt-5 d-flex justify-content-between align-items-center">
          <Button onClick={() => setIsPopupOpen(true)}>
            <AiOutlinePlus className="plus-icon" />
            Add
          </Button>
        </div>
        {isPopupOpen && (
          <LocationPopup
            onAdd={refetchData}
            onClose={() => setIsPopupOpen(false)}
          />
        )}

        <Table loading={!isReady} title="Latest Locations">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          <thead className="table-head">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">City</th>
              <th scope="col">Area</th>
              <th scope="col">Status</th>
              <th scope="col">Polygons</th>
              <th scope="col">View</th>
            </tr>
          </thead>
          <tbody id="adminbody">
            {data.map((element) => (
              <LocationRow onAdd={refetchData} coordinate={element} />
            ))}
          </tbody>
        </Table>
      </AdminLayout>
    </>
  );
};

export default Location;
