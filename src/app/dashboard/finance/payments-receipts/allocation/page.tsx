import React from "react";
import { Plus, MoreHorizontal, Sparkles } from "lucide-react";

const mockData = [
  {
    "id": "1001",
    "col1": "Data A",
    "col2": "Data B",
    "col3": "Data C",
    "col4": "Data D",
    "status": "Paid"
  },
  {
    "id": "1002",
    "col1": "Data X",
    "col2": "Data Y",
    "col3": "Data Z",
    "col4": "Data W",
    "status": "Pending"
  },
  {
    "id": "1003",
    "col1": "Data M",
    "col2": "Data N",
    "col3": "Data O",
    "col4": "Data P",
    "status": "Overdue"
  },
  {
    "id": "1004",
    "col1": "Data Q",
    "col2": "Data R",
    "col3": "Data S",
    "col4": "Data T",
    "status": "Draft"
  }
];

export default function AllocationPage() {
  return (
    <div className="bg-white border-t-4 border-t-primary-900 border-l border-r border-b border-slate-200 rounded-xl shadow-md overflow-hidden flex flex-col min-h-[400px]">
      
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Payment Allocation</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-900 rounded-lg hover:bg-primary-800 transition-colors shadow-sm"><Plus className="w-4 h-4" />Auto-Allocate</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-primary-900 text-xs uppercase font-bold text-white border-b border-primary-900">
            <tr>
              <th className="px-6 py-4">Receipt No</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Unallocated Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockData.map((row, i) => (
              <tr key={i} className="hover:bg-primary-50/50 border-l-2 border-transparent hover:border-l-primary-500 transition-colors transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-800">{row.id}</td>
                <td className="px-6 py-4 font-medium">{row.col1}</td>
                <td className="px-6 py-4">{row.col2}</td>
                <td className="px-6 py-4 text-slate-500">{row.col3}</td>
                
                {/* Dynamically handle Status Badge vs Normal Column based on pageDef.cols length */}
                {false ? (
                  <>
                    <td className="px-6 py-4 text-slate-500">{row.col4}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold
                        ${row.status === 'Paid' ? 'bg-green-50 text-green-700' : 
                          row.status === 'Pending' ? 'bg-orange-50 text-orange-700' :
                          row.status === 'Overdue' ? 'bg-red-50 text-red-700' :
                          'bg-slate-100 text-slate-700'}
                      `}>
                        {row.status}
                      </span>
                    </td>
                  </>
                ) : (
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold
                      ${row.status === 'Paid' ? 'bg-green-50 text-green-700' : 
                        row.status === 'Pending' ? 'bg-orange-50 text-orange-700' :
                        row.status === 'Overdue' ? 'bg-red-50 text-red-700' :
                        'bg-slate-100 text-slate-700'}
                    `}>
                      {row.status}
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
        <span>Showing 4 records</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>

    </div>
  );
}