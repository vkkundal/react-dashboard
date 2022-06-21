import React from "react"
import clsx from "clsx"

export const CarySelect = <T extends any>({
    options,
    onChange,
    getName,
    title,
    selectedOption,
    variant = "popup",
}: {
    options: T[]
    onChange: (val: T) => void
    getName: (val: T) => string | number
    title: string
    selectedOption?: T
    variant?: "popup" | "User"
}) => {
    const getIndex = () => {

        console.log(options)

        const index = options && selectedOption && options.indexOf(selectedOption)
        return index === -1 ? undefined : index
    }

    console.log(getIndex())

    return (
        <div className="User-role">
            <label className={clsx({ "popup-role": variant === "popup", "User-label": variant=== "User" })}>
                {title}
            </label>
            <select
                value={getIndex()}
                onChange={e => {
                    onChange(options[parseInt(e.target.value)])
                }}
                className={clsx({ "popup-select": variant === "popup", "User-select": variant === "User" })}
            >
                {options && options.map((option, index) => {
                    return (
                        <option key={index} value={index}>
                            {getName(option)}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}
