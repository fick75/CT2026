import React, { useState } from 'react';
import { Sparkles, Save, ArrowLeft, Eye, X } from 'lucide-react';
import { DocumentTemplate, DocumentData } from '../types';
import { improveText } from '../services/geminiService';

interface Props {
  template: DocumentTemplate;
  onSave: (data: DocumentData) => void;
  onCancel: () => void;
  onPreview: (data: DocumentData) => void;
}

export const FormEditor: React.FC<Props> = ({ template, onSave, onCancel, onPreview }) => {
  const [formData, setFormData] = useState<DocumentData>({});
  const [isImproving, setIsImproving] = useState<string | null>(null);

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleImprove = async (fieldId: string, label: string) => {
    const currentText = formData[fieldId];
    if (!currentText) return;

    setIsImproving(fieldId);
    const improved = await improveText(currentText, label);
    setFormData((prev) => ({ ...prev, [fieldId]: improved }));
    setIsImproving(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[calc(100vh-140px)] animate-fade-in">
      
      {/* Form Area */}
      <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
             <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
                 <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
             </button>
             <div>
                <h2 className="text-lg font-bold text-slate-800">{template.name}</h2>
                <p className="text-xs text-slate-500">Modo de edición</p>
             </div>
          </div>
          <div className="flex space-x-3">
             <button 
                onClick={onCancel} 
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
             >
                Cancelar
             </button>
             <button 
               onClick={() => onSave(formData)}
               className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-500/20 active:scale-95 transform duration-100"
             >
               <Save className="w-4 h-4 mr-2" />
               Guardar y Continuar
             </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
          {template.sections.map((section) => (
            <div key={section.id} className="space-y-5 animate-slide-up">
              <div className="flex items-center space-x-4">
                  <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider whitespace-nowrap">{section.title}</h3>
                  <div className="h-px bg-slate-200 w-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <div 
                    key={field.id} 
                    className={`${field.gridCols === 1 ? 'md:col-span-1' : 'md:col-span-2'} group`}
                  >
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700 group-focus-within:text-blue-600 transition-colors">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        
                        {/* AI Button for textareas */}
                        {field.type === 'textarea' && (
                            <button
                                type="button"
                                onClick={() => handleImprove(field.id, field.label)}
                                disabled={isImproving === field.id || !formData[field.id]}
                                className={`
                                    flex items-center text-xs px-2 py-1 rounded-full transition-all
                                    ${isImproving === field.id 
                                        ? 'bg-purple-100 text-purple-700 cursor-wait' 
                                        : 'text-purple-600 hover:bg-purple-50 hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed'}
                                `}
                            >
                                <Sparkles className={`w-3 h-3 mr-1 ${isImproving === field.id ? 'animate-spin' : ''}`} />
                                {isImproving === field.id ? 'Mejorando redacción...' : 'Mejorar con IA'}
                            </button>
                        )}
                    </div>
                    
                    <div className="relative">
                        {field.type === 'textarea' ? (
                        <div className="relative">
                            <textarea
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 resize-y min-h-[100px]"
                                rows={4}
                                placeholder={field.placeholder || "Escriba aquí..."}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                            />
                            {/* Magic Glow Effect if Improving */}
                            {isImproving === field.id && (
                                <div className="absolute inset-0 rounded-xl ring-2 ring-purple-400 ring-offset-2 animate-pulse pointer-events-none"></div>
                            )}
                        </div>
                        ) : field.type === 'select' ? (
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
                                value={formData[field.id] || ''}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                            >
                                <option value="">Seleccionar una opción...</option>
                                {field.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        ) : (
                        <input
                            type={field.type === 'currency' ? 'number' : field.type}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 transition-all"
                            placeholder={field.placeholder}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        />
                        )}
                    </div>
                    {field.helpText && <p className="text-xs text-slate-400 mt-1.5 ml-1">{field.helpText}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="h-10"></div> {/* Bottom Spacer */}
        </div>
      </div>

      {/* Live Preview / Helper Side */}
      <div className="hidden xl:block bg-slate-100 rounded-2xl border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa Dinámica
        </h3>
        
        <div className="flex-1 bg-white shadow-xl rounded-sm p-8 text-[10px] text-slate-800 overflow-y-auto relative custom-scrollbar transform transition-transform hover:scale-[1.01] duration-500">
            {/* Skeletal preview of the PDF */}
            <div className="w-full h-5 bg-blue-900 mb-8 flex items-center px-2">
                 <div className="w-20 h-1 bg-white/20 rounded"></div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-black pb-2">
                    <div className="space-y-2 w-1/2">
                        <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
                        <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                    </div>
                    <div className="text-right">
                         <div className="h-3 w-20 bg-slate-800 rounded mb-1 ml-auto"></div>
                         <div className="h-2 w-24 bg-slate-200 rounded ml-auto"></div>
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    {/* Render live fields */}
                    {template.sections.flatMap(s => s.fields).slice(0, 8).map((field) => (
                        <div key={field.id} className="grid grid-cols-3 gap-2 border-b border-slate-50 py-1.5">
                            <span className="font-bold text-slate-400 uppercase text-[8px] col-span-1">{field.label}:</span>
                            <span className="col-span-2 font-serif text-slate-700 break-words">
                                {formData[field.id] || <span className="text-slate-200 italic">...</span>}
                            </span>
                        </div>
                    ))}
                    {Object.keys(formData).length > 8 && (
                        <div className="text-center text-slate-300 italic py-4">
                            + {Object.keys(formData).length - 8} campos adicionales...
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
                 <div className="border-t border-black pt-2 flex justify-between">
                     <div className="w-20 h-2 bg-slate-200 rounded"></div>
                     <div className="w-20 h-2 bg-slate-200 rounded"></div>
                 </div>
            </div>
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="transform -rotate-45 border-4 border-slate-100 text-slate-100 text-4xl font-black p-4 rounded-xl opacity-50 uppercase">
                    Borrador
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};