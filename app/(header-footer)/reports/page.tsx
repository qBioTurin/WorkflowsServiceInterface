"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Table, Button, Group, Text, Box, Pagination, TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconFilter } from '@tabler/icons-react';
import { getReports } from '../../../utils/report/report';
import { getAnalysesByUserId } from '@/utils/database/Analysis';
import { accentColor, accentColorHover, accentDarkGreenColor, accentGreenColor } from '@/utils/color/color';
import {Case} from '@/utils/models/case';

export default function HomePage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const userId = 1; // ID utente appropriato
        const offset = (page - 1) * itemsPerPage;
        const { analyses, total } = await getAnalysesByUserId(userId, itemsPerPage, offset, search);
        setCases(analyses.map(analysis => ({
          id: analysis.analysis_id,
          name: analysis.analysis_name,
          creationDate: new Date(analysis.creation_timestamp).toISOString().split('T')[0],
          status: analysis.status as 'Pending' | 'Completed' | 'Expired', // Casting dello stato
          downloadUrl: '' // URL del server di download, lasciato vuoto
        })));
        setTotal(total);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      }
    };

    fetchCases();
  }, [page, search]);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  return (
    <Container mt="50">
      <Box mb="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: '1.5rem', fontWeight: 500 }}>Your reports</Text>
        <Group>
          <TextInput leftSection={<IconSearch />} placeholder="Search reports" value={search} onChange={handleSearchChange} />
          <Button style={{ backgroundColor: accentColor, color: 'white' }}><IconFilter size={18} style={{ backgroundColor: accentColor, color: 'white' }}/>Filters</Button>
          <Link href="/upload" passHref>
            <Button style={{ backgroundColor: accentColor, color: 'white' }}><IconPlus size={18} style={{ backgroundColor: accentColor, color: 'white' }}/>Add Analysis</Button>
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
                <Text color={caseItem.status === 'Completed' ? 'green' : caseItem.status === 'Expired' ? 'red' : 'orange'}>
                  {caseItem.status}
                </Text>
              </td>
              <td>
                {caseItem.status === 'Completed' ? (
                  <Button onClick={() => handleDownload(caseItem.id, caseItem.name)} style={{ backgroundColor: accentColor, color: 'white' }}>
                    Scarica resoconto
                  </Button>
                ) : (
                  <Text color="gray">{caseItem.status === 'Expired' ? 'Scaduto' : 'In attesa'}</Text>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Box mt="md" style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination total={Math.ceil(total / itemsPerPage)} value={page} onChange={setPage} />
      </Box>
    </Container>
  );
}