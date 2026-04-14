import React from 'react';
import AuthService from '../services/authService';

function ProtectedRoute({ children, onAuthFail }) {
    const isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
        onAuthFail?.();
        return null;
    }

    return children;
}

export default ProtectedRoute;
