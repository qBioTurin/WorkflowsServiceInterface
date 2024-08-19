import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { username, email, firstName, lastName, password } = await request.json();

    try {
        // Ottenere un token dal realm 'master'
        const tokenResponse = await axios.post('http://keycloak:8080/realms/master/protocol/openid-connect/token', new URLSearchParams({
            'grant_type': 'password',
            'client_id': 'admin-cli',
            'username': 'admin',
            'password': 'admin'
        }));
        
        const token = tokenResponse.data.access_token;

        // Usare il token per creare un nuovo utente nel realm 'stage'
        const createUserResponse = await axios.post(
            'http://keycloak:8080/admin/realms/stage/users',
            {
                username,
                email,
                firstName,
                lastName,
                enabled: true,
                credentials: [
                    {
                        type: 'password',
                        value: password,
                        temporary: false
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Risposta di successo
        return NextResponse.json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Failed to register user:', error);
        return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
    }
}
