"use client";

import React, { useTransition } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { upgradePlan } from "@/app/actions/subscription";
import { useRouter } from "next/navigation";

export default function UpgradesClient({ plans, currentPlan }: { plans: any[], currentPlan: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = (planId: string) => {
    startTransition(async () => {
      await upgradePlan(planId);
      router.refresh();
      // Use toast instead of alert in real implementation
      console.log("Plan selected successfully");
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Upgrade Your Plan</h2>
        <p className="text-slate-500 font-medium mt-3 text-lg">
          Choose the perfect plan for your institution's needs. Unlock premium features and scale effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {plans.map((plan) => {
          const isCurrent = plan.name === currentPlan;
          const isPopular = plan.name === "Professional" && !isCurrent;
          
          return (
            <div 
              key={plan.id} 
              className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col h-full transition-all duration-300
                ${isPopular || isCurrent
                  ? 'border-2 border-secondary-500 shadow-xl shadow-secondary-500/10 scale-100 xl:scale-105 z-10' 
                  : 'border border-slate-200/80 shadow-sm hover:shadow-md'
                }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary-500 to-secondary-400 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Check className="w-3.5 h-3.5" /> Active Plan
                </div>
              )}
              
              <h3 className="text-xl font-black text-slate-800">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                <span className="text-sm font-bold text-slate-500">/mo</span>
              </div>
              
              <div className="mt-8 flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isPending || isCurrent}
                className={`mt-8 w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm
                  ${isPopular 
                    ? 'bg-secondary-500 hover:bg-secondary-600 text-white' 
                    : isCurrent 
                      ? 'bg-primary-900 text-white cursor-default'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  } disabled:opacity-50`}
              >
                {isPending ? 'Processing...' : isCurrent ? 'Current Plan' : (
                  <>
                    Choose {plan.name} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
