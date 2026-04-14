export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CommunicationRecipient {
  name: string;
  type: "PARTY" | "LAWYER";
  role?: string | null;
}

export interface CommunicationListItem {
  id: string;
  pjeId: number;
  publicationDate: string;
  type: string;
  content: string;
  communicationNumber: number | null;
  process: {
    number: string;
    className: string | null;
    tribunal: { sigla: string };
  };
  recipients: CommunicationRecipient[];
}

export interface CommunicationListResponse {
  items: CommunicationListItem[];
  meta: PaginationMeta;
}

export interface ProcessCommunication {
  id: string;
  publicationDate: string;
  type: string;
  content: string;
  aiSummary: string | null;
  recipients: CommunicationRecipient[];
}

export interface ProcessDetailResponse {
  process: {
    number: string;
    className: string | null;
    tribunal: { sigla: string };
    hasTransitado: boolean;
    communicationsCount: number;
  };
  recipients: string[];
  communications: ProcessCommunication[];
}

export interface TribunalItem {
  id: number;
  name: string;
  sigla: string;
}

export interface TribunalListResponse {
  items: TribunalItem[];
}

export interface SummaryResponse {
  summary: string;
  cached: boolean;
}

export interface CommunicationsQuery {
  page?: number;
  search?: string;
  tribunalId?: number;
  startDate?: string;
  endDate?: string;
}
