import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';  // Importa jwtDecode come export nominato
import axios from 'axios';

interface DecodedToken {
  exp: number; // Proprietà che rappresenta la scadenza del token
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // Se non esiste l'access token, reindirizza l'utente al login
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Decodifica l'access token per ottenere informazioni sulla scadenza
    const decodedToken: DecodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // Ottieni il tempo attuale in secondi

    // Se l'access token è scaduto
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log('Access token scaduto, provando a rinnovare con il refresh token...');

      if (!refreshToken) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Effettua la richiesta per rinnovare l'access token
      const refreshResponse = await axios.post(
        'http://keycloak:8080/realms/stage/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: 'nextjs-client',
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      const { access_token: newAccessToken, expires_in: expiresIn } = refreshResponse.data;

      // Aggiorna il cookie con il nuovo access token
      const response = NextResponse.next();
      response.cookies.set('accessToken', newAccessToken, {
        path: '/',
        httpOnly: true,
        maxAge: expiresIn, // Durata in secondi
      });

      return response;
    }

    // Se l'access token è ancora valido, continua la richiesta
    return NextResponse.next();
  } catch (error) {
    console.error('Errore durante la gestione del token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Configura il middleware per proteggere solo le pagine di upload
export const config = {
  matcher: '/upload/:path*', // Proteggi tutte le rotte sotto /upload/
};
