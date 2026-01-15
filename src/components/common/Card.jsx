const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    footer,
    className = '',
    glass = false,
    hoverable = false,
    ...props
}) => {
    const classes = [
        'card',
        glass ? 'card-glass' : '',
        hoverable ? 'hover-lift transition-transform' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {(title || headerAction) && (
                <div className="card-header">
                    <div>
                        {title && <h3 className="card-title">{title}</h3>}
                        {subtitle && <p className="text-secondary text-sm">{subtitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
