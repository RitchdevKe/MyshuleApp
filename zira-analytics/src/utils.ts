/**
 * Kenyan KCSE-style grade mappings and points:
 * A  (80 - 100): 12 pts
 * A- (75 - 79) : 11 pts
 * B+ (70 - 74) : 10 pts
 * B  (65 - 69) : 9 pts
 * B- (60 - 64) : 8 pts
 * C+ (55 - 59) : 7 pts
 * C  (50 - 54) : 6 pts
 * C- (45 - 49) : 5 pts
 * D+ (40 - 44) : 4 pts
 * D  (35 - 39) : 3 pts
 * D- (30 - 34) : 2 pts
 * E  (0 - 29)  : 1 pt
 */
export function getSubjectGradeAndPoints(mark: number): { grade: string; points: number } {
  if (mark >= 80) return { grade: 'A', points: 12 };
  if (mark >= 75) return { grade: 'A-', points: 11 };
  if (mark >= 70) return { grade: 'B+', points: 10 };
  if (mark >= 65) return { grade: 'B', points: 9 };
  if (mark >= 60) return { grade: 'B-', points: 8 };
  if (mark >= 55) return { grade: 'C+', points: 7 };
  if (mark >= 50) return { grade: 'C', points: 6 };
  if (mark >= 45) return { grade: 'C-', points: 5 };
  if (mark >= 40) return { grade: 'D+', points: 4 };
  if (mark >= 35) return { grade: 'D', points: 3 };
  if (mark >= 30) return { grade: 'D-', points: 2 };
  return { grade: 'E', points: 1 };
}

export function getMeanGradeByPoints(avgPoints: number): string {
  if (avgPoints >= 11.5) return 'A';
  if (avgPoints >= 10.5) return 'A-';
  if (avgPoints >= 9.5) return 'B+';
  if (avgPoints >= 8.5) return 'B';
  if (avgPoints >= 7.5) return 'B-';
  if (avgPoints >= 6.5) return 'C+';
  if (avgPoints >= 5.5) return 'C';
  if (avgPoints >= 4.5) return 'C-';
  if (avgPoints >= 3.5) return 'D+';
  if (avgPoints >= 2.5) return 'D';
  if (avgPoints >= 1.5) return 'D-';
  return 'E';
}

export function getColorForGrade(grade: string): string {
  if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (grade.startsWith('B')) return 'text-teal-600 bg-teal-50 border-teal-200';
  if (grade.startsWith('C+')) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (grade.startsWith('C')) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
  if (grade.startsWith('D')) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-rose-600 bg-rose-50 border-rose-200';
}

export function getPointsForGrade(grade: string): number {
  switch (grade) {
    case 'A': return 12;
    case 'A-': return 11;
    case 'B+': return 10;
    case 'B': return 9;
    case 'B-': return 8;
    case 'C+': return 7;
    case 'C': return 6;
    case 'C-': return 5;
    case 'D+': return 4;
    case 'D': return 3;
    case 'D-': return 2;
    case 'E': return 1;
    default: return 0;
  }
}

export interface SubjectMarksMap {
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
}

export function calculateSummary(marks: SubjectMarksMap) {
  let totalPoints = 0;
  let totalMarks = 0;
  let count = 0;

  const keys = Object.keys(marks) as Array<keyof SubjectMarksMap>;
  keys.forEach((key) => {
    const score = marks[key];
    if (score !== undefined && score !== null && typeof score === 'number') {
      const calcResult = getSubjectGradeAndPoints(score);
      totalPoints += calcResult.points;
      totalMarks += score;
      count++;
    }
  });

  const averagePoints = count > 0 ? Number((totalPoints / count).toFixed(2)) : 0;
  const meanGrade = count > 0 ? getMeanGradeByPoints(averagePoints) : 'E';

  return {
    totalMarks,
    averagePoints,
    meanGrade,
    subjectCount: count
  };
}
