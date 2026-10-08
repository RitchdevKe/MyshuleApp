const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const healthModels = `

model ClinicInventory {
  id          String   @id @default(uuid())
  tenantId    String
  itemName    String
  quantity    Int      @default(0)
  unit        String?
  expiryDate  DateTime?
  status      String   @default("IN_STOCK") // LOW_STOCK, OUT_OF_STOCK
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model MedicalRecord {
  id            String   @id @default(uuid())
  tenantId      String
  studentId     String   @unique
  bloodGroup    String?
  allergies     String?
  conditions    String?
  immunizations String?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  student       Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

model ClinicVisit {
  id          String   @id @default(uuid())
  tenantId    String
  studentId   String
  visitDate   DateTime @default(now())
  reason      String
  diagnosis   String?
  treatment   String?
  handledBy   String?
  status      String   @default("COMPLETED") // PENDING, REFERRED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

model EmergencyContact {
  id               String   @id @default(uuid())
  tenantId         String
  studentId        String
  name             String
  relationship     String
  phoneNumber      String
  alternativePhone String?
  email            String?
  priority         Int      @default(1)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  student      Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

model WelfareSession {
  id          String   @id @default(uuid())
  tenantId    String
  studentId   String
  sessionDate DateTime @default(now())
  counselor   String
  category    String   // ACADEMIC, BEHAVIORAL, PERSONAL
  notes       String?
  status      String   @default("OPEN") // OPEN, RESOLVED, REFERRED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
}
`;

const tenantRelations = `
  clinicInventories   ClinicInventory[]
  medicalRecords      MedicalRecord[]
  clinicVisits        ClinicVisit[]
  emergencyContacts   EmergencyContact[]
  welfareSessions     WelfareSession[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += healthModels;

fs.writeFileSync('prisma/schema.prisma', schema);
