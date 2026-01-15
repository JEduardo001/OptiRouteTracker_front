import { forwardRef } from 'react';

const Input = forwardRef(({
    type = 'text',
    label,
    error,
    helper,
    icon,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const inputClasses = [
        'form-input',
        error ? 'error' : '',
        icon ? 'has-icon' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={`form-group ${containerClassName}`}>
            {label && (
                <label className="form-label">{label}</label>
            )}
            <div className={icon ? 'input-with-icon' : ''}>
                {icon && <span className="input-icon">{icon}</span>}
                {type === 'textarea' ? (
                    <textarea
                        ref={ref}
                        className={`${inputClasses} form-textarea`}
                        {...props}
                    />
                ) : (
                    <input
                        ref={ref}
                        type={type}
                        className={inputClasses}
                        {...props}
                    />
                )}
            </div>
            {error && <span className="form-error">{error}</span>}
            {helper && !error && <span className="form-helper">{helper}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
