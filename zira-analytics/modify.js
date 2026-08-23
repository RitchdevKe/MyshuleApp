const fs = require('fs');
let code = fs.readFileSync('src/components/ExtraModules.tsx', 'utf8');
const lines = code.split('\n');
const newLines = [
  ...lines.slice(0, 916),
  '    case \\'staff_attendance\\':\\n      return <StaffAttendanceTab />;\\n\\n    case \\'leave_management\\':\\n      return <LeaveManagementTab />;\\n\\n    case \\'payroll\\':\\n      return <PayrollTab />;',
  ...lines.slice(1808)
];
fs.writeFileSync('src/components/ExtraModules.tsx', newLines.join('\n'));
