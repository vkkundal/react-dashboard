import React from "react"

type IInputGroupProps = {
    label?: string
    rows?: number
    labelClass?: string
    type: string
    name: string
    id?: string
    disabled?: boolean;
    placeholder?: string  
    value?: string | number
    onChange?: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
    >["onChange"]
    inputProps?: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
    >
    labelProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
    >
    wrapperClass?: string
    inputClass?: string
}

const TextareaGroup: React.ForwardRefRenderFunction<HTMLInputElement,IInputGroupProps> = ({
    type,
    rows,
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
            <textarea
                {...inputProps}
                value={value}
                disabled={disabled}
                className={`input ${inputClass}`} 
                id={id || name}
                rows={rows}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}


export default React.forwardRef(TextareaGroup);