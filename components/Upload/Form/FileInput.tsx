"use client";
import { Box, Button, Group, Text, Tooltip } from '@mantine/core';
import { IconUpload, IconX, IconInfoCircle } from '@tabler/icons-react';
import React from 'react';
import { accentColor } from '@/utils/color/color';

interface FileInputProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  label: string;
}

const FileInput: React.FC<FileInputProps> = ({ file, setFile, label }) => (
  <Box>
    {file ? (
      <Group ml="md">
        <Text style={{ color: 'white' }}>{file.name}</Text>
        <IconX size={16} stroke={1.5} style={{ cursor: 'pointer', color:'white' }} onClick={() => setFile(null)} />
      </Group>
    ) : (
      <>
        <input
          type="file"
          id={`file-upload-${label}`}
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <label htmlFor={`file-upload-${label}`}>
          <Button component="span" leftSection={<IconUpload size={16} />} bg={accentColor} style={{ color: 'white' }}>
            Browse
          </Button>
          <span style={{ color: 'white', marginLeft: 10 }}>{label}</span>
        </label>
        <Tooltip label="Supports all types of files" position="right">
          <IconInfoCircle size={16} style={{ cursor: 'help', marginLeft: 10, color: 'white' }} />
        </Tooltip>
      </>
    )}
  </Box>
);

export default FileInput;
