import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase.ts';
import { Student, Exam, MarkSheet, FeeTransaction, SmsLog } from './types.ts';
import { calculateSummary } from './utils.ts';

const SAMPLE_STUDENTS = [
  { name: 'Kevin Kiprop', gender: 'M', form: 4, stream: 'East', admin: 'ADM-2041', feesPaid: 45000, totalFees: 45000, attendance: 98 },
  { name: 'Faith Wanjiku', gender: 'F', form: 4, stream: 'East', admin: 'ADM-2042', feesPaid: 35000, totalFees: 45000, attendance: 95 },
  { name: 'Amos Kibet', gender: 'M', form: 4, stream: 'East', admin: 'ADM-2043', feesPaid: 40000, totalFees: 45000, attendance: 92 },
  { name: 'Mercy Chepwogen', gender: 'F', form: 4, stream: 'East', admin: 'ADM-2044', feesPaid: 45000, totalFees: 45000, attendance: 99 },
  { name: 'John Mwangi', gender: 'M', form: 4, stream: 'East', admin: 'ADM-2045', feesPaid: 20000, totalFees: 45000, attendance: 85 },
  { name: 'Mary Atieno', gender: 'F', form: 4, stream: 'East', admin: 'ADM-2046', feesPaid: 45000, totalFees: 45000, attendance: 94 },
  { name: 'David Omwamba', gender: 'M', form: 4, stream: 'East', admin: 'ADM-2047', feesPaid: 15000, totalFees: 45000, attendance: 88 },
  
  { name: 'Joyce Mwende', gender: 'F', form: 4, stream: 'West', admin: 'ADM-2048', feesPaid: 43000, totalFees: 45000, attendance: 96 },
  { name: 'Emmanuel Juma', gender: 'M', form: 4, stream: 'West', admin: 'ADM-2049', feesPaid: 45000, totalFees: 45000, attendance: 97 },
  { name: 'Esther Nekesa', gender: 'F', form: 4, stream: 'West', admin: 'ADM-2050', feesPaid: 30000, totalFees: 45000, attendance: 91 },
  { name: 'Simon Kamau', gender: 'M', form: 4, stream: 'West', admin: 'ADM-2051', feesPaid: 25000, totalFees: 45000, attendance: 89 },
  { name: 'Sharon Chelimo', gender: 'F', form: 4, stream: 'West', admin: 'ADM-2052', feesPaid: 45000, totalFees: 45000, attendance: 100 },
  
  { name: 'Dennis Mutua', gender: 'M', form: 3, stream: 'East', admin: 'ADM-2053', feesPaid: 40000, totalFees: 42000, attendance: 93 },
  { name: 'Lydia Wambui', gender: 'F', form: 3, stream: 'East', admin: 'ADM-2054', feesPaid: 42000, totalFees: 42000, attendance: 96 },
  { name: 'Timothy Kipkoech', gender: 'M', form: 3, stream: 'East', admin: 'ADM-2055', feesPaid: 10000, totalFees: 42000, attendance: 82 },
  { name: 'Grace Mutheu', gender: 'F', form: 3, stream: 'East', admin: 'ADM-2056', feesPaid: 42000, totalFees: 42000, attendance: 97 },
  
  { name: 'Brian Onyango', gender: 'M', form: 3, stream: 'West', admin: 'ADM-2057', feesPaid: 32000, totalFees: 42000, attendance: 94 },
  { name: 'Ruth Chelangat', gender: 'F', form: 3, stream: 'West', admin: 'ADM-2058', feesPaid: 42000, totalFees: 42000, attendance: 98 },
  { name: 'Peter Ndwiga', gender: 'M', form: 3, stream: 'West', admin: 'ADM-2059', feesPaid: 21000, totalFees: 42000, attendance: 87 },
  { name: 'Sarah Wairimu', gender: 'F', form: 3, stream: 'West', admin: 'ADM-2060', feesPaid: 42000, totalFees: 42000, attendance: 95 }
];

const SAMPLE_EXAMS: Exam[] = [
  { id: 'term1_midterm_2026', name: '2026 Term 1 Mid-Term', year: 2026, term: 1, status: 'active' },
  { id: 'term1_end_2026', name: '2026 Term 1 End-Term', year: 2026, term: 1, status: 'completed' },
  { id: 'term3_end_2025', name: '2025 Term 3 End-Term', year: 2025, term: 3, status: 'completed' }
];

// Helper to generate marks using consistent formula so they build repeatable scores
function generateStudentMarks(studentAdmin: string, examId: string) {
  // Use sum of characters in admin and examId as seed
  let seed = 0;
  for (let i = 0; i < studentAdmin.length; i++) seed += studentAdmin.charCodeAt(i);
  for (let i = 0; i < examId.length; i++) seed += examId.charCodeAt(i);

  function getSubjectScore(factor: number): number {
    const val = (seed * factor) % 61 + 35; // Scores from 35 to 95
    return Math.floor(val);
  }

  return {
    mathematics: getSubjectScore(7),
    english: getSubjectScore(11),
    kiswahili: getSubjectScore(13),
    biology: getSubjectScore(17),
    chemistry: getSubjectScore(19),
    physics: getSubjectScore(23),
    history: getSubjectScore(29),
    geography: getSubjectScore(31),
    cre: getSubjectScore(37),
    business: getSubjectScore(41),
    agriculture: getSubjectScore(43)
  };
}

export async function isDatabaseEmpty(): Promise<boolean> {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    return studentsSnap.empty;
  } catch (err) {
    console.error('Error checking if db is empty:', err);
    return true;
  }
}

export async function seedDatabase() {
  console.log('Seeding Firestore Database with Karega Secondary School academic registers...');
  const batchValue = writeBatch(db);

  // 1. Seed Students
  const studentsList: Student[] = SAMPLE_STUDENTS.map((s) => ({
    id: s.admin,
    admissionNo: s.admin,
    name: s.name,
    gender: s.gender as 'M' | 'F',
    form: s.form,
    stream: s.stream,
    feeBalance: s.totalFees - s.feesPaid,
    totalFees: s.totalFees,
    attendancePercentage: s.attendance
  }));

  studentsList.forEach((stud) => {
    const ref = doc(db, 'students', stud.id);
    batchValue.set(ref, stud);
  });

  // 2. Seed Exams
  SAMPLE_EXAMS.forEach((exam) => {
    const ref = doc(db, 'exams', exam.id);
    batchValue.set(ref, exam);
  });

  // Compile Marks Sheets
  SAMPLE_EXAMS.forEach((exam) => {
    const examMarksSheets: MarkSheet[] = studentsList.map((stud) => {
      const subjectMarks = generateStudentMarks(stud.id, exam.id);
      const summAttr = calculateSummary(subjectMarks);

      return {
        studentId: stud.id,
        studentName: stud.name,
        form: stud.form,
        stream: stud.stream,
        ...subjectMarks,
        totalMarks: summAttr.totalMarks,
        averagePoints: summAttr.averagePoints,
        meanGrade: summAttr.meanGrade
      };
    });

    // Sort to rank students to calculate rankings
    // Class ranking
    examMarksSheets.sort((a, b) => b.totalMarks - a.totalMarks);
    examMarksSheets.forEach((sheet, idx) => {
      sheet.classPosition = idx + 1;
    });

    // Stream ranking grouped
    const streamsGroup = ['East', 'West'];
    streamsGroup.forEach((st) => {
      const streamSheets = examMarksSheets.filter((s) => s.stream === st);
      streamSheets.sort((a, b) => b.totalMarks - a.totalMarks);
      streamSheets.forEach((sheet, idx) => {
        sheet.streamPosition = idx + 1;
      });
    });

    // Write Marks
    examMarksSheets.forEach((sheet) => {
      const mref = doc(db, 'exams', exam.id, 'marks', sheet.studentId);
      batchValue.set(mref, sheet);
    });
  });

  // 3. Seed Fee Transactions
  const feeTxList: FeeTransaction[] = [
    {
      id: "tx-2001",
      studentId: "ADM-2041",
      studentName: "Kevin Kiprop",
      amount: 15000,
      date: "2026-05-10T10:30:00Z",
      type: "M-Pesa",
      reference: "QER5TY78IO",
      receivedBy: "Daniel Gitumu Hia"
    },
    {
      id: "tx-2002",
      studentId: "ADM-2042",
      studentName: "Faith Wanjiku",
      amount: 25000,
      date: "2026-05-12T14:15:00Z",
      type: "Bank Deposit",
      reference: "CBK-983021",
      receivedBy: "Daniel Gitumu Hia"
    },
    {
      id: "tx-2003",
      studentId: "ADM-2045",
      studentName: "John Mwangi",
      amount: 10000,
      date: "2026-05-15T09:00:00Z",
      type: "Cash",
      reference: "CSH-39201",
      receivedBy: "Daniel Gitumu Hia"
    },
    {
      id: "tx-2004",
      studentId: "ADM-2053",
      studentName: "Dennis Mutua",
      amount: 40000,
      date: "2026-05-20T11:45:00Z",
      type: "M-Pesa",
      reference: "QYT9XW42MN",
      receivedBy: "Finance Office"
    }
  ];

  feeTxList.forEach((tx) => {
    const txRef = doc(db, 'fee_transactions', tx.id);
    batchValue.set(txRef, tx);
  });

  // 4. Seed SMS Logs
  const smsLogs: SmsLog[] = [
    {
      id: "sms-3001",
      studentId: "ADM-2041",
      studentName: "Kevin Kiprop",
      recipient: "+254712345678",
      message: "Dear Parent, Kevin Kiprop's core average in 2025 Term 3 End-Term is B+ (Mean Points 9.6). Class Position: 2/30. Please settle 0 KES balance. Zira Alerts.",
      sentAt: "2025-12-05T16:00:00Z",
      status: "sent",
      type: "exam"
    },
    {
      id: "sms-3002",
      studentId: "ADM-2045",
      studentName: "John Mwangi",
      recipient: "+254722998877",
      message: "Dear Parent, school fees invoice for John Mwangi Term 1 2026 is 45,000 KES. Balance remaining is 25,000 KES. Settle by bankers cheque. Karega Office.",
      sentAt: "2026-01-08T08:30:00Z",
      status: "sent",
      type: "fee"
    },
    {
      id: "sms-3003",
      studentId: "ADM-2043",
      studentName: "Amos Kibet",
      recipient: "+254733445566",
      message: "Dear Parents and Guardians, Karega Secondary School Term 1 2026 Halfterm begins on June 3rd. Students must report back on June 8th. Principal.",
      sentAt: "2026-05-25T12:00:00Z",
      status: "sent",
      type: "announcement"
    }
  ];

  smsLogs.forEach((log) => {
    const ref = doc(db, 'sms_logs', log.id);
    batchValue.set(ref, log);
  });

  // 5. Seed School Settings
  const settingsRef = doc(db, 'settings', 'karega');
  batchValue.set(settingsRef, {
    schoolName: 'ZIRA ACADEMY',
    logo: ''
  });

  await batchValue.commit();
  console.log('Seeding successfully completed!');
}
