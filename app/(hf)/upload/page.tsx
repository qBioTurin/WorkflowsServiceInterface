"use client"
import { Container, Title, Card, Button, Group, Box, TextInput, Text, Tooltip, Alert } from '@mantine/core';
import { IconUpload, IconX, IconFileAnalytics, IconInfoCircle, IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


import { v4 as uuidv4 } from 'uuid'; // Importa uuid per generare un ID univoco



export default function NewAnalysisPage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [analysisName, setAnalysisName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const handleReset = () => {
    setFile1(null);
    setFile2(null);
    setAnalysisName('');
    setUploadSuccess(null); // Resetta anche lo stato di successo
  };

  const handlePush = (path: string) => {
    router.push(path);
  }

  const handleSubmit = async () => {
    if (!file1 || !file2 || !analysisName.trim()) {
      alert('Please provide an analysis name and select both files.');
      return;
    }
  
    const formData = new FormData();
    formData.append('analysisName', analysisName);
    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('id', uuidv4());
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const fileInput = (file: File | null, setFile: React.Dispatch<React.SetStateAction<File | null>>, label: string) => (
    <Box>
    {file ? (
      <Group ml="md">
        <Text>{file.name}</Text>
        <IconX size={16} stroke={1.5} style={{ cursor: 'pointer' }} onClick={() => setFile(null)} />
      </Group>
    ) : (
      <>
        <input
          type="file"
          id={`file-upload-${label}`}
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          accept=".pdf, .csv"
        />
        <label htmlFor={`file-upload-${label}`}>
          <Button component="span" leftSection={<IconUpload size={16} />}>
            Browse
          </Button>
          {label}
        </label>
        <Tooltip
          label="Supports .pdf and .csv files up to 5MB."
          position="right"
        >
          <IconInfoCircle size={16} style={{ cursor: 'help', marginLeft: 10 }} />
        </Tooltip>
      </>
    )}
  </Box>
  );

  return (
    
      
        <Container size="sm" my={40}>
          {uploadSuccess === null && (
            <>
            <Title order={1} mb="lg">New Analysis</Title>
            <Card withBorder shadow="sm" p="lg" radius="md" mb="lg">
              <TextInput
                label="Analysis Name"
                placeholder="Enter the analysis name"
                leftSection={<IconFileAnalytics size={16} />}
                value={analysisName}
                onChange={(event) => setAnalysisName(event.currentTarget.value)}
                mb="md"
              />
              <Box my="md">{fileInput(file1, setFile1, 'Upload File 1')}</Box>
              <Box my="md">{fileInput(file2, setFile2, 'Upload File 2')}</Box>
              <Group mt="md">
                <Button variant="default" onClick={handleReset}>Reset</Button>
                <Button variant="filled" onClick={handleSubmit}>Submit</Button>
              </Group>
            </Card>
            </>
          )}
            {uploadSuccess && (
          <>
            <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="lg">
              Upload avvenuto con successo, lo stato dell'analisi sarà visibile nella sua area personale.
            </Alert>
            <Group>
              <Button variant="filled" onClick={() => handlePush('/reports')}>View Analysis</Button>
              <Button variant="default" onClick={handleReset}>Upload Another Analysis</Button>
            </Group>
          </>
        )}
        </Container>
  );
}
