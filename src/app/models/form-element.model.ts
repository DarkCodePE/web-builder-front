export interface FormElement {
  id: string;
  type: string;
  icon: string;
  label: string;
  section: 'Contactos' | 'General' | 'Opciones' | 'Fechas' | 'Botones' | 'Elementos de estilo' | 'Campos eliminados';
  tooltip?: string;
  placeholder?: string;
  options?: string[];        // Para select, checkbox y radio
  layout?: 'vertical' | 'horizontal';  // Para checkbox y radio
  multiple?: boolean;        // Para select
  rows?: number;            // Para textarea
}
