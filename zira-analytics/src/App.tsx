import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  doc,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';
import { isDatabaseEmpty, seedDatabase } from './seeder.ts';
import { 
  Student, 
  Exam, 
  FeeTransaction, 
  SmsLog, 
  TenantSchool, 
  GlobalSmsBroadcast, 
  TenantInvoice,
  SchoolSettings
} from './types.ts';
import { LoginScreen } from './components/LoginScreen.tsx';
import { ArrowLeft, LayoutGrid, BookOpen, Clock, Target, Award, FileText, Plus, Calendar } from 'lucide-react';
import { Sidebar } from './components/Sidebar.tsx';
import { ModuleHeader } from './components/ModuleHeader.tsx';
import { OverviewTab } from './components/OverviewTab.tsx';
import { AcademicTab } from './components/AcademicTab.tsx';
import { TeacherPortal } from './components/TeacherPortal.tsx';
import { StudentsTab } from './components/StudentsTab.tsx';
import { FinanceTab } from './components/FinanceTab.tsx';
import { CommunicationTab } from './components/CommunicationTab.tsx';
import { AttendanceHub } from './components/AttendanceHub.tsx';
import { SettingsTab } from './components/SettingsTab.tsx';
import { StudentPortal } from './components/StudentPortal.tsx';
import { AdminUtilityTab } from './components/AdminUtilityTab.tsx';
import { ReportsTab } from './components/ReportsTab.tsx';
import { TimetableTab } from './components/TimetableTab.tsx';
import { SuperAdminPortal } from './components/SuperAdminPortal.tsx';
import { UsersManagementTab, SchoolUser } from './components/UsersManagementTab.tsx';
import { ParentPortal } from './components/ParentPortal.tsx';
import { RolePermissionsGrid } from './components/RolePermissionsGrid.tsx';
import { AdmissionsTab } from './components/AdmissionsTab.tsx';
import { QuickSearchTab } from './components/QuickSearchTab.tsx';
import { ExtraModules } from './components/ExtraModules.tsx';
import { TransportModule } from './components/TransportModule.tsx';
import { LibraryTab } from './components/LibraryTab.tsx';
import { ReceptionistTab } from './components/ReceptionistTab.tsx';
import { WorkDiariesTab } from './components/WorkDiariesTab.tsx';
import { StudentsDataHub } from './components/StudentsDataHub.tsx';
import { SystemUsersOnboardingTab } from './components/SystemUsersOnboardingTab.tsx';
import { ReportFormsTab } from './components/ReportFormsTab.tsx';
import { AccountingSubsystem } from './components/AccountingSubsystem.tsx';
import { Toaster, toast } from 'react-hot-toast';

export type TabId = 
  | 'overview' 
  | 'quick_search'
  | 'notifications'
  | 'students' 
  | 'admissions' 
  | 'promotions' 
  | 'alumni' 
  | 'classes' 
  | 'subjects' 
  | 'timetable' 
  | 'curriculum' 
  | 'assessments' 
  | 'results' 
  | 'academic' 
  | 'teacher_portal'
  | 'lms' 
  | 'ptc' 
  | 'finance_dash' 
  | 'finance' 
  | 'invoices' 
  | 'fee_structure' 
  | 'users' 
  | 'attendance'
  | 'leave_management' 
  | 'payroll' 
  | 'transport_routes' 
  | 'hostel' 
  | 'library' 
  | 'inventory' 
  | 'procurement' 
  | 'supplier_management'
  | 'vendor_management'
  | 'canteen' 
  | 'health' 
  | 'super_admin' 
  | 'sms'
  | 'attendance'
  | 'reports'
  | 'settings'
  | 'permissions_roles'
  | 'admin_utilities'
  | 'accounting_dash'
  | 'general_ledger'
  | 'accounts_payable'
  | 'accounts_receivable'
  | 'receptionist'
  | 'work_diaries'
  | 'student_portal'
  | 'students_data_hub'
  | 'user_management_module'
  | 'report_forms'
  | 'system_users_onboarding';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zira_session_active') === 'true';
    } catch (_) {
      return false;
    }
  });
  const [teacherInfo, setTeacherInfo] = useState<{ name: string; email: string; role: string } | null>(() => {
    try {
      const cached = localStorage.getItem('zira_session_info');
      return cached ? JSON.parse(cached) : null;
    } catch (_) {
      return null;
    }
  });
  
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    try {
      const cached = localStorage.getItem('zira_active_tab');
      return (cached as TabId) || 'overview';
    } catch (_) {
      return 'overview';
    }
  });
  const [tabHistory, setTabHistory] = useState<TabId[]>([]);
  const [activeSchoolId, setActiveSchoolId] = useState<string>('karega'); // 'karega' or other school id, or 'super'
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>({
    schoolName: 'ZIRA ACADEMY',
    logo: ''
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    setIsSidebarOpen(isDesktop);
  }, []);

  // Core databases states for primary client (Karega Sec)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const cached = localStorage.getItem('zira_cache_students');
      return cached ? JSON.parse(cached) : [];
    } catch (_) {
      return [];
    }
  });
  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const cached = localStorage.getItem('zira_cache_exams');
      return cached ? JSON.parse(cached) : [];
    } catch (_) {
      return [];
    }
  });
  const [transactions, setTransactions] = useState<FeeTransaction[]>(() => {
    try {
      const cached = localStorage.getItem('zira_cache_transactions');
      return cached ? JSON.parse(cached) : [];
    } catch (_) {
      return [];
    }
  });
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(() => {
    try {
      const cached = localStorage.getItem('zira_cache_sms_logs');
      return cached ? JSON.parse(cached) : [];
    } catch (_) {
      return [];
    }
  });
  
  const [schoolUsers, setSchoolUsers] = useState<SchoolUser[]>(() => {
    try {
      const cached = localStorage.getItem('zira_cache_school_users');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [
      {
        id: 'USR-1001',
        name: 'Mr. Julius Karega',
        email: 'principal@karegasec.co.ke',
        phone: '+254 711 843820',
        role: 'School Admin',
        joinedDate: '2023-01-15',
        assignedDetail: 'Principal',
        status: 'active'
      },
      {
        id: 'USR-1002',
        name: 'Mrs. Mercy Chepkoech',
        email: 'headteacher@karegasec.co.ke',
        phone: '+254 722 419202',
        role: 'Head Teacher',
        joinedDate: '2023-05-10',
        assignedDetail: 'Senior Management Desk Office',
        status: 'active'
      },
      {
        id: 'USR-1003',
        name: 'Mr. Shadrack Kiprop',
        email: 'accountant@karegasec.co.ke',
        phone: '+254 733 920192',
        role: 'Accountant',
        joinedDate: '2024-02-01',
        assignedDetail: 'Bursary & Audit Lead Office',
        status: 'active'
      },
      {
        id: 'USR-1004',
        name: 'Mr. Daniel Gitumu Hia',
        email: 'danielgitumuhia@karegasec.co.ke',
        phone: '+254 711 306050',
        role: 'Teacher',
        joinedDate: '2023-11-20',
        assignedDetail: 'Mathematics / Chemistry Expert',
        status: 'active'
      },
      {
        id: 'USR-1005',
        name: 'Mr. Bernard Kiprop',
        email: 'parent@karegasec.co.ke',
        phone: '+254 720 192837',
        role: 'Parent',
        joinedDate: '2024-01-18',
        assignedDetail: 'Parent of Kevin Kiprop (ADM-2041)',
        status: 'active'
      }
    ];
  });

  // Save schoolUsers edits automatically
  useEffect(() => {
    try {
      localStorage.setItem('zira_cache_school_users', JSON.stringify(schoolUsers));
    } catch (_) {}
  }, [schoolUsers]);

  // Keep track of activeTab in cache
  useEffect(() => {
    try {
      localStorage.setItem('zira_active_tab', activeTab);
    } catch (_) {}
  }, [activeTab]);

  useEffect(() => {
    const handleNavTo = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('navTo', handleNavTo);
    return () => window.removeEventListener('navTo', handleNavTo);
  }, []);
  
  const [seedingInProgress, setSeedingInProgress] = useState(false);

  // SaaS Tenant registries and administrative telemetry states
  const [schools, setSchools] = useState<TenantSchool[]>([
    {
      id: 'karega',
      name: 'Karega Secondary School',
      code: 'KSS-843820',
      subscriptionPlan: 'Premium',
      status: 'active',
      studentCount: 22,
      smsCredits: 12450,
      contactEmail: 'principal@karegasec.co.ke',
      contactPhone: '+254 711 843820',
      annualFeeKsh: 180000,
      paymentStatus: 'paid',
      registeredDate: '2023-01-14',
      principalName: 'Mr. Julius Karega',
      meanKCSE: 7.2
    },
    {
      id: 'alliance',
      name: 'Alliance High School',
      code: 'AHS-938201',
      subscriptionPlan: 'Premium',
      status: 'active',
      studentCount: 1850,
      smsCredits: 45000,
      contactEmail: 'info@alliancehigh.sc.ke',
      contactPhone: '+254 722 938201',
      annualFeeKsh: 180000,
      paymentStatus: 'paid',
      registeredDate: '2020-04-12',
      principalName: 'Dr. William Mwangi',
      meanKCSE: 10.4
    },
    {
      id: 'mangu',
      name: 'Mang\'u High School',
      code: 'MHS-730192',
      subscriptionPlan: 'Gold',
      status: 'active',
      studentCount: 1620,
      smsCredits: 38200,
      contactEmail: 'principal@manguhigh.ac.ke',
      contactPhone: '+254 733 730192',
      annualFeeKsh: 120000,
      paymentStatus: 'paid',
      registeredDate: '2021-08-05',
      principalName: 'John Baptist-M',
      meanKCSE: 9.8
    },
    {
      id: 'kenyahigh',
      name: 'Kenya High School',
      code: 'KHS-492019',
      subscriptionPlan: 'Premium',
      status: 'trial',
      studentCount: 1480,
      smsCredits: 2500,
      contactEmail: 'info@kenyahigh.org',
      contactPhone: '+254 722 492019',
      annualFeeKsh: 180000,
      paymentStatus: 'unpaid',
      registeredDate: '2026-05-10',
      principalName: 'Mrs. Grace Kimani',
      meanKCSE: 10.1
    },
    {
      id: 'lenana',
      name: 'Lenana School',
      code: 'LNS-221039',
      subscriptionPlan: 'Silver',
      status: 'suspended',
      studentCount: 1120,
      smsCredits: 420,
      contactEmail: 'admin@lenanaschool.sc.ke',
      contactPhone: '+254 711 221039',
      annualFeeKsh: 80000,
      paymentStatus: 'unpaid',
      registeredDate: '2022-02-28',
      principalName: 'William Lengui',
      meanKCSE: 8.5
    }
  ]);

  const [broadcasts, setBroadcasts] = useState<GlobalSmsBroadcast[]>([
    {
      id: 'BCAST-9011',
      subject: 'Scheduled Server Maintenance Over Weekend',
      body: 'Dear School Principals & ICT Leads, Zira will undergo routine maintenance from Saturday 10 PM to Sunday 3 AM. Academic Sheets exports will be briefly unavailable. Clean systems alert.',
      sentAt: '2026-05-20T10:00:00Z',
      audience: 'All Tenants',
      sentBy: 'System Operations Lead',
      count: 5
    },
    {
      id: 'BCAST-9012',
      subject: 'SMS Gateway Low Balances Warning Email',
      body: 'Alert: Several schools are running below 1,000 active bulk sms points. Top-up invoices are available in your accounting ledger module. Settle to avoid outage.',
      sentAt: '2026-05-24T14:15:00Z',
      audience: 'Active Tiers Only',
      sentBy: 'Accounting Desk',
      count: 3
    }
  ]);

  const [invoices, setInvoices] = useState<TenantInvoice[]>([
    {
      id: 'INV-80392',
      schoolId: 'karega',
      schoolName: 'Karega Secondary School',
      amountKsh: 180000,
      dueDate: '2026-06-15',
      status: 'unpaid',
      description: 'Annual Zira Analytics Platform Subscription - Premium Level Support'
    },
    {
      id: 'INV-80393',
      schoolId: 'alliance',
      schoolName: 'Alliance High School',
      amountKsh: 180000,
      dueDate: '2026-04-01',
      status: 'paid',
      description: 'Annual Zira Analytics Platform Subscription - Premium Level Support'
    },
    {
      id: 'INV-80394',
      schoolId: 'mangu',
      schoolName: 'Mang\'u High School',
      amountKsh: 120000,
      dueDate: '2026-05-10',
      status: 'paid',
      description: 'Annual Zira Analytics Platform Subscription - Gold Level Support'
    },
    {
      id: 'INV-80395',
      schoolId: 'kenyahigh',
      schoolName: 'Kenya High School',
      amountKsh: 180000,
      dueDate: '2026-06-10',
      status: 'unpaid',
      description: 'Annual Zira Analytics Platform Subscription - Premium Level Support'
    },
    {
      id: 'INV-80396',
      schoolId: 'lenana',
      schoolName: 'Lenana School',
      amountKsh: 80000,
      dueDate: '2026-02-15',
      status: 'unpaid',
      description: 'Annual Zira Analytics Platform Subscription - Silver Level Support'
    }
  ]);

  // Adjust Student Metric Caps on Schools to match registers in real-time
  useEffect(() => {
    if (students.length > 0 && schools[0].studentCount !== students.length) {
      setSchools(prev => prev.map(s => s.id === 'karega' ? { ...s, studentCount: students.length } : s));
    }
  }, [students]);

  // 1. Seed Databases on startup if empty
  useEffect(() => {
    const handleSeeding = async () => {
      setSeedingInProgress(true);
      try {
        const flag = await isDatabaseEmpty();
        if (flag) {
          await seedDatabase();
        }
      } catch (err) {
        console.error("Critical seeding failure:", err);
      } finally {
        setSeedingInProgress(false);
      }
    };
    handleSeeding();
  }, []);

  // Fetch School Settings
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', activeSchoolId), (snap) => {
      if (snap.exists()) {
        setSchoolSettings(snap.data() as SchoolSettings);
      } else {
        setSchoolSettings({
          schoolName: 'ZIRA ACADEMY',
          logo: ''
        });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `settings/${activeSchoolId}`);
    });

    return () => unsubSettings();
  }, [activeSchoolId]);

  // 2. Real-time background lists subscriptions with robust Local/Quota Cache Fallbacks
  useEffect(() => {
    const triggerCacheModeToast = () => {
      if (!window.sessionStorage.getItem('zira_quota_alert_shown')) {
        window.sessionStorage.setItem('zira_quota_alert_shown', 'true');
        toast('Running in Quota-Resilient Offline Cache Mode. All systems remain fully accessible.', {
          icon: '💾',
          duration: 5000,
        });
      }
    };

    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      const list: Student[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as Student);
      });
      setStudents(list);
      try {
        localStorage.setItem('zira_cache_students', JSON.stringify(list));
      } catch (_) {}
    }, (err) => {
      try {
        const cached = localStorage.getItem('zira_cache_students');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed);
            triggerCacheModeToast();
            console.warn('Students loaded from local cache:', err);
            return;
          }
        }
      } catch (_) {}
      handleFirestoreError(err, OperationType.GET, 'students');
    });

    const unsubExams = onSnapshot(collection(db, 'exams'), (snap) => {
      const list: Exam[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as Exam);
      });
      setExams(list);
      try {
        localStorage.setItem('zira_cache_exams', JSON.stringify(list));
      } catch (_) {}
    }, (err) => {
      try {
        const cached = localStorage.getItem('zira_cache_exams');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setExams(parsed);
            triggerCacheModeToast();
            console.warn('Exams loaded from local cache:', err);
            return;
          }
        }
      } catch (_) {}
      handleFirestoreError(err, OperationType.GET, 'exams');
    });

    const txQuery = query(collection(db, 'fee_transactions'));
    const unsubTx = onSnapshot(txQuery, (snap) => {
      const list: FeeTransaction[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as FeeTransaction);
      });
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(list);
      try {
        localStorage.setItem('zira_cache_transactions', JSON.stringify(list));
      } catch (_) {}
    }, (err) => {
      try {
        const cached = localStorage.getItem('zira_cache_transactions');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTransactions(parsed);
            triggerCacheModeToast();
            console.warn('Fee transactions loaded from local cache:', err);
            return;
          }
        }
      } catch (_) {}
      handleFirestoreError(err, OperationType.GET, 'fee_transactions');
    });

    const smsQuery = query(collection(db, 'sms_logs'));
    const unsubSms = onSnapshot(smsQuery, (snap) => {
      const list: SmsLog[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as SmsLog);
      });
      list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      setSmsLogs(list);
      try {
        localStorage.setItem('zira_cache_sms_logs', JSON.stringify(list));
      } catch (_) {}
    }, (err) => {
      try {
        const cached = localStorage.getItem('zira_cache_sms_logs');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSmsLogs(parsed);
            triggerCacheModeToast();
            console.warn('SMS logs loaded from local cache:', err);
            return;
          }
        }
      } catch (_) {}
      handleFirestoreError(err, OperationType.GET, 'sms_logs');
    });

    return () => {
      unsubStudents();
      unsubExams();
      unsubTx();
      unsubSms();
    };
  }, []);

  const handleLoginSuccess = (info: { name: string; email: string; role: string }) => {
    setTeacherInfo(info);
    setIsLoggedIn(true);

    if (info.role === 'Super Admin') {
      setActiveSchoolId('super');
      setActiveTab('super_admin');
    } else if (info.role === 'Teacher') {
      setActiveSchoolId('karega');
      setActiveTab('teacher_portal');
    } else {
      setActiveSchoolId('karega');
      setActiveTab('overview');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTeacherInfo(null);
    setActiveSchoolId('karega');
    setActiveTab('overview');
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(prevTab => {
      if (prevTab !== tab) {
        setTabHistory(prevHistory => {
          if (prevHistory[prevHistory.length - 1] === prevTab) return prevHistory;
          return [...prevHistory, prevTab];
        });
      }
      return tab;
    });
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length === 0) {
      setActiveTab('overview');
    } else {
      const prev = tabHistory[tabHistory.length - 1];
      setTabHistory(prevHistory => prevHistory.slice(0, -1));
      setActiveTab(prev);
    }
  };

  // Helper selectors to dynamically serve active context (multi-tenant impersonation adapter)
  const getActiveSchoolName = () => {
    const s = schools.find(item => item.id === activeSchoolId);
    return s ? s.name : 'Karega Secondary School';
  };

  const currentSchoolName = getActiveSchoolName();

  const getActiveData = () => {
    if (activeSchoolId === 'karega' || activeSchoolId === 'super') {
      return {
        activeStudents: students,
        activeExams: exams,
        activeTransactions: transactions,
        activeSmsLogs: smsLogs
      };
    }

    // Generate dynamic records for other schools to make impersonation fully interactive and comprehensive
    const baseCode = activeSchoolId.toUpperCase().substring(0, 3);
    const mockStuds: Student[] = [
      { id: `${baseCode}-401`, admissionNo: `${baseCode}-401`, name: 'Adrian Kipirono', gender: 'M', form: 4, stream: 'North', feeBalance: 5000, totalFees: 50000, attendancePercentage: 97 },
      { id: `${baseCode}-402`, admissionNo: `${baseCode}-402`, name: 'Douglas Omari', gender: 'M', form: 4, stream: 'North', feeBalance: 0, totalFees: 50000, attendancePercentage: 94 },
      { id: `${baseCode}-403`, admissionNo: `${baseCode}-403`, name: 'Emily Wanjala', gender: 'F', form: 4, stream: 'South', feeBalance: 12500, totalFees: 50000, attendancePercentage: 92 },
      { id: `${baseCode}-404`, admissionNo: `${baseCode}-404`, name: 'Lilian Chepotip', gender: 'F', form: 4, stream: 'South', feeBalance: 0, totalFees: 50000, attendancePercentage: 99 },
      { id: `${baseCode}-301`, admissionNo: `${baseCode}-301`, name: 'Pius Mwambia', gender: 'M', form: 3, stream: 'North', feeBalance: 15000, totalFees: 48000, attendancePercentage: 86 },
      { id: `${baseCode}-302`, admissionNo: `${baseCode}-302`, name: 'Sharon Nduta', gender: 'F', form: 3, stream: 'South', feeBalance: 0, totalFees: 48000, attendancePercentage: 98 },
      { id: `${baseCode}-201`, admissionNo: `${baseCode}-201`, name: 'Godwin Sifuna', gender: 'M', form: 2, stream: 'North', feeBalance: 4000, totalFees: 44000, attendancePercentage: 91 },
      { id: `${baseCode}-101`, admissionNo: `${baseCode}-101`, name: 'Winnie Tabitha', gender: 'F', form: 1, stream: 'North', feeBalance: 0, totalFees: 40000, attendancePercentage: 100 }
    ];

    const mockExs: Exam[] = [
      { id: `term1_midterm_${activeSchoolId}`, name: '2026 Term 1 Mid-Term', year: 2026, term: 1, status: 'active' },
      { id: `term3_end_${activeSchoolId}`, name: '2025 Term 3 End-Term', year: 2025, term: 3, status: 'completed' }
    ];

    const mockTx: FeeTransaction[] = [
      {
        id: `m-tx-1`,
        studentId: `${baseCode}-402`,
        studentName: 'Douglas Omari',
        amount: 25000,
        date: '2026-05-18T10:00:00Z',
        type: 'M-Pesa',
        reference: 'QRE8ZX190N',
        receivedBy: 'Business Manager'
      },
      {
        id: `m-tx-2`,
        studentId: `${baseCode}-404`,
        studentName: 'Lilian Chepotip',
        amount: 50000,
        date: '2026-05-22T14:30:00Z',
        type: 'Bank Deposit',
        reference: 'BBK-0029302',
        receivedBy: 'Business Manager'
      }
    ];

    const mockSms: SmsLog[] = [
      {
        id: `m-sms-1`,
        studentId: `${baseCode}-402`,
        studentName: 'Douglas Omari',
        recipient: '+254700112233',
        message: `Dear Parent, Douglas Omari's Term 1 fee installment receipt has been cleared. Balance: 0 KES. Thank you.`,
        sentAt: '2026-05-18T10:05:00Z',
        status: 'sent',
        type: 'fee'
      }
    ];

    return {
      activeStudents: mockStuds,
      activeExams: mockExs,
      activeTransactions: mockTx,
      activeSmsLogs: mockSms
    };
  };

  const { activeStudents, activeExams, activeTransactions, activeSmsLogs } = getActiveData();

  const renderActiveTab = () => {
    if (!teacherInfo) return null;
    
    // Redirect parent user level and show custom Parent Dashboard
    if (teacherInfo.role === 'Parent') {
      return (
        <ParentPortal 
          students={activeStudents}
          exams={activeExams}
          transactions={activeTransactions}
          smsLogs={activeSmsLogs}
          parentName={teacherInfo.name}
        />
      );
    }

    // Redirect student user level and show custom Student Dashboard
    if (teacherInfo.role === 'Student') {
      return (
        <StudentPortal 
          students={activeStudents}
          exams={activeExams}
        />
      );
    }

    // Role permissions block check (enforced custom dashboard accessibility locks)
    const permsStr = localStorage.getItem('school_role_permissions');
    const rolePermissions = permsStr ? JSON.parse(permsStr) : null;
    const activeRolePerms = (rolePermissions && rolePermissions[teacherInfo.role]) || null;

    let isAllowed = true;
    let requiredModule = '';
    let requiredPage = '';

    if (activeRolePerms) {
      if (activeTab === 'finance') {
        isAllowed = activeRolePerms['FINANCE']?.['Payments'] ?? true;
        requiredModule = 'FINANCE';
        requiredPage = 'Fee Accounts';
      } else if (activeTab === 'admissions') {
        isAllowed = activeRolePerms['STUDENT INFORMATION']?.['Admissions'] ?? true;
        requiredModule = 'STUDENT INFORMATION';
        requiredPage = 'Admissions Pipeline';
      } else if (activeTab === 'students') {
        isAllowed = activeRolePerms['STUDENT INFORMATION']?.['Student Profiles'] ?? true;
        requiredModule = 'STUDENT INFORMATION';
        requiredPage = 'Student Directory';
      } else if (activeTab === 'academic') {
        isAllowed = activeRolePerms['ACADEMICS']?.['Classes'] ?? true;
        requiredModule = 'ACADEMICS';
        requiredPage = 'Academic Sheets';
      } else if (activeTab === 'sms') {
        isAllowed = activeRolePerms['GENERAL & SYSTEM']?.['Communication'] ?? true;
        requiredModule = 'GENERAL & SYSTEM';
        requiredPage = 'Communications hub';
      } else if (activeTab === 'timetable') {
        isAllowed = activeRolePerms['ACADEMICS']?.['Timetable'] ?? true;
        requiredModule = 'ACADEMICS';
        requiredPage = 'Timetables schedules';
      } else if (activeTab === 'users') {
        isAllowed = activeRolePerms['GENERAL & SYSTEM']?.['User Management'] ?? true;
        requiredModule = 'GENERAL & SYSTEM';
        requiredPage = 'User management registry';
      }
    }

    if (!isAllowed) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center font-sans h-full bg-slate-50">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-8 rounded-3xl max-w-sm w-full shadow-2xl space-y-5 text-slate-800">
            <div className="mx-auto w-12 h-12 bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center text-3xl font-bold">
              🔒
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 uppercase">You Don't Have Access</h2>
              <p className="text-[17px] text-slate-500 mt-1 leading-normal">
                You don't have authorization permissions to view this dashboard section. Contact your school principal for support.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-left space-y-1 text-[16px] tabular-nums">
              <div><span className="text-slate-400 font-bold uppercase tracking-wider">Your Role:</span> <span className="text-slate-800 font-bold">{teacherInfo.role}</span></div>
              <div><span className="text-slate-400 font-bold uppercase tracking-wider">Module:</span> <span className="text-slate-800 font-bold">{requiredModule}</span></div>
              <div><span className="text-slate-400 font-bold uppercase tracking-wider">Page:</span> <span className="text-[var(--color-secondary)] font-bold">{requiredPage}</span></div>
            </div>

            <div className="flex gap-2.5 pt-1.5 text-[17px] font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => alert(`Upgrading credential request for '${requiredPage}' successfully filed with Principal Julius Karega.`)}
                className="flex-1 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] text-white rounded-xl shadow-md shadow-[var(--color-secondary)]/15 transition cursor-pointer"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'students_data_hub':
        return (
          <StudentsDataHub 
            onNavigate={(id) => setActiveTab(id)}
            students={activeStudents}
          />
        );
      case 'system_users_onboarding':
        return (
          <SystemUsersOnboardingTab 
            users={schoolUsers}
            onUpdateUsers={setSchoolUsers}
            students={activeStudents}
          />
        );
      case 'report_forms':
        return (
          <ReportFormsTab students={activeStudents} />
        );
      case 'users':
      case 'user_management_module':
        return (
          <UsersManagementTab 
            users={schoolUsers}
            onAddUser={(newUser) => setSchoolUsers([newUser, ...schoolUsers])}
            students={activeStudents}
          />
        );
      case 'super_admin':
        return (
          <SuperAdminPortal 
            schools={schools}
            onUpdateSchools={setSchools}
            onImpersonateSchool={(schoolId) => {
              setActiveSchoolId(schoolId);
              setActiveTab('overview');
            }}
            broadcasts={broadcasts}
            onAddBroadcast={(bcast) => setBroadcasts([bcast, ...broadcasts])}
            invoices={invoices}
            onUpdateInvoices={setInvoices}
          />
        );
      case 'teacher_portal':
        return (
          <TeacherPortal 
            students={activeStudents}
            exams={activeExams}
            transactions={activeTransactions}
            smsLogs={activeSmsLogs}
            teacherName={teacherInfo.name}
          />
        );
      case 'overview':
        return (
          <OverviewTab 
            students={activeStudents} 
            exams={activeExams} 
            transactions={activeTransactions} 
            smsLogs={activeSmsLogs} 
            teacherName={teacherInfo.name}
            teacherRole={teacherInfo.role}
            onNavigateTab={handleTabChange}
          />
        );
      case 'quick_search':
        return (
          <QuickSearchTab 
            students={activeStudents} 
          />
        );
      case 'academic':
        return (
          <AcademicTab 
            students={activeStudents} 
            exams={activeExams} 
            onNavigateTab={handleTabChange}
          />
        );
      case 'admissions':
        return (
          <AdmissionsTab 
            students={activeStudents}
            onAddStudent={(newS) => setStudents([newS, ...students])}
            onRefreshData={() => {}}
          />
        );
      case 'students':
        return (
          <StudentsTab 
            students={activeStudents} 
          />
        );
      case 'finance':
        return (
          <FinanceTab 
            students={activeStudents} 
            transactions={activeTransactions} 
          />
        );
      case 'sms':
        return (
          <CommunicationTab 
            students={activeStudents} 
            smsLogs={activeSmsLogs} 
          />
        );
      case 'attendance':
        return (
          <AttendanceHub 
            students={activeStudents} 
          />
        );
      case 'reports':
        return (
          <ReportsTab 
            students={activeStudents} 
            transactions={activeTransactions} 
          />
        );
      case 'settings':
        return (
          <SettingsTab activeSchoolId={activeSchoolId} />
        );
      case 'permissions_roles':
        return (
          <RolePermissionsGrid />
        );
      case 'admin_utilities':
        return (
          <AdminUtilityTab />
        );
      case 'library':
        return (
          <LibraryTab />
        );
      case 'receptionist':
        return (
          <ReceptionistTab />
        );
      case 'work_diaries':
        return (
          <WorkDiariesTab />
        );
      case 'student_portal':
        return (
          <StudentPortal 
            students={activeStudents} 
            exams={activeExams} 
          />
        );
      case 'timetable':
        return (
          <TimetableTab 
            teacherInfo={{ name: teacherInfo.name, role: teacherInfo.role }} 
          />
        );
      case 'accounting_dash':
      case 'general_ledger':
      case 'accounts_payable':
      case 'accounts_receivable':
        return (
          <AccountingSubsystem 
            tab={activeTab} 
            students={activeStudents} 
            transactions={activeTransactions} 
            onTabChange={handleTabChange}
          />
        );
      case 'transport_routes':
        return (
          <TransportModule 
            students={activeStudents}
          />
        );
      default:
        return (
          <ExtraModules 
            tab={activeTab} 
            students={activeStudents} 
            exams={activeExams} 
            transactions={activeTransactions} 
          />
        );
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} schoolSettings={schoolSettings} />;
  }

  const getTabTitles = (tab: TabId) => {
    switch (tab) {
      case 'students_data_hub':
        return { title: 'Students Data Hub', subtitle: 'Unified launching console for student onboarding tracks and clinical registry logs' };
      case 'system_users_onboarding':
        return { title: 'System Users Registry', subtitle: 'Onboard and manage platform system admins, teachers, and parent sync accounts' };
      case 'report_forms':
        return { title: 'E-Report Forms', subtitle: 'Detailed academic reports and previous performance records' };
      case 'overview':
        return { title: 'Overview', subtitle: 'Global school analytics dashboard and intelligence platform' };
      case 'quick_search':
        return { title: 'Spotlight Quick Search', subtitle: 'Instant lookup of student rosters, registration, and status flags' };
      case 'receptionist':
        return { title: 'Reception Console', subtitle: 'Manage active visitors, schedule meetings, and field enquiries centrally' };
      case 'work_diaries':
        return { title: 'Staff Work Diaries', subtitle: 'Manage comprehensive teacher schedules, lesson duties, and special responsibilities' };
      case 'notifications':
        return { title: 'Notifications Center', subtitle: 'Real-time school announcements, alerts, and priority briefs' };
      case 'admissions':
        return { title: 'Admissions Pipeline', subtitle: 'Onboard and progressive candidate admission stages' };
      case 'academic':
        return { title: 'Academic Hub', subtitle: 'Comprehensive student classes, timetables, subjects and continuous assessments console' };
      case 'students':
        return { title: 'Student Directory', subtitle: 'Complete ledger of active pupils and profile files' };
      case 'promotions':
        return { title: 'Form Class Promotions', subtitle: 'Transition students from one academic level to another' };
      case 'alumni':
        return { title: 'Alumni Registry', subtitle: 'Historical database of graduated class cohorts and university roles' };
      case 'classes':
        return { title: 'Classes & Streams Allocation', subtitle: 'Configure course classes and track class teacher rosters' };
      case 'subjects':
        return { title: 'Subjects Directory', subtitle: 'Manage academic subject departments, coefficients, and lead staff' };
      case 'timetable':
        return { title: 'Time Tables & Classes', subtitle: 'Classroom allocations and instructor rotation schedules' };
      case 'curriculum':
        return { title: 'Syllabus & Curriculum', subtitle: 'Real-time topic coverage trackers and schemes of work' };
      case 'assessments':
        return { title: 'Continuous Assessment', subtitle: 'Pupil CAT scoreboards, grades trackers, and criteria audits' };
      case 'results':
        return { title: 'Final Term Exams Sheets', subtitle: 'Consolidated end-of-term results and automated position lists' };
      case 'lms':
        return { title: 'e-Learning Portal (LMS)', subtitle: 'Study resource directories, assignments bank, and downloadable content' };
      case 'ptc':
        return { title: 'Parent-Teacher Consultations (PTC)', subtitle: 'Schedules and bookable appointment blocks directory' };
      case 'finance_dash':
        return { title: 'Payments Dashboard', subtitle: 'Comprehensive fee collections trackers, goals, and revenue bars' };
      case 'finance':
        return { title: 'Transactions Ledger', subtitle: 'Fee payments, mpsea/bank deposits, and audit logs' };
      case 'invoices':
        return { title: 'Invoices & Billing', subtitle: 'Generate, filter, and review class and pupil invoices' };
      case 'fee_structure':
        return { title: 'Tuition Fee Structure', subtitle: 'Configure termly fees, boarding levies, and annual books charges' };
      case 'users':
        return { title: 'Staff Directory', subtitle: 'Register active instructors, support staff, and administrative accounts' };
      case 'leave_management':
        return { title: 'Leave Approvals Queue', subtitle: 'Review personal, maternity, and sick leave requests dynamically' };
      case 'payroll':
        return { title: 'Payroll Processing Desk', subtitle: 'Salary structures, allowances, NHIF/PAYE deductions, and payslips' };
      case 'transport_routes':
        return { title: 'Transport Logistics Routes', subtitle: 'Map road routes, manage school buses, drivers, and seat assignments' };
      case 'hostel':
        return { title: 'Boarding Dormitories', subtitle: 'Manage student boarding house allocations and dorm captains' };
      case 'library':
        return { title: 'Library Dashboard', subtitle: 'Manage school\'s complete library catalog and lent books' };
      case 'inventory':
        return { title: 'Assets & Equipment Inventory', subtitle: 'School servers, chemicals, lab equipment, and furniture ledger' };
      case 'procurement':
        return { title: 'Purchase Orders', subtitle: 'Pending supply acquisitions, PO generation, and dispatch tracking' };
      case 'supplier_management':
        return { title: 'Supplier Management', subtitle: 'Manage school suppliers, contracts, and supplier catalogs' };
      case 'vendor_management':
        return { title: 'Vendor Management', subtitle: 'Vendor compliance, payment terms, and vendor SLA tracking' };
      case 'canteen':
        return { title: 'Canteen POS smart check-out', subtitle: 'Deduct student canteen orders directly via electronic cards' };
      case 'health':
        return { title: 'School Medical Clinic', subtitle: 'Patient logs, diagnosed symptoms, administered medicine, and clearances' };
      case 'sms':
        return { title: 'Communication Hub', subtitle: 'Notice boards, SendGrid email broadcasts, event schedulers, and parental SMS warning logs' };
      case 'attendance':
        return { title: 'Attendance Hub', subtitle: 'Manage active candidate rolls, staff biometric clocks, and broadcast absentee alerts' };
      case 'reports':
        return { title: 'Reports & Analytics Center', subtitle: 'Downloadable performance ledgers, fees sheets, and compliant rosters' };
      case 'user_management_module':
        return { title: 'User Management', subtitle: 'Manage school administrators and staff accounts.' };
      case 'permissions_roles':
        return { title: 'Permissions & Roles', subtitle: 'Configure access levels and permissions for school roles and individual users.' };
      case 'settings':
        return { title: 'School Setting', subtitle: 'Calibrate academic terms, grading coefficient structures, and school parameters' };
      case 'admin_utilities':
        return { title: 'Admin Utilities Panel', subtitle: 'Export secure database SQL configurations and review active system audit trails' };
      case 'accounting_dash':
        return { title: 'Overview', subtitle: 'Overview of all financial activities, balances, and fiscal health' };
      case 'general_ledger':
        return { title: 'General Ledger', subtitle: 'Detailed record of all transactions and accounts' };
      case 'accounts_payable':
        return { title: 'Accounts Payable', subtitle: 'Manage outgoing payments, vendor bills, and liabilities' };
      case 'accounts_receivable':
        return { title: 'Accounts Receivable', subtitle: 'Manage incoming payments, student invoices, and assets' };
      case 'student_portal':
        return { title: 'Student Self-Service Portal', subtitle: 'Candidate profiles, classes schedules, text-book libraries, and academic report sheets' };
      case 'super_admin':
        return { title: 'SaaS Supervisor Console', subtitle: 'Central platform administrator dashboard' };
      case 'teacher_portal':
        return { title: 'MY SHULE APP Teachers Portal', subtitle: 'Direct teacher tools, continuous marks entry, and stream forecasting analytics' };
      default:
        return { title: 'MY SHULE APP Module', subtitle: 'Operational system workspace' };
    }
  };

  const { title, subtitle } = getTabTitles(activeTab);

  return (
    <div 
      id="full-app-root" 
      className="hr-theme flex flex-col h-screen w-full overflow-hidden"
      style={{ '--header-height': 'auto' } as React.CSSProperties}
    >
      {/* Top Bar ModuleHeader */}
      <ModuleHeader 
        teacherInfo={teacherInfo!} 
        activeSchoolName={currentSchoolName} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeModule={title}
      />

      {/* Master screen splitting (HRSidebar | Active Tab Panel) */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Sidebar Nav container wrapping the sidebar with collapsible slide animations */}
        <div className={`transition-all duration-300 ease-in-out z-40 shrink-0 h-full pl-0 pb-0 overflow-hidden ${
          isSidebarOpen 
            ? 'w-[65vw] sm:w-[11rem] translate-x-0' 
            : 'w-0 -translate-x-full'
        } absolute md:relative inset-y-0 left-0`}>
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            teacherInfo={teacherInfo!} 
            onLogout={handleLogout} 
            activeSchoolId={activeSchoolId}
            activeSchoolName={currentSchoolName}
            onReturnToAdmin={() => {
              setActiveSchoolId('super');
              setActiveTab('super_admin');
            }}
          />
        </div>

        {/* Mobile/Tablet Backdrop Overlay shield */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity duration-300" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Main Workspace Frame */}
        <main className="flex-1 flex flex-col min-w-0 bg-white text-slate-800 relative overflow-hidden">
          {seedingInProgress && (
            <div className="bg-amber-50 border-b border-amber-250 text-amber-900 text-[16px] font-bold px-6 py-2 flex items-center gap-2 animate-pulse shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              Directing live cloud synchronize indexing stream... Please wait while Zira Analytics compiles records.
            </div>
          )}

          {/* Core Module Content Body */}
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8" id="dashboard-main-scroller">
            {['academic', 'classes', 'subjects', 'curriculum', 'assessments', 'results'].includes(activeTab) && (
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar">
                {[
                  { id: 'academic', label: 'Overview', icon: LayoutGrid },
                  { id: 'classes', label: 'Courses & Classes', icon: BookOpen },
                  { id: 'subjects', label: 'Subject Index', icon: Award },
                  { id: 'curriculum', label: 'Curriculum Planner', icon: Target },
                  { id: 'assessments', label: 'CAT Assessments', icon: FileText },
                  { id: 'results', label: 'Exam Sheets', icon: Award },
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as any)}
                      className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-lg font-bold transition duration-200 border ${
                        isActive
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
            {activeTab !== 'overview' && (
              <div className="mb-5 flex items-center justify-between bg-[#F8FAFC]/90 backdrop-blur-md border border-slate-150 rounded-[22px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] shrink-0 select-none">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-4.5 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 hover:border-[#8862F0]/40 hover:text-[#8862F0] transition-all text-sm shadow-[0_2px_6px_rgba(0,0,0,0.02)] cursor-pointer active:scale-95 shrink-0"
                >
                  <ArrowLeft className="w-4.5 h-4.5 text-[#8862F0] stroke-[2.5]" />
                  <span>Go Back</span>
                </button>
                <div className="text-right hidden sm:flex items-center gap-2 mr-3 font-sans">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Section:</span>
                  <span className="text-sm font-bold text-slate-700 bg-white border border-slate-100 rounded-lg px-2.5 py-0.5 shadow-2xs">{title}</span>
                </div>
              </div>
            )}
            {renderActiveTab()}
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
