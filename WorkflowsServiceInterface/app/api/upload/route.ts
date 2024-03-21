// pages/api/upload.ts
"use server"
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

import { exec } from 'child_process'; // Aggiungi questo import all'inizio del file

import { IncomingForm } from 'formidable';
import { request } from 'http';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("Richiesta POST ricevuta"); 
  const data = await req.formData();
  const analisysName : string | null = data.get('analysisName') as unknown as string;
  const file1 : File | null  = data.get('file1') as unknown as File;
  const file2 : File | null  = data.get('file2') as unknown as File;
  if(!file1 || !file2){
    return NextResponse.json({success: false});
  }
  const bytes1 = await file1.arrayBuffer();
  const bytes2 = await file2.arrayBuffer();
  const buffer1 = Buffer.from(bytes1);
  const buffer2 = Buffer.from(bytes2);

  const analysisName = data.get('analysisName');
  const storageDir = path.join(process.cwd(), 'public', 'storage', 'utente1',analisysName );
  console.log(storageDir);

  await fs.mkdir(storageDir, { recursive: true });

  const filePath1 = path.join(storageDir, file1.name);
  const filePath2 = path.join(storageDir, file2.name);

  console.log("path1:" + filePath1);
  console.log("path2:" + filePath2);


  // Costruisci il contenuto del file di configurazione secondo la nuova struttura yml
  const configFileContent = `
  raw_data:
    class: Directory
    location: ${storageDir}
  threads: 5
  file:
    class: File
    path: ${filePath1}
  `;
  const configFilePath = path.join(storageDir, 'config.yml');
  // Scrivi il contenuto nel file di configurazione
  await fs.writeFile(configFilePath, configFileContent);

  await fs.writeFile(filePath1, buffer1);
  await fs.writeFile(filePath2, buffer2);


  //parte dove faccio il ping
  exec('curl http://127.0.0.1:3001/ping', (error, stdout, stderr) => {
    if (error) {
      console.error(`Errore nell'esecuzione del comando: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Errore: ${stderr}`);
      return;
    }
    console.log(`Risultati del ping: ${stdout}`);
  
    // Puoi anche decidere di includere l'output del comando nella tua risposta HTTP se necessario
    // return NextResponse.json({ success: true, pingOutput: stdout });
  });

  return NextResponse.json({success: true})

 
}
