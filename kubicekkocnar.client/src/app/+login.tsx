import { useLocation } from 'react-router-dom';

import React, { FormEvent, useState } from 'react';

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

export default function AuthForm () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const redirurl = useQuery().get("url");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Perform login logic here (get the token and save it to the local storage)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('auth', JSON.stringify({...data, email}));
                console.log('Login successful');
                // Redirect or handle login success
                if (redirurl) {
                    window.location.href = redirurl;
                } else {
                    // Default redirect or action
                    window.location.href = '/';
                }
            } else {
                console.error('Login failed');
                // Handle login failure
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle error
        }
    };

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
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