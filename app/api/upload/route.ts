// pages/api/upload.ts
"use server"
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

import { NextRequest, NextResponse } from 'next/server';

function calculateExpirationDate(currentDate: Date): string {
  const expirationDate = new Date(currentDate);
  expirationDate.setDate(currentDate.getDate() + 7); // Aggiunge 7 giorni alla data corrente

  // Converte la data di scadenza nel formato desiderato 'GG/MM/AAAA'
  const day = expirationDate.getDate().toString().padStart(2, '0'); // Aggiunge uno zero davanti se il giorno è meno di 10
  const month = (expirationDate.getMonth() + 1).toString().padStart(2, '0'); // Aggiunge uno zero davanti se il mese è meno di 10
  const year = expirationDate.getFullYear();

  return `${day}/${month}/${year}`;
}

/*async function scheduleFolderDeletion(folderPath : string, seconds : number, uniqueId: string) {
  const futureDate = new Date(Date.now() + seconds * 1000);
  const futureDateString = futureDate.toISOString();

  const psCommand = `& {$trigger = New-JobTrigger -Once -At '${futureDateString}'; ` +
                    `Register-ScheduledJob -Name "DeleteFolder_${uniqueId}" -ScriptBlock { ` +
                    `Remove-Item -Path '${folderPath.replace(/'/g, "''")}' -Recurse -Force } -Trigger $trigger}`;

  try {
    const { stdout, stderr } = await execAsync(`powershell.exe -Command "${psCommand}"`);
    console.log(stdout);
    if (stderr) {
      console.error(`Errore stderr durante la creazione dello Scheduled Job: ${stderr}`);
    } else {
      console.log(`Scheduled Job creato con successo per eliminare la cartella '${folderPath}' alle '${futureDateString}'.`);
    }
  } catch (error) {
    console.error(`Errore durante la creazione dello Scheduled Job: ${error}`);
  }
}*/

//questa funzione utilizza i cronjob al momento. Per il momento non è ancora stato possibile testarla
async function scheduleFolderDeletion(folderPath: string, minutes: number) {
  // Crea un nome univoco per lo script di eliminazione per evitare conflitti
  const scriptName = `deleteFolder_${new Date().getTime()}.sh`;
  const scriptPath = `/tmp/${scriptName}`; // Usa /tmp come directory per lo script temporaneo
  const deleteScriptContent = `#!/bin/bash\nrm -rf "${folderPath}"\n`;

  // Crea e rendi eseguibile lo script di eliminazione
  await fs.writeFile(scriptPath, deleteScriptContent);
  await fs.chmod(scriptPath, '0755');

  // Calcola il tempo per l'esecuzione del cron job
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1; // I mesi in cron vanno da 1 a 12

  // Comando cron per eseguire lo script di eliminazione
  const cronCommand = `${minute} ${hour} ${day} ${month} * /bin/bash ${scriptPath}`;

  // Aggiunge il cron job alla crontab dell'utente
  const cronJobCommand = `(crontab -l 2>/dev/null; echo "${cronCommand}") | crontab -`;

  try {
    const { stdout, stderr } = await execAsync(cronJobCommand);
    if (stderr) {
      throw new Error(`Errore stderr durante l'aggiunta del cron job: ${stderr}`);
    }
    console.log(`Cron job creato con successo per eliminare la cartella '${folderPath}' in ${minutes} minuti.`);
  } catch (error) {
    console.error(`Errore durante la creazione del cron job: ${error}`);
  }
}


function getCurrentDateFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Aggiunge uno zero se il giorno è meno di 10
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Aggiunge uno zero se il mese è meno di 10
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}

async function cleanUpInputDirectory(directoryPath: string): Promise<void> {
  try {
    // Rimuove la directory e tutto il suo contenuto
    await fs.rm(directoryPath, { recursive: true, force: true });
    console.log(`La directory '${directoryPath}' è stata rimossa con successo.`);
  } catch (error) {
    console.error(`Errore durante la rimozione della directory '${directoryPath}':`, error);
  }
}

async function saveUploadedFile(data : FormData, formName : string,storageDir : string): Promise<{ success: boolean }>{
  const file : File | null  = data.get(formName) as unknown as File;
  if(file){
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(storageDir, file.name);
    await fs.writeFile(filePath, buffer);
    return { success: true };
  }else{
    return { success: false };
  }
}

async function copyStreamFlowFile(outputPath: string){
  const sourceFilePath = path.join(process.cwd(), 'public', 'model', 'streamFlow.yml');

  const destinationFilePath = path.join(outputPath, 'streamFlow.yml');
  await fs.copyFile(sourceFilePath, destinationFilePath);
  return NextResponse.json({ success: true });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest, res: NextResponse) {


  let errorStatus : boolean = false;
  const data = await req.formData();
  const uniqueId = uuidv4();

  //parte dove vengono ottenuti dati dal form
  const analisysName : string | null = data.get('analysisName') as unknown as string;

  const analysisName = data.get('analysisName');
  const analisysDir = path.join(process.cwd(), 'public', 'storage', 'utente1',analisysName +'-' +getCurrentDateFormatted() +'-' +uniqueId);
  const storageDir = path.join(analisysDir, 'input' );

  await fs.mkdir(storageDir, { recursive: true });

  let uploadSuccess = true;
  uploadSuccess = uploadSuccess && (await  saveUploadedFile(data,"file1",storageDir)).success;
  uploadSuccess = uploadSuccess && (await saveUploadedFile(data,"file2",storageDir)).success;
  if(!uploadSuccess){
    return NextResponse.json({ success: false });
  }

  //creazione file di config
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
  copyStreamFlowFile(storageDir);


  //Parte relativa alla creazione della directory del 
  const reportDir = path.join(analisysDir, 'output');
  await fs.mkdir(reportDir, { recursive: true });

  
  //parte relativa all'inizio del workflow sostituita con un ping
  //'streamflow run --outdir ' +reportDir +' streamflow.yml'
  exec('curl http://127.0.0.1:3001/ping', async (error, stdout, stderr) => {
    if (error) {

      const errorReportPath = path.join(reportDir, 'error-'+uniqueId +'.report');
      await fs.writeFile(errorReportPath, `${error}`);
      errorStatus = true;

    }else if (stderr) {

      const errorReportPath = path.join(reportDir, 'error-'+uniqueId +'.report');
      await fs.writeFile(errorReportPath, `${stderr}`);
      errorStatus = true;

    }else{

      console.log(`Risultati del ping: ${stdout}`);
      const outputReportPath = path.join(reportDir, 'output-'+uniqueId +'.report');
      await fs.writeFile(outputReportPath, `Risultati del ping: ${stdout}`);
      errorStatus = false;

    }

    //creo il file metadata
    const metadataPath = path.join(reportDir, 'metadata-workflow-'+uniqueId +'.report');
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

    return NextResponse.json({ success: true });

  });

  return NextResponse.json({ success: true });
}
