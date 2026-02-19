// services/cloudService.ts
// Servicio actualizado para usar OneDrive real en lugar del sistema mock

import { FileSystemItem, GeneratedDocument } from '../types';
import { FOLDER_MAPPING } from '../constants';
import * as MicrosoftGraph from './microsoftGraphService';

// Convertir respuesta de Microsoft Graph a nuestro formato
const convertGraphItemToFileSystemItem = (item: any): FileSystemItem => {
  const isFolder = !!item.folder;
  return {
    id: item.id,
    name: item.name,
    type: isFolder ? 'folder' : 'file',
    fileType: isFolder ? 'folder' : (item.name.split('.').pop() || 'file') as any,
    path: item.parentReference?.path || '',
    updatedAt: new Date(item.lastModifiedDateTime).toISOString().split('T')[0],
    size: item.size ? `${Math.round(item.size / 1024)} KB` : undefined,
    children: isFolder ? [] : undefined,
  };
};

// Obtener el sistema de archivos desde OneDrive
export const getFileSystem = async (): Promise<FileSystemItem[]> => {
  try {
    // Verificar si está autenticado
    const isAuth = await MicrosoftGraph.isAuthenticated();
    if (!isAuth) {
      console.log('No autenticado, usando estructura mock');
      return getMockFileSystem();
    }

    // Intentar obtener la estructura desde OneDrive
    try {
      const rootFolder = await MicrosoftGraph.listFiles('SolicitudesAcademicas');
      
      // Construir árbol de archivos
      const root: FileSystemItem = {
        id: 'root',
        name: 'SolicitudesAcademicas',
        type: 'folder',
        path: '/me/drive/root:/SolicitudesAcademicas',
        fileType: 'folder',
        updatedAt: new Date().toISOString().split('T')[0],
        children: [],
      };

      // Cargar subcarpetas principales
      if (rootFolder.value) {
        for (const item of rootFolder.value) {
          const fileItem = convertGraphItemToFileSystemItem(item);
          
          // Si es carpeta, cargar sus hijos
          if (fileItem.type === 'folder') {
            try {
              const subItems = await MicrosoftGraph.listFiles(`SolicitudesAcademicas/${item.name}`);
              if (subItems.value) {
                fileItem.children = subItems.value.map(convertGraphItemToFileSystemItem);
              }
            } catch (error) {
              console.warn(`Error al cargar subcarpeta ${item.name}:`, error);
              fileItem.children = [];
            }
          }
          
          root.children!.push(fileItem);
        }
      }

      return [root];
    } catch (error) {
      console.warn('Error al cargar desde OneDrive, creando estructura inicial:', error);
      
      // Si no existe la estructura, crearla
      await MicrosoftGraph.createInitialFolderStructure();
      
      // Retornar estructura mock mientras se sincroniza
      return getMockFileSystem();
    }
  } catch (error) {
    console.error('Error en getFileSystem:', error);
    return getMockFileSystem();
  }
};

// Sistema de archivos mock (para desarrollo y fallback)
const getMockFileSystem = (): FileSystemItem[] => {
  return [
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
};

// Guardar documento en OneDrive
export const saveDocumentToCloud = async (
  doc: GeneratedDocument,
  docxBlob: Blob,
  pdfBlob: Blob
): Promise<boolean> => {
  try {
    // Verificar autenticación
    const isAuth = await MicrosoftGraph.isAuthenticated();
    if (!isAuth) {
      console.warn('No autenticado, documento no guardado en OneDrive');
      return false;
    }

    // Determinar carpeta de destino
    const folderName = FOLDER_MAPPING[doc.templateId] || 'General';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const baseFileName = `${doc.templateName.replace(/\s+/g, '_')}_${timestamp}_${doc.id}`;

    // Subir DOCX
    const docxPath = `SolicitudesAcademicas/Generados/${folderName}`;
    await MicrosoftGraph.uploadFile(
      `${baseFileName}.docx`,
      docxBlob,
      docxPath
    );
    console.log(`✅ DOCX guardado en: ${docxPath}/${baseFileName}.docx`);

    // Subir PDF
    const pdfPath = `SolicitudesAcademicas/PDFs/${folderName}`;
    await MicrosoftGraph.uploadFile(
      `${baseFileName}.pdf`,
      pdfBlob,
      pdfPath
    );
    console.log(`✅ PDF guardado en: ${pdfPath}/${baseFileName}.pdf`);

    // TODO: Actualizar Excel Maestro (requiere biblioteca adicional)
    console.log('📝 Excel maestro se actualizará en próxima versión');

    return true;
  } catch (error) {
    console.error('Error al guardar en OneDrive:', error);
    throw error;
  }
};

// Helper para encontrar un nodo por ID
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

// Refrescar el sistema de archivos desde OneDrive
export const refreshFileSystem = async (): Promise<FileSystemItem[]> => {
  return getFileSystem();
};
