import React, { useState } from 'react';
import { Power } from 'lucide-react';
import PropTypes from 'prop-types';
import { toggleBoyero } from '../services/api';

const BoyeroCard = ({ boyero, onUpdate }) => {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        try {
            setLoading(true);
            const newState = !boyero.is_on;
            await toggleBoyero(boyero.id, newState);
            onUpdate(boyero.id, newState);
        } catch (error) {
            console.error("Error toggling boyero", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-info">
                <h2>{boyero.name}</h2>
                <p>GPIO: {boyero.gpio_pin} | ESP: {boyero.esp_id}</p>
                <div className={`status-badge ${boyero.is_on ? 'status-on' : 'status-off'}`}>
                    <span className="dot" style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: boyero.is_on ? 'var(--success-color)' : 'var(--danger-color)'
                    }}></span>
                    {boyero.is_on ? 'ENCENDIDO' : 'APAGADO'}
                </div>
            </div>
            <button 
                className="toggle-btn" 
                onClick={handleToggle}
                disabled={loading}
                style={{ opacity: loading ? 0.5 : 1 }}
            >
                <Power 
                    size={48} 
                    color={boyero.is_on ? 'var(--success-color)' : '#94a3b8'}
                    fill={boyero.is_on ? 'rgba(34, 197, 94, 0.2)' : 'none'}
                />
            </button>
        </div>
    );
};

BoyeroCard.propTypes = {
    boyero: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        gpio_pin: PropTypes.number.isRequired,
        esp_id: PropTypes.string.isRequired,
        is_on: PropTypes.bool.isRequired,
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default BoyeroCard;
