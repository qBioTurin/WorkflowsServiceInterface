"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Table, Button, Group, Text, Box, Pagination, TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconFilter } from '@tabler/icons-react';
import { getReports } from './report';

interface Case {
  id: string;
  name: string;
  creationDate: string;
  status: 'Pending' | 'Completed';
  downloadUrl: string;
}

export default function HomePage() {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getReports();
        setCases(data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      }
    };

    fetchCases();
  }, []);

  const handleDownload = async (caseId: string, filename: string) => {
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caseId, filename }),
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const icon = <IconSearch style={{ width: '16 rem', height: '16 rem' }} />;
  return (
    <>
      <Container mt="50">
        <Box mb="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: '1.5rem', fontWeight: 500 }}>Your reports</Text>
          <Group>
            <TextInput leftSection={icon} placeholder="Search reports" />
            <Button><IconFilter size={18} />Filters</Button>
            <Link href="/upload" passHref>
              <Button ><IconPlus size={18} />Add Analysis</Button>
            </Link>
          </Group>
        </Box>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data di Creazione</th>
              <th>Stato</th>
              <th>Dettagli</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td>{caseItem.name}</td>
                <td>{caseItem.creationDate}</td>
                <td>
                  <Text color={caseItem.status === 'Completed' ? 'green' : 'orange'}>
                    {caseItem.status}
                  </Text>
                </td>
                <td>
                  {caseItem.status === 'Completed' ? (
                    <Button onClick={() => handleDownload(caseItem.id, caseItem.name)}>
                      Scarica resoconto
                    </Button>
                  ) : (
                    <Text color="gray">In attesa</Text>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Box mt="md" style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination total={10} /* Pagina corrente */ onChange={() => {}} />
        </Box>
      </Container>
    </>
  );
}
