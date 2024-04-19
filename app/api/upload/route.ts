"use server"
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../utils/logger/logger';

function calculateExpirationDate(currentDate: Date): string {
  const expirationDate = new Date(currentDate);
  expirationDate.setDate(currentDate.getDate() + 7); // Aggiunge 7 giorni alla data corrente

  // Converte la data di scadenza nel formato desiderato 'GG/MM/AAAA'
  const day = expirationDate.getDate().toString().padStart(2, '0');
  const month = (expirationDate.getMonth() + 1).toString().padStart(2, '0');
  const year = expirationDate.getFullYear();

  return `${day}/${month}/${year}`;
}

async function scheduleFolderDeletion(folderPath: string, minutes: number) {
  const scriptName = `deleteFolder_${new Date().getTime()}.sh`;
  const scriptPath = `/tmp/${scriptName}`;
  const deleteScriptContent = `#!/bin/bash\nrm -rf "${folderPath}"\n`;

  await fs.writeFile(scriptPath, deleteScriptContent);
  await fs.chmod(scriptPath, '0755');

  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;

  const cronCommand = `${minute} ${hour} ${day} ${month} * ${scriptPath}`;
  const cronJobCommand = `(crontab -l 2>/dev/null; echo "${cronCommand}") | crontab -`;

  try {
    const { stdout, stderr } = await execAsync(cronJobCommand);
    if (stderr) {
      logger.error(`Errore STDERR durante l'aggiunta del cron job: ${stderr}`, { module: 'upload' });
      throw new Error(stderr);
    }
    logger.info(`Cron job creato con successo per eliminare la cartella '${folderPath}' in ${minutes} minuti.`, { module: 'upload' });
  } catch (error) {
    logger.error(`Errore durante la creazione del cron job: ${error}`, { module: 'upload' });
  }
}

function getCurrentDateFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}

async function cleanUpInputDirectory(directoryPath: string): Promise<void> {
  try {
    await fs.rm(directoryPath, { recursive: true, force: true });
    logger.info(`La directory '${directoryPath}' è stata rimossa con successo.`, { module: 'upload' });
  } catch (error) {
    logger.error(`Errore durante la rimozione della directory '${directoryPath}': ${error}`, { module: 'upload' });
  }
}

async function saveUploadedFile(data: FormData, formName: string, storageDir: string): Promise<{ success: boolean }> {
  const file: File | null = data.get(formName) as unknown as File;
  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(storageDir, file.name);
    await fs.writeFile(filePath, buffer);
    return { success: true };
  } else {
    logger.info('Nessun file ricevuto per il salvataggio.', { module: 'upload' });
    return { success: false };
  }
}

async function copyStreamFlowFile(outputPath: string) {
  const sourceFilePath = path.join(process.cwd(), 'public', 'model', 'streamFlow.yml');
  const destinationFilePath = path.join(outputPath, 'streamFlow.yml');
  await fs.copyFile(sourceFilePath, destinationFilePath);
  return NextResponse.json({ success: true });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest, res: NextResponse) {
  logger.info("Inizio elaborazione richiesta POST.", { module: 'upload' });
  let errorStatus: boolean = false;
  const data = await req.formData();
  const uniqueId = uuidv4();

  const analysisName: string | null = data.get('analysisName') as unknown as string;
  const analysisDir = path.join(process.cwd(), 'public', 'storage', 'utente1', analysisName + '-' + getCurrentDateFormatted() + '-' + uniqueId);
  const storageDir = path.join(analysisDir, 'input');

  await fs.mkdir(storageDir, { recursive: true });
  logger.info(`Directory di input creata: ${storageDir}`, { module: 'upload' });

  let uploadSuccess = true;
  uploadSuccess = uploadSuccess && (await saveUploadedFile(data, "file1", storageDir)).success;
  uploadSuccess = uploadSuccess && (await saveUploadedFile(data, "file2", storageDir)).success;
  if (!uploadSuccess) {
    logger.error("Caricamento dei file non riuscito.", { module: 'upload' });
    return NextResponse.json({ success: false });
  }

  logger.info("File caricati con successo.", { module: 'upload' });
  const configFileContent = `
  raw_data:
    class: Directory
    location: .
  threads: 5
  file:
    class: File
    path: input
  `;
  const configFilePath = path.join(storageDir, 'config.yml');
  await fs.writeFile(configFilePath, configFileContent);
  await copyStreamFlowFile(storageDir);

  const reportDir = path.join(analysisDir, 'output');
  await fs.mkdir(reportDir, { recursive: true });

  exec('curl http://127.0.0.1:3001/ping', async (error, stdout, stderr) => {
    if (error) {
      const errorReportPath = path.join(reportDir, 'error-' + uniqueId + '.report');
      await fs.writeFile(errorReportPath, `${error}`);
      errorStatus = true;
      logger.error(`Errore durante il ping: ${error}`, { module: 'upload' });
    } else if (stderr) {
      const errorReportPath = path.join(reportDir, 'error-' + uniqueId + '.report');
      await fs.writeFile(errorReportPath, `${stderr}`);
      errorStatus = true;
      logger.error(`Errore STDERR durante il ping: ${stderr}`, { module: 'upload' });
    } else {
      const outputReportPath = path.join(reportDir, 'output-' + uniqueId + '.report');
      await fs.writeFile(outputReportPath, `Risultati del ping: ${stdout}`);
      logger.info(`Risultati del ping: ${stdout}`, { module: 'upload' });
      errorStatus = false;
    }

    const metadataPath = path.join(reportDir, 'metadata-workflow-' + uniqueId + '.report');
    const reportContent = `
      USER:
      DATA:
      ORA:
      WORKFLOW NAME:
      ERROR: ${errorStatus}
      SCADENZA-FILE-SU-MACCHINA: ${calculateExpirationDate(new Date())}
    `.trim();
    await fs.writeFile(metadataPath, reportContent);
    await sleep(10000);
    await cleanUpInputDirectory(storageDir);

    scheduleFolderDeletion(reportDir, 2);
    logger.info("Pulizia completata e operazione conclusa.", { module: 'upload' });
    return NextResponse.json({ success: true });
  });

  logger.info("Fine elaborazione richiesta POST.", { module: 'upload' });
  return NextResponse.json({ success: true });
}
