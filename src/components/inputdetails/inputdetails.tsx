
import React from "react"

type IDetailInputGroupProps = {
    label?: string
    type: string
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
    name ?: string
    className?: string
}

const DetailInputGroup: React.ForwardRefRenderFunction<HTMLInputElement,IDetailInputGroupProps> = ({
    type,
    placeholder,
    id,
    inputProps = {},
    disabled,
    label: labelText,
    labelProps = {},
    value,
    name,
    onChange,
    className
}, ref)  => {
    return (
        <div className={`input-group `}>
            {labelText && (
                <label
                    {...labelProps}
                    className={'filter-label'}
                >
                    {labelText}
                </label>
            )}
            <input
                {...inputProps}
                value={value}
                ref={ref}
                disabled={disabled}
                className={`${className} ${disabled ? 'disabled' : ''}  User-input`} 
                id={id }
                type={type}
                onChange={onChange}
                name={name}
                placeholder={placeholder}
            />
        </div>
    )
}


export default React.forwardRef(DetailInputGroup);