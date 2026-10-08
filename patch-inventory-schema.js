const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const inventoryModels = `

model Store {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  location    String?
  managerId   String?
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  manager     Staff?   @relation(fields: [managerId], references: [id])
  movementsFrom StockMovement[] @relation("SourceStore")
  movementsTo   StockMovement[] @relation("DestinationStore")
  stockIssues   StockIssue[]
  inventoryBalances InventoryBalance[]
}

model InventoryItem {
  id             String   @id @default(uuid())
  tenantId       String
  code           String   @unique
  name           String
  category       String
  unit           String
  minStockLevel  Int      @default(0)
  unitCost       Float    @default(0)
  status         String   @default("ACTIVE")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  tenant         Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  movements      StockMovement[]
  stockIssues    StockIssue[]
  inventoryBalances InventoryBalance[]
}

model InventoryBalance {
  id          String   @id @default(uuid())
  tenantId    String
  storeId     String
  itemId      String
  quantity    Int      @default(0)
  lastUpdated DateTime @default(now()) @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  item        InventoryItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([storeId, itemId])
}

model StockMovement {
  id                 String   @id @default(uuid())
  tenantId           String
  movementType       String   // "IN", "OUT", "TRANSFER"
  itemId             String
  quantity           Int
  sourceStoreId      String?
  destinationStoreId String?
  reference          String?
  notes              String?
  date               DateTime @default(now())
  createdAt          DateTime @default(now())

  tenant             Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  item               InventoryItem @relation(fields: [itemId], references: [id])
  sourceStore        Store?   @relation("SourceStore", fields: [sourceStoreId], references: [id])
  destinationStore   Store?   @relation("DestinationStore", fields: [destinationStoreId], references: [id])
}

model StockIssue {
  id          String   @id @default(uuid())
  tenantId    String
  issueNumber String   @unique
  itemId      String
  storeId     String
  quantity    Int
  issuedTo    String   // could be relation to Staff, keeping as String for flexibility if it's external
  department  String?
  status      String   @default("COMPLETED")
  date        DateTime @default(now())
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  item        InventoryItem @relation(fields: [itemId], references: [id])
  store       Store    @relation(fields: [storeId], references: [id])
}
`;

const tenantRelations = `
  stores            Store[]
  inventoryItems    InventoryItem[]
  inventoryBalances InventoryBalance[]
  stockMovements    StockMovement[]
  stockIssues       StockIssue[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += inventoryModels;

fs.writeFileSync('prisma/schema.prisma', schema);
