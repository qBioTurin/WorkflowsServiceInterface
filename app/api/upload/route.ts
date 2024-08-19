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

    // Salva il chunk con un nome che include il numero del chunk per evitare conflitti
    const chunkPath = path.join(uploadDir, `${fileName}-chunk-${chunkNumber}`);
    await fs.promises.writeFile(chunkPath, new Uint8Array(await (chunk as File).arrayBuffer()));
    logger.info(`Chunk ${chunkNumber} saved to ${chunkPath}`);

    // Controlla se tutti i chunk sono stati ricevuti (sulla base del totale atteso)
    if (chunkNumber + 1 === totalChunks) {
      logger.info(`All ${totalChunks} chunks for file ${fileName} received. Starting to combine them.`);

      const filePath = path.join(uploadDir, fileName);
      const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

      for (let i = 0; i < totalChunks; i++) {
        const chunkPartPath = path.join(uploadDir, `${fileName}-chunk-${i}`);
        try {
          const chunkPart = await fs.promises.readFile(chunkPartPath);
          logger.info(`Writing chunk ${i} to file ${filePath}`);
          writeStream.write(chunkPart);
          await fs.promises.unlink(chunkPartPath);  // Rimuovi il chunk una volta che è stato scritto
        } catch (err: any) {
          logger.error(`Error writing chunk ${i} to file: ${err.message}`);
          return NextResponse.json({ success: false, error: `Error writing chunk ${i} to file: ${err.message}` }, { status: 500 });
        }
      }

      // Fine della scrittura, chiudi il writeStream
      writeStream.end(() => {
        logger.info(`File ${filePath} successfully reconstructed from chunks.`);
      });

      return NextResponse.json({ success: true, fileReconstructed: true });
    }

    return NextResponse.json({ success: true, fileReconstructed: false });
  } catch (error: any) {
    logger.error('Error during chunk upload:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
