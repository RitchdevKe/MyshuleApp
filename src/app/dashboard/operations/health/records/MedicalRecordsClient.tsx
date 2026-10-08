"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  User,
  AlertTriangle,
  ShieldCheck,
  HeartPulse,
  Edit,
  Trash,
  X,
  Activity,
  Syringe,
  Droplets,
} from "lucide-react";
import {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "./actions";
import { useRouter } from "next/navigation";

type MedicalRecordWithStudent = {
  id: string;
  studentId: string;
  bloodGroup: string | null;
  allergies: string | null;
  conditions: string | null;
  immunizations: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    enrollments: {
      class: { name: string };
    }[];
  };
};

type StudentOption = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  enrollments: {
    class: { name: string };
  }[];
  medicalRecord: { id: string } | null;
};

export default function MedicalRecordsClient({
  initialRecords,
  initialStudents,
}: {
  initialRecords: MedicalRecordWithStudent[];
  initialStudents: StudentOption[];
}) {
  const router = useRouter();
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All Severities");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<MedicalRecordWithStudent | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    immunizations: "",
    notes: "",
  });

  // --- Helpers for severity derivation ---
  const getSeverity = (record: MedicalRecordWithStudent) => {
    const cond = (record.conditions || "").toLowerCase();
    if (!cond || cond === "none") return "None";
    if (
      cond.includes("diabetes") ||
      cond.includes("asthma") ||
      cond.includes("epilepsy") ||
      cond.includes("heart")
    )
      return "High";
    if (
      cond.includes("allerg") ||
      cond.includes("migraine") ||
      cond.includes("anemia")
    )
      return "Medium";
    return "Low";
  };

  const getClassName = (
    student: MedicalRecordWithStudent["student"]
  ): string => {
    return student.enrollments?.[0]?.class?.name || "—";
  };

  // --- Aggregated stats ---
  const totalRecords = records.length;
  const highRiskCount = records.filter((r) => getSeverity(r) === "High").length;
  const withAllergies = records.filter(
    (r) => r.allergies && r.allergies.toLowerCase() !== "none" && r.allergies.trim() !== ""
  ).length;
  const withConditions = records.filter(
    (r) => r.conditions && r.conditions.toLowerCase() !== "none" && r.conditions.trim() !== ""
  ).length;

  // --- Filtering ---
  const filteredRecords = records.filter((r) => {
    const name =
      `${r.student.firstName} ${r.student.lastName}`.toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      r.student.admissionNumber.toLowerCase().includes(search.toLowerCase());

    if (severityFilter === "All Severities") return matchesSearch;

    const severity = getSeverity(r);
    if (severityFilter === "High Risk") return matchesSearch && severity === "High";
    if (severityFilter === "Medium Risk")
      return matchesSearch && severity === "Medium";
    if (severityFilter === "Low Risk") return matchesSearch && severity === "Low";
    return matchesSearch;
  });

  // Students available for new records (no existing medical record)
  const availableStudents = initialStudents.filter((s) => !s.medicalRecord);

  // --- Modal handlers ---
  const handleOpenModal = (record: MedicalRecordWithStudent | null = null) => {
    if (record) {
      setEditMode(true);
      setSelectedRecord(record);
      setFormData({
        studentId: record.studentId,
        bloodGroup: record.bloodGroup || "",
        allergies: record.allergies || "",
        conditions: record.conditions || "",
        immunizations: record.immunizations || "",
        notes: record.notes || "",
      });
    } else {
      setEditMode(false);
      setSelectedRecord(null);
      setFormData({
        studentId: "",
        bloodGroup: "",
        allergies: "",
        conditions: "",
        immunizations: "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode && selectedRecord) {
        const updated = await updateMedicalRecord(selectedRecord.id, {
          bloodGroup: formData.bloodGroup,
          allergies: formData.allergies,
          conditions: formData.conditions,
          immunizations: formData.immunizations,
          notes: formData.notes,
        });
        setRecords(
          records.map((r) => (r.id === selectedRecord.id ? updated : r))
        );
      } else {
        const created = await createMedicalRecord({
          studentId: formData.studentId,
          bloodGroup: formData.bloodGroup,
          allergies: formData.allergies,
          conditions: formData.conditions,
          immunizations: formData.immunizations,
          notes: formData.notes,
        });
        setRecords([created, ...records]);
      }
      handleCloseModal();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save medical record.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this medical record?")) {
      try {
        await deleteMedicalRecord(id);
        setRecords(records.filter((r) => r.id !== id));
        router.refresh();
      } catch (err) {
        console.error(err);
        alert("Failed to delete medical record.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Records
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {totalRecords}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">High Risk</p>
              <h3 className="text-2xl font-black text-slate-800">
                {highRiskCount}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                With Allergies
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {withAllergies}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                With Conditions
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {withConditions}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl hidden md:block">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">
                Medical Records
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Manage student health profiles, allergies, and chronic
                conditions.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
          >
            <Plus className="w-4 h-4" />
            New Record
          </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Student Name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Severities</option>
              <option>High Risk</option>
              <option>Medium Risk</option>
              <option>Low Risk</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Student Info
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Blood Type
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Conditions &amp; Allergies
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Immunizations
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-500 font-medium"
                    >
                      No medical records found.
                    </td>
                  </tr>
                )}
                {filteredRecords.map((record) => {
                  const severity = getSeverity(record);
                  const className = getClassName(record.student);
                  const conditionLabel = record.conditions || "None";
                  const allergyLabel = record.allergies || "None";

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-sm leading-tight block mb-0.5">
                              {record.student.firstName}{" "}
                              {record.student.lastName}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              <span>{record.student.admissionNumber}</span>
                              <span>•</span>
                              <span>{className}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600 font-black text-[11px] border border-rose-100">
                          {record.bloodGroup || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border ${
                                severity === "High"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : severity === "Medium"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : severity === "Low"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >
                              {conditionLabel}
                            </span>
                          </div>
                          {allergyLabel.toLowerCase() !== "none" &&
                            allergyLabel.trim() !== "" && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                                <AlertTriangle className="w-3 h-3" /> Allergies:{" "}
                                {allergyLabel}
                              </div>
                            )}
                          {(allergyLabel.toLowerCase() === "none" ||
                            allergyLabel.trim() === "") &&
                            (conditionLabel.toLowerCase() === "none" ||
                              conditionLabel.trim() === "") && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <ShieldCheck className="w-3 h-3" /> No known
                                conditions
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium text-slate-700">
                          {record.immunizations || "—"}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleOpenModal(record)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                          <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1">
                            <HeartPulse className="w-3.5 h-3.5" />
                            Full Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">
                {editMode ? "Edit Medical Record" : "New Medical Record"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Student picker (only for new records) */}
              {!editMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Student *
                  </label>
                  <select
                    required
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="">Select a student…</option>
                    {availableStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.admissionNumber})
                        {s.enrollments?.[0]?.class?.name
                          ? ` — ${s.enrollments[0].class.name}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Droplets className="w-3 h-3 inline mr-1" />
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="">Unknown</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Conditions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asthma, Diabetes"
                    value={formData.conditions}
                    onChange={(e) =>
                      setFormData({ ...formData, conditions: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Allergies
                </label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Dust Mites"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Immunizations
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCG, Polio, Measles"
                  value={formData.immunizations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      immunizations: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional medical notes…"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editMode
                    ? "Save Changes"
                    : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
