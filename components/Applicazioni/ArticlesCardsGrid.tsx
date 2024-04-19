"use client"
import { SimpleGrid, Card, Image, Text, Container, AspectRatio,Title } from '@mantine/core';
import classes from './ArticlesCardsGrid.module.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


interface Segment {
  descrizione: string;
  image: string;
  nome: string;
  indirizzo: string;
}

interface Workflow {
  nomeWorkflow: string;
  segmenti: Segment[];
}

const mockdata: Workflow[] = [
  {
    nomeWorkflow: 'Workflow Uno',
    segmenti: [
      {
        descrizione: 'Descrizione del segmento 1A.',
        image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        nome: 'Segmento 1A',
        indirizzo: 'https://susmirri-test.di.unito.it/',
      },
      {
        descrizione: 'Descrizione del segmento 1B.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        nome: 'Segmento 1B',
        indirizzo: 'https://www.halowaypoint.com/343-industries',
      },
    ],
  },
  {
    nomeWorkflow: 'Workflow Due',
    segmenti: [
      {
        descrizione: 'Descrizione di Instagram.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        nome: 'Instagram',
        indirizzo: 'https://www.instagram.com/',
      },
      {
        descrizione: 'Descrizione di Instagram.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        nome: 'Instagram',
        indirizzo: 'https://www.instagram.com/',
      },
      {
        descrizione: 'Descrizione di Instagram.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        nome: 'Instagram',
        indirizzo: 'https://www.instagram.com/',
      },
      {
        descrizione: 'Descrizione di Instagram.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        nome: 'Instagram',
        indirizzo: 'https://www.instagram.com/',
      },
      {
        descrizione: 'Descrizione di Facebook.',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80',
        nome: 'Facebook',
        indirizzo: 'https://www.facebook.com/',
      },
    ],
  },
];


export function ArticlesCardsGrid() {
  const content = mockdata.map((workflow) => (
    <div key={workflow.nomeWorkflow}>
      <Title order={2} mt="xl" mb="md">{workflow.nomeWorkflow}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} >
        {workflow.segmenti.map((segmento, index) => (
          <div key={segmento.nome} className={classes.segmentWrapper}>
            <Card p="md" radius="md" component="a" href={segmento.indirizzo} className={classes.card}>
              <AspectRatio ratio={1920 / 1080}>
                <Image src={segmento.image} alt={`Immagine per ${segmento.nome}`} />
              </AspectRatio>
              <Text className={classes.title} mt={5}>
                {segmento.nome}
              </Text>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
                {segmento.descrizione}
              </Text>
            </Card>
            {index < workflow.segmenti.length - 1 && <ArrowForwardIcon className="horizontal-arrow" />}
            {index < workflow.segmenti.length - 1 && (index + 1) % 4 === 0 && <ArrowDownwardIcon className="vertical-arrow" />}
          </div>
        ))}
      </SimpleGrid>
    </div>
  ));
  return (
    <Container py="xl">
      <Title order={1} mb="lg">Tutte le nostre applicazioni</Title>
      {content}
    </Container>
  );
}


