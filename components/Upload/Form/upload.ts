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
    const analysisNameID = `${analysisName}-${getCurrentDateFormatted()}-${uniqueId}`;
    const analysisDir = path.join(process.cwd(), 'public', 'storage', 'utente1', `${analysisNameID}`);
    const storageDir = path.join(analysisDir, 'input');
    const outputDir = path.join(analysisDir,);

    await fs.mkdir(storageDir, { recursive: true });

    // Copy files to storage directory
    await fs.copyFile(formData.file1Path, path.join(storageDir, path.basename(formData.file1Path)));
    await fs.copyFile(formData.file2Path, path.join(storageDir, path.basename(formData.file2Path)));

    await copyConfigFile('config.yml', storageDir);
    await copyConfigFile('streamflow.yml', storageDir);

    await createStartScript(storageDir,analysisNameID);

    const reportDir = path.join(analysisDir, 'output');
    await fs.mkdir(reportDir, { recursive: true });

    await createReportFile(reportDir, uniqueId);

    await copyFilesToRemote(storageDir,analysisNameID);

    await executeRemoteScript(analysisDir,analysisNameID);
    //return { success: true };

    await copyResultsBackToLocal(analysisNameID+"/output",outputDir);

    await removeRemoteDirectory(`utente1/${analysisNameID}`);

    //await removeLocalDirectory(storageDir);

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

async function removeLocalDirectory(localPath: string): Promise<void> {
  await fs.rm(localPath, { recursive: true, force: true });
}

async function createStartScript(storageDir: string,analysisNameID:string): Promise<void> {
  const scriptContent = `
#!/bin/bash

# Creare la cartella di output se non esiste
mkdir -p "utente1/${analysisNameID}/output"

# Creare il file di log
echo "avviato in maniera corretta" > "utente1/${analysisNameID}/output/log.txt"

# Simulare un processo del workflow
sleep 10

# Aggiornare il file di log
echo "workflow completato" >> "utente1/${analysisNameID}/output/log.txt"
  `.trim();

  const scriptPath = path.join(storageDir, 'runWorkflow.sh');
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

async function copyFilesToRemote(storageDir: string, remoteFolderName:string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remotePath = `utente1/${remoteFolderName}`; // Percorso remoto appropriato

  // Ensure the remote directory exists
  const mkdirCommand = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'mkdir -p ${remotePath}'`;
  
  await new Promise<void>((resolve, reject) => {
    exec(mkdirCommand, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error in creating remote directory: ${error.message}`));
      } else if (stderr) {
        reject(new Error(`Stderr while creating remote directory: ${stderr}`));
      } else {
        resolve();
      }
    });
  });

  const command = `scp -i /root/.ssh/id_rsa -r ${storageDir} ${remoteUser}@${remoteHost}:${remotePath}`;

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

async function executeRemoteScript(analysisDir: string,remotePath:string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remoteScriptPath = path.join('utente1', path.basename(analysisDir), 'input', 'runWorkflow.sh');
  remotePath = `utente1/${remotePath}/output`

  const command = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'bash ${remoteScriptPath}'`;

  await new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error in executeRemoteScript: ${error.message}`));
      } else if (stderr) {
        reject(new Error(`Stderr: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
}

async function copyResultsBackToLocal(reportDir: string, localDirecotry : string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remoteOutputDir = `utente1/${reportDir}`; // Percorso remoto appropriato

  const command = `scp -i /root/.ssh/id_rsa -r ${remoteUser}@${remoteHost}:${remoteOutputDir} ${localDirecotry}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error in copyResultsBackToLocal: ${error.message}`));
      } else if (stderr) {
        reject(new Error(`Stderr: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
}

async function removeRemoteDirectory(remotePath: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const removeCommand = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'rm -rf ${remotePath}'`;

  await new Promise<void>((resolve, reject) => {
    exec(removeCommand, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error in removing remote directory: ${error.message}`));
      } else if (stderr) {
        reject(new Error(`Stderr while removing remote directory: ${stderr}`));
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
