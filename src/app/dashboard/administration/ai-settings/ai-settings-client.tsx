"use client";

import React, { useState } from "react";
import { addKnowledgeDocument, deleteKnowledgeDocument } from "./actions";
import { Book, ShieldAlert, History, Trash2, Plus } from "lucide-react";
// Removed sonner for now, since it wasn't resolving.
// import { toast } from "sonner";

export default function AISettingsClient({ initialLogs, initialKb }: { initialLogs: any[], initialKb: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "Policy", content: "" });
  const [activeTab, setActiveTab] = useState("knowledge");

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addKnowledgeDocument(formData);
      setFormData({ title: "", category: "Policy", content: "" });
      alert("Document added to AI Knowledge Base");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledgeDocument(id);
      alert("Document removed");
    } catch (error) {
      alert("Failed to remove document");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("knowledge")} 
          className={`px-4 py-2 flex items-center border-b-2 font-medium text-sm ${activeTab === 'knowledge' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Book className="h-4 w-4 mr-2" /> Knowledge Base
        </button>
        <button 
          onClick={() => setActiveTab("audit")} 
          className={`px-4 py-2 flex items-center border-b-2 font-medium text-sm ${activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <History className="h-4 w-4 mr-2" /> Audit Logs
        </button>
        <button 
          onClick={() => setActiveTab("permissions")} 
          className={`px-4 py-2 flex items-center border-b-2 font-medium text-sm ${activeTab === 'permissions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <ShieldAlert className="h-4 w-4 mr-2" /> Permissions
        </button>
      </div>

      {activeTab === "knowledge" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          <div className="col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Train AI</h3>
              <p className="text-sm text-gray-500">Add new policies or context for the AI to retrieve.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddDoc} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Late Fee Policy" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Policy</option>
                    <option>Guideline</option>
                    <option>Calendar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={10} placeholder="Paste document content here..." className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white rounded-md h-10 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50">
                  {isSubmitting ? "Training..." : "Add to Knowledge Base"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Active Documents ({initialKb.length})</h3>
              <p className="text-sm text-gray-500">Current context available to the AI agent.</p>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {initialKb.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No documents uploaded yet.</p>
              ) : (
                initialKb.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{doc.category} • Added {new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">AI Action Audit Trail</h3>
            <p className="text-sm text-gray-500">Complete history of AI interactions and executed tools.</p>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Intent / Tool</th>
                  <th className="px-6 py-4 font-medium">Prompt</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {initialLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{log.user.firstName} {log.user.lastName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${log.toolUsed ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {log.intent}
                      </span>
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs text-gray-500" title={log.prompt}>{log.prompt}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "permissions" && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">AI Role Permissions</h3>
            <p className="text-sm text-gray-500">Configure which roles have access to the AI agent.</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              The AI uses the exact same Role-Based Access Control (RBAC) as the rest of the application. 
              If a teacher asks the AI to view a student's grades, the AI checks if the teacher's role has the <code>academics.view</code> permission.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex gap-3 items-start">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Global AI Toggle</p>
                <p>This feature requires the enhanced RBAC system. You can enable or disable AI globally across roles here in Phase 2.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
