const Loading = ({
    size = 'md',
    fullPage = false,
    overlay = false,
    text = '',
}) => {
    const spinnerClass = `loading-spinner ${size}`;

    if (fullPage) {
        return (
            <div className="loading-page">
                <div className={spinnerClass}></div>
                {text && <p className="text-secondary">{text}</p>}
            </div>
        );
    }

    if (overlay) {
        return (
            <div className="loading-overlay">
                <div className={spinnerClass}></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className={spinnerClass}></div>
            {text && <span className="text-secondary">{text}</span>}
        </div>
    );
};

export default Loading;
