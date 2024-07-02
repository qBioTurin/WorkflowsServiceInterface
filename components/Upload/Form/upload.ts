"use server";
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';

type FormData = {
  analysisName: string;
  file1Path: string;
  file2Path: string;
};

type ApiResponse = {
  success: boolean;
  error?: string;
};

export async function submitAnalysis(formData: FormData): Promise<ApiResponse> {
  try {
    const uniqueId = uuidv4();
    const analysisName = formData.analysisName;
    const analysisDir = path.join(process.cwd(), 'public', 'storage', 'utente1', `${analysisName}-${getCurrentDateFormatted()}-${uniqueId}`);
    const storageDir = path.join(analysisDir, 'input');

    await fs.mkdir(storageDir, { recursive: true });

    // Copy files to storage directory
    await fs.copyFile(formData.file1Path, path.join(storageDir, path.basename(formData.file1Path)));
    await fs.copyFile(formData.file2Path, path.join(storageDir, path.basename(formData.file2Path)));

    await copyConfigFile('config.yml', storageDir);
    await copyConfigFile('streamflow.yml', storageDir);

    await createStartScript(storageDir);

    const reportDir = path.join(analysisDir, 'output');
    await fs.mkdir(reportDir, { recursive: true });

    await createReportFile(reportDir, uniqueId);

    await copyFilesToRemote(storageDir);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function copyConfigFile(fileName: string, destinationDir: string): Promise<void> {
  const srcPath = path.join(process.cwd(), 'public', 'model', fileName);
  const destPath = path.join(destinationDir, fileName);
  await fs.copyFile(srcPath, destPath);
}

async function createStartScript(storageDir: string): Promise<void> {
  const scriptContent = `
#!/bin/bash
echo "avviato in maniera corretta" > ${path.join(storageDir, 'log.txt')}
  `.trim();

  const scriptPath = path.join(storageDir, 'start_analysis.sh');
  await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });
}

async function createReportFile(reportDir: string, uniqueId: string): Promise<void> {
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
}

async function copyFilesToRemote(storageDir: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remotePath = '/comandi';
  const passphrase = 'idronight';

  const command = `sshpass -p ${passphrase} scp -r ${storageDir} ${remoteUser}@${remoteHost}:${remotePath}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error in copyFilesToRemote: ${error.message}`));
      } else if (stderr) {
        reject(new Error(`Stderr: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
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
