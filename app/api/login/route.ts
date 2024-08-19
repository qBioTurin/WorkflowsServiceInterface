// /app/api/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const tokenResponse = await axios.post(
      'http://keycloak:8080/realms/stage/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'password',
        client_id: 'nextjs-client', // Usa il tuo client ID
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

    // Ritorna i token di accesso e refresh
    return NextResponse.json({ accessToken, refreshToken, expiresIn });

  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
