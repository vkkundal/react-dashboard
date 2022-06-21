import { Paper } from "@material-ui/core"
import AdminLayout from "components/adminlayout/adminlayout"
import { Table } from "components/table/table"
import { navigate } from "gatsby"
import { IInvoice } from "helpers/interfaces"
import { useGet } from "hooks/useGet"
import { BsEye } from "react-icons/bs"
import React, { useEffect, useState } from "react"
import { useToasts } from "react-toast-notifications"
import withAuth from "../../../components/withAuth/withAuth"
import moment from "moment"
import FilterInputGroup from "components/filterinputgroup/filterinputgroup"
import SelectInput from "../../../components/Selectinput/selectinput"
import Button from "../../../components/button/button"

const Invoices = () => {
    const { isReady, data, refetchData } = useGet<
        IInvoice[],
        {
            page: number
            invoice_id: number
            order_id: number
            is_closed: boolean
        }
    >(`/api/v2/invoices`, [], [null])

    const [pagenumber, setPagenumber] = useState(1)

    const handleNext = () => {
        setPagenumber(pagenumber + 1)
    }

    const handlePrev = () => {
        if (pagenumber === 1) {
            return
        }
        setPagenumber(pagenumber - 1)
    }

    const { addToast } = useToasts()
    const [selectedVal, setSelected] = useState<"True" | "False" | "Default">(
        "Default"
    )
    const [orderID, setorderID]: [any, any] = useState()

    const [invoiceID, setInvoiceId]: [any, any] = useState()

    useEffect(() => {
        refetchData({
            page: pagenumber,
            is_closed:
                selectedVal === "Default" ? undefined : selectedVal === "True",
            order_id: orderID ? orderID : undefined,
            invoice_id: invoiceID ? invoiceID : undefined,
        }).then(data => {
            if (data && data.length === 0) {
                addToast("No more Invoices", {
                    autoDismiss: true,
                    appearance: "error",
                })
                if (pagenumber == 1) {
                    return
                }
                setPagenumber(pagenumber - 1)
            }
        })
    }, [pagenumber])

    return (
        <>
            <AdminLayout title="Invoices">
                <Paper className="mt-5 p-4">
                    <div className="filter">
                        <h3 className="font-weight-normal">Filters</h3>
                        <Button
                            onClick={() => {
                                setPagenumber(1)
                                refetchData({
                                    page: 1,
                                    is_closed:
                                        selectedVal === "Default"
                                            ? undefined
                                            : selectedVal === "True",
                                    order_id: orderID ? orderID : undefined,
                                    invoice_id: invoiceID
                                        ? invoiceID
                                        : undefined,
                                })
                            }}
                            className="filter-search"
                        >
                            Go
                        </Button>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <FilterInputGroup
                                type="text"
                                label="Invoice Id"
                                placeholder="Invoice Id"
                                onChange={e => {
                                    setInvoiceId(e.target.value)
                                }}
                            />
                        </div>
                        <div className="col-md">
                            <FilterInputGroup
                                type="text"
                                label="Order Id"
                                placeholder="Order Id"
                                onChange={e => {
                                    setorderID(e.target.value)
                                }}
                            />
                        </div>
                        <div className="col-md">
                            <SelectInput
                                label="Is Closed"
                                name="role"
                                onChange={(e: React.ChangeEvent) => {
                                    setSelected(
                                        (e.target as HTMLInputElement)
                                            .value as "True"
                                    )
                                }}
                                value={undefined}
                            >
                                <option value="True"> True </option>
                                <option value="False"> False </option>
                                <option selected value="Default">
                                    {" "}
                                    Default{" "}
                                </option>
                            </SelectInput>
                        </div>
                    </div>
                </Paper>

                <Table
                    loading={!isReady}
                    title="Latest Invoices"
                    pageNo={pagenumber}
                    pagination
                    pagesnext={handleNext}
                    pagesprevious={handlePrev}
                >
                    <thead className="table-head">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Payment Method</th>
                            <th scope="col">Price No Vat</th>
                            <th scope="col">Vat price</th>
                            <th scope="col">Vat Amount</th>
                            <th scope="col">Price Total</th>
                            <th scope="col">Is Closed</th>
                            <th scope="col">Is Paid</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(invoice => {
                            return (
                                <tr key={invoice.id}>
                                    <td scope="row">{invoice.id}</td>
                                    <td>{invoice.payment_method?.name}</td>
                                    <td>{invoice.price_no_vat}</td>
                                    <td>{invoice.vat_price}</td>
                                    <td>{invoice.vat_amount}</td>
                                    <td>{invoice.price_total}</td>
                                    <td>
                                        {invoice.is_closed ? "True" : "False"}
                                    </td>
                                    <td>
                                        {invoice.payment_method === null
                                            ? "False"
                                            : "True"}
                                    </td>
                                    <td>
                                        {moment(invoice.created_at).format(
                                            "DD-MM-YYYY"
                                        )}
                                    </td>
                                    <td
                                        onClick={e => {
                                            navigate(
                                                `/dashboard/invoices/details?id=` +
                                                    invoice.id
                                            )
                                        }}
                                        className="eye-icon cursor-pointer"
                                    >
                                        <BsEye />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </AdminLayout>
        </>
    )
}

export default withAuth(Invoices)
