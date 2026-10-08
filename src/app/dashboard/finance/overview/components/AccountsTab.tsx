import { Wallet } from "lucide-react";

const formatCurrency = (amount: number, currency: string = "KES") => {
  if (amount >= 1000000) {
    return `${currency} ${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `${currency} ${(amount / 1000).toFixed(0)}K`;
  }
  return `${currency} ${amount}`;
};

export default function AccountsTab({ data }: { data: any }) {
  const accounts = data || [];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h3 className="text-lg font-black text-slate-800 mb-6">Cash & Bank Accounts</h3>
      {accounts.length === 0 ? (
        <div className="text-center text-slate-500 py-10">
          No bank accounts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc: any) => (
            <div key={acc.id} className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-primary-600 transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">{acc.accountName || acc.bankName}</span>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {formatCurrency(acc.balance, acc.currency)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
