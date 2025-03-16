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

export const exportToExcel = (data: any, title: string) => {
  const wb = XLSX.utils.book_new();
  
  // If data is an object with multiple sheets
  if (typeof data === 'object' && !Array.isArray(data)) {
    // Object.entries(data).forEach(([sheetName, sheetData]) => {
    //   const ws = XLSX.utils.json_to_sheet(sheetData);
    //   XLSX.utils.book_append_sheet(wb, ws, sheetName);
    // });
  } else {
    // Single sheet
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
  }
  
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.xlsx`);
};