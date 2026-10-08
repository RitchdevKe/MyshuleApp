"use server";

import prisma from "@/lib/prisma";

export async function getClasses() {
  const classes = await prisma.class.findMany({
    select: { name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });
  return classes.map(c => c.name);
}

export async function getTerms() {
  const terms = await prisma.academicTerm.findMany({
    select: { name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });
  return terms.map(t => t.name);
}

export async function getStudentsReport(className?: string, termName?: string) {
  // Fetch students, optionally filtering by class
  const students = await prisma.student.findMany({
    where: {
      ...(className && {
        enrollments: {
          some: {
            class: {
              name: className
            }
          }
        }
      })
    },
    include: {
      examResults: {
        where: {
          ...(termName && {
            exam: {
              academicTerm: {
                name: termName
              }
            }
          })
        },
        include: {
          subject: true,
        }
      },
      enrollments: {
        include: {
          class: true
        }
      }
    },
  });

  // Subjects in a fixed order for the report, or dynamically from DB
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" }
  });
  const subjectNames = subjects.map(s => s.name);

  // If no subjects exist in DB, fallback to default
  const defaultSubjects = ["Math", "English", "Kiswahili", "Science", "SST", "CRE", "Creative Arts"];
  const finalSubjects = subjectNames.length > 0 ? subjectNames : defaultSubjects;

  const data = students.map((student) => {
    // Map scores to finalSubjects array in order
    const scores = finalSubjects.map((subName) => {
      const result = student.examResults.find(r => r.subject?.name === subName);
      return result?.numericScore || 0;
    });

    return {
      admNo: student.admissionNumber,
      name: `${student.firstName} ${student.lastName}`,
      gender: student.gender === "MALE" ? "M" : student.gender === "FEMALE" ? "F" : "M", // Fallback
      scores,
    };
  });

  return { data, subjects: finalSubjects };
}
