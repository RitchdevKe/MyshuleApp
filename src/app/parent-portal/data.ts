import { cache } from 'react';
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getParentPortalData = cache(async () => {
  const session = await getSession();
  if (!session?.userId || !session?.tenantId) {
    return { session: null, parent: null, activeStudent: null, students: [] };
  }

  const parent = await prisma.parent.findFirst({
    where: { userId: session.userId, tenantId: session.tenantId },
    include: {
      students: {
        include: {
          student: {
            include: {
              enrollments: {
                where: { academicYear: { isActiveYear: true } },
                include: { class: true, stream: true },
                take: 1
              },
              parents: {
                include: {
                  parent: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      tenant: true, user: true,
    }
  });

  if (!parent) {
    return { session, parent: null, activeStudent: null, students: [] };
  }

  const students = parent.students.map(sp => sp.student);
  const activeStudent = students[0] || null;

  return { session, parent, activeStudent, students };
});

