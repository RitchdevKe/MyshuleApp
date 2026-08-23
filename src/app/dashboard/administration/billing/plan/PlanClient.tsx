"use client";

import React, { useTransition } from "react";
import { Check, Info } from "lucide-react";
import { updatePlan } from "@/app/actions/billing";
import { useRouter } from "next/navigation";

export default function PlanClient({ tenant }: { tenant: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = React.useState<string | null>(null);

  const handlePlanSelect = (planName: string) => {
    startTransition(async () => {
      const result = await updatePlan(planName);
      if (result.success) {
        setMessage(result.message || "Plan updated successfully.");
        setTimeout(() => setMessage(null), 3000);
      }
      router.refresh();
    });
  };

  const currentPlan = tenant?.subscriptionPlan || "Free";

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/ month",
      description: "Basic features for small schools just getting started.",
      features: ["Up to 100 Students", "Basic Academics Module", "Community Support", "1GB Cloud Storage"],
      current: currentPlan === "Free",
      buttonText: currentPlan === "Free" ? "Current Plan" : "Downgrade to Free",
      buttonClass: currentPlan === "Free" ? "bg-secondary-500 text-white shadow-sm shadow-secondary-500/20 cursor-default" : "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300"
    },
    {
      name: "Business",
      price: "$199",
      period: "/ month",
      description: "Everything you need to run a growing institution.",
      features: ["Up to 2,000 Students", "All Core Modules Included", "Priority Email Support", "50GB Cloud Storage", "5,000 SMS Credits / mo"],
      current: currentPlan === "Business",
      buttonText: currentPlan === "Business" ? "Current Plan" : "Upgrade to Business",
      buttonClass: currentPlan === "Business" ? "bg-secondary-500 text-white shadow-sm shadow-secondary-500/20 cursor-default" : "bg-primary-900 text-white shadow-sm shadow-primary-900/20 hover:bg-primary-800"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Advanced controls and unlimited scalability for large networks.",
      features: ["Unlimited Students", "Custom Module Development", "24/7 Phone Support", "Unlimited Cloud Storage", "Dedicated Account Manager"],
      current: currentPlan === "Enterprise",
      buttonText: currentPlan === "Enterprise" ? "Current Plan" : "Contact Sales",
      buttonClass: currentPlan === "Enterprise" ? "bg-secondary-500 text-white shadow-sm shadow-secondary-500/20 cursor-default" : "bg-primary-900 text-white shadow-sm shadow-primary-900/20 hover:bg-primary-800"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-8 min-h-[500px]">
      {message && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-center font-bold text-sm">
          {message}
        </div>
      )}
      <div className="text-center max-w-2xl mx-auto mb-12">
         <h2 className="text-2xl font-black text-slate-800 mb-3">Choose the perfect plan for your school</h2>
         <p className="text-sm font-medium text-slate-500">
            Whether you're a small community school or a massive enterprise network, we have a plan tailored to your needs.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
         {plans.map((plan, idx) => (
            <div key={idx} className={`relative flex flex-col rounded-3xl p-8 ${
               plan.current 
               ? 'bg-primary-900 text-white shadow-xl shadow-primary-900/10 scale-105 border border-primary-800 z-10' 
               : 'bg-white border border-slate-200/60 shadow-sm'
            }`}>
               {plan.current && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                     Active Plan
                  </div>
               )}
               
               <h3 className={`text-xl font-black mb-2 ${plan.current ? 'text-white' : 'text-slate-800'}`}>{plan.name}</h3>
               <p className={`text-xs font-medium mb-6 ${plan.current ? 'text-primary-200' : 'text-slate-500'}`}>{plan.description}</p>
               
               <div className="mb-6 flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${plan.current ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  <span className={`text-sm font-bold ${plan.current ? 'text-primary-300' : 'text-slate-500'}`}>{plan.period}</span>
               </div>
               
               <button 
                  onClick={() => !plan.current && handlePlanSelect(plan.name)}
                  disabled={plan.current || isPending}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all mb-8 ${plan.buttonClass} disabled:opacity-50`}
               >
                  {isPending && !plan.current ? "Processing..." : plan.buttonText}
               </button>
               
               <div className="space-y-4 flex-1">
                  <div className={`text-xs font-black uppercase tracking-wider mb-4 ${plan.current ? 'text-primary-300' : 'text-slate-400'}`}>Includes:</div>
                  {plan.features.map((feature, fIdx) => (
                     <div key={fIdx} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                           plan.current ? 'bg-secondary-500/20 text-secondary-300' : 'bg-primary-50 text-primary-600'
                        }`}>
                           <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className={`text-sm font-medium leading-tight ${plan.current ? 'text-primary-100' : 'text-slate-600'}`}>
                           {feature}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
      
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-5xl mx-auto flex gap-4 items-start">
         <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0">
            <Info className="w-5 h-5" />
         </div>
         <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Looking for non-profit pricing?</h4>
            <p className="text-xs font-medium text-slate-600">We offer special discounts for registered non-profit educational institutions. Contact our billing team with your certification to apply.</p>
         </div>
      </div>
    </div>
  );
}
