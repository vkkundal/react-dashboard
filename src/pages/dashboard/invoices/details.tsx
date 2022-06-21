import { Paper } from "@material-ui/core"
import AdminLayout from "components/adminlayout/adminlayout"
import Button from "components/button/button"
import { Table } from "components/table/table"
import { IInvoiceDetail } from "helpers/interfaces"
import { useGet } from "hooks/useGet"
import { usePut } from "hooks/usePut"
import { useQueryParam } from "hooks/useQueryParam"
import React, { useEffect, useRef, useState } from "react"
import Switch from "react-ios-switch"
import { useToasts } from "react-toast-notifications"
import moment from "moment";
import withAuth from "../../../components/withAuth/withAuth"
import DetailInputGroup from "../../../components/inputdetails/inputdetails"

const InvoiceDetails = () => {
    const id = useQueryParam("id")
    const { data } = useGet<IInvoiceDetail | null>(
        `/api/v2/invoices/${id}`,
        null,
        [id]
    )

    const { isSending, put } = usePut<{ is_closed: boolean }>(
        `/api/v2/invoices/${id}`
    )

    const [isClosed, setIsClosed] = useState(false)
    const isClosedRef = useRef(false);
    useEffect(() => {
        if (data) {
            setIsClosed(data.is_closed)
            isClosedRef.current = data.is_closed
        }
    }, [data])

    const { addToast } = useToasts()

   

    const handleSave = async () => {
        try {
            await put({ is_closed: isClosed })
            isClosedRef.current = isClosed;
            addToast("Details Updated", {
                autoDismiss: true,
                appearance: "success",
            })
        } catch (e) {
            addToast("An Error Occured", {
                autoDismiss: true,
                appearance: "error",
            })
        }
    }
    const onReset = () => {
        setIsClosed(isClosedRef.current)
    }
    const toggleSwitch = () => {
        setIsClosed(old => !old)
    }
    return (
        <AdminLayout title="Invoices">
            <Paper className="mt-5 p-5">
                <div className="filter">
                    <h3 className="font-weight-normal">Invoice Details</h3>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div>
                           
                              <DetailInputGroup
                                        type="number"   
                                        label="ID"
                                        disabled
                                        value={id}
                                    />
                        </div>
                        <div>
                            
                            <DetailInputGroup
                                        type="text"   
                                        label="Payment Method"
                                        disabled
                                        value={data?.payment_method.name}
                                    />
                        </div>
                        <div>
                            
                            <DetailInputGroup
                                        type="number"   
                                        label="Vat Amount"
                                        disabled
                                        value={data?.vat_amount}
                                    />
                        </div>
                      
                        <div>
                            
                            <DetailInputGroup
                                        type="text"   
                                        label="Created At"
                                        disabled
                                        value={moment(data?.created_at).format("DD-MM-YYYY")}
                                    />
                        </div>
                    </div>
                    <div className="col-md-6">
                        
                        <div>
                           
                             <DetailInputGroup
                                        type="number"   
                                        label="Price No Vat"
                                        disabled
                                        value={data?.price_no_vat}
                                    />
                        </div>
                        <div>
                            
                                <DetailInputGroup
                                        type="number"   
                                        label="Vat Price"
                                        disabled
                                        value={data?.vat_price}
                                    />
                        </div>
                        <div>
                            
                             <DetailInputGroup
                                        type="number"   
                                        label="Price Total "
                                        disabled
                                        value={data?.price_total}
                                    />
                        </div>
                        <label
                            style={{ visibility: "hidden" }}
                            className="User-label"
                        >
                            Vat Amount
                        </label>
                        <div className=" d-flex align-items-center justify-content-around">
                            <span>Is Closed</span>
                            <Switch
                                checked={isClosed}
                                handleColor="white"
                                offColor="white"
                                onChange={toggleSwitch}
                                onColor="#007BFF"
                            />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-end mt-5">
                    <div className="Add-user text-center">
                        <Button
                            loading={isSending}
                            onClick={handleSave}
                            className="mt-5 text-center popup-button"
                        >
                            Save Changes
                        </Button>
                        <Button onClick={onReset} variant="outline">
                            Reset
                        </Button>
                    </div>
                </div>
            </Paper>

            <Table title="Order Details">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Service Type</th>
                    </tr>
                </thead>

                {data && (
                    <tbody>
                        <tr>
                            <td>{data.order.service_type.id}</td>
                            <td>{data.order.service_type.name}</td>
                        </tr>
                    </tbody>
                )}
            </Table>
            <Table title="Services">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Buy Price</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.order.services.map(item => {
                            return (
                                <tr>
                                    <td>{item.service.id}</td>
                                    <td>{item.service.name}</td>
                                    <td>{item.buy_price}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </Table>
            <Table title="Items">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Buy Price</th>
                        <th scope="col">Quantity</th>
                    </tr>
                </thead>

                {data && (
                    <tbody>
                        {data.order.items.map(item => {
                            return (
                                <tr>
                                    <td>{item.item.id}</td>
                                    <td>{item.item.title}</td>
                                    <td>{item.buy_price}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                )}
            </Table>
            <Table title="Purchases">
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Receipt Image</th>
                    </tr>
                </thead>

                {data && (
                    <tbody>
                        {data.order.external_purchases.map(item => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <img
                                            className="img-fluid"
                                            src={item.receipt_image_url}
                                        />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                )}
            </Table>
        </AdminLayout>
    )
}

export default withAuth(InvoiceDetails)
