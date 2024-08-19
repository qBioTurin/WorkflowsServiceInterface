"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container, Title, Text, Card, SimpleGrid,AspectRatio,Image } from '@mantine/core';
import workflowData from '../../../../utils/data/workflow';
import { Workflow } from '../../../../utils/data/workflow';
import classes from './stile.module.css';
import WorkflowCard from '../../../../components/WorkflowCard/WorkflowCard'

const WorkflowDetail = () => {
  const [workflow, setWorkflow] = useState<Workflow | undefined | null>(null);
  const pathname = usePathname();
  const nome = decodeURIComponent(pathname.split('/').pop()?.trim() || '');

  useEffect(() => {
    if (nome) {
      const foundWorkflow = workflowData.find(w => w.nome === nome);
      setWorkflow(foundWorkflow);
    }
  }, [nome]);

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
          <WorkflowCard step={step} blurred={false} workflowName={workflow.nome} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default WorkflowDetail;
