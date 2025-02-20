import React from 'react';
import '../../styles/game/Auth.css';
import { Save } from '../../lib/SaveHandler';

interface AuthWidgetProps {
    auth: Save['auth'];
    className?: string;
}

const AuthWidget: React.FC<AuthWidgetProps> = ({ auth, className }) => {
    return (
        <div className={`authwidget ${className}`}>
            <p>Logged in as: {auth.email}</p>
            <button onClick={() => {localStorage.setItem("auth", "{}"); window.location.replace(`/login?url=${window.location.pathname}`)}} className='authbutton'>Lonkvau</button>
        </div>
    );
};

export default AuthWidget;
