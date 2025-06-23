export interface TelegramFile {
  id: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedBy: string;
  createdAt: string;
  arweaveId?: string;
  arweaveUrl?: string;
  arweaveUploadStatus: 'pending' | 'success';
}

export interface RecentFilesResponse {
  success: boolean;
  files: TelegramFile[];
  count: number;
  timestamp: string;
}

export interface CostEstimate {
  winc: string;
  ar: string;
  sufficient: boolean;
}

export interface FileCostResponse {
  success: boolean;
  file_id: string;
  file_name: string;
  file_size: number;
  cost_estimate: CostEstimate;
}

export interface ArweaveUploadResponse {
  success: boolean;
  message: string;
  file_id: string;
  arweave_id: string;
  arweave_url: string;
  arweave_owner: string;
  data_caches: string[];
  fast_finality_indexes: string[];
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
} 