"use client";

import { Container, Alert, Group, Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import AnalysisForm from '@/components/Upload/Form/AnalysisForm';
import { useRouter } from 'next/navigation';

export default function NewAnalysisPage() {
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const handleReset = () => setUploadSuccess(null);

  const handlePush = (path: string) => {
    router.push(path);
  };

  return (
    <Container size="sm" my={40}>
      {uploadSuccess === null && (
        <AnalysisForm setUploadSuccess={setUploadSuccess} />
      )}
      {uploadSuccess && (
        <>
        <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="lg">
          Upload successful. The analysis status will be visible in your personal area.
        </Alert>
        <Group>
          <Button variant="filled" onClick={() => handlePush('/reports')}>
            View Analysis
          </Button>
          <Button variant="default" onClick={handleReset}>
            Upload Another Analysis
          </Button>
        </Group>
      </>
      )}
    </Container>
  );
}
