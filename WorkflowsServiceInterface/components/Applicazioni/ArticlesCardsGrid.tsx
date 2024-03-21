"use client"
import { SimpleGrid, Card, Image, Text, Container, AspectRatio,Title } from '@mantine/core';
import classes from './ArticlesCardsGrid.module.css';

const mockdata = [
  {
    descrizione: 'Questo si occupa di fare...',
    image:
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    nome: 'susmirri test Unito',
    indirizzo:'https://susmirri-test.di.unito.it/',
  },
  {
    descrizione: 'Questo si occupa di fare...',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    nome: '343-industries',
    indirizzo:'https://www.halowaypoint.com/343-industries',
  },
  {
    descrizione: 'Questo si occupa di fare...',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    nome: 'Instagram',
    indirizzo:'https://www.instagram.com/',
  },
  {
    descrizione: 'Questo si occupa di fare...',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    nome: 'Facebook',
    indirizzo:'https://www.facebook.com/',
  },
];

export function ArticlesCardsGrid() {
  const cards = mockdata.map((article) => (
    <Card key={article.nome} p="md" radius="md" component="a" href={article.indirizzo} className={classes.card}>
      <AspectRatio ratio={1920 / 1080}>
        <Image src={article.image} title='App'/>
      </AspectRatio>
      <Text className={classes.title} mt={5}>
        {article.nome}
      </Text>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {article.descrizione}
      </Text>
    </Card>
  ));

  return (
    <Container py="xl">
      <Title order={1} mb="lg">Tutte le nostre applicazioni</Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>{cards}</SimpleGrid>
    </Container>
  );
}