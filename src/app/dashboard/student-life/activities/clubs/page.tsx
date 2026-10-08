import React from "react";
import prisma from "@/lib/prisma";
import ClubsClient from "./ClubsClient";

export default async function ClubsPage() {
  const clubs = await prisma.extracurricularActivity.findMany({
    where: { activityType: "CLUB" },
    include: {
      patron: true,
      memberships: true,
    },
    orderBy: { name: "asc" },
  });

  const staff = await prisma.staff.findMany({
    orderBy: { firstName: "asc" },
  });

  const students = await prisma.student.findMany({
    orderBy: { firstName: "asc" },
    take: 200,
  });

  return <ClubsClient initialClubs={clubs} staff={staff} students={students} />;
}
