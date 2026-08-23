import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Search, 
  FileText, 
  Download, 
  Library, 
  BookOpen, 
  Presentation, 
  Video, 
  Trash2, 
  Calendar, 
  Award, 
  ExternalLink, 
  Star, 
  Users, 
  CheckCircle2, 
  Clock, 
  Check, 
  Send, 
  AlertCircle, 
  Laptop,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

// Interfaces for custom high-logic LMS
interface LearningResource {
  id: string;
  title: string;
  subject: string;
  format: 'PDF Document' | 'External Video' | 'ZIP Archive' | 'Presentation Slides';
  size: string;
  downloads: number;
  ratingCount: number;
  averageRating: number;
  uploadedBy: string;
  dateAdded: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  points: number;
  instructions: string;
  submissionCount: number;
  status: 'Draft' | 'Published' | 'Grading Completed';
}

interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentName: string;
  submittedAt: string;
  studentFile: string;
  grade?: number;
  feedback?: string;
  status: 'Pending Review' | 'Graded';
}

interface LiveMeeting {
  id: string;
  title: string;
  subject: string;
  time: string;
  duration: string;
  platform: 'Google Meet' | 'Microsoft Teams';
  link: string;
  status: 'Upcoming' | 'Live Now' | 'Completed';
  attendees?: number;
}

interface SubjectCurriculum {
  id: string;
  subject: string;
  chapters: {
    id: string;
    title: string;
    objective: string;
    isCompleted: boolean;
  }[];
}

export function LMSTab() {
  // Navigation tabs of LMS Subsystem
  const [activeSubTab, setActiveSubTab] = useState<'library' | 'assignments' | 'live_classes' | 'curriculum'>('library');

  // --- 1. LEARNING RESOURCES STATE ENGINE ---
  const [resources, setResources] = useState<LearningResource[]>([
    { 
      id: 'L-1', 
      title: 'Advanced Calculus Formula Sheet & Limit Proofs', 
      subject: 'Mathematics', 
      format: 'PDF Document', 
      size: '2.4 MB', 
      downloads: 154, 
      ratingCount: 18, 
      averageRating: 4.8, 
      uploadedBy: 'Dr. Jane Mwangi', 
      dateAdded: '2026-05-15' 
    },
    { 
      id: 'L-2', 
      title: 'Genetics Comprehension Revision Guide for KCSE Candidates', 
      subject: 'Biology', 
      format: 'PDF Document', 
      size: '8.1 MB', 
      downloads: 201, 
      ratingCount: 25, 
      averageRating: 4.9, 
      uploadedBy: 'Mr. David Kiprop', 
      dateAdded: '2026-05-20' 
    },
    { 
      id: 'L-3', 
      title: 'Esterification Process Mechanism & Chemical Equilibrium Models', 
      subject: 'Chemistry', 
      format: 'External Video', 
      size: '14 mins', 
      downloads: 92, 
      ratingCount: 12, 
      averageRating: 4.6, 
      uploadedBy: 'Mrs. Linda Atieno', 
      dateAdded: '2026-05-22' 
    },
    { 
      id: 'L-4', 
      title: 'Past Papers Compilation with Answers (2020 - 2025)', 
      subject: 'All Subjects', 
      format: 'ZIP Archive', 
      size: '18.4 MB', 
      downloads: 310, 
      ratingCount: 42, 
      averageRating: 5.0, 
      uploadedBy: 'Head of Academics', 
      dateAdded: '2026-06-01' 
    },
    {
      id: 'L-5',
      title: 'Climatic Zones of East Africa: Physical Geography Slides',
      subject: 'Geography',
      format: 'Presentation Slides',
      size: '4.8 MB',
      downloads: 67,
      ratingCount: 7,
      averageRating: 4.3,
      uploadedBy: 'Mr. Julius Otieno',
      dateAdded: '2026-06-03'
    }
  ]);

  // Search & Filter Study Content
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // File Upload Animation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Mathematics');
  const [uploadFormat, setUploadFormat] = useState<'PDF Document' | 'External Video' | 'ZIP Archive' | 'Presentation Slides'>('PDF Document');

  // Interactive Ratings state map
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  // --- 2. ASSIGNMENTS STATE ENGINE ---
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'A-1',
      title: 'Calculus Concepts Proof of Key Theorems',
      subject: 'Mathematics',
      dueDate: '2026-06-12',
      points: 100,
      instructions: 'Submit a detailed step-by-step proof of L’Hôpital’s Rule and the Mean Value Theorem. PDF format only.',
      submissionCount: 3,
      status: 'Published'
    },
    {
      id: 'A-2',
      title: 'Genetics Heredity Punnett Square Lab Report',
      subject: 'Biology',
      dueDate: '2026-06-15',
      points: 50,
      instructions: 'Construct pedigrees based on the family inheritance charts provided. Submit detailed written reflections.',
      submissionCount: 2,
      status: 'Published'
    },
    {
      id: 'A-3',
      title: 'Stoichiometry Revision Homework #4',
      subject: 'Chemistry',
      dueDate: '2026-06-05',
      points: 30,
      instructions: 'Answer chemical equilibrium calculations from Section 3. Upload sheet of scrap paper with your working mechanics.',
      submissionCount: 3,
      status: 'Grading Completed'
    }
  ]);

  // Selected assignment for Grading Dashboard View
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>('A-1');

  // Student Submissions database simulation
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: 'S-101',
      assignmentId: 'A-1',
      studentName: 'Fatima Kamau',
      submittedAt: 'Yesterday, 4:15 PM',
      studentFile: 'Fatima_Kamau_Calculus_Proofs.pdf',
      grade: 95,
      feedback: 'Excellent work Fatima, your proofs are rigorous and very neat!',
      status: 'Graded'
    },
    {
      id: 'S-102',
      assignmentId: 'A-1',
      studentName: 'Liam Kiprop',
      submittedAt: 'Today, 9:30 AM',
      studentFile: 'Kiprop_MeanValueTheorem.pdf',
      status: 'Pending Review'
    },
    {
      id: 'S-103',
      assignmentId: 'A-1',
      studentName: 'Mary Atieno',
      submittedAt: 'Today, 11:15 AM',
      studentFile: 'Atieno_LHopital_Proofs.pdf',
      status: 'Pending Review'
    },
    {
      id: 'S-201',
      assignmentId: 'A-2',
      studentName: 'Fatima Kamau',
      submittedAt: 'Yesterday, 5:00 PM',
      studentFile: 'Fatima_Biology_Pedigrees.docx',
      grade: 48,
      feedback: 'Very accurate crossing calculations. Keep it up!',
      status: 'Graded'
    },
    {
      id: 'S-202',
      assignmentId: 'A-2',
      studentName: 'Liam Kiprop',
      submittedAt: 'Yesterday, 8:22 PM',
      studentFile: 'Liam_Genetics_Heredity.pdf',
      status: 'Pending Review'
    },
    {
      id: 'S-301',
      assignmentId: 'A-3',
      studentName: 'Fatima Kamau',
      submittedAt: '2026-06-04, 3:10 PM',
      studentFile: 'Fatima_Stoichiometry_Lab.pdf',
      grade: 30,
      feedback: 'Perfect stoichiometry proportions.',
      status: 'Graded'
    },
    {
      id: 'S-302',
      assignmentId: 'A-3',
      studentName: 'Liam Kiprop',
      submittedAt: '2026-06-04, 6:40 PM',
      studentFile: 'Liam_Stoich_Exercise.pdf',
      grade: 26,
      feedback: 'Good work, but look out for decimal arithmetic errors in Q2.',
      status: 'Graded'
    },
    {
      id: 'S-303',
      assignmentId: 'A-3',
      studentName: 'Mary Atieno',
      submittedAt: '2026-06-05, 10:11 AM',
      studentFile: 'Atieno_RevisionPapers_Stoich.pdf',
      grade: 29,
      feedback: 'Beautiful presentation and process calculations.',
      status: 'Graded'
    }
  ]);

  // Form states to create new assignments
  const [newAsgnTitle, setNewAsgnTitle] = useState('');
  const [newAsgnSubject, setNewAsgnSubject] = useState('Mathematics');
  const [newAsgnDueDate, setNewAsgnDueDate] = useState('2026-06-18');
  const [newAsgnPoints, setNewAsgnPoints] = useState(100);
  const [newAsgnInstructions, setNewAsgnInstructions] = useState('');

  // Grading form states
  const [gradingScore, setGradingScore] = useState<number>(0);
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);

  // --- 3. VIRTUAL CLASSES STATE ENGINE ---
  const [liveMeetings, setLiveMeetings] = useState<LiveMeeting[]>([
    {
      id: 'M-1',
      title: 'Mathematics Live Prep: Complex Integrals discussion',
      subject: 'Mathematics',
      time: 'Today, 4:00 PM (EAT)',
      duration: '60 Mins',
      platform: 'Google Meet',
      link: '#',
      status: 'Live Now',
      attendees: 24
    },
    {
      id: 'M-2',
      title: 'Review of Biology Syllabus Section on Recombinant DNA',
      subject: 'Biology',
      time: 'Tomorrow, 10:30 AM (EAT)',
      duration: '45 Mins',
      platform: 'Google Meet',
      link: '#',
      status: 'Upcoming'
    },
    {
      id: 'M-3',
      title: 'Chemistry Laboratory Video Demonstration & Theory Session',
      subject: 'Chemistry',
      time: '2026-06-11, 2:00 PM (EAT)',
      duration: '90 Mins',
      platform: 'Microsoft Teams',
      link: '#',
      status: 'Upcoming'
    }
  ]);

  // Room simulation modal (active interaction)
  const [classroomSimId, setClassroomSimId] = useState<string | null>(null);
  const [roomChats, setRoomChats] = useState<{ user: string; text: string; time: string }[]>([
    { user: 'Dr. Jane Mwangi (Teacher)', text: 'Welcome everyone! Today we are dissecting complex Riemann Integrals.', time: '15:58' },
    { user: 'Liam Kiprop', text: 'Good afternoon, is this session recorded?', time: '15:59' },
    { user: 'Dr. Jane Mwangi (Teacher)', text: 'Yes, Liam. It will automatically compile into our Study Content Library.', time: '16:00' },
    { user: 'Fatima Kamau', text: 'Perfect. I have my integration cheat sheet ready!', time: '16:01' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Scheduling live lecture form state
  const [newMtgTitle, setNewMtgTitle] = useState('');
  const [newMtgSubject, setNewMtgSubject] = useState('Mathematics');
  const [newMtgTime, setNewMtgTime] = useState('Today, 5:30 PM');
  const [newMtgDuration, setNewMtgDuration] = useState('45 Mins');
  const [newMtgPlatform, setNewMtgPlatform] = useState<'Google Meet' | 'Microsoft Teams'>('Google Meet');

  // --- 4. INTERACTIVE CURRICULUM STATE ENGINE ---
  const [curriculum, setCurriculum] = useState<SubjectCurriculum[]>([
    {
      id: 'C-MATH',
      subject: 'Mathematics',
      chapters: [
        { id: 'm1', title: 'Calculus I: Integral Limits & Proofs', objective: 'Understanding fundamental theorems of integration matrices.', isCompleted: true },
        { id: 'm2', title: 'Calculus II: Area Under Curve Analysis', objective: 'Application of definite integrals to resolve structural geometric bounds.', isCompleted: false },
        { id: 'm3', title: 'Vector Algebra Plane Spaces', objective: 'Computing directional derivatives and linear components.', isCompleted: false }
      ]
    },
    {
      id: 'C-BIO',
      subject: 'Biology',
      chapters: [
        { id: 'b1', title: 'Introduction to Cell Reproduction', objective: 'Differentiate between mitosis, meiosis, and chromosomal segregation.', isCompleted: true },
        { id: 'b2', title: 'Mendelian Genetics & Inheritance pedigree', objective: 'Construct custom crossing scenarios and pedigree analyses.', isCompleted: true },
        { id: 'b3', title: 'Genetic Disorders & Gene Therapy Systems', objective: 'Evaluate modern clinical vectors and recombinant therapeutic benefits.', isCompleted: false }
      ]
    },
    {
      id: 'C-CHEM',
      subject: 'Chemistry',
      chapters: [
        { id: 'c1', title: 'Stoichiometry & Reaction Yields', objective: 'Master calculation outlays for mole relations and limiting reagents.', isCompleted: true },
        { id: 'c2', title: 'Esterification Mechanics & Synthesis', objective: 'Explore organic functional configurations and dehydration pathways.', isCompleted: false },
        { id: 'c3', title: 'Electrochemistry Processes', objective: 'Examine galvanic cell potentials, half-reactions, and electrolysis mechanics.', isCompleted: false }
      ]
    }
  ]);

  // Subject chosen in Curriculum Tracker
  const [activeCurricSubject, setActiveCurricSubject] = useState('Mathematics');

  // Logic calculation computed properties
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || r.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const uniqueSubjectsList = Array.from(new Set(resources.map(r => r.subject))).filter(s => s !== 'All Subjects');

  // Simulate file upload with incremental progress ticking
  const handleUploadSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      toast.error('Please enter a descriptive resource title.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete upload task
          setTimeout(() => {
            const sizeMap = ['1.2 MB', '3.5 MB', '12.4 MB', '5.1 MB'];
            const randSize = sizeMap[Math.floor(Math.random() * sizeMap.length)];
            const formattedDate = new Date().toISOString().split('T')[0];

            const newRes: LearningResource = {
              id: `L-${Date.now()}`,
              title: uploadTitle,
              subject: uploadSubject,
              format: uploadFormat,
              size: uploadFormat === 'External Video' ? '15 mins (link)' : randSize,
              downloads: 0,
              ratingCount: 0,
              averageRating: 0,
              uploadedBy: 'Stephanie (Teacher)',
              dateAdded: formattedDate
            };

            setResources(prevRes => [newRes, ...prevRes]);
            setIsUploading(false);
            setUploadTitle('');
            toast.success(`"${uploadTitle}" has been uploaded and compiled into the LMS Library!`);
          }, 300);

          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Simulate downloading asset (increment clicks in states, trigger native download feedback)
  const handleDownloadSimulator = (resId: string, title: string) => {
    setResources(prev => prev.map(r => r.id === resId ? { ...r, downloads: r.downloads + 1 } : r));
    toast.success(`Initiated compilation for: ${title}! Resource saved into system local vault.`);
  };

  // Star Rating Interaction Handler
  const handleStarClick = (resId: string, starVal: number) => {
    if (userRatings[resId]) {
      toast.error('You have already submitted a feedback rating for this study guide.');
      return;
    }

    setUserRatings(prev => ({ ...prev, [resId]: starVal }));
    setResources(prev => prev.map(r => {
      if (r.id === resId) {
        const totalStars = (r.averageRating * r.ratingCount) + starVal;
        const newCount = r.ratingCount + 1;
        return {
          ...r,
          ratingCount: newCount,
          averageRating: Math.round((totalStars / newCount) * 10) / 10
        };
      }
      return r;
    }));
    toast.success(`LMS Rating synchronized! Thank you for grading this digital material.`);
  };

  // Create Assignment Action
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgnTitle.trim() || !newAsgnInstructions.trim()) {
      toast.error('Syllabus requirements insist on completing title & prompt instructions.');
      return;
    }

    const newAsgn: Assignment = {
      id: `A-${Date.now().toString().slice(-4)}`,
      title: newAsgnTitle,
      subject: newAsgnSubject,
      dueDate: newAsgnDueDate,
      points: Number(newAsgnPoints),
      instructions: newAsgnInstructions,
      submissionCount: 0,
      status: 'Published'
    };

    setAssignments(prev => [newAsgn, ...prev]);
    setSelectedAssignmentId(newAsgn.id);
    setNewAsgnTitle('');
    setNewAsgnInstructions('');
    toast.success('LMS Assignment drafted and dispatched live to student terminals!');
  };

  // Submit Feedback & Grade Submissions
  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmissionId) return;

    setSubmissions(prev => prev.map(sub => {
      if (sub.id === gradingSubmissionId) {
        return {
          ...sub,
          grade: Number(gradingScore),
          feedback: gradingFeedback,
          status: 'Graded'
        };
      }
      return sub;
    }));

    toast.success('Assignment graded! Marks sent instantly to Parent & Student dossiers.');
    setGradingSubmissionId(null);
    setGradingFeedback('');

    // Check if all submissions under this assignment are graded
    setTimeout(() => {
      const activeAsgnIdx = assignments.findIndex(a => a.id === selectedAssignmentId);
      if (activeAsgnIdx !== -1) {
        const totalSubs = submissions.filter(s => s.assignmentId === selectedAssignmentId);
        const gradedCount = submissions.filter(s => s.assignmentId === selectedAssignmentId && s.status === 'Graded').length;
        if (gradedCount + 1 >= totalSubs.length) {
          setAssignments(prev => prev.map(a => a.id === selectedAssignmentId ? { ...a, status: 'Grading Completed' } : a));
        }
      }
    }, 500);
  };

  // Toggle chapter progress in syllabus tracker
  const toggleChapterComplete = (subjectId: string, chapterId: string) => {
    setCurriculum(prev => prev.map(subCurric => {
      if (subCurric.id === subjectId) {
        return {
          ...subCurric,
          chapters: subCurric.chapters.map(ch => ch.id === chapterId ? { ...ch, isCompleted: !ch.isCompleted } : ch)
        };
      }
      return subCurric;
    }));
    toast.success('Subject roadmap revised! Curriculum completion percentage recalculated.');
  };

  // Create live stream scheduling
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMtgTitle.trim()) {
      toast.error('Provide a title for this upcoming lecture stream.');
      return;
    }

    const newMtg: LiveMeeting = {
      id: `M-${Date.now().toString().slice(-3)}`,
      title: newMtgTitle,
      subject: newMtgSubject,
      time: newMtgTime,
      duration: newMtgDuration,
      platform: newMtgPlatform,
      link: '#',
      status: 'Upcoming'
    };

    setLiveMeetings(prev => [...prev, newMtg]);
    setNewMtgTitle('');
    toast.success(`Virtual Room scheduled! Calendar invites broadcasted.`);
  };

  // Join Classroom Simulation Chat message
  const handleSendChatSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setRoomChats(prev => [...prev, { user: 'Stephanie (Teacher)', text: newChatText, time: timestamp }]);
    setNewChatText('');

    // Simulated automated smart student response
    setTimeout(() => {
      const answers = [
        'Ah, that clarifies the upper Riemann limit. Thank you teacher!',
        'Can you show us how we convert that into the logarithm model?',
        'I am seeing it clearly now!',
        'Got it!'
      ];
      const randAnswer = answers[Math.floor(Math.random() * answers.length)];
      setRoomChats(prev => [...prev, { user: 'Mary Atieno', text: randAnswer, time: timestamp }]);
    }, 1500);
  };

  // Calculate subject completion rates on curriculum tab
  const getSubjectCompletionRate = (subsec: SubjectCurriculum) => {
    if (subsec.chapters.length === 0) return 0;
    const completed = subsec.chapters.filter(c => c.isCompleted).length;
    return Math.round((completed / subsec.chapters.length) * 100);
  };

  const getFormatIcon = (format: string) => {
    if (format.includes('PDF')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (format.includes('Video')) return <Video className="w-5 h-5 text-blue-500" />;
    if (format.includes('Presentation')) return <Presentation className="w-5 h-5 text-amber-500" />;
    return <BookOpen className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="space-y-4">
      
      {/* 2. CAPSULE VIEW SELECTION NAV BAR */}
      <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit gap-1">
        {[
          { key: 'library', label: 'Resource Bank' },
          { key: 'assignments', label: `Homework (${assignments.length})` },
          { key: 'live_classes', label: 'Virtual Classrooms' },
          { key: 'curriculum', label: 'Syllabus Planner' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveSubTab(item.key as any)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border-none whitespace-nowrap ${
              activeSubTab === item.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 bg-transparent'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. DYNAMIC CONTENT AREA WITH ANIMATED TRANSITIONS */}
      <AnimatePresence mode="wait">
        
        {/* --- VIEW A: STUDY RESOURCE BANK --- */}
        {activeSubTab === 'library' && (
          <motion.div
            key="library-pane"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              
              {/* Left Column: Filter / Advanced Search and Grid of cards */}
              <div className="xl:col-span-8 space-y-6">
                
                {/* Search Bar and Subject folders */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search learning materials..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 text-xs font-normal text-slate-700 transition-all"
                    />
                  </div>

                  {/* Subject Quick filter buttons */}
                  <div className="w-full sm:w-auto flex bg-white border border-slate-200 rounded-lg overflow-hidden text-xs font-medium">
                    <button
                      onClick={() => setSubjectFilter('All')}
                      className={`px-3 py-2 transition-colors cursor-pointer border-none ${subjectFilter === 'All' ? 'bg-[#3D1D3F] text-white' : 'text-slate-500 hover:bg-slate-50 bg-transparent'}`}
                    >
                      All
                    </button>
                    {uniqueSubjectsList.map(subj => (
                      <button
                        key={subj}
                        onClick={() => setSubjectFilter(subj)}
                        className={`px-3 py-2 border-l border-slate-100 transition-colors cursor-pointer border-y-0 border-r-0 ${subjectFilter === subj ? 'bg-[#3D1D3F] text-white' : 'text-slate-500 hover:bg-slate-50 bg-transparent'}`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resources grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredResources.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] shadow-sm">
                      <Library className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                      <h3 className="text-sm font-semibold text-slate-700">No materials found</h3>
                      <p className="text-xs text-slate-400 mt-1">Try a different search or filter.</p>
                    </div>
                  ) : (
                    filteredResources.map(res => (
                      <div 
                        key={res.id}
                        className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
                      >
                        <div>
                          {/* Format badge & Delete trigger */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="w-8 h-8 bg-slate-50 rounded-lg inline-flex items-center justify-center">
                              {getFormatIcon(res.format)}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-medium text-slate-400">
                                {res.format}
                              </span>
                              
                              <button
                                onClick={() => {
                                  setResources(prev => prev.filter(r => r.id !== res.id));
                                  toast.success('Resource removed.');
                                }}
                                className="p-1 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-600 transition cursor-pointer border-none bg-transparent"
                                title="Remove resource"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-[#C20F47] transition-colors">
                            {res.title}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-300" /> {res.uploadedBy} · {res.dateAdded}
                          </p>

                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-indigo-50 rounded text-[10px] font-medium text-indigo-700">
                              {res.subject}
                            </span>
                            <span className="px-1.5 py-0.5 bg-slate-50 rounded text-[10px] font-medium tabular-nums text-slate-500">
                              {res.size}
                            </span>
                          </div>
                        </div>

                        {/* Ratings section & download action */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map(star => {
                                const filled = userRatings[res.id] ? (userRatings[res.id] >= star) : (Math.round(res.averageRating) >= star);
                                return (
                                  <button
                                    key={star}
                                    onClick={() => handleStarClick(res.id, star)}
                                    className="p-0 border-none bg-transparent cursor-pointer transition text-amber-400 hover:scale-110"
                                    title={`Rate ${star} Star`}
                                  >
                                    <Star className={`w-3.5 h-3.5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                  </button>
                                );
                              })}
                              
                              <span className="text-[11px] font-medium text-slate-600 ml-1">
                                {res.averageRating > 0 ? res.averageRating.toFixed(1) : 'Unrated'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 tabular-nums">
                              {res.ratingCount} ratings
                            </span>
                          </div>

                          <button
                            onClick={() => handleDownloadSimulator(res.id, res.title)}
                            className="px-3 py-1.5 bg-slate-800 text-white font-medium text-xs rounded-lg hover:bg-slate-900 transition flex items-center gap-1.5 cursor-pointer border-none"
                          >
                            <Download className="w-3 h-3" /> Open
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Premium Simulated Upload Terminal */}
              <div className="xl:col-span-4 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] p-4 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    Upload Resource
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Add worksheets, slides, or reference links.
                  </p>
                </div>

                <form onSubmit={handleUploadSimulator} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Resource Title</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                      placeholder="e.g. KCSE Chemistry Organic Charts"
                      value={uploadTitle}
                      onChange={e => setUploadTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Subject</label>
                      <select
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                        value={uploadSubject}
                        onChange={e => setUploadSubject(e.target.value)}
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Geography">Geography</option>
                        <option value="History">History</option>
                        <option value="English">English</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Media Format</label>
                      <select
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                        value={uploadFormat}
                        onChange={e => setUploadFormat(e.target.value as any)}
                      >
                        <option value="PDF Document">PDF Document</option>
                        <option value="Presentation Slides">Slides</option>
                        <option value="ZIP Archive">ZIP Archive</option>
                        <option value="External Video">Video Link</option>
                      </select>
                    </div>
                  </div>

                  {/* Simulated File upload Area Drag Drop styled and animated */}
                  <div className="border border-dashed border-slate-200 rounded-xl bg-slate-50 p-3.5 text-center select-none cursor-pointer hover:bg-indigo-50/30 transition-colors">
                    <Library className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
                    <p className="text-xs font-medium text-slate-700">Tap to attach a file</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Max 50MB (PDF, ZIP, MP4)</p>
                  </div>

                  {/* Active Uploading progress simulation bar */}
                  {isUploading && (
                    <div className="space-y-2 bg-indigo-50/50 p-3 rounded-xl">
                      <div className="flex justify-between items-center text-[11px] font-medium text-indigo-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse inline-block" />
                          Uploading…
                        </span>
                        <span className="tabular-nums">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-indigo-100/70 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full py-2.5 ${isUploading ? 'bg-slate-300 cursor-wait' : 'bg-[#C20F47] hover:bg-[#3D1D3F]'} text-white font-medium text-sm rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-sm`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Resource
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}

        {/* --- VIEW B: HOMEWORK & GRADING DESK --- */}
        {activeSubTab === 'assignments' && (
          <motion.div
            key="assignments-pane"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              
              {/* Left Form / Create Section (Spans 4 columns) */}
              <div className="xl:col-span-4 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-4 rounded-[1.25rem] shadow-sm space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    New Assignment
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Set tasks, deadlines, and grading weights.
                  </p>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Assignment Name</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                      placeholder="e.g. Pedigree Inheritance Essay"
                      value={newAsgnTitle}
                      onChange={e => setNewAsgnTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Subject</label>
                    <select
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                      value={newAsgnSubject}
                      onChange={e => setNewAsgnSubject(e.target.value)}
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Geography">Geography</option>
                      <option value="History">History</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Max Points</label>
                      <input 
                        type="number"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm tabular-nums font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                        value={newAsgnPoints}
                        onChange={e => setNewAsgnPoints(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Due Date</label>
                      <input 
                        type="date"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm tabular-nums font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                        value={newAsgnDueDate}
                        onChange={e => setNewAsgnDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Instructions</label>
                    <textarea 
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white min-h-[80px] placeholder:text-slate-400 transition"
                      placeholder="Specify grading rubrics or instructions for files..."
                      value={newAsgnInstructions}
                      onChange={e => setNewAsgnInstructions(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white font-medium text-sm rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Assignment
                  </button>
                </form>
              </div>

              {/* Middle Section: List of Active Coursework assignments (Spans 4 columns) */}
              <div className="xl:col-span-4 space-y-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide px-1 block">Active Assignments</span>
                
                <div className="space-y-3">
                  {assignments.map(asgn => {
                    const isSelected = selectedAssignmentId === asgn.id;
                    const asgnSubs = submissions.filter(s => s.assignmentId === asgn.id);
                    const pendingSubsCount = asgnSubs.filter(s => s.status === 'Pending Review').length;

                    return (
                      <div
                        key={asgn.id}
                        onClick={() => setSelectedAssignmentId(asgn.id)}
                        className={`p-3.5 rounded-[1.25rem] border-x-2 border-b-2 border-[#C20F47] transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-t-[8px] border-t-[#3D1D3F] bg-[#3D1D3F] text-white shadow-md'
                            : 'border-t-[8px] border-t-[#F39C2A] bg-white hover:shadow-md text-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            isSelected ? 'bg-white/15 text-white' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {asgn.subject}
                          </span>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            asgn.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                            asgn.status === 'Grading Completed' ? (isSelected ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-50 text-emerald-700') :
                            (isSelected ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-50 text-amber-700') + ' animate-pulse'
                          }`}>
                            {asgn.status}
                          </span>
                        </div>

                        <p className={`font-semibold text-sm mt-2 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {asgn.title}
                        </p>

                        <div className={`mt-2.5 flex flex-wrap justify-between items-center text-[11px] tabular-nums ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span>Due {asgn.dueDate}</span>
                          </div>
                          <span>Max {asgn.points} pts</span>
                        </div>

                        <div className={`mt-2.5 pt-2.5 border-t text-[11px] flex justify-between items-center ${
                          isSelected ? 'border-white/10 text-white/60' : 'border-slate-100 text-slate-400'
                        }`}>
                          <span>{asgnSubs.length} submissions</span>
                          {pendingSubsCount > 0 ? (
                            <span className="text-[#C20F47] bg-rose-50 rounded px-1.5 py-0.5 font-medium animate-pulse">
                              {pendingSubsCount} to grade
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-medium">✔ Graded</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Section: GRADING ROOM HUB - (Spans 4 columns) */}
              <div className="xl:col-span-4 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] p-4 shadow-sm space-y-3">
                {selectedAssignmentId ? (
                  (() => {
                    const activeAsgn = assignments.find(a => a.id === selectedAssignmentId);
                    const asgnSubs = submissions.filter(s => s.assignmentId === selectedAssignmentId);
                    if (!activeAsgn) return null;

                    return (
                      <div className="space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                          <span className="text-[11px] font-medium text-indigo-600">Grading</span>
                          <h4 className="text-sm font-semibold text-slate-800 mt-0.5">{activeAsgn.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-snug">
                            {activeAsgn.instructions}
                          </p>
                        </div>

                        {/* List of Student answers files */}
                        <div className="space-y-3">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block">Submissions ({asgnSubs.length})</span>
                          
                          {asgnSubs.length === 0 ? (
                            <p className="text-xs text-slate-400 py-2">No submissions yet.</p>
                          ) : (
                            asgnSubs.map(sub => {
                              const isBeingGradedObj = gradingSubmissionId === sub.id;
                              return (
                                <div 
                                  key={sub.id} 
                                  className="bg-slate-50 hover:bg-slate-100/60 p-3 rounded-xl transition-colors"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-sm font-semibold text-slate-800 leading-tight">{sub.studentName}</p>
                                      <p className="text-[11px] text-slate-400 mt-0.5">{sub.submittedAt}</p>
                                    </div>

                                    {sub.status === 'Graded' ? (
                                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-medium tabular-nums">
                                        {sub.grade}/{activeAsgn.points}
                                      </span>
                                    ) : (
                                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-medium animate-pulse">
                                        Review
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 tabular-nums bg-white p-2 rounded-lg">
                                    <span className="truncate max-w-[130px]">{sub.studentFile}</span>
                                    <button 
                                      onClick={() => {
                                        setResources(prev => [{
                                          id: `L-SUB-${Date.now()}`,
                                          title: `Student Work: ${sub.studentName} - ${activeAsgn.title}`,
                                          subject: activeAsgn.subject,
                                          format: 'PDF Document',
                                          size: '1.2 MB',
                                          downloads: 1,
                                          ratingCount: 0,
                                          averageRating: 0,
                                          uploadedBy: sub.studentName,
                                          dateAdded: 'Today'
                                        }, ...prev]);
                                        toast.success(`Broadcasting simulated view of: ${sub.studentFile}`);
                                      }}
                                      className="text-[11px] font-medium text-indigo-600 hover:underline border-none bg-transparent cursor-pointer"
                                    >
                                      Preview
                                    </button>
                                  </div>

                                  {/* Feedbacks already recorded */}
                                  {sub.feedback && (
                                    <div className="mt-2 bg-white rounded-lg p-2 text-[11px] text-slate-500 italic">
                                      "{sub.feedback}"
                                    </div>
                                  )}

                                  {/* Grade Action button */}
                                  {sub.status === 'Pending Review' && !isBeingGradedObj && (
                                    <button
                                      onClick={() => {
                                        setGradingSubmissionId(sub.id);
                                        setGradingScore(Math.round(activeAsgn.points * 0.9)); // preset 90%
                                      }}
                                      className="w-full mt-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition border-none cursor-pointer"
                                    >
                                      Grade Submission
                                    </button>
                                  )}

                                  {/* Grading Input Action Form overlay */}
                                  {isBeingGradedObj && (
                                    <form onSubmit={handleGradeSubmission} className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-2.5">
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="text-xs font-medium text-[#C20F47]">Score</span>
                                        <div className="flex items-center gap-1 tabular-nums">
                                          <input 
                                            type="number"
                                            className="w-12 px-1.5 py-1 text-center bg-white border border-slate-200 rounded-lg text-sm font-semibold tabular-nums text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20"
                                            max={activeAsgn.points}
                                            value={gradingScore}
                                            onChange={e => setGradingScore(Number(e.target.value))}
                                          />
                                          <span className="text-xs text-slate-400">/ {activeAsgn.points}</span>
                                        </div>
                                      </div>

                                      <div className="space-y-1">
                                        <textarea 
                                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 placeholder:text-slate-400"
                                          placeholder="Private feedback for student..."
                                          value={gradingFeedback}
                                          onChange={e => setGradingFeedback(e.target.value)}
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setGradingSubmissionId(null)}
                                          className="flex-1 py-1.5 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium text-xs border-none cursor-pointer transition"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs border-none cursor-pointer transition"
                                        >
                                          Confirm
                                        </button>
                                      </div>
                                    </form>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="py-12 text-center">
                    <Award className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">Select an assignment</p>
                    <p className="text-xs text-slate-400 mt-1">Choose one from the list to grade submissions.</p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* --- VIEW C: VIRTUAL LIVE CLASSES STREAM --- */}
        {activeSubTab === 'live_classes' && (
          <motion.div
            key="live-classes-pane"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              
              {/* Scheduling Stream Form (Spans 4 columns) */}
              <div className="xl:col-span-4 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-4 rounded-[1.25rem] shadow-sm space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    New Live Class
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Schedule a video session for your students.
                  </p>
                </div>

                <form onSubmit={handleCreateMeeting} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Session Title</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                      placeholder="e.g. Definite Integrals live working"
                      value={newMtgTitle}
                      onChange={e => setNewMtgTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Subject</label>
                    <select
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                      value={newMtgSubject}
                      onChange={e => setNewMtgSubject(e.target.value)}
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Geography">Geography</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Date & Time</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                        placeholder="Today, 5:30 PM"
                        value={newMtgTime}
                        onChange={e => setNewMtgTime(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Duration</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                        placeholder="45 Mins"
                        value={newMtgDuration}
                        onChange={e => setNewMtgDuration(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Platform</label>
                    <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-lg w-full">
                      <button
                        type="button"
                        onClick={() => setNewMtgPlatform('Google Meet')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md border-none transition cursor-pointer ${
                          newMtgPlatform === 'Google Meet' ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Google Meet
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewMtgPlatform('Microsoft Teams')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md border-none transition cursor-pointer ${
                          newMtgPlatform === 'Microsoft Teams' ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        MS Teams
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white font-medium text-sm rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Schedule Class
                  </button>
                </form>
              </div>

              {/* List of Active & Scheduled Rooms (Spans 8 columns) */}
              <div className="xl:col-span-8 space-y-5">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide px-1 block">Scheduled & Live Sessions</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {liveMeetings.map(mtg => (
                    <div 
                      key={mtg.id}
                      className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] p-4 hover:shadow-md transition-shadow relative"
                    >
                      {/* Active green radar beacon for Live Status */}
                      {mtg.status === 'Live Now' && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-rose-50 rounded-full text-[10px] font-medium text-rose-600 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Live
                        </div>
                      )}

                      <div>
                        {/* Channel badge */}
                        <div className="flex gap-1.5 mb-2.5">
                          <span className="px-1.5 py-0.5 bg-rose-50 rounded text-[10px] font-medium text-rose-700">
                            {mtg.platform}
                          </span>
                          <span className="px-1.5 py-0.5 bg-indigo-50 rounded text-[10px] font-medium text-indigo-700">
                            {mtg.subject}
                          </span>
                        </div>

                        <p className="font-semibold text-slate-800 text-sm leading-snug">
                          {mtg.title}
                        </p>

                        <div className="mt-3 space-y-1.5 text-xs text-slate-500 border-t border-slate-50 pt-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{mtg.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{mtg.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active bottom interaction button */}
                      <div className="mt-3">
                        {mtg.status === 'Live Now' ? (
                          <button
                            onClick={() => setClassroomSimId(mtg.id)}
                            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-sm"
                          >
                            <Video className="w-3.5 h-3.5 animate-pulse" /> Join Live Room
                          </button>
                        ) : (
                          <div className="flex items-center justify-between gap-2.5">
                            <button
                              onClick={() => {
                                toast.success(`Simulated Google Calendar invite synced for: ${mtg.title}`);
                              }}
                              className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium transition text-center cursor-pointer"
                            >
                              Add to Calendar
                            </button>
                            
                            <button
                              onClick={() => {
                                setLiveMeetings(prev => prev.map(m => m.id === mtg.id ? { ...m, status: 'Live Now' } : m));
                                toast.success(`Channel converted to LIVE stream! Broadcasting active...`);
                              }}
                              className="flex-1 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white border-none rounded-lg text-xs font-medium transition text-center cursor-pointer"
                            >
                              Go Live →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* UPCOMING / VIRTUAL CLASSROOM MODAL SIMULATOR */}
            {classroomSimId && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#1a1a1a] text-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[480px]">
                  
                  {/* Left screen column: Simulated interactive video camera (dark mockup styled) */}
                  <div className="flex-1 bg-black p-4 flex flex-col justify-between relative">
                    {/* Floating transmission watermarks */}
                    <div className="flex justify-between items-center z-10">
                      <span className="px-2 py-1 bg-rose-600 rounded-full text-[10px] font-medium text-white animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" /> Recording
                      </span>
                      <span className="text-slate-400 tabular-nums text-[11px]">1080p</span>
                    </div>

                    {/* Central visuals representing avatar with nice canvas animation */}
                    <div className="text-center space-y-3 py-12">
                      <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center border-2 border-indigo-400/40 relative">
                        <div className="absolute inset-0 rounded-full border border-indigo-400/20 scale-125 animate-ping pointer-events-none" />
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <p className="font-semibold text-sm pt-1">Teacher</p>
                      <p className="text-xs text-slate-400">Presenting: Riemann Definite Limits Chart</p>
                    </div>

                    {/* Action buttons mapping web interface stream controller */}
                    <div className="flex justify-center gap-3 z-10">
                      <span className="p-2.5 bg-white/10 hover:bg-white/15 cursor-pointer rounded-full text-white text-xs">🎙</span>
                      <span className="p-2.5 bg-white/10 hover:bg-white/15 cursor-pointer rounded-full text-white text-xs">📹</span>
                      <span className="p-2.5 bg-white/10 hover:bg-white/15 cursor-pointer rounded-full text-white text-xs">🖥</span>
                      <button
                        onClick={() => {
                          setClassroomSimId(null);
                          toast.success('Disconnected from class.');
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-medium text-xs transition border-none cursor-pointer"
                      >
                        End Class
                      </button>
                    </div>
                  </div>

                  {/* Right chat telemetry column */}
                  <div className="w-full md:w-72 bg-[#141414] border-l border-white/5 flex flex-col justify-between p-4 text-slate-100">
                    <div className="border-b border-white/10 pb-3">
                      <h4 className="text-sm font-semibold text-indigo-400">Class Chat</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Connected</p>
                    </div>

                    {/* Messages panel scroll */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 my-4 py-2 pr-1 [scrollbar-width:thin]">
                      {roomChats.map((ch, idx) => (
                        <div key={idx} className="text-left text-xs bg-white/5 p-2.5 rounded-xl">
                          <div className="flex justify-between text-[10px] font-medium">
                            <span className={ch.user.includes('Teacher') ? 'text-amber-400' : 'text-slate-400'}>
                              {ch.user}
                            </span>
                            <span className="text-slate-500 tabular-nums">{ch.time}</span>
                          </div>
                          <p className="text-slate-200 mt-1 leading-snug">{ch.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chat messaging form input controller */}
                    <form onSubmit={handleSendChatSim} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Say something to class..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-normal focus:outline-none focus:border-indigo-400 placeholder:text-slate-500"
                        value={newChatText}
                        onChange={e => setNewChatText(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg border-none cursor-pointer transition flex items-center justify-center shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* --- VIEW D: SYLLABUS PLANNER & TRACKER --- */}
        {activeSubTab === 'curriculum' && (
          <motion.div
            key="curriculum-pane"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              
              {/* Left Selector & Progress overview (Spans 5 columns) */}
              <div className="xl:col-span-5 space-y-6">
                
                {/* Visual scorecard */}
                <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-4 rounded-[1.25rem] shadow-sm space-y-3">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block">Curriculum Completion</span>
                  
                  <div className="space-y-2.5 pt-1">
                    {curriculum.map(subCurric => {
                      const rate = getSubjectCompletionRate(subCurric);
                      const isSelected = activeCurricSubject === subCurric.subject;

                      return (
                        <div
                          key={subCurric.id}
                          onClick={() => setActiveCurricSubject(subCurric.subject)}
                          className={`p-3 rounded-xl border transition cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#3D1D3F] text-white border-[#3D1D3F] shadow-sm'
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-semibold">{subCurric.subject}</span>
                            <span className="tabular-nums text-xs">{rate}%</span>
                          </div>

                          <div className={`w-full ${isSelected ? 'bg-white/10' : 'bg-slate-200'} rounded-full h-1.5 overflow-hidden`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                rate >= 100 ? 'bg-emerald-400' :
                                rate >= 60 ? 'bg-indigo-400' : 'bg-amber-400'
                              }`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>

                          <div className="mt-1.5 flex justify-between items-center text-[11px] opacity-70 tabular-nums">
                            <span>{subCurric.chapters.filter(ch => ch.isCompleted).length} of {subCurric.chapters.length} done</span>
                            <span>View →</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Parent Alert bulletin card to verify intent is functional */}
                <div className="bg-amber-50 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-semibold text-xs">Parent visibility</h5>
                    <p className="text-xs mt-0.5 opacity-80 leading-relaxed">
                      Checking off chapters updates progress in the parent portal automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Course Objective Syllabus grid chapters list (Spans 7 columns) */}
              <div className="xl:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="font-semibold text-sm text-slate-800">
                    {activeCurricSubject} Syllabus
                  </span>
                  <span className="text-[11px] text-slate-400">Tap to mark complete</span>
                </div>

                {(() => {
                  const subCurric = curriculum.find(s => s.subject === activeCurricSubject);
                  if (!subCurric) return null;

                  return (
                    <div className="space-y-2.5">
                      {subCurric.chapters.map(ch => (
                        <div 
                          key={ch.id}
                          className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-3 text-left bg-white ${
                            ch.isCompleted 
                              ? 'border-emerald-100' 
                              : 'border-slate-100 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Toggleable Syllabus completion Check circle */}
                            <button
                              onClick={() => toggleChapterComplete(subCurric.id, ch.id)}
                              className={`p-1 rounded-full border transition shrink-0 bg-transparent ${
                                ch.isCompleted 
                                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                                  : 'text-slate-300 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                              } cursor-pointer`}
                              title="Mark chapter completion"
                            >
                              {ch.isCompleted ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5" />}
                            </button>

                            <div>
                              <p className={`font-semibold text-sm leading-tight ${
                                ch.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                              }`}>
                                {ch.title}
                              </p>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {ch.objective}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium inline-block shrink-0 ${
                            ch.isCompleted 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ch.isCompleted ? 'Done' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
