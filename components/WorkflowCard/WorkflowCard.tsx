"use client"
import React from 'react';
import { Card, Image, Text, AspectRatio } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import  { Step } from '../../utils/data/workflow'
import classes from './WorkflowCard.module.css';
import { accentGreenColor } from '@/utils/color/color';

interface WorkflowStepCardProps {
  step: Step;
  blurred: boolean;
  workflowName : string;
}

const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({ step, blurred,workflowName }) => {

  
  const router = useRouter();

  const handleTabClick = (workflowDetailsUrl: string, url:string) => {
    if(blurred)
      router.push(workflowDetailsUrl);
    else 
      router.push(url);
  };
  `/workflowdetails/${workflowName}`
  return (
    <Card className={`${classes.card} `} onClick={() => handleTabClick('/workflowdetails/'+workflowName,step.url)} style={{ backgroundColor:accentGreenColor }}>
      <AspectRatio ratio={1920 / 1080}>
        <Image src={step.image} alt={`Immagine per ${step.nome}`} style={blurred ? { filter: 'blur(4px)' } : {}} />
      </AspectRatio>
      <Text className={classes.title} mt={5} style={blurred ? { filter: 'blur(4px)' } : {}} >
        {step.nome}
      </Text>
      <Text size="xs" style={{color: 'dimmed',textTransform: 'uppercase',fontWeight: 700,filter: blurred ? 'blur(4px)' : undefined}} mt="md">
        {step.descrizione}
      </Text>
      {blurred && (
        <Link className="custom-text"  href={`/workflowdetails/${workflowName}`} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          color: '#0000FF', // Stile link
          textDecoration: 'underline', // Stile link
          fontWeight: 'bold', // Stile personalizzato
        }} > {/* Previene la propagazione dell'evento di clic */}
          View more...
        </Link>
      )}
    </Card>
  );
}

export default WorkflowStepCard;
