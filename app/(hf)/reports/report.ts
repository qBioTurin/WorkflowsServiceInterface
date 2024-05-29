"use server";
import fs from 'fs';
import path from 'path';
import { Case } from '@/utils/models/case';

export const getReports = async (): Promise<Case[]> => {
  const reportsDir = path.join(process.cwd(), 'public', 'storage', 'utente1');
  const cases: Case[] = [];

  try {
    const reportDirs = fs.readdirSync(reportsDir);

    reportDirs.forEach((dir) => {
      const reportPath = path.join(reportsDir, dir);
      if (fs.lstatSync(reportPath).isDirectory()) {
        const pdfFiles = fs.readdirSync(path.join(reportPath, 'input')).filter((file) => file.endsWith('.pdf'));
        if (pdfFiles.length > 0) {
          const caseItem: Case = {
            id: dir,
            name: pdfFiles[0],
            creationDate: fs.statSync(reportPath).birthtime.toISOString().split('T')[0],
            status: 'Completed',
            downloadUrl: `/storage/utente1/${dir}/input/${pdfFiles[0]}`,
          };
          cases.push(caseItem);
        }
      }
    });
  } catch (error: any) {
    throw new Error('Failed to read reports');
  }

  return cases;
};
