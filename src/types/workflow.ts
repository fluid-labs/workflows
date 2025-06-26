export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
  params?: {
    username?: string;
  };
}

export enum WorkflowType {
  ARWEAVE_UPLOAD = 'ARWEAVE_UPLOAD',
  TWITTER_MONITOR = 'TWITTER_MONITOR',
  // Add more workflow types as needed
}

export interface WorkflowExecutionResult {
  success: boolean;
  message: string;
  data?: any;
} 