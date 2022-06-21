import { Chip } from "@material-ui/core"
import React, { useState } from "react"
import clsx from "clsx"
export const ChipInput = ({
    tags,
    onAdd,
    onRemove,
    disabled,
    variant,
    placeholder = "Type a Tag and Press Enter",
    label = "Tags",
    withfloatingLabel,
}: {
    disabled?: boolean
    label?: string
    placeholder?: string
    withfloatingLabel?: boolean
    tags: string[]
    onAdd: (val: string) => void
    onRemove: (index: number) => void
    variant?: boolean
}) => {
    const [text, setText] = useState("")
    return (
        <>
            <div
                className={clsx("User-details", {
                    "input-group mt-2": variant,
                })}
            >
                <label
                    className={clsx("User-label", {
                        "popup-label": withfloatingLabel,
                    })}
                >
                    {label}
                </label>
                <input
                    className={clsx({
                        "User-Input": !withfloatingLabel,
                        input: withfloatingLabel,
                    })}
                    type="text"
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === "Enter") {
                            setText("")
                            onAdd(text)
                        }
                    }}
                    value={text}
                />
                <div className="d-flex flex-wrap mt-2">
                    {tags.map((tag, index) => {
                        return (
                            <Chip
                                className="mr-1 mb-2"
                                color="secondary"
                                label={tag}
                                onDelete={() => onRemove(index)}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}
