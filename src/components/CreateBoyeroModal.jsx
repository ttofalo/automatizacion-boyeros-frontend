import React, { useState, useEffect } from 'react';
import { X, Save, Cpu, Cable, Plus, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';
import BoyeroService from '../services/boyeroService';
import EspService from '../services/espService';

const CreateBoyeroModal = ({ isOpen, onClose, onCreateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        esp_id: '',
        gpio_pin: ''
    });
    const [esps, setEsps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingEsps, setLoadingEsps] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchEsps();
        }
    }, [isOpen]);

    const fetchEsps = async () => {
        try {
            setLoadingEsps(true);
            const data = await EspService.getAll();
            setEsps(data);
        } catch (error) {
            console.error("Error fetching ESPs", error);
            // Optional: Show error to user
        } finally {
            setLoadingEsps(false);
        }
    };

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!formData.name || !formData.gpio_pin || !formData.esp_id) {
            alert('Por favor complete todos los campos');
            return;
        }

        try {
            setLoading(true);
            const data = await BoyeroService.create({
                ...formData,
                gpio_pin: parseInt(formData.gpio_pin)
            });
            onCreateSuccess(data);
            onClose();
            // Reset form
            setFormData({ name: '', esp_id: '', gpio_pin: '' });
        } catch (error) {
            console.error("Error creating boyero", error);
            alert("Error al crear el boyero");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="modal-title">
                        <Plus size={20} />
                        <h2>Nuevo Boyero</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name">Nombre del Dispositivo</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Boyero Norte 1"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="esp_id">
                                <Cpu size={14} style={{ marginRight: '4px' }} />
                                Seleccionar ESP
                            </label>
                            {loadingEsps ? (
                                <div style={{ padding: '0.875rem', border: '1px solid var(--border-color)', borderRadius: '0.875rem', color: 'var(--text-tertiary)' }}>
                                    Cargando ESPs...
                                </div>
                            ) : (
                                <select
                                    id="esp_id"
                                    value={formData.esp_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, esp_id: e.target.value }))}
                                    style={{
                                        background: 'var(--bg-color)',
                                        border: '1px solid var(--border-color)',
                                        padding: '0.875rem 1.125rem',
                                        borderRadius: '0.875rem',
                                        fontFamily: 'inherit',
                                        fontSize: '0.95rem',
                                        color: 'var(--text-primary)',
                                        width: '100%',
                                        appearance: 'none' // Optionally custom arrow
                                    }}
                                >
                                    <option value="">Seleccionar...</option>
                                    {esps.length > 0 ? (
                                        esps.map(esp => (
                                            <option key={esp.esp_id} value={esp.esp_id}>
                                                {esp.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No hay ESPs disponibles</option>
                                    )}
                                </select>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="gpio_pin">
                                <Cable size={14} style={{ marginRight: '4px' }} />
                                Pin GPIO
                            </label>
                            <input
                                type="number"
                                id="gpio_pin"
                                value={formData.gpio_pin}
                                onChange={(e) => setFormData(prev => ({ ...prev, gpio_pin: e.target.value }))}
                                placeholder="Ej: 10"
                            />
                        </div>
                    </div>
                </div>

                <footer className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Crear Boyero
                    </button>
                </footer>
            </div>
        </div>
    );
};

CreateBoyeroModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreateSuccess: PropTypes.func.isRequired
};

export default CreateBoyeroModal;
