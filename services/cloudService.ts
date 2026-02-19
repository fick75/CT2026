import { FileSystemItem, GeneratedDocument } from '../types';
import { FOLDER_MAPPING } from '../constants';

// Initial Mock Structure matching the user requirement
let fileSystem: FileSystemItem[] = [
  {
    id: 'root',
    name: 'SolicitudesAcademicas',
    type: 'folder',
    path: '/sites/CITRO/SolicitudesAcademicas',
    fileType: 'folder',
    updatedAt: '2023-10-01',
    children: [
      {
        id: 'templates',
        name: 'Plantillas',
        type: 'folder',
        path: '/sites/CITRO/SolicitudesAcademicas/Plantillas',
        fileType: 'folder',
        updatedAt: '2023-10-01',
        children: [
          { id: 'tpl1', name: 'Plantilla_Movilidad.docx', type: 'file', fileType: 'docx', path: '', updatedAt: '2023-09-01' },
          { id: 'tpl2', name: 'Plantilla_Comite.docx', type: 'file', fileType: 'docx', path: '', updatedAt: '2023-09-01' },
          { id: 'tpl3', name: 'Plantilla_Evento.docx', type: 'file', fileType: 'docx', path: '', updatedAt: '2023-09-01' },
          { id: 'tpl4', name: 'Plantilla_Aval.docx', type: 'file', fileType: 'docx', path: '', updatedAt: '2023-09-01' },
          { id: 'tpl5', name: 'Plantilla_Apoyo.docx', type: 'file', fileType: 'docx', path: '', updatedAt: '2023-09-01' },
          { id: 'tpl6', name: 'Plantilla_General.docx', type: 'file', fileType: 'docx', path: '', updatedAt: '2023-09-01' },
        ]
      },
      {
        id: 'generated',
        name: 'Generados',
        type: 'folder',
        path: '/sites/CITRO/SolicitudesAcademicas/Generados',
        fileType: 'folder',
        updatedAt: '2023-10-01',
        children: [
          { id: 'gen_mov', name: 'Movilidad', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
          { id: 'gen_com', name: 'Comite', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
          { id: 'gen_eve', name: 'Evento', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
          { id: 'gen_ava', name: 'Aval', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
          { id: 'gen_apo', name: 'Apoyo', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
          { id: 'gen_gen', name: 'General', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
        ]
      },
      {
        id: 'pdfs',
        name: 'PDFs',
        type: 'folder',
        path: '/sites/CITRO/SolicitudesAcademicas/PDFs',
        fileType: 'folder',
        updatedAt: '2023-10-01',
        children: [
            { id: 'pdf_mov', name: 'Movilidad', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
            { id: 'pdf_com', name: 'Comite', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
            { id: 'pdf_eve', name: 'Evento', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
            { id: 'pdf_ava', name: 'Aval', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
            { id: 'pdf_apo', name: 'Apoyo', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
            { id: 'pdf_gen', name: 'General', type: 'folder', fileType: 'folder', path: '', updatedAt: '2023-10-01', children: [] },
        ]
      },
      {
        id: 'master_excel',
        name: 'Excel_Maestro_Solicitudes.xlsx',
        type: 'file',
        fileType: 'xlsx',
        path: '/sites/CITRO/SolicitudesAcademicas/Excel_Maestro_Solicitudes.xlsx',
        updatedAt: new Date().toISOString().split('T')[0]
      }
    ]
  }
];

export const getFileSystem = (): FileSystemItem[] => fileSystem;

export const saveDocumentToCloud = async (doc: GeneratedDocument): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Identify Target Folders
      const folderName = FOLDER_MAPPING[doc.templateId] || 'General';
      const root = fileSystem[0];
      
      const generatedFolder = root.children?.find(c => c.name === 'Generados')?.children?.find(c => c.name === folderName);
      const pdfFolder = root.children?.find(c => c.name === 'PDFs')?.children?.find(c => c.name === folderName);

      // 2. Create File Entries
      const newFileDocx: FileSystemItem = {
        id: `file_${Date.now()}_docx`,
        name: `${doc.templateName.replace(/\s+/g, '_')}_${doc.id}.docx`,
        type: 'file',
        fileType: 'docx',
        path: '',
        updatedAt: new Date().toISOString().split('T')[0],
        size: '15 KB'
      };

      const newFilePdf: FileSystemItem = {
        id: `file_${Date.now()}_pdf`,
        name: `${doc.templateName.replace(/\s+/g, '_')}_${doc.id}.pdf`,
        type: 'file',
        fileType: 'pdf',
        path: '',
        updatedAt: new Date().toISOString().split('T')[0],
        size: '145 KB'
      };

      // 3. Add to "Virtual" File System
      if (generatedFolder && !generatedFolder.children?.find(f => f.name === newFileDocx.name)) {
        generatedFolder.children?.push(newFileDocx);
      }
      if (pdfFolder && !pdfFolder.children?.find(f => f.name === newFilePdf.name)) {
        pdfFolder.children?.push(newFilePdf);
      }

      // 4. Update Master Excel timestamp
      const masterExcel = root.children?.find(c => c.name === 'Excel_Maestro_Solicitudes.xlsx');
      if (masterExcel) {
        masterExcel.updatedAt = new Date().toISOString();
      }

      console.log('Document synced to Cloud:', doc.id);
      resolve(true);
    }, 1500); // Simulate network latency
  });
};

// Helper to find a node by ID (for UI navigation)
export const findNodeById = (nodes: FileSystemItem[], id: string): FileSystemItem | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};