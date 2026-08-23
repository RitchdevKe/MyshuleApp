'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Gender, ParentRelationship, StudentStatus } from '@prisma/client';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getEnrollmentFormData() {
  const [classes, streams, academicYears] = await Promise.all([
    prisma.class.findMany({ where: { tenantId: DEFAULT_TENANT_ID } }),
    prisma.stream.findMany({ where: { tenantId: DEFAULT_TENANT_ID } }),
    prisma.academicYear.findMany({ where: { tenantId: DEFAULT_TENANT_ID, isActiveYear: true } }),
  ]);

  return {
    classes,
    streams,
    academicYear: academicYears[0] || null,
  };
}

export async function enrollStudent(data: any) {
  try {
    const gender = data.gender === 'M' ? 'MALE' : 'FEMALE';
    const dob = data.dob ? new Date(data.dob) : new Date();
    const enrollmentDate = data.admissionDate ? new Date(data.admissionDate) : new Date();

    const medicalConditions = [
      data.bloodGroup ? `Blood Group: ${data.bloodGroup}` : '',
      data.allergies ? `Allergies: ${data.allergies}` : '',
      data.medicalConditions ? `Conditions: ${data.medicalConditions}` : '',
      data.doctorName ? `Doctor: ${data.doctorName} (${data.doctorPhone})` : ''
    ].filter(Boolean).join(' | ');

    await prisma.$transaction(async (tx) => {
      let parentUser = await tx.user.findFirst({
        where: { email: data.guardianEmail || `${data.guardianPhone}@placeholder.com` }
      });

      if (!parentUser) {
        parentUser = await tx.user.create({
          data: {
            email: data.guardianEmail || `${data.guardianPhone}@placeholder.com`,
            phoneNumber: data.guardianPhone || undefined,
            passwordHash: 'dummy_hash_for_now',
            status: 'ACTIVE',
          }
        });
      }

      let parent = await tx.parent.findFirst({
        where: { userId: parentUser.id, tenantId: DEFAULT_TENANT_ID }
      });

      if (!parent) {
        const nameParts = (data.guardianName || 'Unknown Parent').split(' ');
        parent = await tx.parent.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            userId: parentUser.id,
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' ') || 'Parent',
            phonePrimary: data.guardianPhone || '',
            residentialAddress: data.homeAddress || '',
          }
        });
      }

      const admissionNumber = data.nationalId || `ADM-${Math.floor(Math.random() * 10000)}`;
      const student = await tx.student.create({
        data: {
          tenantId: DEFAULT_TENANT_ID,
          firstName: data.firstName || 'Unknown',
          lastName: [data.middleName, data.lastName].filter(Boolean).join(' ') || 'Student',
          admissionNumber,
          dateOfBirth: dob,
          gender,
          medicalConditions,
          status: 'ACTIVE',
          enrollmentDate,
        }
      });

      let relationship = 'OTHER';
      if (data.guardianRelation?.toUpperCase() === 'MOTHER') relationship = 'MOTHER';
      else if (data.guardianRelation?.toUpperCase() === 'FATHER') relationship = 'FATHER';
      else if (data.guardianRelation?.toUpperCase() === 'GUARDIAN') relationship = 'GUARDIAN';

      await tx.studentParent.create({
        data: {
          tenantId: DEFAULT_TENANT_ID,
          studentId: student.id,
          parentId: parent.id,
          relationship: relationship as ParentRelationship,
          isEmergencyContact: true,
          isFinancialSponsor: true,
          canPickupFromSchool: true,
        }
      });

      if (data.academicYearId && data.classId && data.streamId) {
        await tx.studentEnrollment.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            studentId: student.id,
            academicYearId: data.academicYearId,
            classId: data.classId,
            streamId: data.streamId,
          }
        });
      }
    });

    revalidatePath('/dashboard/registration/admissions/applications');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to enroll student:', error);
    return { success: false, error: error.message };
  }
}
