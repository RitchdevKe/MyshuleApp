import React, { useState } from 'react';
import { 
  Bell, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Heart, 
  Coffee, 
  Truck, 
  Home, 
  Archive, 
  ShoppingCart, 
  FileText, 
  UserCheck, 
  ArrowRight, 
  DollarSign, 
  Plus, 
  Check, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Search,
  BookMarked,
  Trash,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'react-hot-toast';
import { Student, Exam, FeeTransaction } from '../types.ts';

import { ClassesTab } from './ClassesTab.tsx';
import { SubjectsTab } from './SubjectsTab.tsx';
import { CurriculumTab } from './CurriculumTab.tsx';
import { AssessmentsTab } from './AssessmentsTab.tsx';
import { ResultsTab } from './ResultsTab.tsx';
import { LMSTab } from './LMSTab.tsx';
import { PTCTab } from './PTCTab.tsx';
import { FinanceDashTab } from './FinanceDashTab.tsx';
import { InvoicesTab } from './InvoicesTab.tsx';
import { FeeStructureTab } from './FeeStructureTab.tsx';
import { LeaveManagementTab } from './LeaveManagementTab.tsx';
import { PayrollTab } from './PayrollTab.tsx';

interface ExtraModulesProps {
  tab: string;
  students: Student[];
  exams: Exam[];
  transactions: FeeTransaction[];
}

export function ExtraModules({ tab, students, exams, transactions }: ExtraModulesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('All');
  
  // Custom mock interactive states for various submodules
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Fee Payment Approved', body: 'Douglas Omari\'s term payment of KES 25,000 has been successfully cleared.', type: 'fees', date: 'Just now', unread: true },
    { id: '2', title: 'KCSE Marks Registered', body: 'Biology and Chemistry scores for Form 4 classmates have been sync\'ed for midterms.', type: 'academic', date: '2 hours ago', unread: true },
    { id: '3', title: 'New Admission Form Filed', body: 'A candidate enrollment application for Adrian Kipirono has entered the review pipeline.', type: 'admission', date: '5 hours ago', unread: false },
    { id: '4', title: 'SaaS Gateway Maintenance', body: 'The portal gateway is undergoing performance optimization over the weekend.', type: 'system', date: '1 day ago', unread: false }
  ]);

  const [promotions, setPromotions] = useState([
    { id: '1', name: 'Douglas Omari', currentForm: 3, targetForm: 4, stream: 'North', performance: 'A-', recommended: 'Yes', status: 'Pending' },
    { id: '2', name: 'Emily Wanjala', currentForm: 3, targetForm: 4, stream: 'South', performance: 'B', recommended: 'Yes', status: 'Pending' },
    { id: '3', name: 'Pius Mwambia', currentForm: 2, targetForm: 3, stream: 'North', performance: 'C+', recommended: 'Yes', status: 'Pending' },
    { id: '4', name: 'Winnie Tabitha', currentForm: 1, targetForm: 2, stream: 'North', performance: 'A', recommended: 'Yes', status: 'Pending' }
  ]);

  const [alumni, setAlumni] = useState([
    { id: '1', name: 'Kevin Kiprop', classOf: '2025', finalGrade: 'A', university: 'University of Nairobi', placement: 'Medicine & Surgery' },
    { id: '2', name: 'Sophia Wambua', classOf: '2025', finalGrade: 'A-', university: 'Kenyatta University', placement: 'Software Engineering' },
    { id: '3', name: 'David Mutua', classOf: '2024', finalGrade: 'B+', university: 'Jomo Kenyatta University', placement: 'Civil Engineering' },
    { id: '4', name: 'Rael Chepkemoi', classOf: '2024', finalGrade: 'A', university: 'Strathmore University', placement: 'Finance & Actuarial Science' }
  ]);

  // Promotions overlay states
  const [showAddPromotionModal, setShowAddPromotionModal] = useState(false);
  const [newPromoName, setNewPromoName] = useState('');
  const [newPromoCurrentForm, setNewPromoCurrentForm] = useState(3);
  const [newPromoTargetForm, setNewPromoTargetForm] = useState(4);
  const [newPromoStream, setNewPromoStream] = useState('North');
  const [newPromoPerformance, setNewPromoPerformance] = useState('B+');

  // Alumni overlay states
  const [showAddAlumniModal, setShowAddAlumniModal] = useState(false);
  const [alumniSearchQuery, setAlumniSearchQuery] = useState('');
  const [alumniClassFilter, setAlumniClassFilter] = useState('All');
  const [newAlumniName, setNewAlumniName] = useState('');
  const [newAlumniClassOf, setNewAlumniClassOf] = useState('2026');
  const [newAlumniGrade, setNewAlumniGrade] = useState('A-');
  const [newAlumniUni, setNewAlumniUni] = useState('');
  const [newAlumniPlacement, setNewAlumniPlacement] = useState('');

  // Course Classes overlay states
  const [editingClass, setEditingClass] = useState<any>(null);
  const [newClassForm, setNewClassForm] = useState(1);
  const [newClassStreams, setNewClassStreams] = useState(2);
  const [newClassStudentsNum, setNewClassStudentsNum] = useState(40);
  const [newClassTeacher, setNewClassTeacher] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const [classesList, setClassesList] = useState([
    { form: 4, streamsCount: 2, totalStudents: 45, classTeacher: 'Mr. Daniel Gitumu' },
    { form: 3, streamsCount: 2, totalStudents: 48, classTeacher: 'Mrs. Mercy Chepkoech' },
    { form: 2, streamsCount: 2, totalStudents: 52, classTeacher: 'Mr. Shadrack Kiprop' },
    { form: 1, streamsCount: 2, totalStudents: 40, classTeacher: 'Mrs. Winnie Tabitha' }
  ]);

  const [subjectsList, setSubjectsList] = useState([
    { id: '1', code: 'MAT', name: 'Mathematics', dept: 'Sciences', coefficient: 1.2, average: 74, lead: 'Mr. Daniel Gitumu' },
    { id: '2', code: 'ENG', name: 'English', dept: 'Languages', coefficient: 1.0, average: 68, lead: 'Mrs. Angela Ndwiga' },
    { id: '3', code: 'KIS', name: 'Kiswahili', dept: 'Languages', coefficient: 1.0, average: 71, lead: 'Mr. Dennis Omwamba' },
    { id: '4', code: 'CHE', name: 'Chemistry', dept: 'Sciences', coefficient: 1.1, average: 59, lead: 'Mr. Daniel Gitumu' },
    { id: '5', code: 'BIO', name: 'Biology', dept: 'Sciences', coefficient: 1.1, average: 65, lead: 'Mrs. Mercy Chepkoech' }
  ]);

  // Subjects state variables
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjDept, setNewSubjDept] = useState('Sciences');
  const [newSubjCoeff, setNewSubjCoeff] = useState(1.0);
  const [newSubjAvg, setNewSubjAvg] = useState(70);
  const [newSubjLead, setNewSubjLead] = useState('');
  const [subjSearchQuery, setSubjSearchQuery] = useState('');
  const [subjDeptFilter, setSubjDeptFilter] = useState('All');

  // Curriculum state variables
  const [showAddCurriculumModal, setShowAddCurriculumModal] = useState(false);
  const [newCurrTopic, setNewCurrTopic] = useState('');
  const [newCurrSubject, setNewCurrSubject] = useState('Mathematics Form 4');
  const [newCurrProgress, setNewCurrProgress] = useState(50);
  const [newCurrTeacher, setNewCurrTeacher] = useState('');
  const [currSearchQuery, setCurrSearchQuery] = useState('');

  // Assessment filters
  const [assessmentsSearch, setAssessmentsSearch] = useState('');
  const [assessmentsSubjectFilter, setAssessmentsSubjectFilter] = useState('All');

  // Exam sheets (Term Final Master Sheets)
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamStudent, setNewExamStudent] = useState('');
  const [newExamForm, setNewExamForm] = useState(4);
  const [newExamAvg, setNewExamAvg] = useState(75);
  const [newExamRemarks, setNewExamRemarks] = useState('');
  const [examFormFilter, setExamFormFilter] = useState('All');
  const [examSearchQuery, setExamSearchQuery] = useState('');

  const [curriculumState, setCurriculumState] = useState([
    { id: '1', topic: 'Calculus I - Integration', subject: 'Mathematics Form 4', progress: 85, teacher: 'Mr. Daniel Gitumu' },
    { id: '2', topic: 'Organic Chemistry II', subject: 'Chemistry Form 4', progress: 60, teacher: 'Mr. Daniel Gitumu' },
    { id: '3', topic: 'Literary Text Analysis - Blossoms', subject: 'English Form 4', progress: 90, teacher: 'Mrs. Angela Ndwiga' },
    { id: '4', topic: 'Genetics and Chromosomes', subject: 'Biology Form 3', progress: 45, teacher: 'Mrs. Mercy Chepkoech' }
  ]);

  const [assessments, setAssessments] = useState([
    { id: '1', student: 'Douglas Omari', subject: 'Mathematics', form: 4, stream: 'North', score: 28, maxScore: 30, catType: 'CAT 1' },
    { id: '2', student: 'Emily Wanjala', subject: 'Mathematics', form: 4, stream: 'South', score: 24, maxScore: 30, catType: 'CAT 1' },
    { id: '3', student: 'Douglas Omari', subject: 'Chemistry', form: 4, stream: 'North', score: 22, maxScore: 30, catType: 'CAT 2' },
    { id: '4', student: 'Pius Mwambia', subject: 'Mathematics', form: 2, stream: 'North', score: 19, maxScore: 30, catType: 'CAT 1' }
  ]);

  const [examSheets, setExamSheets] = useState([
    { student: 'Douglas Omari', form: 4, averageMark: 81.2, rank: 1, remarks: 'Excellent performance, consistent focus' },
    { student: 'Emily Wanjala', form: 4, averageMark: 75.6, rank: 2, remarks: 'Very good score, keep up the effort' },
    { student: 'Lilian Chepotip', form: 4, averageMark: 72.1, rank: 3, remarks: 'Strong outcomes, capable of A grade' },
    { student: 'Adrian Kipirono', form: 4, averageMark: 68.4, rank: 4, remarks: 'Steady progress, enhance science revisions' }
  ]);

  const [lmsResources, setLmsResources] = useState([
    { id: '1', title: 'Integration Calculus Formula Sheet', subject: 'Mathematics', format: 'PDF', size: '2.4 MB', downs: 154, path: '#' },
    { id: '2', title: 'Biology Form 4 Genetics Comprehensive Notes', subject: 'Biology', format: 'PDF', size: '8.1 MB', downs: 201, path: '#' },
    { id: '3', title: 'Video Link: Organic Chemistry Esterification Processes', subject: 'Chemistry', format: 'External Video', size: '12 mins', downs: 92, path: '#' },
    { id: '4', title: 'Term 1 Revision Exam Past Papers (2020-2025)', subject: 'All Subjects', format: 'ZIP File', size: '18.4 MB', downs: 310, path: '#' }
  ]);

  const [ptcBookings, setPtcBookings] = useState([
    { id: '1', parentName: 'Mr. Bernard Kiprop', studentName: 'Kevin Kiprop', teacherName: 'Mr. Daniel Gitumu', date: '2026-06-05', time: '10:00 AM - 10:30 AM', status: 'Approved' },
    { id: '2', parentName: 'Mrs. Janet Omari', studentName: 'Douglas Omari', teacherName: 'Mrs. Mercy Chepkoech', date: '2026-06-05', time: '11:00 AM - 11:30 AM', status: 'Pending' },
    { id: '3', parentName: 'Mr. Julius Wanjala', studentName: 'Emily Wanjala', teacherName: 'Mr. Shadrack Kiprop', date: '2026-06-06', time: '02:00 PM - 02:30 PM', status: 'Approved' }
  ]);




  // Transport Routes & Logistics reactive states
  const [routesList, setRoutesList] = useState([
    { id: '1', route: 'Route A - Nairobi Central Town', driver: 'Douglas Kamau', vehicle: 'KBA 920X (52-Seater Bus)', price: 'KES 4,500/term', activeStudents: 15 },
    { id: '2', route: 'Route B - Ngong / Karen Ring', driver: 'Silas Kiprono', vehicle: 'KCB 402Y (33-Seater Minibus)', price: 'KES 6,000/term', activeStudents: 11 },
    { id: '3', route: 'Route C - Thika Road Expressway', driver: 'William Mwangangi', vehicle: 'KCC 012A (14-Seater Shuttle)', price: 'KES 7,500/term', activeStudents: 4 }
  ]);
  const [transportSearchQuery, setTransportSearchQuery] = useState('');
  const [transportRouteFilter, setTransportRouteFilter] = useState('All');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleBrand, setNewVehicleBrand] = useState('Isuzu Bus');
  const [newVehicleCapacity, setNewVehicleCapacity] = useState(52);
  
  // Boarding & Hostel reactive states
  const [dormsList, setDormsList] = useState([
    { id: '1', name: 'Mount Longonot House', master: 'Mr. Daniel Gitumu', captain: 'Kevin Kiprop', capacity: 120, occupied: 94 },
    { id: '2', name: 'Aberdares Crest Dormitory', master: 'Mr. Dennis Omwamba', captain: 'Douglas Omari', capacity: 100, occupied: 88 },
    { id: '3', name: 'Mount Kenya Girls Wing', master: 'Mrs. Winnie Tabitha', captain: 'Emily Wanjala', capacity: 120, occupied: 105 }
  ]);
  const [hostelSearchQuery, setHostelSearchQuery] = useState('');
  const [hostelDormFilter, setHostelDormFilter] = useState('All');
  const [showAddDormRoomModal, setShowAddDormRoomModal] = useState(false);
  const [newRoomHostel, setNewRoomHostel] = useState('Aberdares Crest Dormitory');
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newRoomBeds, setNewRoomBeds] = useState(8);

  const [schoolAssets] = useState([
    { id: '1', name: 'School Main Server Block', code: 'SRV-KSS-01', location: 'Server Room', value: 'KES 250,000', status: 'Operational' },
    { id: '2', name: 'Physics Laboratory Oscilloscopes', code: 'LAB-OSC-01', location: 'Physics Block', value: 'KES 140,000', status: 'Operational' },
    { id: '3', name: 'Library Dell Desktop Workstations', code: 'LIB-DESK-04', location: 'Library Main', value: 'KES 180,000', status: 'Operational' },
    { id: '4', name: 'Biology Microscope Assemblies', code: 'LAB-MIC-08', location: 'Biology Laboratory', value: 'KES 90,000', status: 'Maintenance Required' }
  ]);

  const [procurementList] = useState([
    { id: 'PO-2026-011', supplier: 'Apex Stationers Kenya', item: 'Term 1 Exam Papers Printing Cartridges', amount: 'KES 34,000', date: '2026-05-20', status: 'Dispatched' },
    { id: 'PO-2026-012', supplier: 'Brookside Dairies', item: 'Dry Milk Powder rations - 20 sacks', amount: 'KES 85,000', date: '2026-05-22', status: 'Under Review' },
    { id: 'PO-2026-013', supplier: 'Sigma Chemicals Ltd', item: 'Chemistry Practical Reagents Supply', amount: 'KES 18,500', date: '2026-05-24', status: 'Approved' }
  ]);

  const [supplierList] = useState([
    { id: 'SUP-001', name: 'Apex Stationers Kenya', category: 'Stationery & Printing', contact: '+254 722 000111', status: 'Active Container' },
    { id: 'SUP-002', name: 'Brookside Dairies', category: 'Food & Groceries', contact: '+254 733 000222', status: 'Active Container' },
    { id: 'SUP-003', name: 'Sigma Chemicals Ltd', category: 'Lab & Science', contact: '+254 744 000333', status: 'Active Container' },
    { id: 'SUP-004', name: 'Kenya Text-Book Centre', category: 'Library Books', contact: '+254 755 000444', status: 'Pending Review' }
  ]);

  const [vendorList] = useState([
    { id: 'VND-100', vendorName: 'Securex Security Services', service: 'Guard Deployment', contractExpiry: '2026-12-31', rating: '9.4 / 10' },
    { id: 'VND-101', vendorName: 'Mawingu Internet Wifi', service: 'Fiber connectivity (ISP)', contractExpiry: '2027-02-15', rating: '8.8 / 10' },
    { id: 'VND-102', vendorName: 'Clean-Sweep Janitorial', service: 'Cleaning Services & Toiletries', contractExpiry: '2026-08-30', rating: '7.5 / 10' }
  ]);

  const [canteenCart, setCanteenCart] = useState<{ name: string; price: number; qty: number }[]>([]);
  const canteenItems = [
    { name: 'Sodas (300ml Glass)', price: 60, icon: '🥤' },
    { name: 'Notebook (Form 4 Ruled)', price: 120, icon: '📓' },
    { name: 'Lunch Meal Coupon', price: 150, icon: '🍛' },
    { name: 'School Pen (Pilot Blue)', price: 30, icon: '🖊️' },
    { name: 'Canteen Snack (Mandazi)', price: 15, icon: '🥯' }
  ];

  const [clinicLogs, setClinicLogs] = useState([
    { id: '1', student: 'Douglas Omari', complaint: 'Mild headache & dehydration', action: 'Rest interval & Paracetamol administered', date: '2026-05-26', status: 'Discharged' },
    { id: '2', student: 'Kevin Kiprop', complaint: 'Ankle sprain in inter-dorm football', action: 'Cold spray & support bandage bound', date: '2026-05-27', status: 'Discharged' },
    { id: '3', student: 'Emily Wanjala', complaint: 'Seasonal allergy outbreak', action: 'Antihistamine dose (Cetirizine) provided', date: '2026-05-27', status: 'Under Observation' }
  ]);

  const [financeOverviewData] = useState([
    { month: 'Dec', collection: 450000, target: 500000 },
    { month: 'Jan', collection: 820000, target: 800000 },
    { month: 'Feb', collection: 620000, target: 700000 },
    { month: 'Mar', collection: 300000, target: 500000 },
    { month: 'Apr', collection: 920000, target: 900000 },
    { month: 'May', collection: 540000, target: 600000 }
  ]);


  // Transport and Logistics Registry
  const [vehicles, setVehicles] = useState([
    { id: 'v1', plate: 'KBA 920X', brand: 'Isuzu Bus', capacity: 52, status: 'Active' },
    { id: 'v2', plate: 'KCB 402Y', brand: 'Toyota Minibus', capacity: 33, status: 'Active' },
    { id: 'v3', plate: 'KCC 012A', brand: 'Nissan Shuttle', capacity: 14, status: 'Maintenance' }
  ]);
  const [drivers, setDrivers] = useState([
    { id: 'd1', name: 'Douglas Kamau', license: 'DL-A19502', phone: '+254722001122' },
    { id: 'd2', name: 'Silas Kiprono', license: 'DL-B84920', phone: '+254733445566' },
    { id: 'd3', name: 'William Mwangangi', license: 'DL-C12201', phone: '+254711223344' }
  ]);
  const [transportAssignments, setTransportAssignments] = useState([
    { id: 'ta1', studentName: 'Douglas Omari', studentId: 'ADM-2020-001', route: 'Route B - Ngong / Karen Ring', chargedAmount: 6000, status: 'Billed to Finance' },
    { id: 'ta2', studentName: 'Emily Wanjala', studentId: 'ADM-2023-002', route: 'Route A - Nairobi Central Town', chargedAmount: 4500, status: 'Billed to Finance' }
  ]);

  // Hostel Rooms Setup
  const [roomsSetup, setRoomsSetup] = useState([
    { id: 'r1', hostel: 'Aberdares Crest Dormitory', roomNo: 'Room 101', bedsCount: 8, occupied: 6 },
    { id: 'r2', hostel: 'Mount Longonot House', roomNo: 'Room A', bedsCount: 10, occupied: 10 },
    { id: 'r3', hostel: 'Mount Kenya Girls Wing', roomNo: 'Room G-12', bedsCount: 12, occupied: 9 }
  ]);
  const [bedAssignments, setBedAssignments] = useState([
    { id: 'ba1', studentName: 'Douglas Omari', studentId: 'ADM-2020-001', hostel: 'Aberdares Crest Dormitory', room: 'Room 101', bedNo: 'Bed A-4', charge: 18000, status: 'Billed to Finance' }
  ]);

  // Library fine lists tracking
  const [libraryFinesList, setLibraryFinesList] = useState([
    { id: 'lf1', student: 'Emily Wanjala', book: 'Secondary School Mathematics Form 4', fineAmount: 150, unpaid: true },
    { id: 'lf2', student: 'Adrian Kipirono', book: 'Integrated Chemistry Manual', fineAmount: 0, unpaid: false }
  ]);

  // Handle action callbacks
  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const handlePromote = (id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, status: 'Promoted' } : p));
  };

  const addToCart = (item: { name: string; price: number }) => {
    setCanteenCart(prev => {
      const idx = prev.findIndex(c => c.name === item.name);
      if (idx > -1) {
        return prev.map((c, i) => i === idx ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
  };

  const clearCart = () => setCanteenCart([]);
  const handlePurchase = () => {
    toast.success(`Success: KES ${canteenCart.reduce((s, c) => s + c.price * c.qty, 0)} worth of items debited from student smart-card account.`);
    setCanteenCart([]);
  };

  // Render dispatch triggers based on different tabs
  switch (tab) {
    case 'notifications':
      return (
        <div className="space-y-4">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">New Notification</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">Broadcast an alert to portal users.</p>
            <div className="flex flex-col md:flex-row gap-2.5 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Title</label>
                <input type="text" id="notif-title" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium transition" placeholder="e.g. Campus lockdown" />
              </div>
              <div className="flex-[2] w-full">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Message</label>
                <input type="text" id="notif-body" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-normal transition" placeholder="Detailed alert description..." />
              </div>
              <button 
                onClick={() => {
                  const t = document.getElementById('notif-title') as HTMLInputElement;
                  const b = document.getElementById('notif-body') as HTMLInputElement;
                  if (t?.value && b?.value) {
                    setNotifications([{
                      id: String(Date.now()),
                      title: t.value,
                      body: b.value,
                      type: 'system',
                      date: 'Just now',
                      unread: true
                    }, ...notifications]);
                    t.value = '';
                    b.value = '';
                    toast.success('Notification broadcast queued.');
                  } else {
                    toast.error('Please fill in both title and message.');
                  }
                }}
                className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white text-sm font-medium rounded-lg transition cursor-pointer shrink-0 border-none shadow-sm whitespace-nowrap"
              >
                Send Alert
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-[1.25rem] border-x-2 border-b-2 border-[#C20F47] border-t-[8px] transition ${n.unread ? 'bg-indigo-50/50 border-t-indigo-400' : 'bg-white border-t-[#F39C2A]'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 bg-indigo-50 rounded-lg text-indigo-600 flex items-center justify-center shrink-0">
                      <Bell className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 truncate">{n.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">{n.date}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{n.body}</p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => toggleNotification(n.id)}
                    className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition cursor-pointer border-none bg-transparent"
                  >
                    {n.unread ? 'Mark as read' : 'Mark as unread'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'promotions': {
      const filteredPromotions = promotions.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="space-y-6">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase">Active Promotions Registry</h3>
                <p className="text-[17px] text-slate-500 mt-0.5">Automated and manually triggered Form transition records</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => setShowAddPromotionModal(true)}
                  className="px-4 py-2 bg-[var(--color-secondary)] text-white text-lg font-bold rounded-xl hover:bg-[var(--color-secondary)] transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-[var(--color-secondary)]/15"
                >
                  <Plus className="w-4 h-4" /> Request Promotion
                </button>
                <button 
                  onClick={() => {
                    setPromotions(prev => prev.map(p => ({ ...p, status: 'Promoted' })));
                    toast.success('All recommended students transitioned to new class academic forms.');
                  }}
                  className="px-4 py-2 bg-[var(--color-secondary)] text-white text-lg font-bold rounded-xl hover:bg-[var(--color-primary)] transition cursor-pointer"
                >
                  Promote All Selection
                </button>
              </div>
            </div>

            {/* Filters bar */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Filter student by name..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-lg font-semibold"
                />
              </div>
            </div>

            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Student Name</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Current Form</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Target Form</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Streams Allocation</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Performance Score</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Recommended Promotion</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Transition Status</th>
                  <th className="px-5 py-3 text-right uppercase text-[16px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPromotions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                      No matching promotion logs found in current academic directory.
                    </td>
                  </tr>
                ) : (
                  filteredPromotions.map(p => (
                    <tr key={p.id}>
                      <td className="px-5 py-3.5 font-bold text-slate-900">{p.name}</td>
                      <td className="px-5 py-3.5 text-slate-600">Form {p.currentForm}</td>
                      <td className="px-5 py-3.5 font-bold text-[var(--color-secondary)]">Form {p.targetForm || (p.currentForm + 1)}</td>
                      <td className="px-5 py-3.5 text-slate-600 tabular-nums">{p.stream}</td>
                      <td className="px-5 py-3.5 font-bold text-indigo-600 tabular-nums">{p.performance}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[15px] uppercase tracking-wider border border-emerald-200">
                          {p.recommended}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[15px] uppercase tracking-wider border ${p.status === 'Promoted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {p.status !== 'Promoted' ? (
                          <button
                            onClick={() => {
                              handlePromote(p.id);
                              toast.success(`Approved transition for ${p.name}!`);
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-[var(--color-secondary)] hover:text-white rounded-lg text-[16px] font-bold uppercase transition cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-[16px] text-slate-400 font-bold uppercase flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-500" /> Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ADD PROMOTION REQUEST MODAL OVERLAY */}
          {showAddPromotionModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2 shadow-2xl text-slate-800 text-lg font-semibold">
                <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase">Apply Promotion Transition</h3>
                  <button onClick={() => setShowAddPromotionModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Select Candidate Student</label>
                    <select 
                      onChange={e => setNewPromoName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold cursor-pointer"
                    >
                      <option value="">-- Choose Pupil --</option>
                      {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.id})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Current Form</label>
                      <select 
                        value={newPromoCurrentForm} 
                        onChange={e => {
                          setNewPromoCurrentForm(Number(e.target.value));
                          setNewPromoTargetForm(Number(e.target.value) + 1);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                      >
                        <option value={1}>Form 1</option>
                        <option value={2}>Form 2</option>
                        <option value={3}>Form 3</option>
                        <option value={4}>Form 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Promote To</label>
                      <select 
                        value={newPromoTargetForm} 
                        onChange={e => setNewPromoTargetForm(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                      >
                        <option value={2}>Form 2</option>
                        <option value={3}>Form 3</option>
                        <option value={4}>Form 4</option>
                        <option value={5}>Graduated Cohort</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Stream Route</label>
                      <select 
                        value={newPromoStream} 
                        onChange={e => setNewPromoStream(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                      >
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Performance Mean</label>
                      <input 
                        type="text" 
                        value={newPromoPerformance} 
                        onChange={e => setNewPromoPerformance(e.target.value)}
                        placeholder="e.g. A-, B+, C"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none tabular-nums font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-[17px] pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setShowAddPromotionModal(false)}
                    className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!newPromoName) {
                        toast.error('Please select a student register record.');
                        return;
                      }
                      const newItem = {
                        id: String(Date.now()),
                        name: newPromoName,
                        currentForm: Number(newPromoCurrentForm),
                        targetForm: Number(newPromoTargetForm),
                        stream: newPromoStream,
                        performance: newPromoPerformance,
                        recommended: 'Yes',
                        status: 'Pending'
                      };
                      setPromotions([newItem, ...promotions]);
                      toast.success(`Filed dynamic transition recommendation successfully for ${newPromoName}`);
                      setShowAddPromotionModal(false);
                    }}
                    className="px-4 py-2 bg-[var(--color-secondary)] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'alumni': {
      const filteredAlumni = alumni.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(alumniSearchQuery.toLowerCase()) || 
                              a.university.toLowerCase().includes(alumniSearchQuery.toLowerCase()) || 
                              a.placement.toLowerCase().includes(alumniSearchQuery.toLowerCase());
        const matchesClass = alumniClassFilter === 'All' || a.classOf === alumniClassFilter;
        return matchesSearch && matchesClass;
      });

      const uniqueClasses = Array.from(new Set(alumni.map(a => a.classOf))).sort();

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-800 text-lg font-semibold">
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Alumni Record Count</span>
              <span className="text-3xl font-bold text-slate-900 font-sans block mt-1">{alumni.length} Graduates</span>
              <span className="text-[16px] text-emerald-600 font-semibold block mt-1">University placement rate: 89%</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Form 4 Class Average</span>
              <span className="text-3xl font-bold text-slate-900 font-sans block mt-1">B+ Mean</span>
              <span className="text-[16px] text-indigo-600 font-semibold block mt-1">Highest: straight A plain</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Cohort Years Active</span>
              <span className="text-3xl font-bold text-slate-900 font-sans block mt-1">2020 - 2026</span>
              <span className="text-[16px] text-slate-500 font-semibold block mt-1">Comprehensive profile dossier</span>
            </div>
          </div>

          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase font-sans">Graduated Cohorts Profiles</h3>
                <p className="text-[17px] text-slate-500 mt-0.5">Directory list of senior graduates and scholarship destination logs</p>
              </div>
              <button 
                onClick={() => setShowAddAlumniModal(true)}
                className="px-4 py-2 bg-[var(--color-secondary)] text-white text-lg font-bold rounded-xl hover:bg-[var(--color-secondary)] transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-[var(--color-secondary)]/15 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Graduate Profile
              </button>
            </div>

            {/* Live Audit filters bar */}
            <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search graduates by name or university..." 
                  value={alumniSearchQuery}
                  onChange={e => setAlumniSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-lg font-semibold text-slate-800"
                />
              </div>
              <div className="w-full sm:w-auto flex items-center gap-2">
                <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wider whitespace-nowrap">Filter Cohort</span>
                <select 
                  value={alumniClassFilter}
                  onChange={e => setAlumniClassFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold focus:outline-none text-slate-700 cursor-pointer"
                >
                  <option value="All">All Graduation Years</option>
                  {uniqueClasses.map(yr => (
                    <option key={yr} value={yr}>Class of {yr}</option>
                  ))}
                </select>
              </div>
            </div>

            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Alumni Graduate</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Graduation Class</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Final KCSE Grade</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Assigned University</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Course Placement Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-850">
                {filteredAlumni.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                      No graduated students meet filter conditions.
                    </td>
                  </tr>
                ) : (
                  filteredAlumni.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/20 font-semibold text-slate-800">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{a.name}</td>
                      <td className="px-5 py-3.5 text-slate-600">Class of {a.classOf}</td>
                      <td className="px-5 py-3.5 text-indigo-600">Mean Grade {a.finalGrade}</td>
                      <td className="px-5 py-3.5 text-slate-705">{a.university}</td>
                      <td className="px-5 py-3.5 tabular-nums text-[16px] text-slate-500">{a.placement}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ADD GRADUATE ALUMNI MODAL OVERLAY */}
          {showAddAlumniModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2 shadow-2xl text-slate-800 text-lg font-semibold">
                <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase">File Alumni Placement Certificate</h3>
                  <button onClick={() => setShowAddAlumniModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Graduate Alumnus Name</label>
                    <input 
                      type="text" 
                      value={newAlumniName}
                      onChange={e => setNewAlumniName(e.target.value)}
                      placeholder="e.g. Sophia Mutua"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Class Of (Year)</label>
                      <input 
                        type="text" 
                        value={newAlumniClassOf}
                        onChange={e => setNewAlumniClassOf(e.target.value)}
                        placeholder="e.g. 2026"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Final KCSE Mean</label>
                      <input 
                        type="text" 
                        value={newAlumniGrade}
                        onChange={e => setNewAlumniGrade(e.target.value)}
                        placeholder="e.g. A, B+"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold tabular-nums"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Assigned University</label>
                    <input 
                      type="text" 
                      value={newAlumniUni}
                      onChange={e => setNewAlumniUni(e.target.value)}
                      placeholder="e.g. University of Nairobi"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Placement Course</label>
                    <input 
                      type="text" 
                      value={newAlumniPlacement}
                      onChange={e => setNewAlumniPlacement(e.target.value)}
                      placeholder="e.g. Medicine & Surgery"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-[17px] pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setShowAddAlumniModal(false)}
                    className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!newAlumniName || !newAlumniPlacement) {
                        toast.error('Please input complete alumni detail logs.');
                        return;
                      }
                      const newItem = {
                        id: String(Date.now()),
                        name: newAlumniName,
                        classOf: newAlumniClassOf || '2026',
                        finalGrade: newAlumniGrade || 'B+',
                        university: newAlumniUni || 'Jomo Kenyatta University',
                        placement: newAlumniPlacement
                      };
                      setAlumni([newItem, ...alumni]);
                      toast.success(`Alumni directory card successfully archived for ${newAlumniName}!`);
                      setShowAddAlumniModal(false);
                      setNewAlumniName('');
                      setNewAlumniClassOf('2026');
                      setNewAlumniUni('');
                      setNewAlumniPlacement('');
                    }}
                    className="px-4 py-2 bg-[var(--color-secondary)] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Archive Alumnus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'classes':
      return <ClassesTab />;

    case 'subjects':
      return <SubjectsTab />;

    case 'curriculum':
      return <CurriculumTab />;

    case 'assessments':
      return <AssessmentsTab />;

    case 'results':
      return <ResultsTab />;

    case 'lms':
      return <LMSTab />;

    case 'ptc':
      return <PTCTab />;

    case 'finance_dash':
      return <FinanceDashTab />;

    case 'invoices':
      return <InvoicesTab />;

    case 'fee_structure':
      return <FeeStructureTab />;

    case 'leave_management':
      return <LeaveManagementTab />;

    case 'payroll':
      return <PayrollTab />;
    case 'transport_routes': {
      // Dynamic variables
      const activeTransitCount = transportAssignments.length;
      const totalTransitBill = transportAssignments.reduce((acc, t) => acc + t.chargedAmount, 0);
      const activeVehiclesCount = vehicles.filter(v => v.status === 'Active').length;
      const totalCapacitySeat = vehicles.reduce((acc, v) => acc + v.capacity, 0);

      // Search & Filters
      const filteredAssignments = transportAssignments.filter(ta => {
        const matchesSearch = ta.studentName.toLowerCase().includes(transportSearchQuery.toLowerCase()) || 
                             ta.studentId.toLowerCase().includes(transportSearchQuery.toLowerCase());
        const matchesRoute = transportRouteFilter === 'All' || ta.route.includes(transportRouteFilter);
        return matchesSearch && matchesRoute;
      });

      return (
        <div className="space-y-6 text-slate-800 text-lg font-semibold">
          {/* HUD Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Transit Riders</span>
              <span className="text-3xl font-bold text-[var(--color-secondary)] font-sans block mt-1">{activeTransitCount} Candidates</span>
              <span className="text-[16px] text-indigo-600 font-semibold block mt-1">Structured active riders</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block font-sans">Gross Transit Ledger Revenue</span>
              <span className="text-3xl font-bold text-emerald-600 font-sans block mt-1">KES {totalTransitBill.toLocaleString()}</span>
              <span className="text-[16px] text-emerald-600 font-semibold block mt-1">Term logistics invoice load</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Operational Fleet Status</span>
              <span className="text-3xl font-bold text-indigo-600 font-sans block mt-1">{activeVehiclesCount} / {vehicles.length} Active</span>
              <span className="text-[16px] text-indigo-500 font-semibold block mt-1">Available school vehicles</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Cumulative Seating Capacity</span>
              <span className="text-3xl font-bold text-amber-600 font-sans block mt-1">{totalCapacitySeat} Seats</span>
              <span className="text-[16px] text-amber-500 font-semibold block mt-1">Roster limit threshold</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment Form & Linkage to Finance */}
            <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm space-y-2 lg:col-span-1 self-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase">Route Assignment Billing</h3>
                <p className="text-[16px] text-slate-400 mt-1">Assign candidates to active vehicles and post structural transit fees directly to Ledger invoices</p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[15px] text-slate-500 uppercase mb-1.5 font-bold">Select Candidate Roster</label>
                  <select id="transport-student-assign" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer focus:outline-none">
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[15px] text-slate-500 uppercase mb-1.5 font-bold">Select Logistics Route</label>
                  <select id="transport-route-assign" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer focus:outline-none">
                    {routesList.map(r => (
                      <option key={r.id} value={r.route}>{r.route} ({r.price})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    const studEl = document.getElementById('transport-student-assign') as HTMLSelectElement;
                    const routeEl = document.getElementById('transport-route-assign') as HTMLSelectElement;
                    if (studEl && routeEl) {
                      const studId = studEl.value;
                      const studentName = students.find(s => s.id === studId)?.name || 'Candidate';
                      const route = routeEl.value;
                      
                      const cost = route.includes('Town') ? 4500 : route.includes('Ring') ? 6000 : 7500;
                      const newAssign = {
                        id: 'ta-' + Date.now(),
                        studentName,
                        studentId: studId,
                        route,
                        chargedAmount: cost,
                        status: 'Billed to Finance'
                      };
                      setTransportAssignments([newAssign, ...transportAssignments]);
                      toast.success(`Invoiced KES ${cost.toLocaleString()} transport fee statement. Posted directly to Candidate Ledger account.`);
                    }
                  }}
                  className="w-full py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white rounded-xl uppercase font-bold text-[16px] transition shadow-md shadow-[var(--color-secondary)]/10 cursor-pointer text-center"
                >
                  Bill Transport Fee to Ledger
                </button>
              </div>
            </div>

            {/* Active Assignments & Fleet details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assignments trail */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase">Student Transport Ledgers</h3>
                    <p className="text-[17px] text-slate-500 mt-1">Audit active student route charges and billing dispatchments</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Search student name or ADM number..." 
                      value={transportSearchQuery}
                      onChange={e => setTransportSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-base font-semibold text-slate-800"
                    />
                  </div>
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wider whitespace-nowrap">Route Filter</span>
                    <select 
                      value={transportRouteFilter}
                      onChange={e => setTransportRouteFilter(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold focus:outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="All">All Routes</option>
                      <option value="Route A">Route A</option>
                      <option value="Route B">Route B</option>
                      <option value="Route C">Route C</option>
                    </select>
                  </div>
                </div>

                <table className="w-full text-left font-sans text-lg border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[15px] uppercase">
                      <th className="px-5 py-3">Candidate Name</th>
                      <th className="px-5 py-3">Transport Route</th>
                      <th className="px-5 py-3">Invoiced Cost</th>
                      <th className="px-5 py-3 text-right">Ledger Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredAssignments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                          No transit ledger assignees found for the selected search query.
                        </td>
                      </tr>
                    ) : (
                      filteredAssignments.map(ta => (
                        <tr key={ta.id} className="hover:bg-slate-50/30">
                          <td className="px-5 py-3 font-bold text-slate-900">{ta.studentName} <span className="text-base text-slate-400 font-semibold block">{ta.studentId}</span></td>
                          <td className="px-5 py-3 text-base text-slate-650 font-bold">{ta.route}</td>
                          <td className="px-5 py-3 tabular-nums text-[var(--color-secondary)]">KES {ta.chargedAmount.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-[14px] uppercase font-bold tracking-wide">
                              {ta.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => {
                                setTransportAssignments(prev => prev.filter(t => t.id !== ta.id));
                                toast.success(`Revoked transport logs for ${ta.studentName}.`);
                              }}
                              className="text-slate-400 hover:text-rose-600 transition cursor-pointer font-bold text-base"
                              title="Delete route billing"
                            >
                              <Trash className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Vehicles registry */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase">School Vehicle Fleet Registry</h3>
                    <p className="text-[16px] text-slate-500 mt-1">Manage active transport buses, shuttles and mechanical service logs</p>
                  </div>
                  <button 
                    onClick={() => {
                      setNewVehiclePlate('');
                      setNewVehicleBrand('Isuzu Bus');
                      setNewVehicleCapacity(52);
                      setShowAddVehicleModal(true);
                    }}
                    className="px-3 py-1.5 bg-[var(--color-secondary)] text-white hover:bg-[var(--color-primary)] transition text-base font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Vehicle
                  </button>
                </div>
                <table className="w-full text-left font-sans text-lg border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[15px] uppercase">
                      <th className="px-5 py-3">Plate Registration</th>
                      <th className="px-5 py-3">Vehicle Model</th>
                      <th className="px-5 py-3">Bed Capacity</th>
                      <th className="px-5 py-3 text-center">Roster Status</th>
                      <th className="px-5 py-3 text-right">Action Toggles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {vehicles.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/10">
                        <td className="px-5 py-3.5 tabular-nums text-indigo-700 font-bold">{v.plate}</td>
                        <td className="px-5 py-3.5 text-slate-900 font-bold">{v.brand}</td>
                        <td className="px-5 py-3.5 tabular-nums text-slate-600">{v.capacity} Passengers</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[14px] font-bold border uppercase tracking-wider ${v.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-sans">
                          <button
                            onClick={() => {
                              const nextStatus = v.status === 'Active' ? 'Maintenance' : 'Active';
                              setVehicles(prev => prev.map(item => item.id === v.id ? { ...item, status: nextStatus } : item));
                              toast(`Updated fleet status for ${v.plate} to block: "${nextStatus}".`);
                            }}
                            className={`px-2 py-1 text-base rounded-lg transition font-bold cursor-pointer ${v.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                          >
                            Set {v.status === 'Active' ? 'Maintenance' : 'Active'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Drivers profile */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase">Transit Operations Drivers</h3>
                    <p className="text-[16px] text-slate-400">Assigned authorized school bus captains & licensing records</p>
                  </div>
                  <button 
                    onClick={() => {
                      const name = prompt("Enter Driver Full Name:");
                      const DL = prompt("Enter driver license code (e.g. DL-B10123):");
                      const phone = prompt("Enter operator phone connection:");
                      if (name && DL && phone) {
                        setDrivers([...drivers, { id: 'd-' + Date.now(), name, license: DL, phone }]);
                        toast.success(`Successfully enrolled driver ${name} to transit logs roster!`);
                      }
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 transition text-base font-bold rounded-xl cursor-pointer"
                  >
                    + Contract Driver
                  </button>
                </div>
                <table className="w-full text-left font-sans text-lg border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[15px] uppercase">
                      <th className="px-5 py-2.5">Operator Driver</th>
                      <th className="px-5 py-2.5">DL License Class code</th>
                      <th className="px-5 py-2.5">Phone contact</th>
                      <th className="px-5 py-2.5 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {drivers.map(d => (
                      <tr key={d.id}>
                        <td className="px-5 py-3 font-bold text-slate-900">{d.name}</td>
                        <td className="px-5 py-3 tabular-nums text-slate-600 text-base">{d.license}</td>
                        <td className="px-5 py-3 tabular-nums text-slate-600 text-base">{d.phone}</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => {
                              setDrivers(prev => prev.filter(driver => driver.id !== d.id));
                              toast(`Terminated operator driver contract files for ${d.name}`);
                            }}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* ADD VEHICLE MODAL */}
          {showAddVehicleModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2 shadow-2xl text-slate-800 text-lg font-semibold">
                <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase">Enroll School Vehicle</h3>
                  <button onClick={() => setShowAddVehicleModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Plate Registration No.</label>
                    <input 
                      type="text"
                      placeholder="e.g. KCD 123Z"
                      value={newVehiclePlate}
                      onChange={e => setNewVehiclePlate(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-900 tabular-nums text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Vehicle Brand / Model</label>
                    <select 
                      value={newVehicleBrand}
                      onChange={e => setNewVehicleBrand(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer focus:outline-none text-slate-700"
                    >
                      <option value="Isuzu Bus (52 Seats)">Isuzu Bus (52 Seats)</option>
                      <option value="Toyota Minibus (33 Seats)">Toyota Minibus (33 Seats)</option>
                      <option value="Nissan Shuttle (14 Seats)">Nissan Shuttle (14 Seats)</option>
                      <option value="Toyota Hiace Coach (16 Seats)">Toyota Hiace Coach (16 Seats)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Seating Capacity</label>
                    <input 
                      type="number"
                      value={newVehicleCapacity}
                      onChange={e => setNewVehicleCapacity(Number(e.target.value) || 14)}
                      className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none font-bold text-indigo-600 tabular-nums"
                      min="5"
                      max="100"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-[17px] pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setShowAddVehicleModal(false)}
                    className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!newVehiclePlate.trim() || newVehiclePlate.length < 5) {
                        toast.error('Please specify a valid Plate registration number.');
                        return;
                      }

                      setVehicles([
                        ...vehicles,
                        {
                          id: 'v-' + Date.now(),
                          plate: newVehiclePlate,
                          brand: newVehicleBrand,
                          capacity: newVehicleCapacity,
                          status: 'Active'
                        }
                      ]);

                      toast.success(`Vehicle ${newVehiclePlate} added to operational fleet!`);
                      setShowAddVehicleModal(false);
                    }}
                    className="px-4 py-2 bg-[var(--color-secondary)] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Verify & Enroll
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'hostel': {
      // Dynamic calculations
      const totalBoardersCount = bedAssignments.length;
      const totalBoardingRevenues = bedAssignments.reduce((acc, b) => acc + b.charge, 0);
      const totalBedsCapacity = dormsList.reduce((acc, d) => acc + d.capacity, 0);
      const averageOccupancyPct = totalBedsCapacity > 0 ? Math.round((dormsList.reduce((acc, d) => acc + d.occupied, 0) / totalBedsCapacity) * 100) : 0;

      // Filter active resident assignments
      const filteredBedAssignments = bedAssignments.filter(ba => {
        const matchesQuery = ba.studentName.toLowerCase().includes(hostelSearchQuery.toLowerCase()) ||
                             ba.studentId.toLowerCase().includes(hostelSearchQuery.toLowerCase());
        const matchesDorm = hostelDormFilter === 'All' || ba.hostel === hostelDormFilter;
        return matchesQuery && matchesDorm;
      });

      return (
        <div className="space-y-6 text-slate-800 text-lg font-semibold">
          {/* HUD Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Resident Boarders</span>
              <span className="text-3xl font-bold text-[var(--color-secondary)] font-sans block mt-1">{totalBoardersCount} Active</span>
              <span className="text-[16px] text-indigo-600 font-semibold block mt-1">Allocated active beds</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Total Boarding Invoices</span>
              <span className="text-3xl font-bold text-emerald-600 font-sans block mt-1">KES {totalBoardingRevenues.toLocaleString()}</span>
              <span className="text-[16px] text-emerald-600 font-semibold block mt-1">Structured resident levies</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Boarding Load capacity</span>
              <span className="text-3xl font-bold text-indigo-600 font-sans block mt-1">{averageOccupancyPct}% Capacity</span>
              <span className="text-[16px] text-indigo-500 font-semibold block mt-1">Total {totalBedsCapacity} beds base</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
              <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Total Dorm Wings</span>
              <span className="text-3xl font-bold text-amber-600 font-sans block mt-1">{dormsList.length} Active Houses</span>
              <span className="text-[16px] text-amber-500 font-semibold block mt-1">Governed by student captains</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Bed Assignor Form */}
            <div className="bg-white p-1.5 rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm space-y-2 lg:col-span-1 self-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase">Hostel Bed Assignment Billing</h3>
                <p className="text-[16px] text-slate-400 mt-1">Allocate dormitory resources to incoming boarders and post standard boarding levies directly to student ledger accounts</p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[15px] text-slate-500 uppercase mb-1.5 font-bold">Select Candidate Roster</label>
                  <select id="boarding-student-assign" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer focus:outline-none">
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[15px] text-slate-500 uppercase mb-1.5 font-bold">Select Hosteling House</label>
                  <select id="boarding-hostel-assign" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer focus:outline-none">
                    {dormsList.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[15px] text-slate-500 uppercase mb-1 font-bold">Room No.</label>
                    <input id="boarding-room-assign" type="text" placeholder="Room 102" defaultValue="Room 101" className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl tabular-nums focus:outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-[15px] text-slate-500 uppercase mb-1 font-bold">Bed Code</label>
                    <input id="boarding-bed-assign" type="text" placeholder="Bed B-3" defaultValue="Bed B-1" className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl tabular-nums focus:outline-none font-bold" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const studEl = document.getElementById('boarding-student-assign') as HTMLSelectElement;
                    const hostelEl = document.getElementById('boarding-hostel-assign') as HTMLSelectElement;
                    const roomEl = document.getElementById('boarding-room-assign') as HTMLInputElement;
                    const bedEl = document.getElementById('boarding-bed-assign') as HTMLInputElement;
                    if (studEl && hostelEl && roomEl && bedEl) {
                      const studId = studEl.value;
                      const studentName = students.find(s => s.id === studId)?.name || 'Candidate';
                      const hostel = hostelEl.value;
                      const room = roomEl.value || 'Room 101';
                      const bedNo = bedEl.value || 'Bed B-1';
                      
                      const newAssign = {
                        id: 'ba-' + Date.now(),
                        studentName,
                        studentId: studId,
                        hostel,
                        room,
                        bedNo,
                        charge: 18000,
                        status: 'Billed to Finance'
                      };
                      setBedAssignments([newAssign, ...bedAssignments]);
                      toast.success(`Invoiced KES ${newAssign.charge.toLocaleString()} boarding service fee. Posted successfully to Candidate Ledger account.`);
                    }
                  }}
                  className="w-full py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white rounded-xl uppercase font-bold text-[16px] transition shadow-md shadow-[var(--color-secondary)]/10 cursor-pointer text-center"
                >
                  Bill Boarding Fee to Ledger
                </button>
              </div>
            </div>

            {/* active lists & setup directories */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Occupied bed assignments display list */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase">Active Bed Occupancy Assignments</h3>
                    <p className="text-[17px] text-slate-500 mt-1">Registered bed allocation state & hostel billing audits</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Search boarder student name or ADM..." 
                      value={hostelSearchQuery}
                      onChange={e => setHostelSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-base font-semibold text-slate-800"
                    />
                  </div>
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wider whitespace-nowrap">Dorm Wing filter</span>
                    <select 
                      value={hostelDormFilter}
                      onChange={e => setHostelDormFilter(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold focus:outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="All">All Houses</option>
                      {dormsList.map(item => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <table className="w-full text-left font-sans text-lg border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[15px] uppercase">
                      <th className="px-5 py-3">Resident Candidate</th>
                      <th className="px-5 py-3">Dorm House</th>
                      <th className="px-5 py-3">Room & Bed No.</th>
                      <th className="px-5 py-3">Levy Cost</th>
                      <th className="px-5 py-3 text-right">Ledger Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredBedAssignments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                          No active boarders match the chosen filters.
                        </td>
                      </tr>
                    ) : (
                      filteredBedAssignments.map(ba => (
                        <tr key={ba.id} className="hover:bg-slate-50/30">
                          <td className="px-5 py-3 font-bold text-slate-900">{ba.studentName} <span className="text-base text-slate-400 block font-semibold">{ba.studentId}</span></td>
                          <td className="px-5 py-3 text-slate-700 font-bold">{ba.hostel}</td>
                          <td className="px-5 py-3 tabular-nums text-purple-700 font-bold">{ba.room} • {ba.bedNo}</td>
                          <td className="px-5 py-3 tabular-nums text-[var(--color-secondary)]">KES {ba.charge.toLocaleString()}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-[14px] uppercase font-bold tracking-wide">
                                {ba.status}
                              </span>
                              <button
                                onClick={() => {
                                  setBedAssignments(prev => prev.filter(b => b.id !== ba.id));
                                  toast.success(`Checked out ${ba.studentName} from ${ba.hostel} Room ${ba.room}.`);
                                }}
                                className="p-1 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded transition cursor-pointer"
                                title="Check out resident student"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Room setup list */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase">Room-by-Room Bed Setup Config</h3>
                    <p className="text-[16px] text-slate-500 mt-1">Configure individual rooms and available bedding capacities per dorm wing</p>
                  </div>
                  <button 
                    onClick={() => {
                      setNewRoomNo('');
                      setNewRoomBeds(8);
                      setShowAddDormRoomModal(true);
                    }}
                    className="px-3 py-1.5 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-bold rounded-xl text-base flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Configure Room
                  </button>
                </div>
                <table className="w-full text-left font-sans text-lg border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[15px] uppercase">
                      <th className="px-5 py-3">Hostel Dorm Wing</th>
                      <th className="px-5 py-3">Configured Room</th>
                      <th className="px-5 py-3">Available Beds Capacity</th>
                      <th className="px-5 py-3 text-right">Active Occupancy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {roomsSetup.map(rs => (
                      <tr key={rs.id} className="hover:bg-slate-50/10">
                        <td className="px-5 py-3 font-bold text-slate-900">{rs.hostel}</td>
                        <td className="px-5 py-3 tabular-nums text-slate-600">{rs.roomNo}</td>
                        <td className="px-5 py-3 tabular-nums">{rs.bedsCount} Beds Available</td>
                        <td className="px-5 py-3 text-right tabular-nums text-indigo-600 font-bold">{rs.occupied} / {rs.bedsCount} Occupied ({Math.round((rs.occupied / rs.bedsCount)*100)}%)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* General Dorm summaries */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm font-sans">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase">Boarding Dorms Master Summary</h3>
                    <p className="text-[16px] text-slate-400 mt-1">Dorm wing administrator patrons, house captains and occupancy ceilings</p>
                  </div>
                  <button
                    onClick={() => {
                      const name = prompt("Enter Dorm Wing Title Name (e.g. Mount Elgon House):");
                      const patron = prompt("Enter Patron Instructor Name:");
                      const captain = prompt("Enter Student House Captain:");
                      const cap = Number(prompt("Enter Total Bed Capacity Count (e.g. 120):")) || 100;
                      if (name && patron && captain) {
                        setDormsList([...dormsList, { id: 'd-' + Date.now(), name, master: patron, captain, capacity: cap, occupied: 0 }]);
                        toast.success(`Dorm Wing "${name}" initialized successfully under Administration Patron ${patron}!`);
                      }
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl text-base cursor-pointer"
                  >
                    + Register Dorm Wing
                  </button>
                </div>
                <table className="w-full text-left text-lg border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[15px] uppercase">
                      <th className="px-5 py-2.5">Dorm Wing Name</th>
                      <th className="px-5 py-2.5">Master Patron</th>
                      <th className="px-5 py-2.5">Student Captain</th>
                      <th className="px-5 py-2.5">Total Capacity</th>
                      <th className="px-5 py-2.5 text-right">Occupancy Loading</th>
                      <th className="px-5 py-2.5 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {dormsList.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50/10">
                        <td className="px-5 py-3 font-bold text-slate-900">{d.name}</td>
                        <td className="px-5 py-3 text-slate-650">{d.master}</td>
                        <td className="px-5 py-3 text-indigo-700 font-bold">{d.captain}</td>
                        <td className="px-5 py-3 tabular-nums text-slate-500">{d.capacity} Beds</td>
                        <td className="px-5 py-3 text-right tabular-nums font-bold text-slate-900">
                          {d.occupied} / {d.capacity} ({Math.round((d.occupied / d.capacity) * 100)}%)
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => {
                              setDormsList(prev => prev.filter(dorm => dorm.id !== d.id));
                              toast(`Closed dorm wing administration directory file for ${d.name}`);
                            }}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* ADD DORM ROOM MODAL */}
          {showAddDormRoomModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2 shadow-2xl text-slate-800 text-lg font-semibold">
                <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase font-sans">Setup Dorm Wing Room</h3>
                  <button onClick={() => setShowAddDormRoomModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Select Dorm House Link</label>
                    <select 
                      value={newRoomHostel}
                      onChange={e => setNewRoomHostel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer focus:outline-none text-slate-700"
                    >
                      {dormsList.map(subDorm => (
                        <option key={subDorm.id} value={subDorm.name}>{subDorm.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Room Setup Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. Room G-15 or Room 204"
                      value={newRoomNo}
                      onChange={e => setNewRoomNo(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-900 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Available Bed Count</label>
                    <input 
                      type="number"
                      value={newRoomBeds}
                      onChange={e => setNewRoomBeds(Number(e.target.value) || 8)}
                      className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none font-bold text-[var(--color-secondary)] tabular-nums text-center"
                      min="1"
                      max="40"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-[17px] pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setShowAddDormRoomModal(false)}
                    className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!newRoomNo.trim()) {
                        toast.error('Please specify a valid Room Name code.');
                        return;
                      }

                      setRoomsSetup([
                        ...roomsSetup,
                        {
                          id: 'r-' + Date.now(),
                          hostel: newRoomHostel,
                          roomNo: newRoomNo,
                          bedsCount: newRoomBeds,
                          occupied: 0
                        }
                      ]);

                      toast.success(`Dormitory Config updated for ${newRoomHostel} ${newRoomNo}!`);
                      setShowAddDormRoomModal(false);
                    }}
                    className="px-4 py-2 bg-[var(--color-secondary)] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Confirm Configuration
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'inventory':
      return (
        <div className="space-y-6">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900 uppercase">Core School Assets & Inventories</h3>
            </div>
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Inventory Item</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Item Asset Code ID</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Allocated Location</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Estimated Value</th>
                  <th className="px-5 py-3 text-right uppercase text-[16px]">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schoolAssets.map(a => (
                  <tr key={a.id}>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{a.name}</td>
                    <td className="px-5 py-3.5 tabular-nums text-indigo-600">{a.code}</td>
                    <td className="px-5 py-3.5 text-slate-600">{a.location}</td>
                    <td className="px-5 py-3.5 tabular-nums text-slate-800">{a.value}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[15px] uppercase tracking-wider border ${a.status.includes('Operational') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-rose-200'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'procurement':
      return (
        <div className="space-y-6">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900 uppercase">Purchase Orders Procurement Queue</h3>
            </div>
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Purchase Ref.</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Assigned Supplier Vendor</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Item Description Requirements</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Amount</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Issue Date</th>
                  <th className="px-5 py-3 text-right uppercase text-[16px]">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {procurementList.map(p => (
                  <tr key={p.id}>
                    <td className="px-5 py-3.5 tabular-nums font-bold text-slate-500">{p.id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{p.supplier}</td>
                    <td className="px-5 py-3.5 text-slate-700">{p.item}</td>
                    <td className="px-5 py-3.5 tabular-nums text-indigo-600 font-bold">{p.amount}</td>
                    <td className="px-5 py-3.5 tabular-nums text-slate-500">{p.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[15px] uppercase tracking-wider border ${p.status === 'Approved' || p.status === 'Dispatched' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'supplier_management':
      return (
        <div className="space-y-6">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 uppercase">Supplier Registry Hub</h3>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-base font-bold uppercase tracking-wider hover:bg-indigo-700 transition">
                + Register New Supplier
              </button>
            </div>
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Supplier Code</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Business Name</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Service Category</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Primary Contact</th>
                  <th className="px-5 py-3 text-right uppercase text-[16px]">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierList.map(s => (
                  <tr key={s.id}>
                    <td className="px-5 py-3.5 tabular-nums font-bold text-slate-500">{s.id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{s.name}</td>
                    <td className="px-5 py-3.5 text-indigo-700 font-bold text-[16px] uppercase">{s.category}</td>
                    <td className="px-5 py-3.5 tabular-nums text-slate-600">{s.contact}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[15px] uppercase tracking-wider border ${s.status.includes('Active') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'vendor_management':
      return (
        <div className="space-y-6">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 uppercase">Vendor SLA & Contracts</h3>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-base font-bold uppercase tracking-wider hover:bg-indigo-700 transition">
                + New Vendor Agreement
              </button>
            </div>
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Vendor Code</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Third-Party Vendor</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Provided Service</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Contract Expiry Date</th>
                  <th className="px-5 py-3 text-right uppercase text-[16px]">Satisfaction Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendorList.map(v => (
                  <tr key={v.id}>
                    <td className="px-5 py-3.5 tabular-nums font-bold text-slate-500">{v.id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{v.vendorName}</td>
                    <td className="px-5 py-3.5 text-slate-700">{v.service}</td>
                    <td className="px-5 py-3.5 tabular-nums text-rose-600 font-bold">{v.contractExpiry}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-amber-600 font-bold">
                      {v.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'canteen':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl shadow-sm space-y-2">
              <h3 className="text-xl font-bold text-slate-900 uppercase">Canteen Items Menu</h3>
              <div className="grid grid-cols-2 gap-3">
                {canteenItems.map(item => (
                  <button 
                    key={item.name}
                    onClick={() => addToCart(item)}
                    className="p-4 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-3xl text-left space-y-2 cursor-pointer transition select-none"
                  >
                    <span className="text-3xl block">{item.icon}</span>
                    <h4 className="text-lg font-bold text-slate-900 leading-tight">{item.name}</h4>
                    <span className="text-lg text-indigo-600 font-bold tabular-nums">KES {item.price}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                  <h3 className="text-xl font-bold text-slate-900 uppercase">Smart-card Checkout POS</h3>
                  <button onClick={clearCart} className="text-[16px] uppercase font-bold text-rose-500 hover:underline">Clear Basket</button>
                </div>
                
                {canteenCart.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-lg">
                    Canteen smart check-out basket is empty. Select menu items to compile purchase coupons.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {canteenCart.map(c => (
                      <div key={c.name} className="flex justify-between items-center text-lg p-2.5 bg-slate-50 rounded-2xl border border-slate-150">
                        <div>
                          <span className="font-bold text-slate-900">{c.name}</span>
                          <span className="text-[16px] text-slate-400 font-bold block">Rate: KES {c.price}</span>
                        </div>
                        <span className="font-bold text-indigo-600">{c.qty} Units (KES {c.qty * c.price})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {canteenCart.length > 0 && (
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex justify-between items-center text-xl font-bold text-slate-950">
                    <span>Total Purchase Due:</span>
                    <span className="text-3xl tabular-nums text-[var(--color-secondary)]">KES {canteenCart.reduce((s, c) => s + c.price * c.qty, 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[16px] uppercase tracking-wider text-slate-400 font-bold">Smart card Student ID selection</label>
                    <select className="w-full p-2 text-lg rounded-xl focus:ring-1 focus:ring-[var(--color-secondary)]">
                      <option>Douglas Omari (ADM-2020-001)</option>
                      <option>Emily Wanjala (ADM-2023-002)</option>
                      <option>Kevin Kiprop (ADM-2041-003)</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handlePurchase}
                    className="w-full py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white rounded-2xl font-bold uppercase transition block text-center cursor-pointer shadow-md shadow-[var(--color-secondary)]/15 text-lg tracking-wider"
                  >
                    Confirm POSsmart Purchase
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'health':
      return (
        <div className="space-y-6">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900 uppercase">Student Health Deck & Clinic Visits</h3>
              <p className="text-[17px] text-slate-500 mt-1">Live logs of medication logs and clinic emergency alerts</p>
            </div>
            <div className="p-5 flex flex-col md:flex-row gap-4 items-end bg-white border-b border-slate-200">
               <div className="flex-1 w-full">
                <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Student / Patient</label>
                <select id="hl-student" className="w-full px-1.5 py-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl text-lg font-semibold font-sans cursor-pointer">
                  <option value="">-- Choose Patient --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Ailment / Symptoms</label>
                <input type="text" id="hl-comp" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-lg font-semibold" placeholder="e.g. Headache / Cold" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[15px] font-bold text-slate-400 uppercase mb-1">Treatment Plan</label>
                <input type="text" id="hl-act" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-lg font-semibold" placeholder="e.g. Paracetamol 2X3" />
              </div>
              <button 
                onClick={() => {
                  const studentSelect = document.getElementById('hl-student') as HTMLSelectElement;
                  const complaint = document.getElementById('hl-comp') as HTMLInputElement;
                  const action = document.getElementById('hl-act') as HTMLInputElement;
                  if (studentSelect?.value && complaint?.value) {
                    setClinicLogs([{
                      id: String(Date.now()),
                      student: studentSelect.value,
                      complaint: complaint.value,
                      action: action?.value || 'Rest in clinic',
                      date: new Date().toISOString().split('T')[0],
                      status: 'Under Observation'
                    }, ...clinicLogs]);
                    studentSelect.value=''; complaint.value=''; action.value='';
                    toast.success('Patient log filed successfully.');
                  } else {
                    toast.error('Patient Name and Symptoms must be filled');
                  }
                }}
                className="px-6 py-2 bg-[var(--color-secondary)] text-white text-lg font-bold rounded-xl hover:bg-[var(--color-primary)] transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Log Medical Visit
              </button>
            </div>
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400">
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Patient student</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Diagnose / symptoms Complaint</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Action / Medicine Administered</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Visit Date</th>
                  <th className="px-5 py-3 font-semibold uppercase text-[16px]">Log Status</th>
                  <th className="px-5 py-3 text-right uppercase text-[16px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-850">
                {clinicLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/20 font-sans transition text-[17px]">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{l.student}</td>
                    <td className="px-5 py-3.5 text-slate-700">{l.complaint}</td>
                    <td className="px-5 py-3.5 text-slate-600 italic font-medium">{l.action}</td>
                    <td className="px-5 py-3.5 tabular-nums text-slate-500">{l.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[15px] uppercase tracking-wider border ${l.status === 'Discharged' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium">
                      {l.status !== 'Discharged' ? (
                        <button
                          onClick={() => {
                            setClinicLogs(prev => prev.map(cl => cl.id === l.id ? { ...cl, status: 'Discharged' } : cl));
                            toast.success(`Discharged ${l.student}.`);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-600 hover:text-white border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] hover:border-emerald-600 text-slate-700 font-bold rounded-lg text-base transition cursor-pointer"
                        >
                          Discharge Patient
                        </button>
                      ) : (
                        <span className="text-[16px] text-slate-400 font-bold uppercase inline-flex items-center gap-1 select-none">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Discharged
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-16 text-center text-slate-400 text-lg">
          Select an option from the sidebar to view detailed, interactive modular analytics.
        </div>
      );
  }
}
