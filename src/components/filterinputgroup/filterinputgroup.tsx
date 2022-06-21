import React from "react"

type IFilterInputGroupProps = {
    label?: string
    type: string
    id?: string
    disabled?: boolean;
    placeholder?: string
    value?: string
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
}

const FilterInputGroup: React.ForwardRefRenderFunction<HTMLInputElement,IFilterInputGroupProps> = ({
    type,
    placeholder,
    id,
    inputProps = {},
    disabled,
    label: labelText,
    labelProps = {},
    value,
    name,
    onChange
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
                className={`input  filter-input`} 
                id={id }
                type={type}
                onChange={onChange}
                name={name}
                placeholder={placeholder}
            />
        </div>
    )
}


export default React.forwardRef(FilterInputGroup);