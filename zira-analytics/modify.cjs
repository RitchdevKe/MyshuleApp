const fs = require('fs');
let code = fs.readFileSync('src/components/ExtraModules.tsx', 'utf8');
const lines = code.split('\n');
const replacement = `    case 'staff_attendance':
      return <StaffAttendanceTab />;

    case 'leave_management':
      return <LeaveManagementTab />;

    case 'payroll':
      return <PayrollTab />;`;

const newLines = [
  ...lines.slice(0, 916),
  replacement,
  ...lines.slice(1808)
];
fs.writeFileSync('src/components/ExtraModules.tsx', newLines.join('\n'));
