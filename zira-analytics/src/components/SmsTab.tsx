import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  collection, 
  setDoc, 
  doc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { Student, SmsLog, SmsType } from '../types.ts';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Smartphone, 
  HelpCircle,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface SmsTabProps {
  students: Student[];
  smsLogs: SmsLog[];
}

export function SmsTab({ students, smsLogs }: SmsTabProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [smsType, setSmsType] = useState<SmsType>('exam');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatching, setDispatching] = useState(false);

  // Filter SMS Logs
  const filteredLogs = smsLogs.filter((log) => {
    return log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           log.message.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleStudentSelectChange = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Set sample Kenyan phone layout
    setRecipient('+2547' + Math.floor(10000000 + Math.random() * 90000000));

    // Compile dynamic template based on SMS category
    if (smsType === 'exam') {
      setMessage(`Dear Parent, Terminal grading for ${student.name} is scheduled to dispatch shortly. Kindly prepare for report card compilation review next week. Karega Office.`);
    } else if (smsType === 'fee') {
      setMessage(`Dear Parent, school fees record for ${student.name} (ADM: ${student.id}) has a remaining balance of KES ${student.feeBalance.toLocaleString()}. Please clear immediately at any Co-op Bank branch. Principal.`);
    } else {
      setMessage(`Dear Parents, Karega Secondary School general midterm begins June 3rd. All students must depart with signed clearance documents. Term dispatches. Teacher Hia.`);
    }
  };

  const handleSmsTypeChange = (type: SmsType) => {
    setSmsType(type);
    if (!selectedStudentId) return;
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    if (type === 'exam') {
      setMessage(`Dear Parent, Terminal grading for ${student.name} is scheduled to dispatch shortly. Kindly prepare for report card compilation review next week. Karega Office.`);
    } else if (type === 'fee') {
      setMessage(`Dear Parent, school fees record for ${student.name} (ADM: ${student.id}) has a remaining balance of KES ${student.feeBalance.toLocaleString()}. Please clear immediately at any Co-op Bank branch. Principal.`);
    } else {
      setMessage(`Dear Parents, Karega Secondary School general midterm begins June 3rd. All students must depart with signed clearance documents. Term dispatches. Teacher Hia.`);
    }
  };

  const handleDispatchSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !recipient || !message) return;
    setDispatching(true);

    const targetStudent = students.find(s => s.id === selectedStudentId);
    if (!targetStudent) return;

    const logId = 'sms-' + Date.now();
    const payload: SmsLog = {
      id: logId,
      studentId: selectedStudentId,
      studentName: targetStudent.name,
      recipient: recipient.trim(),
      message: message.trim(),
      sentAt: new Date().toISOString(),
      status: 'sent',
      type: smsType
    };

    const path = 'sms_logs';
    try {
      await setDoc(doc(db, path, logId), payload);
      setMessage('');
      setSelectedStudentId('');
      setRecipient('');
      toast.success("Parents SMS alert dispatched via Zira GSM gateway.");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path + '/' + logId);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. SMS Dispatch Composer */}
        <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm lg:col-span-1 space-y-2 h-fit text-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Smartphone className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">GSM Composer Panel</h3>
          </div>

          <form onSubmit={handleDispatchSms} className="space-y-4 text-lg font-semibold">
            {/* Template Selection */}
            <div>
              <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Notification Category</label>
              <div className="grid grid-cols-3 gap-2">
                {(['exam', 'fee', 'announcement'] as SmsType[]).map((cat) => (
                  <button
                    id={`sms-cat-${cat}`}
                    key={cat}
                    type="button"
                    onClick={() => handleSmsTypeChange(cat)}
                    className={`py-1.5 rounded-lg font-bold border capitalize transition cursor-pointer text-center text-[16px] ${
                      smsType === cat 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Student selection */}
            <div>
              <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Target Parent Registry</label>
              <select
                id="sms-student-select"
                required
                value={selectedStudentId}
                onChange={(e) => handleStudentSelectChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition cursor-pointer"
              >
                <option value="" className="bg-white text-slate-400">Choose a student...</option>
                {students.map((stud) => (
                  <option key={stud.id} value={stud.id} className="bg-white text-slate-800">
                    {stud.name} ({stud.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Number */}
            <div>
              <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Parent Mobile Recipient</label>
              <input
                id="sms-recipient-num"
                type="text"
                required
                placeholder="+254712345678"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition"
              />
            </div>

            {/* Message payload text */}
            <div>
              <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">SMS Dispatch Payload</label>
              <textarea
                id="sms-payload-text"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message details dispatched here..."
                className="w-full p-3 border border-slate-200 bg-slate-50 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition leading-relaxed resize-none font-sans font-medium"
              />
              <span className="text-[15px] text-slate-500 mt-1 block text-right tabular-nums">
                {message.length} characters (approx. {Math.ceil(message.length / 160)} SMS units)
              </span>
            </div>

            <button
              id="sms-dispatch-submit-btn"
              type="submit"
              disabled={dispatching || !selectedStudentId}
              className="w-full h-10 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition duration-150 shrink-0 cursor-pointer shadow-md shadow-indigo-600/10 border border-indigo-500/15 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              {dispatching ? 'Dispatching...' : 'Dispatch GSM Alert'}
            </button>
          </form>
        </div>

        {/* 2. Dispatch logs view history */}
        <div className="bg-white rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between text-slate-800">
          <div>
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-sans uppercase tracking-tight">GSM Communication Log</h3>
                <p className="text-slate-500 text-lg mt-0.5">Automated and manually triggered SMS alerts history</p>
              </div>
              <div className="relative w-48 font-semibold">
                <Search className="absolute inset-y-0 left-2.5 my-auto w-3.5 h-3.5 text-indigo-600 font-bold" />
                <input
                  id="sms-filter-search"
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[16px] text-slate-800 placeholder:text-slate-450 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-slate-50 transition"
                />
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-24 text-slate-400 space-y-3 bg-white">
                <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xl font-bold">No GSM dispatches recorded.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 bg-white">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-5 hover:bg-slate-50/60 transition flex items-start justify-between gap-4 border-b border-slate-100">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap text-[16px] font-bold text-slate-500">
                        <span className="font-sans text-slate-900 font-bold">{log.studentName}</span>
                        <span>•</span>
                        <span className="tabular-nums text-indigo-700 font-bold">{log.recipient}</span>
                        <span>•</span>
                        <span className="tabular-nums">{new Date(log.sentAt).toLocaleString()}</span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[15px] px-1.5 py-0.5 rounded capitalize">
                          {log.type}
                        </span>
                      </div>
                      <p className="text-lg text-slate-600 leading-normal font-sans font-semibold">{log.message}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[16px] bg-emerald-50 text-emerald-700 font-bold py-1 px-2.5 rounded-full shrink-0 border border-emerald-200">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      Delivered
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
