// field-properties.config.ts

export interface FieldValidation {
  type: string;
  value: any;
  label: string;
  options?: any[];
}

export interface FieldProperty {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'toggle' | 'select' | 'options';
  defaultValue: any;
  tooltip?: string;
  validations?: FieldValidation[];
  options?: { label: string; value: any }[];
  section: 'general' | 'validation' | 'appearance' | 'advanced';
}

export const fieldPropertiesConfig: { [key: string]: FieldProperty[] } = {
  // Campo de texto corto
  'text': [
    {
      key: 'label',
      label: 'Título del campo',
      type: 'text',
      defaultValue: 'Texto corto',
      tooltip: 'El título que se mostrará sobre el campo',
      section: 'general',
      validations: [
        {
          type: 'maxLength',
          value: 255,
          label: 'Máximo 255 caracteres'
        }
      ]
    },
    {
      key: 'placeholder',
      label: 'Texto de ejemplo',
      type: 'text',
      defaultValue: '',
      section: 'general'
    },
    {
      key: 'required',
      label: 'Campo obligatorio',
      type: 'toggle',
      defaultValue: false,
      section: 'general'
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'textarea',
      defaultValue: '',
      section: 'general'
    },
    {
      key: 'minLength',
      label: 'Longitud mínima',
      type: 'number',
      defaultValue: 0,
      section: 'validation'
    },
    {
      key: 'maxLength',
      label: 'Longitud máxima',
      type: 'number',
      defaultValue: 255,
      section: 'validation'
    },
    {
      key: 'pattern',
      label: 'Patrón de validación',
      type: 'text',
      defaultValue: '',
      section: 'validation'
    }
  ],

  // Campo de email
  'email': [
    {
      key: 'label',
      label: 'Título del campo',
      type: 'text',
      defaultValue: 'Correo electrónico',
      section: 'general'
    },
    {
      key: 'placeholder',
      label: 'Texto de ejemplo',
      type: 'text',
      defaultValue: 'correo@ejemplo.com',
      section: 'general'
    },
    {
      key: 'required',
      label: 'Campo obligatorio',
      type: 'toggle',
      defaultValue: false,
      section: 'general'
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'textarea',
      defaultValue: '',
      section: 'general'
    }
  ],

  // Campo de texto largo
  'textarea': [
    {
      key: 'label',
      label: 'Título del campo',
      type: 'text',
      defaultValue: 'Texto largo',
      section: 'general'
    },
    {
      key: 'placeholder',
      label: 'Texto de ejemplo',
      type: 'text',
      defaultValue: 'Escribe aquí...',
      section: 'general'
    },
    {
      key: 'required',
      label: 'Campo obligatorio',
      type: 'toggle',
      defaultValue: false,
      section: 'general'
    },
    {
      key: 'rows',
      label: 'Número de filas',
      type: 'number',
      defaultValue: 3,
      section: 'appearance'
    },
    {
      key: 'minLength',
      label: 'Longitud mínima',
      type: 'number',
      defaultValue: 0,
      section: 'validation'
    },
    {
      key: 'maxLength',
      label: 'Longitud máxima',
      type: 'number',
      defaultValue: 1000,
      section: 'validation'
    }
  ],

  // Lista desplegable
  'select': [
    {
      key: 'label',
      label: 'Título del campo',
      type: 'text',
      defaultValue: 'Lista desplegable',
      section: 'general'
    },
    {
      key: 'placeholder',
      label: 'Texto de ejemplo',
      type: 'text',
      defaultValue: 'Selecciona una opción',
      section: 'general'
    },
    {
      key: 'required',
      label: 'Campo obligatorio',
      type: 'toggle',
      defaultValue: false,
      section: 'general'
    },
    {
      key: 'options',
      label: 'Opciones',
      type: 'options',
      defaultValue: ['Opción 1', 'Opción 2', 'Opción 3'],
      section: 'general'
    },
    {
      key: 'multiple',
      label: 'Permitir selección múltiple',
      type: 'toggle',
      defaultValue: false,
      section: 'advanced'
    }
  ],

  // Casillas de verificación
  'checkbox': [
    {
      key: 'label',
      label: 'Título del campo',
      type: 'text',
      defaultValue: 'Casillas de verificación',
      section: 'general'
    },
    {
      key: 'required',
      label: 'Campo obligatorio',
      type: 'toggle',
      defaultValue: false,
      section: 'general'
    },
    {
      key: 'options',
      label: 'Opciones',
      type: 'options',
      defaultValue: ['Opción 1', 'Opción 2', 'Opción 3'],
      section: 'general'
    },
    {
      key: 'layout',
      label: 'Disposición',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' }
      ],
      section: 'appearance'
    }
  ],

  // Botón de radio
  'radio': [
    {
      key: 'label',
      label: 'Título del campo',
      type: 'text',
      defaultValue: 'Opciones únicas',
      section: 'general'
    },
    {
      key: 'required',
      label: 'Campo obligatorio',
      type: 'toggle',
      defaultValue: false,
      section: 'general'
    },
    {
      key: 'options',
      label: 'Opciones',
      type: 'options',
      defaultValue: ['Opción 1', 'Opción 2', 'Opción 3'],
      section: 'general'
    },
    {
      key: 'layout',
      label: 'Disposición',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' }
      ],
      section: 'appearance'
    }
  ]
};
