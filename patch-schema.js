const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const procurementModels = `

model Supplier {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  contactName String?
  email       String?
  phone       String?
  address     String?
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant           Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  purchaseRequests PurchaseRequest[]
  purchaseOrders   PurchaseOrder[]
  grns             GoodsReceivedNote[]
}

model PurchaseRequest {
  id             String   @id @default(uuid())
  tenantId       String
  requestNumber  String   @unique
  department     String?
  requestedBy    String 
  description    String
  amount         Float
  status         String   @default("PENDING")
  supplierId     String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  tenant         Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  supplier       Supplier?      @relation(fields: [supplierId], references: [id])
  purchaseOrders PurchaseOrder[]
}

model PurchaseOrder {
  id             String   @id @default(uuid())
  tenantId       String
  poNumber       String   @unique
  requestId      String
  supplierId     String
  totalAmount    Float
  status         String   @default("DRAFT")
  issueDate      DateTime @default(now())
  deliveryDate   DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  tenant         Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  request        PurchaseRequest @relation(fields: [requestId], references: [id])
  supplier       Supplier        @relation(fields: [supplierId], references: [id])
  grns           GoodsReceivedNote[]
}

model GoodsReceivedNote {
  id             String   @id @default(uuid())
  tenantId       String
  grnNumber      String   @unique
  poId           String
  supplierId     String
  receivedDate   DateTime @default(now())
  receivedBy     String
  condition      String   @default("GOOD")
  status         String   @default("COMPLETED")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  tenant         Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  purchaseOrder  PurchaseOrder   @relation(fields: [poId], references: [id])
  supplier       Supplier        @relation(fields: [supplierId], references: [id])
}
`;

const tenantRelations = `
  suppliers Supplier[]
  purchaseRequests PurchaseRequest[]
  purchaseOrders PurchaseOrder[]
  grns GoodsReceivedNote[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += procurementModels;

fs.writeFileSync('prisma/schema.prisma', schema);
