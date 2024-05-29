"use client"
import { SimpleGrid, Card, Image, Text, Container, AspectRatio,Title  } from '@mantine/core';
import { useState, useEffect } from 'react';
import {Workflow} from '../../utils/data/workflow'
import WorkflowData from '../../utils/data/workflow'
import { useRouter } from 'next/navigation';
import WorkflowCard from '../../components/WorkflowCard/WorkflowCard'; // Assicurati che il percorso sia corretto
import {Step} from '../../utils/data/workflow'
import { _getAllUsers } from '@/utils/database/UserService';
import { _getWorkflowData } from '@/utils/database/WorkflowDataService';

export function ArticlesCardsGrid() {

  const [workflowData, setWorkflowData] = useState<Workflow[]>([]);  
  const [windowWidth, setWindowWidth] = useState<number | number>(Number);
  const [viewMore, setViewMore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Funzione asincrona per ottenere i dati del workflow dal database
    async function fetchWorkflowData() {
      try {
        const data = await _getWorkflowData();  // Aspetta che la promessa sia risolta
        setWorkflowData(data);  // Aggiorna lo stato con i dati ottenuti
      } catch (error) {
        console.error('Failed to fetch workflow data:', error);
      }
    }

    fetchWorkflowData();  // Chiama la funzione asincrona
  }, []);
  
  const handleViewMore = () => {
    setViewMore(true);
  };

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    // Funzione per aggiornare la larghezza della finestra
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    // Ascolta il cambiamento delle dimensioni della finestra
    window.addEventListener('resize', handleResize);

    // Imposta la larghezza iniziale
    handleResize();

    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const determineMaxItems = (workflow : Workflow) => {
    if (windowWidth < 768){
      if(workflow.steps.length<=3){
        return 3;
      }else{
        return 2;
      }
    } else if (windowWidth >= 768 && windowWidth < 992){
      if(workflow.steps.length<=2){
        return 2;
      }else{
        return 1;
      }
    } else if (windowWidth >= 992 && windowWidth < 1200){
      if(workflow.steps.length<=3){
        return 3;
      }else{
        return 2;
      }
    }else{
      if(workflow.steps.length<=4){
        return 4;
      }else{
        return 3;
      }
    } 
  };
  const content = WorkflowData.map((workflow) => (
    <div key={workflow.nome}>
      <Title order={2} mt="xl" mb="md">{workflow.nome}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
        {workflow.steps.slice(0, determineMaxItems(workflow)).map((step: Step, index) =>
          <WorkflowCard step={step} blurred={false} workflowName={workflow.nome} />
        )}
        {workflow.steps.length > determineMaxItems(workflow) && (
          <WorkflowCard step={workflow.steps[determineMaxItems(workflow)]} blurred={true} workflowName={workflow.nome} />
        )}
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