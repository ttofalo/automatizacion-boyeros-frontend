import React, { useState, useEffect, useRef } from 'react';
import { Delete } from 'lucide-react';
import AuthService from '../services/authService';
import '../styles/login.css';

const PIN_LENGTH = 6;
const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function LoginPage({ onLoginSuccess }) {
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [pressedKey, setPressedKey] = useState(null);
    const hiddenInputRef = useRef(null);

    // Keyboard input for desktop
    useEffect(() => {
        if (isMobile) return;

        const handleKeyDown = (e) => {
            if (loading || success) return;
            if (e.key >= '0' && e.key <= '9') {
                setPressedKey(e.key);
                handleNumpadClick(e.key);
            } else if (e.key === 'Backspace') {
                setPressedKey('Backspace');
                handleDelete();
            }
        };

        const handleKeyUp = (e) => {
            if ((e.key >= '0' && e.key <= '9') || e.key === 'Backspace') {
                setPressedKey(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [loading, success, pin]);

    // Auto-focus hidden input on desktop so keyboard is ready
    useEffect(() => {
        if (!isMobile && hiddenInputRef.current) {
            hiddenInputRef.current.focus();
        }
    }, [shake]); // re-focus after error reset

    const handleNumpadClick = (num) => {
        if (loading || success) return;
        if (pin.length < PIN_LENGTH) {
            const next = pin + num;
            setPin(next);
            setError('');

            if (next.length === PIN_LENGTH) {
                submitPin(next);
            }
        }
    };

    const handleDelete = () => {
        if (loading || success) return;
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    const submitPin = async (value) => {
        setLoading(true);
        try {
            await AuthService.login(value);
            setSuccess(true);
            setTimeout(() => onLoginSuccess(), 600);
        } catch (err) {
            const errorMessage = err.response?.status === 401 ? 'PIN Incorrecto' : 'Error de conexión';
            setShake(true);
            setTimeout(() => {
                setShake(false);
                setPin('');
                setError(errorMessage);
            }, 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`login-container ${success ? 'login-success' : ''}`}>
            <div className={`login-box ${success ? 'login-box-success' : ''}`}>
                <h1 className="login-title">Ingrese el PIN</h1>

                {!isMobile && (
                    <input
                        ref={hiddenInputRef}
                        type="text"
                        autoFocus
                        readOnly
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                        aria-hidden="true"
                    />
                )}

                <div className={`pin-display ${shake ? 'shake' : ''} ${success ? 'pin-success' : ''}`}>
                    {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                        <span key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''} ${success ? 'dot-success' : ''}`} />
                    ))}
                </div>

                {error && <p className="login-error">{error}</p>}

                <div className="numpad">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                type="button"
                                className={`numpad-btn${pressedKey === num.toString() ? ' numpad-btn-pressed' : ''}`}
                                onClick={() => handleNumpadClick(num.toString())}
                                disabled={loading || success}
                            >
                                {num}
                            </button>
                        ))}
                        <div className="numpad-empty" />
                        <button
                            type="button"
                            className={`numpad-btn${pressedKey === '0' ? ' numpad-btn-pressed' : ''}`}
                            onClick={() => handleNumpadClick('0')}
                            disabled={loading || success}
                        >
                            0
                        </button>
                        <button
                            type="button"
                            className={`numpad-btn numpad-delete${pressedKey === 'Backspace' ? ' numpad-btn-pressed' : ''}`}
                            onClick={handleDelete}
                            disabled={loading || success || pin.length === 0}
                        >
                            <Delete size={22} />
                        </button>
                    </div>
            </div>
        </div>
    );
}

export default LoginPage;
