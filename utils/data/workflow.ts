// Definizione delle interfacce
export interface Step {
    nome: string;
    url: string;
    descrizione: string;
    image: string;
  }
  
export interface Workflow {
    nome: string;
    descrizione: string;
    url: string;
    steps: Step[];
}
  
const workflowData: Workflow[] = [
    {
      nome: 'Workflow',
      descrizione: 'Questo è il workflow uno con dettagli specifici.',
      url: 'https://susmirri-test.di.unito.it/',
      steps: [
        {
          nome: 'Passo 1A',
          url: 'https://susmirri-test.di.unito.it/passo1a',
          descrizione: 'Dettagli del passo 1A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 1B',
          url: 'https://susmirri-test.di.unito.it/passo1b',
          descrizione: 'Dettagli del passo 1B.',
          image: '/images/SUSMirri.png'
        },
      ],
    },
    {
      nome: 'Workflow Due',
      descrizione: 'Questo è il workflow due con più passi.',
      url: 'https://susmirri-test.di.unito.it/workflowdue',
      steps: [
        {
          nome: 'Passo 2A',
          url: 'https://susmirri-test.di.unito.it/passo2a',
          descrizione: 'Dettagli del passo 2A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 2B',
          url: 'https://susmirri-test.di.unito.it/passo2b',
          descrizione: 'Dettagli del passo 2B.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 2C',
          url: 'https://susmirri-test.di.unito.it/passo2c',
          descrizione: 'Dettagli del passo 2C.',
          image: '/images/SUSMirri.png'
        },
      ],
    },
    {
      nome: 'Workflow Tre',
      descrizione: 'Questo è il workflow due con più passi.',
      url: 'https://susmirri-test.di.unito.it/workflowdue',
      steps: [
        {
          nome: 'Passo 3A',
          url: 'https://susmirri-test.di.unito.it/passo2a',
          descrizione: 'Dettagli del passo 2A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 3B',
          url: 'https://susmirri-test.di.unito.it/passo2a',
          descrizione: 'Dettagli del passo 2A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 3C',
          url: 'https://susmirri-test.di.unito.it/passo2a',
          descrizione: 'Dettagli del passo 2A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 3D',
          url: 'https://susmirri-test.di.unito.it/passo2b',
          descrizione: 'Dettagli del passo 2B.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 3E',
          url: 'https://susmirri-test.di.unito.it/passo2c',
          descrizione: 'Dettagli del passo 2C.',
          image: '/images/SUSMirri.png'
        },
      ],
    },
    {
      nome: 'Workflow Tre',
      descrizione: 'Questo è il workflow due con più passi.',
      url: 'https://susmirri-test.di.unito.it/workflowdue',
      steps: [
        {
          nome: 'Passo 3A',
          url: 'https://susmirri-test.di.unito.it/passo2a',
          descrizione: 'Dettagli del passo 2A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 3B',
          url: 'https://susmirri-test.di.unito.it/passo2a',
          descrizione: 'Dettagli del passo 2A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 3C',
          url: 'https://susmirri-test.di.unito.it/passo2a',
          descrizione: 'Dettagli del passo 2A.',
          image: '/images/SUSMirri.png'
        },
        {
          nome: 'Passo 3D',
          url: 'https://susmirri-test.di.unito.it/passo2b',
          descrizione: 'Dettagli del passo 2B.',
          image: '/images/SUSMirri.png'
        },
      ],
    },
  ];
  
  export default workflowData;