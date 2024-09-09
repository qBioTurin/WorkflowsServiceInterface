import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import logger from '@/utils/logger/logger';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Recupera i dati dall'oggetto FormData della richiesta
    const data = await request.formData();
    const analysisName = data.get('analysisName')?.toString() || '';
    const fileName = data.get('fileName')?.toString();
    const chunk = data.get('file1') || data.get('file2');
    const chunkNumber = parseInt(data.get('chunkNumber')?.toString() || '0');
    const totalChunks = parseInt(data.get('totalChunks')?.toString() || '1');

    // Ottieni i dati dell'utente dal form
    const userEmail = data.get('email')?.toString(); 
    const userUsername = data.get('username')?.toString(); 
    logger.info('chunk:'+ chunk + "|fileName:" + fileName + "|userEmail:" + userEmail + "|userUsername:" + userUsername);
    if (!chunk || !fileName || !userEmail || !userUsername) {
      logger.error('Missing chunk data, file name, or user details');
      return NextResponse.json({ success: false, error: 'Missing chunk data, file name, or user details' }, { status: 400 });
    }

    // Usa lo username per creare una cartella unica per l'utente
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', userUsername, analysisName);

    if (!fs.existsSync(uploadDir)) {
      logger.info(`Creating directory ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const chunkPath = path.join(uploadDir, `${fileName}-chunk-${chunkNumber}`);

    logger.info(`Saving chunk ${chunkNumber} of file ${fileName} to ${chunkPath}`);

    await fs.promises.writeFile(chunkPath, new Uint8Array(await (chunk as File).arrayBuffer()));

    logger.info(`Chunk ${chunkNumber} saved to ${chunkPath}`);

    // Controlla se tutti i chunk sono stati ricevuti
    if (chunkNumber + 1 === totalChunks) {
      logger.info(`All ${totalChunks} chunks for file ${fileName} received. Starting to combine them.`);
      
      const filePath = path.join(uploadDir, fileName);
      
      try {
        await mergeChunks(uploadDir, fileName, totalChunks, filePath);
        return NextResponse.json({ success: true, fileReconstructed: true });
      } catch (error: any) {
        logger.error(`Error merging chunks for file ${fileName}: ${error.message}`);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, fileReconstructed: false });
  } catch (error: any) {
    logger.error(`Error during chunk upload: ${error.message}`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Funzione per unire i chunk caricati in un unico file
async function mergeChunks(uploadDir: string, fileName: string, totalChunks: number, filePath: string) {
  const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

  for (let i = 0; i < totalChunks; i++) {
    const chunkPartPath = path.join(uploadDir, `${fileName}-chunk-${i}`);
    try {
      const chunkPart = await fs.promises.readFile(chunkPartPath);
      logger.info(`Writing chunk ${i} to file ${filePath}`);
      writeStream.write(chunkPart);
    } catch (err: any) {
      logger.error(`Error writing chunk ${i} to file: ${err.message}`);
      throw err;
    }
  }

  writeStream.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  for (let i = 0; i < totalChunks; i++) {
    const chunkPartPath = path.join(uploadDir, `${fileName}-chunk-${i}`);
    try {
      await fs.promises.unlink(chunkPartPath);
      logger.info(`Deleted chunk ${i} after merging.`);
    } catch (err: any) {
      logger.error(`Error deleting chunk ${i}: ${err.message}`);
    }
  }

  logger.info(`File ${filePath} successfully reconstructed from chunks.`);
}
