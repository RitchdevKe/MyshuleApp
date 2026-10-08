const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const libraryModels = `

model LibraryBook {
  id          String   @id @default(uuid())
  tenantId    String
  title       String
  author      String
  isbn        String?
  category    String?
  status      String   @default("AVAILABLE") // AVAILABLE, BORROWED, LOST, MAINTENANCE
  copies      Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant       Tenant               @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  circulations LibraryCirculation[]
}

model LibraryMember {
  id             String   @id @default(uuid())
  tenantId       String
  studentId      String   @unique
  membershipDate DateTime @default(now())
  status         String   @default("ACTIVE") // ACTIVE, SUSPENDED
  maxBooks       Int      @default(3)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  tenant       Tenant               @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  student      Student              @relation(fields: [studentId], references: [id], onDelete: Cascade)
  circulations LibraryCirculation[]
}

model LibraryCirculation {
  id         String   @id @default(uuid())
  tenantId   String
  bookId     String
  memberId   String
  issueDate  DateTime @default(now())
  dueDate    DateTime
  returnDate DateTime?
  status     String   @default("ISSUED") // ISSUED, RETURNED, OVERDUE, LOST
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  tenant     Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  book       LibraryBook   @relation(fields: [bookId], references: [id])
  member     LibraryMember @relation(fields: [memberId], references: [id])
}

model DigitalResource {
  id         String   @id @default(uuid())
  tenantId   String
  title      String
  type       String   // EBOOK, VIDEO, AUDIO, PDF
  url        String?
  uploadedBy String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  tenant     Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}
`;

const tenantRelations = `
  libraryBooks       LibraryBook[]
  libraryMembers     LibraryMember[]
  libraryCirculation LibraryCirculation[]
  digitalResources   DigitalResource[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += libraryModels;

fs.writeFileSync('prisma/schema.prisma', schema);
