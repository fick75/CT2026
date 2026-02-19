import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TemplateGallery } from './components/TemplateGallery';
import { FormEditor } from './components/FormEditor';
import { DocumentPreview } from './components/DocumentPreview';
import { EmailModal } from './components/EmailModal';
import { RepositoryView } from './components/RepositoryView';
import { DocumentTemplate, DocumentData, GeneratedDocument, UserRole } from './types';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('user'); // Default to user view
  const [currentView, setCurrentView] = useState('create'); // User starts at creation
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [currentDocument, setCurrentDocument] = useState<GeneratedDocument | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Navigation Logic
  const handleTabChange = (tab: string) => {
    setCurrentView(tab);
    // Reset selection states when navigating away from specific document flows
    if (tab === 'dashboard' || tab === 'create' || tab === 'repo' || tab === 'history') {
      setSelectedTemplate(null);
      setCurrentDocument(null);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    // Redirect to the appropriate home page for the role
    if (role === 'admin') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('create');
    }
    // Clean state
    setSelectedTemplate(null);
    setCurrentDocument(null);
  };

  // Flow: Select Template -> Edit Form -> Save/Preview -> Preview View
  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('editor');
  };

  const handleSaveForm = (data: DocumentData) => {
    if (!selectedTemplate) return;

    const newDoc: GeneratedDocument = {
      id: `DOC-${Math.floor(Math.random() * 10000)}`,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      data: data,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      applicant: data.fullName || 'Usuario Actual'
    };

    setCurrentDocument(newDoc);
    setCurrentView('preview');
  };

  const handlePreviewFromEditor = (data: DocumentData) => {
     handleSaveForm(data); // In this simplified flow, preview saves as draft
  };

  const handleBackToEditor = () => {
    setCurrentView('editor');
  };

  const handleOpenEmail = (doc: GeneratedDocument) => {
    setCurrentDocument(doc);
    setEmailModalOpen(true);
  };

  return (
    <Layout 
        activeTab={currentView === 'editor' || currentView === 'preview' ? (currentRole === 'user' ? 'create' : 'repo') : currentView} 
        onChangeTab={handleTabChange}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
    >
      
      {/* Admin Views */}
      {currentRole === 'admin' && currentView === 'dashboard' && <Dashboard />}
      {currentRole === 'admin' && currentView === 'repo' && <RepositoryView />}

      {/* User Views */}
      {currentRole === 'user' && currentView === 'create' && <TemplateGallery onSelect={handleTemplateSelect} />}
      
      {/* Shared / Specific Views */}
      {currentView === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
             {currentRole === 'admin' ? 'Historial Global de Solicitudes' : 'Mis Solicitudes Enviadas'}
          </h2>
          {currentRole === 'admin' ? (
              <p className="text-gray-500">Aquí el administrador vería TODAS las solicitudes de todos los alumnos, con opciones para Aprobar o Rechazar.</p>
          ) : (
              <p className="text-gray-500">Aquí el estudiante vería solo SUS propias solicitudes y el estado actual de las mismas.</p>
          )}
          <div className="mt-8 border-t pt-8">
            <p className="text-sm text-gray-400 italic">Datos simulados en esta versión demo.</p>
          </div>
        </div>
      )}

      {currentView === 'settings' && (
         <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-bold mb-2">Configuración del Sistema</h2>
            <p>Gestión de usuarios, permisos y parámetros del sistema.</p>
         </div>
      )}

      {currentView === 'editor' && selectedTemplate && (
        <FormEditor 
          template={selectedTemplate} 
          onSave={handleSaveForm}
          onPreview={handlePreviewFromEditor}
          onCancel={() => handleTabChange('create')} 
        />
      )}

      {currentView === 'preview' && currentDocument && (
        <DocumentPreview 
          document={currentDocument} 
          onBack={handleBackToEditor}
          onSendEmail={handleOpenEmail}
        />
      )}

      <EmailModal 
        isOpen={emailModalOpen} 
        onClose={() => setEmailModalOpen(false)} 
        document={currentDocument} 
      />
    </Layout>
  );
};

export default App;