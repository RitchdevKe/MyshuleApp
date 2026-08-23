import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash, 
  UploadCloud, 
  Check, 
  ShieldCheck, 
  User, 
  FolderOpen, 
  Heart, 
  TrendingUp, 
  Navigation, 
  DollarSign
} from 'lucide-react';
import { Student, Gender } from '../types.ts';

interface NewEnrollmentWizardProps {
  onClose: () => void;
  onSubmit: (student: Student) => void;
  existingGrades: string[];
  existingStreams: string[];
  onAddGrade?: (grade: string) => void;
  onAddStream?: (stream: string) => void;
}

export function NewEnrollmentWizard({ 
  onClose, 
  onSubmit, 
  existingGrades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
  existingStreams = ['East', 'West', 'North', 'South']
}: NewEnrollmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Admission' },
    { num: 3, label: 'Parents' },
    { num: 4, label: 'Health & Academic' },
    { num: 5, label: 'Logistics & Finance' },
    { num: 6, label: 'Documents & Consent' }
  ];

  // Config items
  const [grades, setGrades] = useState<string[]>(existingGrades);
  const [streams, setStreams] = useState<string[]>(existingStreams);
  const [newGradeName, setNewGradeName] = useState('');
  const [newStreamName, setNewStreamName] = useState('');
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddStream, setShowAddStream] = useState(false);

  // Form states
  const [avatar, setAvatar] = useState<string | null>(null);
  
  // Step 1: Basic Info
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [gender, setGender] = useState<Gender>('M');
  const [dob, setDob] = useState('2010-01-01');
  const [studentId, setStudentId] = useState('S-' + Math.floor(1000 + Math.random() * 9000));
  const [nationality, setNationality] = useState('Kenyan');
  const [stateRegion, setStateRegion] = useState('Nairobi');
  const [nationalId, setNationalId] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [postalCode, setPostalCode] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');

  // Step 2: Admission
  const [admissionDate, setAdmissionDate] = useState('2026-05-27');
  const [academicYear, setAcademicYear] = useState('2026');
  const [previousSchool, setPreviousSchool] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(grades[grades.length - 1] || 'Grade 12');
  const [selectedStream, setSelectedStream] = useState(streams[0] || 'East');
  const [transferReason, setTransferReason] = useState('');
  const [house, setHouse] = useState('Oloolua');
  const [studentType, setStudentType] = useState('Day Student');

  // Step 3: Parents
  const [emerName, setEmerName] = useState('');
  const [emerRelation, setEmerRelation] = useState('');
  const [emerPhone, setEmerPhone] = useState('');
  const [guardians, setGuardians] = useState<Array<{ id: number; name: string; relation: string; occupation: string; phone: string; email: string; isPrimaryPayer: boolean }>>([
    { id: 1, name: '', relation: 'Father', occupation: '', phone: '', email: '', isPrimaryPayer: true }
  ]);

  // Step 4: Health & Academic
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [coreStrengths, setCoreStrengths] = useState('');
  const [challenges, setChallenges] = useState('');

  // Step 5: Logistics & Finance
  const [usesTransport, setUsesTransport] = useState('No, private transport');
  const [feePlan, setFeePlan] = useState('Standard Tuition');
  const [scholarship, setScholarship] = useState('None');
  const [paymentFreq, setPaymentFreq] = useState('Termly');

  // Step 6: Consents & Documents
  const [consentEnrollment, setConsentEnrollment] = useState(false);
  const [consentDataPrivacy, setConsentDataPrivacy] = useState(false);
  const [consentMedia, setConsentMedia] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Record<string, boolean>>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  const addGrade = () => {
    if (newGradeName.trim() && !grades.includes(newGradeName.trim())) {
      const updated = [...grades, newGradeName.trim()];
      setGrades(updated);
      setSelectedGrade(newGradeName.trim());
      setNewGradeName('');
      setShowAddGrade(false);
    }
  };

  const addStream = () => {
    if (newStreamName.trim() && !streams.includes(newStreamName.trim())) {
      const updated = [...streams, newStreamName.trim()];
      setStreams(updated);
      setSelectedStream(newStreamName.trim());
      setNewStreamName('');
      setShowAddStream(false);
    }
  };

  const handleAddGuardian = () => {
    setGuardians([
      ...guardians,
      { id: Date.now(), name: '', relation: 'Mother', occupation: '', phone: '', email: '', isPrimaryPayer: false }
    ]);
  };

  const handleRemoveGuardian = (id: number) => {
    if (guardians.length > 1) {
      setGuardians(guardians.filter(g => g.id !== id));
    }
  };

  const handleUpdateGuardian = (id: number, field: string, value: any) => {
    setGuardians(guardians.map(g => {
      if (g.id === id) {
        if (field === 'isPrimaryPayer' && value === true) {
          // Uncheck others
          return { ...g, [field]: value };
        }
        return { ...g, [field]: value };
      } else if (field === 'isPrimaryPayer' && value === true) {
        return { ...g, isPrimaryPayer: false };
      }
      return g;
    }));
  };

  const handleSimulateAttachment = (docKey: string) => {
    setAttachedFiles(prev => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.success('First Name and Last Name are required metrics.');
      setCurrentStep(1);
      return;
    }
    
    // Parse form code level
    let formLevel = 4;
    // Map Grade to Forms (F1-4)
    if (selectedGrade.toLowerCase().includes('9') || selectedGrade.toLowerCase().includes('senior 1') || selectedGrade.toLowerCase().includes('s1')) formLevel = 1;
    else if (selectedGrade.toLowerCase().includes('10') || selectedGrade.toLowerCase().includes('senior 2') || selectedGrade.toLowerCase().includes('s2')) formLevel = 2;
    else if (selectedGrade.toLowerCase().includes('11') || selectedGrade.toLowerCase().includes('senior 3') || selectedGrade.toLowerCase().includes('s3')) formLevel = 3;
    else formLevel = 4;

    const primaryGuardian = guardians.find(g => g.isPrimaryPayer) || guardians[0];

    const studentData: Student = {
      id: studentId.trim().toUpperCase() || 'S-' + Math.floor(1000 + Math.random() * 9000),
      admissionNo: studentId.trim().toUpperCase() || 'S-' + Math.floor(1000 + Math.random() * 9000),
      name: `${firstName.trim()} ${middleName ? middleName.trim() + ' ' : ''}${lastName.trim()}`,
      gender,
      form: formLevel,
      stream: selectedStream,
      feeBalance: feePlan === 'Custom Plan' ? 10000 : 45000,
      totalFees: feePlan === 'Custom Plan' ? 15000 : 45000,
      attendancePercentage: 100,
      status: 'Active',
      email: schoolEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@karega.sc.ke`,
      phone: primaryPhone || primaryGuardian?.phone,
      dob,
      admissionDate,
      nationality,
      nationalId,
      address: homeAddress,
      city,
      postalCode,
      guardianName: primaryGuardian?.name || emerName,
      guardianRelation: primaryGuardian?.relation || emerRelation,
      guardianPhone: primaryGuardian?.phone || emerPhone,
      guardianEmail: primaryGuardian?.email,
      guardianOccupation: primaryGuardian?.occupation,
      bloodGroup,
      allergies,
      medicalConditions: conditions,
      doctorName,
      doctorPhone,
      coreStrengths,
      challenges,
      usesTransport,
      feePlan,
      scholarship,
      paymentFreq
    };

    onSubmit(studentData);
  };

  return (
    <div className="bg-white rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm overflow-hidden flex flex-col font-sans text-slate-800 animate-fade-in w-full min-h-[80vh]">
      
      {/* Title Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 px-1.5 py-1.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition text-[16px] font-bold cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Student Enrollment</h2>
              <p className="text-[17px] text-slate-500 font-medium">Complete the multi-step process to onboard and register a new student record.</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator banner */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-start justify-center gap-4 sm:gap-8 shrink-0">
          {steps.map((s, idx) => {
            const isCompleted = s.num < currentStep;
            const isActive = s.num === currentStep;
            const Icon = s.num === 1 ? User : s.num === 2 ? FolderOpen : s.num === 3 ? ShieldCheck : s.num === 4 ? Heart : s.num === 5 ? DollarSign : Check;
            
            return (
              <div key={s.num} className="flex flex-col items-center flex-1 relative group cursor-pointer" onClick={() => {
                if (s.num < currentStep || firstName.trim()) setCurrentStep(s.num);
              }}>
                {idx !== 0 && (
                  <div className="absolute w-full h-[2px] bg-slate-100 right-[50%] top-5 -z-10" />
                )}
                {idx !== 0 && (isCompleted || isActive) && (
                  <div className="absolute w-full h-[2px] bg-[var(--color-secondary)] right-[50%] top-5 -z-10 transition-all duration-500" />
                )}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border-2 ${
                  isActive ? 'bg-[#ea580c] text-white border-transparent scale-110 shadow-orange-500/20' : 
                  isCompleted ? 'bg-white text-slate-800 border-slate-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5 text-[#ea580c]" /> : <Icon className="w-4.5 h-4.5" />}
                </div>
                
                <span className={`text-[14px] mt-2 font-bold uppercase text-center tracking-wider max-w-[80px] leading-tight transition-colors ${
                  isActive ? 'text-[#ea580c]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Body Scrollable Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-slate-50/50 text-lg">
          
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-[var(--color-secondary)]" />
                <h3 className="font-bold text-xl">Basic Info</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Photo Upload Container */}
                <div className="md:col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[var(--color-secondary)] bg-white rounded-3xl p-5 text-center relative transition group">
                  {avatar ? (
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-slate-200">
                      <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setAvatar(null)}
                        className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full text-[16px]"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[var(--color-secondary)] mb-1.5 transition" />
                      <span className="text-[16px] font-bold text-slate-700">Upload Photo</span>
                      <span className="text-[15px] text-slate-400 mt-0.5">JPG, PNG (Max 2MB)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {/* Main Identity inputs */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">First Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. John"
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Middle Name</label>
                    <input 
                      type="text"
                      placeholder="Optional"
                      value={middleName} 
                      onChange={e => setMiddleName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Last Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Kumi"
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Preferred Name</label>
                    <input 
                      type="text" 
                      placeholder="Nickname (e.g. Johnny)"
                      value={preferredName} 
                      onChange={e => setPreferredName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Gender *</label>
                    <select 
                      value={gender} 
                      onChange={e => setGender(e.target.value as Gender)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Date of Birth *</label>
                    <input 
                      type="date" 
                      required
                      value={dob} 
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Identity numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 border border-slate-100 rounded-2xl">
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Student ID/Adm *</label>
                  <input 
                    type="text" 
                    required 
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 tabular-nums tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Nationality</label>
                  <input 
                    type="text" 
                    value={nationality} 
                    onChange={e => setNationality(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">State / Region</label>
                  <input 
                    type="text" 
                    value={stateRegion} 
                    onChange={e => setStateRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">National ID / Passport</label>
                  <input 
                    type="text" 
                    placeholder="Parent's or Student's"
                    value={nationalId} 
                    onChange={e => setNationalId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Residential Contact */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-slate-700">Residential Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-6">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Address *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. House 14, Garden Estate Rd"
                      value={homeAddress} 
                      onChange={e => setHomeAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">City</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 00100"
                      value={postalCode} 
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white tabular-nums"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Primary Phone Contact *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. +254 712 345678"
                      value={primaryPhone} 
                      onChange={e => setPrimaryPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white tabular-nums"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">School Domain Email</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john.k@karegasec.co.ke"
                      value={schoolEmail} 
                      onChange={e => setSchoolEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ADMISSION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                <FolderOpen className="w-4 h-4 text-[var(--color-secondary)]" />
                <h3 className="font-bold text-xl">Admission</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Admission Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={admissionDate} 
                    onChange={e => setAdmissionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Academic Year</label>
                  <input 
                    type="text" 
                    value={academicYear} 
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Previous School / Academy</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Prempeh College"
                    value={previousSchool} 
                    onChange={e => setPreviousSchool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Grade and Stream customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-5 border border-slate-100 rounded-3xl">
                {/* Grade */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase">Class / Grade *</label>
                    <button 
                      type="button" 
                      onClick={() => setShowAddGrade(!showAddGrade)}
                      className="text-[15px] font-bold text-[var(--color-secondary)] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Grade
                    </button>
                  </div>

                  {showAddGrade && (
                    <div className="flex gap-2 p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl">
                      <input 
                        type="text" 
                        placeholder="e.g. SHS ONE" 
                        value={newGradeName}
                        onChange={e => setNewGradeName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-slate-200 bg-white rounded-lg text-[17px]"
                      />
                      <button 
                        type="button" 
                        onClick={addGrade}
                        className="px-3 py-1 bg-[var(--color-secondary)] text-white text-[17px] font-bold rounded-lg cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}

                  <select 
                    value={selectedGrade} 
                    onChange={e => setSelectedGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    {grades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Stream / Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase">Section / Stream *</label>
                    <button 
                      type="button" 
                      onClick={() => setShowAddStream(!showAddStream)}
                      className="text-[15px] font-bold text-[var(--color-secondary)] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Stream
                    </button>
                  </div>

                  {showAddStream && (
                    <div className="flex gap-2 p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl">
                      <input 
                        type="text" 
                        placeholder="e.g. Arts" 
                        value={newStreamName}
                        onChange={e => setNewStreamName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-slate-200 bg-white rounded-lg text-[17px]"
                      />
                      <button 
                        type="button" 
                        onClick={addStream}
                        className="px-3 py-1 bg-[var(--color-secondary)] text-white text-[17px] font-bold rounded-lg cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}

                  <select 
                    value={selectedStream} 
                    onChange={e => setSelectedStream(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    {streams.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Extra details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Reason for Transfer</label>
                  <input 
                    type="text" 
                    placeholder="Provide brief reason..."
                    value={transferReason} 
                    onChange={e => setTransferReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">House (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Osei Tutu"
                    value={house} 
                    onChange={e => setHouse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Student Type</label>
                  <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setStudentType('Day Student')}
                      className={`flex-1 py-1.5 rounded-lg text-[16px] font-bold cursor-pointer uppercase tracking-wider transition ${
                        studentType === 'Day Student' ? 'bg-[var(--color-secondary)] text-white' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Day
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStudentType('Boarding Student')}
                      className={`flex-1 py-1.5 rounded-lg text-[16px] font-bold cursor-pointer uppercase tracking-wider transition ${
                        studentType === 'Boarding Student' ? 'bg-[var(--color-secondary)] text-white' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Boarding
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PARENTS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-[var(--color-secondary)]" />
                <h3 className="font-bold text-xl">Parents & Family Contacts</h3>
              </div>

              {/* Emergency Contact */}
              <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-3xl space-y-4">
                <h4 className="font-bold text-lg text-rose-800">Primary Emergency Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Emergency Contact Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Ama Serwaa"
                      value={emerName} 
                      onChange={e => setEmerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-rose-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Relationship</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Auntie / Guardian"
                      value={emerRelation} 
                      onChange={e => setEmerRelation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Emergency Phone *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. +233 24 123 4567"
                      value={emerPhone} 
                      onChange={e => setEmerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Guardians List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-slate-700">Guardian Information</h4>
                  <button 
                    type="button" 
                    onClick={handleAddGuardian}
                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold bg-white rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Guardian
                  </button>
                </div>

                {guardians.map((g, index) => (
                  <div key={g.id} className="p-5 border border-slate-200 bg-white rounded-3xl space-y-4 relative">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="font-bold text-lg text-slate-800">Guardian #{index + 1}</span>
                      {guardians.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveGuardian(g.id)}
                          className="text-red-500 hover:text-red-700 text-[16px] flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Kojo Kumi"
                          value={g.name} 
                          onChange={e => handleUpdateGuardian(g.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Relationship</label>
                        <select 
                          value={g.relation} 
                          onChange={e => handleUpdateGuardian(g.id, 'relation', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Uncle">Uncle</option>
                          <option value="Aunt">Aunt</option>
                          <option value="Other">Other Guardian</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Occupation</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Engineer"
                          value={g.occupation} 
                          onChange={e => handleUpdateGuardian(g.id, 'occupation', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. +233 24 000 0000"
                          value={g.phone} 
                          onChange={e => handleUpdateGuardian(g.id, 'phone', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="e.g. parent@school.edu.gh"
                          value={g.email} 
                          onChange={e => handleUpdateGuardian(g.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 tabular-nums"
                        />
                      </div>
                      <div className="flex items-end h-full py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={g.isPrimaryPayer} 
                            onChange={e => handleUpdateGuardian(g.id, 'isPrimaryPayer', e.target.checked)}
                            className="rounded text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] w-4 h-4"
                          />
                          <span className="font-bold text-[16px] text-slate-600 uppercase tracking-wider">Primary Fee Payer</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: HEALTH & ACADEMIC */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                <Heart className="w-4 h-4 text-[var(--color-secondary)]" />
                <h3 className="font-bold text-xl">Health & Academic Profile</h3>
              </div>

              <div className="bg-teal-500/5 border border-teal-500/10 p-5 rounded-3xl space-y-4">
                <h4 className="font-bold text-lg text-teal-800">Medical Records</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Blood Group</label>
                    <select 
                      value={bloodGroup} 
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Allergies (if any)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Peanuts, Penicillin (Leave blank if none)"
                      value={allergies} 
                      onChange={e => setAllergies(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Chronic Conditions / Medications</label>
                    <textarea 
                      placeholder="List any ongoing health concerns, asthma, diabetes, etc."
                      value={conditions} 
                      onChange={e => setConditions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white h-20 resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Family Doctor Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Arthur"
                      value={doctorName} 
                      onChange={e => setDoctorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Doctor Contact Details</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +233 24 000 0001"
                      value={doctorPhone} 
                      onChange={e => setDoctorPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Profile */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-slate-700">Academic Background</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Core Strengths</label>
                    <textarea 
                      placeholder="e.g. Mathematics, Team leadership, Public Speaking" 
                      value={coreStrengths}
                      onChange={e => setCoreStrengths(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl h-20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Learning Challenges / Support Weaknesses</label>
                    <textarea 
                      placeholder="List areas requiring extra support, Dyslexia assistance, remedial classes..." 
                      value={challenges}
                      onChange={e => setChallenges(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl h-20 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: LOGISTICS & FINANCE */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                <DollarSign className="w-4 h-4 text-[var(--color-secondary)]" />
                <h3 className="font-bold text-xl">Logistics & Finance</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Transport & Boarding */}
                <div className="bg-white p-2.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-800 border-b border-slate-100 pb-2 font-bold">
                    <Navigation className="w-4 h-4 text-indigo-500" />
                    <span>Transport & Boarding</span>
                  </div>

                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1.5">School Bus Transport?</label>
                    <select 
                      value={usesTransport} 
                      onChange={e => setUsesTransport(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                    >
                      <option value="No, private transport">No, private transport</option>
                      <option value="Yes, assigned route A">Yes, assigned route A (Adenta)</option>
                      <option value="Yes, assigned route B">Yes, assigned route B (East Legon)</option>
                      <option value="Yes, assigned route C">Yes, assigned route C (Tema)</option>
                    </select>
                  </div>
                </div>

                {/* Financial Setup */}
                <div className="bg-white p-2.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-800 border-b border-slate-100 pb-2 font-bold">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>Financial Setup</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Fee Plan *</label>
                      <select 
                        value={feePlan} 
                        onChange={e => setFeePlan(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      >
                        <option value="Standard Tuition">Standard Tuition</option>
                        <option value="International Plan">International Plan</option>
                        <option value="Custom Plan">Custom Plan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Scholarship / Financial Aid</label>
                      <select 
                        value={scholarship} 
                        onChange={e => setScholarship(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      >
                        <option value="None">None</option>
                        <option value="Academic Merit (100%)">Academic Merit (100%)</option>
                        <option value="Sports Scholarship (50%)">Sports Scholarship (50%)</option>
                        <option value="Financial Hardship Aid">Financial Aid (25%)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Billing Cycle</label>
                      <select 
                        value={paymentFreq} 
                        onChange={e => setPaymentFreq(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      >
                        <option value="Full Year">Full Year Payments</option>
                        <option value="Termly">Termly Payments</option>
                        <option value="Monthly">Monthly Instalments</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 6: DOCUMENTS & CONSENT */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                <FolderOpen className="w-4 h-4 text-[var(--color-secondary)]" />
                <h3 className="font-bold text-xl">Required Documentation & Consent</h3>
              </div>

              {/* Attachments Section */}
              <div className="bg-slate-100 p-5 rounded-3xl space-y-4 border border-slate-200">
                <h4 className="font-bold text-lg text-slate-700">Required Documents Upload Checklist</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'birth', label: 'Birth Certificate' },
                    { key: 'passport', label: 'Passport ID / National Card' },
                    { key: 'transfer', label: 'School Transfer Letter' },
                    { key: 'medical', label: 'Medical History Records' },
                    { key: 'grades', label: 'Previous Academic Results' }
                  ].map(docItem => (
                    <div key={docItem.key} className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${attachedFiles[docItem.key] ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="font-bold text-slate-700 text-[17px]">{docItem.label}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleSimulateAttachment(docItem.key)}
                        className={`px-3 py-1 text-[16px] font-bold rounded-lg cursor-pointer transition ${
                          attachedFiles[docItem.key] 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                            : 'bg-[var(--color-secondary)]/5 hover:bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/15'
                        }`}
                      >
                        {attachedFiles[docItem.key] ? 'Attached ✓' : 'Attach File'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreement checks */}
              <div className="p-5 border border-slate-200 bg-white rounded-3xl space-y-4">
                <h4 className="font-bold text-lg text-slate-800">Consent & Regulations compliance</h4>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={consentEnrollment} 
                      onChange={e => setConsentEnrollment(e.target.checked)}
                      className="rounded text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] w-4 h-4 shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 text-[17px] block">Parent/Guardian Enrollment Consent *</span>
                      <span className="text-[16px] text-slate-500">I hereby certify that the information provided is premium, accurate, and I authorize the school of Zira to enroll the student.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={consentDataPrivacy} 
                      onChange={e => setConsentDataPrivacy(e.target.checked)}
                      className="rounded text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] w-4 h-4 shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 text-[17px] block">Data Privacy & Protection Agreement *</span>
                      <span className="text-[16px] text-slate-500">Agree to the school's data handling policy in accordance with regional regulations and cloud storage.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={consentMedia} 
                      onChange={e => setConsentMedia(e.target.checked)}
                      className="rounded text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] w-4 h-4 shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 text-[17px] block">Media & Publicity Consent</span>
                      <span className="text-[16px] text-slate-500">Give permission to include the student inside school newsletter, yearbooks, and promotional media.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Action button bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-2 py-2 bg-white hover:bg-slate-100 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] text-slate-700 disabled:opacity-50 text-[17px] font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && (!firstName.trim() || !lastName.trim())) {
                  toast.success('First Name and Last Name must be completed before progressing.');
                  return;
                }
                setCurrentStep(prev => prev + 1);
              }}
              className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] text-white text-[17px] font-bold rounded-xl transition flex items-center gap-1 shadow-md shadow-[var(--color-secondary)]/15 cursor-pointer"
            >
              Continue to {steps[currentStep].label} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!consentEnrollment || !consentDataPrivacy}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[17px] font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Complete Enrollment
            </button>
          )}
        </div>

    </div>
  );
}
