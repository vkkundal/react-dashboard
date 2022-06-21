import React from "react"

type ISelectProps = {
    label?: string
    id?: string
    disabled?: boolean
    value?: string | number
    onChange?: any
   
    inputProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
    labelProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
    >
    name?: string
    className?: string
    children: React.ReactNode
}

const SelectInput: React.ForwardRefRenderFunction<
    HTMLInputElement,
    ISelectProps
> = (
    {
        disabled,
        label: labelText,
        labelProps = {},
        value,
        name,
        onChange,
        className,
        children
    },
    ref
) => {
    return (
        <div className={`input-group `}>
            {labelText && (
                <label {...labelProps} className={"filter-label"}>
                    {labelText}
                </label>
            )}
            <select
                onChange={onChange}
                name={name}
                className={`${className} User-select`}
                disabled={disabled}
                value={value}
            >
                {children}
            </select>
        </div>
    )
}

export default React.forwardRef(SelectInput)
