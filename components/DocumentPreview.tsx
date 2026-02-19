import React, { useState } from 'react';
import { ArrowLeft, Mail, FileText, FileType, CloudUpload, Check } from 'lucide-react';
import { GeneratedDocument } from '../types';
import { generatePDF } from '../services/pdfGenerator';
import { generateDOCX } from '../services/docxGenerator';
import { saveDocumentToCloud } from '../services/cloudService';
import { TEMPLATES } from '../constants';

interface Props {
  document: GeneratedDocument;
  onBack: () => void;
  onSendEmail: (doc: GeneratedDocument) => void;
}

export const DocumentPreview: React.FC<Props> = ({ document: doc, onBack, onSendEmail }) => {
  const template = TEMPLATES.find(t => t.id === doc.templateId);
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  const handleDownloadPDF = () => {
    if (!template) return;
    const pdfBlob = generatePDF(template, doc.data);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.templateName.replace(/\s+/g, '_')}_${doc.id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDOCX = async () => {
      if (!template) return;
      setIsGeneratingDocx(true);
      try {
        const docxBlob = await generateDOCX(template, doc.data);
        const url = URL.createObjectURL(docxBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${doc.templateName.replace(/\s+/g, '_')}_${doc.id}.docx`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
          console.error("Error generating DOCX", error);
          alert("Error al generar el archivo DOCX");
      } finally {
          setIsGeneratingDocx(false);
      }
  };

  const handleSyncToCloud = async () => {
      setIsSyncing(true);
      await saveDocumentToCloud(doc);
      setIsSyncing(false);
      setSynced(true);
  };

  if (!template) return <div>Error: Plantilla no encontrada</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between sticky top-4 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors px-2">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Volver a editar</span>
        </button>
        
        <div className="flex space-x-2">
          {/* Cloud Sync Button */}
          <button 
             onClick={handleSyncToCloud}
             disabled={isSyncing || synced}
             className={`flex items-center px-4 py-2 border rounded-xl transition-all duration-300 transform active:scale-95
                ${synced 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }
             `}
          >
             {isSyncing ? (
                 <span className="flex items-center"><div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>Sincronizando...</span>
             ) : synced ? (
                 <span className="flex items-center"><Check className="w-4 h-4 mr-2" />Sincronizado</span>
             ) : (
                 <span className="flex items-center"><CloudUpload className="w-4 h-4 mr-2 text-blue-500" />Sincronizar Nube</span>
             )}
          </button>

          <div className="h-auto w-px bg-slate-200 mx-2"></div>

          <button 
            onClick={handleDownloadDOCX}
            disabled={isGeneratingDocx}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all disabled:opacity-50"
            title="Descargar Editable"
          >
            {isGeneratingDocx ? (
                <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent mr-2"></div>
            ) : (
                <FileType className="w-4 h-4 mr-2 text-blue-600" />
            )}
            DOCX
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all"
            title="Descargar PDF Oficial"
          >
            <FileText className="w-4 h-4 mr-2 text-red-600" />
            PDF
          </button>
          <button 
            onClick={() => onSendEmail(doc)}
            className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar
          </button>
        </div>
      </div>

      {/* Realistic Paper Preview */}
      <div className="bg-white shadow-2xl rounded-sm min-h-[1000px] p-16 relative mx-auto max-w-[850px] animate-slide-up delay-100 ring-1 ring-black/5">
        
        {/* Paper Texture/Gradient overlay for realism */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/30 pointer-events-none rounded-sm"></div>

        <div className="relative z-10 font-serif text-slate-900">
            {/* Header */}
            <div className="bg-[#003366] h-10 mb-8 w-full print:bg-[#003366]"></div>
            
            <h1 className="text-2xl font-bold text-center mb-2 uppercase text-[#003366] tracking-wide">{template.name}</h1>
            <div className="border-t-2 border-black mb-1 mx-auto w-full"></div>
            <div className="border-t border-black mb-10 mx-auto w-full"></div>

            {/* Content */}
            <div className="space-y-10">
                {template.sections.map((section) => (
                    <div key={section.id}>
                        <div className="bg-[#003366] text-white font-bold text-sm px-4 py-1.5 mb-4 uppercase tracking-wider inline-block w-full">
                            {section.title}
                        </div>
                        <div className="border-b border-black mb-6"></div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm leading-relaxed">
                            {section.fields.map(field => (
                                <div key={field.id} className={`${field.gridCols === 2 || field.type === 'textarea' ? 'col-span-2' : 'col-span-1'}`}>
                                    <span className="font-bold block text-slate-800 mb-1">{field.label}:</span>
                                    <div className={`border-b border-slate-300 pb-1 text-slate-700 ${field.type === 'textarea' ? 'whitespace-pre-wrap min-h-[3rem]' : ''}`}>
                                        {doc.data[field.id] || <span className="text-slate-300 italic">____________________________</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-24 pt-12 border-t border-slate-200 text-center">
                <div className="w-64 mx-auto border-t border-black mb-4"></div>
                <p className="font-bold uppercase tracking-wide text-sm">Firma del Solicitante</p>
                <p className="text-sm mt-2 text-slate-500">Fecha: {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Council Box */}
            <div className="mt-16 border-2 border-black p-1">
                <div className="bg-[#003366] text-white font-bold text-center py-2 uppercase text-xs tracking-widest">
                    Para uso exclusivo del Consejo Técnico
                </div>
                <div className="p-6 grid grid-cols-2 gap-8 mt-2 text-sm">
                    <div><span className="font-bold">Estado:</span> ___________________</div>
                    <div><span className="font-bold">Aprobado por:</span> ___________________</div>
                    <div className="col-span-2 mt-4"><span className="font-bold">Observaciones:</span> <br/><div className="mt-6 border-b border-slate-300"></div></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};