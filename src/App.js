import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Recommend from './pages/Recommend';
import Review from './pages/Review';
import Audit from './pages/Audit';
import Result3 from './pages/Result3';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';

function App() {
  const [auditData, setAuditData] = useState(null);

  useEffect(() => {
    const storedFormData = sessionStorage.getItem('auditData');
    if (storedFormData) {
      setAuditData(JSON.parse(storedFormData));
    }
  }, []);

  const exportDataInExcel = async (auditData, selectedQuestions, results = {}) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Audit System';
    workbook.created = new Date();
  
    // Helper function to apply styles
    const applyHeaderStyles = (row) => {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' }
        };
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFFFF' }
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    };
  
    // Sheet 1: Audit Team
    if (auditData) {
      const auditSheet = workbook.addWorksheet('Audit_Team');
      auditSheet.columns = [{ width: 30 }, { width: 50 }];
  
      const auditTeamData = [
        { Field: 'Organization Name', Value: auditData.organizationName || 'N/A' },
        { Field: 'Time', Value: auditData.time ? new Date(auditData.time).toLocaleString() : 'N/A' },
        { Field: 'Audit Type', Value: auditData.auditType || 'N/A' },
        { Field: 'Scheme', Value: auditData.scheme || 'N/A' },
        {
          Field: 'Audit Team',
          Value: Array.isArray(auditData.auditTeam) && auditData.auditTeam.length
            ? auditData.auditTeam.map((m) => `${m.name} (${m.position}, ${m.responsibility})`).join('; ')
            : 'N/A',
        },
        {
          Field: 'Opening Meeting Time',
          Value: auditData.openingMeeting?.time ? new Date(auditData.openingMeeting.time).toLocaleString() : 'N/A',
        },
        {
          Field: 'Opening Meeting Attendees',
          Value: auditData.openingMeeting?.attendeesList?.length ? auditData.openingMeeting.attendeesList.join(', ') : 'N/A',
        },
        { Field: 'Agenda', Value: auditData.agenda || 'N/A' },
      ];
  
      auditSheet.addRow(['Field', 'Value']);
      applyHeaderStyles(auditSheet.getRow(1));
  
      auditTeamData.forEach(item => {
        const row = auditSheet.addRow([item.Field, item.Value]);
        row.eachCell((cell) => {
          cell.alignment = { 
            vertical: 'middle', 
            horizontal: 'left',
            wrapText: true
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });
    }
  
    // Sheet 2: Selected Questions with Attachments
    if (selectedQuestions?.length) {
      const questionsSheet = workbook.addWorksheet('Selected_Questions');
      
      questionsSheet.columns = [
        { header: '#', key: 'index', width: 5 },
        { header: 'Question', key: 'question', width: 60 },
        { header: 'Category', key: 'category', width: 25 },
        { header: 'Tab', key: 'tab', width: 20 },
        { header: 'Selected Option', key: 'selectedOption', width: 15 },
        { header: 'Notes', key: 'notes', width: 30 },
        { header: 'Attachment', key: 'attachment', width: 20 },
        { header: 'Attachment Type', key: 'attachmentType', width: 15 }
      ];
  
      applyHeaderStyles(questionsSheet.getRow(1));
  
      for (const [index, q] of selectedQuestions.entries()) {
        let attachmentText = 'None';
        let attachmentType = 'None';
        let attachmentHyperlink = null;
  
        if (q.attachments?.length) {
          const firstAttachment = q.attachments[0];
          attachmentText = firstAttachment.fileName || 'Attachment';
          attachmentType = getFileType(firstAttachment.fileName);
          
          if (firstAttachment.url) {
            attachmentHyperlink = {
              text: attachmentText,
              hyperlink: firstAttachment.url
            };
          }
        }
  
        const row = questionsSheet.addRow({
          index: index + 1,
          question: q.question || 'N/A',
          category: q.category || 'N/A',
          tab: q.tab || 'N/A',
          selectedOption: q.selectedOption || 'N/A',
          notes: (q.notes || []).join('; '),
          attachment: attachmentHyperlink || attachmentText,
          attachmentType
        });
  
        row.eachCell((cell) => {
          cell.alignment = { 
            vertical: 'middle', 
            horizontal: 'left',
            wrapText: true
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          if (cell.value?.hyperlink) {
            cell.font = { color: { argb: 'FF0000FF' }, underline: true };
          }
        });
      }
    }
  
    // Sheet 3: Recommendations
    if (results && (results.gahar !== undefined || results.jci !== undefined || results.iso !== undefined)) {
      const recSheet = workbook.addWorksheet('Recommendations');
      
      recSheet.columns = [
        { header: 'Rec #', key: 'recNumber', width: 10 },
        { header: 'GAHAR', key: 'gahar', width: 15 },
        { header: 'JCI', key: 'jci', width: 15 },
        { header: 'ISO 15189-2022', key: 'iso', width: 20 },
        { header: 'Organization', key: 'organization', width: 30 },
        { header: 'Audit Type', key: 'auditType', width: 20 },
        { header: 'Scheme', key: 'scheme', width: 20 }
      ];
  
      applyHeaderStyles(recSheet.getRow(1));
  
      const recommendation = {
        recNumber: 1,
        gahar: results.gahar != null ? results.gahar.toFixed(1) : 'N/A',
        jci: results.jci != null ? results.jci.toFixed(1) : 'N/A',
        iso: results.iso != null ? results.iso.toFixed(1) : 'N/A',
        organization: auditData?.organizationName || 'N/A',
        auditType: auditData?.auditType || 'N/A',
        scheme: auditData?.scheme || 'N/A'
      };
  
      const row = recSheet.addRow(recommendation);
  
      ['gahar', 'jci', 'iso'].forEach(key => {
        const value = row.getCell(key).value;
        if (value !== 'N/A') {
          const score = parseFloat(value);
          if (!isNaN(score)) {
            const cell = row.getCell(key);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: getScoreFillColor(score) }
            };
            cell.font = { color: { argb: getScoreFontColor(score) } };
            cell.alignment = { horizontal: 'center' };
          }
        }
      });
  
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Audit_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };
  
  // Helper functions
  function getFileType(filename) {
    if (!filename) return 'File';
    const ext = (filename.split('.').pop() || '').toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
      return 'Image';
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
      return 'Document';
    }
    return 'File';
  }
  
  function getScoreFillColor(score) {
    if (score == null || isNaN(score)) return 'FFE0E0E0';
    if (score >= 4) return 'FF00B050';
    if (score >= 2.5) return 'FFFFC000';
    return 'FFFF0000';
  }
  
  function getScoreFontColor(score) {
    if (score == null || isNaN(score)) return 'FF000000';
    return score < 2.5 ? 'FFFFFFFF' : 'FF000000';
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Audit/>} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/review" element={<Review exportDatainExcel={exportDataInExcel}/>} />
        <Route path="/result" element={<Result3 exportDatainExcel={exportDataInExcel}/>} />
      </Routes>
    </div>
  );
}

export default App;