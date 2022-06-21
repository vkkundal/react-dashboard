import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../components/adminlayout/adminlayout";
import { Paper } from "../../components/paper/paper";
import Spinner from "../../components/spinner/spinner";
import { useQueryParam } from "../../hooks/useQueryParam";
import DetailInputGroup from "../../components/inputdetails/inputdetails";
import SelectInput from "../../components/Selectinput/selectinput";

import Switch from "react-ios-switch";
import { useToasts } from "react-toast-notifications";
import Button from "../../components/button/button";
import {
  fetchAdminDetail,
  fetchAdminRoles,
  saveUserInfo,
  saveRole,
  updateAdminEmailPass,
  handleErrors,
  validateFields,
} from "../../helpers/helpers";
import { IAdminDetail } from "../../helpers/interfaces";
import withAuth from "../../components/withAuth/withAuth";

const Admindetail = () => {
  const id = useQueryParam("id");
  const adminDetailsRef = useRef<IAdminDetail | null>(null);

  const [adminDetails, setAdminDetails] = useState<IAdminDetail | null>(null);

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const { addToast } = useToasts();

  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);

    const data = adminDetails?.user;

    const arrayClientErrors = validateFields(data,addToast);



  
    try {
      if (adminDetails) {
        await saveUserInfo(id, adminDetails.user);
        await saveRole("admins", id, adminDetails.role.id);
        if (adminDetailsRef.current) {
          adminDetailsRef.current.user = adminDetails.user;
        }
      }

      addToast("Details Saved", {
        autoDismiss: true,
        appearance: "success",
      });
    } catch (e) {

      handleErrors(e , addToast , arrayClientErrors)

      
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof IAdminDetail["user"];

    console.log(e.target.name);
    const value = e.target.value;
    console.log(adminDetails);

    setAdminDetails((old) => {
      if (!old) {
        return null;
      }
      return {
        ...old,
        user: { ...old.user, [name]: value },
      };
    });
  };

  const toggleSwitch = () => {
    setAdminDetails((old) => {
      if (!old) {
        return null;
      }
      return {
        ...old,
        user: { ...old.user, is_active: !old.user.is_active },
      };
    });
  };

  
  const handleChangeRole = (index: number) => {
    setAdminDetails((old) => {
      if (!old) {
        return old;
      }
      return {
        ...old,
        role: roles[index],
      };
    });
  };

  const [isChangingImail, setIschanging] = useState(false);

  const onChangeEmail = async () => {

    console.log(email)
   
    if (!email && !password ) {


      addToast("Enter email", {
        autoDismiss: true,
        appearance: "error",
      });
      return;
    }

  
    if (!password) {
      addToast("Enter a Password", {
        autoDismiss: true,
        appearance: "error",
      });
      return;
    }
    setIschanging(true);
    try {
      if (adminDetails) {
        await updateAdminEmailPass(id, email as string, password);
        if (adminDetailsRef.current) {
          adminDetailsRef.current.admin.email = adminDetails.admin.email;
        }
      }

      addToast("Admin Updated", {
        autoDismiss: true,
        appearance: "success",
      });
    } catch (e) {
      
      handleErrors(e , addToast , undefined)

     
    } finally {
      setIschanging(false);
    }
  };

  const onReset = () => {
    setAdminDetails(adminDetailsRef.current);
  };

  useEffect(() => {
    if (id) {
      fetchAdminDetail(id).then((data) => {
        setAdminDetails(data);
        adminDetailsRef.current = data;
      });
      fetchAdminRoles().then((data) => {
        setRoles(data);
      });
    }
  }, [id]);
  return (
    <AdminLayout title="Admin Details">
      {!adminDetails && (
        <Paper className="mt-5 p-5 d-flex align-items-center justify-content-center">
          <Spinner color="#333" />
        </Paper>
      )}
      {adminDetails && (
        <>
          <Paper className="mt-5 p-5">
            <div className="row">
              <div className="col-md-6">
                <div className="User-details">
                  <DetailInputGroup
                    type="number"
                    label="User ID"
                    disabled
                    value={adminDetails.user.id}
                  />
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-start">
                <div className="is-active">
                  <span>Is Active</span>
                  <Switch
                    checked={adminDetails.user.is_active}
                    handleColor="white"
                    offColor="white"
                    onChange={toggleSwitch}
                    onColor="#007BFF"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="first-name">
                  <DetailInputGroup
                    type="text"
                    label="First Name"
                    name="first_name"
                    onChange={handleChangeUserData}
                    value={adminDetails.user.first_name}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="last-name">
                  <DetailInputGroup
                    type="text"
                    label="Last Name"
                    name="last_name"
                    onChange={handleChangeUserData}
                    value={adminDetails.user.last_name}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="User-phone">
                  <DetailInputGroup
                    type="tel"
                    label="Mobile"
                    name="mobile"
                    onChange={handleChangeUserData}
                    value={adminDetails.user.mobile}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="User-role">
                  <SelectInput
                    onChange={(e: React.ChangeEvent) => {
                      handleChangeRole((e.target as any).value);
                    }}
                    label="Role"
                  >
                    {roles.map((role, i) => {
                      return (
                        <option
                          key={role.name}
                          value={i}
                          selected={role.name === adminDetails.role.name}
                        >
                          {role.name}
                        </option>
                      );
                    })}
                  </SelectInput>
                </div>
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
          <Paper className="mt-5 p-5">
            <div className="row">
              <div className="col-md-6">
                <div className="User-email">
                  <DetailInputGroup
                    type="Email"
                    label="Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email === null ? adminDetails.admin.email : email}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="User-password">
                  <DetailInputGroup
                    type="Password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**********"
                  />
                </div>
              </div>
            </div>
            <div className="User-submit text-right">
              <Button
                onClick={onChangeEmail}
                loading={isChangingImail}
                className="btn mt-5 text-right"
              >
                Save Changes
              </Button>
              <Button onClick={onReset} variant="outline">
                Reset
              </Button>
            </div>
          </Paper>
        </>
      )}
    </AdminLayout>
  );
};

export default withAuth(Admindetail);
