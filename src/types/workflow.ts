export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
}

export enum WorkflowType {
  ARWEAVE_UPLOAD = 'ARWEAVE_UPLOAD',
  // Add more workflow types as needed
}

export interface WorkflowExecutionResult {
  success: boolean;
  message: string;
  data?: any;
} 