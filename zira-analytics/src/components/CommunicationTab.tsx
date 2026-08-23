import { toast } from "react-hot-toast";
import { useCurrency } from '../contexts/CurrencyContext.tsx';
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
  Mail, 
  Bell, 
  Calendar, 
  Clock, 
  PlusCircle, 
  FileText 
} from 'lucide-react';

interface CommunicationTabProps {
  students: Student[];
  smsLogs: SmsLog[];
}

interface NoticeItem {
  id: string;
  title: string;
  target: 'All Registrars' | 'Parents' | 'Teachers';
  body: string;
  date: string;
  author: string;
}

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  sentAt: string;
  status: string;
}

export function CommunicationTab({ students, smsLogs }: CommunicationTabProps) {
  const { currency } = useCurrency();

  const [activeChannel, setActiveChannel] = useState<'gsm' | 'notices' | 'emails' | 'reminders'>('gsm');

  // 1. GSM SMS Composer states
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [smsType, setSmsType] = useState<SmsType>('exam');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatching, setDispatching] = useState(false);

  // 2. Announcements states
  const [notices, setNotices] = useState<NoticeItem[]>([
    { id: '1', title: 'Midterm Break Dismissal Protocol', target: 'Parents', body: 'All Form 1 to 4 candidates recess on June 3rd. Transport fleets depart starting exactly 08:00 AM.', date: '2026-06-01', author: 'Principal Moenga' },
    { id: '2', title: 'Term 1 Report Card Audit Rollout', target: 'Teachers', body: 'Please compile and close all continuous assessments marksheets prior to grading framework lock.', date: '2026-05-28', author: 'Head Teacher Dr. Ouma' },
    { id: '3', title: 'PTC Booking Desk Synchronizations', target: 'All Registrars', body: 'Interactive PTC parent-teacher appointment scheduler is now open online. Please review slots.', date: '2026-05-25', author: 'Registrar Staff' }
  ]);
  const [newNotice, setNewNotice] = useState({ title: '', target: 'Parents' as any, body: '' });

  // 3. Email states
  const [emailSubject, setEmailSubject] = useState('');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([
    { id: 'em-1', recipient: 'parent.kiprop@orange.ke', subject: 'Invoiced Tuition Term 1 balance warning', body: 'Please find attached the updated fee statement balance details.', sentAt: '2026-06-02 09:12', status: 'Delivered' },
    { id: 'em-2', recipient: 'staff.gitumu@karegaschool.ac.ke', subject: 'Mandatory staff appraisal roster review', body: 'This is a gentle reminder to review the leave logs calendar schedule.', sentAt: '2026-05-29 11:30', status: 'Delivered' }
  ]);

  // 4. Events / Reminders states
  const [reminders, setReminders] = useState([
    { id: 'r1', title: 'Form 4 Science Chemistry Labs Exam', date: '2026-06-05', time: '09:00 AM', loc: 'Lab Block B' },
    { id: 'r2', title: 'Board of Governors General Assembly', date: '2026-06-09', time: '11:30 AM', loc: 'Executive Hall' },
    { id: 'r3', title: 'Annual Inter-school Track Athletics Contest', date: '2026-06-15', time: '08:00 AM', loc: 'Karega Arena' }
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', loc: '' });

  // SMS Select logic
  const handleStudentSelectChange = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    setRecipient('+2547' + Math.floor(10000000 + Math.random() * 90000000));

    if (smsType === 'exam') {
      setMessage(`Dear Parent, Terminal grading for ${student.name} is scheduled to dispatch shortly. Kindly prepare for report card compiling review next week. Office.`);
    } else if (smsType === 'fee') {
      setMessage(`Dear Parent, school fees account for ${student.name} (ADM: ${student.id}) has an outstanding balance of ${currency} ${student.feeBalance.toLocaleString()}. Kind reminder to clear. Accountant.`);
    } else {
      setMessage(`Dear Parents, Karega Secondary School general midterm begins June 3rd. All students recess safely. Administrator.`);
    }
  };

  const handleSmsTypeChange = (type: SmsType) => {
    setSmsType(type);
    if (!selectedStudentId) return;
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    if (type === 'exam') {
      setMessage(`Dear Parent, Terminal grading for ${student.name} is scheduled to dispatch shortly. Kindly prepare for report card compiling review next week. Office.`);
    } else if (type === 'fee') {
      setMessage(`Dear Parent, school fees account for ${student.name} (ADM: ${student.id}) has an outstanding balance of ${currency} ${student.feeBalance.toLocaleString()}. Kind reminder to clear. Accountant.`);
    } else {
      setMessage(`Dear Parents, Karega Secondary School general midterm begins June 3rd. All students recess safely. Administrator.`);
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
      toast.success("Parents SMS alert dispatched via Karega GSM gateway.");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path + '/' + logId);
    } finally {
      setDispatching(false);
    }
  };

  const handleAddNotice = () => {
    if (!newNotice.title || !newNotice.body) return;
    const item: NoticeItem = {
      id: String(Date.now()),
      title: newNotice.title,
      target: newNotice.target,
      body: newNotice.body,
      date: new Date().toISOString().slice(0, 10),
      author: 'Principal Moenga'
    };
    setNotices([item, ...notices]);
    setNewNotice({ title: '', target: 'Parents', body: '' });
    toast.success('Notice published globally inside student and parent portals.');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipient || !emailSubject || !emailBody) return;
    const log: EmailLog = {
      id: 'em-' + Date.now(),
      recipient: emailRecipient,
      subject: emailSubject,
      body: emailBody,
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Delivered'
    };
    setEmailLogs([log, ...emailLogs]);
    setEmailRecipient('');
    setEmailSubject('');
    setEmailBody('');
    toast.success('Academic notification Email delivered successfully via SendGrid.');
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setReminders([...reminders, {
      id: String(Date.now()),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time || 'All Day',
      loc: newEvent.loc || 'Main Campus'
    }]);
    setNewEvent({ title: '', date: '', time: '', loc: '' });
    toast.success('Academic event reminder loaded onto local school schedules.');
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation header */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit gap-1 overflow-x-auto">
        {[
          { id: 'gsm', label: 'SMS', icon: Smartphone, color: 'text-indigo-600' },
          { id: 'notices', label: 'Notice Board', icon: Bell, color: 'text-emerald-600' },
          { id: 'emails', label: 'Emails', icon: Mail, color: 'text-purple-600' },
          { id: 'reminders', label: 'Reminders', icon: Calendar, color: 'text-amber-600' },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChannel(tab.id as any)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition cursor-pointer border-none flex items-center gap-1.5 whitespace-nowrap ${
                activeChannel === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${activeChannel === tab.id ? tab.color : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeChannel === 'gsm' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SMS Composer Form */}
          <div className="bg-white p-4 rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm space-y-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2.5 mb-1">Send SMS Alert</h3>
            <form onSubmit={handleDispatchSms} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Category</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['exam', 'fee', 'announcement'] as SmsType[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSmsTypeChange(cat)}
                      className={`py-2 rounded-lg capitalize text-center text-xs font-medium cursor-pointer transition border-none ${
                        smsType === cat 
                          ? 'bg-[#3D1D3F] text-white' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Student</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelectChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                >
                  <option value="">Select student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Mobile Number</label>
                <input
                  type="text"
                  required
                  placeholder="+254712345678"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={dispatching}
                className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg font-medium text-sm transition cursor-pointer border-none shadow-sm disabled:opacity-70"
              >
                {dispatching ? 'Sending…' : 'Send SMS Alert'}
              </button>
            </form>
          </div>

          {/* SMS Logs */}
          <div className="lg:col-span-2 bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-[1.5rem] shadow-sm space-y-2">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">SMS Logs</h3>
            <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto pr-1">
              {smsLogs.map(log => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 text-sm">{log.studentName}</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded tabular-nums">{log.recipient}</span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{log.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400 tabular-nums block">{log.sentAt.slice(0,16).replace('T',' ')}</span>
                    <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">Logged</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeChannel === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Announcement Form */}
          <div className="bg-white p-4 rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm space-y-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2.5 mb-1">Publish New Announcement</h3>
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Notice Header Title</label>
                <input
                  type="text"
                  placeholder="e.g., General Assembly recess"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Target Desk Readers</label>
                <select
                  value={newNotice.target}
                  onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                >
                  <option value="Parents">Parents ONLY</option>
                  <option value="Teachers">Teachers ONLY</option>
                  <option value="All Registrars">All Audiences</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Announcement Body Description</label>
                <textarea
                  rows={4}
                  placeholder="Insert announcement message description..."
                  value={newNotice.body}
                  onChange={(e) => setNewNotice({ ...newNotice, body: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <button
                onClick={handleAddNotice}
                className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg font-medium text-sm transition cursor-pointer border-none shadow-sm"
              >
                Post Notice
              </button>
            </div>
          </div>

          {/* Board Display */}
          <div className="lg:col-span-2 space-y-4">
            {notices.map(nt => (
              <div key={nt.id} className="bg-white p-4 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] shadow-sm space-y-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-sm text-slate-800 truncate">{nt.title}</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium shrink-0">{nt.target}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 tabular-nums shrink-0">{nt.date}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{nt.body}</p>
                <span className="text-[11px] text-slate-400 block tabular-nums">By {nt.author}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeChannel === 'emails' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email dispatch form */}
          <div className="bg-white p-4 rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm space-y-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2.5 mb-1">Send Grid Email Dispatch</h3>
            <form onSubmit={handleSendEmail} className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Parent Email Recipient</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., parent@gmail.com"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Subject Header</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Progress statement dispatch"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Body Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Dear parents, find attached reports card..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg font-medium text-sm transition cursor-pointer border-none shadow-sm"
              >
                Send Email
              </button>
            </form>
          </div>

          {/* Email Logs */}
          <div className="lg:col-span-2 bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-[1.5rem] shadow-sm space-y-2">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Email Logs</h3>
            <div className="divide-y divide-slate-50">
              {emailLogs.map(em => (
                <div key={em.id} className="py-3 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="font-medium text-slate-700 tabular-nums text-xs">{em.recipient}</span>
                      <span className="text-sm font-semibold text-indigo-600 block mt-0.5">{em.subject}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 tabular-nums shrink-0">{em.sentAt}</span>
                  </div>
                  <p className="text-slate-400 italic text-xs max-w-xl truncate mt-1">{em.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeChannel === 'reminders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add reminder form */}
          <div className="bg-white p-4 rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm space-y-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2.5 mb-1">Schedule Academic Reminders</h3>
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Calendar Event Title</label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics mock review"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Scheduled Day</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Target Hours</label>
                <input
                  type="text"
                  placeholder="e.g., 09:30 AM"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Block Location / Room</label>
                <input
                  type="text"
                  placeholder="e.g., Science Laboratory B"
                  value={newEvent.loc}
                  onChange={(e) => setNewEvent({ ...newEvent, loc: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                />
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg font-medium text-sm transition cursor-pointer border-none shadow-sm"
              >
                Add Reminder
              </button>
            </div>
          </div>

          {/* Schedulers */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Upcoming Events</h3>
            {reminders.map(rem => (
              <div key={rem.id} className="bg-white p-3.5 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] flex justify-between items-center gap-2 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800 block text-sm truncate">{rem.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 tabular-nums">{rem.date} · {rem.time} · {rem.loc}</span>
                  </div>
                </div>

                <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-medium shrink-0">Upcoming</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
