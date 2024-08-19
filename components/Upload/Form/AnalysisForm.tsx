"use client";
import { Card, Button, Group, Box, TextInput, Title, Progress, Text, RadioGroup, Radio } from '@mantine/core';
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
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [analysisName, setAnalysisName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    console.log('Resetting form fields.');
    setFile1(null);
    setFile2(null);
    setLink1('');
    setLink2('');
    setAnalysisName('');
    setUploadSuccess(null);
    setIsUploading(false);
    setError(null);
    setProgress(0);
  };

  const uploadFileInChunks = async (file: File, fieldName: string): Promise<any> => {
    const chunkSize = 10 * 1024 * 1024; // 10MB per chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    console.log(`Starting chunked upload for ${file.name} with size ${file.size} bytes and ${totalChunks} total chunks`);
  
    const maxRetries = 3;
    const delayBetweenRetries = 1000;
  
    for (let start = 0; start < file.size; start += chunkSize) {
      const chunk = file.slice(start, start + chunkSize);
      const chunkNumber = start / chunkSize;
      let attempts = 0;
      let success = false;
  
      while (attempts < maxRetries && !success) {
        try {
          const chunkFormData = new FormData();
          chunkFormData.append('analysisName', analysisName);
          chunkFormData.append(fieldName, chunk);
          chunkFormData.append('chunkNumber', String(chunkNumber));
          chunkFormData.append('totalChunks', String(totalChunks));
          chunkFormData.append('fileName', file.name);
  
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
  
          // Aggiorna la barra di progresso
          setProgress(((chunkNumber + 1) / totalChunks) * 100);
  
          if (result.fileReconstructed) {
            return result; // Restituisce l'intero risultato JSON
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
  
  

  // Modifica nella funzione handleSubmit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    console.log('Form submitted with method:', uploadMethod);
  
    if (!analysisName.trim()) {
      console.warn('Analysis name is required.');
      alert('Please provide an analysis name.');
      return;
    }
  
    if (uploadMethod === 'file' && (!file1 || !file2)) {
      console.warn('Both files are required for upload.');
      alert('Please select both files.');
      return;
    }
  
    if (uploadMethod === 'link' && (!link1.trim() || !link2.trim())) {
      console.warn('Both links are required.');
      alert('Please provide both links.');
      return;
    }
  
    setIsUploading(true);
    setError(null);
  
    try {
      let serverFormData;
  
      if (uploadMethod === 'file' && file1 && file2) {
        const file1Result = await uploadFileInChunks(file1 as File, 'file1');
        const file2Result = await uploadFileInChunks(file2 as File, 'file2');
        console.log("what the sigma"+file1Result.fileReconstructed+ file2Result.fileReconstructed)
        if (file1Result.fileReconstructed /*&& file2Result.fileReconstructed*/) {
          console.log('All file chunks uploaded and reconstructed successfully.');
  
          serverFormData = {
            analysisName,
            file1Path: path.join(process.cwd(), 'app', 'public', 'uploads', `${analysisName}`, `${file1.name}`),
            file2Path: path.join(process.cwd(), 'app', 'public', 'uploads', `${analysisName}`, `${file2.name}`),
          };
  
          await submitAnalysis(serverFormData);
          setUploadSuccess(true);
        } else {
          setError('Error reconstructing files on the server.');
        }
      } else {
        const formData = new FormData();
        formData.append('analysisName', analysisName);
        formData.append('link1', link1);
        formData.append('link2', link2);
  
        console.log('Uploading via links:', { link1, link2 });
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        const result = await response.json();
  
        if (!result.success) {
          throw new Error(`Error uploading files: ${result.error}`);
        }
  
        console.log('Files uploaded successfully via links.');
  
        serverFormData = {
          analysisName,
          file1Path: result.file1Path,
          file2Path: result.file2Path,
        };
  
        await submitAnalysis(serverFormData);
        setUploadSuccess(true);
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
            <RadioGroup
              label="Upload Method"
              value={uploadMethod}
              onChange={setUploadMethod}
              mb="md"
              styles={{
                label: {
                  color: 'white',
                },
              }}
            >
              <Radio value="file" label="Upload Files" />
              <Radio value="link" label="Provide Links" />
            </RadioGroup>
            {uploadMethod === 'file' ? (
              <>
                <Box my="md">
                  <FileInput file={file1} setFile={setFile1} label="Upload File 1" />
                </Box>
                <Box my="md">
                  <FileInput file={file2} setFile={setFile2} label="Upload File 2" />
                </Box>
              </>
            ) : (
              <>
                <TextInput
                  label="Link 1"
                  placeholder="Enter the first file link"
                  value={link1}
                  onChange={(event) => setLink1(event.currentTarget.value)}
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
                <TextInput
                  label="Link 2"
                  placeholder="Enter the second file link"
                  value={link2}
                  onChange={(event) => setLink2(event.currentTarget.value)}
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
              </>
            )}
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
