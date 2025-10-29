// Connector types
export interface Connector {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  variants: ConnectorVariant[];
  documentationPath: string;
  supportUrl?: string;
  enabled: boolean;
  // Status tracking
  prioritized: boolean;
  priorityDueDate?: string; // ISO date string
  priorityNotifyUsers?: NotifyUser[];
  nextNudgeDate?: string; // ISO date string - when next notification will be sent
  connected: boolean;
  connectedDate?: string; // ISO date string - when connection was established
}

export interface NotifyUser {
  name: string;
  email: string;
  jobTitle: string;
  role: 'accountable' | 'informed';
}

export interface ConnectionInstance {
  id: string;
  name: string;
  variantId: string;
  config: Record<string, any>;
  createdAt: string;
  lastTested?: string;
  testStatus?: 'success' | 'failed' | 'pending';
}

export interface ConnectorVariant {
  id: string;
  name: string;
  description?: string;
  authMethod: AuthMethod;
  recommended: boolean;
  formFields: FormField[];
  testConfig: TestConfig;
  documentationPath: string;
  icon?: string;
}

export type AuthMethod = 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH' | 'SERVICE_ACCOUNT' | 'TOKEN' | 'USERNAME_PASSWORD';

// Form field types
export type FormField = 
  | StringField 
  | SecretField 
  | EmailField 
  | URLField 
  | HostnameField 
  | SelectField 
  | MultiSelectField 
  | BooleanField 
  | ArrayField 
  | DateField 
  | FileField 
  | MarkdownField;

export interface IFormField {
  __typename: string;
  id: string;
  key: string;
  label: string;
  description?: string;
  required: boolean;
  widget: FieldWidgetType;
  mode: FieldMode;
  defaultValue?: string;
  placeholder?: string;
}

export interface StringField extends IFormField {
  __typename: 'StringField';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface SecretField extends IFormField {
  __typename: 'SecretField';
  revealable: boolean;
}

export interface EmailField extends IFormField {
  __typename: 'EmailField';
}

export interface URLField extends IFormField {
  __typename: 'URLField';
}

export interface HostnameField extends IFormField {
  __typename: 'HostnameField';
}

export interface SelectField extends IFormField {
  __typename: 'SelectField';
  options: SelectOption[];
  allowCustom: boolean;
}

export interface MultiSelectField extends IFormField {
  __typename: 'MultiSelectField';
  options: SelectOption[];
  minSelections?: number;
  maxSelections?: number;
}

export interface BooleanField extends IFormField {
  __typename: 'BooleanField';
}

export interface ArrayField extends IFormField {
  __typename: 'ArrayField';
  itemType: string;
  minItems?: number;
  maxItems?: number;
}

export interface DateField extends IFormField {
  __typename: 'DateField';
  minDate?: string;
  maxDate?: string;
}

export interface FileField extends IFormField {
  __typename: 'FileField';
  acceptedTypes: string[];
  maxSize?: number;
}

export interface MarkdownField extends IFormField {
  __typename: 'MarkdownField';
  content: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export type FieldWidgetType =
  | 'TEXT_INPUT'
  | 'TEXTAREA'
  | 'PASSWORD'
  | 'EMAIL_INPUT'
  | 'URL_INPUT'
  | 'HOSTNAME_INPUT'
  | 'SELECT'
  | 'RADIO'
  | 'MULTISELECT'
  | 'CHECKBOX'
  | 'TOGGLE'
  | 'DATE_PICKER'
  | 'FILE_UPLOAD'
  | 'MARKDOWN_DISPLAY';

export type FieldMode = 'READ_ONLY' | 'WRITE_ONLY' | 'READ_WRITE';

// Test configuration
export interface TestConfig {
  id: string;
  method: 'HTTP_GET' | 'HTTP_POST' | 'CUSTOM' | 'VALIDATE_FORMAT';
  endpoint?: string;
  expectedResponse: ExpectedResponse;
  timeoutMs: number;
  customScript?: string;
}

export interface ExpectedResponse {
  statusCode?: number;
  bodyPattern?: string;
  headers?: string;
  successMessage: string;
  failureMessage: string;
}

