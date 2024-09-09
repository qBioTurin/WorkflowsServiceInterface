import { NextRequest, NextResponse } from 'next/server';
import {jwtDecode} from 'jwt-decode';  // Assicurati che jwtDecode sia importato correttamente

import {DecodedToken} from '@/utils/models/models'

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const decodedUser = jwtDecode<DecodedToken>(accessToken);

    const user = {
      email: decodedUser.email,
      username: decodedUser.preferred_username,
      first_name: decodedUser.given_name,
      last_name: decodedUser.family_name,
    };
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Errore nel recupero dell\'utente:', error);
    return NextResponse.json({ error: 'Failed to retrieve user data' }, { status: 500 });
  }
}
