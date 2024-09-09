export interface Case {
    id: string;
    name: string;
    creationDate: string;
    status: 'Pending' | 'Completed' | 'Expired';
    downloadUrl: string;
}

export interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone: string;
    country: string;
}

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

export interface DecodedToken {
    email: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    exp: number;
}

export interface NavbarProps {
    user: User | null;
    handleLogout: () => void;
}

export type Analysis = {
    analysis_id: string;
    analysis_name: string;
    user_id: number;
    creation_timestamp: Date;
    status: string;
};
  
export type ReportFile = {
    report_id: number;
    analysis_id: string;
    report_path: string;
    expiration_date: Date;
};