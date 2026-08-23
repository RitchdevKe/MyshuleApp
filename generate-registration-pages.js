const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app', 'dashboard', 'registration');

const pagesConfig = {
  'admissions': {
    'admissions': {
      title: 'Admissions Management',
      columns: ['Admission No', 'Student Name', 'Grade Assigned', 'Stream', 'Branch', 'Status'],
      data: [
        { id: 'ADM-2026-001', col1: 'Samuel Njenga', col2: 'Grade 1', col3: 'Red', col4: 'Main Campus', col5: 'Admitted' },
        { id: 'ADM-2026-002', col1: 'Mercy Kiprotich', col2: 'Grade 4', col3: 'Blue', col4: 'Main Campus', col5: 'Pending Letter' },
      ],
      actions: ['Admit Student', 'Generate Letter', 'Print Form']
    },
    'enrollments': {
      title: 'Student Enrollments',
      columns: ['Enrollment ID', 'Student Name', 'Date Enrolled', 'Status', 'Notes'],
      data: [
        { id: 'ENR-8832', col1: 'Jane Doe', col2: 'Jan 10, 2026', col3: 'Active', col4: 'Transferred from West Wing' },
        { id: 'ENR-8833', col1: 'John Smith', col2: 'Jan 12, 2026', col3: 'Deferred', col4: 'Medical reasons' },
      ],
      actions: ['Enroll Student', 'Transfer', 'Cancel']
    },
    'documents': {
      title: 'Admission Documents',
      columns: ['Student Name', 'Document Type', 'Upload Date', 'Status', 'Verified By'],
      data: [
        { id: 'DOC-1', col1: 'Samuel Njenga', col2: 'Birth Certificate', col3: 'Oct 12, 2026', col4: 'Verified', col5: 'Admin' },
        { id: 'DOC-2', col1: 'Mercy Kiprotich', col2: 'KCPE Results', col3: 'Oct 13, 2026', col4: 'Pending', col5: '-' },
      ],
      actions: ['Upload Document', 'Request Doc']
    }
  },
  'students': {
    'directory': {
      title: 'Student Directory',
      columns: ['Adm No', 'Name', 'Grade', 'Stream', 'Gender', 'Status'],
      data: [
        { id: '1001', col1: 'Alice Mwangangi', col2: 'Grade 4', col3: 'Red', col4: 'Female', col5: 'Active' },
        { id: '1002', col1: 'David Ochieng', col2: 'Grade 1', col3: 'Blue', col4: 'Male', col5: 'Active' },
      ],
      actions: ['Add Student', 'Bulk Import', 'Export', 'Print IDs']
    },
    'progress': {
      title: 'Academic Progress',
      columns: ['Student Name', 'Current Grade', 'Next Grade', 'Promotion Status', 'Term Average'],
      data: [
        { id: '1001', col1: 'Grade 4', col2: 'Grade 5', col3: 'Promoted', col4: 'A-' },
        { id: '1002', col1: 'Grade 1', col2: 'Grade 2', col3: 'Pending', col4: 'B+' },
      ],
      actions: ['Promote Class', 'Allocate Streams']
    },
    'welfare': {
      title: 'Attendance & Welfare',
      columns: ['Student Name', 'Attendance %', 'Discipline Issues', 'Medical Flags', 'Rewards'],
      data: [
        { id: '1001', col1: '98%', col2: 'None', col3: 'Asthma (Mild)', col4: 'Star of the Week' },
        { id: '1002', col1: '85%', col2: 'Late arrival', col3: 'None', col4: '-' },
      ],
      actions: ['Log Incident', 'Mark Attendance']
    },
    'exit': {
      title: 'Graduation & Exit',
      columns: ['Student Name', 'Exit Type', 'Date', 'Destination', 'Clearance'],
      data: [
        { id: '990', col1: 'Graduation', col2: 'Nov 2025', col3: 'High School', col4: 'Cleared' },
        { id: '850', col1: 'Transfer', col2: 'Sep 2025', col3: 'Another City', col4: 'Pending Fees' },
      ],
      actions: ['Process Exit', 'Generate Certificate']
    }
  },
  'parents': {
    'parents': {
      title: 'Parent Directory',
      columns: ['Parent Name', 'Phone', 'Email', 'Linked Students', 'Portal Access'],
      data: [
        { id: 'P-001', col1: '+254700000001', col2: 'grace@example.com', col3: 'Samuel Njenga (G1)', col4: 'Active' },
        { id: 'P-002', col1: '+254700000002', col2: 'paul@example.com', col3: 'Mercy Kiprotich (G4)', col4: 'Inactive' },
      ],
      actions: ['Add Parent', 'Send Invite']
    },
    'guardians': {
      title: 'Guardians & Emergency Contacts',
      columns: ['Guardian Name', 'Relationship', 'Phone', 'Student', 'Pickup Auth'],
      data: [
        { id: 'G-001', col1: 'Uncle', col2: '+254700000003', col3: 'Samuel Njenga', col4: 'Yes' },
        { id: 'G-002', col1: 'Aunt', col2: '+254700000004', col3: 'Mercy Kiprotich', col4: 'No' },
      ],
      actions: ['Add Guardian', 'Verify Auth']
    },
    'communication': {
      title: 'Communication History',
      columns: ['Date', 'Recipient', 'Type', 'Message Summary', 'Status'],
      data: [
        { id: 'Oct 12', col1: 'All Grade 1 Parents', col2: 'SMS', col3: 'School Trip reminder...', col4: 'Sent' },
        { id: 'Oct 10', col1: 'Grace Njenga', col2: 'Email', col3: 'Fee Balance...', col4: 'Delivered' },
      ],
      actions: ['New Message', 'Templates']
    },
    'finance': {
      title: 'Finance Links',
      columns: ['Parent Name', 'Linked Students', 'Fee Responsibility', 'Current Balance', 'Last Statement'],
      data: [
        { id: 'Grace Njenga', col1: 'Samuel Njenga', col2: '100%', col3: 'KES 15,000', col4: 'Oct 1, 2026' },
        { id: 'Paul Kiprotich', col1: 'Mercy Kiprotich', col2: '100%', col3: 'KES 0', col4: 'Oct 1, 2026' },
      ],
      actions: ['Generate Statement', 'Send Reminder']
    }
  },
  'school-structure': {
    'branches': {
      title: 'Branches & Campuses',
      columns: ['Branch Name', 'Head', 'Capacity', 'Current Students', 'Status'],
      data: [
        { id: 'Main Campus', col1: 'Mr. Omondi', col2: '1000', col3: '650', col4: 'Active' },
        { id: 'West Wing', col1: 'Mrs. Kariuki', col2: '500', col3: '280', col4: 'Active' },
      ],
      actions: ['Add Branch', 'Edit Details']
    },
    'academic': {
      title: 'Academic Structure',
      columns: ['Year', 'Term', 'Start Date', 'End Date', 'Status'],
      data: [
        { id: '2026', col1: 'Term 1', col2: 'Jan 5, 2026', col3: 'Apr 10, 2026', col4: 'Active' },
        { id: '2026', col1: 'Term 2', col2: 'May 4, 2026', col3: 'Aug 7, 2026', col4: 'Upcoming' },
      ],
      actions: ['New Academic Year', 'Manage Terms']
    },
    'classes': {
      title: 'Classes & Streams',
      columns: ['Grade', 'Stream Name', 'Class Teacher', 'Capacity', 'Enrolled'],
      data: [
        { id: 'Grade 1', col1: 'Red', col2: 'Tr. Jane', col3: '30', col4: '28' },
        { id: 'Grade 1', col1: 'Blue', col2: 'Tr. Mark', col3: '30', col4: '25' },
      ],
      actions: ['Add Grade', 'Add Stream']
    },
    'users': {
      title: 'System Users (Registration Roles)',
      columns: ['Name', 'Role', 'Email', 'Branch', 'Status'],
      data: [
        { id: 'Admin User', col1: 'Super Admin', col2: 'admin@myshule.com', col3: 'All', col4: 'Active' },
        { id: 'Mary Secretary', col1: 'Secretary', col2: 'mary@myshule.com', col3: 'Main Campus', col4: 'Active' },
      ],
      actions: ['Add User', 'Manage Roles']
    }
  }
};

for (const [workspace, pages] of Object.entries(pagesConfig)) {
  for (const [page, config] of Object.entries(pages)) {
    // skip applications because we manually built it
    if (page === 'applications') continue;
    
    const pagePath = path.join(basePath, workspace, page, 'page.tsx');
    
    // Using string concatenation to prevent string interpolation errors
    const actionButtons = config.actions.map((act, i) => {
      if (i === 0) {
        return '<button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-900 rounded-lg hover:bg-primary-800 transition-colors shadow-sm"><Plus className="w-4 h-4" />' + act + '</button>';
      } else {
        return '<button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">' + act + '</button>';
      }
    }).join('\n          ');

    const tableHeaders = config.columns.map(col => '<th className="px-6 py-4">' + col + '</th>').join('\n              ');

    const tableBody = '{JSON.stringify(mockData).replace(/"/g, "")}';

    const code = `import React from "react";
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react";

// Mock Data
const mockData = ${JSON.stringify(config.data, null, 2)};

export default function ${page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, '')}Page() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          ${actionButtons}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
      <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
        <span>Showing records</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50">Next</button>
        </div>
      </div>

    </div>
  );
}`;
    fs.writeFileSync(pagePath, code);
  }
}
