import { useToast } from '../../context/ToastContext';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast ${toast.type}`}>
                    <span className="toast-icon">{getIcon(toast.type)}</span>
                    <div className="toast-content">
                        <div className="toast-title">{toast.title}</div>
                        {toast.message && (
                            <div className="toast-message">{toast.message}</div>
                        )}
                    </div>
                    <button
                        className="toast-close"
                        onClick={() => removeToast(toast.id)}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
