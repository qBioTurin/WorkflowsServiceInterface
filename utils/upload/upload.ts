"use server";
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { exec } from 'child_process';
import logger from '@/utils/logger/logger';  // Importa il logger
import { insertAnalysis, insertReportFile } from '@/utils/database/Analysis';

type FormData = {
  analysisName: string;
  file1Path?: string;
  file2Path?: string;
  link1?: string;
  link2?: string;
};

type ApiResponse = {
  success: boolean;
  error?: string;
};

// Funzione per eseguire i comandi con meccanismo di retry
async function executeWithRetry(command: string, maxRetries = 3, delayMs = 2000): Promise<void> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      await executeCommand(command);
      return; // Esce dalla funzione se il comando ha successo
    } catch (error : any) {
      attempts++;
      if (attempts >= maxRetries) {
        throw new Error(`Failed to execute command after ${maxRetries} attempts: ${error.message}`);
      } else {
        console.warn(`Retrying command (${attempts}/${maxRetries})...`);
        await sleep(delayMs); // Attende un breve periodo prima di riprovare
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
  try {
    logger.info(`Messaggio chiaro di corretta chiamata`);

    if (!formData.analysisName || 
        (!formData.file1Path && !formData.link1) || 
        (!formData.file2Path && !formData.link2)) {
      logger.error('Missing files or analysis name');
      throw new Error('Missing files or analysis name');
    }
    const uniqueId = uuidv4();  
    const nomeUtente = "utente1";
    const analysisName = formData.analysisName;
    const analysisNameID = `${analysisName}-${getCurrentDateFormatted()}-${uniqueId}`;
    try{
      asyncUpload(formData,analysisNameID,nomeUtente,uniqueId);
      return { success: true };
    }catch(err:any){
      sendMail(nomeUtente, `L'analisi con ID ${analysisNameID} è stata completata con successo.`);
      return { success: false, error: err.message };
    }
  } catch (error: any) {
    
    logger.error("Error in submitAnalysis:", error);
    return { success: false, error: error.message };
  }
}

async function asyncUpload(formData: FormData,analysisNameID:string,nomeUtente:string,uniqueId:string){
  
  const analysisName = formData.analysisName;
  const analysisDir = path.join(process.cwd(), 'public', 'storage', nomeUtente, `${analysisNameID}`);
  const storageDir = path.join(analysisDir, 'input');
  const outputDir = path.join(analysisDir, 'output');

  await fs.mkdir(storageDir, { recursive: true });
  logger.info(`Created storage directory at ${storageDir}`);

  if (formData.file1Path && formData.file2Path) {
    await fs.copyFile(formData.file1Path, path.join(storageDir, path.basename(formData.file1Path)));
    await fs.copyFile(formData.file2Path, path.join(storageDir, path.basename(formData.file2Path)));
    logger.info('Files copied to storage directory.');
  } else if (formData.link1 && formData.link2) {
    logger.info("Downloading files from links:", formData.link1, formData.link2);
    await downloadFile(formData.link1, path.join(storageDir, 'file1'));
    await downloadFile(formData.link2, path.join(storageDir, 'file2'));
  } else {
    logger.error('Neither files nor links provided');
    throw new Error('Neither files nor links provided');
  }

  await createConfigFile(storageDir, nomeUtente);
  await copyConfigFile('streamflow.yml', storageDir);

  await createStartScript(storageDir, analysisNameID, nomeUtente);
  await fs.mkdir(outputDir, { recursive: true });

  logger.info('Copying files to remote server.');
  await copyFilesToRemote(storageDir, analysisNameID, nomeUtente);

  logger.info('Inserting analysis record in the database.');
  await insertAnalysisdb(analysisNameID, analysisName);

  logger.info('Executing remote script.');
  await executeRemoteScript(analysisDir, analysisNameID, nomeUtente);

  logger.info('Copying results back to local machine.');
  await copyResultsBackToLocal(analysisNameID, analysisDir, nomeUtente);

  logger.info('Inserting report file record in the database.');
  await insertReportFiledb(outputDir, uniqueId, analysisNameID);

  logger.info("Analysis processing completed.");

  waitSleep();

  sendMail(nomeUtente, `L'analisi con ID ${analysisNameID} è stata completata con successo.`);
}

// Funzioni ausiliarie con log aggiunti
async function downloadFile(url: string, dest: string): Promise<void> {
  logger.info(`Starting download from ${url} to ${dest}`);
  return new Promise((resolve, reject) => {
    const command = `wget --no-check-certificate -O ${dest} ${url}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error downloading file from ${url}: ${stderr}`);
        reject(new Error(`Error downloading file: ${error.message}, ${stderr}`));
      } else {
        logger.info(`Successfully downloaded file from ${url}`);
        resolve();
      }
    });
  });
}

// Le altre funzioni restano le stesse, ma aggiungi log come mostrato sopra se necessario.

async function insertAnalysisdb(analysisNameID: string, analysisName: string) {
  const userId = 1; 
  const creationTimestamp = new Date();
  const analysis = { analysis_id: analysisNameID, analysis_name: analysisName, user_id: userId, creation_timestamp: creationTimestamp, status: 'Pending' };
  await insertAnalysis(analysis);
}

async function sendMail(user: string, testo: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "",
      pass: "",
    },
  });

  const mailOptions = {
    from: "",     //mail mittente
    to: '', //mail ricevente
    subject: 'Analisi completata',
    text: testo,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo');
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
  }
}

async function insertReportFiledb(outputDir: string, uniqueId: string, analysisNameID: string) {
  const reportPath = path.join(outputDir, 'log.txt');
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  const reportFile = { report_id: 0, analysis_id: analysisNameID, report_path: reportPath, expiration_date: expirationDate };
  await insertReportFile(reportFile);
}

async function copyConfigFile(fileName: string, destinationDir: string): Promise<void> {
  const srcPath = path.join(process.cwd(), 'public', 'model', fileName);
  const destPath = path.join(destinationDir, fileName);
  await fs.copyFile(srcPath, destPath);
}

async function removeLocalDirectory(localPath: string): Promise<void> {
  await fs.rm(localPath, { recursive: true, force: true });
}

async function createStartScript(storageDir: string, analysisNameID: string, nomeUtente: string): Promise<void> {
  const scriptContent = `
#!/bin/bash

# Creare la cartella di output se non esiste
mkdir -p "${nomeUtente}/${analysisNameID}/output"

# Creare il file di log
echo "avviato in maniera corretta" > "${nomeUtente}/${analysisNameID}/output/log.txt"

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
echo "workflow completato" >> "${nomeUtente}/${analysisNameID}/output/log.txt"
  `.trim();

  const scriptPath = path.join(storageDir, 'runWorkflow.sh');
  await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });
}

async function createPythonScript(storageDir: string): Promise<void> {
  const scriptContent = `
import os
import requests

response = requests.get('https://jsonplaceholder.typicode.com/todos/1')
if response.status_code == 200:
    script_dir = os.path.dirname(__file__)
    dump_file_path = os.path.join(script_dir, 'data_dump.txt')
    with open(dump_file_path, 'w') as file:
        file.write(response.text)
    log_file_path = os.path.join(script_dir, '..', 'output', 'log.txt')
    with open(log_file_path, 'a') as log_file:
        log_file.write("\\nRichiesta HTTP completata con successo e file di dump creato")
else:
    log_file_path = os.path.join(script_dir, '..', 'output', 'log.txt')
    with open(log_file_path, 'a') as log_file:
        log_file.write("\\nErrore nella richiesta HTTP")
  `.trim();

  const scriptPath = path.join(storageDir, 'runPythonScript.py');
  await fs.writeFile(scriptPath, scriptContent);
}

async function createConfigFile(destinationDir: string, userName: string): Promise<void> {
  const configContent = `
genome_size: 13m
fastq_directory:
  class: Directory
  path: /home/gforestello/${userName}/input
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

async function copyFilesToRemote(storageDir: string, remoteFolderName: string, nomeUtente: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remotePath = `${nomeUtente}/${remoteFolderName}`;

  const mkdirCommand = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'mkdir -p ${remotePath}'`;
  await executeWithRetry(mkdirCommand);

  const scpCommand = `scp -i /root/.ssh/id_rsa -r ${storageDir} ${remoteUser}@${remoteHost}:${remotePath}`;
  await executeWithRetry(scpCommand);
}

async function executeRemoteScript(analysisDir: string, remotePath: string, nomeUtente: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remoteScriptPath = path.join(nomeUtente, path.basename(analysisDir), 'input', 'runWorkflow.sh');

  const sshCommand = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'bash ${remoteScriptPath}'`;
  await executeWithRetry(sshCommand);
}

async function copyResultsBackToLocal(reportDir: string, localDirectory : string, nomeUtente: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const remoteOutputDir = `${nomeUtente}/${reportDir}/output`;

  const scpCommand = `scp -i /root/.ssh/id_rsa -r ${remoteUser}@${remoteHost}:${remoteOutputDir} ${localDirectory}`;
  await executeWithRetry(scpCommand);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitSleep(){
  await sleep(10000);
  console.log("postsleep");
}

async function removeRemoteDirectory(remotePath: string): Promise<void> {
  const remoteUser = 'gforestello';
  const remoteHost = '130.192.212.55';
  const removeCommand = `ssh -i /root/.ssh/id_rsa ${remoteUser}@${remoteHost} 'rm -rf ${remotePath}'`;

  await executeWithRetry(removeCommand);
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
