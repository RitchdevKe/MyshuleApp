import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Download, 
  Check, 
  AlertCircle, 
  FileSpreadsheet, 
  Loader2,
  Trash
} from 'lucide-react';
import { Student } from '../types.ts';

interface BulkStudentImportProps {
  onClose: () => void;
  onImportDone: (newStudents: Student[]) => void;
  existingStudents: Student[];
}

export function BulkStudentImport({ onClose, onImportDone, existingStudents }: BulkStudentImportProps) {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Simulated row metrics
  const [parsedRows, setParsedRows] = useState<Student[]>([]);
  const [validationLogs, setValidationLogs] = useState<Array<{ row: number; studentId: string; status: 'imported' | 'skipped'; reason?: string }>>([]);

  const handleSimulateFileSelect = () => {
    setIsProcessing(true);
    setFileName('student_import_records.xlsx');
    setFileSelected(true);

    // Simulate parsing rows in timeout
    setTimeout(() => {
      // 5 Mock rows from Excel
      const mockRawRows = [
        { id: 'S-7123', name: 'Ama Boateng', gender: 'F' as const, form: 1, stream: 'East' },
        { id: 'S-8291', name: 'Abena Mensah', gender: 'F' as const, form: 1, stream: 'West' },
        { id: 'S-401', name: 'Adrian Kipirono', gender: 'M' as const, form: 4, stream: 'North' }, // Conflict!
        { id: 'S-402', name: 'Douglas Omari', gender: 'M' as const, form: 4, stream: 'North' }, // Conflict!
        { id: 'S-9302', name: 'James Kumi', gender: 'M' as const, form: 2, stream: 'East' }
      ];

      const logs: typeof validationLogs = [];
      const successfulImports: Student[] = [];

      mockRawRows.forEach((raw, idx) => {
        const rowNum = idx + 2; // Rows start from 2 (excluding header)
        const isConflict = existingStudents.some(s => s.id.toUpperCase() === raw.id.toUpperCase());

        if (isConflict) {
          logs.push({
            row: rowNum,
            studentId: raw.id,
            status: 'skipped',
            reason: `Student registry ID ${raw.id} already exists, skipped`
          });
        } else {
          successfulImports.push({
            id: raw.id,
            admissionNo: raw.id,
            name: raw.name,
            gender: raw.gender,
            form: raw.form,
            stream: raw.stream,
            feeBalance: 45000,
            totalFees: 45000,
            attendancePercentage: 98,
            status: 'Active',
            email: `${raw.name.toLowerCase().replace(' ', '.')}@karega.sc.ke`
          });
          logs.push({
            row: rowNum,
            studentId: raw.id,
            status: 'imported'
          });
        }
      });

      setParsedRows(successfulImports);
      setValidationLogs(logs);
      setIsProcessing(false);
      setIsComplete(true);
    }, 1800);
  };

  const handleApplyImport = () => {
    onImportDone(parsedRows);
    onClose();
  };

  const downloadTemplateSim = () => {
    // Simulated template download alert
    toast.success('Student Onboarding Excel Template triggered! Saved 58 fields to your system downloads.');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-150 shadow-2xl overflow-hidden flex flex-col font-sans text-slate-800 animate-fade-in">
        
        {/* Header bar */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="w-5 h-5 stroke-[2]" />
            </span>
            <h3 className="font-bold text-slate-900 tracking-tight text-xl uppercase tabular-nums">Bulk Student Import</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form panel */}
        <div className="p-6 space-y-5 text-lg flex-1">
          <p className="text-slate-500 leading-relaxed font-medium">
            Upload an Excel or CSV spreadsheet containing details to enroll multiple students simultaneously. This automatically synchronizes logs for medical profiles, logistics options, and parental parameters.
          </p>

          {/* Excel spreadsheet download button */}
          <div className="bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl p-2 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-[13.5px]">CSV/Excel Template</span>
              <span className="text-[16px] text-slate-500 block leading-snug">Download our pre-formatted spreadsheet containing the correct onboarding columns.</span>
            </div>
            <button
              onClick={downloadTemplateSim}
              className="px-1.5 py-2 hover:bg-white hover:border-slate-300 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] text-slate-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-sm bg-slate-50 tabular-nums text-[15px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" /> DOWNLOAD
            </button>
          </div>

          {/* Upload Dropzone */}
          {!fileSelected && (
            <div 
              onClick={handleSimulateFileSelect}
              className="border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-9 text-center bg-slate-50/50 hover:bg-slate-50/80 transition cursor-pointer flex flex-col items-center group"
            >
              <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-primary mb-3 transition duration-200" />
              <span className="font-bold text-[17px] text-slate-800">Click to import CSV/Excel file</span>
              <span className="text-[15px] text-slate-500 mt-1">Supports spreadsheet types up to 10MB (.xlsx, .xls, .csv)</span>
            </div>
          )}

          {/* Processing display */}
          {isProcessing && (
            <div className="border border-slate-100 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 bg-white text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin stroke-[2.2]" />
              <div className="space-y-1">
                <span className="font-bold text-slate-800 text-[13.5px] block">Analyzing columns & formatting...</span>
                <span className="text-[12.5px] text-slate-500 block">Validating database registers against duplicate inputs.</span>
              </div>
            </div>
          )}

          {/* Completed parsing result */}
          {isComplete && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </span>
                  <div>
                    <span className="font-bold text-[13.5px] block">Import complete</span>
                    <p className="text-[12.5px] text-emerald-600 font-medium">
                      {parsedRows.length} students imported, {validationLogs.filter(l => l.status === 'skipped').length} skipped
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl p-2 text-center">
                  <span className="block text-3xl font-bold text-slate-800">{parsedRows.length + validationLogs.filter(l => l.status === 'skipped').length}</span>
                  <span className="text-[14px] uppercase font-bold text-slate-400 mt-1 block">Total</span>
                </div>
                <div className="flex-1 bg-white border border-emerald-200 rounded-xl p-4 text-center shadow-sm shadow-emerald-100">
                  <span className="block text-3xl font-bold text-emerald-600">{parsedRows.length}</span>
                  <span className="text-[14px] uppercase font-bold text-emerald-500 mt-1 block">Imported</span>
                </div>
                <div className="flex-1 bg-white border border-rose-200 rounded-xl p-4 text-center shadow-sm shadow-rose-100">
                  <span className="block text-3xl font-bold text-rose-600">{validationLogs.filter(l => l.status === 'skipped').length}</span>
                  <span className="text-[14px] uppercase font-bold text-rose-500 mt-1 block">Skipped</span>
                </div>
              </div>

              {/* Errors / Validation details list */}
              {validationLogs.filter(l => l.status === 'skipped').length > 0 && (
                <div className="space-y-2">
                  <span className="block font-bold text-slate-700 text-[16px]">Errors:</span>
                  <div className="border border-rose-100 bg-rose-50/50 rounded-xl max-h-32 overflow-y-auto tabular-nums text-[15px] p-2">
                    {validationLogs.filter(l => l.status === 'skipped').map(log => (
                      <div key={log.row} className="py-1.5 px-2 text-rose-700">
                        Row {log.row}: Student ID {log.studentId} already exists
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 flex items-center justify-center border-t border-slate-100 bg-slate-50/50">
          {isComplete ? (
            <button
              onClick={handleApplyImport}
              className="px-8 py-2.5 bg-[#ea580c] hover:bg-orange-500 text-white text-[17px] font-bold rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
            >
              Done
            </button>
          ) : (
             <div className="flex gap-3 w-full justify-end">
               <button onClick={onClose} className="px-2.5 py-2.5 bg-white text-slate-700 text-[17px] font-bold rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] cursor-pointer hover:bg-slate-50 transition">Cancel</button>
               <button onClick={handleSimulateFileSelect} className="px-5 py-2.5 bg-[#ea580c] hover:bg-orange-500 text-white text-[17px] font-bold rounded-xl border border-orange-600 cursor-pointer shadow-md shadow-orange-500/20 transition">Import {fileSelected ? '& Evaluate' : ''}</button>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
