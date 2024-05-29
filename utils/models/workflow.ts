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