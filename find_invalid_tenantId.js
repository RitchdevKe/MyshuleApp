const fs = require('fs');
const path = require('path');

const models = ["user","permission","rolePermission","gradingScaleRange","feeItem","invoiceItem","attendanceRecord","extracurricularMembership","transportAssignment","message","userGroupMember", "class"];

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      searchFiles(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for tenantId at the root of a where object
      // E.g. where: { tenantId: ... } or where: { something: true, tenantId: ... }
      for (const m of models) {
        // A bit hacky: just look for `tenantId` without nesting
        // Since it's hard to parse AST with regex, we can just look for the TS error again!
        // But wait, the TS error TS2353 in the tsc log was NOT pointing to `where: { tenantId }`!
      }
    }
  }
}

searchFiles('./src/app');
