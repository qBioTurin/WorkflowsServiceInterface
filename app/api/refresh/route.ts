import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    // Ottieni il refresh token dai cookie
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 });
    }

    // Richiedi un nuovo access token a Keycloak
    const tokenResponse = await axios.post(
      'http://keycloak:8080/realms/stage/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: 'nextjs-client',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token: newAccessToken, refresh_token: newRefreshToken, expires_in: expiresIn } = tokenResponse.data;

    // Aggiorna il cookie con il nuovo access token e refresh token
    const nextResponse = NextResponse.json({ message: 'Token refreshed successfully' });
    nextResponse.cookies.set('accessToken', newAccessToken, {
      path: '/',
      httpOnly: true,
      maxAge: expiresIn,
    });

    nextResponse.cookies.set('refreshToken', newRefreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // Imposta una durata più lunga per il refresh token
    });

    return nextResponse;

  } catch (error: any) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}
