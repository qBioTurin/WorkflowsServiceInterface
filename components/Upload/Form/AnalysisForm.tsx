"use client";
import { Card, Button, Group, Box, TextInput, Title } from '@mantine/core';
import { IconFileAnalytics } from '@tabler/icons-react';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { submitAnalysis } from './upload';
import FileInput from './FileInput';

interface AnalysisFormProps {
  setUploadSuccess: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ setUploadSuccess }) => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [analysisName, setAnalysisName] = useState('');

  const handleReset = () => {
    setFile1(null);
    setFile2(null);
    setAnalysisName('');
    setUploadSuccess(null);
  };

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

    const result = await submitAnalysis(formData);

    if (result.success) {
      setUploadSuccess(true);
    } else {
      console.error('Error uploading files:', result.error);
    }
  };

  return (
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
        <Box my="md">
          <FileInput file={file1} setFile={setFile1} label="Upload File 1" />
        </Box>
        <Box my="md">
          <FileInput file={file2} setFile={setFile2} label="Upload File 2" />
        </Box>
        <Group mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="default" onClick={handleReset}>Reset</Button>
          <Button variant="filled" onClick={handleSubmit}>Submit</Button>
        </Group>
      </Card>
    </>
  );
};

export default AnalysisForm;
