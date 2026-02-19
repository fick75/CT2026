// components/EmailModal_updated.tsx
// Modal actualizado para enviar correos reales con Outlook usando Microsoft Graph

import React, { useState } from 'react';
import { X, Send, Loader2, Mail, Paperclip } from 'lucide-react';
import { GeneratedDocument } from '../types';
import * as MicrosoftGraph from '../services/microsoftGraphService';

interface EmailModalProps {
  document: GeneratedDocument;
  onClose: () => void;
  docxBlob?: Blob;
  pdfBlob?: Blob;
}

export const EmailModal: React.FC<EmailModalProps> = ({ 
  document, 
  onClose,
  docxBlob,
  pdfBlob 
}) => {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState(
    `Solicitud ${document.templateName} - ${document.formData.nombreSolicitante || 'Sin nombre'}`
  );
  const [message, setMessage] = useState(
    `Estimado/a,\n\nAdjunto encontrará la solicitud de ${document.templateName.toLowerCase()}.\n\nSaludos cordiales.`
  );
  const [attachmentType, setAttachmentType] = useState<'docx' | 'pdf'>('pdf');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    // Validaciones
    if (!recipients.trim()) {
      setError('Por favor ingresa al menos un destinatario');
      return;
    }

    if (!subject.trim()) {
      setError('Por favor ingresa un asunto');
      return;
    }

    // Verificar autenticación
    try {
      const isAuth = await MicrosoftGraph.isAuthenticated();
      if (!isAuth) {
        setError('Debes iniciar sesión con Microsoft para enviar correos');
        return;
      }
    } catch (error) {
      setError('Error al verificar autenticación. Por favor inicia sesión nuevamente.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      // Procesar destinatarios (separados por coma o punto y coma)
      const recipientList = recipients
        .split(/[,;]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);

      // Preparar adjunto si existe
      let attachments: Array<{ name: string; content: string; contentType: string }> = [];
      
      const blob = attachmentType === 'pdf' ? pdfBlob : docxBlob;
      if (blob) {
        const base64Content = await MicrosoftGraph.blobToBase64(blob);
        const fileName = `${document.templateName.replace(/\s+/g, '_')}_${document.id}.${attachmentType}`;
        const contentType = attachmentType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        attachments.push({
          name: fileName,
          content: base64Content,
          contentType,
        });
      }

      // Convertir mensaje de texto plano a HTML
      const htmlMessage = message.replace(/\n/g, '<br>');

      // Enviar correo
      await MicrosoftGraph.sendEmail(
        recipientList,
        subject,
        htmlMessage,
        attachments
      );

      setSuccess(true);
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Error al enviar correo:', error);
      setError(
        error.message || 'Error al enviar el correo. Por favor verifica tu conexión e intenta de nuevo.'
      );
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Correo enviado!
          </h3>
          <p className="text-gray-600">
            El correo ha sido enviado exitosamente a los destinatarios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Enviar por correo</h2>
              <p className="text-sm text-gray-500">
                Documento: {document.templateName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={sending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Para: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="correo@ejemplo.com, otro@ejemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separa múltiples destinatarios con coma (,) o punto y coma (;)
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={sending}
            />
          </div>

          {/* Attachment type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato del adjunto:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="pdf"
                  checked={attachmentType === 'pdf'}
                  onChange={(e) => setAttachmentType(e.target.value as 'pdf' | 'docx')}
                  className="w-4 h-4 text-blue-600"
                  disabled={sending}
                />
                <span className="text-sm text-gray-700">PDF</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="docx"
                  checked={attachmentType === 'docx'}
                  onChange={(e) => setAttachmentType(e.target.value as 'pdf' | 'docx')}
                  className="w-4 h-4 text-blue-600"
                  disabled={sending}
                />
                <span className="text-sm text-gray-700">Word (DOCX)</span>
              </label>
            </div>
          </div>

          {/* Attachment info */}
          {(docxBlob || pdfBlob) && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Paperclip className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Adjunto: {document.templateName.replace(/\s+/g, '_')}_{document.id}.{attachmentType}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={sending}
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar correo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
