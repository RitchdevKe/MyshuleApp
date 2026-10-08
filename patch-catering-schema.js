const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const cateringModels = `

model CateringMenu {
  id          String   @id @default(uuid())
  tenantId    String
  dayOfWeek   String   // MONDAY, TUESDAY, etc
  mealType    String   // BREAKFAST, LUNCH, DINNER, SNACK
  name        String
  description String?
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model KitchenTask {
  id          String   @id @default(uuid())
  tenantId    String
  title       String
  description String?
  assignedTo  String?
  dueDate     DateTime
  status      String   @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model FoodInventory {
  id          String   @id @default(uuid())
  tenantId    String
  itemName    String
  category    String   // MEAT, VEGETABLE, DRY_GOODS, etc.
  quantity    Float    @default(0)
  unit        String
  minLevel    Float    @default(0)
  expiryDate  DateTime?
  status      String   @default("IN_STOCK") // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model MealAttendance {
  id          String   @id @default(uuid())
  tenantId    String
  studentId   String
  mealType    String   // BREAKFAST, LUNCH, DINNER
  date        DateTime @default(now())
  status      String   @default("PRESENT") // PRESENT, ABSENT
  scanned     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
}
`;

const tenantRelations = `
  cateringMenus       CateringMenu[]
  kitchenTasks        KitchenTask[]
  foodInventories     FoodInventory[]
  mealAttendances     MealAttendance[]
`;

schema = schema.replace('model Tenant {', 'model Tenant {' + tenantRelations);
schema += cateringModels;

fs.writeFileSync('prisma/schema.prisma', schema);
