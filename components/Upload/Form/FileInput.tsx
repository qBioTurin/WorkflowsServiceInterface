"use client";
import { Box, Button, Group, Text, Tooltip } from '@mantine/core';
import { IconUpload, IconX, IconInfoCircle } from '@tabler/icons-react';
import React from 'react';

interface FileInputProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  label: string;
}

const FileInput: React.FC<FileInputProps> = ({ file, setFile, label }) => (
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
        <Tooltip label="Supports .pdf and .csv files up to 5MB." position="right">
          <IconInfoCircle size={16} style={{ cursor: 'help', marginLeft: 10 }} />
        </Tooltip>
      </>
    )}
  </Box>
);

export default FileInput;
