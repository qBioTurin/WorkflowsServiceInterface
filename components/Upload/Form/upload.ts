"use server";
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function submitAnalysis(formData: FormData): Promise<{ success: boolean, error?: string }> {
  try {
    const uniqueId = uuidv4();
    const analysisName = formData.get('analysisName') as string;
    const analysisDir = path.join(process.cwd(), 'public', 'storage', 'utente1', `${analysisName}-${getCurrentDateFormatted()}-${uniqueId}`);
    const storageDir = path.join(analysisDir, 'input');

    await fs.mkdir(storageDir, { recursive: true });

    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;
    await saveUploadedFile(file1, storageDir);
    await saveUploadedFile(file2, storageDir);

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

    const reportDir = path.join(analysisDir, 'output');
    await fs.mkdir(reportDir, { recursive: true });

    const metadataPath = path.join(reportDir, `metadata-workflow-${uniqueId}.report`);
    const reportContent = `
      USER:
      DATA:
      ORA:
      WORKFLOW NAME:
      ERROR: false
      SCADENZA-FILE-SU-MACCHINA: ${calculateExpirationDate(new Date())}
    `.trim();
    await fs.writeFile(metadataPath, reportContent);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function saveUploadedFile(file: File, storageDir: string): Promise<void> {
  const filePath = path.join(storageDir, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  // Scrittura del file
  await fs.writeFile(filePath, buffer);

  // Apertura e chiusura immediata del file per assicurare che tutte le operazioni siano complete
  const fileHandle = await fs.open(filePath, 'r');
  await fileHandle.close();
}

function getCurrentDateFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

function calculateExpirationDate(currentDate: Date): string {
  const expirationDate = new Date(currentDate);
  expirationDate.setDate(currentDate.getDate() + 7);
  const day = expirationDate.getDate().toString().padStart(2, '0');
  const month = (expirationDate.getMonth() + 1).toString().padStart(2, '0');
  const year = expirationDate.getFullYear();
  return `${day}/${month}/${year}`;
}
