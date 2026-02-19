#!/bin/bash

# Script de instalación y configuración de DocuGen Pro
# Este script automatiza la configuración inicial de la aplicación

echo "================================================"
echo "   DocuGen Pro - Instalación Automatizada      "
echo "================================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "   Por favor ejecuta este script desde la carpeta raíz del proyecto"
    exit 1
fi

echo "📦 Paso 1: Actualizando archivos del proyecto..."

# Copiar archivos actualizados
if [ -f "package_updated.json" ]; then
    cp package_updated.json package.json
    echo "   ✅ package.json actualizado"
else
    echo "   ⚠️  No se encontró package_updated.json, usando package.json existente"
fi

if [ -f "services/cloudService_updated.ts" ]; then
    cp services/cloudService_updated.ts services/cloudService.ts
    echo "   ✅ cloudService.ts actualizado"
fi

if [ -f "components/EmailModal_updated.tsx" ]; then
    cp components/EmailModal_updated.tsx components/EmailModal.tsx
    echo "   ✅ EmailModal.tsx actualizado"
fi

if [ -f ".env.local.example" ] && [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    echo "   ✅ .env.local creado desde ejemplo"
else
    echo "   ℹ️  .env.local ya existe, no se sobrescribe"
fi

echo ""
echo "📚 Paso 2: Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "   ✅ Dependencias instaladas correctamente"
else
    echo "   ❌ Error al instalar dependencias"
    exit 1
fi

echo ""
echo "================================================"
echo "   ✅ Instalación completada exitosamente      "
echo "================================================"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Configura tus variables de entorno en .env.local:"
echo "   - GEMINI_API_KEY"
echo "   - VITE_CLIENT_ID (después de registrar en Azure)"
echo "   - VITE_TENANT_ID (usa 'common' por defecto)"
echo ""
echo "2. Registra tu aplicación en Azure Portal:"
echo "   https://portal.azure.com"
echo ""
echo "3. Ejecuta la aplicación localmente:"
echo "   npm run dev"
echo ""
echo "4. Abre en tu navegador:"
echo "   http://localhost:5173"
echo ""
echo "📖 Consulta las guías completas en:"
echo "   - GUIA_RAPIDA_5_PASOS.md (inicio rápido)"
echo "   - GUIA_DESPLIEGUE_ONEDRIVE_OUTLOOK.md (guía completa)"
echo ""
echo "================================================"
