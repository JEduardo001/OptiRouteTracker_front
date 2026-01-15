import './Button.css';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconOnly = false,
    className = '',
    onClick,
    ...props
}) => {
    const classes = [
        'btn',
        `btn-${variant}`,
        size !== 'md' ? `btn-${size}` : '',
        iconOnly ? 'btn-icon' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <span className="loading-spinner sm"></span>
            ) : (
                <>
                    {icon && <span className="btn-icon-element">{icon}</span>}
                    {!iconOnly && children}
                </>
            )}
        </button>
    );
};

export default Button;
