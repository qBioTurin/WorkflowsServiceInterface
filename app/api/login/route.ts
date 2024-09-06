import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Fai una richiesta a Keycloak per ottenere access e refresh token
    const tokenResponse = await axios.post(
      'http://keycloak:8080/realms/stage/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'password',
        client_id: 'nextjs-client',
        username: email,
        password: password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokenResponse.data;

    // Imposta l'access token nel cookie con durata pari a expiresIn (che è in secondi)
    const accessTokenCookie = `accessToken=${accessToken}; Path=/; HttpOnly; Max-Age=${expiresIn}; Secure; SameSite=Lax;`;

    // Imposta il refresh token nel cookie senza Max-Age (puoi anche impostare una durata fissa)
    const refreshTokenCookie = `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Lax;`;

    // Crea la risposta e imposta i cookie
    const response = NextResponse.json({ message: 'Login successful' });
    response.headers.set('Set-Cookie', accessTokenCookie);
    response.headers.append('Set-Cookie', refreshTokenCookie);

    return response;

  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
