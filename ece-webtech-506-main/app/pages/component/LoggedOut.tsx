// LoggedOut.js
import React from 'react';
import { useUser } from '../../UserContext';

function LoggedOut() {
    const { login } = useUser();

    const onClickLogin = async () => {
        const response = await fetch('/api/profile');
        const user = await response.json();
        login(user);
    };

    return (
        <div>
        </div>
    );
}

export default LoggedOut;
