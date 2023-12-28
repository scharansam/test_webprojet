// LoggedIn.tsx
import React from 'react';
import { useUser } from '../../UserContext'; // Assurez-vous que le chemin d'importation est correct

function LoggedIn() {
    const { user, logout } = useUser();

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <span>{user.username}</span>
        </div>
    );
}

export default LoggedIn;
