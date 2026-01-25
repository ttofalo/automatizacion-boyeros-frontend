import React, { useState, useEffect } from 'react';
import { X, Save, Cpu, Cable, Info, Loader2, CloudOff, CloudLightning } from 'lucide-react';
import PropTypes from 'prop-types';
import BoyeroService from '../services/boyeroService';

const EditBoyeroModal = ({ isOpen, onClose, boyero, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        esp_id: '',
        gpio_pin: '',
        is_on: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (boyero) {
            setFormData({
                name: boyero.name,
                esp_id: boyero.esp_id,
                gpio_pin: boyero.gpio_pin,
                is_on: boyero.is_on
            });
        }
    }, [boyero]);

    if (!isOpen) return null;

    const handleSave = async () => {
        try {
            setLoading(true);
            const data = await BoyeroService.update(boyero.id, {
                ...formData,
                gpio_pin: parseInt(formData.gpio_pin)
            });
            onSaveSuccess(boyero.id, data);
            onClose();
        } catch (error) {
            console.error("Error updating boyero", error);
            alert("Error al guardar los cambios");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = () => {
        setFormData(prev => ({ ...prev, is_on: !prev.is_on }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="modal-title">
                        <Info size={20} />
                        <h2>Editar Boyero</h2>
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
                                ID del ESP
                            </label>
                            <input
                                type="text"
                                id="esp_id"
                                value={formData.esp_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, esp_id: e.target.value }))}
                                placeholder="Ej: 01"
                            />
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

                    <div className="form-group">
                        <label>Estado del boyero</label>
                        <div
                            className={`status-pill ${formData.is_on ? 'on' : 'off'}`}
                            onClick={toggleStatus}
                            title="Haz clic para cambiar el estado"
                        >
                            {formData.is_on ? (
                                <CloudLightning size={16} strokeWidth={2.5} />
                            ) : (
                                <CloudOff size={16} strokeWidth={2.5} />
                            )}
                            {formData.is_on ? 'Conectado' : 'Desconectado'}
                        </div>
                    </div>
                </div>

                <footer className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Guardar Cambios
                    </button>
                </footer>
            </div>
        </div>
    );
};

EditBoyeroModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSaveSuccess: PropTypes.func.isRequired,
    boyero: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        gpio_pin: PropTypes.number,
        esp_id: PropTypes.string,
        is_on: PropTypes.bool,
    })
};

export default EditBoyeroModal;
