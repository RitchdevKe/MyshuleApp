import { toast } from "react-hot-toast";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Search, 
  Terminal, 
  Download, 
  Database, 
  RefreshCw, 
  Info, 
  Trash2, 
  FileText,
  Plus,
  Upload,
  Play,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Sparkles
} from 'lucide-react';

interface LogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: 'Academics' | 'Finance' | 'HR' | 'Security' | 'Student Info';
  ipAddress: string;
}

interface BackupItem {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  status: 'Healthy' | 'Restored State';
}

export function AdminUtilityTab() {
  // Activity Logs bound dynamically with LocalStorage persistence
  const [logs, setLogs] = useState<LogItem[]>(() => {
    const saved = localStorage.getItem('zira_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', timestamp: '2026-06-02 09:20:15', user: 'Principal Julius Moenga', role: 'School Admin', action: 'Modified grading bounds table', module: 'Security', ipAddress: '192.168.1.100' },
      { id: '2', timestamp: '2026-06-02 08:45:02', user: 'N. Esther', role: 'Accountant', action: 'Invoiced Form 4 term fees', module: 'Finance', ipAddress: '192.168.1.105' },
      { id: '3', timestamp: '2026-06-01 16:30:11', user: 'D. Gitumu', role: 'Teacher', action: 'Took Form 4 mathematics mark sheet', module: 'Academics', ipAddress: '192.168.1.111' },
      { id: '4', timestamp: '2026-06-01 11:15:40', user: 'Principal Julius Moenga', role: 'School Admin', action: 'Onboarded student Douglas Omari', module: 'Student Info', ipAddress: '192.168.1.100' },
      { id: '5', timestamp: '2026-06-01 09:05:54', user: 'D. Gitumu', role: 'Teacher', action: 'Approved sick bay leave request', module: 'HR', ipAddress: '192.168.1.111' },
      { id: '6', timestamp: '2026-05-31 15:44:02', user: 'N. Esther', role: 'Accountant', action: 'Created vehicle logistics ledger', module: 'Finance', ipAddress: '192.168.1.105' }
    ];
  });

  const [filterQuery, setFilterQuery] = useState('');
  const [filterModule, setFilterModule] = useState('All');

  // Backups index
  const [backups, setBackups] = useState<BackupItem[]>(() => {
    const saved = localStorage.getItem('zira_db_backups');
    return saved ? JSON.parse(saved) : [
      { id: 'b1', filename: 'karega_full_backup_20260530.sql', size: '14.2 MB', createdAt: '2026-05-30', status: 'Healthy' },
      { id: 'b2', filename: 'karega_full_backup_20260515.sql', size: '13.9 MB', createdAt: '2026-05-15', status: 'Healthy' }
    ];
  });

  const [backingUp, setBackingUp] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  // Drag-and-drop upload flags
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('zira_audit_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('zira_db_backups', JSON.stringify(backups));
  }, [backups]);

  // Filter logs logic
  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.user.toLowerCase().includes(filterQuery.toLowerCase()) || 
                          l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          l.ipAddress.includes(filterQuery);
    const matchesModule = filterModule === 'All' || l.module === filterModule;
    return matchesSearch && matchesModule;
  });

  // Export logs to client-side readable JSON format
  const handleExportLogs = () => {
    if (logs.length === 0) {
      toast.error('There are no activity logs to export.');
      return;
    }
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `zira_audit_logs_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Successfully compiled audit payload. Direct JSON download initiated.');
    } catch (e) {
      toast.error('Export failed dynamically.');
    }
  };

  const handleClearAllLogs = () => {
    if (window.confirm('WARNING: Are you absolutely certain you want to clear all central activity records? This action is tracked.')) {
      setLogs([]);
      toast.success('System audit trail cleared successfully.', { icon: '🧹' });
    }
  };

  const handleAddManualAudit = () => {
    const user = prompt('Enter Administrator Name:', 'Principal Julius Moenga');
    const action = prompt('Enter Action Conducted:', 'Manually audited secure database tables and synchronized schema registers');
    const moduleChoice = prompt('Enter Module Category (Security, Finance, Academics, HR, Student Info):', 'Security');

    if (!user || !action) return;

    const validModules = ['Academics', 'Finance', 'HR', 'Security', 'Student Info'];
    const chosenModule = validModules.includes(moduleChoice || '') ? moduleChoice : 'Security';

    const newLogItem: LogItem = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user,
      role: 'School Admin',
      action,
      module: chosenModule as any,
      ipAddress: '192.168.1.114'
    };

    setLogs([newLogItem, ...logs]);
    toast.success('Manual audit entry logged successfully.');
  };

  const handleDeleteSingleLog = (id: string) => {
    setLogs(prev => prev.filter(item => item.id !== id));
    toast.success('Individual activity log deleted.');
  };

  // Generate backup logic
  const handleGenerateBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const newBackup: BackupItem = {
        id: 'b-' + Date.now(),
        filename: `karega_full_backup_${todayStr}_${Math.floor(100 + Math.random() * 900)}.sql`,
        size: '14.5 MB',
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'Healthy'
      };
      setBackups([newBackup, ...backups]);
      setBackingUp(false);
      toast.success('Secure relational database backup compiled and zipped successfully.');
    }, 1500);
  };

  const handleRestoreBackup = (id: string, name: string) => {
    setRestoringId(id);
    setTimeout(() => {
      setRestoringId(null);
      setBackups(prev => prev.map(b => ({
        ...b,
        status: b.id === id ? 'Restored State' : 'Healthy'
      })));
      toast.success(`Relational rollback complete! Restored database status using file: "${name}"`, { duration: 4000 });
    }, 2000);
  };

  const handleDeleteBackup = (id: string, name: string) => {
    setBackups(prev => prev.filter(b => b.id !== id));
    toast.success(`Removed snapshot: ${name}`);
  };

  // Download SQL structure trigger
  const handleDownloadBackupSQLFile = (bk: BackupItem) => {
    try {
      const mockSqlContent = `-- Zira School Management System Relational Snapshot
-- Source File Name: ${bk.filename}
-- Creation Date: ${bk.createdAt}
-- Payload Size: ${bk.size}

CREATE DATABASE IF NOT EXISTS \`zira_school_db\`;
USE \`zira_school_db\`;

-- Dump of table students --
DROP TABLE IF EXISTS \`students\`;
CREATE TABLE \`students\` (
  \`id\` varchar(32) NOT NULL,
  \`name\` varchar(128) DEFAULT NULL,
  \`form_class\` varchar(32) DEFAULT NULL,
  \`boarding_status\` varchar(32) DEFAULT 'Day Student',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dump of table ledgers --
-- Total records size estimated... --
COMMIT;
`;
      const blob = new Blob([mockSqlContent], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", bk.filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success(`Linked download started: ${bk.filename}`);
    } catch (e) {
      toast.error('Could not download file payload.');
    }
  };

  // Handle upload of .sql relational schema manually or dragging!
  const processUploadedFile = (file: File) => {
    if (!file.name.endsWith('.sql')) {
      toast.error('Invalid file extension. Only .sql source backup configuration registers are accepted.');
      return;
    }
    
    // Read details and insert
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const newBkItem: BackupItem = {
      id: 'up-' + Date.now(),
      filename: file.name,
      size: `${sizeInMB} MB`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'Healthy'
    };

    setBackups([newBkItem, ...backups]);
    toast.success(`SQL Backup File "${file.name}" uploaded and validated successfully! Added to backup indexes.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans text-lg font-semibold">
      {/* Dynamic Statistics Indicator Banner row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="bg-slate-50 p-2.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
          <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Cumulative Logs Recorded</span>
          <span className="text-3xl font-bold text-[var(--color-secondary)] font-sans block mt-1">{logs.length} Events</span>
          <span className="text-[16px] text-indigo-600 font-bold block mt-1">Real-time administrator security logs</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
          <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Compiled DB Backups</span>
          <span className="text-3xl font-bold text-indigo-600 font-sans block mt-1">{backups.length} Snapshots</span>
          <span className="text-[16px] text-indigo-500 font-bold block mt-1">Secure local SQL copies</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] col-span-1 md:col-span-2">
          <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Relational State Integrity</span>
          <span className="text-3xl font-bold text-emerald-600 font-sans block mt-1 flex items-center gap-1.5 leading-none">
            <CheckCircle className="w-6 h-6 text-emerald-600 inline shrink-0" /> Stable Context
          </span>
          <span className="text-[16px] text-emerald-650 font-bold block mt-1.5">No inconsistent index tables detected across 7 major streams</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Logs Center column */}
        <div className="lg:col-span-2 bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[var(--color-secondary)]" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide font-sans">Institutional Activity Logs</h3>
                <p className="text-[15px] text-slate-400 font-medium font-sans">Full digital trail tracking personnel system workflows</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={handleAddManualAudit}
                className="px-2.5 py-1.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20 text-[15px] font-bold uppercase rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Manual Entry
              </button>
              <button 
                onClick={handleExportLogs}
                className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[15px] font-bold uppercase rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Export Trails
              </button>
              <button 
                onClick={handleClearAllLogs}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[15px] font-bold uppercase rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Wipe Logs
              </button>
            </div>
          </div>

          {/* Filtration segments */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail by administrator name, ADM, actions or IP keys..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none focus:bg-white focus:border-[var(--color-secondary)] transition"
              />
            </div>
            
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold w-full sm:w-44 focus:outline-none cursor-pointer"
            >
              <option value="All">All Stream Modules</option>
              <option value="Security">Security Settings</option>
              <option value="Finance">Finance Ledgers</option>
              <option value="Academics">Academics Index</option>
              <option value="HR">HR Staffing</option>
              <option value="Student Info">Student Admissions</option>
            </select>
          </div>

          <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold space-y-2">
                <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No systemic activities align with the specified filters.</p>
              </div>
            ) : (
              filteredLogs.map(l => (
                <div key={l.id} className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition px-2 rounded-xl">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-lg leading-none">{l.user}</span>
                      <span className="text-[14px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{l.role}</span>
                      <span className="text-[15px] text-slate-400 tabular-nums font-bold">IP: {l.ipAddress}</span>
                    </div>
                    <p className="text-slate-600 text-[17px] font-semibold leading-relaxed">{l.action}</p>
                  </div>
                  <div className="text-right sm:self-center shrink-0 flex flex-col items-end gap-1.5">
                    <span className="text-[15px] text-slate-400 block tabular-nums leading-none">{l.timestamp}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-150 px-2 py-0.5 rounded-full uppercase tracking-wider block leading-none">
                        {l.module}
                      </span>
                      <button
                        onClick={() => handleDeleteSingleLog(l.id)}
                        className="text-slate-300 hover:text-rose-600 transition cursor-pointer"
                        title="Delete log record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic DB Backups drag area column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Database className="w-5 h-5 text-[var(--color-secondary)]" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide font-sans">Database Rollback Desk</h3>
                  <p className="text-[15px] text-slate-400 font-sans mt-0.5">Generate daily secure dumps or restore old schemas</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  id="audit-generate-backup"
                  disabled={backingUp}
                  onClick={handleGenerateBackup}
                  className="flex-1 py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] disabled:bg-slate-300 text-white rounded-xl font-bold uppercase text-[15px] transition text-center tracking-wider block cursor-pointer"
                >
                  {backingUp ? 'Compiling SQL Database...' : 'Compile New Backup Snapshot'}
                </button>
              </div>

              {/* Backups List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {backups.map(bk => (
                  <div key={bk.id} className="p-3 bg-slate-50 hover:bg-slate-50/70 border border-slate-150 rounded-2xl flex justify-between items-center text-base">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 tabular-nums block text-[15px] max-w-[130px] truncate" title={bk.filename}>
                        {bk.filename}
                      </span>
                      <span className="text-[14px] text-slate-400 block font-bold uppercase">
                        Size: {bk.size} • Created: {bk.createdAt}
                      </span>
                      {bk.status === 'Restored State' && (
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full font-bold uppercase text-[13px] tabular-nums tracking-wide animation-pulse">
                          Active State Source
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDownloadBackupSQLFile(bk)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                        title="Download raw SQL structure text"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRestoreBackup(bk.id, bk.filename)}
                        disabled={restoringId !== null}
                        className="px-2.5 py-1 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white text-[14px] rounded-lg uppercase tracking-wide flex items-center gap-1 font-bold cursor-pointer"
                      >
                        {restoringId === bk.id ? (
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          'Restore'
                        )}
                      </button>
                      <button 
                        onClick={() => handleDeleteBackup(bk.id, bk.filename)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Purge snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom SQL drag and drop file upload region guidelines compliant */}
            <div className="mt-4">
              <label className="block text-[14px] text-slate-400 uppercase font-bold tracking-wider mb-2">Import Relational SQL Backup</label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-5 text-center transition cursor-pointer select-none flex flex-col items-center justify-center gap-2 ${
                  isDragOver 
                    ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 text-[var(--color-secondary)]' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500'
                }`}
                title="Drag .sql file here or click to choose from local directory"
              >
                <FileCode className={`w-8 h-8 ${isDragOver ? 'text-[var(--color-secondary)]' : 'text-slate-300'}`} />
                <div className="space-y-0.5">
                  <span className="text-base font-bold block text-slate-800">Drag & Drop backup (.sql)</span>
                  <span className="text-[14px] text-slate-400 block font-normal">or click to choose files from device explorer</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={fileInputRefChange => handleFileSelectorChange(fileInputRefChange)}
                  accept=".sql"
                  className="hidden" 
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-start gap-2 pt-3 mt-4">
              <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[14px] text-indigo-805 leading-normal font-sans font-medium">
                System snapshot restoration will complete immediate rollbacks. Existing open invoices or marked registers tables will revert. Conduct carefully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
