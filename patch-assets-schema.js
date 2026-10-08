const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const assetModels = `

model Facility {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  type        String
  capacity    Int?
  location    String?
  status      String   @default("ACTIVE") // ACTIVE, MAINTENANCE, INACTIVE
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  assets      Asset[]
  workOrders  WorkOrder[]
  inspections Inspection[]
}

model Asset {
  id           String   @id @default(uuid())
  tenantId     String
  assetTag     String   @unique
  name         String
  category     String
  status       String   @default("ACTIVE") // ACTIVE, MAINTENANCE, RETIRED, LOST
  purchaseDate DateTime?
  purchaseCost Float    @default(0)
  condition    String   @default("GOOD") // GOOD, FAIR, POOR, CRITICAL
  facilityId   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  tenant       Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  facility     Facility? @relation(fields: [facilityId], references: [id])
  maintenanceRecords MaintenanceRecord[]
  workOrders   WorkOrder[]
}

model MaintenanceRecord {
  id          String   @id @default(uuid())
  tenantId    String
  assetId     String
  type        String   // PREVENTIVE, CORRECTIVE
  description String
  cost        Float    @default(0)
  date        DateTime @default(now())
  status      String   @default("COMPLETED") // SCHEDULED, IN_PROGRESS, COMPLETED
  performedBy String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  asset       Asset    @relation(fields: [assetId], references: [id], onDelete: Cascade)
}

model WorkOrder {
  id          String   @id @default(uuid())
  tenantId    String
  orderNumber String   @unique
  title       String
  description String?
  priority    String   @default("MEDIUM") // LOW, MEDIUM, HIGH, URGENT
  status      String   @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  assignedTo  String?
  facilityId  String?
  assetId     String?
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  facility    Facility? @relation(fields: [facilityId], references: [id])
  asset       Asset?    @relation(fields: [assetId], references: [id])
}

model Inspection {
  id          String   @id @default(uuid())
  tenantId    String
  facilityId  String
  inspector   String
  date        DateTime @default(now())
  status      String   @default("PENDING") // PENDING, PASSED, FAILED, NEEDS_ATTENTION
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  facility    Facility @relation(fields: [facilityId], references: [id], onDelete: Cascade)
}
`;

const tenantRelations = `
  facilities        Facility[]
  assets            Asset[]
  maintenanceRecords MaintenanceRecord[]
  workOrders        WorkOrder[]
  inspections       Inspection[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += assetModels;

fs.writeFileSync('prisma/schema.prisma', schema);
