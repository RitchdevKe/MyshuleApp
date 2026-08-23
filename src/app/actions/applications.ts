'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ApplicationStage } from '@prisma/client';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getApplications() {
  try {
    const apps = await prisma.admissionApplication.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: apps };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createApplication(data: any) {
  try {
    const count = await prisma.admissionApplication.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });
    const year = new Date().getFullYear();
    const gradeCode = data.grade.replace(/\s+/g, "").replace("Grade", "G").replace("Pre-Primary", "PP");
    const admissionNumber = `${year}-${gradeCode}-${String(count + 1).padStart(3, "0")}`;

    const newApp = await prisma.admissionApplication.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        admissionNumber,
        studentName: data.name,
        grade: data.grade,
        parentName: data.parent,
        parentPhone: data.phone,
        parentEmail: data.email || null,
        formData: data.formData || null,
        stage: 'APPLIED',
      }
    });

    revalidatePath('/dashboard/registration/admissions');
    revalidatePath('/dashboard/registration/admissions/applications');
    return { success: true, data: newApp };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

  export async function updateApplicationStage(id: string, stage: ApplicationStage) {
    try {
      const app = await prisma.admissionApplication.update({
        where: { id },
        data: { stage }
      });
  
      if (stage === 'ADMITTED') {
        const formData: any = app.formData || {};
        const gender = formData.gender === 'Male' ? 'MALE' : 'FEMALE';
        const dob = formData.dob ? new Date(formData.dob) : new Date();
        const parentEmail = app.parentEmail || `${app.parentPhone}@placeholder.com`;
        
        let parentUser = await prisma.user.findFirst({
          where: { email: parentEmail }
        });
        if (!parentUser) {
          parentUser = await prisma.user.create({
            data: {
              email: parentEmail,
              phoneNumber: app.parentPhone,
              passwordHash: 'dummy_hash',
              status: 'ACTIVE',
            }
          });
        }
  
        const nameParts = app.parentName.split(' ');
        let parent = await prisma.parent.findFirst({
          where: { userId: parentUser.id, tenantId: DEFAULT_TENANT_ID }
        });
        if (!parent) {
          parent = await prisma.parent.create({
            data: {
              tenantId: DEFAULT_TENANT_ID,
              userId: parentUser.id,
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(' ') || 'Parent',
              phonePrimary: app.parentPhone,
              residentialAddress: formData.homeAddress || '',
            }
          });
        }
  
        const sFirstName = formData.firstName || app.studentName.split(' ')[0];
        const sMiddleName = formData.middleName || '';
        const sLastName = formData.lastName || app.studentName.split(' ').slice(1).join(' ') || 'Student';

        const student = await prisma.student.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            firstName: sFirstName,
            lastName: sLastName,
            admissionNumber: app.admissionNumber,
            dateOfBirth: dob,
            gender,
            status: 'ACTIVE',
            enrollmentDate: new Date(),
          }
        });
  
        await prisma.studentParent.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            studentId: student.id,
            parentId: parent.id,
            relationship: 'OTHER',
          }
        });
      }
  
      revalidatePath('/dashboard/registration/admissions');
      revalidatePath('/dashboard/registration/admissions/applications');
      return { success: true, data: app };
    } catch (error: any) {
      console.error('Update App Stage Error:', error);
      return { success: false, error: error.message };
    }
  }

export async function deleteApplication(id: string) {
  try {
    await prisma.admissionApplication.delete({
      where: { id }
    });
    revalidatePath('/dashboard/registration/admissions');
    revalidatePath('/dashboard/registration/admissions/applications');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
