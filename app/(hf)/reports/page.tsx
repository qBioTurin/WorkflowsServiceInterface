"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Table, Button, Group, Text, Box, Pagination, TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconFilter } from '@tabler/icons-react';
import useDownloader from 'react-use-downloader';
import { getReports } from './report';

interface Case {
  id: string;
  name: string;
  creationDate: string;
  status: 'Pending' | 'Completed';
  downloadUrl: string;
}

export default function HomePage() {
  const { size, elapsed, percentage, download, cancel, error, isInProgress } = useDownloader();
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

  const handleDownload = (url: string, filename: string) => {
    download(url, filename);
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
                    <Button onClick={() => handleDownload(caseItem.downloadUrl, caseItem.name)}>
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
