const Table = ({
    columns,
    data,
    loading = false,
    emptyMessage = 'No hay datos disponibles',
    onRowClick,
    className = '',
}) => {
    if (loading) {
        return (
            <div className="table-container">
                <table className={`table ${className}`}>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} style={{ width: column.width }}>
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index}>
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        <div className="skeleton" style={{ height: '20px', width: '80%' }}></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="table-container">
                <table className={`table ${className}`}>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} style={{ width: column.width }}>
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3 className="empty-state-title">{emptyMessage}</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className={`table ${className}`}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} style={{ width: column.width }}>
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={row.id || rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {column.render
                                        ? column.render(row[column.key], row, rowIndex)
                                        : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
