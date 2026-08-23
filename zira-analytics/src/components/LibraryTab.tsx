import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  BookUp2, 
  CircleDollarSign, 
  Check, 
  Trash2, 
  Search, 
  AlertTriangle, 
  ArrowLeftRight,
  Filter,
  CheckCircle2,
  BookmarkMinus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

export function LibraryTab() {
  const { currency } = useCurrency();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'issued' | 'fines'>('catalog');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [lendingSearch, setLendingSearch] = useState('');
  const [fineSearch, setFineSearch] = useState('');

  // 1. Library Books Catalog State
  const [libraryBooks, setLibraryBooks] = useState([
    { id: '1', title: 'Secondary School Mathematics Form 4', isbn: '978-9966-22-1', author: 'KLB Kenya', qty: 150, issued: 114 },
    { id: '2', title: 'Blossoms of the Savannah Text Guide', isbn: '978-9966-33-2', author: 'Henry Ole Kulet', qty: 100, issued: 85 },
    { id: '3', title: 'Advanced Biology for East African Schools', isbn: '978-9966-44-3', author: 'Mercy Chepkoech', qty: 75, issued: 40 },
    { id: '4', title: 'Integrated Chemistry Manual', isbn: '978-9966-55-4', author: 'Gitumu & Dennis', qty: 80, issued: 55 }
  ]);

  // 2. Library Lending Ledger State
  const [libraryIssued, setLibraryIssued] = useState([
    { id: '1', student: 'Douglas Omari', bookId: '4', book: 'Integrated Chemistry Manual', date: '2026-05-10', due: '2026-06-10', status: 'Active' },
    { id: '2', student: 'Kevin Kiprop', bookId: '2', book: 'Blossoms of the Savannah Text Guide', date: '2026-05-18', due: '2026-06-01', status: 'Active' },
    { id: '3', student: 'Emily Wanjala', bookId: '1', book: 'Secondary School Mathematics Form 4', date: '2026-04-12', due: '2026-05-12', status: 'Overdue' }
  ]);

  // 3. Library Overdue Fines State (Imported from extra modules / existing system specs)
  const [libraryFinesList, setLibraryFinesList] = useState([
    { id: 'lf1', student: 'Emily Wanjala', book: 'Secondary School Mathematics Form 4', fineAmount: 150, unpaid: true },
    { id: 'lf2', student: 'Adrian Kipirono', book: 'Integrated Chemistry Manual', fineAmount: 0, unpaid: false },
    { id: 'lf3', student: 'Douglas Omari', book: 'Blossoms of the Savannah Text Guide', fineAmount: 200, unpaid: true }
  ]);

  // ----------------------------------------------------------------------
  // METRICS CALCULATOR
  // ----------------------------------------------------------------------
  const totalBooksCount = libraryBooks.reduce((acc, book) => acc + book.qty, 0);
  const currentIssuedBooksCount = libraryIssued.filter(item => item.status !== 'Returned').length;
  const overdueLoansCount = libraryIssued.filter(item => item.status === 'Overdue').length;
  const outstandingFinesSum = libraryFinesList
    .filter(f => f.unpaid)
    .reduce((acc, f) => acc + f.fineAmount, 0);

  // ----------------------------------------------------------------------
  // ACTIONS / HANDLERS
  // ----------------------------------------------------------------------
  const handleOnboardBook = (e: React.FormEvent) => {
    e.preventDefault();
    const titleInput = document.getElementById('lb-title') as HTMLInputElement;
    const authorInput = document.getElementById('lb-author') as HTMLInputElement;
    const isbnInput = document.getElementById('lb-isbn') as HTMLInputElement;
    const qtyInput = document.getElementById('lb-qty') as HTMLInputElement;

    const title = titleInput?.value.trim();
    const author = authorInput?.value.trim();
    const isbn = isbnInput?.value.trim();
    const qty = parseInt(qtyInput?.value || '50');

    if (!title || !author || !isbn) {
      toast.error('Please input correct book title, author and ISBN credentials.');
      return;
    }

    const newBook = {
      id: String(Date.now()),
      title,
      author,
      isbn,
      qty,
      issued: 0
    };

    setLibraryBooks([newBook, ...libraryBooks]);
    toast.success(`"${title}" registered successfully inside library stock.`);
    
    // reset form fields
    if (titleInput) titleInput.value = '';
    if (authorInput) authorInput.value = '';
    if (isbnInput) isbnInput.value = '';
    if (qtyInput) qtyInput.value = '50';
  };

  const handleCheckoutBook = (e: React.FormEvent) => {
    e.preventDefault();
    const studentInput = document.getElementById('li-student') as HTMLInputElement;
    const selectBook = document.getElementById('li-book-select') as HTMLSelectElement;
    const dueInput = document.getElementById('li-due-date') as HTMLInputElement;

    const student = studentInput?.value.trim();
    const bookId = selectBook?.value;
    const dueDate = dueInput?.value;

    if (!student || !bookId || !dueDate) {
      toast.error('All fields must be filled to issue a book checkout.');
      return;
    }

    const matchedBook = libraryBooks.find(b => b.id === bookId);
    if (!matchedBook) {
      toast.error('Invalid book catalog choice.');
      return;
    }

    if (matchedBook.issued >= matchedBook.qty) {
      toast.error('No copies left under inventory catalog for check-out.');
      return;
    }

    // Update book status - increment issued count
    setLibraryBooks(prev => prev.map(b => b.id === bookId ? { ...b, issued: b.issued + 1 } : b));

    const newLending = {
      id: String(Date.now()),
      student,
      bookId,
      book: matchedBook.title,
      date: new Date().toISOString().split('T')[0],
      due: dueDate,
      status: 'Active'
    };

    setLibraryIssued([newLending, ...libraryIssued]);
    toast.success(`Checked out "${matchedBook.title}" to student: ${student}`);
    
    if (studentInput) studentInput.value = '';
  };

  const handleReturnBook = (lendingId: string) => {
    const loan = libraryIssued.find(l => l.id === lendingId);
    if (!loan) return;

    // Update book stock - decrement issued count
    setLibraryBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, issued: Math.max(0, b.issued - 1) } : b));

    // Update loan status to 'Returned'
    setLibraryIssued(prev => prev.map(l => l.id === lendingId ? { ...l, status: 'Returned' } : l));
    toast.success(`Book "${loan.book}" checked in successfully.`);
  };

  const handleUpdateStatus = (lendingId: string, newStatus: string) => {
    setLibraryIssued(prev => prev.map(l => l.id === lendingId ? { ...l, status: newStatus } : l));
    toast.success(`Updated loan checkout status to: ${newStatus}`);
  };

  const handleAddFine = (e: React.FormEvent) => {
    e.preventDefault();
    const studentInput = document.getElementById('lf-student') as HTMLInputElement;
    const bookInput = document.getElementById('lf-book') as HTMLInputElement;
    const amountInput = document.getElementById('lf-amount') as HTMLInputElement;

    const student = studentInput?.value.trim();
    const book = bookInput?.value.trim();
    const amount = parseInt(amountInput?.value || '0');

    if (!student || !book || amount <= 0) {
      toast.error('Input a valid student name, book, and fine penalty sum greater than 0.');
      return;
    }

    const newFine = {
      id: 'lf' + Date.now(),
      student,
      book,
      fineAmount: amount,
      unpaid: true
    };

    setLibraryFinesList([newFine, ...libraryFinesList]);
    toast.success(`Charged ${currency} ${amount} library penalty fine on student: ${student}`);

    if (studentInput) studentInput.value = '';
    if (bookInput) bookInput.value = '';
    if (amountInput) amountInput.value = '';
  };

  const handleSettleFine = (fineId: string) => {
    setLibraryFinesList(prev => prev.map(f => f.id === fineId ? { ...f, unpaid: false } : f));
    toast.success('Library fine penalty marked as fully settled and clear!');
  };

  const handleDeleteBook = (bookId: string) => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (book && book.issued > 0) {
      toast.error('Cannot remove book that is currently checked out by active students.');
      return;
    }
    setLibraryBooks(prev => prev.filter(b => b.id !== bookId));
    toast.success('Book catalog record deleted successfully.');
  };

  // ----------------------------------------------------------------------
  // COHORT FILTERED ARRAYS
  // ----------------------------------------------------------------------
  const filteredCatalog = libraryBooks.filter(b => 
    b.title.toLowerCase().includes(catalogSearch.toLowerCase()) || 
    b.author.toLowerCase().includes(catalogSearch.toLowerCase()) || 
    b.isbn.includes(catalogSearch)
  );

  const filteredLending = libraryIssued.filter(l => 
    l.student.toLowerCase().includes(lendingSearch.toLowerCase()) || 
    l.book.toLowerCase().includes(lendingSearch.toLowerCase())
  );

  const filteredFines = libraryFinesList.filter(f => 
    f.student.toLowerCase().includes(fineSearch.toLowerCase()) || 
    f.book.toLowerCase().includes(fineSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-lg text-slate-700">
      
      {/* 🚀 Segmented Tab Controls */}
      <div className="flex flex-wrap bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2 gap-1.5 shadow-sm">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'catalog' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Catalog Inventory
        </button>
        
        <button
          onClick={() => setActiveSubTab('issued')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'issued' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookUp2 className="w-4 h-4" />
          Lending Ledger
        </button>

        <button
          onClick={() => setActiveSubTab('fines')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'fines' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CircleDollarSign className="w-4 h-4" />
          Library Fines Ledger
        </button>
      </div>

      {/* Realtime KPI Widget Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-orange-50 rounded-xl text-orange-600 shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="block text-3xl font-bold text-slate-800">{totalBooksCount}</span>
            <span className="text-[15px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Total Textbooks</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">
            <BookUp2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="block text-3xl font-bold text-slate-800">{currentIssuedBooksCount}</span>
            <span className="text-[15px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Currently Checked-Out</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 rounded-xl text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="block text-3xl font-bold text-rose-600">{overdueLoansCount}</span>
            <span className="text-[15px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Overdue Accounts</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
            <CircleDollarSign className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="block text-3xl font-bold text-slate-800">{currency} {outstandingFinesSum}</span>
            <span className="text-[15px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Outstanding Fines</span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SUB TAB 1: CATALOG INVENTORY
          ---------------------------------------------------------------------- */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Onboard Textbooks & Literature Catalog</h3>
              <p className="text-[12.5px] text-slate-500 mt-1">Add book copies, track available stock balances, and monitor reference editions.</p>
            </div>
            
            <form onSubmit={handleOnboardBook} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b border-slate-100 bg-white">
              <div className="space-y-1">
                <label className="block text-base font-bold text-slate-500 uppercase tracking-wider">Book Title Title</label>
                <input type="text" id="lb-title" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-semibold outline-none transition" placeholder="e.g. Blossoms of the Savannah" />
              </div>
              <div className="space-y-1">
                <label className="block text-base font-bold text-slate-500 uppercase tracking-wider">Author / Publisher</label>
                <input type="text" id="lb-author" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-semibold outline-none transition" placeholder="e.g. Henry Ole Kulet" />
              </div>
              <div className="space-y-1">
                <label className="block text-base font-bold text-slate-500 uppercase tracking-wider">ISBN Number</label>
                <input type="text" id="lb-isbn" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-semibold outline-none transition" placeholder="e.g. 978-9966-33-2" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-base font-bold text-slate-500 uppercase tracking-wider">Qty Registered</label>
                  <input type="number" id="lb-qty" defaultValue="50" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-semibold outline-none transition" />
                </div>
                <button 
                  type="submit"
                  className="px-4.5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[17px] font-bold rounded-xl transition cursor-pointer shadow-md shadow-orange-500/15 flex items-center justify-center gap-1.5 self-end border-none h-[42px]"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" /> Register
                </button>
              </div>
            </form>

            <div className="p-5 flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/20">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={catalogSearch} 
                  onChange={e => setCatalogSearch(e.target.value)} 
                  placeholder="Search book title, author, or ISBN..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-base font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] tabular-nums font-bold text-slate-400 uppercase">Interactive Inventory Catalog</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-lg border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-400">
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider">Book Identity Details</th>
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider">ISBN Code</th>
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider">Author / Publisher</th>
                    <th className="px-4 py-3.5 font-bold uppercase text-[15px] tracking-wider text-center">Total Stock</th>
                    <th className="px-4 py-3.5 font-bold uppercase text-[15px] tracking-wider text-center">In Custody</th>
                    <th className="px-4 py-3.5 font-bold uppercase text-[15px] tracking-wider text-center">Available Left</th>
                    <th className="px-6 py-3.5 text-right font-bold uppercase text-[15px] tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-1 py-3 bg-white">
                  {filteredCatalog.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 font-bold text-slate-400">No books found in the inventory matches the search criteria.</td>
                    </tr>
                  ) : (
                    filteredCatalog.map(b => {
                      const av = b.qty - b.issued;
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                            <span className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                              <BookOpen className="w-4 h-4 stroke-[2.5]" />
                            </span>
                            <span>{b.title}</span>
                          </td>
                          <td className="px-6 py-4 tabular-nums text-base font-bold text-slate-500">{b.isbn}</td>
                          <td className="px-6 py-4 font-semibold text-slate-600">{b.author}</td>
                          <td className="px-4 py-4 text-center tabular-nums font-bold text-slate-700">{b.qty} Pcs</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded-lg text-base font-bold ${b.issued > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                              {b.issued} Out
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center tabular-nums font-bold">
                            <span className={`text-lg ${av <= 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}`}>
                              {av} Left
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteBook(b.id)}
                              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                              title="Delete catalog record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          SUB TAB 2: LENDING LEDGER
          ---------------------------------------------------------------------- */}
      {activeSubTab === 'issued' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Active Rentals & Lending Registry</h3>
              <p className="text-[12.5px] text-slate-500 mt-1">Issue book copies to students, modify checkout conditions, and clear accounts on check-in.</p>
            </div>

            <form onSubmit={handleCheckoutBook} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b border-slate-100 bg-white">
              <div className="space-y-1">
                <label className="block text-base font-bold text-slate-500 uppercase tracking-wider">Select Student ADM No / Name</label>
                <input type="text" id="li-student" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-semibold outline-none transition" placeholder="e.g. Adrian Kipirono" />
              </div>
              <div className="space-y-1">
                <label className="block text-base font-bold text-slate-500 uppercase tracking-wider">Select Available Textbook</label>
                <select id="li-book-select" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-semibold outline-none transition bg-white cursor-pointer">
                  {libraryBooks.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.qty - b.issued} copies remaining)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-base font-bold text-slate-500 uppercase tracking-wider">Overdue Maturity Due Date</label>
                  <input type="date" id="li-due-date" defaultValue="2026-06-30" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-semibold outline-none transition" />
                </div>
                <button 
                  type="submit"
                  className="px-4.5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[17px] font-bold rounded-xl transition cursor-pointer shadow-md shadow-orange-500/15 flex items-center justify-center gap-1.5 self-end border-none h-[42px]"
                >
                  <BookUp2 className="w-4 h-4 stroke-[2.5]" /> Issue Checkout
                </button>
              </div>
            </form>

            <div className="p-5 flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/20">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={lendingSearch} 
                  onChange={e => setLendingSearch(e.target.value)} 
                  placeholder="Search student or issued textbook..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-base font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-lg border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-400">
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider">Issued Student</th>
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider">Checked-out Textbook</th>
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider text-center">Rental Date</th>
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider text-center">Due Date</th>
                    <th className="px-6 py-3.5 font-bold uppercase text-[15px] tracking-wider text-center">Maturity Status</th>
                    <th className="px-6 py-3.5 text-right font-bold uppercase text-[15px] tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-1 py-3 bg-white">
                  {filteredLending.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 font-bold text-slate-400">No active student checkouts or matching rental records found.</td>
                    </tr>
                  ) : (
                    filteredLending.map(l => {
                      const isReturned = l.status === 'Returned';
                      return (
                        <tr key={l.id} className={`hover:bg-slate-50/50 transition ${isReturned ? 'opacity-60 bg-slate-50/20' : ''}`}>
                          <td className="px-6 py-4 font-bold text-slate-900">{l.student}</td>
                          <td className="px-6 py-4 font-bold text-slate-700">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              <span>{l.book}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center tabular-nums text-slate-500">{l.date}</td>
                          <td className="px-6 py-4 text-center tabular-nums font-bold text-slate-600">{l.due}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10.5px] uppercase tracking-wider font-bold tabular-nums border ${
                              l.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              l.status === 'Overdue' ? 'bg-rose-50 text-rose-750 border-rose-250 animate-pulse' :
                              'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            {!isReturned && (
                              <>
                                <button 
                                  onClick={() => handleReturnBook(l.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-base transition cursor-pointer flex items-center gap-1 border-none"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Return Book
                                </button>
                                {l.status === 'Active' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(l.id, 'Overdue')}
                                    className="px-2 py-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-base font-bold transition cursor-pointer"
                                  >
                                    Mark Overdue
                                  </button>
                                )}
                              </>
                            )}
                            {isReturned && (
                              <span className="text-[15px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-650 text-white" /> Checked-In
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          SUB TAB 3: OVERDUE FINES LEDGER
          ---------------------------------------------------------------------- */}
      {activeSubTab === 'fines' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Charge Fine Form Panel */}
            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm h-fit">
              <div className="p-5 border-b border-slate-250 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 uppercase">Debiting Overdue Fines</h3>
                <p className="text-base text-slate-500 mt-1">Assess financial fine penalties on damaged or lost textbook items.</p>
              </div>
              <form onSubmit={handleAddFine} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-base font-bold text-slate-705">Student Name / ID No</label>
                  <input type="text" id="lf-student" className="w-full text-lg font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="e.g. Emily Wanjala" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-base font-bold text-slate-705">Associated Book Material</label>
                  <input type="text" id="lf-book" className="w-full text-lg font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder="e.g. Secondary School Mathematics Form 4" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-base font-bold text-slate-705">Penalty Charge Amount (${currency})</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 tabular-nums text-base font-bold text-slate-400">{currency}</span>
                    <input type="number" id="lf-amount" defaultValue="150" className="w-full pl-11 text-lg font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-orange-500 outline-none transition" />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-orange-650 hover:bg-orange-600 text-white font-bold text-[17px] rounded-xl cursor-pointer shadow-md transition flex items-center justify-center gap-1 border-none"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" /> Charge Student Penalty
                </button>
              </form>
            </div>

            {/* Fines Table Panel */}
            <div className="lg:col-span-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 uppercase">Active Penalties & Fines Registry</h3>
                <p className="text-[12.5px] text-slate-500 mt-1">Continuous reconciliation of student fines. Settle outstanding fees directly through electronic debiting.</p>
              </div>

              <div className="p-4 border-b border-slate-100 bg-white">
                <div className="relative w-full max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={fineSearch} 
                    onChange={e => setFineSearch(e.target.value)} 
                    placeholder="Search standard library fines list..." 
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-base font-semibold outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-lg border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-400">
                      <th className="px-5 py-3 font-bold uppercase text-[15px] tracking-wider">Penalized Student</th>
                      <th className="px-5 py-3 font-bold uppercase text-[15px] tracking-wider">Book Involved</th>
                      <th className="px-4 py-3 font-bold uppercase text-[15px] tracking-wider text-center">Amount Due</th>
                      <th className="px-5 py-3 text-right font-bold uppercase text-[15px] tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-1 bg-white">
                    {filteredFines.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 font-bold text-slate-400">No student library penalty balances found.</td>
                      </tr>
                    ) : (
                      filteredFines.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50/40 transition">
                          <td className="px-5 py-4 font-bold text-slate-900">{f.student}</td>
                          <td className="px-5 py-4 font-semibold text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <BookmarkMinus className="w-3.5 h-3.5 text-slate-400" />
                              <span>{f.book}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center tabular-nums font-bold text-slate-700">{currency} {f.fineAmount}</td>
                          <td className="px-5 py-4 text-right">
                            {f.unpaid ? (
                              <button 
                                onClick={() => handleSettleFine(f.id)}
                                className="px-3 py-1 bg-orange-100 hover:bg-orange-200 border border-orange-200 text-orange-850 rounded-lg text-base font-bold transition cursor-pointer inline-flex items-center gap-1"
                              >
                                <CircleDollarSign className="w-3.5 h-3.5 text-orange-600" /> Settle Fine
                              </button>
                            ) : (
                              <span className="text-base font-bold text-emerald-600 bg-emerald-55 border border-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                                Fully Paid & Settle
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
