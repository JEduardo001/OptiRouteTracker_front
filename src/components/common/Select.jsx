import { forwardRef } from 'react';

const Select = forwardRef(({
    label,
    options = [],
    error,
    helper,
    placeholder = 'Seleccionar...',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const selectClasses = [
        'form-input',
        'form-select',
        error ? 'error' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={`form-group ${containerClassName}`}>
            {label && (
                <label className="form-label">{label}</label>
            )}
            <select ref={ref} className={selectClasses} {...props}>
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="form-error">{error}</span>}
            {helper && !error && <span className="form-helper">{helper}</span>}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
