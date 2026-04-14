import React, { useEffect, useState } from 'react';
import { Zap, Moon, Sun, Plus, Cpu, Linkedin, Github, LogOut } from 'lucide-react';
import BoyeroCard from './components/BoyeroCard';
import EditBoyeroModal from './components/EditBoyeroModal';
import CreateBoyeroModal from './components/CreateBoyeroModal';
import CreateEspModal from './components/CreateEspModal';
import LoginPage from './components/LoginPage';
import BoyeroService from './services/boyeroService';
import AuthService from './services/authService';
import { useBoyeroWebSocket } from './hooks/useBoyeroWebSocket';
import './styles/main.css';
import './styles/login.css';

function App() {
    const [boyeros, setBoyeros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Check authentication on mount
    useEffect(() => {
        const authenticated = AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
            fetchBoyeros();
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        fetchBoyeros();
    };

    const handleLogout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setBoyeros([]);
    };

    const fetchBoyeros = async () => {
        try {
            const data = await BoyeroService.getAll();
            setBoyeros(data);
        } catch (error) {
            console.error("Error fetching boyeros", error);
        } finally {
            setLoading(false);
        }
    };


    // Real-time updates via WebSocket
    useBoyeroWebSocket((data) => {
        // Handle different types of messages if necessary. 
        // Assuming data is the updated boyero object or a list.
        // If it's a single object update:
        if (data && data.id) {
            setBoyeros(prev => {
                const exists = prev.find(b => b.id === data.id);
                if (exists) {
                    return prev.map(b => b.id === data.id ? { ...b, ...data } : b);
                } else {
                    // New boyero created by someone else? Add it.
                    return [...prev, data];
                }
            });
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreateEspModalOpen, setIsCreateEspModalOpen] = useState(false);
    const [editingBoyero, setEditingBoyero] = useState(null);

    const openEditModal = (boyero) => {
        setEditingBoyero(boyero);
        setIsModalOpen(true);
    };

    const handleUpdate = (id, newState) => {
        setBoyeros(prev => prev.map(b =>
            b.id === id ? { ...b, is_on: newState } : b
        ));
    };

    const handleSaveSuccess = (id, updatedBoyero) => {
        setBoyeros(prev => prev.map(b =>
            b.id === id ? updatedBoyero : b
        ));
    };

    const handleCreateSuccess = (newBoyero) => {
        setBoyeros(prev => [...prev, newBoyero]);
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <>
            <header className="app-header">
                <div className="container header-content">
                    <div className="header-actions">
                        <div className="theme-toggle" onClick={toggleTheme} style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            background: 'var(--border-color)',
                            padding: '6px',
                            borderRadius: '30px',
                            width: '60px',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', background: 'var(--text-primary)',
                                transform: theme === 'light' ? 'translateX(0)' : 'translateX(24px)',
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {theme === 'light' ? <Sun size={14} color="var(--bg-color)" /> : <Moon size={14} color="var(--bg-color)" />}
                            </div>
                        </div>

                        <div className="desktop-actions">
                            <button className="btn btn-secondary" onClick={() => setIsCreateEspModalOpen(true)}>
                                <Cpu size={16} />
                                Nuevo ESP
                            </button>
                            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                                <Plus size={16} />
                                Nuevo Boyero
                            </button>
                            <button className="btn btn-secondary" onClick={handleLogout} title="Cerrar sesión">
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container">
                <div className="dashboard-grid">
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
                            Cargando dispositivos...
                        </p>
                    ) : (
                        <>
                            {boyeros.map(boyero => (
                                <BoyeroCard
                                    key={boyero.id}
                                    boyero={boyero}
                                    onUpdate={handleUpdate}
                                    onEdit={() => openEditModal(boyero)}
                                />
                            ))}

                            {/* Add New Boyero Placeholder Card */}
                            <div className="new-item-card" onClick={() => setIsCreateModalOpen(true)}>
                                <Plus size={48} color="var(--text-tertiary)" />
                                <span className="new-item-text">Configurar nuevo boyero</span>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <div className="container footer-content">
                    <div>
                        &copy; {new Date().getFullYear()} - Desarrollado por Tobias Tofalo
                    </div>
                    <div className="footer-links">
                        <a href="https://www.linkedin.com/in/tobiastofalo" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Linkedin size={18} /> LinkedIn
                        </a>
                        <a href="https://github.com/ttofalo" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Github size={18} /> GitHub
                        </a>
                    </div>
                </div>
            </footer>

            {editingBoyero && (
                <EditBoyeroModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    boyero={editingBoyero}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}

            <CreateBoyeroModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateSuccess={handleCreateSuccess}
            />

            {/* Mobile Floating Actions */}
            <div className="mobile-fab-container">
                <button className="fab-secondary" onClick={handleLogout} title="Cerrar sesión">
                    <LogOut size={20} />
                </button>
                <button className="fab-secondary" onClick={() => setIsCreateEspModalOpen(true)}>
                    <Cpu size={20} />
                </button>
                <button className="fab-primary" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={20} />
                    <span>Boyero</span>
                </button>
            </div>

            <CreateEspModal
                isOpen={isCreateEspModalOpen}
                onClose={() => setIsCreateEspModalOpen(false)}
            />
        </>
    );
}

export default App;
