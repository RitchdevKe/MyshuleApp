const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const transportModels = `

model Vehicle {
  id                 String   @id @default(uuid())
  tenantId           String
  registrationNumber String   @unique
  make               String?
  model              String?
  capacity           Int      @default(0)
  status             String   @default("ACTIVE") // ACTIVE, MAINTENANCE, INACTIVE
  driverId           String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  tenant             Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  driver             Staff?   @relation(fields: [driverId], references: [id])
  trips              Trip[]
  fuelRecords        FuelRecord[]
}

model Trip {
  id          String   @id @default(uuid())
  tenantId    String
  routeId     String
  vehicleId   String
  driverId    String?
  date        DateTime @default(now())
  status      String   @default("SCHEDULED") // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  route       TransportRoute @relation(fields: [routeId], references: [id])
  vehicle     Vehicle        @relation(fields: [vehicleId], references: [id])
  driver      Staff?         @relation(fields: [driverId], references: [id])
}

model FuelRecord {
  id          String   @id @default(uuid())
  tenantId    String
  vehicleId   String
  amount      Float    @default(0) // liters/gallons
  cost        Float    @default(0) // total cost
  odometer    Int?
  date        DateTime @default(now())
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id])
}
`;

const tenantRelations = `
  vehicles          Vehicle[]
  trips             Trip[]
  fuelRecords       FuelRecord[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += transportModels;

fs.writeFileSync('prisma/schema.prisma', schema);
