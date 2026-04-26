
import React from 'react';
import { FeedbackResult, TaskType, SavedItem, AppliedCorrection, OutlineSection } from '../types';
import { Button } from '../components/Button';

interface ResultProps {
  feedback: FeedbackResult;
  taskType: TaskType;
  userText: string;
  promptText: string;
  outline?: OutlineSection[];
  onRetry: () => void;
  onNewTask: () => void;
  onSaveItem: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  sessionCorrections?: AppliedCorrection[];
  timeSpentSeconds?: number;
  officialAnswer?: string; // New prop for the textbook/PDF sample answer
  onLookup?: (word: string) => void;
}

export const Result: React.FC<ResultProps> = ({ 
  feedback, 
  taskType, 
  userText, 
  promptText, 
  outline,
  onRetry, 
  onNewTask,
  onSaveItem,
  sessionCorrections = [],
  timeSpentSeconds = 0,
  officialAnswer,
  onLookup
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    if (score >= 5) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
  };

  const renderClickableText = (content: string) => {
    if (!onLookup) return content;
    const words = content.split(/(\s+)/);
    return words.map((part, i) => {
      if (part.trim() === '') return part;
      return (
        <span 
          key={i} 
          onClick={() => onLookup(part)}
          className="hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-help transition-colors rounded-sm px-px"
        >
          {part}
        </span>
      );
    });
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handlePrint = () => {
    window.print();
  };

  const renderInlineFeedback = (markupText: string) => {
    // Regex matches [type|original|correction]
    const regex = /\[(grammar|vocab|spelling)\|(.+?)\|(.+?)\]/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = regex.exec(markupText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
            <span key={`text-${lastIndex}`}>{markupText.substring(lastIndex, match.index)}</span>
        );
      }

      const type = match[1];
      const original = match[2];
      const correction = match[3];

      let colorClass = "";
      if (type === 'grammar') colorClass = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800";
      else if (type === 'vocab') colorClass = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
      else if (type === 'spelling') colorClass = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";

      // CHANGED: Use 'inline' and 'box-decoration-clone' instead of 'inline-flex' to handle long text wrapping better
      // Added an arrow symbol for clarity
      parts.push(
        <span key={`err-${match.index}`} className={`mx-0.5 px-1 py-0.5 rounded border ${colorClass} font-medium inline box-decoration-clone leading-relaxed`}>
          <span 
            className="line-through opacity-60 decoration-2 break-words cursor-help"
            onClick={() => onLookup?.(original)}
          >
            {original}
          </span>
          <span className="select-none mx-1 opacity-50">➜</span>
          <span 
            className="font-bold break-words cursor-help"
            onClick={() => onLookup?.(correction)}
          >
            {correction}
          </span>
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < markupText.length) {
      parts.push(<span key={`text-end`}>{markupText.substring(lastIndex)}</span>);
    }

    return parts;
  };

  // Helper to convert markup text to HTML for Word
  const generateInlineHtmlForWord = (markupText: string) => {
    if (!markupText) return userText;
    
    // Replace newlines with <br/> first to preserve paragraphs
    let html = markupText.replace(/\n/g, '<br/>');

    // Replace markup tags with styled spans
    // Format: [type|original|correction]
    html = html.replace(/\[(grammar|vocab|spelling)\|(.+?)\|(.+?)\]/g, (match, type, original, correction) => {
      let styles = 'display: inline-block; padding: 2px 4px; margin: 0 2px; border-radius: 4px; border: 1px solid #ccc;';
      let originalStyle = 'text-decoration: line-through; opacity: 0.7; margin-right: 4px;';
      let correctionStyle = 'font-weight: bold;';

      if (type === 'grammar') {
        styles += 'background-color: #ffe4e6; border-color: #fecdd3; color: #e11d48;'; // rose
      } else if (type === 'vocab') {
        styles += 'background-color: #dbeafe; border-color: #bfdbfe; color: #2563eb;'; // blue
      } else { // spelling
        styles += 'background-color: #fef3c7; border-color: #fde68a; color: #d97706;'; // amber
      }

      return `<span style="${styles}"><span style="${originalStyle}">${original}</span><span style="${correctionStyle}">${correction}</span></span>`;
    });

    return html;
  };

  const handleExportWord = () => {
    const wordCount = userText.trim() === '' ? 0 : userText.trim().split(/\s+/).length;

    // Generate corrections history HTML
    let correctionHistoryHTML = '';
    if (sessionCorrections.length > 0) {
      const rows = sessionCorrections.map(c => `
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${new Date(c.timestamp).toLocaleTimeString()}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; color: #be123c; text-decoration: line-through;">${c.original}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; color: #059669; font-weight: bold;">${c.correction}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${c.explanation || c.type}</td>
        </tr>
      `).join('');

      correctionHistoryHTML = `
        <h2>8. Drafting Corrections (Lịch sử sửa lỗi khi viết)</h2>
        <div class="section-box">
          <p>These are issues you identified and fixed yourself using the tools:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11pt;">
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Time</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Original</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Correction</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Reason</th>
            </tr>
            ${rows}
          </table>
        </div>
      `;
    }

    // Generate Outline HTML
    let outlineHTML = '';
    if (outline && outline.length > 0) {
      const outlineRows = outline.map(section => `
        <div style="margin-bottom: 10px;">
          <strong style="color: #334155;">${section.sectionTitle}</strong>
          <ul style="margin-top: 5px; padding-left: 20px;">
            ${section.points.map(p => `<li>${p}</li>`).join('')}
          </ul>
          ${section.structures && section.structures.length > 0 ? `
            <div style="margin-top: 5px; font-size: 10pt; color: #4338ca; background: #e0e7ff; padding: 4px 8px; border-radius: 4px; display: inline-block;">
              <strong>Structures:</strong> ${section.structures.join(', ')}
            </div>
          ` : ''}
        </div>
      `).join('');

      outlineHTML = `
        <h2>9. Suggestions & Outline (Gợi ý & Dàn ý)</h2>
        <div class="section-box">
          <p>The following hints were generated to assist your writing:</p>
          ${outlineRows}
        </div>
      `;
    }

    // Official Model Answer HTML (If exists)
    let officialAnswerHTML = '';
    if (officialAnswer) {
      officialAnswerHTML = `
        <h2>7. Official Model Answer (Bài mẫu chuẩn)</h2>
        <div class="sample-answer" style="border-left: 5px solid #2563eb; background-color: #eff6ff;">
          <p style="font-weight: bold; margin-bottom: 10px; color: #1e40af;">From the Exam/Textbook:</p>
          ${officialAnswer.replace(/\n/g, '<br/>')}
        </div>
      `;
    }

    // AI Improved Version HTML (Generic)
    const aiSampleHTML = `
      <h2>${officialAnswer ? '8. AI Generated Answer (Bài mẫu tham khảo)' : '7. Model Answer (Bài mẫu tham khảo)'}</h2>
      <div class="sample-answer">
        ${feedback.sampleVersion.replace(/\n/g, '<br/>')}
      </div>
    `;

    // Improved User Text (Specific)
    let improvedUserTextHTML = '';
    if (feedback.improvedVersion) {
      improvedUserTextHTML = `
        <h2>${officialAnswer ? '9' : '8'}. Your Refined Text (Bài viết của bạn - Bản nâng cấp)</h2>
        <div class="section-box" style="border-left: 5px solid #8b5cf6; background-color: #f5f3ff;">
          <p style="font-style: italic; color: #4b5563; margin-bottom: 10px;">This is your original text rewritten to correct all grammar and improve flow, while keeping your original meaning:</p>
          <p style="white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 12pt;">${feedback.improvedVersion.replace(/\n/g, '<br/>')}</p>
        </div>
      `;
    }

    // Generate Summary HTML
    const summaryHTML = `
      <h2>${officialAnswer ? '11' : '10'}. Summary & Action Plan (Tổng hợp cuối bài)</h2>
      <div class="section-box" style="background-color: #f8fafc; border-left: 5px solid #4338ca;">
        <h3>Performance Overview</h3>
        <p><strong>Time Taken:</strong> ${formatTime(timeSpentSeconds)}</p>
        <p><strong>Word Count:</strong> ${wordCount} words</p>
        <p><strong>Final Score:</strong> ${feedback.score}/10</p>
        
        <h3>Key Takeaways</h3>
        <ul>
          <li><strong>Grammar:</strong> You made ${feedback.grammarCorrections.length} major grammatical errors. Review the corrections in Section 3 carefully.</li>
          <li><strong>Vocabulary:</strong> Consider using more advanced B1/B2 words like: <em>${feedback.betterVocabulary.slice(0, 5).join(', ')}</em>.</li>
          <li><strong>Structure:</strong> ${feedback.structureFeedback}</li>
        </ul>
        
        <h3>Next Steps</h3>
        <p>To improve your score next time:</p>
        <ol>
          <li>Review the <strong>Model Answer</strong> and compare it with yours.</li>
          <li>Practice the specific sentence structures highlighted in the Feedback.</li>
          <li>Try to rewrite this task again in 2-3 days without looking at the notes.</li>
        </ol>
      </div>
    `;

    // Process Inline Highlights for Word
    const inlineFeedbackHTML = generateInlineHtmlForWord(feedback.markupText);

    const headerContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Writing Feedback</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.6; color: #1e293b; }
          h1 { color: #4338ca; border-bottom: 2px solid #4338ca; padding-bottom: 10px; font-size: 24pt; }
          h2 { color: #1e40af; margin-top: 25px; font-size: 16pt; border-left: 5px solid #1e40af; padding-left: 10px; background-color: #f1f5f9; padding-top: 5px; padding-bottom: 5px; }
          h3 { color: #334155; font-size: 14pt; margin-top: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
          
          .score-box { border: 3px solid #4338ca; padding: 20px; background: #e0e7ff; text-align: center; margin: 20px 0; border-radius: 10px; }
          .score-title { font-size: 14pt; color: #3730a3; text-transform: uppercase; font-weight: bold; }
          .score { font-size: 48pt; font-weight: bold; color: #4338ca; display: block; margin: 10px 0; }
          .score-comment { font-style: italic; font-size: 12pt; color: #334155; }
          
          .section-box { border: 1px solid #cbd5e1; padding: 15px; margin-bottom: 15px; background-color: #ffffff; }
          
          /* Grammar Styles */
          .grammar-item { margin-bottom: 15px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px; }
          .original-text { color: #be123c; text-decoration: line-through; margin-right: 10px; }
          .correction-text { color: #059669; font-weight: bold; font-size: 13pt; background-color: #ecfdf5; padding: 2px 5px; }
          .explanation { color: #475569; font-style: italic; display: block; margin-top: 4px; }
          .structure-tag { display: inline-block; background-color: #e0e7ff; color: #4338ca; font-size: 9pt; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 4px; border: 1px solid #c7d2fe; }

          /* Vocabulary Styles */
          .vocab-list { list-style-type: none; padding: 0; }
          .vocab-item { display: inline-block; margin: 5px; background-color: #dbeafe; color: #1d4ed8; padding: 5px 12px; border-radius: 20px; border: 1px solid #bfdbfe; font-weight: bold; font-size: 11pt; }
          
          .user-answer { white-space: pre-wrap; background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2; }
          .sample-answer { background-color: #f0fdf4; border-left: 5px solid #059669; padding: 20px; font-style: italic; font-family: 'Times New Roman', serif; font-size: 12pt; }
        </style>
      </head>
      <body>
    `;

    const bodyContent = `
      <h1>${taskType === TaskType.Translation ? 'Translation Report' : 'Writing Feedback Report'}</h1>
      <p>
        <strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')} | 
        <strong>Task Type:</strong> ${taskType} |
        <strong>Time Spent:</strong> ${formatTime(timeSpentSeconds)} |
        <strong>Word Count:</strong> ${wordCount} words
      </p>
      
      <div class="score-box">
        <div class="score-title">Overall Score (Điểm số)</div>
        <span class="score">${feedback.score}/10</span>
        <div class="score-comment">"${feedback.generalComment}"</div>
      </div>

      <!-- TASK -->
      <h2>1. The Task (Đề bài)</h2>
      <div class="section-box">
        <p>${promptText.replace(/\n/g, '<br/>')}</p>
      </div>

      <!-- VISUAL FEEDBACK -->
      <h2>2. Visual Corrections (Sửa lỗi trực quan)</h2>
      <div class="user-answer">
        ${inlineFeedbackHTML}
      </div>

      <!-- ORIGINAL ANSWER -->
      <h2>3. Original Text (Bài làm gốc)</h2>
      <div class="section-box" style="font-family: 'Times New Roman'; font-style: italic;">
        ${userText.replace(/\n/g, '<br/>')}
      </div>

      <!-- GRAMMAR CORRECTIONS -->
      <h2>4. Detailed Explanations (Giải thích chi tiết)</h2>
      <div class="section-box">
        <p><i>Specific errors found in your writing:</i></p>
        ${feedback.grammarCorrections.length > 0 ? 
          feedback.grammarCorrections.map(c => `
            <div class="grammar-item">
              <div>
                <span class="original-text">${c.original}</span>
                <span>&rarr;</span>
                <span class="correction-text">${c.correction}</span>
              </div>
              <span class="explanation">💡 Explain: ${c.explanation}</span>
              ${c.grammarStructure ? `<br/><span class="structure-tag">Structure: ${c.grammarStructure}</span>` : ''}
            </div>`).join('') 
          : '<p>Excellent! No major grammar errors found. (Tuyệt vời! Không tìm thấy lỗi ngữ pháp lớn nào.)</p>'
        }
      </div>

      <!-- VOCABULARY -->
      <h2>5. Vocabulary Boost (Gợi ý Từ vựng)</h2>
      <div class="section-box">
        <p>Try using these B1/B2 words to improve your score (Thử dùng các từ sau):</p>
        <div class="vocab-list">
          ${feedback.betterVocabulary.map(v => `<span class="vocab-item">${v}</span>`).join('')}
        </div>
      </div>

      <!-- FEEDBACK -->
      <h2>6. Structure & Flow (Cấu trúc & Mạch văn)</h2>
      <div class="section-box">
        <p>${feedback.structureFeedback}</p>
      </div>

      <!-- OFFICIAL MODEL ANSWER -->
      ${officialAnswerHTML}

      <!-- AI MODEL ANSWER -->
      ${aiSampleHTML}
      
      <!-- IMPROVED USER TEXT -->
      ${improvedUserTextHTML}

      <!-- SESSION CORRECTIONS -->
      ${correctionHistoryHTML}
      
      <!-- OUTLINE & HINTS -->
      ${outlineHTML}

      <!-- SUMMARY -->
      ${summaryHTML}

      <br/><br/>
      <hr/>
      <p style="text-align: center; color: #94a3b8; font-size: 10pt;">Generated by B1 Writing Coach AI</p>
      </body></html>
    `;

    const fullContent = headerContent + bodyContent;
    const blob = new Blob(['\ufeff', fullContent], { type: 'application/msword' });
    
    // Download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `B1-Feedback-${new Date().toISOString().slice(0,10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 print:space-y-4 print:pb-0">
      {/* Header Score Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors print:shadow-none print:border print:p-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Assessment Complete</h2>
          <p className="text-slate-600 dark:text-slate-300">{feedback.generalComment}</p>
          <p className="text-sm text-slate-500 mt-2 font-mono">⏱️ Time Spent: {formatTime(timeSpentSeconds)}</p>
        </div>
        <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(feedback.score)} shrink-0 print:border-2`}>
          <span className="text-4xl font-extrabold">{feedback.score}</span>
          <span className="text-xs font-semibold uppercase opacity-80">Out of 10</span>
        </div>
      </div>

      {/* INLINE CORRECTION VIEWER */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden print:border-slate-300">
        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="text-xl">✍️</span> Detailed Corrections
          </h3>
          <div className="flex flex-wrap gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded text-rose-700 dark:text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Grammar
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-blue-700 dark:text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Vocab Choice
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded text-amber-700 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Spelling
            </div>
          </div>
        </div>
        
        <div className="p-8 text-lg leading-loose text-slate-800 dark:text-slate-200 font-serif whitespace-pre-wrap">
           {feedback.markupText 
             ? renderInlineFeedback(feedback.markupText) 
             : <span className="text-slate-500 italic">Inline feedback not available for this session. See list below.</span>
           }
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 print:block print:gap-4">
        {/* Left Col: Explanations */}
        <div className="space-y-6 print:space-y-4 print:mb-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors print:shadow-none print:border">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-6 py-4 border-b border-indigo-100 dark:border-indigo-800/50 flex items-center gap-2 print:py-2">
              <h3 className="font-bold text-indigo-800 dark:text-indigo-200">Explanations & Rules</h3>
            </div>
            <div className="p-6 space-y-4 print:p-4">
              {feedback.grammarCorrections.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 italic">Great job! No specific grammar errors to explain.</p>
              ) : (
                feedback.grammarCorrections.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700 print:bg-white print:border-slate-200 print:mb-2 group relative">
                     <button 
                      onClick={() => onSaveItem({
                        type: 'structure',
                        content: item.grammarStructure || item.correction,
                        note: item.explanation,
                        source: promptText
                      })}
                      className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 print:hidden"
                      title="Save to Notebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    </button>
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-mono leading-relaxed">
                         <span className="text-rose-500 line-through decoration-rose-300 break-words decoration-2">{item.original}</span>
                         <span className="text-slate-400 select-none">→</span>
                         <span className="text-emerald-600 dark:text-emerald-400 font-bold break-words">{item.correction}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-medium">💡 {item.explanation}</p>
                    {item.grammarStructure && (
                      <div className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded inline-block">
                        Structure: <span className="font-mono">{item.grammarStructure}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors print:shadow-none print:border">
             <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-4 border-b border-blue-100 dark:border-blue-800/50 flex items-center gap-2 print:py-2">
              <h3 className="font-bold text-blue-800 dark:text-blue-200">Vocabulary Boost</h3>
            </div>
            <div className="p-6 print:p-4">
              <div className="flex flex-wrap gap-2">
                {feedback.betterVocabulary.map((word, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => onSaveItem({
                      type: 'vocabulary',
                      content: word,
                      note: 'Vocabulary Suggestion',
                      source: promptText
                    })}
                    className="group flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold border border-blue-100 dark:border-blue-800 print:border-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    {word}
                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 opacity-0 group-hover:opacity-100 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Structure & Sample */}
        <div className="space-y-6 print:space-y-4">
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors print:shadow-none print:border">
             <div className="bg-amber-50 dark:bg-amber-900/30 px-6 py-4 border-b border-amber-100 dark:border-amber-800/50 flex items-center gap-2 print:py-2">
              <h3 className="font-bold text-amber-800 dark:text-amber-200">{taskType === TaskType.Translation ? 'Translation Notes' : 'Structure & Flow'}</h3>
            </div>
            <div className="p-6 print:p-4">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{feedback.structureFeedback}</p>
            </div>
          </div>

          {/* OFFICIAL ANSWER CARD */}
          {officialAnswer && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors print:shadow-none print:border print:break-inside-avoid">
              <div className="bg-blue-100 dark:bg-blue-900/50 px-6 py-4 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2 print:py-2">
                <h3 className="font-bold text-blue-800 dark:text-blue-200">Official Model Answer</h3>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 print:bg-white print:p-4 relative group">
                <button 
                  onClick={() => onSaveItem({
                    type: 'structure',
                    content: 'Official Answer Segment',
                    note: officialAnswer.substring(0, 50) + '...',
                    source: promptText
                  })}
                  className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 print:hidden"
                  title="Save to Notebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
                <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-serif text-sm border-l-4 border-blue-300 dark:border-blue-700 pl-4">
                  {renderClickableText(officialAnswer)}
                </p>
              </div>
            </div>
          )}

          {/* AI MODEL ANSWER CARD */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors print:shadow-none print:border print:break-inside-avoid">
             <div className="bg-emerald-50 dark:bg-emerald-900/30 px-6 py-4 border-b border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2 print:py-2">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-200">{officialAnswer ? 'AI Generated Answer' : 'Model Answer'}</h3>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 print:bg-white print:p-4 relative group">
              <button 
                onClick={() => onSaveItem({
                  type: 'structure',
                  content: 'Model Answer Segment',
                  note: feedback.sampleVersion.substring(0, 50) + '...',
                  source: promptText
                })}
                 className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 print:hidden"
                 title="Save to Notebook"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-serif text-sm border-l-4 border-emerald-200 dark:border-emerald-800 pl-4">
                {renderClickableText(feedback.sampleVersion)}
              </p>
            </div>
          </div>

          {/* IMPROVED USER TEXT CARD */}
          {feedback.improvedVersion && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors print:shadow-none print:border print:break-inside-avoid">
               <div className="bg-violet-50 dark:bg-violet-900/30 px-6 py-4 border-b border-violet-100 dark:border-violet-800/50 flex items-center gap-2 print:py-2">
                <h3 className="font-bold text-violet-800 dark:text-violet-200">Your Refined Text</h3>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 print:bg-white print:p-4 relative group">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 italic">
                  Your original text rewritten for better grammar and flow, keeping your meaning:
                </p>
                <button 
                  onClick={() => onSaveItem({
                    type: 'structure',
                    content: 'Polished Version',
                    note: feedback.improvedVersion?.substring(0, 50) + '...',
                    source: promptText
                  })}
                   className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 print:hidden"
                   title="Save to Notebook"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
                <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-serif text-sm border-l-4 border-violet-300 dark:border-violet-700 pl-4">
                  {renderClickableText(feedback.improvedVersion)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-slate-200 dark:border-slate-700 print:hidden">
        <Button variant="outline" onClick={onRetry}>
          Keep Editing
        </Button>
        <Button variant="outline" onClick={handleExportWord} className="text-blue-600 border-blue-200 hover:border-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l-1.5 6 3-1.5 3 1.5-1.5-6"/></svg>
            Save to Word (.doc)
        </Button>
        <Button onClick={onNewTask}>
          Try New Task
        </Button>
      </div>
    </div>
  );
};
