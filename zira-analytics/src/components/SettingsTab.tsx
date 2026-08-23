import { toast } from "react-hot-toast";
import { useCurrency } from '../contexts/CurrencyContext.tsx';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SchoolSettings } from '../types';
import { 
  Settings, 
  Calendar, 
  Layers, 
  DollarSign, 
  Percent, 
  ShieldAlert, 
  Check, 
  RefreshCw,
  Plus,
  Trash2,
  Globe,
  Clock,
  User,
  Mail,
  MapPin,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Info,
  Shield,
  Palette,
  BookOpen,
  Sliders,
  Activity,
  Truck,
  Home,
  Link as LinkIcon,
  FileText,
  Cpu,
  Database,
  CreditCard,
  Building,
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface AcademicYear {
  id: string;
  year: string;
  status: 'Active (Current)' | 'Upcoming' | 'Completed' | 'Historical';
}

interface Term {
  id: string;
  name: string;
  start: string;
  end: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

interface GradeScale {
  id: string;
  grade: string;
  minScore: number;
  points: number;
  remark: string;
}

interface SettingsTabProps {
  activeSchoolId?: string;
}

export function SettingsTab({ activeSchoolId = 'karega' }: SettingsTabProps) {
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } = useCurrency();

  // Save/retrieve state dynamically to support persistent configuration
  const [activeSubTab, setActiveSubTab] = useState<string>('profile');

  // 1. School Profile state
  const [schoolProfile, setSchoolProfile] = useState(() => {
    const saved = localStorage.getItem('zira_school_profile');
    return saved ? JSON.parse(saved) : {
      schoolName: 'ZIRA ACADEMY',
      schoolEmail: 'admin@zira.academy',
      phoneNumber: '0303883838',
      fullAddress: 'P.O.Box 5566, Zira Avenue',
      city: 'Nairobi',
      country: 'Kenya',
      timezone: 'GMT',
      currency: globalCurrency,
      administratorName: 'System Admin',
      ownerEmail: 'admin@zira.co.ke',
      subscriptionPlan: 'Premium Plan (Active)'
    };
  });

  const [schoolLogo, setSchoolLogo] = useState<string>('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load from Firestore on mount
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', activeSchoolId), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SchoolSettings;
        if (data.logo) setSchoolLogo(data.logo);
        if (data.schoolName) {
           setSchoolProfile(prev => ({ ...prev, schoolName: data.schoolName }));
        }
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `settings/${activeSchoolId}`);
    });

    return () => unsub();
  }, [activeSchoolId]);

  // 2. Branding & Appearance state
  const [branding, setBranding] = useState(() => {
    const saved = localStorage.getItem('zira_branding_settings');
    return saved ? JSON.parse(saved) : {
      logoUrl: '/uploads/logo.png',
      faviconUrl: '',
      schoolSeal: 'Used on certificates & official documents',
      watermarkUrl: '',
      primaryColor: '#1e40af',
      accentColor: '#f97316',
      theme: 'slate'
    };
  });

  // 3. Academic Settings state
  const [academicSettings, setAcademicSettings] = useState(() => {
    const saved = localStorage.getItem('zira_academic_settings_config');
    return saved ? JSON.parse(saved) : {
      schoolShortName: 'ZiraSchool',
      schoolCode: 'GE-MM',
      schoolMotto: 'Learning Today, Leading Tomorrow',
      levels: ['Nursery / Pre-School', 'Primary', 'Junior High (JHS)', 'Senior High (SHS)'],
      curriculumType: 'Cambridge (IGCSE)'
    };
  });

  // 4. Academic Years & Terms
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const saved = localStorage.getItem('zira_academic_years');
    return saved ? JSON.parse(saved) : [
      { id: '1', year: '2026', status: 'Active (Current)' },
      { id: '2', year: '2025', status: 'Completed' },
      { id: '3', year: '2024', status: 'Historical' }
    ];
  });

  const [newYear, setNewYear] = useState('');
  
  const [terms, setTerms] = useState<Term[]>(() => {
    const saved = localStorage.getItem('zira_terms');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Term 1', start: '2026-01-05', end: '2026-04-10', status: 'Active' },
      { id: '2', name: 'Term 2', start: '2026-05-04', end: '2026-08-07', status: 'Upcoming' },
      { id: '3', name: 'Term 3', start: '2026-09-07', end: '2026-11-20', status: 'Upcoming' }
    ];
  });

  const [newTermName, setNewTermName] = useState('');
  const [newTermStart, setNewTermStart] = useState('');
  const [newTermEnd, setNewTermEnd] = useState('');
  const [showAddTermForm, setShowAddTermForm] = useState(false);

  // Subject Policies & Policy Engine
  const [structurePolicy, setStructurePolicy] = useState(() => {
    const saved = localStorage.getItem('zira_structure_policy');
    return saved ? JSON.parse(saved) : {
      yearFormat: 'September - July',
      semesterSystem: 'Trimester (3 terms)',
      gradingSystem: 'Percentage (0-100%)',
      calendarType: 'Standard',
      subjectCategories: ['Core', 'Elective', 'Extra-curricular', 'Extra'],
      coreMandatory: true,
      minElectives: 2,
      subjectWeighting: 'Equal Weighting',
      minAverage: 50,
      maxFailedAllowed: 2,
      distinctionThreshold: 80,
      carryOverAllowed: true,
      autoPromotion: false,
      manualOverride: true,
      gpaMethod: 'Weighted Average',
      resultPubControl: 'Auto-publish'
    };
  });

  const [newCategoryName, setNewCategoryName] = useState('');

  // 5. Attendance Policys
  const [attendancePolicy, setAttendancePolicy] = useState(() => {
    const saved = localStorage.getItem('zira_attendance_policy');
    return saved ? JSON.parse(saved) : {
      mode: 'Manual Entry',
      lateThreshold: 15,
      latePolicy: '3 lates = 1 absence',
      minAttendanceForPromotion: 80,
      absenceAlerts: true,
      autoNotifyParents: true
    };
  });

  // 6. Examination & Grading scale + report card rules
  const [gradingScale, setGradingScale] = useState<GradeScale[]>(() => {
    const saved = localStorage.getItem('zira_grading_scale');
    return saved ? JSON.parse(saved) : [
      { id: '1', grade: 'A', minScore: 80, points: 12, remark: 'Excellent' },
      { id: '2', grade: 'A-', minScore: 75, points: 11, remark: 'Very Good' },
      { id: '3', grade: 'B+', minScore: 70, points: 10, remark: 'Good' },
      { id: '4', grade: 'B', minScore: 65, points: 9, remark: 'Satisfactory' },
      { id: '5', grade: 'B-', minScore: 60, points: 8, remark: 'Above Average' },
      { id: '6', grade: 'C+', minScore: 55, points: 7, remark: 'Average' },
      { id: '7', grade: 'C', minScore: 50, points: 6, remark: 'Pass' },
      { id: '8', grade: 'D', minScore: 40, points: 4, remark: 'Weak' },
      { id: '9', grade: 'E', minScore: 0, points: 1, remark: 'Fail' }
    ];
  });

  const [newGradeLetter, setNewGradeLetter] = useState('');
  const [newGradeMinScore, setNewGradeMinScore] = useState(50);
  const [newGradePoints, setNewGradePoints] = useState(6);
  const [newGradeRemark, setNewGradeRemark] = useState('');
  const [showGradeAddBox, setShowGradeAddBox] = useState(false);

  const [examPolicy, setExamPolicy] = useState(() => {
    const saved = localStorage.getItem('zira_exam_policy');
    return saved ? JSON.parse(saved) : {
      assessmentCategories: [
        { id: '1', name: 'Continuous Assessment', weight: 40 },
        { id: '2', name: 'Final Exam', weight: 60 }
      ],
      gpaCalculation: 'Weighted Average',
      rankingSystem: 'Class-Level Ranking',
      reportCardFormat: 'Standard',
      passMark: 50,
      showPosition: true,
      promotionRules: 'Must pass core subjects and maintain min average'
    };
  });

  const [newAssessmentName, setNewAssessmentName] = useState('');
  const [newAssessmentWeight, setNewAssessmentWeight] = useState(30);

  // 7. Finance settings
  const [financePolicy, setFinancePolicy] = useState(() => {
    const saved = localStorage.getItem('zira_finance_policy');
    return saved ? JSON.parse(saved) : {
      feeItems: [
        { id: '1', name: 'Tuition', category: 'Academic', amount: 2000, cycle: 'Per Semester', mandatory: true },
        { id: '2', name: 'Medical Cover', category: 'Health', amount: 1500, cycle: 'Per Year', mandatory: false }
      ],
      gracePeriod: 14,
      penaltyValue: 5,
      penaltyCap: 0,
      penaltyConsequence: 'No Action',
      allowPartial: true,
      minInstallment: 100,
      maxInstallments: 3,
      autoDueDate: true,
      baseCurrency: 'PGK',
      enabledCurrencies: ['PGK', 'GHS']
    };
  });

  const [newFeeItemName, setNewFeeItemName] = useState('');
  const [newFeeItemCategory, setNewFeeItemCategory] = useState('Academic');
  const [newFeeItemAmount, setNewFeeItemAmount] = useState(2000);
  const [newFeeItemCycle, setNewFeeItemCycle] = useState('Per Semester');
  const [newFeeItemMandatory, setNewFeeItemMandatory] = useState(true);

  // 8. Communication configs
  const [communicationPolicy, setCommunicationPolicy] = useState(() => {
    const saved = localStorage.getItem('zira_communication_policy');
    return saved ? JSON.parse(saved) : {
      senderId: 'SHULE_SMS',
      smsGateway: 'Twilio API',
      emailSender: 'admin@school.edu',
      sendgridConfig: true,
      absenceAlerts: true,
      resultNotification: true
    };
  });

  // 9. Security & Privacy
  const [securityPolicy, setSecurityPolicy] = useState(() => {
    const saved = localStorage.getItem('zira_security_policy');
    return saved ? JSON.parse(saved) : {
      passwordLength: 8,
      requireSymbols: true,
      twoFactorAuth: false,
      sessionTimeout: 30
    };
  });

  // 17. Feature Flags State
  const [featureFlags, setFeatureFlags] = useState(() => {
    const saved = localStorage.getItem('zira_feature_flags');
    return saved ? JSON.parse(saved) : {
      aiAssistant: true,
      liveGps: false,
      biometricApi: false,
      multiCurrency: true
    };
  });

  // 18. Localization Setup
  const [localization, setLocalization] = useState(() => {
    const saved = localStorage.getItem('zira_localization');
    return saved ? JSON.parse(saved) : {
      primaryLanguage: 'English',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: 'Standard'
    };
  });

  // Hierarchy Stages state
  const [stages, setStages] = useState<{id: string, name: string, levels: string[]}[]>(() => {
    const saved = localStorage.getItem('school_stages');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Nursery / Pre-School', levels: ['Baby', 'KG 1', 'KG 2'] },
      { id: '2', name: 'Primary', levels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'] },
      { id: '3', name: 'Junior High', levels: ['Grade 7', 'Grade 8', 'Grade 9'] },
      { id: '4', name: 'Senior High', levels: ['Form 1', 'Form 2', 'Form 3', 'Form 4'] }
    ];
  });

  const [newStageName, setNewStageName] = useState('');
  const [newLevelName, setNewLevelName] = useState('');
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  // Persist values on modification
  useEffect(() => {
    localStorage.setItem('zira_school_profile', JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem('zira_branding_settings', JSON.stringify(branding));
  }, [branding]);

  useEffect(() => {
    localStorage.setItem('zira_academic_settings_config', JSON.stringify(academicSettings));
  }, [academicSettings]);

  useEffect(() => {
    localStorage.setItem('zira_academic_years', JSON.stringify(academicYears));
  }, [academicYears]);

  useEffect(() => {
    localStorage.setItem('zira_terms', JSON.stringify(terms));
  }, [terms]);

  useEffect(() => {
    localStorage.setItem('zira_structure_policy', JSON.stringify(structurePolicy));
  }, [structurePolicy]);

  useEffect(() => {
    localStorage.setItem('zira_attendance_policy', JSON.stringify(attendancePolicy));
  }, [attendancePolicy]);

  useEffect(() => {
    localStorage.setItem('zira_grading_scale', JSON.stringify(gradingScale));
  }, [gradingScale]);

  useEffect(() => {
    localStorage.setItem('zira_exam_policy', JSON.stringify(examPolicy));
  }, [examPolicy]);

  useEffect(() => {
    localStorage.setItem('zira_finance_policy', JSON.stringify(financePolicy));
  }, [financePolicy]);

  useEffect(() => {
    localStorage.setItem('zira_communication_policy', JSON.stringify(communicationPolicy));
  }, [communicationPolicy]);

  useEffect(() => {
    localStorage.setItem('zira_security_policy', JSON.stringify(securityPolicy));
  }, [securityPolicy]);

  useEffect(() => {
    localStorage.setItem('zira_feature_flags', JSON.stringify(featureFlags));
  }, [featureFlags]);

  useEffect(() => {
    localStorage.setItem('zira_localization', JSON.stringify(localization));
  }, [localization]);

  useEffect(() => {
    localStorage.setItem('school_stages', JSON.stringify(stages));
  }, [stages]);

  // Handler functions
  const handleSaveProfile = async () => {
    localStorage.setItem('zira_school_profile', JSON.stringify(schoolProfile));
    
    // Save to Firestore
    try {
      await setDoc(doc(db, 'settings', activeSchoolId), {
        schoolName: schoolProfile.schoolName,
        logo: schoolLogo,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast.success('School Profile details updated and synced to cloud.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `settings/${activeSchoolId}`);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSchoolLogo(base64String);
        toast.success("Logo uploaded locally. Click 'Save Profile' to persist.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    localStorage.setItem('zira_branding_settings', JSON.stringify(branding));
    toast.success('Branding and Appearance settings applied.');
  };

  const handleSaveAcademicSettings = () => {
    localStorage.setItem('zira_academic_settings_config', JSON.stringify(academicSettings));
    toast.success('General School Academic configurations updated.');
  };

  const handleSaveStructurePolicy = () => {
    localStorage.setItem('zira_structure_policy', JSON.stringify(structurePolicy));
    toast.success('Academic weights and structure policy guidelines saved.');
  };

  const handleSaveAttendancePolicy = () => {
    localStorage.setItem('zira_attendance_policy', JSON.stringify(attendancePolicy));
    toast.success('Attendance Mode & Alerts rules updated.');
  };

  const handleSaveExamPolicy = () => {
    localStorage.setItem('zira_exam_policy', JSON.stringify(examPolicy));
    localStorage.setItem('zira_grading_scale', JSON.stringify(gradingScale));
    toast.success('Examination policies and grading thresholds synchronized.');
  };

  const handleSaveFinancePolicy = () => {
    localStorage.setItem('zira_finance_policy', JSON.stringify(financePolicy));
    toast.success('Financial fee levels and currency settings compiled.');
  };

  const handleSaveCommunicationPolicy = () => {
    localStorage.setItem('zira_communication_policy', JSON.stringify(communicationPolicy));
    toast.success('System alert gateways and parent messaging default policies saved.');
  };

  const handleSaveSecurityPolicy = () => {
    localStorage.setItem('zira_security_policy', JSON.stringify(securityPolicy));
    toast.success('System safety credentials and access policies finalized.');
  };

  const handleSaveFeatureFlags = () => {
    localStorage.setItem('zira_feature_flags', JSON.stringify(featureFlags));
    toast.success('Platform feature switches altered.');
  };

  const handleSaveLocalization = () => {
    localStorage.setItem('zira_localization', JSON.stringify(localization));
    toast.success('System cultural and calendar localization settings saved.');
  };

  // Academic stages builders
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    const newStage = {
      id: Date.now().toString(),
      name: newStageName.trim(),
      levels: []
    };
    setStages([...stages, newStage]);
    setNewStageName('');
    toast.success("Academic stage added.");
  };

  const handleAddLevel = (stageId: string) => {
    if (!newLevelName.trim()) return;
    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        return { ...s, levels: [...s.levels, newLevelName.trim()] };
      }
      return s;
    }));
    setNewLevelName('');
    toast.success("Level added to stage.");
  };

  const handleRemoveLevel = (stageId: string, levelIndex: number) => {
    setStages(prev => prev.map(s => {
      if (s.id === stageId) {
        const newLevels = [...s.levels];
        newLevels.splice(levelIndex, 1);
        return { ...s, levels: newLevels };
      }
      return s;
    }));
    toast.success("Level removed.");
  };

  const handleRemoveStage = (id: string) => {
    setStages(prev => prev.filter(s => s.id !== id));
    toast.success("Stage cleared from architecture.");
  };

  // Calendar dates
  const handleAddYear = () => {
    const yrTrimmed = newYear.trim();
    if (!yrTrimmed) {
      toast.error('Academic Year input cannot be empty.');
      return;
    }
    if (academicYears.some(x => x.year === yrTrimmed)) {
      toast.error(`Year "${yrTrimmed}" already exists.`);
      return;
    }
    const newYItem: AcademicYear = {
      id: 'y-' + Date.now(),
      year: yrTrimmed,
      status: 'Upcoming'
    };
    setAcademicYears([...academicYears, newYItem]);
    setNewYear('');
    toast.success(`Academic Year ${yrTrimmed} registered.`);
  };

  const handleSetActiveYear = (id: string) => {
    setAcademicYears(prev => prev.map(item => ({
      ...item,
      status: item.id === id ? 'Active (Current)' : (item.status === 'Active (Current)' ? 'Completed' : item.status)
    })));
    toast.success("Current Operational Academic Year changed.");
  };

  const handleSetActiveTerm = (id: string) => {
    setTerms(prev => prev.map(t => ({
      ...t,
      status: t.id === id ? 'Active' : 'Upcoming'
    })));
    toast.success("Designated learning Term updated.");
  };

  const handleAddTerm = () => {
    const name = newTermName.trim();
    if (!name) {
      toast.error('Term name is required.');
      return;
    }
    const tItem: Term = {
      id: 't-' + Date.now(),
      name,
      start: newTermStart || '2026-01-01',
      end: newTermEnd || '2026-04-01',
      status: 'Upcoming'
    };
    setTerms([...terms, tItem]);
    setNewTermName('');
    setShowAddTermForm(false);
    toast.success(`Planned term scheduled.`);
  };

  // Grading modifications
  const handleUpdateGrading = (id: string, field: keyof GradeScale, val: any) => {
    setGradingScale(prev => prev.map(g => g.id === id ? { ...g, [field]: val } : g));
  };

  const handleAddGradeLevel = () => {
    const letter = newGradeLetter.trim().toUpperCase();
    if (!letter) return;
    const newG: GradeScale = {
      id: 'g-' + Date.now(),
      grade: letter,
      minScore: newGradeMinScore,
      points: newGradePoints,
      remark: newGradeRemark.trim() || 'Pass'
    };
    setGradingScale(prev => [...prev, newG].sort((a, b) => b.minScore - a.minScore));
    setNewGradeLetter('');
    setShowGradeAddBox(false);
    toast.success(`Grade "${letter}" allocated.`);
  };

  const handleDeleteGradeLevel = (id: string) => {
    setGradingScale(prev => prev.filter(g => g.id !== id));
  };

  // Sub-modules checklist menu
  const subModules = [
    { id: 'profile', label: 'School Profile', icon: Building, color: 'text-orange-500 bg-orange-50/10 hover:border-orange-200' },
    { id: 'branding', label: 'Branding & Appearance', icon: Palette, color: 'text-pink-500 bg-pink-50/10 hover:border-pink-200' },
    { id: 'academic', label: 'Academic Settings', icon: BookOpen, color: 'text-indigo-500 bg-indigo-50/10 hover:border-indigo-200' },
    { id: 'structure', label: 'Academic Structure', icon: Layers, color: 'text-teal-500 bg-teal-50/10 hover:border-teal-200' },
    { id: 'attendance', label: 'Attendance', icon: Activity, color: 'text-red-500 bg-red-50/10 hover:border-red-200' },
    { id: 'grading', label: 'Examination & Grading', icon: Percent, color: 'text-sky-500 bg-sky-50/10 hover:border-sky-200' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50/10 hover:border-emerald-200' },
    { id: 'communication', label: 'Communication', icon: Volume2, color: 'text-violet-500 bg-violet-50/10 hover:border-violet-200' },
    { id: 'security', label: 'Security & Privacy', icon: Shield, color: 'text-amber-500 bg-amber-50/10 hover:border-amber-200' },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon, color: 'text-slate-400 bg-slate-100/10 hover:border-slate-150', soon: true },
    { id: 'transport', label: 'Transport', icon: Truck, color: 'text-slate-400 bg-slate-100/10 hover:border-slate-150', soon: true },
    { id: 'hostel', label: 'Hostel', icon: Home, color: 'text-slate-400 bg-slate-100/10 hover:border-slate-150', soon: true },
    { id: 'documents', label: 'Document & Compliance', icon: FileText, color: 'text-slate-400 bg-slate-100/10 hover:border-slate-150', soon: true },
    { id: 'automation', label: 'System Automation', icon: Cpu, color: 'text-slate-400 bg-slate-100/10 hover:border-slate-150', soon: true },
    { id: 'backup', label: 'Backup & Data', icon: Database, color: 'text-slate-400 bg-slate-100/10 hover:border-slate-150', soon: true },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard, color: 'text-blue-500 bg-blue-50/10 hover:border-blue-200' },
    { id: 'features', label: 'Feature Flags', icon: Sliders, color: 'text-rose-500 bg-rose-50/10 hover:border-rose-200' },
    { id: 'localization', label: 'Localization', icon: Globe, color: 'text-orange-600 bg-orange-50/10 hover:border-orange-205' },
  ];

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fade-in">

      {/* Buttons at the Top representing the sub-modules as actual horizontal pill buttons */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl shadow-xs space-y-1.5">
        <span className="text-[14px] font-bold tracking-widest text-slate-400 uppercase tabular-nums block">
          Configuration Settings
        </span>
        <div className="flex flex-wrap gap-2">
          {subModules.map((mod) => {
            const IconComponent = mod.icon;
            const isSelected = activeSubTab === mod.id;
            return (
              <button
                key={mod.id}
                id={`sub_module_${mod.id}`}
                onClick={() => setActiveSubTab(mod.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-[11.5px] font-bold rounded-2xl transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.98] ${
                  isSelected 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 stroke-[2.2] ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{mod.label}</span>
                {mod.soon && (
                  <span className="text-[12px] font-bold text-rose-500 bg-rose-50 px-1 rounded tabular-nums uppercase">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Module Workspace Panel */}
      <div className="bg-slate-50/30 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-[2rem] p-1.5 shadow-xs min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            
            {/* 1. SCHOOL PROFILE SUBMODULE */}
            {activeSubTab === 'profile' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Basic School Profile Information</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Core public descriptors and identification records</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-base font-bold text-slate-700">
                  {/* Logo Upload Section */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-4">
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-sm border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] flex items-center justify-center overflow-hidden">
                      {schoolLogo ? (
                        <img src={schoolLogo} alt="School Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Building className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="text-[17px] font-bold text-slate-900 uppercase">School Logo</h4>
                      <p className="text-[15px] text-slate-400 font-medium mt-1">Recommended: Square PNG/JPG, Max 2MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-2 py-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-700 rounded-xl hover:bg-slate-50 transition font-bold text-[14px] uppercase tracking-wider cursor-pointer font-sans"
                    >
                      {schoolLogo ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    <input 
                      type="file" 
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Official School Name</label>
                    <input 
                      type="text" 
                      value={schoolProfile.schoolName}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, schoolName: e.target.value })}
                      className="w-full text-slate-900 font-bold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Administrative Email Address</label>
                    <input 
                      type="email" 
                      value={schoolProfile.schoolEmail}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, schoolEmail: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Contact Phone Number</label>
                    <input 
                      type="text" 
                      value={schoolProfile.phoneNumber}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, phoneNumber: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Contact & Location Address</label>
                    <input 
                      type="text" 
                      value={schoolProfile.fullAddress}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, fullAddress: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">City / State / Region</label>
                    <input 
                      type="text" 
                      value={schoolProfile.city}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, city: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Country Destination</label>
                    <input 
                      type="text" 
                      value={schoolProfile.country}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, country: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Default Timezone</label>
                    <select 
                      value={schoolProfile.timezone}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, timezone: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 font-bold"
                    >
                      <option value="GMT">GMT / UTC</option>
                      <option value="Africa/Nairobi">EAT / Africa/Nairobi</option>
                      <option value="Africa/Accra">GMT / Africa/Accra</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Regional Base Currency</label>
                    <select 
                      value={globalCurrency}
                      onChange={(e) => {
                        setSchoolProfile({ ...schoolProfile, currency: e.target.value });
                        setGlobalCurrency(e.target.value);
                      }}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 font-bold"
                    >
                      <option value="GHS">GHS (Ghanaian Cedi GH₵)</option>
                      <option value="KES">KES (Kenyan Shilling (Ksh))</option>
                      <option value="PGK">PGK (Papua New Guinea Kina)</option>
                      <option value="USD">USD (United States Dollar $)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Headmaster / Principal Administrator</label>
                    <input 
                      type="text" 
                      value={schoolProfile.administratorName}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, administratorName: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Owner Email Profile</label>
                    <input 
                      type="email" 
                      value={schoolProfile.ownerEmail}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, ownerEmail: e.target.value })}
                      className="w-full text-slate-950 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Billing SaaS Tier</label>
                    <div className="w-full bg-slate-50 p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-xl text-slate-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      {schoolProfile.subscriptionPlan}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save Profile changes
                  </button>
                </div>
              </div>
            )}

            {/* 2. BRANDING & APPEARANCE */}
            {activeSubTab === 'branding' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Palette className="w-5 h-5 text-pink-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Branding Assets & UI customisation</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Set portal badges, school seals, report watermarks, and brand styling</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-base font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Logo URL Address</label>
                    <input 
                      type="text" 
                      value={branding.logoUrl}
                      onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white text-slate-905"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Favicon Badge Icon URL</label>
                    <input 
                      type="text" 
                      placeholder="e.g. /favicon.ico"
                      value={branding.faviconUrl}
                      onChange={(e) => setBranding({ ...branding, faviconUrl: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">School Seal Crest Text</label>
                    <input 
                      type="text" 
                      value={branding.schoolSeal}
                      onChange={(e) => setBranding({ ...branding, schoolSeal: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Report Card Watermark overlay image URL</label>
                    <input 
                      type="text" 
                      placeholder="e.g. /uploads/watermark_crest.png"
                      value={branding.watermarkUrl}
                      onChange={(e) => setBranding({ ...branding, watermarkUrl: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Custom Primary Hex Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                        className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white text-slate-900 tabular-nums font-bold"
                      />
                      <div className="w-12 h-12 rounded-xl border border-slate-250 shrink-0" style={{ backgroundColor: branding.primaryColor }} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Custom Accent Hex Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={branding.accentColor}
                        onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                        className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white text-slate-900 tabular-nums font-bold"
                      />
                      <div className="w-12 h-12 rounded-xl border border-slate-250 shrink-0" style={{ backgroundColor: branding.accentColor }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Portal Styling Preset</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['slate', 'white', 'dark'].map((thm) => (
                        <button
                          type="button"
                          key={thm}
                          onClick={() => setBranding({ ...branding, theme: thm })}
                          className={`p-3.5 border rounded-2xl font-bold uppercase text-center cursor-pointer transition ${
                            branding.theme === thm ? 'border-pink-500 bg-pink-50/10 text-pink-700' : 'border-slate-200 hover:bg-slate-50/60 text-slate-650'
                          }`}
                        >
                          {thm}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveBranding}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save Branding Assets
                  </button>
                </div>
              </div>
            )}

            {/* 3. ACADEMIC SETTINGS */}
            {activeSubTab === 'academic' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">General Academic Setup</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Set school abbrev, national code, motto description, levels and standard curricula</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-base font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Short Abbreviation Name</label>
                    <input 
                      type="text" 
                      value={academicSettings.schoolShortName}
                      onChange={(e) => setAcademicSettings({ ...academicSettings, schoolShortName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">National School Code Registration</label>
                    <input 
                      type="text" 
                      value={academicSettings.schoolCode}
                      onChange={(e) => setAcademicSettings({ ...academicSettings, schoolCode: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Curriculum Pathway Scheme</label>
                    <select
                      value={academicSettings.curriculumType}
                      onChange={(e) => setAcademicSettings({ ...academicSettings, curriculumType: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Kenya CBC (Competency Based)">Kenya CBC / CBE Pathway</option>
                      <option value="Kenya 8-4-4 System">Kenya 8-4-4 Framework</option>
                      <option value="Local / National">Local / National Statutory Framework</option>
                      <option value="British Curriculum">British National Curriculum</option>
                      <option value="Cambridge (IGCSE)">Cambridge University (IGCSE)</option>
                      <option value="American Curriculum">American High K-12 Schema</option>
                      <option value="International Baccalaureate">International Baccalaureate (IB)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-3">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px]">Official School Motto</label>
                    <input 
                      type="text" 
                      value={academicSettings.schoolMotto}
                      onChange={(e) => setAcademicSettings({ ...academicSettings, schoolMotto: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-905"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-3 pb-2">
                    <label className="block text-slate-500 uppercase tracking-wide tabular-nums text-[14px] mb-1.5">Active Level Scopes</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-150 rounded-2xl">
                      {['Nursery / Pre-School', 'Primary', 'Junior High (JHS)', 'Senior High (SHS)', 'College', 'University', 'Vocational / Technical'].map((lvl) => {
                        const exists = academicSettings.levels.includes(lvl);
                        return (
                          <label key={lvl} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200/50 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={exists}
                              onChange={() => {
                                if (exists) {
                                  setAcademicSettings({ ...academicSettings, levels: academicSettings.levels.filter(x => x !== lvl) });
                                } else {
                                  setAcademicSettings({ ...academicSettings, levels: [...academicSettings.levels, lvl] });
                                }
                              }}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-305"
                            />
                            <span className="text-slate-700 font-bold tracking-tight">{lvl}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveAcademicSettings}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save Academic settings
                  </button>
                </div>
              </div>
            )}

            {/* 4. ACADEMIC STRUCTURE (stages + calendars + policies) */}
            {activeSubTab === 'structure' && (
              <div className="space-y-6">
                
                {/* Stages builder section */}
                <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-teal-600" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Structured Stage Levels & Streams Builder</h3>
                        <p className="text-[15px] text-slate-400 mt-0.5 font-sans font-semibold">Construct the organizational stages representing your learning ladder</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. University"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="px-3 py-1.5 border border-slate-250 bg-slate-50 text-base font-bold rounded-xl focus:bg-white focus:outline-none"
                      />
                      <button 
                        onClick={handleAddStage}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-base font-bold uppercase rounded-xl cursor-pointer"
                      >
                        Add Stage
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stages.map((stage) => (
                      <div key={stage.id} className="p-2 bg-slate-50 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[14px] font-bold text-slate-400 uppercase tracking-wide tabular-nums">Stage ID {stage.id}</span>
                          <button 
                            onClick={() => handleRemoveStage(stage.id)} 
                            className="text-slate-400 hover:text-rose-600 transition"
                            title="Delete stage"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-slate-800 uppercase tracking-wide leading-tight">{stage.name}</h4>
                        <div className="space-y-1">
                          {stage.levels.map((lvl, index) => (
                            <div key={index} className="flex justify-between items-center text-[10.5px] font-bold text-slate-650 bg-white p-2 rounded-lg border border-slate-150">
                              <span>{lvl}</span>
                              <button 
                                onClick={() => handleRemoveLevel(stage.id, index)}
                                className="text-rose-500 hover:text-rose-700 font-bold font-sans"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            placeholder="Add Sub-lvl"
                            value={activeStageId === stage.id ? newLevelName : ''}
                            onChange={(e) => {
                              setActiveStageId(stage.id);
                              setNewLevelName(e.target.value);
                            }}
                            className="flex-1 text-[14px] font-bold p-1 bg-white border border-slate-200 rounded focus:outline-none"
                          />
                          <button 
                            onClick={() => handleAddLevel(stage.id)}
                            className="bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-bold text-base p-1 rounded"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Term calendars structure setup */}
                <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-650" />
                      <div>
                        <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide font-sans">Operational Terms & Calendars</h4>
                        <p className="text-[14px] text-slate-400 mt-0.5 font-sans font-bold">Declare designated learning terms to group test registers</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddTermForm(!showAddTermForm)}
                      className="px-3.5 py-1.5 bg-teal-500/10 text-teal-700 hover:bg-teal-500/20 text-base font-bold uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Plan term
                    </button>
                  </div>

                  {showAddTermForm && (
                    <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-base font-bold text-slate-700">
                      <div className="space-y-1">
                        <label className="text-[14px] text-slate-400 uppercase tracking-wider tabular-nums">Term Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Term 4 Intensive" 
                          value={newTermName}
                          onChange={(e) => setNewTermName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-905 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[14px] text-slate-400 uppercase tracking-wider tabular-nums">Start Date</label>
                        <input 
                          type="date" 
                          value={newTermStart}
                          onChange={(e) => setNewTermStart(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[14px] text-slate-400 uppercase tracking-wider tabular-nums">End Date</label>
                        <input 
                          type="date" 
                          value={newTermEnd}
                          onChange={(e) => setNewTermEnd(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:outline-none animate-fade-in"
                        />
                      </div>
                      <div className="sm:col-span-3 flex justify-end gap-2 text-base pt-1">
                        <button 
                          onClick={() => setShowAddTermForm(false)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleAddTerm}
                          className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg"
                        >
                          Confirm Term Schedule
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {terms.map((term) => (
                      <div key={term.id} className="p-1.5 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl flex items-center justify-between text-base font-bold text-slate-700">
                        <div className="space-y-0.5">
                          <span className="text-slate-900 uppercase font-bold text-[16px]">{term.name}</span>
                          <span className={`inline-block px-2 text-[12px] tabular-nums font-bold uppercase rounded py-0.5 border ml-2 ${term.status==='Active'?'bg-emerald-50 text-emerald-700 border-emerald-250':'bg-slate-200 border-slate-300 text-slate-500'}`}>
                            {term.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 tabular-nums text-[10.5px]">{term.start} to {term.end}</span>
                          {term.status !== 'Active' && (
                            <button
                              onClick={() => handleSetActiveTerm(term.id)}
                              className="text-[14px] text-indigo-650 hover:underline"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional academic parameters & weight regulations */}
                <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-5 text-base font-bold text-slate-700">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-base uppercase font-bold tracking-wider text-slate-900">Academic Structure Policies & Progression Defaults</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-500 uppercase tracking-wide tabular-nums">Academic Year Span</label>
                      <select 
                        value={structurePolicy.yearFormat}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, yearFormat: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                        <option value="September - July">September to July Schedule</option>
                        <option value="January - December">January to December Schedule</option>
                        <option value="August - June">August to June Schedule</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-500 uppercase tracking-wide tabular-nums">Term Division Type</label>
                      <select 
                        value={structurePolicy.semesterSystem}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, semesterSystem: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                        <option value="Trimester (3 terms)">Trimester Structure (3 cycles)</option>
                        <option value="Semester (2 terms)">Semester Structure (2 cycles)</option>
                        <option value="Quarterly System">Quarterly Structure (4 cycles)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-500 uppercase tracking-wide tabular-nums">Subject Coefficient Weighting</label>
                      <select 
                        value={structurePolicy.subjectWeighting}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, subjectWeighting: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                        <option value="Equal Weighting">Equal Weights (Add & Average)</option>
                        <option value="Weighted Coefficient">Coefficient Weighted Factors</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-500 uppercase tracking-wide tabular-nums">Min Grade Threshold for Pass (%)</label>
                      <input 
                        type="number" 
                        value={structurePolicy.minAverage}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, minAverage: Number(e.target.value) })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none tabular-nums"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-500 uppercase tracking-wide tabular-nums">Max permissible Failed Subjects Allowed</label>
                      <input 
                        type="number" 
                        value={structurePolicy.maxFailedAllowed}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, maxFailedAllowed: Number(e.target.value) })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none tabular-nums"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-500 uppercase tracking-wide tabular-nums">Distinction Threshold Limit (%)</label>
                      <input 
                        type="number" 
                        value={structurePolicy.distinctionThreshold}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, distinctionThreshold: Number(e.target.value) })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-150 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 select-none">
                      <input 
                        type="checkbox" 
                        checked={structurePolicy.coreMandatory}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, coreMandatory: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="text-slate-800 font-bold block">Core Subjects Mandatory</span>
                        <span className="text-[10.5px] text-slate-400 font-medium block">All central courses must be taken</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 select-none">
                      <input 
                        type="checkbox" 
                        checked={structurePolicy.carryOverAllowed}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, carryOverAllowed: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="text-slate-800 font-bold block">Carry-Over Allowed</span>
                        <span className="text-[10.5px] text-slate-400 font-medium block">Carry forward failed subjects</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 select-none">
                      <input 
                        type="checkbox" 
                        checked={structurePolicy.manualOverride}
                        onChange={(e) => setStructurePolicy({ ...structurePolicy, manualOverride: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="text-slate-800 font-bold block">Manual Progression Override</span>
                        <span className="text-[10.5px] text-slate-400 font-medium block">Allow staff to promote exceptions</span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveStructurePolicy}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                    >
                      Save policy rules
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 5. ATTENDANCE SUBMODULE */}
            {activeSubTab === 'attendance' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5 text-base font-bold text-slate-705">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Activity className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Attendance Mode & Policy</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Toggle automated attendance modes, late penalties, alerts and thresholds</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Attendance Register Mode</label>
                    <select
                      value={attendancePolicy.mode}
                      onChange={(e) => setAttendancePolicy({ ...attendancePolicy, mode: e.target.value })}
                      className="w-full p-2.5 border border-slate-205 rounded-xl bg-slate-50 focus:outline-none"
                    >
                      <option value="Manual Entry">Manual Classroom Roll-call Log</option>
                      <option value="QR Code Scan">Pupils Dynamic QR Code Scan Badge</option>
                      <option value="Biometric">Staff Biometric Fingerprint Register</option>
                      <option value="RFID Card">RFID Card Proximity Sweep Terminal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Late Tolerence Threshold (minutes)</label>
                    <input 
                      type="number" 
                      value={attendancePolicy.lateThreshold}
                      onChange={(e) => setAttendancePolicy({ ...attendancePolicy, lateThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-205 rounded-xl bg-slate-50 focus:outline-none tabular-nums"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Standard Late Policy</label>
                    <select
                      value={attendancePolicy.latePolicy}
                      onChange={(e) => setAttendancePolicy({ ...attendancePolicy, latePolicy: e.target.value })}
                      className="w-full p-2.5 border border-slate-205 rounded-xl bg-slate-50 focus:outline-none font-semibold"
                    >
                      <option value="3 lates = 1 absence">3 Late marks equates to 1 Absence flag</option>
                      <option value="Mark as late after threshold">Just mark as Late index in records</option>
                      <option value="5 lates = 1 absence">5 Late marks equates to 1 Absence flag</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Min Attendance required for Promotion (%)</label>
                    <input 
                      type="number" 
                      value={attendancePolicy.minAttendanceForPromotion}
                      onChange={(e) => setAttendancePolicy({ ...attendancePolicy, minAttendanceForPromotion: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-205 rounded-xl bg-slate-50 focus:outline-none tabular-nums"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5 pt-2 flex flex-col justify-center">
                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={attendancePolicy.absenceAlerts}
                        onChange={(e) => setAttendancePolicy({ ...attendancePolicy, absenceAlerts: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="text-slate-800">Auto-Notify Absenteeism Alerts Gateways</span>
                        <p className="text-[10.5px] text-slate-400 font-medium font-sans">Send instantaneous automated text logs or emails to parents for unrecognized absences</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveAttendancePolicy}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save Attendance rules
                  </button>
                </div>
              </div>
            )}

            {/* 6. EXAMINATION & GRADING */}
            {activeSubTab === 'grading' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5 font-bold text-base text-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-sky-505" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Assessment Scopes & Grading Weights</h3>
                      <p className="text-[11.5px] text-slate-400 font-medium font-sans">Set coefficient grade curves and percentage limits for class report calculations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGradeAddBox(!showGradeAddBox)}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 rounded-xl text-[15px] font-bold uppercase border border-indigo-150"
                  >
                    Add grade range
                  </button>
                </div>

                {/* Score Range Addition Box */}
                {showGradeAddBox && (
                  <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-1.5">
                    <div className="space-y-1 font-semibold">
                      <label className="text-[14px] text-slate-450 uppercase tracking-wide tabular-nums">Letter designation</label>
                      <input 
                        type="text" 
                        placeholder="A+, B, C" 
                        value={newGradeLetter}
                        onChange={(e) => setNewGradeLetter(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-905 uppercase text-center focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-450 uppercase tracking-wide tabular-nums">Minimum Score (%)</label>
                      <input 
                        type="number" 
                        value={newGradeMinScore}
                        onChange={(e) => setNewGradeMinScore(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-905 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-450 uppercase tracking-wide tabular-nums">Grade point Coeff</label>
                      <input 
                        type="number" 
                        value={newGradePoints}
                        onChange={(e) => setNewGradePoints(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-905 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-455 uppercase tracking-wide tabular-nums">Remark text</label>
                      <input 
                        type="text" 
                        placeholder="Descriptive remark" 
                        value={newGradeRemark}
                        onChange={(e) => setNewGradeRemark(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-905 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-4 flex justify-end gap-2 pt-1 font-semibold">
                      <button 
                        onClick={() => setShowGradeAddBox(false)}
                        className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-base"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddGradeLevel}
                        className="px-3 py-1.5 bg-slate-905 text-white rounded-lg text-base"
                      >
                        Register grade range
                      </button>
                    </div>
                  </div>
                )}

                {/* Interactive Grade Scale Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden font-sans">
                  <table className="w-full text-left text-base border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[14px] font-bold tracking-widest uppercase tabular-nums">
                        <th className="px-5 py-3">Letter Grade</th>
                        <th className="px-5 py-3">Min Percent limit (%)</th>
                        <th className="px-5 py-3">Points weight</th>
                        <th className="px-5 py-3">Descriptive remark</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
                      {gradingScale.map((gr) => (
                        <tr key={gr.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-5 py-2 tabular-nums font-bold text-indigo-650 text-lg">{gr.grade}</td>
                          <td className="px-5 py-2">
                            <input 
                              type="number" 
                              value={gr.minScore}
                              onChange={(e) => handleUpdateGrading(gr.id, 'minScore', Number(e.target.value))}
                              className="w-16 px-2 py-1 border border-slate-200 rounded text-center bg-slate-50 tabular-nums"
                            />
                            <span className="text-slate-400 font-bold ml-1">% min</span>
                          </td>
                          <td className="px-5 py-2">
                            <input 
                              type="number" 
                              value={gr.points}
                              onChange={(e) => handleUpdateGrading(gr.id, 'points', Number(e.target.value))}
                              className="w-16 px-2 py-1 border border-slate-200 rounded text-center bg-slate-50 tabular-nums"
                            />
                            <span className="text-slate-400 font-bold ml-1">pts</span>
                          </td>
                          <td className="px-5 py-2">
                            <input 
                              type="text" 
                              value={gr.remark}
                              onChange={(e) => handleUpdateGrading(gr.id, 'remark', e.target.value)}
                              className="px-2.5 py-1 border border-slate-200 rounded text-base w-full max-w-sm"
                            />
                          </td>
                          <td className="px-5 py-2 text-right">
                            <button 
                              onClick={() => {
                                if (gradingScale.length <= 3) {
                                  toast.error('Must preserve at least 3 discrete grading brackets.');
                                  return;
                                }
                                handleDeleteGradeLevel(gr.id);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-4 h-4 ml-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveExamPolicy}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save grading presets
                  </button>
                </div>
              </div>
            )}

            {/* 7. FINANCE SUBMODULE */}
            {activeSubTab === 'finance' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5 text-base font-bold text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Fee Structures & Finance Settings</h3>
                      <p className="text-[11.5px] text-slate-400 font-medium font-sans">Manage fee structures, baseline billing intervals, delinquency fines and payment rules</p>
                    </div>
                  </div>
                </div>

                {/* Custom Fee structure list */}
                <div className="space-y-4">
                  <span className="text-[14px] text-slate-400 font-bold tracking-widest uppercase tabular-nums block">Registered Baseline Fees</span>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden font-sans">
                    <table className="w-full text-left text-base border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[14px] font-bold tracking-widest uppercase tabular-nums">
                          <th className="p-3 pl-4">Fee Item</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Default Amount</th>
                          <th className="p-3">Interval Cycle</th>
                          <th className="p-3">Mandatory</th>
                          <th className="p-3 text-right pr-4">Roster Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-bold text-slate-800">
                        {financePolicy.feeItems.map((fee: any) => (
                          <tr key={fee.id} className="hover:bg-slate-50/50">
                            <td className="p-3 pl-4 text-slate-900">{fee.name}</td>
                            <td className="p-3">
                              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-[14px] font-bold uppercase text-center border border-emerald-250">
                                {fee.category}
                              </span>
                            </td>
                            <td className="p-3 text-right text-slate-900 tabular-nums">{financePolicy.baseCurrency} {fee.amount}</td>
                            <td className="p-3 text-slate-500 font-semibold">{fee.cycle}</td>
                            <td className="p-3">{fee.mandatory ? 'Yes' : 'No'}</td>
                            <td className="p-3 text-right pr-4">
                              <button 
                                onClick={() => {
                                  setFinancePolicy({
                                    ...financePolicy,
                                    feeItems: financePolicy.feeItems.filter((x: any) => x.id !== fee.id)
                                  });
                                  toast.success("Fee Item removed.");
                                }}
                                className="text-rose-500 hover:text-rose-700 text-[10.5px] font-bold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl grid grid-cols-1 sm:grid-cols-5 gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Fee Item Name" 
                      value={newFeeItemName}
                      onChange={(e) => setNewFeeItemName(e.target.value)}
                      className="p-2 border border-slate-300 rounded-xl bg-white text-base text-slate-905"
                    />
                    <select 
                      value={newFeeItemCategory}
                      onChange={(e) => setNewFeeItemCategory(e.target.value)}
                      className="p-2 border border-slate-300 rounded-xl bg-white text-base focus:outline-none"
                    >
                      <option value="Academic">Academic Tuition</option>
                      <option value="Health">Health & Insurance</option>
                      <option value="Facilities">General levies</option>
                      <option value="Extracurricular">Clubs & Logistics</option>
                    </select>
                    <input 
                      type="number" 
                      placeholder="Amount" 
                      value={newFeeItemAmount}
                      onChange={(e) => setNewFeeItemAmount(Number(e.target.value))}
                      className="p-2 border border-slate-300 rounded-xl bg-white text-base text-slate-905 tabular-nums"
                    />
                    <select 
                      value={newFeeItemCycle}
                      onChange={(e) => setNewFeeItemCycle(e.target.value)}
                      className="p-2 border border-slate-300 rounded-xl bg-white text-base focus:outline-none"
                    >
                      <option value="Per Semester">Per Term Cycle</option>
                      <option value="Per Year">Per Annual Cycle</option>
                      <option value="One-Time">Single One-Time Fee</option>
                      <option value="Monthly">Per Month Cycle</option>
                    </select>
                    <button 
                      onClick={() => {
                        if (!newFeeItemName.trim()) return;
                        const item = {
                          id: Date.now().toString(),
                          name: newFeeItemName.trim(),
                          category: newFeeItemCategory,
                          amount: newFeeItemAmount,
                          cycle: newFeeItemCycle,
                          mandatory: newFeeItemMandatory
                        };
                        setFinancePolicy({
                          ...financePolicy,
                          feeItems: [...financePolicy.feeItems, item]
                        });
                        setNewFeeItemName('');
                        toast.success("Planned Fee level scheduled.");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base uppercase rounded-xl transition"
                    >
                      Add Fee
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveFinancePolicy}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save financial profile
                  </button>
                </div>
              </div>
            )}

            {/* 8. COMMUNICATION */}
            {activeSubTab === 'communication' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5 text-base font-bold text-slate-700">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Volume2 className="w-5 h-5 text-violet-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Communication & Notifications Channels</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Set default SMS gateway parameters, Sender ID configurations, and automated alert systems</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">SMS Sender ID text handle</label>
                    <input 
                      type="text" 
                      value={communicationPolicy.senderId}
                      onChange={(e) => setCommunicationPolicy({ ...communicationPolicy, senderId: e.target.value })}
                      className="w-full p-3 border border-slate-205 rounded-xl bg-slate-50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[14px] text-slate-405 uppercase tracking-wide tabular-nums font-bold">Standard SMS API Gateway Integration</label>
                    <select
                      value={communicationPolicy.smsGateway}
                      onChange={(e) => setCommunicationPolicy({ ...communicationPolicy, smsGateway: e.target.value })}
                      className="w-full p-3 border border-slate-205 rounded-xl bg-slate-50 font-bold focus:outline-none"
                    >
                      <option value="Twilio API">Dynamic Twilio SMS Outbound API</option>
                      <option value="SMSAfrica">SMSAfrica Bulk carrier platform</option>
                      <option value="ZongSMS">ZongSMS direct service provider</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Default outbound system Email address</label>
                    <input 
                      type="email" 
                      value={communicationPolicy.emailSender}
                      onChange={(e) => setCommunicationPolicy({ ...communicationPolicy, emailSender: e.target.value })}
                      className="w-full p-3 border border-slate-205 rounded-xl bg-slate-50 focus:outline-none text-slate-905 font-semibold"
                    />
                  </div>

                  <div className="md:col-span-2 bg-slate-50 p-2 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={communicationPolicy.sendgridConfig}
                        onChange={(e) => setCommunicationPolicy({ ...communicationPolicy, sendgridConfig: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <div>
                        <span className="text-slate-800">Use SendGrid relay wrapper</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={communicationPolicy.absenceAlerts}
                        onChange={(e) => setCommunicationPolicy({ ...communicationPolicy, absenceAlerts: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <div>
                        <span className="text-slate-800">Class Absence parents auto-notif</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={communicationPolicy.resultNotification}
                        onChange={(e) => setCommunicationPolicy({ ...communicationPolicy, resultNotification: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <div>
                        <span className="text-slate-800">Exam Report text auto-dispatch</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveCommunicationPolicy}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save communication default values
                  </button>
                </div>
              </div>
            )}

            {/* 9. SECURITY & PRIVACY */}
            {activeSubTab === 'security' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldUp className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Access Policy & Privacy Settings</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Role based access matrix registers, token configurations and credentials security</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-base font-bold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Minimum Password requirement length</label>
                    <input 
                      type="number" 
                      value={securityPolicy.passwordLength}
                      onChange={(e) => setSecurityPolicy({ ...securityPolicy, passwordLength: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl tabular-nums focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Portal Session Expiry Timeout (minutes)</label>
                    <input 
                      type="number" 
                      value={securityPolicy.sessionTimeout}
                      onChange={(e) => setSecurityPolicy({ ...securityPolicy, sessionTimeout: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl tabular-nums focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={securityPolicy.requireSymbols}
                        onChange={(e) => setSecurityPolicy({ ...securityPolicy, requireSymbols: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-550"
                      />
                      <div>
                        <span>Require Alphanumeric Special Characters in passwords</span>
                        <p className="text-[14px] text-slate-400 font-medium font-sans">Force all users to input complex letters including (e.g. @, #, $, !)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveSecurityPolicy}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save security registry
                  </button>
                </div>
              </div>
            )}

            {/* TEASER MODULES FOR "SOON" FLAGS */}
            {['integrations', 'transport', 'hostel', 'documents', 'automation', 'backup'].includes(activeSubTab) && (
              <div className="bg-white p-8 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs text-center space-y-2 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
                  <Plus className="w-8 h-8 animate-pulse text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <span className="text-[14px] font-bold tracking-widest text-indigo-600 uppercase tabular-nums block">Featured ZIRA SaaS Module Add-on</span>
                  <h3 className="text-xl font-bold text-slate-900 uppercase">
                    {activeSubTab === 'integrations' && 'Third-Party Active Integrations API'}
                    {activeSubTab === 'transport' && 'School Fleet & Route logistics telemetry'}
                    {activeSubTab === 'hostel' && 'Hostel Wardens & Room bed occupancies registry'}
                    {activeSubTab === 'documents' && 'Document Vault & Ministry Compliance audits'}
                    {activeSubTab === 'automation' && 'Automated system triggers & backup cron services'}
                    {activeSubTab === 'backup' && 'Manual Snapshots & Spreadsheet bulk system restore'}
                  </h3>
                  <p className="text-base text-slate-500 font-medium font-sans leading-relaxed">
                    This module coordinates with the super-admin master portal configurations. Please consult with ZIRA academy administrative directors to provision license keys on your current active tenant directory.
                  </p>
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      toast.success("License interest logged on cloud registry.");
                    }}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-750 text-base font-bold uppercase rounded-xl cursor-pointer"
                  >
                    Express Interest in Activation
                  </button>
                </div>
              </div>
            )}

            {/* 16. SUBSCRIPTION & BILLING */}
            {activeSubTab === 'billing' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Subscription & Invoices Billing Registry</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Review active seat metrics, subscription tiers, renewal payment dates, and download historical invoice PDFs</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl">
                    <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wide tabular-nums block">Current Tier License</span>
                    <span className="text-[21px] font-bold text-slate-900 uppercase block mt-1">Zira SaaS Standard Team Plan</span>
                  </div>
                  <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl">
                    <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wide tabular-nums block">Recurring License Amount</span>
                    <span className="text-[21px] font-bold text-indigo-700 uppercase block mt-1">$249 / Monthly recur</span>
                  </div>
                  <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl">
                    <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wide tabular-nums block">Next Billing date</span>
                    <span className="text-[21px] font-bold text-slate-900 uppercase block mt-1-0 tabular-nums">July 01, 2026</span>
                  </div>
                </div>

                <div className="space-y-3 font-semibold text-base text-slate-750 font-sans">
                  <span className="text-[14px] text-slate-400 font-bold tracking-widest uppercase tabular-nums block">Invoice History</span>
                  <div className="border border-slate-200 rounded-2xl divide-y divide-slate-150">
                    <div className="p-3.5 bg-slate-50/55 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900">Billing Inv #INV-001092</span>
                        <span className="text-[10.5px] text-slate-400 tabular-nums font-medium block">Paid May 01, 2026</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-850 px-2.5 py-0.5 rounded text-[10.5px] font-semibold">Success</span>
                    </div>
                    <div className="p-3.5 bg-slate-50/55 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900">Billing Inv #INV-000881</span>
                        <span className="text-[10.5px] text-slate-400 tabular-nums font-medium block">Paid Apr 01, 2026</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-850 px-2.5 py-0.5 rounded text-[10.5px] font-semibold">Success</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 17. FEATURE FLAGS */}
            {activeSubTab === 'features' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sliders className="w-5 h-5 text-rose-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">ZIRA Experimental Feature Flags</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Gain instant preview capabilities on cutting-edge features before wide production deployment</p>
                  </div>
                </div>

                <div className="space-y-4 font-semibold text-base text-slate-705">
                  <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer select-none">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-slate-900 font-bold text-lg uppercase block">Interactive AI Assistant Copilot</span>
                      <p className="text-[15px] text-slate-400 font-medium font-sans">Power teacher planner aids, auto exam grading summaries, and predictive metrics analytics</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={featureFlags.aiAssistant}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, aiAssistant: e.target.checked })}
                      className="w-5 h-5 rounded text-rose-500 focus:ring-rose-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer select-none">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-slate-900 font-bold text-lg uppercase block">Live GPS Fleet Tracking API</span>
                      <p className="text-[15px] text-slate-400 font-medium font-sans">Render live Google maps bus markers and telemetry triggers within parent self-service dashboard</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={featureFlags.liveGps}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, liveGps: e.target.checked })}
                      className="w-5 h-5 rounded text-rose-500 focus:ring-rose-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer select-none">
                    <div className="space-y-0.5 pr-4">
                      <span className="text-slate-900 font-bold text-lg uppercase block">Biometric Register sweeping service</span>
                      <p className="text-[15px] text-slate-400 font-medium font-sans">Harmonise physical terminal inputs directly to database staff attendance registers</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={featureFlags.biometricApi}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, biometricApi: e.target.checked })}
                      className="w-5 h-5 rounded text-rose-500 focus:ring-rose-500"
                    />
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveFeatureFlags}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save trial properties
                  </button>
                </div>
              </div>
            )}

            {/* 18. LOCALIZATION */}
            {activeSubTab === 'localization' && (
              <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-xs space-y-1.5 text-base font-bold text-slate-700">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Localization & Regional parameters</h3>
                    <p className="text-[11.5px] text-slate-400 font-medium font-sans">Calibrate system-wide default languages, date calendars format, and decimal number separators</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Preferred Primary Language</label>
                    <select
                      value={localization.primaryLanguage}
                      onChange={(e) => setLocalization({ ...localization, primaryLanguage: e.target.value })}
                      className="w-full p-3 border border-slate-205 rounded-xl bg-slate-50 font-bold focus:outline-none"
                    >
                      <option value="English">English (United Kingdom / standard)</option>
                      <option value="French">French / Français (Metropolitan)</option>
                      <option value="Kiswahili">Kiswahili / East African regional standard</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">System-wide Date Format</label>
                    <select
                      value={localization.dateFormat}
                      onChange={(e) => setLocalization({ ...localization, dateFormat: e.target.value })}
                      className="w-full p-3 border border-slate-205 rounded-xl bg-slate-50 font-bold focus:outline-none"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 05/01/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-01-05)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 01/05/2026)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums">Number formatting grouping</label>
                    <select
                      value={localization.numberFormat}
                      onChange={(e) => setLocalization({ ...localization, numberFormat: e.target.value })}
                      className="w-full p-3 border border-slate-205 rounded-xl bg-slate-50 font-bold focus:outline-none"
                    >
                      <option value="Standard">Standard (e.g. 150,000.00)</option>
                      <option value="Indian Group">Western Euro (e.g. 150.000,00)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveLocalization}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base uppercase tracking-wide rounded-xl cursor-pointer"
                  >
                    Save Localization Preference
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

// Inline fallback component to prevent compile errors for missing custom icons or definitions
function ShieldUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l7-2a1 1 0 0 1 .48 0l7 2A1 1 0 0 1 20 6z" />
      <path d="m12 8-4 4h8z" />
    </svg>
  );
}
