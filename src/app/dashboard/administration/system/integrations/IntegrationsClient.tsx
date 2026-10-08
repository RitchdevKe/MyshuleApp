"use client";

import React, { useTransition } from "react";
import { Link as LinkIcon, CreditCard, MessageSquare, BookOpen, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { togglePaymentGateway, toggleCommunicationIntegration, toggleLMSIntegration } from "./actions";

export default function IntegrationsClient({ paymentGateways }: { paymentGateways: any[] }) {
  const [isPending, startTransition] = useTransition();

  const getPaymentStatus = (name: string) => {
    const gateway = paymentGateways?.find(g => g.providerName === name);
    return gateway?.isActive ? "Connected" : "Available";
  };

  const handleToggle = (category: string, name: string, currentStatus: string) => {
    startTransition(async () => {
      const newActive = currentStatus !== "Connected";
      if (category === "Payment Gateways") {
        await togglePaymentGateway(name, newActive);
      } else if (category === "Communication") {
        await toggleCommunicationIntegration(name, newActive);
      } else if (category === "Learning Management") {
        await toggleLMSIntegration(name, newActive);
      }
    });
  };

  const integrations = [
    {
      category: "Payment Gateways",
      icon: CreditCard,
      items: [
        { name: "Stripe", description: "Accept credit card payments globally.", status: getPaymentStatus("Stripe"), logo: "S" },
        { name: "M-Pesa", description: "Mobile money integration for East Africa.", status: getPaymentStatus("M-Pesa"), logo: "M" },
        { name: "PayPal", description: "Secure online payments and subscriptions.", status: getPaymentStatus("PayPal"), logo: "P" },
      ]
    },
    {
      category: "Communication",
      icon: MessageSquare,
      items: [
        { name: "Twilio", description: "SMS gateway for bulk messaging.", status: "Available", logo: "T" },
        { name: "SendGrid", description: "Reliable transactional email delivery.", status: "Available", logo: "SG" },
        { name: "WhatsApp Business", description: "Direct messaging for parents.", status: "Available", logo: "W" },
      ]
    },
    {
      category: "Learning Management",
      icon: BookOpen,
      items: [
        { name: "Google Classroom", description: "Sync rosters and assignments.", status: "Available", logo: "GC" },
        { name: "Canvas LMS", description: "Enterprise learning management sync.", status: "Available", logo: "C" },
      ]
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50 flex justify-between items-center">
         <div>
            <h2 className="text-xl font-black text-slate-800">Integrations</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Connect MyShuleApp with your favorite third-party tools.</p>
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            Browse Directory
         </button>
      </div>

      <div className="p-6 space-y-8">
         {integrations.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
               <div key={idx}>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <SectionIcon className="w-4 h-4 text-slate-400" /> {section.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {section.items.map((item, iIdx) => (
                        <div key={iIdx} className={`border rounded-2xl p-5 flex flex-col transition-all group bg-white ${
                           item.status === 'Connected' ? 'border-emerald-200 shadow-sm' : 'border-slate-200 hover:border-primary-300 hover:shadow-md cursor-pointer'
                        }`}>
                           <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-black text-xl shadow-inner">
                                 {item.logo}
                              </div>
                              {item.status === 'Connected' ? (
                                 <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                                    <ShieldCheck className="w-3 h-3" /> Connected
                                 </span>
                              ) : (
                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                    Available
                                 </span>
                              )}
                           </div>
                           
                           <h4 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h4>
                           <p className="text-sm text-slate-500 font-medium flex-1 mb-6">{item.description}</p>
                           
                           <div className="flex items-center justify-between pt-4 border-t border-slate-100/80 mt-auto">
                              {item.status === 'Connected' ? (
                                 <button 
                                   onClick={() => handleToggle(section.category, item.name, item.status)}
                                   disabled={isPending}
                                   className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 disabled:opacity-50">
                                    Disconnect
                                 </button>
                              ) : (
                                 <button 
                                   onClick={() => handleToggle(section.category, item.name, item.status)}
                                   disabled={isPending}
                                   className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors disabled:opacity-50">
                                    Connect
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )
         })}
      </div>
    </div>
  );
}
