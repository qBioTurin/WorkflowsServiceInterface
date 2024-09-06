"use client";
import { Card, Button, Group, Box, TextInput, Title, Progress, Text } from '@mantine/core';
import { IconFileAnalytics } from '@tabler/icons-react';
import React, { useState } from 'react';
import path from 'path';
import { submitAnalysis } from '../../../utils/upload/upload';
import FileInput from './FileInput';
import { accentColor, accentColorHover, accentDarkGreenColor, accentGreenColor } from '@/utils/color/color';

interface AnalysisFormProps {
  setUploadSuccess: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ setUploadSuccess }) => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [analysisName, setAnalysisName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    console.log('Resetting form fields.');
    setFile1(null);
    setFile2(null);
    setAnalysisName('');
    setUploadSuccess(null);
    setIsUploading(false);
    setError(null);
    setProgress(0);
  };

  const uploadFileInChunks = async (file: File, fieldName: string, totalChunksGlobal: number, currentChunkStart: number): Promise<any> => {
    const chunkSize = 50 * 1024 * 1024; // 50MB per chunk
    const totalChunks = Math.ceil(file.size / chunkSize); // Numero totale di chunk per il file corrente
    console.log(`Starting chunked upload for ${file.name} with size ${file.size} bytes and ${totalChunks} total chunks`);
  
    const maxRetries = 3;
    const delayBetweenRetries = 1000;
  
    for (let start = 0; start < file.size; start += chunkSize) {
      const chunk = file.slice(start, start + chunkSize);
      const chunkNumber = start / chunkSize; // Questo è il chunkNumber per il file corrente
      let attempts = 0;
      let success = false;
  
      while (attempts < maxRetries && !success) {
        try {
          const chunkFormData = new FormData();
          chunkFormData.append('analysisName', analysisName);
          chunkFormData.append(fieldName, chunk);
          chunkFormData.append('chunkNumber', String(chunkNumber)); // Numero di chunk relativo al file
          chunkFormData.append('totalChunks', String(totalChunks)); // Numero totale di chunk per questo file
          chunkFormData.append('fileName', file.name); // Nome del file
  
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: chunkFormData,
          });
  
          if (!response.ok) {
            throw new Error(`Failed to upload chunk ${chunkNumber}: HTTP error ${response.status}`);
          }
  
          const result = await response.json();
  
          if (!result.success) {
            throw new Error(`Failed to upload chunk ${chunkNumber}: ${result.error || "Unknown error"}`);
          }
  
          success = true;
  
          console.log(`Successfully uploaded chunk ${chunkNumber} for ${file.name}`);
  
          // Aggiorna il progresso globale
          const globalProgress = ((currentChunkStart + chunkNumber + 1) / totalChunksGlobal) * 100;
          setProgress(globalProgress);
  
          // Se il file è stato ricostruito, restituisci il risultato
          if (result.fileReconstructed) {
            return result;
          }
  
        } catch (error) {
          attempts++;
          console.error(`Attempt ${attempts} to upload chunk ${chunkNumber} failed. Error:`, error);
          if (attempts < maxRetries) {
            await new Promise(res => setTimeout(res, delayBetweenRetries));
          } else {
            throw error; // Propaga l'errore per gestirlo più avanti
          }
        }
      }
    }
  
    return { success: false, fileReconstructed: false };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    console.log('Form submitted with files');
  
    if (!analysisName.trim()) {
      console.warn('Analysis name is required.');
      alert('Please provide an analysis name.');
      return;
    }
  
    if (!file1 || !file2) {
      console.warn('Both files are required for upload.');
      alert('Please select both files.');
      return;
    }
  
    setIsUploading(true);
    setError(null);
  
    try {
      const totalChunksFile1 = Math.ceil(file1.size / (50 * 1024 * 1024)); // Chunk di 50MB
      const totalChunksFile2 = Math.ceil(file2.size / (50 * 1024 * 1024));
      const totalChunksGlobal = totalChunksFile1 + totalChunksFile2; // Somma dei chunk di entrambi i file
  
      // Carica il primo file
      const file1Result = await uploadFileInChunks(file1, 'file1', totalChunksGlobal, 0);
      // Carica il secondo file, con un inizio chunk aggiornato
      const file2Result = await uploadFileInChunks(file2, 'file2', totalChunksGlobal, totalChunksFile1);
  
      // Verifica se entrambi i file sono stati ricostruiti
      if (file1Result.fileReconstructed && file2Result.fileReconstructed) {
        console.log('Both files uploaded and reconstructed successfully.');
  
        const serverFormData = {
          analysisName,
          file1Path: path.join(process.cwd(), 'app', 'public', 'uploads', `${analysisName}`, `${file1.name}`),
          file2Path: path.join(process.cwd(), 'app', 'public', 'uploads', `${analysisName}`, `${file2.name}`),
        };
  
        submitAnalysis(serverFormData);
        setUploadSuccess(true);
      } else {
        setError('Error reconstructing files on the server.');
      }
    } catch (err: any) {
      console.error('Error during submission:', err);
      setError(`An error occurred during submission: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <>
      <Title order={1} mb="lg">New Analysis</Title>
      <Card withBorder shadow="sm" p="lg" radius="md" mb="lg" bg={accentDarkGreenColor}>
        {!isUploading ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextInput
              label="Analysis Name"
              placeholder="Enter the analysis name"
              leftSection={<IconFileAnalytics size={16} />}
              value={analysisName}
              onChange={(event) => setAnalysisName(event.currentTarget.value)}
              mb="md"
              styles={{
                input: {
                  backgroundColor: accentGreenColor,
                  color: 'white',
                },
                label: {
                  color: 'white',
                },
              }}
            />
            <Box my="md">
              <FileInput file={file1} setFile={setFile1} label="Upload File 1" />
            </Box>
            <Box my="md">
              <FileInput file={file2} setFile={setFile2} label="Upload File 2" />
            </Box>
            {error && (
              <Box my="md">
                <Text color="red">{error}</Text>
              </Box>
            )}
            <Group mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="default" onClick={handleReset} style={{ backgroundColor: accentColorHover, color: 'white' }}>Reset</Button>
              <Button variant="filled" type="submit" style={{ backgroundColor: accentColor, color: 'white' }}>Submit</Button>
            </Group>
          </form>
        ) : (
          <Box>
            <Text color="white">Uploading your files...</Text>
            <Progress value={progress} color={accentColor} mt="md" />
          </Box>
        )}
      </Card>
    </>
  );
};

export default AnalysisForm;
