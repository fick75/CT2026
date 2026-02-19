# 📄 DocuGen Pro - Sistema de Generación de Documentos Académicos

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OneDrive](https://img.shields.io/badge/OneDrive-Integrated-0078D4?logo=microsoft-onedrive)](https://onedrive.live.com)
[![Outlook](https://img.shields.io/badge/Outlook-Integrated-0078D4?logo=microsoft-outlook)](https://outlook.com)

Sistema completo para generar, gestionar y enviar documentos académicos con integración a OneDrive y Outlook.

![DocuGen Pro](https://via.placeholder.com/1200x400/3b82f6/ffffff?text=DocuGen+Pro+-+Generación+de+Documentos+Académicos)

## 🌟 Características

- ✅ **Generación automática de documentos** DOCX y PDF
- ✅ **Almacenamiento en OneDrive** - Sincronización automática en la nube
- ✅ **Envío de correos con Outlook** - Adjuntos automáticos
- ✅ **Múltiples plantillas** - Movilidad, Comité, Eventos, Aval, Apoyo, General
- ✅ **Excel maestro** - Registro automático de todas las solicitudes
- ✅ **Interfaz moderna** - Diseño intuitivo y responsive
- ✅ **IA integrada** - Asistencia con Google Gemini
- ✅ **100% Gratis** - Alojamiento en Vercel y OneDrive gratuito

## 🚀 Inicio Rápido

### Opción 1: Instalación Automatizada

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/docugen-pro.git
cd docugen-pro

# Ejecutar script de instalación
chmod +x install.sh
./install.sh

# Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

### Opción 2: Instalación Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📚 Documentación

- **[Guía Rápida de 5 Pasos](GUIA_RAPIDA_5_PASOS.md)** - Configuración completa en 30 minutos
- **[Guía Completa de Despliegue](GUIA_DESPLIEGUE_ONEDRIVE_OUTLOOK.md)** - Documentación detallada

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Gemini AI
GEMINI_API_KEY=tu-gemini-api-key

# Microsoft Azure AD
VITE_CLIENT_ID=tu-azure-client-id
VITE_TENANT_ID=common
```

### Obtener Credenciales

1. **Gemini API Key**: https://makersuite.google.com/app/apikey
2. **Azure App Registration**: https://portal.azure.com
   - Sigue la [Guía Rápida](GUIA_RAPIDA_5_PASOS.md) para configurar Azure

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Generación de Documentos**: docx, jspdf
- **Autenticación**: Microsoft MSAL (Azure AD)
- **Almacenamiento**: Microsoft Graph API (OneDrive)
- **Correo**: Microsoft Graph API (Outlook)
- **IA**: Google Gemini
- **Deploy**: Vercel

### Estructura del Proyecto

```
docugen-pro/
├── components/           # Componentes React
│   ├── Dashboard.tsx
│   ├── FormEditor.tsx
│   ├── EmailModal.tsx    # Modal para enviar correos
│   ├── MicrosoftAuth.tsx # Autenticación con Microsoft
│   └── ...
├── services/             # Servicios y APIs
│   ├── cloudService.ts   # Integración con OneDrive
│   ├── microsoftGraphService.ts  # Microsoft Graph API
│   ├── docxGenerator.ts  # Generación de DOCX
│   └── pdfGenerator.ts   # Generación de PDF
├── constants.ts          # Constantes y configuración
├── types.ts              # Definiciones de TypeScript
└── App.tsx               # Componente principal
```

## 📦 Despliegue

### Desplegar en Vercel (Recomendado)

1. **Push a GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Conectar con Vercel**:
   - Ve a https://vercel.com/new
   - Importa tu repositorio
   - Configura las variables de entorno
   - Deploy

3. **Actualizar Redirect URI en Azure**:
   - Agrega tu URL de Vercel en Azure Portal
   - Sigue la [Guía de Despliegue](GUIA_DESPLIEGUE_ONEDRIVE_OUTLOOK.md)

### Otras Opciones de Hosting

- **Netlify**: Similar a Vercel, también gratis
- **GitHub Pages**: Solo para apps estáticas
- **Railway**: Alternativa con plan gratuito

## 🔐 Seguridad

- ✅ Autenticación OAuth 2.0 con Microsoft
- ✅ Tokens de acceso con expiración automática
- ✅ Permisos granulares (solo lo necesario)
- ✅ Variables de entorno para credenciales
- ✅ HTTPS obligatorio en producción

## 🗂️ Estructura de OneDrive

La aplicación crea automáticamente esta estructura en tu OneDrive:

```
OneDrive/
└── SolicitudesAcademicas/
    ├── Plantillas/           # Plantillas de documentos
    ├── Generados/            # Documentos DOCX generados
    │   ├── Movilidad/
    │   ├── Comite/
    │   ├── Evento/
    │   ├── Aval/
    │   ├── Apoyo/
    │   └── General/
    ├── PDFs/                 # Documentos PDF generados
    │   └── [mismas subcarpetas]
    └── Excel_Maestro_Solicitudes.xlsx
```

## 📧 Envío de Correos

Los correos se envían desde tu cuenta de Outlook/Microsoft 365:

- ✅ Adjuntos automáticos (DOCX o PDF)
- ✅ Múltiples destinatarios
- ✅ HTML personalizable
- ✅ Historial en tu carpeta "Enviados"

## 💰 Costos

| Servicio | Plan Gratuito | Uso Típico |
|----------|---------------|------------|
| **Vercel** | 100GB/mes bandwidth | Suficiente para 1000+ usuarios/mes |
| **OneDrive** | 5GB | ~5000 documentos |
| **Outlook** | Ilimitado | Sin límites |
| **Azure AD** | Gratis | Autenticación básica |
| **Gemini AI** | 60 req/min | Más que suficiente |

**Total mensual: $0** ✅

### Upgrade Opcional

- OneDrive 100GB: $1.99/mes
- Microsoft 365 Personal: $6.99/mes (1TB + Office)

## 🛠️ Desarrollo

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Compila para producción
npm run preview          # Preview de build de producción

# Deploy
npm run deploy           # Build + Deploy a Vercel
```

### Agregar Nuevas Plantillas

1. Define la plantilla en `constants.ts`:
```typescript
export const TEMPLATES = {
  // ... plantillas existentes
  nueva_plantilla: {
    id: 'nueva',
    name: 'Nueva Plantilla',
    fields: [...]
  }
};
```

2. Agrega el mapeo de carpetas:
```typescript
export const FOLDER_MAPPING = {
  // ... mappings existentes
  'nueva': 'NuevaCarpeta'
};
```

## 🐛 Solución de Problemas

### Error: "Client ID no configurado"
- Verifica variables de entorno en Vercel
- Redeploy después de agregar variables

### Error al iniciar sesión
- Verifica redirect URI en Azure
- Confirma permisos aprobados (Grant admin consent)

### Error al guardar en OneDrive
- Cierra sesión y vuelve a iniciar
- Verifica permisos en Azure Portal

Ver más en [Guía de Solución de Problemas](GUIA_RAPIDA_5_PASOS.md#-solución-de-problemas-comunes)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 🙏 Agradecimientos

- [Microsoft Graph API](https://docs.microsoft.com/graph)
- [Vercel](https://vercel.com) por el hosting gratuito
- [Google Gemini](https://deepmind.google/technologies/gemini/) por la IA
- [Lucide Icons](https://lucide.dev) por los iconos

## 📞 Soporte

- 📧 Email: soporte@ejemplo.com
- 📖 Documentación: [Ver guías](GUIA_RAPIDA_5_PASOS.md)
- 🐛 Issues: [GitHub Issues](https://github.com/TU_USUARIO/docugen-pro/issues)

---

**Desarrollado con ❤️ para facilitar la gestión de documentos académicos**
