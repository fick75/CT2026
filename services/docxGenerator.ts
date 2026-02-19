import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType } from 'docx';
import { DocumentTemplate, DocumentData } from '../types';

export const generateDOCX = async (template: DocumentTemplate, data: DocumentData): Promise<Blob> => {
  // Define Colors
  const BLUE_COLOR = "003366";
  const WHITE_COLOR = "FFFFFF";
  const BORDER_COLOR = "CCCCCC";

  // Build Document Children (Content)
  const children: any[] = [];

  // 1. Header
  children.push(
    new Paragraph({
      text: template.name.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: {
        bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 }
      }
    })
  );

  children.push(new Paragraph({ text: "", spacing: { after: 200 } })); // Spacer

  // 2. Sections
  template.sections.forEach((section) => {
    // Section Title with Shading (Blue Bar effect)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            color: WHITE_COLOR,
            size: 24, // Half-points (12pt)
          }),
        ],
        shading: {
          type: ShadingType.CLEAR,
          fill: BLUE_COLOR,
        },
        spacing: { before: 200, after: 100 },
        indent: { left: 100, right: 100 } // Padding visual simulation
      })
    );

    // Fields
    const tableRows: TableRow[] = [];

    // We use a table structure for alignment, similar to the form layout
    // For simplicity in DOCX, we'll put most things in key-value rows or stacked
    section.fields.forEach((field) => {
      const value = data[field.id] ? String(data[field.id]) : "______________________";
      
      if (field.type === 'textarea') {
        // Multi-line content gets its own block
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${field.label}:`, bold: true }),
                ],
                spacing: { before: 100 }
            })
        );
        children.push(
            new Paragraph({
                text: value,
                spacing: { after: 200 }
            })
        );
      } else {
        // Key Value Pair
        children.push(
             new Paragraph({
                children: [
                    new TextRun({ text: `${field.label}: `, bold: true }),
                    new TextRun({ text: value })
                ],
                spacing: { after: 100 }
            })
        );
      }
    });

    children.push(new Paragraph({ text: "" })); // Spacer between sections
  });

  // 3. Footer / Signatures
  children.push(new Paragraph({ text: "", spacing: { before: 400 } }));
  children.push(new Paragraph({ text: "", spacing: { before: 400 } }));
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "__________________________________________" })
      ],
      alignment: AlignmentType.CENTER
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Firma del Solicitante", bold: true })
      ],
      alignment: AlignmentType.CENTER
    })
  );
  
  const today = new Date().toLocaleDateString('es-MX');
  children.push(
    new Paragraph({
      text: `Fecha: ${today}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // Council Box
  children.push(
      new Paragraph({
          children: [
              new TextRun({ 
                  text: " PARA USO EXCLUSIVO DEL CONSEJO TÉCNICO ", 
                  color: WHITE_COLOR,
                  bold: true 
              })
          ],
          shading: { fill: BLUE_COLOR, type: ShadingType.CLEAR },
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 }
      })
  );
  
  children.push(
    new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph("Estado: ___________________")],
                        width: { size: 50, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                        children: [new Paragraph("Aprobado por: ___________________")],
                        width: { size: 50, type: WidthType.PERCENTAGE }
                    }),
                ]
            }),
             new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({text: "Observaciones:", spacing: {after: 400}})],
                        columnSpan: 2,
                    }),
                ]
            })
        ]
    })
  );


  // Create Document
  const doc = new Document({
    styles: {
        paragraphStyles: [
            {
                id: "Normal",
                name: "Normal",
                run: {
                    font: "Arial",
                    size: 22, // 11pt
                },
            },
        ],
    },
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};