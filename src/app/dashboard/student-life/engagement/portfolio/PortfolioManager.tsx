"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, Download, Trophy, Target, FileText, Plus, Trash2, User } from "lucide-react";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
};

type Skill = { id: string; name: string; proficiency: number };
type Achievement = { id: string; title: string; date: string; description: string };
type Recommendation = { id: string; author: string; content: string };

export type Portfolio = {
  studentId: string;
  skills: Skill[];
  achievements: Achievement[];
  recommendations: Recommendation[];
};

export default function PortfolioManager({ students }: { students: Student[] }) {
  const [portfolios, setPortfolios] = useState<Record<string, Portfolio>>({});
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const selectedPortfolio = selectedStudentId ? portfolios[selectedStudentId] : null;

  // Derived Summary Data
  const summary = useMemo(() => {
    const portfolioList = Object.values(portfolios);
    const totalPortfolios = portfolioList.length;
    const totalAchievements = portfolioList.reduce((acc, p) => acc + p.achievements.length, 0);
    
    let totalSkills = 0;
    let sumProficiency = 0;
    portfolioList.forEach(p => {
      p.skills.forEach(s => {
        totalSkills++;
        sumProficiency += s.proficiency;
      });
    });
    const avgSkill = totalSkills > 0 ? (sumProficiency / totalSkills).toFixed(1) : "0.0";

    return { totalPortfolios, totalAchievements, avgSkill };
  }, [portfolios]);

  const initPortfolio = (studentId: string) => {
    if (!portfolios[studentId]) {
      setPortfolios(prev => ({
        ...prev,
        [studentId]: { studentId, skills: [], achievements: [], recommendations: [] }
      }));
    }
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedStudentId(id);
    if (id) {
      initPortfolio(id);
    }
  };

  const addSkill = (studentId: string, skill: Omit<Skill, "id">) => {
    const newSkill = { ...skill, id: Math.random().toString(36).substring(7) };
    setPortfolios(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        skills: [...prev[studentId].skills, newSkill]
      }
    }));
  };

  const removeSkill = (studentId: string, skillId: string) => {
    setPortfolios(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        skills: prev[studentId].skills.filter(s => s.id !== skillId)
      }
    }));
  };

  const addAchievement = (studentId: string, achievement: Omit<Achievement, "id">) => {
    const newAchiev = { ...achievement, id: Math.random().toString(36).substring(7) };
    setPortfolios(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        achievements: [...prev[studentId].achievements, newAchiev]
      }
    }));
  };

  const removeAchievement = (studentId: string, achievementId: string) => {
    setPortfolios(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        achievements: prev[studentId].achievements.filter(a => a.id !== achievementId)
      }
    }));
  };

  const addRecommendation = (studentId: string, recommendation: Omit<Recommendation, "id">) => {
    const newRec = { ...recommendation, id: Math.random().toString(36).substring(7) };
    setPortfolios(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        recommendations: [...prev[studentId].recommendations, newRec]
      }
    }));
  };

  const removeRecommendation = (studentId: string, recommendationId: string) => {
    setPortfolios(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        recommendations: prev[studentId].recommendations.filter(r => r.id !== recommendationId)
      }
    }));
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Student Portfolio Manager</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage and export comprehensive student development records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export Batch
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Active Portfolios</p>
            <p className="text-2xl font-black text-slate-800">{summary.totalPortfolios}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Total Achievements</p>
            <p className="text-2xl font-black text-slate-800">{summary.totalAchievements}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Avg Skill Level</p>
            <p className="text-2xl font-black text-slate-800">{summary.avgSkill} <span className="text-sm font-medium text-slate-400">/ 5</span></p>
          </div>
        </div>
      </div>

      {/* Selector Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Student</label>
        <select
          value={selectedStudentId}
          onChange={handleStudentSelect}
          className="w-full md:w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        >
          <option value="">-- Choose a student --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName} ({s.admissionNumber})
            </option>
          ))}
        </select>
        {students.length === 0 && (
          <p className="text-sm text-amber-600 mt-2">No students found in the database. Please add students first.</p>
        )}
      </div>

      {/* Selected Portfolio */}
      {selectedPortfolio && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Skills Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Skills Track
                </h3>
              </div>
              
              <div className="space-y-4">
                {selectedPortfolio.skills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">{skill.name}</p>
                      <p className="text-xs text-slate-500">Proficiency: {skill.proficiency}/5</p>
                    </div>
                    <button 
                      onClick={() => removeSkill(selectedStudentId, skill.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedPortfolio.skills.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No skills added yet.</p>
                )}

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                    const prof = parseInt((form.elements.namedItem('proficiency') as HTMLInputElement).value);
                    if (name && prof) {
                      addSkill(selectedStudentId, { name, proficiency: prof });
                      form.reset();
                    }
                  }}
                  className="flex gap-2 mt-4"
                >
                  <input type="text" name="name" placeholder="Skill Name" required className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-500" />
                  <input type="number" name="proficiency" placeholder="1-5" min="1" max="5" required className="w-20 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-500" />
                  <button type="submit" className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700">
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Achievements
                </h3>
              </div>
              
              <div className="space-y-4">
                {selectedPortfolio.achievements.map(ach => (
                  <div key={ach.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-slate-800">{ach.title}</p>
                      <p className="text-xs font-medium text-slate-500 mb-1">{ach.date}</p>
                      <p className="text-sm text-slate-600">{ach.description}</p>
                    </div>
                    <button 
                      onClick={() => removeAchievement(selectedStudentId, ach.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedPortfolio.achievements.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No achievements logged.</p>
                )}

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
                    const desc = (form.elements.namedItem('desc') as HTMLInputElement).value;
                    if (title && date) {
                      addAchievement(selectedStudentId, { title, date, description: desc });
                      form.reset();
                    }
                  }}
                  className="space-y-2 mt-4 pt-4 border-t border-slate-100"
                >
                  <div className="flex gap-2">
                    <input type="text" name="title" placeholder="Achievement Title" required className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-500" />
                    <input type="date" name="date" required className="w-32 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-500" />
                  </div>
                  <div className="flex gap-2">
                    <input type="text" name="desc" placeholder="Brief Description" className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-500" />
                    <button type="submit" className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Recommendations
                </h3>
              </div>
              
              <div className="space-y-4">
                {selectedPortfolio.recommendations.map(rec => (
                  <div key={rec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-slate-800">{rec.author}</p>
                      <p className="text-sm text-slate-600 mt-1">&quot;{rec.content}&quot;</p>
                    </div>
                    <button 
                      onClick={() => removeRecommendation(selectedStudentId, rec.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedPortfolio.recommendations.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No recommendations logged.</p>
                )}

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const author = (form.elements.namedItem('author') as HTMLInputElement).value;
                    const content = (form.elements.namedItem('content') as HTMLInputElement).value;
                    if (author && content) {
                      addRecommendation(selectedStudentId, { author, content });
                      form.reset();
                    }
                  }}
                  className="space-y-2 mt-4 pt-4 border-t border-slate-100"
                >
                  <input type="text" name="author" placeholder="Author Name" required className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-500" />
                  <div className="flex gap-2">
                    <input type="text" name="content" placeholder="Recommendation Content" required className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary-500" />
                    <button type="submit" className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {!selectedPortfolio && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-12 text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Student Selected</h3>
          <p className="text-sm text-slate-500 mt-2">Please select a student from the dropdown above to view or edit their portfolio.</p>
        </div>
      )}
    </div>
  );
}
