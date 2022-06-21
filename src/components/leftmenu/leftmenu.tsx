import React from "react"
import Logo from "../logo/logo"
import Dashboard from "../icons/dasboardicon"
import Admin from "../icons/adminicon"
import Car from "../icons/caricon"
import Customer from "../icons/customericon"
import Items from "../icons/items"
import Logout from "../icons/logouticon"
import Order from "../icons/ordericon"
import Services from "../icons/Servicesicon"
import Warehouse from "../icons/warehouse"
import Provider from "../icons/providericon"
import Invoices from "../icons/invoiceIcon"
import Vehicle from "../icons/vehicleicon"
import { VscLocation } from "react-icons/vsc"
import { LeftMenuItem } from "../leftmenuitem/leftmenuitem"
import { useDispatch } from "react-redux"
import { handleUserLogout } from "../../actions"
import { navigate } from "gatsby"
import { useToasts } from "react-toast-notifications"

const LeftMenu: React.FC = () => {
    const dispatch = useDispatch()

    const {addToast} = useToasts();

    const doLogout = () => {
        dispatch(
            handleUserLogout({
                onSuccess: () => {
                    addToast("Logout Successfull", {
                        autoDismiss: true,
                        appearance: "success"
                    })
                    navigate("/")

                },
            })
        )
    }

    

    return (
        <div className="leftmenu-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12 logo-panel">
                        <Logo variant="dark" />
                    </div>
                </div>
            </div>
            <ul className="nav">
                <LeftMenuItem
                    to="/dashboard"
                    exact
                    icon={<Dashboard />}
                    text="Dashboard"
                />
                <LeftMenuItem
                    to="/dashboard/admin"
                    icon={<Admin />}
                    text="Admin"
                />
                <LeftMenuItem
                    to="/dashboard/provider"
                    icon={<Provider />}
                    text="Provider"
                />
                <LeftMenuItem
                    to="/dashboard/customer"
                    icon={<Customer />}
                    text="Customer"
                />
                <LeftMenuItem to="/dashboard/car/" icon={<Car />} text="Car" />
                <LeftMenuItem to="/dashboard/orders/" icon={<Order />} text="Orders" />
                <LeftMenuItem to="/dashboard/item/" icon={<Items />} text="Item" />
                <LeftMenuItem to="/dashboard/services/" icon={<Services />} text="Services" />
                <LeftMenuItem to="/dashboard/invoices/" icon={<Invoices />} text="Invoices" />
                <LeftMenuItem to="/dashboard/warehouse/" icon={<Warehouse />} text="Warehouse" />
                <LeftMenuItem to="/dashboard/location" icon={<VscLocation />} text="Location" />
                <LeftMenuItem to="/dashboard/vehicle" icon={<Vehicle />} text="Vehicle" />
                <LeftMenuItem
                    onClick={e => {
                        e.preventDefault()
                        doLogout()
                    }}
                    icon={<Logout />}
                    text="Logout"
                />
            </ul>
        </div>
    )
}

export default LeftMenu
