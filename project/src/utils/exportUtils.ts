import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { format } from 'date-fns';

interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  startTime: string;
  endTime: string;
  tabSwitches: number;
}

export const exportToPDF = (
  testName: string,
  results: TestResult[],
  includeSecurityInfo: boolean = true
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(testName, 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${format(new Date(), 'PPpp')}`, 14, 22);
  
  // Prepare table data
  const headers = [
    'Student',
    'Score',
    'Percentage',
    'Time Taken',
    ...(includeSecurityInfo ? ['Security Violations'] : []),
  ];
  
  const data = results.map(result => [
    result.studentName,
    `${result.score}/${result.maxScore}`,
    `${((result.score / result.maxScore) * 100).toFixed(1)}%`,
    format(new Date(result.endTime).getTime() - new Date(result.startTime).getTime(), 'mm:ss'),
    ...(includeSecurityInfo ? [result.tabSwitches] : []),
  ]);
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  // Save the PDF
  doc.save(`${testName.toLowerCase().replace(/\s+/g, '-')}-results.pdf`);
};

export const exportToCSV = (
  testName: string,
  results: TestResult[],
  includeSecurityInfo: boolean = true
) => {
  const data = results.map(result => ({
    'Student Name': result.studentName,
    'Score': result.score,
    'Max Score': result.maxScore,
    'Percentage': `${((result.score / result.maxScore) * 100).toFixed(1)}%`,
    'Start Time': format(new Date(result.startTime), 'PPpp'),
    'End Time': format(new Date(result.endTime), 'PPpp'),
    'Time Taken': format(
      new Date(result.endTime).getTime() - new Date(result.startTime).getTime(),
      'mm:ss'
    ),
    ...(includeSecurityInfo ? { 'Security Violations': result.tabSwitches } : {}),
  }));
  
  const csv = Papa.unparse(data);
  
  // Create and download CSV file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${testName.toLowerCase().replace(/\s+/g, '-')}-results.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};