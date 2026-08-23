export type Gender = 'M' | 'F';
export type ExamStatus = 'active' | 'completed';
export type FeePaymentType = 'M-Pesa' | 'Cash' | 'Bank Deposit';
export type SmsStatus = 'sent' | 'failed';
export type SmsType = 'exam' | 'fee' | 'announcement';

export type ApplicantStatus = 
  | 'applied' 
  | 'under_review' 
  | 'docs_missing' 
  | 'interview' 
  | 'tested' 
  | 'accepted' 
  | 'payment' 
  | 'enrolled'
  | 'rejected'
  | 'waitlist';

export interface Applicant {
  id: string;
  name: string;
  gender: Gender;
  dob: string;
  email: string;
  phone: string;
  nationality: string;
  grade: string;
  academicYear: string;
  previousSchool: string;
  transferReason: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianOccupation: string;
  medicalBloodGroup: string;
  medicalAllergies: string;
  medicalConditions: string;
  transportMode: string;
  feePlan: string;
  scholarship: string;
  paymentFreq: string;
  status: ApplicantStatus;
  appliedDate: string;
  notes?: string;
  interviewDate?: string;
  examScore?: string;
}

export interface RolePermissions {
  [category: string]: {
    [page: string]: boolean;
  };
}

export interface Student {
  id: string; // admission number
  admissionNo: string;
  name: string;
  gender: Gender;
  form: any; // e.g., 'Grade 1', 'Form 1'
  stream: string; // East, West, North, etc.
  feeBalance: number;
  totalFees: number;
  attendancePercentage: number;
  status?: 'Active' | 'Suspended' | 'Graduated' | 'Withdrawn';
  email?: string;
  phone?: string;
  dob?: string;
  admissionDate?: string;
  nationality?: string;
  nationalId?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianOccupation?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;
  doctorName?: string;
  doctorPhone?: string;
  coreStrengths?: string;
  challenges?: string;
  usesTransport?: string;
  feePlan?: string;
  scholarship?: string;
  paymentFreq?: string;
}

export interface Exam {
  id: string;
  name: string;
  year: number;
  term: number; // 1, 2, 3
  status: ExamStatus;
}

export interface MarkSheet {
  studentId: string;
  studentName: string;
  form: any;
  stream: string;
  english?: number;
  kiswahili?: number;
  mathematics?: number;
  biology?: number;
  chemistry?: number;
  physics?: number;
  history?: number;
  geography?: number;
  cre?: number;
  business?: number;
  agriculture?: number;
  totalMarks: number;
  averagePoints: number; // 1 to 12 scale
  meanGrade: string; // A, A-, B+, etc.
  streamPosition?: number;
  classPosition?: number;
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  type: FeePaymentType;
  reference: string;
  receivedBy: string;
}

export interface SmsLog {
  id: string;
  studentId: string;
  studentName: string;
  recipient: string;
  message: string;
  sentAt: string;
  status: SmsStatus;
  type: SmsType;
}

export interface Teacher {
  email: string;
  name: string;
  role: string;
  subjectSpecialization: string[];
}

export interface TenantSchool {
  id: string;
  name: string;
  code: string;
  subscriptionPlan: 'Bronze' | 'Silver' | 'Gold' | 'Premium';
  status: 'active' | 'suspended' | 'trial';
  studentCount: number;
  smsCredits: number;
  contactEmail: string;
  contactPhone: string;
  annualFeeKsh: number;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  registeredDate: string;
  principalName: string;
  meanKCSE: number;
}

export interface GlobalSmsBroadcast {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  audience: string;
  sentBy: string;
  count: number;
}

export interface TenantInvoice {
  id: string;
  schoolId: string;
  schoolName: string;
  amountKsh: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  description: string;
}

export interface SchoolSettings {
  schoolName: string;
  logo: string; // Base64 or URL
  updatedAt?: string;
}
