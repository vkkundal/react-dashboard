import React, { useState } from "react"
import AdminLayout from "components/adminlayout/adminlayout"
import { useGet } from "hooks/useGet"
import { IItemType, IWarehouseitemManagement } from "helpers/interfaces"
import { useQueryParam } from "hooks/useQueryParam"
import Button from "components/button/button"
import Checkoutpopup from "components/popup/checkoutpopup"
import { WarehouseReturnPopup } from "components/popup/WarehouseReturnPopup"
import withAuth from "../../../components/withAuth/withAuth"

const CheckoutCard = ({
    item,
    refetch,
}: {
    item: IWarehouseitemManagement
    refetch: () => void
}) => {
    const [isCheckoutOpen, setCheckoutOpen] = useState(false)

    const { data: itemType } = useGet<IItemType[]>("/api/v2/items/types", [])

    const getItemType = (id: number) => {
        const index = itemType.findIndex(type => type.id === id)
        if (index === -1) {
            return null
        }
        return itemType[index]
    }

    return (
        <div className="col-md-4 mt-3">
            {isCheckoutOpen && (
                <Checkoutpopup
                    onDone={refetch}
                    item_id={item.item.id}
                    onClose={() => setCheckoutOpen(false)}
                />
            )}

            <div className="checkout">
                <div className="checkout-img">
                    <img src={item.item.image_url} className="img-fluid" />
                </div>
                <div className="checkout-inner">
                    <div className="checkout-content">
                        <div className="car-name">
                            <p>Name</p>
                            <p>Type</p>
                            <p>Price</p>
                            <p>Stock</p>
                        </div>
                        <div className="car-type">
                            <p>{item.item.title}</p>
                            <p>{getItemType(item.item.item_type_id)?.name}</p>
                            <p>${item.item.price}</p>
                            <p>{item.quantity}</p>
                        </div>
                    </div>
                    <div className="checkout-button">
                        <Button
                            onClick={() => setCheckoutOpen(true)}
                            className="w-100 rounded-0"
                        >
                            Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Warehousecheckout = () => {
    const id = useQueryParam("id")
    const { data, refetchData } = useGet<IWarehouseitemManagement[]>(
        `/api/v2/warehouses/${id}/items`,
        [],
        [id]
    )

    const [isReturnOpen, setIsReturnOpen] = useState(false)

    return (
        <AdminLayout title="Warehouses">
            {isReturnOpen && (
                <WarehouseReturnPopup
                    onDone={refetchData}
                    onClose={() => setIsReturnOpen(false)}
                />
            )}
            <div className="mt-5">
                <Button
                    onClick={() => setIsReturnOpen(true)}
                    className="btn Add-btn"
                >
                    Return Item
                </Button>
            </div>
            {/* <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <button className="btn filter-search">Go</button>
                </div>

                <div className="row">
                    <div className="col-md">
                        <label className="filter-label">Item ID</label>
                        <input
                            type="text"
                            name="first_name"
                            className="filter-input"
                        />
                    </div>
                    <div className="col-md">
                        <label className="filter-label">Item type</label>
                        <select name="role" className="User-select">
                            <option> All </option>
                            <option> All </option>
                        </select>
                    </div>
                    <div className="col-md">
                        <label className="filter-label">Car make</label>
                        <select name="car-make" className="User-select">
                            <option> All </option>
                            <option> All </option>
                        </select>
                    </div>
                    <div className="col-md">
                        <label className="filter-label">Car model</label>
                        <select name="car-model" className="User-select">
                            <option> All </option>
                            <option> All </option>
                        </select>
                    </div>
                    <div className="col-md">
                        <label className="filter-label">Year</label>
                        <select name="year" className="User-select">
                            <option> All </option>
                            <option> All </option>
                        </select>
                    </div>
                </div>
            </Paper> */}
            <div className="container-fluid">
                <div className="row mt-5">
                    {data.map(item => {
                        return (
                            <CheckoutCard
                                key={item.item.id}
                                refetch={refetchData}
                                item={item}
                            />
                        )
                    })}
                </div>
            </div>
        </AdminLayout>
    )
}

export default withAuth(Warehousecheckout)
