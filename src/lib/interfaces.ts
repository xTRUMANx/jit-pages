export interface Page {
  id?: number;
  name: string;
  url?: string;
  data?: any;
  fields: FieldProperty[];
}

export interface FieldProperty {
  key: string;
  visible: boolean;
}
