const SearchBox = ({
    value,
    onChange,
    placeholder = 'Buscar...',
    className = '',
}) => {
    return (
        <div className={`search-box ${className}`}>
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="form-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBox;
