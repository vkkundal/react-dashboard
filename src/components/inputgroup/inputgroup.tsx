import React from "react"

type IInputGroupProps = {
    label?: string
    labelClass?: string
    type: string
    name: string
    id?: string
    disabled?: boolean;
    placeholder?: string
    value?: string | number
    onChange?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >["onChange"]
    inputProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
    labelProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
    >
    wrapperClass?: string
    inputClass?: string
}

const InputGroup: React.ForwardRefRenderFunction<HTMLInputElement,IInputGroupProps> = ({
    type,
    placeholder,
    id,
    name,
    inputProps = {},
    disabled,
    label: labelText,
    labelClass = "",
    inputClass = "",
    labelProps = {},
    wrapperClass = "",
    value,
    onChange
}, ref)  => {
    return (
        <div className={`input-group ${wrapperClass}`}>
            {labelText && (
                <label
                    {...labelProps}
                    className={labelClass}
                    htmlFor={id || name}
                >
                    {labelText}
                </label>
            )}
            <input
                {...inputProps}
                value={value}
                ref={ref}
                disabled={disabled}
                className={`input ${inputClass}`} 
                id={id || name}
                name={name}
                type={type}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}


export default React.forwardRef(InputGroup);