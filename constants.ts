import { DocumentTemplate, GeneratedDocument } from './types';

export const TEMPLATES: DocumentTemplate[] = [
  // --- EXISTING TEMPLATES ---
  {
    id: 'general_petition',
    name: 'Petición General al Consejo Técnico',
    description: 'Solicitud formal para asuntos varios, justificaciones y peticiones generales.',
    icon: 'FileText',
    sections: [
      {
        id: 'header',
        title: 'Datos Generales',
        fields: [
          { id: 'folio', label: 'Folio', type: 'text', placeholder: 'Auto-generado', gridCols: 1 },
          { id: 'requestDate', label: 'Fecha de Solicitud', type: 'date', required: true, gridCols: 1 },
        ]
      },
      {
        id: 'applicant',
        title: 'I. Datos del Solicitante',
        fields: [
          { id: 'fullName', label: 'Nombre Completo', type: 'text', required: true, gridCols: 2 },
          { id: 'email', label: 'Correo Electrónico', type: 'email', required: true, gridCols: 2 },
          { id: 'personalId', label: 'Matrícula/Personal', type: 'text', required: true, gridCols: 1 },
          { id: 'applicantType', label: 'Tipo de Solicitante', type: 'select', options: ['Estudiante', 'Académico', 'Administrativo'], required: true, gridCols: 1 },
          { id: 'program', label: 'Programa/Área', type: 'text', required: true, gridCols: 2 },
          { id: 'phone', label: 'Teléfono', type: 'text', required: true, gridCols: 1 },
        ]
      },
      {
        id: 'subject',
        title: 'II. Asunto de la Petición',
        fields: [
          { id: 'subjectLine', label: 'Asunto', type: 'text', required: true, gridCols: 2 },
        ]
      },
      {
        id: 'details',
        title: 'III. Desarrollo Completo',
        fields: [
          { id: 'description', label: 'Descripción Detallada', type: 'textarea', required: true, gridCols: 2, helpText: 'Utilice la IA para mejorar la redacción.' },
        ]
      },
      {
        id: 'requirements',
        title: 'IV. Requerimientos Necesarios',
        fields: [
          { id: 'requirementsText', label: 'Requerimientos', type: 'textarea', gridCols: 2 },
        ]
      },
      {
        id: 'justification',
        title: 'V. Justificación',
        fields: [
          { id: 'justificationText', label: 'Justificación', type: 'textarea', required: true, gridCols: 2 },
        ]
      },
      {
        id: 'benefit',
        title: 'VI. Beneficio Esperado',
        fields: [
          { id: 'benefitText', label: 'Beneficio', type: 'textarea', gridCols: 2 },
        ]
      }
    ]
  },
  {
    id: 'academic_event',
    name: 'Organización de Evento Académico',
    description: 'Solicitud para organizar conferencias, seminarios o talleres.',
    icon: 'Calendar',
    sections: [
      {
        id: 'organizer',
        title: 'I. Datos del Organizador',
        fields: [
          { id: 'fullName', label: 'Nombre Completo', type: 'text', required: true, gridCols: 2 },
          { id: 'program', label: 'Programa/Área', type: 'text', gridCols: 2 },
        ]
      },
      {
        id: 'event_info',
        title: 'II. Información General del Evento',
        fields: [
          { id: 'eventName', label: 'Nombre del Evento', type: 'text', required: true, gridCols: 2 },
          { id: 'modality', label: 'Modalidad', type: 'select', options: ['Presencial', 'Virtual', 'Híbrido'], gridCols: 1 },
          { id: 'eventDate', label: 'Fecha(s) del evento', type: 'text', placeholder: 'Ej: 10 al 12 de Octubre', gridCols: 1 },
          { id: 'venue', label: 'Sede/Plataforma', type: 'text', gridCols: 1 },
          { id: 'schedule', label: 'Horario', type: 'text', gridCols: 1 },
          { id: 'attendees', label: 'Asistentes Esperados', type: 'number', gridCols: 1 },
        ]
      },
      {
        id: 'justification',
        title: 'III. Relevancia y Justificación',
        fields: [
          { id: 'academicJustification', label: 'Justificación Académica', type: 'textarea', gridCols: 2 },
          { id: 'impact', label: 'Impacto esperado en las LGAC', type: 'textarea', gridCols: 2 },
        ]
      },
      {
        id: 'budget',
        title: 'VI. Presupuesto Detallado',
        fields: [
          { id: 'totalBudget', label: 'Presupuesto Total Estimado ($ MXN)', type: 'currency', required: true, gridCols: 2 },
          { id: 'budgetLogistics', label: '1. Logística y Espacios', type: 'currency', gridCols: 1 },
          { id: 'budgetMaterials', label: '2. Materiales y Papelería', type: 'currency', gridCols: 1 },
          { id: 'budgetFood', label: '3. Alimentos y Bebidas', type: 'currency', gridCols: 1 },
          { id: 'budgetFees', label: '4. Honorarios', type: 'currency', gridCols: 1 },
          { id: 'budgetTransport', label: '5. Transporte y Viáticos', type: 'currency', gridCols: 1 },
          { id: 'budgetDiffusion', label: '6. Difusión', type: 'currency', gridCols: 1 },
          { id: 'budgetUnforeseen', label: '7. Imprevistos (10%)', type: 'currency', gridCols: 1 },
        ]
      }
    ]
  },
  {
    id: 'tutorial_committee',
    name: 'Petición de Comité Tutorial',
    description: 'Registro o modificación de directores, co-tutores y asesores de tesis.',
    icon: 'Users',
    sections: [
      {
        id: 'applicant',
        title: 'I. Datos del Solicitante',
        fields: [
          { id: 'fullName', label: 'Nombre Completo', type: 'text', required: true, gridCols: 2 },
          { id: 'matricula', label: 'Matrícula', type: 'text', gridCols: 1 },
          { id: 'program', label: 'Programa de Posgrado', type: 'text', gridCols: 1 },
        ]
      },
      {
        id: 'project',
        title: 'II. Proyecto de Investigación',
        fields: [
          { id: 'projectTitle', label: 'Título del Proyecto', type: 'text', required: true, gridCols: 2 },
          { id: 'description', label: 'Descripción General', type: 'textarea', gridCols: 2 },
        ]
      },
      {
        id: 'committee',
        title: 'III. Integración Propuesta',
        fields: [
          { id: 'directorName', label: 'Director(a) de Tesis - Nombre', type: 'text', required: true, gridCols: 2 },
          { id: 'directorInst', label: 'Institución', type: 'text', gridCols: 1 },
          { id: 'directorJust', label: 'Justificación', type: 'textarea', gridCols: 2 },
          
          { id: 'cotutorName', label: 'Co-Tutor(a) - Nombre', type: 'text', gridCols: 2 },
          { id: 'cotutorInst', label: 'Institución', type: 'text', gridCols: 1 },
          { id: 'cotutorJust', label: 'Justificación', type: 'textarea', gridCols: 2 },
        ]
      }
    ]
  },
   {
    id: 'institutional_endorsement',
    name: 'Aval Institucional',
    description: 'Solicitud de respaldo oficial para eventos externos.',
    icon: 'ShieldCheck',
    sections: [
       {
        id: 'event_external',
        title: 'II. Información del Evento Externo',
        fields: [
          { id: 'eventName', label: 'Nombre del Evento', type: 'text', required: true, gridCols: 2 },
          { id: 'organizer', label: 'Organizador', type: 'text', gridCols: 1 },
          { id: 'webPage', label: 'Página Web Oficial', type: 'text', gridCols: 1 },
        ]
      },
      {
        id: 'participation',
        title: 'III. Tipo de Participación',
        fields: [
          { id: 'role', label: 'Participaré como', type: 'select', options: ['Ponente', 'Asistente', 'Organizador'], gridCols: 1 },
          { id: 'paperTitle', label: 'Título de Ponencia (si aplica)', type: 'text', gridCols: 2 },
          { id: 'abstract', label: 'Abstract o Resumen', type: 'textarea', gridCols: 2 },
        ]
      }
    ]
  },

  // --- NEW TEMPLATES FROM PDF ---

  {
    id: 'academic_viaticos',
    name: 'Académicos – Viáticos / Inscripciones',
    description: 'Solicitud de viáticos, inscripciones o reembolsos para personal académico.',
    icon: 'CreditCard',
    sections: [
      {
        id: 'applicant',
        title: 'I. Datos del Solicitante',
        fields: [
          { id: 'fullName', label: 'Nombre Completo', type: 'text', required: true, gridCols: 2 },
          { id: 'personalId', label: 'Matrícula/No. Personal', type: 'text', required: true, gridCols: 1 },
          { id: 'program', label: 'Programa/Dependencia', type: 'text', required: true, gridCols: 1 },
          { id: 'email', label: 'Correo Electrónico', type: 'email', required: true, gridCols: 1 },
          { id: 'phone', label: 'Teléfono', type: 'text', required: true, gridCols: 1 },
        ]
      },
      {
        id: 'period_place',
        title: 'II. Periodo y Lugar',
        fields: [
          { id: 'place', label: 'Lugar', type: 'text', required: true, gridCols: 2 },
          { id: 'periodStart', label: 'Periodo Inicio', type: 'date', required: true, gridCols: 1 },
          { id: 'periodEnd', label: 'Periodo Fin', type: 'date', required: true, gridCols: 1 },
        ]
      },
      {
        id: 'reason_project',
        title: 'III. Proyecto y Motivo',
        fields: [
          { id: 'projectTitle', label: 'Título del Proyecto/Tesis', type: 'text', required: true, gridCols: 2 },
          { id: 'reason', label: 'Motivo de la solicitud', type: 'textarea', required: true, gridCols: 2, helpText: 'Explique brevemente el motivo del viaje o gasto.' },
        ]
      },
      {
        id: 'specific_info',
        title: 'IV. Información Específica',
        fields: [
          { id: 'eventName', label: 'Evento / Actividad', type: 'text', required: true, gridCols: 2 },
          { id: 'cityCountry', label: 'Ciudad / País', type: 'text', gridCols: 1 },
          { id: 'eventDates', label: 'Fechas del Evento', type: 'text', gridCols: 1 },
        ]
      },
      {
        id: 'expenses',
        title: 'V. Desglose Detallado de Gastos',
        fields: [
          { id: 'expRegistration', label: 'Inscripción ($)', type: 'currency', gridCols: 1 },
          { id: 'expFood', label: 'Alimentos ($)', type: 'currency', gridCols: 1 },
          { id: 'expLodging', label: 'Hospedaje ($)', type: 'currency', gridCols: 1 },
          { id: 'expTransport', label: 'Transporte ($)', type: 'currency', gridCols: 1 },
        ]
      },
      {
        id: 'signatures',
        title: 'VI. Firmas y Observaciones',
        fields: [
          { id: 'directorName', label: 'Nombre del Director o Asesor (para Vo.Bo.)', type: 'text', required: true, gridCols: 2 },
          { id: 'observations', label: 'Observaciones Adicionales', type: 'textarea', gridCols: 2 },
        ]
      }
    ]
  },

  {
    id: 'student_endorsement',
    name: 'Estudiantes – Aval de Actividad Académica',
    description: 'Solicitud de aval académico para estudiantes.',
    icon: 'Award',
    sections: [
      {
        id: 'applicant',
        title: 'I. Datos del Solicitante',
        fields: [
          { id: 'fullName', label: 'Nombre Completo', type: 'text', required: true, gridCols: 2 },
          { id: 'personalId', label: 'Matrícula', type: 'text', required: true, gridCols: 1 },
          { id: 'program', label: 'Programa', type: 'text', required: true, gridCols: 1 },
          { id: 'email', label: 'Correo', type: 'email', gridCols: 1 },
          { id: 'phone', label: 'Teléfono', type: 'text', gridCols: 1 },
        ]
      },
      {
        id: 'period_place',
        title: 'II. Periodo y Lugar',
        fields: [
          { id: 'place', label: 'Lugar', type: 'text', gridCols: 2 },
          { id: 'periodStart', label: 'Periodo Inicio', type: 'date', gridCols: 1 },
          { id: 'periodEnd', label: 'Periodo Fin', type: 'date', gridCols: 1 },
        ]
      },
      {
        id: 'project_details',
        title: 'III. Detalles de la Actividad',
        fields: [
          { id: 'projectTitle', label: 'Título del Proyecto/Tesis', type: 'text', required: true, gridCols: 2 },
          { id: 'reason', label: 'Motivo', type: 'textarea', gridCols: 2 },
          { id: 'activity', label: 'Actividad', type: 'textarea', gridCols: 2 },
          { id: 'objective', label: 'Objetivo', type: 'textarea', gridCols: 2 },
          { id: 'expectedResults', label: 'Resultados Esperados', type: 'textarea', gridCols: 2 },
        ]
      },
      {
        id: 'signatures',
        title: 'IV. Validaciones',
        fields: [
          { id: 'directorName', label: 'Nombre del Director/Asesor (Vo.Bo.)', type: 'text', required: true, gridCols: 2 },
          { id: 'observations', label: 'Observaciones', type: 'textarea', gridCols: 2 },
        ]
      }
    ]
  },

  {
    id: 'student_external_course',
    name: 'Estudiantes – VoBo Cursos Externos y Estancias',
    description: 'Solicitud de visto bueno para cursos fuera de la institución o estancias de investigación.',
    icon: 'BookOpen',
    sections: [
      {
        id: 'applicant',
        title: 'I. Datos del Solicitante',
        fields: [
          { id: 'fullName', label: 'Nombre Completo', type: 'text', required: true, gridCols: 2 },
          { id: 'personalId', label: 'Matrícula', type: 'text', required: true, gridCols: 1 },
          { id: 'program', label: 'Programa', type: 'text', required: true, gridCols: 1 },
          { id: 'email', label: 'Correo', type: 'email', gridCols: 1 },
          { id: 'phone', label: 'Teléfono', type: 'text', gridCols: 1 },
        ]
      },
      {
        id: 'period_place',
        title: 'II. Periodo y Lugar',
        fields: [
          { id: 'place', label: 'Lugar', type: 'text', required: true, gridCols: 2 },
          { id: 'periodStart', label: 'Periodo Inicio', type: 'date', gridCols: 1 },
          { id: 'periodEnd', label: 'Periodo Fin', type: 'date', gridCols: 1 },
        ]
      },
      {
        id: 'activity_info',
        title: 'III. Información de la Actividad',
        fields: [
          { id: 'projectTitle', label: 'Título del Proyecto/Tesis', type: 'text', gridCols: 2 },
          { id: 'reason', label: 'Motivo', type: 'textarea', gridCols: 2 },
          { id: 'activityType', label: 'Tipo de Actividad', type: 'select', options: ['Curso', 'Estancia', 'Seminario', 'Otro'], gridCols: 1 },
          { id: 'institution', label: 'Institución/Organizador', type: 'text', gridCols: 2 },
          { id: 'evidence', label: 'Evidencia (Convocatoria/Invitación)', type: 'textarea', gridCols: 2, helpText: 'Describa el documento que adjuntará.' },
        ]
      },
      {
        id: 'expenses',
        title: 'IV. Desglose de Gastos (Opcional)',
        fields: [
          { id: 'expRegistration', label: 'Inscripción ($)', type: 'currency', gridCols: 1 },
          { id: 'expFood', label: 'Alimentos ($)', type: 'currency', gridCols: 1 },
          { id: 'expLodging', label: 'Hospedaje ($)', type: 'currency', gridCols: 1 },
          { id: 'expTransport', label: 'Transporte ($)', type: 'currency', gridCols: 1 },
        ]
      },
      {
        id: 'signatures',
        title: 'V. Firmas',
        fields: [
          { id: 'directorName', label: 'Nombre del Director/Asesor (Vo.Bo.)', type: 'text', required: true, gridCols: 2 },
          { id: 'observations', label: 'Observaciones', type: 'textarea', gridCols: 2 },
        ]
      }
    ]
  },

  {
    id: 'student_field_trip',
    name: 'Estudiantes – Carta de Salida de Campo',
    description: 'Aviso oficial y solicitud de carta para salidas de campo.',
    icon: 'Map',
    sections: [
      {
        id: 'applicant',
        title: 'I. Datos del Solicitante',
        fields: [
          { id: 'fullName', label: 'Nombre Completo', type: 'text', required: true, gridCols: 2 },
          { id: 'personalId', label: 'Matrícula', type: 'text', required: true, gridCols: 1 },
          { id: 'program', label: 'Programa', type: 'text', required: true, gridCols: 1 },
          { id: 'email', label: 'Correo', type: 'email', gridCols: 1 },
          { id: 'phone', label: 'Teléfono', type: 'text', gridCols: 1 },
        ]
      },
      {
        id: 'period_place',
        title: 'II. Periodo y Lugar',
        fields: [
          { id: 'place', label: 'Lugar General', type: 'text', required: true, gridCols: 2 },
          { id: 'periodStart', label: 'Periodo Inicio', type: 'date', gridCols: 1 },
          { id: 'periodEnd', label: 'Periodo Fin', type: 'date', gridCols: 1 },
        ]
      },
      {
        id: 'details',
        title: 'III. Detalles de la Salida',
        fields: [
          { id: 'projectTitle', label: 'Título del Proyecto/Tesis', type: 'text', gridCols: 2 },
          { id: 'reason', label: 'Motivo', type: 'textarea', gridCols: 2 },
          { id: 'destination', label: 'Destino(s) Específico(s)', type: 'text', gridCols: 2 },
          { id: 'fieldDates', label: 'Fechas Actividad', type: 'text', gridCols: 2, placeholder: 'Describa días específicos si aplica' },
          { id: 'fieldResp', label: 'Responsable en Campo', type: 'text', required: true, gridCols: 2 },
          { id: 'risks', label: 'Riesgos / Seguridad', type: 'textarea', gridCols: 2, helpText: 'Mencione medidas de seguridad o riesgos potenciales.' },
          { id: 'specificObjectives', label: 'Objetivos Específicos', type: 'textarea', gridCols: 2 },
        ]
      },
      {
        id: 'signatures',
        title: 'IV. Firmas',
        fields: [
          { id: 'directorName', label: 'Nombre del Director/Asesor (Vo.Bo.)', type: 'text', required: true, gridCols: 2 },
          { id: 'observations', label: 'Observaciones', type: 'textarea', gridCols: 2 },
        ]
      }
    ]
  }
];

export const MOCK_HISTORY: GeneratedDocument[] = [
  {
    id: 'DOC-001',
    templateId: 'general_petition',
    templateName: 'Petición General',
    data: { fullName: 'Juan Pérez', subjectLine: 'Solicitud de extensión de plazo' },
    status: 'Pending Review',
    createdAt: '2023-10-25',
    applicant: 'Juan Pérez'
  },
  {
    id: 'DOC-002',
    templateId: 'academic_event',
    templateName: 'Evento Académico',
    data: { eventName: 'Simposio de Biología Tropical' },
    status: 'Approved',
    createdAt: '2023-10-20',
    applicant: 'Dra. Ana López'
  }
];

export const FOLDER_MAPPING: Record<string, string> = {
  'general_petition': 'General',
  'academic_event': 'Evento',
  'tutorial_committee': 'Comite',
  'institutional_endorsement': 'Aval',
  'academic_viaticos': 'Viaticos',
  'student_endorsement': 'AvalEstudiante',
  'student_external_course': 'CursosExternos',
  'student_field_trip': 'SalidaCampo'
};