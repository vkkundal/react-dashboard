import React, { useEffect, useState } from "react"
import { Paper } from "../paper/paper"
import InputGroup from "../inputgroup/inputgroup"
import TextareaGroup from "../textareainputgroup/textarea"
import Button from "../button/button"

import Switch from "react-ios-switch"
import { useToasts } from "react-toast-notifications"
import { usePost } from "hooks/usePost"
import { useGet } from "hooks/useGet"
import { IITemDetails, IItemType } from "helpers/interfaces"
import { navigate } from "gatsby"
import { ChipInput } from "components/chipinput/chipinput"
import produce from "immer"
import { handleErrors, validateFields } from "helpers/helpers"

const Itempopup = ({
    onClose,
    onAdd,
}: {
    onClose?: () => void
    onAdd?: () => void
}) => {
    const [name, setName] = useState("")
    const [isActive, setIsActive] = useState(false)
    const [name_ar, setName_ar] = useState("")
    const [description, setDescription] = useState("")
    const [description_ar, setDescription_ar] = useState("")
    const [price, setPrice] = useState("");
    const { addToast } = useToasts()
    const [serial_number, setserialNumber] = useState("")
    const { data: itemTypes, isReady } = useGet<IItemType[]>("/api/v2/items/types", []);
    const [tags,setTags] = useState<string[]>([]);
    const [selectedItemType, setSelectedItemType] = useState("");

    useEffect(() => {
        if (isReady) {
            setSelectedItemType(itemTypes[0].id.toString())
        }

    }, [isReady])

    const { isSending, post } = usePost<IITemDetails>(`/api/v2/items/`)

    const handleAddition = async () => {


        const data: IITemDetails = {
            is_active: isActive, description: description, description_ar: description_ar,
            title: name,
            title_ar: name_ar,
            tags,
            serial_number: serial_number,
            item_type_id: parseInt(selectedItemType),
            price: parseFloat(price)
        }

        const arrayClientErrors = validateFields(data,addToast , 'tags');

    
        
        try {
            const res = await post({
                ...data
            })
            addToast("Item Added", {
                autoDismiss: true,
                appearance: "success",
            })
            navigate(`/dashboard/itemdetail?id=`+res.data.id);
            onAdd && onAdd()
            onClose && onClose()
        } catch (e) {

            handleErrors(e , addToast , arrayClientErrors)       
            
        }
    }
    return (
        <div className="popup-overlay">
            <div className="container">
                <Paper className="p-5">
                    <div className="text-center">
                        <h2 className="popup-heading">
                            Add a new <span>Item</span>
                        </h2>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-3"
                                type="text"
                                name="full_name"
                                label="Name"
                                disabled={isSending}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="number"
                                name="price"
                                label="Price"
                                disabled={isSending}
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            />
                            
                            <TextareaGroup
                                labelClass="popup-label"
                                wrapperClass="description-popup mt-3"
                                placeholder="Type..."
                                inputClass="textarea-popup"
                                type="text"
                                name="name"
                                label="Description"
                                disabled={isSending}
                                value={description}
                                rows={4}
                                onChange={e =>
                                    setDescription(e.target.value)
                                }
                            />
                            <label className="popup-role  mb-2">Item Type</label>
                            <select name="role mb-2" value={selectedItemType} onChange={e => {
                                setSelectedItemType(e.target.value)
                            }} className="popup-select">
                                {itemTypes.map(item => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </select>
                            <div className="popup-status text-center mt-4">
                                <span className="popup-switch mr-2">
                                    Is Active{" "}
                                </span>
                                <Switch
                                    checked={isActive}
                                    onChange={() => setIsActive(val => !val)}
                                    handleColor="white"
                                    offColor="white"
                                    onColor="#007BFF"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                        <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-3"
                                type="text"
                                name="full_name"
                                label="Name_Ar"
                                disabled={isSending}
                                value={name_ar}
                                onChange={e => setName_ar(e.target.value)}
                            />
                            
                            <InputGroup
                                labelClass="popup-label"
                                wrapperClass="mb-2"
                                type="text"
                                name="full_name"
                                label="Serial No"
                                disabled={isSending}
                                value={serial_number}
                                onChange={e => setserialNumber(e.target.value)}
                            />
                            <TextareaGroup
                                labelClass="popup-label"
                                wrapperClass="description-popup mt-3"
                                placeholder="Type..."
                                inputClass="textarea-popup"
                                type="text"
                                name="name"
                                label="Description Ar"
                                disabled={isSending}
                                value={description_ar}
                                rows={4}
                                onChange={e =>
                                    setDescription_ar(e.target.value)
                                }
                            />
                            
                             <ChipInput 
                                variant
                                tags={tags}
                                onAdd={(val) => setTags(old => [...old,val ])}
                                onRemove={i => setTags(old => produce(old, draft => {
                                    draft.splice(i, 1);
                                }))}
                            />
                           
                        </div>
                    </div>
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-6 col-lg-4 ">
                            <div className="Add-user text-center">
                                <Button onClick={handleAddition} loading={isSending} className="mt-5 text-center popup-button">
                                    Add
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    )
}

export default Itempopup
