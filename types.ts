export type FieldType = 'text' | 'textarea' | 'date' | 'email' | 'number' | 'select' | 'currency' | 'header';

export type UserRole = 'admin' | 'user';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[]; // For select inputs
  required?: boolean;
  gridCols?: 1 | 2 | 3; // For layout control
  helpText?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from lucide-react
  sections: FormSection[];
}

export interface DocumentData {
  [key: string]: any;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  templateName: string;
  data: DocumentData;
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected';
  createdAt: string;
  applicant: string;
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  attachments: string[]; // Filenames
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'pdf' | 'docx' | 'xlsx' | 'folder';
  children?: FileSystemItem[];
  path: string;
  size?: string;
  updatedAt: string;
}