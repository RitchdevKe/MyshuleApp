const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const hostelModels = `

model Hostel {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  type        String   // BOYS, GIRLS, MIXED
  capacity    Int      @default(0)
  warden      String?
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  rooms       HostelRoom[]
  allocations HostelAllocation[]
}

model HostelRoom {
  id          String   @id @default(uuid())
  tenantId    String
  hostelId    String
  roomNumber  String
  capacity    Int      @default(1)
  type        String   // STANDARD, DELUXE, DORMATORY
  status      String   @default("AVAILABLE") // AVAILABLE, FULL, MAINTENANCE
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant       Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  hostel       Hostel             @relation(fields: [hostelId], references: [id], onDelete: Cascade)
  allocations  HostelAllocation[]
}

model HostelAllocation {
  id           String   @id @default(uuid())
  tenantId     String
  hostelId     String
  roomId       String
  studentId    String   @unique
  dateAllocated DateTime @default(now())
  status       String   @default("ACTIVE") // ACTIVE, VACATED
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  tenant  Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  hostel  Hostel     @relation(fields: [hostelId], references: [id])
  room    HostelRoom @relation(fields: [roomId], references: [id])
  student Student    @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

model BoardingAttendance {
  id        String   @id @default(uuid())
  tenantId  String
  studentId String
  date      DateTime @default(now())
  status    String   // PRESENT, ABSENT, LEAVE
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tenant  Tenant  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  student Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
}
`;

const tenantRelations = `
  hostels             Hostel[]
  hostelRooms         HostelRoom[]
  hostelAllocations   HostelAllocation[]
  boardingAttendances BoardingAttendance[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += hostelModels;

fs.writeFileSync('prisma/schema.prisma', schema);
