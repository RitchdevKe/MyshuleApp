import { getLessonPlanningOverview } from "@/app/actions/lessonPlanning";
import LessonPlanningClient from "./LessonPlanningClient";

export default async function LessonPlanningPage() {
  const overview = await getLessonPlanningOverview();
  return <LessonPlanningClient overview={overview} />;
}