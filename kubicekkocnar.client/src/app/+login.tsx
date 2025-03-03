import { useLocation } from 'react-router-dom';
import React, { FormEvent, useEffect, useState } from 'react';
import SaveHandler from '../lib/SaveHandler';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const redirurl = useQuery().get("url");

  useEffect(() => {
    (async () => {
      const auth = await SaveHandler.getAuth();

      if (auth && auth.accessToken) {
        console.log("Already logged in, redirecting to editor")
        window.location.replace("/editor");
      }
    })();
  }, []);

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
        localStorage.setItem('auth', JSON.stringify({ ...data, email, expiresAt: Date.now() + data.expiresIn * 1000 }));
        //console.log('Login successful');
        if (redirurl) {
          window.location.href = redirurl;
        } else {
          window.location.href = '/';
        }
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
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