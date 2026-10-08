"use server";
import prisma from "@/lib/prisma";

export async function getAssessmentData(termId?: string, classId?: string) {
  // Base query for students
  const studentWhere: any = { status: "ACTIVE" };
  if (classId) {
    studentWhere.enrollments = { some: { classId } };
  }

  // Fetch students matching class
  const students = await prisma.student.findMany({
    where: studentWhere,
    include: {
      examResults: {
        where: termId ? { exam: { academicTermId: termId } } : {},
        include: { subject: true }
      }
    }
  });

  // Fetch all unique subjects these students took
  const allSubjects = new Set<string>();
  students.forEach(s => {
    s.examResults.forEach(r => allSubjects.add(r.subject.name));
  });
  const subjectsList = Array.from(allSubjects).sort();

  // Map to Marksheet format
  const marksheetData = students.map(s => {
    let total = 0;
    const scoresMap: Record<string, number> = {};
    s.examResults.forEach(r => {
      scoresMap[r.subject.name] = r.score;
      total += r.score;
    });

    const scores = subjectsList.map(sub => scoresMap[sub] ?? 0);
    const avg = s.examResults.length > 0 ? total / s.examResults.length : 0;
    
    return {
      admNo: s.admissionNumber,
      name: `${s.firstName} ${s.lastName}`,
      gender: s.gender,
      scores,
      total,
      avg: parseFloat(avg.toFixed(1)),
      prevTotal: 0 // Would need previous term fetch to do this accurately
    };
  });

  return {
    subjects: subjectsList,
    students: marksheetData
  };
}

export async function getAssessmentFilterOptions() {
  const [terms, classes] = await Promise.all([
    prisma.academicTerm.findMany({ orderBy: { startDate: "desc" } }),
    prisma.class.findMany({ orderBy: { name: "asc" } })
  ]);
  return { terms, classes };
}
