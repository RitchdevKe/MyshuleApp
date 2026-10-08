import AskMyShuleClient from './AskMyShuleClient';

export default function AskMyShulePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Ask MyShule AI</h1>
        <p className="text-slate-400 mt-2">Your intelligent assistant for school operations and insights.</p>
      </div>
      <AskMyShuleClient />
    </div>
  );
}
