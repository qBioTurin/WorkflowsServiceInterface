import { NextRequest, NextResponse } from 'next/server';
import {jwtDecode} from 'jwt-decode';  // Assicurati che jwtDecode sia importato correttamente

// Definiamo un'interfaccia per il token decodificato
interface DecodedToken {
  email: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  exp: number;  // Per controllare la scadenza del token, se necessario
}

export async function GET(req: NextRequest) {
  try {
    // Estrai il cookie accessToken
    const accessToken = req.cookies.get('accessToken')?.value;

    // Verifica se esiste il token, altrimenti restituisci un errore
    if (!accessToken) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Decodifica il token JWT per ottenere i dettagli dell'utente
    const decodedUser = jwtDecode<DecodedToken>(accessToken);

    // Mappiamo i dati che ci servono e li restituiamo
    const user = {
      email: decodedUser.email,
      username: decodedUser.preferred_username,
      first_name: decodedUser.given_name,
      last_name: decodedUser.family_name,
    };

    // Restituisci i dettagli dell'utente al frontend
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Errore nel recupero dell\'utente:', error);
    return NextResponse.json({ error: 'Failed to retrieve user data' }, { status: 500 });
  }
}
