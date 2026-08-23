import fs from 'fs';

const filePath = 'src/components/ExtraModules.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const leaveMod = `            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 uppercase">Leave Approvals Queue</h3>
              <p className="text-[13px] text-slate-500 mt-1">Review personal, maternity, and sick leave requests dynamically</p>
            </div>
            <div className="p-5 flex flex-col md:flex-row gap-4 items-end bg-white border-b border-slate-200">
              <div className="flex-[2] w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Staff Name</label>
                <input type="text" id="lm-name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="e.g. Mr. Dennis Omwamba" />
              </div>
              <div className="flex-[3] w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Reason / Type</label>
                <input type="text" id="lm-reason" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="e.g. Personal Leave" />
              </div>
              <button 
                onClick={() => {
                  const name = document.getElementById('lm-name') as HTMLInputElement;
                  const type = document.getElementById('lm-reason') as HTMLInputElement;
                  if (name?.value && type?.value) {
                    setLeaveRequests([{
                      id: String(Date.now()),
                      name: name.value,
                      type: type.value,
                      start: new Date().toISOString().split('T')[0],
                      end: new Date(Date.now() + 86400000*3).toISOString().split('T')[0],
                      days: 3,
                      status: 'Pending'
                    }, ...leaveRequests]);
                    name.value = '';
                    type.value = '';
                    toast.success('Leave requested successfully.');
                  } else {
                    toast.error('Please enter name and reason.');
                  }
                }}
                className="px-6 py-2 bg-[#8f3a6a] text-white text-sm font-bold rounded-xl hover:bg-[#722152] transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Request Leave
              </button>
            </div>`;

content = content.replace(
  /<div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">\s*<div>\s*<h3 className="text-base font-bold text-slate-900 uppercase">Leave Approvals Queue<\/h3>\s*<\/div>\s*<button[\s\S]*?<\/button>\s*<\/div>/,
  leaveMod
);

const libBooksMod = `            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 uppercase">Library Book Catalog</h3>
            </div>
            <div className="p-5 flex flex-col md:flex-row gap-4 items-end bg-white border-b border-slate-200">
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Book Title</label>
                <input type="text" id="lb-title" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="Title" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Author</label>
                <input type="text" id="lb-author" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="Author" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">ISBN</label>
                <input type="text" id="lb-isbn" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="ISBN" />
              </div>
              <button 
                onClick={() => {
                  const title = document.getElementById('lb-title') as HTMLInputElement;
                  const isbn = document.getElementById('lb-isbn') as HTMLInputElement;
                  const author = document.getElementById('lb-author') as HTMLInputElement;
                  if (title?.value && isbn?.value && author?.value) {
                    setLibraryBooks([{
                      id: String(Date.now()),
                      title: title.value,
                      isbn: isbn.value,
                      author: author.value,
                      qty: 1,
                      issued: 0
                    }, ...libraryBooks]);
                    title.value=''; isbn.value=''; author.value='';
                    toast.success('Book cataloged successfully.');
                  } else {
                    toast.error('Please fill all fields');
                  }
                }}
                className="px-6 py-2 bg-[#8f3a6a] text-white text-sm font-bold rounded-xl hover:bg-[#722152] transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Catalog Book
              </button>
            </div>`;

content = content.replace(
  /<div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">\s*<div>\s*<h3 className="text-base font-bold text-slate-900 uppercase">Library Book Catalog<\/h3>\s*<\/div>\s*<button[\s\S]*?<\/button>\s*<\/div>/,
  libBooksMod
);


const libIssuedMod = `            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 uppercase">Library Lending Tracker</h3>
            </div>
            <div className="p-5 flex flex-col md:flex-row gap-4 items-end bg-white border-b border-slate-200">
               <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Student</label>
                <input type="text" id="li-student" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="Student name" />
              </div>
              <div className="flex-[2] w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Book Title</label>
                <input type="text" id="li-book" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="Book name" />
              </div>
              <button 
                onClick={() => {
                  const student = document.getElementById('li-student') as HTMLInputElement;
                  const book = document.getElementById('li-book') as HTMLInputElement;
                  if (student?.value && book?.value) {
                    setLibraryIssued([{
                      id: String(Date.now()),
                      student: student.value,
                      book: book.value,
                      date: new Date().toISOString().split('T')[0],
                      due: new Date(Date.now() + 86400000*14).toISOString().split('T')[0],
                      status: 'Active'
                    }, ...libraryIssued]);
                    student.value=''; book.value='';
                    toast.success('Book issued successfully.');
                  } else {
                     toast.error('Fields are missing');
                  }
                }}
                className="px-6 py-2 bg-[#8f3a6a] text-white text-sm font-bold rounded-xl hover:bg-[#722152] transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Issue Book Check-Out
              </button>
            </div>`;

content = content.replace(
  /<div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">\s*<div>\s*<h3 className="text-base font-bold text-slate-900 uppercase">Library Lending Tracker<\/h3>\s*<\/div>\s*<button[\s\S]*?<\/button>\s*<\/div>/,
  libIssuedMod
);


const healthMod = `            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 uppercase">School Medical Clinic</h3>
            </div>
            <div className="p-5 flex flex-col md:flex-row gap-4 items-end bg-white border-b border-slate-200">
               <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Student / Patient</label>
                <input type="text" id="hl-student" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="Name" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Ailment / Symptoms</label>
                <input type="text" id="hl-comp" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="Diagnosis" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Treatment Plan</label>
                <input type="text" id="hl-act" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold" placeholder="Prescription" />
              </div>
              <button 
                onClick={() => {
                  const student = document.getElementById('hl-student') as HTMLInputElement;
                  const complaint = document.getElementById('hl-comp') as HTMLInputElement;
                  const action = document.getElementById('hl-act') as HTMLInputElement;
                  if (student?.value && complaint?.value && action?.value) {
                    setClinicLogs([{
                      id: String(Date.now()),
                      student: student.value,
                      complaint: complaint.value,
                      action: action.value,
                      date: new Date().toISOString().split('T')[0],
                      status: 'Under Observation'
                    }, ...clinicLogs]);
                    student.value=''; complaint.value=''; action.value='';
                    toast.success('Patient log filed successfully.');
                  } else {
                    toast.error('All fields must be filled');
                  }
                }}
                className="px-6 py-2 bg-[#8f3a6a] text-white text-sm font-bold rounded-xl hover:bg-[#722152] transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Register Patient Log
              </button>
            </div>`;

content = content.replace(
  /<div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">\s*<div>\s*<h3 className="text-base font-bold text-slate-900 uppercase">School Medical Clinic<\/h3>\s*<\/div>\s*<button[\s\S]*?<\/button>\s*<\/div>/,
  healthMod
);

fs.writeFileSync(filePath, content);
console.log('Finished replacing prompts');
