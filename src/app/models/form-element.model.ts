export interface FormElement {
  id: string;
  type: string;
  icon: string;
  label: string;
  section: 'Contactos' | 'General' | 'Opciones' | 'Fechas' | 'Botones' | 'Elementos de estilo' | 'Campos eliminados';
  tooltip?: string
  placeholder?: string
}
