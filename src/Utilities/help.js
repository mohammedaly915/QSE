  const getNAQuestions = useCallback((type) => {
        const allSchemes = ['GAHAR', 'JCI Laboratory', 'ISO 15189-2022'];
        let naQuestions = [];
        allSchemes.forEach(scheme => {
          const schemeQuestions = specificQuestions[scheme]?.[type] || [];
          const filteredNA = schemeQuestions.filter(q => q.NA && q.NA.length > 0);
          naQuestions = [...naQuestions, ...filteredNA.map(q => ({ ...q, category: scheme }))];
        });
        return naQuestions;
      }, []);


    const exportData= ()=>{
        console.log(auditData);
        console.log("selectedQuestions result",selectedQuestions); 
        console.log("Recommendation result",recommendations); 
    
        const workbook = XLSX.utils.book_new();
    
        // Sheet 1: Audit Team
        if (auditData) {
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
    
          console.log("auditData exel",auditData);
          const auditSheet = XLSX.utils.json_to_sheet(auditTeamData);
          
          applyCellStyles(auditSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4F81BD' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
          });
          applyCellStyles(auditSheet, { s: { r: 1, c: 0 }, e: { r: auditTeamData.length, c: 1 } }, {
            alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
          });
          auditSheet['!cols'] = [{ wch: 30 }, { wch: 50 }];
          XLSX.utils.book_append_sheet(workbook, auditSheet, 'Audit_Team');
        }
    
        // Sheet 2: Selected Questions
        if (selectedQuestions.length) {
          const questionsData = selectedQuestions.map((q, index) => ({
            '#': index + 1,
            Question: q.question || 'N/A',
            Category: q.category || 'N/A',
            Tab: q.tab || 'N/A',
            SelectedOption: q.selectedOption || 'N/A',
            Notes: (q.notes || []).join('; '),
            Attachment: q.attachments && q.attachments.length ? 'Yes' : 'No'
          }));
          const questionsSheet = XLSX.utils.json_to_sheet(questionsData);
          applyCellStyles(questionsSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4F81BD' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
          });
          applyCellStyles(questionsSheet, { s: { r: 1, c: 0 }, e: { r: selectedQuestions.length, c: 6 } }, {
            alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
          });
          questionsSheet['!cols'] = [
            { wch: 5 },    // #
            { wch: 60 },   // Question
            { wch: 25 },   // Category
            { wch: 20 },   // Tab
            { wch: 15 },   // Selected Option
            { wch: 30 },   // Notes
            { wch: 10 },   // Attachment
          ];
    
          XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Selected_Questions');
    
          console.log("questionsData exel",questionsData);
        }
    
        // Sheet 3: Recommendations
        if (recommendations.length) {
          const recData = recommendations.map((rec, index) => ({
            'Rec #': index + 1,
            GAHAR: rec.gahar != null ? rec.gahar.toFixed(1) : 'N/A',
            JCI: rec.jci != null ? rec.jci.toFixed(1) : 'N/A',
            'ISO 15189-2022': rec.iso_15189_2022 != null ? rec.iso_15189_2022.toFixed(1) : 'N/A',
            ...(auditData || {}),
          }));
          const recSheet = XLSX.utils.json_to_sheet(recData);
          applyCellStyles(recSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(recData[0]).length - 1 } }, {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4F81BD' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
          });
          recData.forEach((row, rowIndex) => {
            ['GAHAR', 'JCI', 'ISO 15189-2022'].forEach((key, colOffset) => {
              const score = parseFloat(row[key]);
              if (!isNaN(score)) {
                const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: 1 + colOffset });
                recSheet[cellRef].s = {
                  fill: { fgColor: getScoreFillColor(score) },
                  font: { color: getScoreFontColor(score) },
                  alignment: { horizontal: 'center' },
                  border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
                };
              }
            });
          });
          recSheet['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, ...Object.keys(auditData || {}).map(() => ({ wch: 20 }))];
    
          console.log("recData exel",recData);
    
          XLSX.utils.book_append_sheet(workbook, recSheet, 'Recommendations');
        }
      
    
      }


      const applyCellStyles = (worksheet, range, styles) => {
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellRef]) continue;
            worksheet[cellRef].s = { ...worksheet[cellRef].s, ...styles };
          }
        }
      };
    
    
      const getScoreFillColor = (score) => {
        if (score == null || isNaN(score)) return { rgb: 'E0E0E0' }; // Gray
        if (score >= 95) return { rgb: 'C6EFCE' }; // Green
        if (score >= 50) return { rgb: 'FFEB9C' }; // Yellow
        return { rgb: 'FFC7CE' }; // Red
      };
      
      const getScoreFontColor = (score) => {
        if (score == null || isNaN(score)) return { rgb: '000000' };
        if (score >= 95) return { rgb: '006100' };
        if (score >= 50) return { rgb: '9C5700' };
        return { rgb: '9C0006' };
      };

      const handleSubmit = async () => {
    
        const questionsToSubmit = selectedQuestions.filter((q) => q.selectedOption === 'Met');
        const allQuestions = questionsToSubmit.map((q) => q.question).join(', ');
        
        setSendingStatus('loading');
        setStatusMessage('');
        try {
          const response = await fetch('https://abdelrahman12012-mostintelegance.hf.space/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: allQuestions, top_n: 1 }),
          });
    
          console.log("allQuestion", allQuestions);
          
          if (!response.ok) throw new Error('Network response was not ok');
          
          const data = await response.json();
          console.log(data);
          
          setTimeout(() => {
            setSendingStatus('success');
            setStatusMessage('Your submission was successful!');
          })
          sessionStorage.removeItem('selectedQuestions');
          navigate('/result', { state: { results: data, selectedQuestions } });
        } catch (error) {
          setTimeout(() => {
            setSendingStatus('error');
            setStatusMessage('An error occurred while submitting.');
          })
          console.error('Error submitting data:', error);
        }
      };
    

      const exportDatainExcel = () => {
        console.log(auditData);
        console.log("selectedQuestions result", selectedQuestions);
        console.log("Recommendation result", recommendations);
    
        const workbook = XLSX.utils.book_new();
    
        // Sheet 1: Audit Team
        if (auditData) {
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
    
            console.log("auditData excel", auditData);
            const auditSheet = XLSX.utils.json_to_sheet(auditTeamData);
    
            applyCellStyles(auditSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, {
                font: { bold: true, color: { rgb: 'FFFFFF' } },
                fill: { fgColor: { rgb: '4F81BD' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
            });
            applyCellStyles(auditSheet, { s: { r: 1, c: 0 }, e: { r: auditTeamData.length, c: 1 } }, {
                alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
                border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
            });
            auditSheet['!cols'] = [{ wch: 30 }, { wch: 50 }];
            XLSX.utils.book_append_sheet(workbook, auditSheet, 'Audit_Team');
        }
    
        // Sheet 2: Selected Questions
    // Sheet 2: Selected Questions
    if (selectedQuestions.length) {
      const questionsData = selectedQuestions.map((q, index) => {
          let attachmentDisplayText = 'No';
          let attachmentUrl = '';
          let attachmentType = 'None';
          let imageFormula = ''; // New field for IMAGE function
    
          // Check if attachment exists and is an image
          if (q.attachments && q.attachments.length > 0) {
              const firstAttachment = q.attachments[0];
              if (firstAttachment.url) {
                  attachmentDisplayText = firstAttachment.fileName || 'View Attachment';
                  attachmentUrl = firstAttachment.url;
                  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
                  const ext = (firstAttachment.fileName || '').toLowerCase().slice(-4);
                  attachmentType = imageExtensions.includes(ext) ? 'Image' : 'File';
                  // Add IMAGE function for images
                  if (attachmentType === 'Image') {
                      // Use IMAGE function: =IMAGE("url", [alt_text], [sizing])
                      // Sizing: 0 = fit cell with aspect ratio
                      imageFormula = `=IMAGE("${attachmentUrl}", "${attachmentDisplayText}", 0)`;
                  }
              } else {
                  attachmentDisplayText = 'Yes (No URL)';
                  attachmentType = 'Unknown';
              }
          }
    
          return {
              '#': index + 1,
              Question: q.question || 'N/A',
              Category: q.category || 'N/A',
              Tab: q.tab || 'N/A',
              SelectedOption: q.selectedOption || 'N/A',
              Notes: (q.notes || []).join('; '),
              Attachment: attachmentUrl ? { f: `HYPERLINK("${attachmentUrl}", "${attachmentDisplayText}")`, t: attachmentDisplayText } : attachmentDisplayText,
              AttachmentType: attachmentType,
              Image: imageFormula, // New column for image display
          };
      });
    
      const questionsSheet = XLSX.utils.json_to_sheet(questionsData);
      applyCellStyles(questionsSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '4F81BD' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
      });
      applyCellStyles(questionsSheet, { s: { r: 1, c: 0 }, e: { r: selectedQuestions.length, c: 8 } }, {
          alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
          border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
      });
      questionsSheet['!cols'] = [
          { wch: 5 },    // #
          { wch: 60 },   // Question
          { wch: 25 },   // Category
          { wch: 20 },   // Tab
          { wch: 15 },   // Selected Option
          { wch: 30 },   // Notes
          { wch: 20 },   // Attachment
          { wch: 15 },   // AttachmentType
          { wch: 30 },   // Image (new column)
      ];
    
      XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Selected_Questions');
      console.log("questionsData excel", questionsData);
    }
    
        // Sheet 3: Recommendations
        if (recommendations.length) {
            const recData = recommendations.map((rec, index) => ({
                'Rec #': index + 1,
                GAHAR: rec.gahar != null ? rec.gahar.toFixed(1) : 'N/A',
                JCI: rec.jci != null ? rec.jci.toFixed(1) : 'N/A',
                'ISO 15189-2022': rec.iso_15189_2022 != null ? rec.iso_15189_2022.toFixed(1) : 'N/A',
                // ... (Your existing auditData spread - ensure this doesn't cause issues if auditData is very large/complex)
                // It might be better to explicitly pick fields from auditData if you only need a few,
                // otherwise, it will add all top-level properties of auditData as columns.
                Organization: auditData?.organizationName || 'N/A',
                AuditType: auditData?.auditType || 'N/A',
                Scheme: auditData?.scheme || 'N/A',
                // Add other specific auditData fields here if needed
            }));
    
            const recSheet = XLSX.utils.json_to_sheet(recData);
            applyCellStyles(recSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(recData[0]).length - 1 } }, {
                font: { bold: true, color: { rgb: 'FFFFFF' } },
                fill: { fgColor: { rgb: '4F81BD' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
            });
            recData.forEach((row, rowIndex) => {
                ['GAHAR', 'JCI', 'ISO 15189-2022'].forEach((key, colOffset) => {
                    // Adjust colOffset based on the fixed columns before GAHAR, JCI, ISO
                    const baseCols = 1; // For 'Rec #'
                    const currentColumn = baseCols + colOffset;
                    const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: currentColumn });
                    const score = parseFloat(row[key]);
                    if (!isNaN(score) && recSheet[cellRef]) { // Check if cell exists
                        recSheet[cellRef].s = {
                            fill: { fgColor: getScoreFillColor(score) },
                            font: { color: getScoreFontColor(score) },
                            alignment: { horizontal: 'center' },
                            border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
                        };
                    }
                });
            });
            // Dynamically set column widths for recommendations sheet based on actual data
            recSheet['!cols'] = [
                { wch: 10 }, // Rec #
                { wch: 15 }, // GAHAR
                { wch: 15 }, // JCI
                { wch: 20 }, // ISO 15189-2022
                { wch: 30 }, // Organization
                { wch: 20 }, // AuditType
                { wch: 20 }, // Scheme
                // Add more {wch: X} for any other auditData fields you explicitly added
            ];
    
            console.log("recData excel", recData);
    
            XLSX.utils.book_append_sheet(workbook, recSheet, 'Recommendations');
        }
    
        // *** IMPORTANT: Save the workbook to a file ***
        XLSX.writeFile(workbook, 'Audit_Reportlast.xlsx'); // Or use a more dynamic file name
    };

      // Handler for exporting data to Excel
    //   const exportDatainExcel = () => {
    //     console.log(auditData);
    //     console.log("selectedQuestions result", selectedQuestions);
    //     console.log("Recommendation result", recommendations);
    
    //     const workbook = XLSX.utils.book_new();
    
    //     // Sheet 1: Audit Team
    //     if (auditData) {
    //         const auditTeamData = [
    //             { Field: 'Organization Name', Value: auditData.organizationName || 'N/A' },
    //             { Field: 'Time', Value: auditData.time ? new Date(auditData.time).toLocaleString() : 'N/A' },
    //             { Field: 'Audit Type', Value: auditData.auditType || 'N/A' },
    //             { Field: 'Scheme', Value: auditData.scheme || 'N/A' },
    //             {
    //                 Field: 'Audit Team',
    //                 Value: Array.isArray(auditData.auditTeam) && auditData.auditTeam.length
    //                     ? auditData.auditTeam.map((m) => `${m.name} (${m.position}, ${m.responsibility})`).join('; ')
    //                     : 'N/A',
    //             },
    //             {
    //                 Field: 'Opening Meeting Time',
    //                 Value: auditData.openingMeeting?.time ? new Date(auditData.openingMeeting.time).toLocaleString() : 'N/A',
    //             },
    //             {
    //                 Field: 'Opening Meeting Attendees',
    //                 Value: auditData.openingMeeting?.attendeesList?.length ? auditData.openingMeeting.attendeesList.join(', ') : 'N/A',
    //             },
    //             { Field: 'Agenda', Value: auditData.agenda || 'N/A' },
    //         ];
    
    //         console.log("auditData excel", auditData);
    //         const auditSheet = XLSX.utils.json_to_sheet(auditTeamData);
    
    //         applyCellStyles(auditSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, {
    //             font: { bold: true, color: { rgb: 'FFFFFF' } },
    //             fill: { fgColor: { rgb: '4F81BD' } },
    //             alignment: { horizontal: 'center', vertical: 'center' },
    //             border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    //         });
    //         applyCellStyles(auditSheet, { s: { r: 1, c: 0 }, e: { r: auditTeamData.length, c: 1 } }, {
    //             alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    //             border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    //         });
    //         auditSheet['!cols'] = [{ wch: 30 }, { wch: 50 }];
    //         XLSX.utils.book_append_sheet(workbook, auditSheet, 'Audit_Team');
    //     }
    
    //     // Sheet 2: Selected Questions
    //     if (selectedQuestions.length) {
    //         const questionsData = selectedQuestions.map((q, index) => {
    //             // Logic for attachment hyperlinks
    //             let attachmentDisplayText = 'No';
    //             let attachmentUrl = '';
    
    //             // Assuming first attachment if available and has a 'url'
    //             if (q.attachments && q.attachments.length > 0) {
    //                 const firstAttachment = q.attachments[0];
    //                 if (firstAttachment.url) {
    //                     attachmentDisplayText = firstAttachment.fileName || 'View Attachment'; // Display file name if available
    //                     attachmentUrl = firstAttachment.url;
    //                 } else {
    //                     attachmentDisplayText = 'Yes (No URL)'; // Attachment exists but no URL
    //                 }
    //             }
    
    //             return {
    //                 '#': index + 1,
    //                 Question: q.question || 'N/A',
    //                 Category: q.category || 'N/A',
    //                 Tab: q.tab || 'N/A',
    //                 SelectedOption: q.selectedOption || 'N/A',
    //                 Notes: (q.notes || []).join('; '),
    //                 // Conditional creation of hyperlink object or plain text
    //                 Attachment: attachmentUrl ? { f: `HYPERLINK("${attachmentUrl}", "${attachmentDisplayText}")`, t: attachmentDisplayText } : attachmentDisplayText
    //             };
    //         });
    
    //         const questionsSheet = XLSX.utils.json_to_sheet(questionsData);
    //         applyCellStyles(questionsSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, {
    //             font: { bold: true, color: { rgb: 'FFFFFF' } },
    //             fill: { fgColor: { rgb: '4F81BD' } },
    //             alignment: { horizontal: 'center', vertical: 'center' },
    //             border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    //         });
    //         applyCellStyles(questionsSheet, { s: { r: 1, c: 0 }, e: { r: selectedQuestions.length, c: 6 } }, {
    //             alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    //             border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    //         });
    //         questionsSheet['!cols'] = [
    //             { wch: 5 },    // #
    //             { wch: 60 },   // Question
    //             { wch: 25 },   // Category
    //             { wch: 20 },   // Tab
    //             { wch: 15 },   // Selected Option
    //             { wch: 30 },   // Notes
    //             { wch: 20 },   // Attachment (increased width for hyperlink text)
    //         ];
    
    //         XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Selected_Questions');
    //         console.log("questionsData excel", questionsData);
    //     }
    
    //     // Sheet 3: Recommendations
    //     if (recommendations.length) {
    //         const recData = recommendations.map((rec, index) => ({
    //             'Rec #': index + 1,
    //             GAHAR: rec.gahar != null ? rec.gahar.toFixed(1) : 'N/A',
    //             JCI: rec.jci != null ? rec.jci.toFixed(1) : 'N/A',
    //             'ISO 15189-2022': rec.iso_15189_2022 != null ? rec.iso_15189_2022.toFixed(1) : 'N/A',
    //             // ... (Your existing auditData spread - ensure this doesn't cause issues if auditData is very large/complex)
    //             // It might be better to explicitly pick fields from auditData if you only need a few,
    //             // otherwise, it will add all top-level properties of auditData as columns.
    //             Organization: auditData?.organizationName || 'N/A',
    //             AuditType: auditData?.auditType || 'N/A',
    //             Scheme: auditData?.scheme || 'N/A',
    //             // Add other specific auditData fields here if needed
    //         }));
    
    //         const recSheet = XLSX.utils.json_to_sheet(recData);
    //         applyCellStyles(recSheet, { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(recData[0]).length - 1 } }, {
    //             font: { bold: true, color: { rgb: 'FFFFFF' } },
    //             fill: { fgColor: { rgb: '4F81BD' } },
    //             alignment: { horizontal: 'center', vertical: 'center' },
    //             border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    //         });
    //         recData.forEach((row, rowIndex) => {
    //             ['GAHAR', 'JCI', 'ISO 15189-2022'].forEach((key, colOffset) => {
    //                 // Adjust colOffset based on the fixed columns before GAHAR, JCI, ISO
    //                 const baseCols = 1; // For 'Rec #'
    //                 const currentColumn = baseCols + colOffset;
    //                 const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: currentColumn });
    //                 const score = parseFloat(row[key]);
    //                 if (!isNaN(score) && recSheet[cellRef]) { // Check if cell exists
    //                     recSheet[cellRef].s = {
    //                         fill: { fgColor: getScoreFillColor(score) },
    //                         font: { color: getScoreFontColor(score) },
    //                         alignment: { horizontal: 'center' },
    //                         border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
    //                     };
    //                 }
    //             });
    //         });
    //         // Dynamically set column widths for recommendations sheet based on actual data
    //         recSheet['!cols'] = [
    //             { wch: 10 }, // Rec #
    //             { wch: 15 }, // GAHAR
    //             { wch: 15 }, // JCI
    //             { wch: 20 }, // ISO 15189-2022
    //             { wch: 30 }, // Organization
    //             { wch: 20 }, // AuditType
    //             { wch: 20 }, // Scheme
    //             // Add more {wch: X} for any other auditData fields you explicitly added
    //         ];
    
    //         console.log("recData excel", recData);
    
    //         XLSX.utils.book_append_sheet(workbook, recSheet, 'Recommendations');
    //     }
    
    //     // *** IMPORTANT: Save the workbook to a file ***
    //     XLSX.writeFile(workbook, 'Audit_Reportlast.xlsx'); // Or use a more dynamic file name
    // };