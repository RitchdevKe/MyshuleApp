import React from 'react';
import { getParentPortalData } from '../../data';
import { User, Mail, Phone } from 'lucide-react';

export default async function UpdateProfilePage() {
  const { parent } = await getParentPortalData();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Update Profile</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Name</label>
          <div className="flex items-center border border-slate-300 rounded-md bg-slate-50">
            <div className="px-3 py-2 border-r border-slate-300">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              defaultValue={`${parent?.firstName || ''} ${parent?.lastName || ''}`}
              className="flex-1 px-3 py-2 bg-transparent outline-none text-slate-700"
              readOnly
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Please contact the school administration to change your official name.</p>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Email</label>
          <div className="flex items-center border border-slate-300 rounded-md bg-slate-50">
            <div className="px-3 py-2 border-r border-slate-300">
              <Mail className="w-5 h-5 text-slate-400" />
            </div>
            <input 
              type="email" 
              defaultValue={parent?.user?.email || ''}
              className="flex-1 px-3 py-2 bg-transparent outline-none text-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
          <div className="flex items-center border border-slate-300 rounded-md bg-slate-50">
            <div className="px-3 py-2 border-r border-slate-300">
              <Phone className="w-5 h-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              defaultValue={parent?.user?.phoneNumber || ''}
              className="flex-1 px-3 py-2 bg-transparent outline-none text-slate-700"
            />
          </div>
        </div>

        <div className="pt-4">
          <button className="w-full sm:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


