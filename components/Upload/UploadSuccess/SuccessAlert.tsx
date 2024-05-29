"use client"
import { Alert, Group, Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface SuccessAlertProps {
  handleReset: () => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({  handleReset }) => {

  const router = useRouter();

  const handlePush = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Alert icon={<IconCheck size={16} />} title="Success!" color="green" mb="lg">
        Upload successful. The analysis status will be visible in your personal area.
      </Alert>
      <Group>
        <Button variant="filled" onClick={() => handlePush('/reports')}>View Analysis</Button>
        <Button variant="default" onClick={handleReset}>Upload Another Analysis</Button>
      </Group>
    </>
  );
};

export default SuccessAlert;
