"use client";

import { Container } from '@mantine/core';
import { useState } from 'react';
import AnalysisForm from '@/components/Upload/Form/AnalysisForm';
import SuccessAlert from '@/components/Upload/UploadSuccess/SuccessAlert';

export default function NewAnalysisPage() {
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);

  return (
    <Container size="sm" my={40}>
      {uploadSuccess === null && (
        <AnalysisForm setUploadSuccess={setUploadSuccess} />
      )}
      {uploadSuccess && (
        <SuccessAlert handleReset={() => setUploadSuccess(null)} />
      )}
    </Container>
  );
}
