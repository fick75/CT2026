import React from 'react';
import * as Icons from 'lucide-react';
import { TEMPLATES } from '../constants';
import { DocumentTemplate } from '../types';

interface Props {
  onSelect: (template: DocumentTemplate) => void;
}

export const TemplateGallery: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="space-y-8 pb-10">
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Nueva Solicitud</h2>
        <p className="text-slate-500 mt-2 text-lg">Seleccione el tipo de documento que desea generar para comenzar.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template, index) => {
          // Dynamic Icon loading
          const IconComponent = (Icons as any)[template.icon] || Icons.FileText;

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`
                group relative flex flex-col text-left bg-white border border-slate-200 rounded-2xl p-6 
                shadow-sm hover:shadow-xl hover:border-blue-400/50 
                transition-all duration-300 transform hover:-translate-y-1
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                   <IconComponent className="w-24 h-24 text-blue-600 transform rotate-12" />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <IconComponent className="w-7 h-7" />
              </div>
              
              <div className="relative z-10">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                      {template.name}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {template.description}
                  </p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50 relative z-10 flex items-center text-blue-600 text-sm font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
                <span>Comenzar trámite</span>
                <Icons.ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};