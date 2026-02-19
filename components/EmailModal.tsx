import React, { useState, useEffect } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import { GeneratedDocument } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  document: GeneratedDocument | null;
}

export const EmailModal: React.FC<Props> = ({ isOpen, onClose, document }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen && document) {
      setTo('consejo.tecnico@citro.uv.mx'); // Mock default
      setSubject(`Nueva Solicitud: ${document.templateName} - ${document.applicant}`);
      setMessage(`Estimados miembros del Consejo Técnico,\n\nAdjunto encontrará la solicitud de "${document.templateName}" para su revisión y aprobación.\n\nAtentamente,\n${document.applicant}`);
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen, document]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
        onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-gray-800">Enviar Documento por Correo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">¡Enviado!</h4>
            <p className="text-gray-500">El correo ha sido enviado exitosamente al Consejo Técnico.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para:</label>
              <input
                type="email"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto:</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje:</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Paperclip className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600 truncate">
                {document?.templateName || 'Documento'}.pdf
              </span>
              <span className="ml-auto text-xs text-gray-400">PDF - Auto generado</span>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-70"
              >
                {loading ? 'Enviando...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Notificación
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};