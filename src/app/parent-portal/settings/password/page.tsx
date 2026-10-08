"use client";

import React, { useState } from 'react';
import { Lock, EyeOff, Check, X } from 'lucide-react';

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [tfa, setTfa] = useState(false);

  const reqs = {
    length: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const Requirement = ({ met, text }: { met: boolean, text: string }) => (
    <div className="flex items-center gap-2 mb-2">
      {met ? <Check className="w-5 h-5 text-primary-500" /> : <Check className="w-5 h-5 text-red-400" />}
      <span className={met ? "text-primary-600" : "text-red-400"}>{text}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Create New Password</h2>
      <p className="text-slate-600 mb-6">
        Type in the new password you'll use to sign in to your account.
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex items-center border border-slate-300 rounded-md bg-primary-50/30">
          <div className="px-3 py-3 border-r border-slate-300">
            <Lock className="w-5 h-5 text-slate-500" />
          </div>
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 px-3 py-3 bg-transparent outline-none text-slate-700" 
          />
          <button className="px-3 py-3 text-slate-400 hover:text-slate-600">
            <EyeOff className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center border border-slate-300 rounded-md bg-slate-50/50">
          <div className="px-3 py-3 border-r border-slate-300">
            <Lock className="w-5 h-5 text-slate-500" />
          </div>
          <input 
            type="password" 
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="flex-1 px-3 py-3 bg-transparent outline-none text-slate-700" 
          />
          <button className="px-3 py-3 text-slate-400 hover:text-slate-600">
            <EyeOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-slate-700 font-medium mb-3">Your password must contain:</p>
        <Requirement met={reqs.length} text="At least 8 characters" />
        <Requirement met={reqs.lower} text="At least one lowercase letter (a-z)" />
        <Requirement met={reqs.upper} text="At least one uppercase letter (A-Z)" />
        <Requirement met={reqs.number} text="At least one number (0-9)" />
        <Requirement met={reqs.special} text="At least one special character (e.g. !@#)" />
      </div>

      <div className="flex items-start gap-3 mb-6">
        <input 
          type="checkbox" 
          id="terms" 
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
        />
        <label htmlFor="terms" className="text-slate-700 leading-snug">
          By continuing you agree to MyShule App <span className="text-primary-600 font-medium">Terms of Service</span> and acknowledge that you've read our <span className="text-primary-600 font-medium">Privacy Policy</span>
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <label htmlFor="tfa" className="text-slate-700 font-medium max-w-[70%]">
          Enable Two-Factor Authentication (2FA)
        </label>
        
        <button 
          id="tfa"
          onClick={() => setTfa(!tfa)}
          className={`w-12 h-6 rounded-full relative transition-colors ${tfa ? 'bg-primary-500' : 'bg-slate-300'}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${tfa ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>
    </div>
  );
}

