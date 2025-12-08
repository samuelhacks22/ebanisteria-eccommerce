import { Edit, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete, isLoading }) => {
    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return (

        <div style={{
            overflowX: 'auto',
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                style={{
                                    padding: '16px',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: 'var(--text-light)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {col.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th style={{ padding: '16px', width: '100px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>
                                No records found
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }}>
                                {columns.map((col, index) => (
                                    <td key={index} style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    style={{
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '6px',
                                                        padding: '6px',
                                                        backgroundColor: 'white',
                                                        cursor: 'pointer',
                                                        color: 'var(--info)',
                                                        transition: 'all 0.2s'
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
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '6px',
                                                        padding: '6px',
                                                        backgroundColor: 'white',
                                                        cursor: 'pointer',
                                                        color: 'var(--danger)',
                                                        transition: 'all 0.2s'
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
