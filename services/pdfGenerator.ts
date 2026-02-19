import jsPDF from 'jspdf';
import { DocumentTemplate, DocumentData } from '../types';

export const generatePDF = (template: DocumentTemplate, data: DocumentData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = 20;

  // Constants for styling
  const BLUE_COLOR = '#003366'; // Dark blue from screenshots
  const TEXT_COLOR = '#000000';
  const LINE_WIDTH = 0.5;

  // Helper to check page break
  const checkPageBreak = (heightNeeded: number) => {
    if (currentY + heightNeeded > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      currentY = 20;
    }
  };

  // 1. Header (Generic for all forms)
  doc.setFillColor(BLUE_COLOR);
  doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(template.name.toUpperCase(), margin + 2, currentY + 7);
  
  currentY += 15;

  // Double Line below header
  doc.setDrawColor(0);
  doc.setLineWidth(LINE_WIDTH);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // 2. Iterate Sections
  template.sections.forEach((section) => {
    checkPageBreak(30);

    // Section Header (Blue Bar)
    doc.setFillColor(BLUE_COLOR);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title.toUpperCase(), margin + 2, currentY + 5.5);
    currentY += 10;

    // Line under section title
    doc.setDrawColor(0);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    // Fields
    doc.setTextColor(TEXT_COLOR);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    section.fields.forEach((field) => {
      const value = data[field.id] || '______________________';
      const label = field.label;
      
      if (field.type === 'textarea') {
         // Handle multi-line text
         checkPageBreak(40);
         doc.setFont('helvetica', 'bold');
         doc.text(`${label}:`, margin, currentY);
         currentY += 5;
         
         doc.setFont('helvetica', 'normal');
         const splitText = doc.splitTextToSize(value, pageWidth - (margin * 2));
         doc.text(splitText, margin, currentY);
         currentY += (splitText.length * 5) + 5;
         
         // Bottom line for the field
         doc.line(margin, currentY, pageWidth - margin, currentY);
         currentY += 10;
      } else {
        // Simple Key: Value
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, currentY);
        
        doc.setFont('helvetica', 'normal');
        // Offset value
        doc.text(`${value}`, margin + 50, currentY);
        currentY += 8;
      }
    });
    
    currentY += 5; // Spacing between sections
  });

  // 3. Footer / Signatures
  checkPageBreak(50);
  currentY += 10;
  
  // Signature Line
  doc.line(pageWidth / 2 - 40, currentY, pageWidth / 2 + 40, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Firma del Solicitante', pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  
  const today = new Date().toLocaleDateString('es-MX');
  doc.text(`Fecha: ${today}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 10;

  // Council Exclusive Use Box
  checkPageBreak(40);
  doc.setDrawColor(0);
  doc.setLineWidth(1); // Thicker line
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;
  
  doc.setFillColor(BLUE_COLOR);
  doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.text('PARA USO EXCLUSIVO DEL CONSEJO TÉCNICO', margin + 2, currentY + 5.5);
  currentY += 10;
  
  doc.setDrawColor(0);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);

  return doc.output('blob');
};