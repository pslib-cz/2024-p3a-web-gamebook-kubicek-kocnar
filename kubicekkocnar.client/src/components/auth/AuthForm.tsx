import { useLocation } from 'react-router-dom';
import '../../styles/game/Auth.css'
import React, { FormEvent, useState } from 'react';

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

export default function AuthForm () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const redirurl = useQuery().get("url");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform login logic here
        console.log('Username:', username);
        console.log('Password:', password);
        // Redirect or handle login success
    };

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit" className="authbutton">Přihlásit se</button>
        </form>
    </div>
    )
}