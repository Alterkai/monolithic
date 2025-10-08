// Re-export all types from individual modules
export * from "./manga";
export * from "./api";

// Type utilities
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Common utility types
export interface SelectOption {
  label: string;
  value: string | number;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form state types
export interface FormState<T = Record<string, any>> {
  data: T;
  loading: boolean;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
}

// Loading states
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Navigation types
export interface BreadcrumbItem {
  label: string;
  to?: string;
  disabled?: boolean;
}
