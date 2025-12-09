import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Hammer } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <Hammer size={28} />
                    </div>
                    <h1>Ebanistería Madera</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sistema de Gestión Profesional</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Ingrese su usuario"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingrese su contraseña"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full-btn">
                        <LogIn size={18} /> Iniciar Sesión
                    </button>

                    <div className="mt-4" style={{ textAlign: 'center' }}>
                        <Link to="/register" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                            ¿No tienes cuenta? <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Regístrate</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
