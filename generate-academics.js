const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app', 'dashboard', 'academics');

const workspacesConfig = {
  'curriculum': {
    title: 'Curriculum',
    tabs: ['learning-areas', 'subjects', 'classes-streams', 'calendar', 'setup']
  },
  'teaching': {
    title: 'Teaching',
    tabs: ['allocation', 'lesson-planning', 'assignments', 'records']
  },
  'scheduling': {
    title: 'Scheduling',
    tabs: ['timetables', 'periods', 'calendar', 'events']
  },
  'assessment': {
    title: 'Assessment',
    tabs: ['cbc', 'continuous', 'competencies', 'rubrics']
  },
  'examinations': {
    title: 'Examinations',
    tabs: ['setup', 'marks', 'grading', 'report-cards']
  },
  'performance': {
    title: 'Performance',
    tabs: ['student', 'class', 'subject', 'insights']
  },
  'academic-resources': {
    title: 'Academic Resources',
    tabs: ['digital-content', 'question-bank', 'materials', 'documents']
  }
};

const pagesData = {
  'learning-areas': { title: 'Learning Areas (CBC)', cols: ['Code', 'Learning Area', 'Levels', 'Status'], actions: ['Add Area'], hasAI: false },
  'subjects': { title: 'Subjects', cols: ['Code', 'Subject Name', 'Category', 'Mapped CBC Area', 'Status'], actions: ['Add Subject'], hasAI: false },
  'classes-streams': { title: 'Classes & Streams Mapping', cols: ['Class', 'Stream', 'Capacity', 'Allocated Teacher'], actions: ['Manage Streams'], hasAI: false },
  'calendar': { title: 'Academic Calendar', cols: ['Event', 'Type', 'Start Date', 'End Date', 'Status'], actions: ['Add Event'], hasAI: false },
  'setup': { title: 'Curriculum Setup', cols: ['Setting', 'Value', 'Last Updated'], actions: ['Edit Settings'], hasAI: false },
  
  'allocation': { title: 'Teacher Allocation', cols: ['Teacher', 'Subject', 'Class', 'Workload (hrs)', 'Status'], actions: ['Allocate Teacher'], hasAI: false },
  'lesson-planning': { title: 'Lesson Planning', cols: ['Teacher', 'Subject', 'Topic', 'Week', 'Status'], actions: ['AI Generate Plan', 'Upload Plan'], hasAI: true },
  'assignments': { title: 'Assignments', cols: ['Title', 'Class', 'Subject', 'Due Date', 'Submissions'], actions: ['Create Assignment'], hasAI: false },
  'records': { title: 'Teaching Records', cols: ['Date', 'Teacher', 'Class', 'Subject', 'Topics Covered'], actions: ['Log Record'], hasAI: false },

  'timetables': { title: 'Timetables', cols: ['Class', 'Teacher', 'Subject', 'Day', 'Time'], actions: ['Generate Timetable'], hasAI: false },
  'periods': { title: 'Periods', cols: ['Period Name', 'Start Time', 'End Time', 'Type'], actions: ['Add Period'], hasAI: false },
  'events': { title: 'Academic Events', cols: ['Event Name', 'Date', 'Location', 'Organizer'], actions: ['New Event'], hasAI: false },

  'cbc': { title: 'CBC Assessment', cols: ['Student', 'Strand', 'Indicator', 'Achievement Level', 'Date'], actions: ['Record Assessment'], hasAI: false },
  'continuous': { title: 'Continuous Assessment', cols: ['Student', 'Subject', 'CAT 1', 'CAT 2', 'Project'], actions: ['Enter Marks'], hasAI: false },
  'competencies': { title: 'Competencies', cols: ['Competency', 'Level', 'Description', 'Subject Mapping'], actions: ['Add Competency'], hasAI: false },
  'rubrics': { title: 'Rubrics & Remarks', cols: ['Student', 'Subject', 'Score', 'Teacher Remark', 'AI Suggestion'], actions: ['AI Auto-Remark', 'Add Rubric'], hasAI: true },

  'setup': { title: 'Exam Setup', cols: ['Exam Name', 'Term', 'Weighting', 'Status'], actions: ['Create Exam'], hasAI: false },
  'marks': { title: 'Marks Management', cols: ['Student', 'Subject', 'Score', 'Grade', 'Status'], actions: ['Import Marks', 'Lock Marks'], hasAI: false },
  'grading': { title: 'Grading Scales', cols: ['Scale Name', 'Min Score', 'Max Score', 'Grade', 'Points'], actions: ['Add Scale'], hasAI: false },
  'report-cards': { title: 'Report Cards', cols: ['Student', 'Class', 'Term', 'Average', 'AI Comment'], actions: ['AI Generate Comments', 'Print All'], hasAI: true },

  'student': { title: 'Student Performance', cols: ['Student', 'Trend', 'Current Avg', 'Previous Avg', 'Risk Level'], actions: ['View Details'], hasAI: true },
  'class': { title: 'Class Performance', cols: ['Class', 'Mean Score', 'Top Subject', 'Weak Subject', 'Pass Rate'], actions: ['Compare Classes'], hasAI: false },
  'subject': { title: 'Subject Analysis', cols: ['Subject', 'Mean Score', 'Highest Grade', 'Lowest Grade', 'Teacher'], actions: ['View Details'], hasAI: false },
  'insights': { title: 'Academic Insights (AI)', cols: ['Insight Type', 'Target Group', 'AI Prediction', 'Recommended Intervention'], actions: ['Run Analysis'], hasAI: true },

  'digital-content': { title: 'Digital Content', cols: ['Title', 'Type', 'Subject', 'Target Class', 'Downloads'], actions: ['Upload Content'], hasAI: false },
  'question-bank': { title: 'Question Bank', cols: ['Topic', 'Subject', 'Difficulty', 'Total Questions'], actions: ['AI Generate Quiz', 'Add Question'], hasAI: true },
  'materials': { title: 'Learning Materials', cols: ['Title', 'Category', 'Author', 'Available Copies'], actions: ['Add Material'], hasAI: false },
  'documents': { title: 'Academic Documents', cols: ['Document Name', 'Type', 'Uploaded By', 'Date'], actions: ['Upload Document'], hasAI: false }
};

// Default generic data if none found
const defaultData = [
  { id: '1', col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4', col5: 'Active' },
  { id: '2', col1: 'Data A', col2: 'Data B', col3: 'Data C', col4: 'Data D', col5: 'Pending' }
];

for (const [workspace, config] of Object.entries(workspacesConfig)) {
  const workspacePath = path.join(basePath, workspace);
  fs.mkdirSync(workspacePath, { recursive: true });

  // Create layout
  const layoutContent = `"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const tabs = [
${config.tabs.map(t => `    { name: "${t.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}", href: "/dashboard/academics/${workspace}/${t}" }`).join(',\n')}
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800 capitalize">
          ${config.title}
        </h1>
      </div>

      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-8 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={\`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold transition-colors
                  \${isActive 
                    ? 'border-secondary-500 text-secondary-600' 
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }
                \`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}`;
  fs.writeFileSync(path.join(workspacePath, 'layout.tsx'), layoutContent);

  // Redirect base to first tab
  const basePageContent = `import { redirect } from 'next/navigation';
export default function Page() {
  redirect('/dashboard/academics/${workspace}/${config.tabs[0]}');
}`;
  fs.writeFileSync(path.join(workspacePath, 'page.tsx'), basePageContent);

  // Create tabs
  for (const tab of config.tabs) {
    const tabPath = path.join(workspacePath, tab);
    fs.mkdirSync(tabPath, { recursive: true });

    const pageDef = pagesData[tab] || { title: tab, cols: ['Col1', 'Col2', 'Col3', 'Col4'], actions: ['Add New'], hasAI: false };

    const actionButtons = pageDef.actions.map((act, i) => {
      const isAiAction = act.startsWith('AI ');
      if (isAiAction) {
        return '<button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-sm"><Sparkles className="w-4 h-4 text-purple-200" />' + act + '</button>';
      } else if (i === 0) {
        return '<button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-900 rounded-lg hover:bg-primary-800 transition-colors shadow-sm"><Plus className="w-4 h-4" />' + act + '</button>';
      } else {
        return '<button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">' + act + '</button>';
      }
    }).join('\n          ');

    const tableHeaders = pageDef.cols.map(col => '<th className="px-6 py-4">' + col + '</th>').join('\n              ');

    const code = `import React from "react";
import { Search, Filter, Plus, MoreHorizontal, Sparkles } from "lucide-react";

const mockData = ${JSON.stringify(defaultData, null, 2)};

export default function ${tab.replace(/-/g, '').charAt(0).toUpperCase() + tab.replace(/-/g, '').slice(1)}Page() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search ${pageDef.title}..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          ${actionButtons}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
            <tr>
              ${tableHeaders}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-800">{row.id}</td>
                <td className="px-6 py-4 font-medium">{row.col1}</td>
                <td className="px-6 py-4">{row.col2}</td>
                <td className="px-6 py-4 text-slate-500">{row.col3}</td>
                <td className="px-6 py-4 text-slate-500">{row.col4}</td>
                {row.col5 && (
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      {row.col5}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50 mt-auto">
        <span>Showing records</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50">Next</button>
        </div>
      </div>

    </div>
  );
}`;
    fs.writeFileSync(path.join(tabPath, 'page.tsx'), code);
  }
}
