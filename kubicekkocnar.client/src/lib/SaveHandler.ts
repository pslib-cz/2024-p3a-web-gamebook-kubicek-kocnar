export interface Save {
    auth: {
        email: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
}

export default class SaveHandler {
    static async getAuth(): Promise<Save['auth'] | null> {
        const authRaw = localStorage.getItem('auth');
        if (!authRaw) return null;
        const auth = JSON.parse(authRaw);
        await this.refreshAuth(auth);
        return auth;
    }

    static async refreshAuth(auth: Save['auth']): Promise<void> {
        if (auth) {
            if (auth.expiresIn <= Date.now()) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/account/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refreshToken: auth.refreshToken }),
                    });
        
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('auth', JSON.stringify({...data, email: auth.email}));
                        console.log('Refresh successful');
                    } else {
                        console.error('Refresh failed');
                    }
                } catch (error) {
                    console.error('An error occurred:', error);
                    // Handle error
                }
                console.log('Refreshing token');
            }
        }
    }
}