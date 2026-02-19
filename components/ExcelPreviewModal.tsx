import React from 'react';
import { X, FileSpreadsheet } from 'lucide-react';
import { MOCK_HISTORY, FOLDER_MAPPING } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelPreviewModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Tabs for the simulated excel
  const tabs = ['TablaMovilidad', 'TablaComite', 'TablaEvento', 'TablaAval', 'TablaApoyo', 'TablaGeneral'];
  const [activeTab, setActiveTab] = React.useState('TablaGeneral');

  // Filter mocked history based on the active tab (mapping Folder name to tab concept)
  const getFilteredData = () => {
    // Basic mapping logic for demo purposes
    const mapping: Record<string, string> = {
      'TablaGeneral': 'General',
      'TablaEvento': 'Evento',
      'TablaComite': 'Comite',
      'TablaAval': 'Aval',
      'TablaApoyo': 'Apoyo',
      'TablaMovilidad': 'Movilidad'
    };
    const targetFolder = mapping[activeTab];
    return MOCK_HISTORY.filter(doc => FOLDER_MAPPING[doc.templateId] === targetFolder);
  };

  const rows = getFilteredData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="bg-[#1D6F42] text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-6 h-6" />
            <div>
                <h3 className="font-bold text-lg">Excel_Maestro_Solicitudes.xlsx</h3>
                <p className="text-xs text-green-100 opacity-80">Vista Previa - Solo Lectura - Nube Institucional</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 relative">
          <table className="w-full text-sm text-left text-gray-600 border-collapse">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 shadow-sm z-10">
              <tr>
                <th className="px-6 py-3 border-b">ID Documento</th>
                <th className="px-6 py-3 border-b">Solicitante</th>
                <th className="px-6 py-3 border-b">Fecha Solicitud</th>
                <th className="px-6 py-3 border-b">Estado</th>
                <th className="px-6 py-3 border-b">Ruta Archivo</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? rows.map((row) => (
                <tr key={row.id} className="bg-white border-b hover:bg-green-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
                  <td className="px-6 py-4">{row.applicant}</td>
                  <td className="px-6 py-4">{row.createdAt}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                        ${row.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-600 underline cursor-pointer">
                    /PDFs/{FOLDER_MAPPING[row.templateId]}/{row.id}.pdf
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center py-20 text-gray-400 italic">
                        No hay registros en esta hoja.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Excel Footer Tabs */}
        <div className="bg-gray-100 border-t p-2 flex space-x-1 overflow-x-auto">
            <button className="px-4 py-1 text-xs font-bold bg-[#1D6F42] text-white rounded-t-md opacity-50">Dashboard</button>
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1 text-xs font-bold rounded-t-md transition-all
                        ${activeTab === tab 
                            ? 'bg-white text-[#1D6F42] border-t-2 border-[#1D6F42] shadow-sm' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};