export interface Case {
    id: string;
    name: string;
    creationDate: string;
    status: 'Pending' | 'Completed';
    downloadUrl: string;
  }