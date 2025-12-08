import { Edit, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete, isLoading }) => {
    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#8B4513',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {col.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th style={{ padding: '12px 16px', width: '100px', textAlign: 'center' }}>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                No records found
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                {columns.map((col, index) => (
                                    <td key={index} style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#333' }}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    style={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        padding: '6px',
                                                        backgroundColor: 'white',
                                                        cursor: 'pointer',
                                                        color: '#2196F3'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row)}
                                                    style={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        padding: '6px',
                                                        backgroundColor: 'white',
                                                        cursor: 'pointer',
                                                        color: '#F44336'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
