"use server";
import fs from 'fs';
import path from 'path';

interface Case {
  id: string;
  name: string;
  creationDate: string;
  status: 'Pending' | 'Completed';
  downloadUrl: string;
}

export const getReports = async (): Promise<Case[]> => {
  const reportsDir = path.join(process.cwd(), 'public', 'storage', 'utente1');
  const cases: Case[] = [];

  try {
    const reportDirs = fs.readdirSync(reportsDir);

    reportDirs.forEach((dir) => {
      const reportPath = path.join(reportsDir, dir);
      if (fs.lstatSync(reportPath).isDirectory()) {
        const inputDir = path.join(reportPath, 'input');
        const files = fs.readdirSync(inputDir);
        if (files.length > 0) {
          files.forEach((file) => {
            const caseItem: Case = {
              id: dir,
              name: file,
              creationDate: fs.statSync(reportPath).birthtime.toISOString().split('T')[0],
              status: 'Completed',
              downloadUrl: '', // URL del server di download, lasciato vuoto
            };
            cases.push(caseItem);
          });
        }
      }
    });
  } catch (error: any) {
    throw new Error('Failed to read reports');
  }

  return cases;
};

export const downloadReport = async (caseId: string, filename: string): Promise<Blob> => {
  const response = await fetch(`http://download-server:3001/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ caseId, filename }),
  });

  if (!response.ok) {
    throw new Error('Failed to download file');
  }

  const blob = await response.blob();
  return blob;
};
