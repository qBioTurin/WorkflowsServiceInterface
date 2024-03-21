"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Table, Button, Group, Text ,Box,Pagination,TextInput} from '@mantine/core';
import { IconPlus,IconSearch,IconFilter } from '@tabler/icons-react';
import styles from './Reports.module.css'; // Importa il file CSS
import useDownloader from 'react-use-downloader';
// Tipo di dato per rappresentare un caso
interface Case {
    id: string;
    name: string;
    creationDate: string;
    status: 'Pending' | 'Completed';
  }
  
  const staticCases: Case[] = [
    { id: '1', name: '01b-Class.pdf', creationDate: '2023-01-01', status: 'Completed' },
    { id: '2', name: 'Caso 2', creationDate: '2023-02-15', status: 'Completed' },
    // Aggiungi altri casi qui
    { id: '3', name: 'Caso 3', creationDate: '2023-03-10', status: 'Completed' },
    { id: '4', name: 'Caso 4', creationDate: '2023-04-05', status: 'Pending' },
  ];

  export default function HomePage() {
    const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
    const router = useRouter();
    const [cases, setCases] = useState<Case[]>([]);

  
    useEffect(() => {
      setCases(staticCases);
    }, []);
  
    const handleDetailsClick = (caseId: string) => {
      router.push(`/case/${caseId}`);
    };
    
    const handleAddAnalysis = () => {
        router.push("/upload")
      };

      const handleDownload = (url: string, filename: string) => {
        download(url, filename); // Usa la funzione di download qui
      };
    

    
    const icon = <IconSearch style={{ width: '16 rem', height: '16 rem' }} />;
    return (
      <>
        <Container>
        <Box mb="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: '1.5rem', fontWeight: 500 }}>Your reports</Text>
          <Group>
            <TextInput leftSection={icon} placeholder="Search reports" />
            <Button ><IconFilter size={18} />Filters</Button>
            <Button onClick={handleAddAnalysis}> <IconPlus size={18} />Add Analysis</Button>
          </Group>
        </Box>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Nome</th>
                <th className={styles.tableHeader}>Data di Creazione</th>
                <th className={styles.tableHeader}>Stato</th>
                <th className={styles.tableHeader}>Dettagli</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td className={styles.tableCell}>{caseItem.name}</td>
                  <td className={styles.tableCell}>{caseItem.creationDate}</td>
                  <td className={styles.tableCell}>
                    <Text color={caseItem.status === 'Completed' ? 'green' : 'orange'}>
                      {caseItem.status}
                    </Text>
                  </td>
                  <td className={styles.tableCell}>
                    {caseItem.status === 'Completed' ? (
                      <Button onClick={() => handleDownload(`/storage/utente1/ciao/${caseItem.name}`, caseItem.name)}>
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
          <Pagination total={10} /* Pagina corrente */ onChange={() => {}} /* Funzione da eseguire quando cambia la pagina */ />
          </Box>
        </Container>
      </>
    );
  }