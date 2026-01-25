import React, { useState } from 'react';
import { X, Save, Cpu, Rss, Info, Loader2, CloudOff, CloudLightning } from 'lucide-react';
import PropTypes from 'prop-types';
import EspService from '../services/espService';

const CreateEspModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        active: true
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!formData.name || !formData.id) {
            alert('Por favor complete todos los campos');
            return;
        }

        try {
            setLoading(true);
            await EspService.create(formData);
            alert('ESP creado exitosamente');
            onClose();
            // Reset form
            setFormData({ name: '', id: '', active: true });
        } catch (error) {
            console.error("Error creating ESP", error);
            alert("Error al crear el ESP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="modal-title">
                        <Cpu size={20} />
                        <h2>Nuevo ESP</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name">Nombre / Ubicación</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Galpón Principal"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="id">
                            <Info size={14} style={{ marginRight: '4px' }} />
                            ID del ESP (Serial)
                        </label>
                        <input
                            type="text"
                            id="id"
                            value={formData.id}
                            onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                            placeholder="Ej: ESP32-001A"
                        />
                    </div>

                    <div className="form-group">
                        <label>Estado Inicial</label>
                        <div
                            className={`status-pill ${formData.active ? 'on' : 'off'}`}
                            onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                            style={{ cursor: 'pointer' }}
                        >
                            {formData.active ? (
                                <CloudLightning size={16} strokeWidth={2.5} />
                            ) : (
                                <CloudOff size={16} strokeWidth={2.5} />
                            )}
                            {formData.active ? 'Activo' : 'Inactivo'}
                        </div>
                    </div>
                </div>

                <footer className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Crear ESP
                    </button>
                </footer>
            </div>
        </div>
    );
};

CreateEspModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default CreateEspModal;
