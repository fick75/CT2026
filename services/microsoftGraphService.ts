// services/microsoftGraphService.ts
// Servicio para autenticación y operaciones con Microsoft Graph API (OneDrive y Outlook)

import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

// Configuración de MSAL (Microsoft Authentication Library)
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID || 'common'}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes necesarios para OneDrive y Outlook
const scopes = [
  'User.Read',
  'Files.ReadWrite',
  'Files.ReadWrite.All',
  'Sites.ReadWrite.All',
  'Mail.Send',
];

let msalInstance: PublicClientApplication | null = null;

// Inicializar MSAL
export const initializeMsal = async (): Promise<void> => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();
  }
};

// Iniciar sesión con Microsoft
export const signIn = async (): Promise<any> => {
  await initializeMsal();
  try {
    const loginResponse = await msalInstance!.loginPopup({
      scopes,
      prompt: 'select_account',
    });
    return loginResponse.account;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Cerrar sesión
export const signOut = async (): Promise<void> => {
  await initializeMsal();
  const account = msalInstance!.getAllAccounts()[0];
  if (account) {
    await msalInstance!.logoutPopup({ account });
  }
};

// Obtener token de acceso
export const getAccessToken = async (): Promise<string> => {
  await initializeMsal();
  const accounts = msalInstance!.getAllAccounts();
  
  if (accounts.length === 0) {
    throw new Error('No hay sesión activa');
  }

  const request = {
    scopes,
    account: accounts[0],
  };

  try {
    const response = await msalInstance!.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      const response = await msalInstance!.acquireTokenPopup(request);
      return response.accessToken;
    }
    throw error;
  }
};

// Verificar si hay sesión activa
export const isAuthenticated = async (): Promise<boolean> => {
  await initializeMsal();
  const accounts = msalInstance!.getAllAccounts();
  return accounts.length > 0;
};

// Obtener información del usuario
export const getCurrentUser = async (): Promise<any> => {
  await initializeMsal();
  const accounts = msalInstance!.getAllAccounts();
  if (accounts.length > 0) {
    return accounts[0];
  }
  return null;
};

// ==================== OPERACIONES CON ONEDRIVE ====================

// Crear carpeta en OneDrive
export const createFolder = async (folderName: string, parentPath: string = ''): Promise<any> => {
  const token = await getAccessToken();
  const endpoint = parentPath 
    ? `https://graph.microsoft.com/v1.0/me/drive/root:/${parentPath}:/children`
    : 'https://graph.microsoft.com/v1.0/me/drive/root/children';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'rename',
    }),
  });

  if (!response.ok) {
    throw new Error(`Error al crear carpeta: ${response.statusText}`);
  }

  return response.json();
};

// Subir archivo a OneDrive
export const uploadFile = async (
  fileName: string,
  fileContent: Blob,
  folderPath: string = ''
): Promise<any> => {
  const token = await getAccessToken();
  const path = folderPath ? `${folderPath}/${fileName}` : fileName;
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/root:/${path}:/content`;

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
    },
    body: fileContent,
  });

  if (!response.ok) {
    throw new Error(`Error al subir archivo: ${response.statusText}`);
  }

  return response.json();
};

// Listar archivos y carpetas en OneDrive
export const listFiles = async (folderPath: string = ''): Promise<any> => {
  const token = await getAccessToken();
  const endpoint = folderPath
    ? `https://graph.microsoft.com/v1.0/me/drive/root:/${folderPath}:/children`
    : 'https://graph.microsoft.com/v1.0/me/drive/root/children';

  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al listar archivos: ${response.statusText}`);
  }

  return response.json();
};

// Descargar archivo de OneDrive
export const downloadFile = async (itemId: string): Promise<Blob> => {
  const token = await getAccessToken();
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/content`;

  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al descargar archivo: ${response.statusText}`);
  }

  return response.blob();
};

// Crear estructura de carpetas inicial
export const createInitialFolderStructure = async (): Promise<void> => {
  try {
    // Crear carpeta raíz
    await createFolder('SolicitudesAcademicas');

    // Crear subcarpetas
    const subfolders = ['Plantillas', 'Generados', 'PDFs'];
    for (const folder of subfolders) {
      await createFolder(folder, 'SolicitudesAcademicas');
    }

    // Crear carpetas por tipo de documento
    const documentTypes = ['Movilidad', 'Comite', 'Evento', 'Aval', 'Apoyo', 'General'];
    for (const type of documentTypes) {
      await createFolder(type, 'SolicitudesAcademicas/Generados');
      await createFolder(type, 'SolicitudesAcademicas/PDFs');
    }

    console.log('✅ Estructura de carpetas creada en OneDrive');
  } catch (error) {
    console.error('Error al crear estructura de carpetas:', error);
    // Si las carpetas ya existen, no es un error crítico
  }
};

// ==================== OPERACIONES CON OUTLOOK ====================

// Enviar correo con adjunto
export const sendEmail = async (
  to: string[],
  subject: string,
  body: string,
  attachments?: Array<{ name: string; content: string; contentType: string }>
): Promise<void> => {
  const token = await getAccessToken();
  const endpoint = 'https://graph.microsoft.com/v1.0/me/sendMail';

  const message: any = {
    message: {
      subject,
      body: {
        contentType: 'HTML',
        content: body,
      },
      toRecipients: to.map((email) => ({
        emailAddress: {
          address: email,
        },
      })),
    },
  };

  // Agregar adjuntos si existen
  if (attachments && attachments.length > 0) {
    message.message.attachments = attachments.map((att) => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: att.name,
      contentType: att.contentType,
      contentBytes: att.content,
    }));
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al enviar correo: ${errorData.error?.message || response.statusText}`);
  }

  console.log('✅ Correo enviado exitosamente');
};

// Convertir Blob a Base64 para adjuntos
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default {
  signIn,
  signOut,
  getAccessToken,
  isAuthenticated,
  getCurrentUser,
  createFolder,
  uploadFile,
  listFiles,
  downloadFile,
  createInitialFolderStructure,
  sendEmail,
  blobToBase64,
};
