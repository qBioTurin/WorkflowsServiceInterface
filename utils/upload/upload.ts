"use server";
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { exec } from 'child_process';
import logger from '@/utils/logger/logger';  
import { insertAnalysis, insertReportFile } from '@/utils/database/Analysis';

type FormData = {
  analysisName: string;
  file1Path: string;
  file2Path: string;
  username: string;  
  email: string;    
};

type ApiResponse = {
  success: boolean;
  error?: string;
};


async function executeWithRetry(command: string, maxRetries = 3, delayMs = 2000): Promise<void> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      await executeCommand(command);
      return; 
    } catch (error: any) {
      attempts++;
      if (attempts >= maxRetries) {
        throw new Error(`Failed to execute command after ${maxRetries} attempts: ${error.message}`);
      } else {
        console.warn(`Retrying command (${attempts}/${maxRetries})...`);
        await sleep(delayMs);
      }
    }
  }
}

async function executeCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error: ${error.message}, Stderr: ${stderr}`));
      } else {
        resolve();
      }
    });
  });
}

export async function submitAnalysis(formData: FormData): Promise<ApiResponse> {
  console.log("chiaro di corretta chiamata");
  try {
    logger.info(`Messaggio chiaro di corretta chiamata`);

    if (!formData.analysisName || !formData.file1Path || !formData.file2Path) {
      logger.error('Missing files or analysis name');
      throw new Error('Missing files or analysis name');
    }

    const uniqueId = uuidv4();  
    const username = formData.username; 
    const email = formData.email; 
    const analysisName = formData.analysisName;
    const analysisNameID = `${analysisName}-${getCurrentDateFormatted()}-${uniqueId}`;

    try {
      await asyncUpload(formData, analysisNameID, username, uniqueId);
      return { success: true };
    } catch (err: any) {
      await sendMail(username, email, `Si è verificato un errore per l'analisi ${analysisNameID}: ${err}`, "error");
      return { success: false, error: err.message };
    }
  } catch (error: any) {
    logger.error("Error in submitAnalysis:", error);
    return { success: false, error: error.message };
  }
}

async function asyncUpload(formData: FormData, analysisNameID: string, username: string, uniqueId: string) {
  const analysisName = formData.analysisName;
  const email = formData.email; 
  const analysisDir = path.join(process.cwd(), 'public', 'storage', username, `${analysisNameID}`);
  const storageDir = path.join(analysisDir, 'input');
  const outputDir = path.join(analysisDir, 'output');

  await sendMail(username, email, `L'analisi con ID ${analysisNameID} è stata presa in carico.`, "start");

  await fs.mkdir(storageDir, { recursive: true });
  logger.info(`Created storage directory at ${storageDir}`);

  if (formData.file1Path && formData.file2Path) {
    await fs.copyFile(formData.file1Path, path.join(storageDir, path.basename(formData.file1Path)));
    await fs.copyFile(formData.file2Path, path.join(storageDir, path.basename(formData.file2Path)));
    logger.info('Files copied to storage directory.');
  } else {
    logger.error('Neither files nor links provided');
    await sendMail(username, email, `Si è verificato un errore per l'analisi ${analysisNameID}: uno o entrambi i file non sono reperibili.`, "error");
    throw new Error('Neither files nor links provided');
  }

  await createConfigFile(storageDir, username);
  await copyConfigFile('streamflow.yml', storageDir);

  await createStartScript(storageDir, analysisNameID, username);
  await fs.mkdir(outputDir, { recursive: true });

  logger.info('Copying files to remote server.');
  await copyFilesToRemote(storageDir, analysisNameID, username);

  logger.info('Inserting analysis record in the database.');
  await insertAnalysisdb(analysisNameID, analysisName);

  logger.info('Executing remote script.');
  await executeRemoteScript(analysisDir, analysisNameID, username);

  logger.info('Copying results back to local machine.');
  await copyResultsBackToLocal(analysisNameID, analysisDir, username);

  logger.info('Inserting report file record in the database.');
  await insertReportFiledb(outputDir, uniqueId, analysisNameID);

  logger.info("Analysis processing completed.");
  await sendMail(username, email, `L'analisi con ID ${analysisNameID} è stata completata con successo.`, "end");
}

async function insertAnalysisdb(analysisNameID: string, analysisName: string) {
  const userId = 1; 
  const creationTimestamp = new Date();
  const analysis = { analysis_id: analysisNameID, analysis_name: analysisName, user_id: userId, creation_timestamp: creationTimestamp, status: 'Pending' };
  await insertAnalysis(analysis);
}

async function sendMail(user: string, email: string, testo: string, type: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "file.ricevi2@gmail.com",
      pass: "qoxi ojqc kvon ouok",
    },
  });

  let subject: string;
  switch (type) {
    case "start":
      subject = 'Presa in carico della richiesta';
      break;
    case "end":
      subject = 'Analisi completata';
      break;
    case "error":
      subject = 'Errore durante l\'analisi';
      break;
    default:
      subject = 'Notifica';
  }

  const mailOptions = {
    from: "file.ricevi2@gmail.com",  
    to: email,       
    subject: subject,
    text: testo,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo');
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
  }
}

// Le altre funzioni rimangono invariate, ma ovunque usavamo `nomeUtente`, ora useremo `username` passato nel formData

async function createConfigFile(destinationDir: string, username: string): Promise<void> {
  const configContent = `
genome_size: 13m
fastq_directory:
  class: Directory
  path: /home/gforestello/${username}/input
nanopore: true
prefix: assembly
threads: 36
assembly_canu: canu
assembly_flye: flye
assembly_wtdbg2: wtdbg2
  `;

  const destPath = path.join(destinationDir, 'config.yml');
  await fs.writeFile(destPath, configContent.trim());
}

async function copyConfigFile(fileName: string, destinationDir: string): Promise<void> {
  const srcPath = path.join(process.cwd(), 'public', 'model', fileName);
  const destPath = path.join(destinationDir, fileName);
  await fs.copyFile(srcPath, destPath);
}

async function createStartScript(storageDir: string, analysisNameID: string, username: string): Promise<void> {
  const scriptContent = `
#!/bin/bash

# Creare la cartella di output se non esiste
mkdir -p "${username}/${analysisNameID}/output"

# Creare il file di log
echo "avviato in maniera corretta" > "${username}/${analysisNameID}/output/log.txt"

# Creare e attivare la virtual environment solo se non esiste
if [ ! -d "venv" ]; then
  python3 -m venv venv
  source venv/bin/activate
  pip install pandas
else
  source venv/bin/activate
fi

# Eseguire lo script Python
python3 "runPythonScript.py"

# Simulare un processo del workflow
sleep 10

# Aggiornare il file di log
echo "workflow completato" >> "${username}/${analysisNameID}/output/log.txt"
  `.trim();

  const scriptPath = path.join(storageDir, 'runWorkflow.sh');
  await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });
}

async function copyFilesToRemote(storageDir: string, remoteFolderName: string, username: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remotePath = `${username}/${remoteFolderName}`;

  const mkdirCommand = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'mkdir -p ${remotePath}'`;
  await executeWithRetry(mkdirCommand);

  const scpCommand = `scp -i /root/.ssh/id_rsa -r ${storageDir} ${remoteUser}@${remoteHost}:${remotePath}`;
  await executeWithRetry(scpCommand);
}

async function executeRemoteScript(analysisDir: string, remotePath: string, username: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remoteScriptPath = path.join(username, path.basename(analysisDir), 'input', 'runWorkflow.sh');

  const sshCommand = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'bash ${remoteScriptPath}'`;
  await executeWithRetry(sshCommand);
}

async function copyResultsBackToLocal(reportDir: string, localDirectory : string, username: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remoteOutputDir = `${username}/${reportDir}/output`;

  const scpCommand = `scp -i /root/.ssh/id_rsa -r ${remoteUser}@${remoteHost}:${remoteOutputDir} ${localDirectory}`;
  await executeWithRetry(scpCommand);
}

async function insertReportFiledb(outputDir: string, uniqueId: string, analysisNameID: string) {
  const reportPath = path.join(outputDir, 'log.txt');
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  const reportFile = { report_id: 0, analysis_id: analysisNameID, report_path: reportPath, expiration_date: expirationDate };
  await insertReportFile(reportFile);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentDateFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}
