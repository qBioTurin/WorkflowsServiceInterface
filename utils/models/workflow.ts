export interface Step {
    step_id: number;
    nome: string;
    url: string;
    descrizione: string;
    image: string;
  }
  
export interface Workflow {
    workflow_id: number;
    nome: string;
    descrizione: string;
    url: string;
    steps: Step[];
}