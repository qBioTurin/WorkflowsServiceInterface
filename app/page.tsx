"use client";
import { SimpleGrid, Text, Container, Title } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Workflow, Step } from '../utils/models/workflow';
import { useRouter } from 'next/navigation';
import WorkflowCard from '../components/WorkflowCard/WorkflowCard'; // Assicurati che il percorso sia corretto
import { _getWorkflowData } from '@/utils/database/WorkflowDataService';
import classes from './HomePage.module.css';
import { accentColor, accentColorHover } from '@/utils/color/color';
import MyAppShell from '@/components/AppShell/MyAppShell';
import Footer from '@/components/footer/Footer';

export default function HomePage() {
  const [workflowData, setWorkflowData] = useState<Workflow[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(Number);
  const [viewMore, setViewMore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Funzione asincrona per ottenere i dati del workflow dal database
    async function fetchWorkflowData() {
      try {
        const data = await _getWorkflowData(); // Aspetta che la promessa sia risolta

        // DEBUG: Stampa i dati restituiti dal server
        console.log("Dati restituiti da _getWorkflowData:", JSON.stringify(data, null, 2));

        setWorkflowData(data); // Aggiorna lo stato con i dati ottenuti
      } catch (error) {
        console.error("Failed to fetch workflow data:", error);
      }
    }

    fetchWorkflowData(); // Chiama la funzione asincrona
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

  const determineMaxItems = (workflow: Workflow) => {
    if (windowWidth < 768) {
      return workflow.steps.length <= 3 ? 3 : 2;
    } else if (windowWidth >= 768 && windowWidth < 992) {
      return workflow.steps.length <= 2 ? 2 : 1;
    } else if (windowWidth >= 992 && windowWidth < 1200) {
      return workflow.steps.length <= 3 ? 3 : 2;
    } else {
      return workflow.steps.length <= 4 ? 4 : 3;
    }
  };

  const content = workflowData.map((workflow) => {

    return (
      <div key={workflow.nome}>
        <Title
          order={2}
          mt="xl"
          mb="md"
          onClick={() => handleTabClick(`/workflowdetails/${workflow.nome}`)}
          style={{ cursor: 'pointer'}}
        >
          {workflow.nome}
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {workflow.steps.slice(0, determineMaxItems(workflow)).map((step: Step, index) => {
            return (
              <WorkflowCard key={index} step={step} blurred={false} workflowName={workflow.nome} />
            );
          })}
          {workflow.steps.length > determineMaxItems(workflow) && (
            <WorkflowCard
              key={determineMaxItems(workflow)}
              step={workflow.steps[determineMaxItems(workflow)]}
              blurred={true}
              workflowName={workflow.nome}
            />
          )}
        </SimpleGrid>
      </div>
    );
  });

  const children = (
    <Container>
      <div className={classes.title}>
        List of{" "}
        <Text
          span
          variant="gradient"
          gradient={{ from: accentColor, to: accentColorHover, deg: 90 }}
          inherit
        >
          Workflows
        </Text>
      </div>
      {content}
    </Container>
  );

  return (
    <>
      <MyAppShell children={children} />
      <Footer />
    </>
  );
}
