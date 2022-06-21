import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "../../../components/adminlayout/adminlayout"
import { Paper } from "../../../components/paper/paper"
import Button, { LinkButton } from "../../../components/button/button"
import { useQueryParam } from "../../../hooks/useQueryParam"
import { useGet } from "../../../hooks/useGet"
import { IWarehouse } from "../../../helpers/interfaces"
import { usePut } from "hooks/usePut"
import { handleErrors, passTargetVal, validateFields } from "helpers/helpers"
import produce from "immer"
import { useToasts } from "react-toast-notifications"
import withAuth from "../../../components/withAuth/withAuth"
import DetailInputGroup from "../../../components/inputdetails/inputdetails"

const Warehousedetail = () => {
    const id = useQueryParam("id")

    const { data } = useGet<IWarehouse | null>(
        `/api/v2/warehouses/${id}`,
        null,
        [id]
    )

    const { isSending, put } = usePut(`/api/v2/warehouses/${id}`)

    const [state, setState] = useState(data)

    const oldRef = useRef<IWarehouse>()

    useEffect(() => {
        if (data) {
            setState(data)
            oldRef.current = data
        }
    }, [data])

    const { addToast } = useToasts()

    const handleSave = async () => {
        if (state) {
            const { id, ...data } = state

            const arrayClientErrors = validateFields(data,addToast);

            
            try {
                await put(data)
                addToast("Warehouse Updated", {
                    autoDismiss: true,
                    appearance: "success",
                })
                oldRef.current = state
            } catch (e) {
                
                handleErrors(e , addToast , arrayClientErrors)

            }
        }
    }
    const onReset = () => {
        setState(oldRef.current as IWarehouse)
    }

    return (
        <AdminLayout title="Warehouses">
            <Paper className="mt-5 p-5">
                <div className="filter">
                    <h3 className="font-weight-normal">Warehouse details</h3>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="User-details">
                            
                              <DetailInputGroup
                                        type="number"   
                                        label="ID"
                                        disabled
                                        value={state?.id}
                                    />
                        </div>
                        <div className="first-name">
                           
                            <DetailInputGroup
                                        type="number"  
                                        name="name" 
                                        label="Lat"
                                        disabled={isSending}
                                        value={state?.location.lat}
                                        onChange={passTargetVal(val =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft
                                                        ? (draft.location.lat = parseFloat(
                                                              val
                                                          ))
                                                        : null
                                                })
                                            )
                                        )}
                                    />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="first-name">
                            
                            <DetailInputGroup
                                        label="Name"
                                        name="name"
                                        type="text"
                                        value={state?.name}
                                        disabled={isSending}
                                        onChange={passTargetVal(val =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft ? (draft.name = val) : null
                                                })
                                            )
                                        )}
                                    />
                        </div>
                        <div className="first-name">
                            
                              <DetailInputGroup
                                        type="number"  
                                        name="name" 
                                        label="Long"
                                        disabled={isSending}
                                        value={state?.location.long}
                                        onChange={passTargetVal(val =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft
                                                        ? (draft.location.long = parseFloat(
                                                              val
                                                          ))
                                                        : null
                                                })
                                            )
                                        )}
                                    />
                        </div>
                        <div className="first-name">
                           
                             <DetailInputGroup
                                        type="number"  
                                        name="mobile" 
                                        label="Mobile"
                                        disabled={isSending}
                                        value={state?.mobile}
                                        onChange={passTargetVal(val =>
                                            setState(old =>
                                                produce(old, draft => {
                                                    draft
                                                        ? (draft.mobile = parseFloat(
                                                              val
                                                          ))
                                                        : null
                                                })
                                            )
                                        )}
                                    />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-md-10 col-lg-7">
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
                </div>
            </Paper>
            <Paper className="mt-5 py-5 px-0 p-lg-5">
                <div className="row  text-center">
                    <div className="col-md-6 warehousefix   col-lg-4">
                        <LinkButton
                            to={`/dashboard/warehouse/itemmanagement?id=${id}`}
                            className="mt-5 warehousebtnfix text-center popup-button"
                        >
                            Go to Item management
                        </LinkButton>
                    </div>
                    <div className="col-md-6 warehousefix col-lg-4">
                        <LinkButton
                            to={"/dashboard/warehouse/itemlog?id=" + id}
                            className="mt-5 warehousebtnfix text-center popup-button"
                        >
                            Go to Item movement log
                        </LinkButton>
                    </div>
                    <div className="col-md-12 warehousefix  col-lg-4">
                        <LinkButton
                            to={"/dashboard/warehouse/itemcheckout?id=" + id}
                            className="mt-5 warehousebtnfix text-center popup-button"
                        >
                            Go to Item Checkout
                        </LinkButton>
                    </div>
                </div>
            </Paper>
        </AdminLayout>
    )
}

export default withAuth(Warehousedetail)
