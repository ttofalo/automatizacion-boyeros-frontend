import React, { useEffect, useState } from 'react';
import BoyeroCard from './components/BoyeroCard';
import { getBoyeros } from './services/api';
import './styles/main.css';

function App() {
    const [boyeros, setBoyeros] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBoyeros = async () => {
        try {
            const response = await getBoyeros();
            setBoyeros(response.data);
        } catch (error) {
            console.error("Error fetching boyeros", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoyeros();
        // Poll every 5 seconds for updates
        const interval = setInterval(fetchBoyeros, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdate = (id, newState) => {
        setBoyeros(prev => prev.map(b => 
            b.id === id ? { ...b, is_on: newState } : b
        ));
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>Control de Boyeros</h1>
                <p style={{color: 'var(--text-secondary)'}}>Sistema de Automatización</p>
            </header>

            <main className="grid">
                {loading ? (
                    <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Cargando dispositivos...</p>
                ) : (
                    boyeros.map(boyero => (
                        <BoyeroCard 
                            key={boyero.id} 
                            boyero={boyero} 
                            onUpdate={handleUpdate} 
                        />
                    ))
                )}
            </main>
        </div>
    );
}

export default App;
