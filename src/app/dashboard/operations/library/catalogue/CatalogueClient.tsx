"use client";

import React, { useState } from "react";
import { BookOpen, Search, Filter, Plus, Book, CheckCircle2, XCircle, AlertCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { getBooks, getLibraryStats, deleteBook, createBook, updateBook } from "./actions";

interface BookData {
  id: string;
  title: string;
  author: string;
  category?: string | null;
  copies: number;
  isbn?: string | null;
  status: string;
  available: number;
}

export default function CatalogueClient({ initialBooks, initialStats }: { initialBooks: BookData[], initialStats: { totalBooks: number, borrowed: number, available: number, lost: number } | null }) {
  const [books, setBooks] = useState(initialBooks);
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // For simplified add form
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("Computer Science");
  const [newCopies, setNewCopies] = useState(1);
  const [newIsbn, setNewIsbn] = useState("");

  const [editBookId, setEditBookId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCopies, setEditCopies] = useState(1);
  const [editIsbn, setEditIsbn] = useState("");

  const refreshData = async () => {
    setIsLoading(true);
    const booksRes = await getBooks();
    if (booksRes.success) setBooks(booksRes.data);
    const statsRes = await getLibraryStats();
    if (statsRes.success) setStats(statsRes.data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    const res = await deleteBook(id);
    if (res.success) {
      await refreshData();
    } else {
      alert("Error deleting book: " + res.error);
    }
  };

  const handleEditInit = (book: BookData) => {
    setEditBookId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category || "");
    setEditCopies(book.copies);
    setEditIsbn(book.isbn || "");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookId) return;
    
    const res = await updateBook(editBookId, {
      title: editTitle,
      author: editAuthor,
      category: editCategory,
      copies: editCopies,
      isbn: editIsbn
    });
    
    if (res.success) {
      setEditBookId(null);
      await refreshData();
    } else {
      alert("Error updating book: " + res.error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createBook({
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      copies: newCopies,
      isbn: newIsbn
    });
    if (res.success) {
      setIsAdding(false);
      setNewTitle("");
      setNewAuthor("");
      setNewCopies(1);
      setNewIsbn("");
      await refreshData();
    } else {
      alert("Error adding book: " + res.error);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.isbn && b.isbn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Total Books</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats?.totalBooks || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Borrowed</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{stats?.borrowed || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Available</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats?.available || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <BookOpen className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Library Catalogue</h2>
                 <p className="text-sm font-medium text-slate-500">Manage the inventory of physical books and learning materials.</p>
              </div>
           </div>
           <button 
             onClick={() => setIsAdding(!isAdding)}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              {isAdding ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAdding ? "Cancel" : "Add New Book"}
           </button>
        </div>

        {isAdding && (
          <div className="p-5 border-b border-slate-200/60 bg-white">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author *</label>
                <input required value={newAuthor} onChange={e => setNewAuthor(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                  <option>Computer Science</option>
                  <option>Software Eng</option>
                  <option>Mathematics</option>
                  <option>Fiction</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ISBN</label>
                <input value={newIsbn} onChange={e => setNewIsbn(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Copies</label>
                <input type="number" min="1" required value={newCopies} onChange={e => setNewCopies(parseInt(e.target.value))} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold">Save Book</button>
              </div>
            </form>
          </div>
        )}

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Title, Author, or ISBN..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Categories</option>
                 <option>Computer Science</option>
                 <option>Software Eng</option>
                 <option>Mathematics</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Book Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Availability</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-slate-100 text-slate-500 rounded-lg shrink-0 mt-0.5">
                          <Book className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm leading-tight">{book.title}</p>
                          <p className="text-xs font-medium text-slate-500 mt-1">by {book.author}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{book.id.substring(0,8)}</span>
                             {book.isbn && <span className="text-[10px] font-medium text-slate-400">ISBN: {book.isbn}</span>}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50">{book.category || 'N/A'}</span>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex flex-col items-center">
                        <span className={`text-lg font-black ${book.available > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {book.available} <span className="text-sm text-slate-400">/ {book.copies}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">On Shelf</span>
                     </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-start gap-1">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                         book.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 
                         book.status === 'MAINTENANCE' ? 'bg-amber-50 text-amber-600' : 
                         'bg-rose-50 text-rose-600'
                       }`}>
                         {book.status === 'AVAILABLE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {book.status === 'MAINTENANCE' && <AlertCircle className="w-3.5 h-3.5" />}
                         {book.status === 'LOST' && <XCircle className="w-3.5 h-3.5" />}
                         {book.status}
                       </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditInit(book)} className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors">
                           <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(book.id)} className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
      {editBookId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Edit Book</h3>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                  <input required value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author *</label>
                  <input required value={editAuthor} onChange={e => setEditAuthor(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                    <option>Computer Science</option>
                    <option>Software Eng</option>
                    <option>Mathematics</option>
                    <option>Fiction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ISBN</label>
                  <input value={editIsbn} onChange={e => setEditIsbn(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Copies</label>
                  <input type="number" min="1" required value={editCopies} onChange={e => setEditCopies(parseInt(e.target.value))} className="w-full p-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditBookId(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
