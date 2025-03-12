import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (data: any[], title: string, columns: string[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Convert data to format expected by autoTable
  const tableData = data.map(item => columns.map(col => item[col]));

  // Create table
  autoTable(doc, {
    head: [columns.map(col => col.replace(/_/g, ' ').toUpperCase())],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
};

export const exportToExcel = (data: any[], title: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.xlsx`);
};