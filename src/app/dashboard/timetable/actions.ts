"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const COLOR_PALETTES = [
  { icon: "📉", bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-800",    ringColor: "ring-blue-400" },
  { icon: "📝", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", ringColor: "ring-emerald-400" },
  { icon: "🔬", bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-800",  ringColor: "ring-violet-400" },
  { icon: "🏺", bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-800",   ringColor: "ring-amber-400" },
  { icon: "🌍", bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-800",     ringColor: "ring-sky-400" },
  { icon: "🎨", bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-800",    ringColor: "ring-pink-400" },
  { icon: "🕊️", bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-800",  ringColor: "ring-orange-400" },
  { icon: "💬", bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-800",    ringColor: "ring-teal-400" },
  { icon: "⚡", bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-800",  ringColor: "ring-indigo-400" },
  { icon: "🧪", bg: "bg-lime-50",    border: "border-lime-200",    text: "text-lime-800",    ringColor: "ring-lime-400" },
];

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export async function getTimetableData() {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }
  const tenantId = session.tenantId;

  // 1. Fetch Subjects
  const dbSubjects = await prisma.subject.findMany({
    where: { tenantId },
    select: { id: true, name: true }
  });

  // 2. Fetch Teachers
  const dbStaff = await prisma.staff.findMany({
    where: { tenantId, status: "ACTIVE" },
    select: { id: true, firstName: true, lastName: true }
  });

  // 3. Fetch Streams
  const dbStreams = await prisma.stream.findMany({
    where: { class: { tenantId } },
    select: { id: true, name: true, class: { select: { name: true } } }
  });

  // Transform Subjects
  const SUBJECTS = dbSubjects.length > 0 ? dbSubjects.map((s, i) => {
    const palette = COLOR_PALETTES[i % COLOR_PALETTES.length];
    return { name: s.name, ...palette };
  }) : [
    { name: "Mathematics", icon: "📉", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", ringColor: "ring-blue-400" },
    { name: "English", icon: "📝", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", ringColor: "ring-emerald-400" },
  ];

  // Transform Teachers
  const TEACHERS = dbStaff.length > 0 ? dbStaff.map((s, i) => {
    return {
      id: s.id,
      name: `${s.firstName[0]}. ${s.lastName}`,
      short: s.lastName,
      subject: SUBJECTS[i % SUBJECTS.length].name
    };
  }) : [
    { id: "t1", name: "Mr. Omondi", short: "Omondi", subject: "Mathematics" },
    { id: "t2", name: "Mrs. Wanjiku", short: "Wanjiku", subject: "English" },
  ];

  // Transform Classes
  const CLASSES = dbStreams.length > 0 
    ? dbStreams.map(s => `${s.class.name} ${s.name}`)
    : ["Form 1A", "Form 1B"];

  const ROOMS = ["Room 101", "Room 102", "Room 103", "Lab 1", "Lab 2", "Hall A", "Art Room", "Room 201", "Room 202", "Room 203"];

  const LESSON_TOPICS: Record<string, string[]> = {
    Mathematics: ["Quadratic Equations", "Trigonometry Basics", "Logarithms", "Matrices & Determinants", "Probability"],
    English: ["Essay Writing", "Grammar & Tenses", "Comprehension Skills", "Oral Literature", "Punctuation & Syntax"],
  };

  function getTopic(subjectName: string, classIdx: number, dayIdx: number, periodIdx: number): string {
    const topics = LESSON_TOPICS[subjectName] || ["General Lesson", "Revision", "Practical Work", "Group Discussion", "Assessment"];
    const idx = (classIdx * 7 + dayIdx * 3 + periodIdx) % topics.length;
    return topics[idx];
  }

  const LESSON_PERIODS = [
    { id: "p1" }, { id: "p2" }, { id: "p3" }, { id: "p4" }, 
    { id: "p5" }, { id: "p6" }, { id: "p7" }, { id: "p8" }
  ];

  const schedule: any[][][] = [];
  for (let c = 0; c < CLASSES.length; c++) {
    schedule[c] = [];
    for (let d = 0; d < 5; d++) {
      schedule[c][d] = [];
      const rng = seedRandom(c * 100 + d * 10 + 7);
      for (let p = 0; p < LESSON_PERIODS.length; p++) {
        // Find a random subject and teacher
        const subIdx = Math.floor(rng() * SUBJECTS.length);
        const subject = SUBJECTS[subIdx];
        
        // Try to find a teacher who teaches this subject, otherwise pick random
        const matchingTeachers = TEACHERS.filter(t => t.subject === subject.name);
        let teacher = matchingTeachers[0];
        if (!teacher) {
          teacher = TEACHERS[Math.floor(rng() * TEACHERS.length)];
        }

        const roomIdx = Math.floor(rng() * ROOMS.length);
        
        schedule[c][d][p] = {
          subject,
          teacher,
          room: ROOMS[roomIdx],
          topic: getTopic(subject.name, c, d, p),
        };
      }
    }
  }

  return {
    SUBJECTS,
    TEACHERS,
    CLASSES,
    ROOMS,
    SCHEDULE: schedule
  };
}
