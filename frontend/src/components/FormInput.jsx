const FormInput = ({ label, name, type = 'text', value, onChange, error, required, placeholder, ...props }) => {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label
                style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#333'
                }}
            >
                {label} {required && <span style={{ color: '#F44336' }}>*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: `1px solid ${error ? '#F44336' : '#ccc'}`,
                    outline: 'none',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                }}
                {...props}
            />
            {error && (
                <span style={{ fontSize: '0.8rem', color: '#F44336', marginTop: '4px', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default FormInput;
