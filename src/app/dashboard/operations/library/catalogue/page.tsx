"use client";

import React from "react";
import { BookOpen, Search, Filter, Plus, Book, CheckCircle2, XCircle, AlertCircle, Bookmark } from "lucide-react";

export default function CataloguePage() {
  const books = [
    { id: "LIB-8842", isbn: "978-0131103627", title: "The C Programming Language", author: "Brian W. Kernighan", category: "Computer Science", copies: 5, available: 2, status: "Available", condition: "Good" },
    { id: "LIB-8841", isbn: "978-0201835953", title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", category: "Software Eng", copies: 3, available: 0, status: "Checked Out", condition: "Fair" },
    { id: "LIB-8840", isbn: "978-0262033848", title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Computer Science", copies: 8, available: 8, status: "Available", condition: "Excellent" },
    { id: "LIB-8839", isbn: "978-0321751041", title: "Design Patterns", author: "Erich Gamma", category: "Software Eng", copies: 2, available: 0, status: "Lost/Missing", condition: "Unknown" },
    { id: "LIB-8838", isbn: "978-0132350884", title: "Clean Code", author: "Robert C. Martin", category: "Computer Science", copies: 10, available: 4, status: "Available", condition: "Good" },
  ];

  return (
    <div className="space-y-6">
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
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Add New Book
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Title, Author, or ISBN..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Book Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Availability</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Condition</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((book) => (
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
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{book.id}</span>
                             <span className="text-[10px] font-medium text-slate-400">ISBN: {book.isbn}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100/50">{book.category}</span>
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
                         book.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 
                         book.status === 'Checked Out' ? 'bg-amber-50 text-amber-600' : 
                         'bg-rose-50 text-rose-600'
                       }`}>
                         {book.status === 'Available' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {book.status === 'Checked Out' && <AlertCircle className="w-3.5 h-3.5" />}
                         {book.status === 'Lost/Missing' && <XCircle className="w-3.5 h-3.5" />}
                         {book.status}
                       </span>
                       <span className={`text-[10px] font-bold ml-1 ${
                          book.condition === 'Excellent' || book.condition === 'Good' ? 'text-slate-500' : 'text-rose-500'
                       }`}>
                          Condition: {book.condition}
                       </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors">
                           <Bookmark className="w-5 h-5" />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
