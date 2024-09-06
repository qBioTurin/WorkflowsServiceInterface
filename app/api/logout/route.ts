import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    // Recupera il refresh token dai cookie
    const refreshToken = req.cookies.get('refreshToken')?.value; // Usa .value per ottenere il valore del cookie

    // Se esiste un refresh token, effettua la richiesta di revoca a Keycloak
    if (refreshToken) {
      await axios.post(
        'http://keycloak:8080/realms/stage/protocol/openid-connect/logout',
        new URLSearchParams({
          client_id: 'nextjs-client',
          refresh_token: refreshToken, // Passa il valore stringa del refresh token
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    }

    // Cancella i cookie di accessToken e refreshToken
    const response = NextResponse.redirect('http://localhost:3000/');
    response.cookies.set('accessToken', '', { path: '/', maxAge: 0, httpOnly: true });
    response.cookies.set('refreshToken', '', { path: '/', maxAge: 0, httpOnly: true });

    return response;

  } catch (error: any) {
    console.error('Logout error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
