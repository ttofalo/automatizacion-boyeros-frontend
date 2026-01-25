import React, { useState } from 'react';
import { Power, Settings, Cable, Cpu, CloudOff, CloudLightning } from 'lucide-react';
import PropTypes from 'prop-types';
import BoyeroService from '../services/boyeroService';

const BoyeroCard = ({ boyero, onUpdate, onEdit }) => {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        try {
            setLoading(true);
            const newState = !boyero.is_on;
            await BoyeroService.toggle(boyero.id, newState);
            onUpdate(boyero.id, newState);
        } catch (error) {
            console.error("Error toggling boyero", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to determine status style
    const getStatusStyle = (isOn) => {
        if (isOn) return 'status-online';
        return 'status-offline'; // Or 'status-check' based on other logic
    };

    return (
        <div className={`boyero-card ${boyero.is_on ? 'is-active' : 'is-inactive'}`}>
            <div className="card-header">
                <div className="card-title-area">
                    <h2>{boyero.name}</h2>
                </div>

                <button
                    className={`power-btn ${boyero.is_on ? 'active' : ''}`}
                    onClick={handleToggle}
                    disabled={loading}
                    title={boyero.is_on ? "Apagar" : "Encender"}
                    style={{
                        backgroundColor: boyero.is_on ? 'var(--success-color)' : 'var(--danger-color)',
                        color: 'white',
                        boxShadow: boyero.is_on ? '0 8px 16px -4px rgba(34, 197, 94, 0.4)' : '0 8px 16px -4px rgba(239, 68, 68, 0.3)'
                    }}
                >
                    <Power size={24} strokeWidth={2.5} />
                </button>
            </div>

            <div className="card-body-info">
                <div className="card-subtitle">
                    <span className="subtitle-item">
                        <Cable size={14} strokeWidth={2.5} /> GPIO: {boyero.gpio_pin}
                    </span>
                    <span className="subtitle-item">
                        <Cpu size={14} strokeWidth={2.5} /> ESP: {boyero.esp_id}
                    </span>
                </div>

                <div className={`status-badge ${getStatusStyle(boyero.is_on)}`}>
                    {boyero.is_on ? (
                        <CloudLightning size={16} strokeWidth={2.5} />
                    ) : (
                        <CloudOff size={16} strokeWidth={2.5} />
                    )}
                    {boyero.is_on ? 'Conectado' : 'Desconectado'}
                </div>
            </div>

            <div className="card-footer">
                <div className="card-last-pulse">
                    {boyero.is_on ? 'ÚLTIMO PULSO: 2S' : 'ÚLTIMA CONEXIÓN: 5H'}
                </div>

                <button
                    className="settings-btn"
                    aria-label="Configuración"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    <Settings size={20} />
                </button>
            </div>
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
    onEdit: PropTypes.func.isRequired,
};

export default BoyeroCard;
