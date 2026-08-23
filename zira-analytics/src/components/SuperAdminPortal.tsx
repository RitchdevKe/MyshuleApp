import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Wallet, 
  Send, 
  Activity, 
  Plus, 
  DollarSign, 
  Settings, 
  ShieldAlert, 
  ArrowRightLeft, 
  Search, 
  Coins, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Filter, 
  Bell, 
  FileText,
  Clock,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { 
  TenantSchool, 
  GlobalSmsBroadcast, 
  TenantInvoice 
} from '../types.ts';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie
} from 'recharts';

interface SuperAdminPortalProps {
  schools: TenantSchool[];
  onUpdateSchools: (updated: TenantSchool[]) => void;
  onImpersonateSchool: (schoolId: string) => void;
  broadcasts: GlobalSmsBroadcast[];
  onAddBroadcast: (broadcast: GlobalSmsBroadcast) => void;
  invoices: TenantInvoice[];
  onUpdateInvoices: (updated: TenantInvoice[]) => void;
}

export function SuperAdminPortal({
  schools,
  onUpdateSchools,
  onImpersonateSchool,
  broadcasts,
  onAddBroadcast,
  invoices,
  onUpdateInvoices
}: SuperAdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'sms' | 'finance'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Modal controls
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<TenantSchool | null>(null);

  // Form states for adding school
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolPlan, setNewSchoolPlan] = useState<'Bronze' | 'Silver' | 'Gold' | 'Premium'>('Bronze');
  const [newSchoolStatus, setNewSchoolStatus] = useState<'active' | 'suspended' | 'trial'>('trial');
  const [newSchoolStudents, setNewSchoolStudents] = useState(500);
  const [newSchoolSms, setNewSchoolSms] = useState(2500);
  const [newSchoolPrincipal, setNewSchoolPrincipal] = useState('');
  const [newSchoolEmail, setNewSchoolEmail] = useState('');
  const [newSchoolPhone, setNewSchoolPhone] = useState('');

  // Form state for broadcasting SMS
  const [smsTarget, setSmsTarget] = useState<'all' | 'premium' | 'active' | 'trial'>('all');
  const [smsSubject, setSmsSubject] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Edit school states
  const [editSchoolPlan, setEditSchoolPlan] = useState<'Bronze' | 'Silver' | 'Gold' | 'Premium'>('Bronze');
  const [editSchoolStatus, setEditSchoolStatus] = useState<'active' | 'suspended' | 'trial'>('active');
  const [editSmsAddCredits, setEditSmsAddCredits] = useState<number>(0);
  const [editSchoolName, setEditSchoolName] = useState('');
  const [editSchoolPrincipal, setEditSchoolPrincipal] = useState('');

  // Calculate SaaS level global metrics
  const totalSchools = schools.length;
  const activeSchoolsCount = schools.filter(s => s.status === 'active').length;
  const totalSystemStudents = schools.reduce((acc, s) => acc + s.studentCount, 0);
  const totalSMSAllocated = schools.reduce((acc, s) => acc + s.smsCredits, 0);
  
  // Aggregate licensing MRR (estimate from tier pricing: Gold: 120k Ksh, Premium: 180k Ksh, Silver: 80k Ksh, Bronze: 40k)
  const calculateMRR = () => {
    let monthlyGlobal = 0;
    schools.forEach(s => {
      if (s.status !== 'active' && s.status !== 'trial') return;
      let annual = s.annualFeeKsh;
      monthlyGlobal += Math.round(annual / 12);
    });
    return monthlyGlobal;
  };

  const currentMRR = calculateMRR();

  // Create datasets for visualizer charts
  const planChartData = [
    { name: 'Bronze', count: schools.filter(s => s.subscriptionPlan === 'Bronze').length, color: '#f59e0b' },
    { name: 'Silver', count: schools.filter(s => s.subscriptionPlan === 'Silver').length, color: '#38bdf8' },
    { name: 'Gold', count: schools.filter(s => s.subscriptionPlan === 'Gold').length, color: '#fbbf24' },
    { name: 'Premium', count: schools.filter(s => s.subscriptionPlan === 'Premium').length, color: '#818cf8' },
  ];

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          school.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          school.principalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'All' || school.subscriptionPlan === filterPlan;
    const matchesStatus = filterStatus === 'All' || school.status === filterStatus.toLowerCase();
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleOpenAddSchool = () => {
    setNewSchoolName('');
    setNewSchoolCode('SCH-' + Math.floor(100000 + Math.random() * 900000));
    setNewSchoolPrincipal('');
    setNewSchoolEmail('');
    setNewSchoolPhone('');
    setIsAddSchoolOpen(true);
  };

  const handleAddSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newSchoolPrincipal) return;

    let fee = 40000;
    if (newSchoolPlan === 'Silver') fee = 80000;
    if (newSchoolPlan === 'Gold') fee = 120000;
    if (newSchoolPlan === 'Premium') fee = 180000;

    const newSchool: TenantSchool = {
      id: newSchoolName.toLowerCase().replace(/\s+/g, '-'),
      name: newSchoolName,
      code: newSchoolCode,
      subscriptionPlan: newSchoolPlan,
      status: newSchoolStatus,
      studentCount: Number(newSchoolStudents),
      smsCredits: Number(newSchoolSms),
      contactEmail: newSchoolEmail || `info@${newSchoolName.toLowerCase().replace(/\s+/g, '')}.ac.ke`,
      contactPhone: newSchoolPhone || '+254 ' + Math.floor(700000000 + Math.random() * 99999999),
      annualFeeKsh: fee,
      paymentStatus: newSchoolStatus === 'active' ? 'paid' : 'unpaid',
      registeredDate: new Date().toISOString().substring(0, 10),
      principalName: newSchoolPrincipal,
      meanKCSE: 6.5
    };

    onUpdateSchools([...schools, newSchool]);
    setIsAddSchoolOpen(false);

    // Auto-create invoice for this school
    const newInvoice: TenantInvoice = {
      id: 'INV-' + Math.floor(10000 + Math.random() * 90000),
      schoolId: newSchool.id,
      schoolName: newSchool.name,
      amountKsh: fee,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: newSchoolStatus === 'active' ? 'paid' : 'unpaid',
      description: `Annual Subscription Licensing Fee - ${newSchool.subscriptionPlan} Tier`
    };
    onUpdateInvoices([...invoices, newInvoice]);
  };

  const handleOpenEditSchool = (school: TenantSchool) => {
    setSelectedSchool(school);
    setEditSchoolPlan(school.subscriptionPlan);
    setEditSchoolStatus(school.status);
    setEditSchoolName(school.name);
    setEditSchoolPrincipal(school.principalName);
    setEditSmsAddCredits(0);
    setIsEditSchoolOpen(true);
  };

  const handleEditSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;

    let fee = 40000;
    if (editSchoolPlan === 'Silver') fee = 80000;
    if (editSchoolPlan === 'Gold') fee = 120000;
    if (editSchoolPlan === 'Premium') fee = 180000;

    const updated = schools.map(s => {
      if (s.id === selectedSchool.id) {
        return {
          ...s,
          name: editSchoolName,
          subscriptionPlan: editSchoolPlan,
          status: editSchoolStatus,
          smsCredits: s.smsCredits + Number(editSmsAddCredits),
          annualFeeKsh: fee,
          principalName: editSchoolPrincipal
        };
      }
      return s;
    });

    onUpdateSchools(updated);
    setIsEditSchoolOpen(false);
    setSelectedSchool(null);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsSubject || !smsBody) return;

    // Filter schools to count target audience
    let count = 0;
    if (smsTarget === 'all') count = schools.length;
    else if (smsTarget === 'premium') count = schools.filter(s => s.subscriptionPlan === 'Premium').length;
    else if (smsTarget === 'active') count = schools.filter(s => s.status === 'active').length;
    else if (smsTarget === 'trial') count = schools.filter(s => s.status === 'trial').length;

    const newLog: GlobalSmsBroadcast = {
      id: 'BCAST-' + Math.floor(1000 + Math.random() * 9000),
      subject: smsSubject,
      body: smsBody,
      sentAt: new Date().toISOString(),
      audience: smsTarget.charAt(0).toUpperCase() + smsTarget.slice(1) + ' Tenants',
      sentBy: 'System Super Admin',
      count: count
    };

    onAddBroadcast(newLog);
    setSmsSubject('');
    setSmsBody('');
    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 4000);
  };

  const handleSettleInvoice = (invId: string) => {
    const updatedInvs = invoices.map(inv => {
      if (inv.id === invId) {
        return { ...inv, status: 'paid' as const };
      }
      return inv;
    });
    onUpdateInvoices(updatedInvs);

    // Find invoice's school to update school level paymentStatus
    const targetInv = invoices.find(inv => inv.id === invId);
    if (targetInv) {
      const updatedS = schools.map(s => {
        if (s.id === targetInv.schoolId) {
          return { ...s, paymentStatus: 'paid' as const };
        }
        return s;
      });
      onUpdateSchools(updatedS);
    }
  };

  return (
    <div className="space-y-6">
      {/* SaaS Status Alert Bar */}
      <div className="flex justify-between items-center bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm">
        <div>
          <span className="text-lg text-indigo-600 font-bold uppercase tracking-wider block mb-1">
            System Control Panel
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Zira SaaS Platform Director
          </h2>
          <p className="text-slate-500 text-lg">
            Global monitoring workspace of educational clients, SMS telemetry routers, and aggregate collections.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[16px] font-bold tracking-widest uppercase">
          <span className="w-2h-2 bg-emerald-500 rounded-full animate-pulse" />
          Platform Core: 100% Operational
        </div>
      </div>

      {/* Mini Tabs for Super Admin Sub-views */}
      <div className="flex gap-2.5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-lg font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold'
              : 'bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          SaaS Aggregates
        </button>
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 rounded-xl text-lg font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'tenants'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold'
              : 'bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Tenant School Registry ({totalSchools})
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`px-4 py-2 rounded-xl text-lg font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'sms'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold'
              : 'bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          System Broadcasts ({broadcasts.length})
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-xl text-lg font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'finance'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold'
              : 'bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Licensing billing ({invoices.length})
        </button>
      </div>

      {/* TAB 1: SAAS OVERVIEW AGGREGATES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* SaaS Core KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 p-1.5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-[16px] font-bold uppercase tracking-wider">Onboarded Schools</span>
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{totalSchools}</div>
              <p className="text-[16px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold tabular-nums">
                <span>●</span> {activeSchoolsCount} Active & Paid
              </p>
            </div>

            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 p-1.5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-[16px] font-bold uppercase tracking-wider">Cumulative Pupils</span>
                <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {totalSystemStudents.toLocaleString()}
              </div>
              <p className="text-[16px] text-slate-500 mt-1 tabular-nums">
                Across Forms 1 to 4
              </p>
            </div>

            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 p-1.5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-[16px] font-bold uppercase tracking-wider">Calculated MRR</span>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-700 tabular-nums">
                Ksh {currentMRR.toLocaleString()}
              </div>
              <p className="text-[16px] text-slate-500 mt-1 tabular-nums">
                Estimated Licensing MRR
              </p>
            </div>

            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 p-1.5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-[16px] font-bold uppercase tracking-wider">Global SMS Volume</span>
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-indigo-600 tabular-nums">
                {totalSMSAllocated.toLocaleString()}
              </div>
              <p className="text-[16px] text-indigo-600 mt-1 flex items-center gap-1 font-semibold tabular-nums">
                <span>🔗</span> Gateways active
              </p>
            </div>
          </div>

          {/* SaaS Performance Visualizers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 p-1.5 rounded-3xl flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-xl uppercase tracking-wider">Estimated Revenue Growth</h3>
                  <p className="text-slate-500 text-lg">Simulated platform recurring billing progression over the year</p>
                </div>
                <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[16px] font-bold uppercase tracking-wider rounded-lg">
                  FY 2026/2027
                </div>
              </div>

              <div className="h-64 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: 'Jan', Revenue: 200000 },
                    { month: 'Feb', Revenue: 240000 },
                    { month: 'Mar', Revenue: 310000 },
                    { month: 'Apr', Revenue: 390000 },
                    { month: 'May', Revenue: currentMRR },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `Ksh ${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', color: '#0f172a', fontSize: 11 }}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                    />
                    <Bar dataKey="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 p-1.5 rounded-3xl flex flex-col shadow-sm">
              <h3 className="font-bold text-slate-800 text-xl uppercase tracking-wider mb-2">School Tiers Allocation</h3>
              <p className="text-slate-500 text-lg mb-6">Grouping of clients according to subscription level tiers</p>
              
              <div className="h-44 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planChartData}
                      dataKey="count"
                      nameKey="name"
                      cx="51%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {planChartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Visual count label inside donut */}
                <div className="absolute text-center">
                  <div className="text-3xl font-bold text-slate-800 tabular-nums">{totalSchools}</div>
                  <div className="text-[14px] text-slate-500 uppercase tracking-wide leading-none">schools</div>
                </div>
              </div>

              {/* Legend list */}
              <div className="space-y-2 mt-4">
                {planChartData.map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center text-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-700 font-semibold">{entry.name} Tier</span>
                    </div>
                    <span className="text-slate-500 tabular-nums font-bold text-lg">{entry.count} School(s)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick SaaS News Feed */}
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 p-1.5 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-xl uppercase tracking-wider">Global System Operations Feed</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]/60">
                <div className="text-[16px] text-slate-500 mb-1 flex items-center justify-between tabular-nums">
                  <span>TELEMETRY OUT</span>
                  <span>10:30 AM</span>
                </div>
                <h4 className="text-lg font-bold text-indigo-700">Gateway Settle Alert</h4>
                <p className="text-[17px] text-slate-600 mt-1">
                  12,500 SMS balances queued successfully to cell providers across Central and Rift Valley schools.
                </p>
              </div>

              <div className="bg-slate-50 p-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]/60">
                <div className="text-[16px] text-slate-500 mb-1 flex items-center justify-between tabular-nums">
                  <span>BILLING MONITOR</span>
                  <span>Yesterday</span>
                </div>
                <h4 className="text-lg font-bold text-amber-700">Automatic Invoice Issued</h4>
                <p className="text-[17px] text-slate-600 mt-1">
                  Annual invoice issued to Karega Secondary School for standard Premium support & license. Outstanding: KES 180,000.
                </p>
              </div>

              <div className="bg-slate-50 p-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]/60">
                <div className="text-[16px] text-slate-500 mb-1 flex items-center justify-between tabular-nums">
                  <span>TENANCY CORE</span>
                  <span>2 days ago</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-700">Alliance High Seeding Completed</h4>
                <p className="text-[17px] text-slate-600 mt-1">
                  Database parameters and marks indexes initialized for Form 1 East stream & registration registers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TENANT SCHOOL REGISTRY */}
      {activeTab === 'tenants' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search school name, code or principal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2.5 items-center w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-lg text-slate-600 font-semibold">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Plan:
              </div>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-lg rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All Plans</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Premium">Premium</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-lg rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Suspended">Suspended</option>
              </select>

              <button
                onClick={handleOpenAddSchool}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition-all text-white text-lg font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer ml-auto md:ml-0 border border-indigo-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Add School
              </button>
            </div>
          </div>

          {/* Tenants Grid/Table */}
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[16px] uppercase tracking-wider text-slate-500 tabular-nums">
                    <th className="py-4 px-6 font-bold">School Tenant Details</th>
                    <th className="py-4 px-3 font-bold">School Code</th>
                    <th className="py-4 px-3 font-bold text-center">Plan Tier</th>
                    <th className="py-4 px-3 font-bold text-center">Pupil count</th>
                    <th className="py-4 px-3 font-bold text-center">SMS balance</th>
                    <th className="py-4 px-3 font-bold text-center">SaaS Status</th>
                    <th className="py-4 px-6 font-bold text-right">Integrations / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-lg text-slate-700">
                  {filteredSchools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 text-lg font-semibold">
                        No school tenants match your current filter parameters. Let's create one.
                      </td>
                    </tr>
                  ) : (
                    filteredSchools.map((school) => {
                      const getPlanBadge = (plan: string) => {
                        switch (plan) {
                          case 'Premium': return 'bg-indigo-50 text-indigo-700 border border-indigo-250';
                          case 'Gold': return 'bg-amber-50 text-amber-700 border border-amber-250';
                          case 'Silver': return 'bg-cyan-50 text-cyan-700 border border-cyan-250';
                          default: return 'bg-orange-50 text-orange-700 border border-orange-250';
                        }
                      };

                      const getStatusBadge = (status: string) => {
                        switch (status) {
                          case 'active': return 'bg-emerald-50 text-emerald-700 border border-emerald-250';
                          case 'trial': return 'bg-blue-50 text-blue-700 border border-blue-250';
                          default: return 'bg-rose-50 text-rose-700 border border-rose-250';
                        }
                      };

                      return (
                        <tr key={school.id} className="hover:bg-slate-50/60 transition-all">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold font-sans text-lg tracking-wide border border-indigo-100">
                                {school.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-xl">{school.name}</div>
                                <div className="text-[16px] text-slate-500 flex items-center gap-3 mt-0.5 tabular-nums">
                                  <span>👤 {school.principalName}</span>
                                  <span>📧 {school.contactEmail}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 tabular-nums text-indigo-700 font-bold">{school.code}</td>
                          <td className="py-4 px-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[16px] font-bold uppercase tracking-wider border ${getPlanBadge(school.subscriptionPlan)}`}>
                              {school.subscriptionPlan}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-center tabular-nums font-bold text-slate-800">{school.studentCount}</td>
                          <td className="py-4 px-3 text-center tabular-nums font-bold text-indigo-600">{school.smsCredits.toLocaleString()}</td>
                          <td className="py-4 px-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[16px] font-bold uppercase tracking-wider border ${getStatusBadge(school.status)}`}>
                              {school.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* IMPERSONATION ACTION */}
                              <button
                                onClick={() => onImpersonateSchool(school.id)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-505 text-white rounded-lg text-lg font-bold transition-all flex items-center gap-1 cursor-pointer hover:shadow-lg shadow-indigo-600/30 border border-indigo-500/10"
                                title="Safely sign in to and manage this school's marks sheets"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                Enter School
                              </button>

                              {/* CONFIGURATION/SETTINGS */}
                              <button
                                onClick={() => handleOpenEditSchool(school)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
                                title="Adjust subscription levels and gateway config"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM BROADCASTS */}
      {activeTab === 'sms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Send Broadcast form */}
          <div className="md:col-span-1 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl flex flex-col h-fit shadow-sm">
            <div className="flex items-center gap-2 mb-4 animate-pulse">
              <Send className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 uppercase text-lg tracking-wider">Draft SaaS Global Alert</h3>
            </div>
            <p className="text-[17px] text-slate-500 mb-4 font-medium leading-relaxed font-sans">
              Synthesize and deliver high-priority system notifications, newsletter announcements, or invoice settling briefs directly to the school staff logs dashboards.
            </p>

            {smsSentNotice && (
              <div className="mb-4 bg-emerald-55 text-emerald-700 border border-emerald-200 p-3 rounded-lg text-lg flex items-center gap-2 font-bold select-none">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Message broadcast sent successfully!
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-[16px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Target School Segment
                </label>
                <select
                  value={smsTarget}
                  onChange={(e: any) => setSmsTarget(e.target.value)}
                  className="w-full bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-lg py-2 px-1.5 text-lg text-slate-800"
                >
                  <option value="all">All School Cliencies ({schools.length})</option>
                  <option value="active">Active Tiers Only ({schools.filter(s=>s.status==='active').length})</option>
                  <option value="premium">Premium Tiers Only ({schools.filter(s=>s.subscriptionPlan==='Premium').length})</option>
                  <option value="trial">Trial Tiers Only ({schools.filter(s=>s.status==='trial').length})</option>
                </select>
              </div>

              <div>
                <label className="block text-[16px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Subject Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Service Maintenance Alert"
                  value={smsSubject}
                  onChange={(e) => setSmsSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-lg text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[16px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Notification Statement Body
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type message content here..."
                  value={smsBody}
                  onChange={(e) => setSmsBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-lg text-slate-800 placeholder:text-slate-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-505 text-white text-lg font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer border border-indigo-500/15 font-sans uppercase tracking-wider"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch System Broadcast
              </button>
            </form>
          </div>

          {/* Broadcast logs */}
          <div className="md:col-span-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl flex flex-col shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-indigo-600 font-bold" />
              <h3 className="font-bold text-slate-900 uppercase text-lg tracking-wider">Broadcast Dispatch Logs</h3>
            </div>
            
            <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2">
              {broadcasts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-lg font-bold">No SaaS broad alerts have been dispatched so far.</div>
              ) : (
                broadcasts.map((log) => (
                  <div key={log.id} className="bg-slate-50 p-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-755 tabular-nums text-[15px] uppercase font-bold tracking-wider rounded">
                          {log.id}
                        </span>
                        <h4 className="font-bold text-slate-900 text-lg mt-1.5">{log.subject}</h4>
                      </div>
                      <div className="text-right text-[16px] text-slate-500 tabular-nums font-medium">
                        <div>{new Date(log.sentAt).toLocaleString()}</div>
                        <div className="text-indigo-600 font-bold mt-0.5">{log.audience} ({log.count} Sent)</div>
                      </div>
                    </div>
                    <p className="text-slate-700 text-lg mt-1 bg-white p-3 rounded border border-slate-150 tabular-nums leading-relaxed whitespace-pre-wrap">
                      {log.body}
                    </p>
                    <div className="text-[16px] text-slate-500 mt-1 flex justify-between font-semibold">
                      <span>Sender: {log.sentBy}</span>
                      <span className="text-emerald-700 font-bold">● Broadcast Complete (Gateways Slipped)</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCES AND BILLING INVOICES */}
      {activeTab === 'finance' && (
        <div className="space-y-6 animate-fade-in">
          {/* SaaS metrics warning panel */}
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <h4 className="font-bold text-lg uppercase tracking-wider">Platform Licensing Invoicing Compliance</h4>
              <p className="text-[10.5px] text-amber-800 mt-1 font-semibold leading-relaxed">
                SaaS metrics require outstanding invoices to be completed in due time to maintain gateway connections. Suspended academies will lose class marks upload access after a 7-day grace timeframe.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Invoice Master list (Col span 2) */}
            <div className="md:col-span-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 uppercase text-lg tracking-wider">Licensing Invoicing Ledgars</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[15px] uppercase tracking-wider text-slate-500 tabular-nums">
                      <th className="py-2.5 px-3">Invoice Code</th>
                      <th className="py-2.5 px-3">Client details</th>
                      <th className="py-2.5 px-3">Billed amount</th>
                      <th className="py-2.5 px-3">Due Deadline</th>
                      <th className="py-2.5 px-3 text-center">Invoiced status</th>
                      <th className="py-2.5 px-3 text-right">Accounting</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-lg text-slate-700">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60 transition-all font-semibold">
                        <td className="py-3 px-3 tabular-nums text-indigo-700 font-bold">{inv.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 mb-0.5">{inv.schoolName}</div>
                          <div className="text-[16px] text-slate-500 font-medium truncate max-w-[124px]">{inv.description}</div>
                        </td>
                        <td className="py-3 px-3 tabular-nums font-bold text-slate-800">Ksh {inv.amountKsh.toLocaleString()}</td>
                        <td className="py-3 px-3 tabular-nums font-semibold text-slate-500">{inv.dueDate}</td>
                        <td className="py-3 px-3 text-center">
                          {inv.status === 'paid' ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded text-[15px] font-bold uppercase select-none">
                              Settled / Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-250 text-[15px] font-bold uppercase animate-pulse select-none rounded">
                              Pending Debt
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-medium">
                          {inv.status === 'unpaid' && (
                            <button
                              onClick={() => handleSettleInvoice(inv.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-505 text-white rounded text-[16px] font-bold transition flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-600/10 ml-auto border border-emerald-500/10 font-sans"
                            >
                              Settle Bill
                            </button>
                          )}
                          {inv.status === 'paid' && (
                            <span className="text-[16px] text-slate-400 italic">Confirmed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated general ledger parameters */}
            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl flex flex-col shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-indigo-650 animate-pulse" />
                <h3 className="font-bold text-slate-900 uppercase text-lg tracking-wider">SaaS Billing Telemetry</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl">
                  <div className="text-slate-500 text-[16px] font-bold uppercase tracking-wider mb-1">Combined SaaS Value Outstanding</div>
                  <div className="text-3xl font-bold text-rose-700 tabular-nums">
                    Ksh {invoices.filter(inv => inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amountKsh, 0).toLocaleString()}
                  </div>
                  <div className="text-[16px] text-slate-550 mt-1 font-semibold">Pending payments across active schools</div>
                </div>

                <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl">
                  <div className="text-slate-500 text-[16px] font-bold uppercase tracking-wider mb-1">Core SMS Bulk Gateway cost</div>
                  <div className="text-3xl font-bold text-slate-800 flex items-center gap-1.5 tabular-nums">
                    KES 0.82 <span className="text-lg font-semibold text-slate-500">/ local SMS unit</span>
                  </div>
                  <div className="text-[16px] text-slate-550 mt-1 font-semibold">Provider: Safaricom Bulk SMS Integrations</div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl">
                  <h4 className="text-lg font-bold text-indigo-805">Pricing Models</h4>
                  <ul className="text-[10.5px] text-indigo-950 mt-1 list-disc list-inside space-y-1 font-semibold">
                    <li>Bronze: KES 40,000 / year</li>
                    <li>Silver: KES 80,000 / year</li>
                    <li>Gold: KES 120,000 / year</li>
                    <li>Premium: KES 180,000 / year</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* MODAL 1: ADD NEW SCHOOL */}
      {isAddSchoolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl relative border">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-gray-950 text-2xl">Onboard New Educational Partner</h3>
              </div>
              <button 
                onClick={() => setIsAddSchoolOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSchoolSubmit}>
              <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">School Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alliance High School"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      className="w-full text-lg rounded-xl p-3 border"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">School Code Reference</label>
                    <input
                      type="text"
                      required
                      readOnly
                      value={newSchoolCode}
                      className="w-full text-lg rounded-xl p-3 border bg-gray-50 text-gray-500 tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Principal In Charge</label>
                    <input
                      type="text"
                      required
                      placeholder="Principal name"
                      value={newSchoolPrincipal}
                      onChange={(e) => setNewSchoolPrincipal(e.target.value)}
                      className="w-full text-lg rounded-xl p-3 border"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Plan Pricing Level</label>
                    <select
                      value={newSchoolPlan}
                      onChange={(e: any) => setNewSchoolPlan(e.target.value)}
                      className="w-full text-lg rounded-xl p-3 border"
                    >
                      <option value="Bronze">Bronze Tier (40k/yr)</option>
                      <option value="Silver">Silver Tier (80k/yr)</option>
                      <option value="Gold">Gold Tier (120k/yr)</option>
                      <option value="Premium">Premium Tier (180k/yr)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Total Student Cap</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={5000}
                      value={newSchoolStudents}
                      onChange={(e) => setNewSchoolStudents(Number(e.target.value))}
                      className="w-full text-lg rounded-xl p-3 border"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Initial SMS Credits</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newSchoolSms}
                      onChange={(e) => setNewSchoolSms(Number(e.target.value))}
                      className="w-full text-lg rounded-xl p-3 border tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Licensing Mode</label>
                    <select
                      value={newSchoolStatus}
                      onChange={(e: any) => setNewSchoolStatus(e.target.value)}
                      className="w-full text-lg rounded-xl p-3 border"
                    >
                      <option value="trial">Active Trial (14-Days)</option>
                      <option value="active">Active & Fully Unlocked</option>
                      <option value="suspended">Suspended Mode</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Admin Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. principal@alliance.ac.ke"
                      value={newSchoolEmail}
                      onChange={(e) => setNewSchoolEmail(e.target.value)}
                      className="w-full text-lg rounded-xl p-3 border"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Contact Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +254 722 000000"
                      value={newSchoolPhone}
                      onChange={(e) => setNewSchoolPhone(e.target.value)}
                      className="w-full text-lg rounded-xl p-3 border"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddSchoolOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  Onboard Enterprise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIGURE / EDIT SCHOOL */}
      {isEditSchoolOpen && selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative border">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-gray-950 text-2xl">Configure school Tenant</h3>
              </div>
              <button 
                onClick={() => setIsEditSchoolOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSchoolSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Academic Institution Name</label>
                  <input
                    type="text"
                    required
                    value={editSchoolName}
                    onChange={(e) => setEditSchoolName(e.target.value)}
                    className="w-full text-lg rounded-xl p-3 border"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Principal In Charge</label>
                  <input
                    type="text"
                    required
                    value={editSchoolPrincipal}
                    onChange={(e) => setEditSchoolPrincipal(e.target.value)}
                    className="w-full text-lg rounded-xl p-3 border"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Subscription Tier Plan</label>
                  <select
                    value={editSchoolPlan}
                    onChange={(e: any) => setEditSchoolPlan(e.target.value)}
                    className="w-full text-lg rounded-xl p-3 border"
                  >
                    <option value="Bronze">Bronze Tier (40k/yr)</option>
                    <option value="Silver">Silver Tier (80k/yr)</option>
                    <option value="Gold">Gold Tier (120k/yr)</option>
                    <option value="Premium">Premium Tier (180k/yr)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Licensing Status</label>
                    <select
                      value={editSchoolStatus}
                      onChange={(e: any) => setEditSchoolStatus(e.target.value)}
                      className="w-full text-lg rounded-xl p-3 border"
                    >
                      <option value="active">Active Plan</option>
                      <option value="trial">Active Trial</option>
                      <option value="suspended">Suspended Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 uppercase mb-2">Top-up SMS credits</label>
                    <input
                      type="number"
                      placeholder="Add e.g. 500"
                      value={editSmsAddCredits}
                      onChange={(e) => setEditSmsAddCredits(Number(e.target.value))}
                      className="w-full text-lg rounded-xl p-3 border tabular-nums"
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-2.5">
                  <Coins className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-[16px] text-indigo-950 font-sans">
                    Updating this school tenant's subscription plan tier will automatically update annual recurring billing schedules on the next invoice refresh.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditSchoolOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
