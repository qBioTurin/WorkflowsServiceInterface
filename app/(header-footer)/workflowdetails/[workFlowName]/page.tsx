"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container, Title, Text, SimpleGrid } from '@mantine/core';
import { Workflow } from '@/utils/models/workflow';
import WorkflowCard from '@/components/WorkflowCard/WorkflowCard';
import {_getWorkflowByName} from '@/utils/database/WorkflowDataService'


const WorkflowDetail = () => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const nome = decodeURIComponent(pathname.split('/').pop()?.trim() || '');

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const fetchedWorkflow = await _getWorkflowByName(nome); // Chiamata server-side action
        if (!fetchedWorkflow) {
          setError("Workflow non trovato");
        } else {
          setWorkflow(fetchedWorkflow);
        }
      } catch (err) {
        setError("Errore durante il caricamento del workflow");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [nome]);

  if (loading) {
    return <Container><Text>Caricamento in corso...</Text></Container>;
  }

  if (error) {
    return (
      <Container>
        <Title>Errore</Title>
        <Text>{error}</Text>
      </Container>
    );
  }

  if (!workflow) {
    return (
      <Container>
        <Title>Workflow non trovato</Title>
        <Text>Il workflow richiesto non esiste. Torna alla <a href="/">home page</a>.</Text>
      </Container>
    );
  }

  return (
    <Container py="xl">
      <Title order={1}>{workflow.nome}</Title>
      <Text size="sm">{workflow.descrizione}</Text>
      <SimpleGrid cols={3} spacing="lg">
        {workflow.steps.map((step, index) => (
          <WorkflowCard key={step.step_id} step={step} blurred={false} workflowName={workflow.nome} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default WorkflowDetail;
