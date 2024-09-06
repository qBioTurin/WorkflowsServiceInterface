import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import logger from '@/utils/logger/logger';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const analysisName = data.get('analysisName')?.toString() || '';
    const fileName = data.get('fileName')?.toString();
    const chunk = data.get('file1') || data.get('file2');
    const chunkNumber = parseInt(data.get('chunkNumber')?.toString() || '0');
    const totalChunks = parseInt(data.get('totalChunks')?.toString() || '1');

    if (!chunk || !fileName) {
      logger.error('Missing chunk data or file name');
      return NextResponse.json({ success: false, error: 'Missing chunk data or file name' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', analysisName);

    if (!fs.existsSync(uploadDir)) {
      logger.info(`Creating directory ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const chunkPath = path.join(uploadDir, `${fileName}-chunk-${chunkNumber}`);

    // Log dettagliato prima della scrittura del file
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
      } catch (error : any) {
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
      throw err; // Invia l'errore al chiamante e interrompe il processo di scrittura
    }
  }

  writeStream.end(); // Chiudi lo stream di scrittura quando tutti i chunk sono stati uniti

  // Aspetta che lo stream di scrittura sia effettivamente chiuso
  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  // Dopo che il file è stato ricostruito correttamente, elimina i chunk
  for (let i = 0; i < totalChunks; i++) {
    const chunkPartPath = path.join(uploadDir, `${fileName}-chunk-${i}`);
    try {
      await fs.promises.unlink(chunkPartPath); // Elimina il chunk solo dopo che è stato unito correttamente
      logger.info(`Deleted chunk ${i} after merging.`);
    } catch (err: any) {
      logger.error(`Error deleting chunk ${i}: ${err.message}`);
    }
  }

  logger.info(`File ${filePath} successfully reconstructed from chunks.`);
}

