const fs = require('fs');

const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

const modelsToAdd = `
model EngagementCampaign {
  id         String   @id @default(cuid())
  tenantId   String
  tenant     Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name       String
  target     String
  status     String
  conversion String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model EngagementEvent {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name      String
  date      DateTime
  location  String
  rsvps     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model EngagementSurvey {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name      String
  audience  String
  responses Int      @default(0)
  status    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

if (!schema.includes('model EngagementCampaign')) {
  // We need to add them to Tenant model as well
  schema = schema.replace(
    'model Tenant {',
    'model Tenant {\n  engagementCampaigns EngagementCampaign[]\n  engagementEvents EngagementEvent[]\n  engagementSurveys EngagementSurvey[]'
  );
  schema += modelsToAdd;
  fs.writeFileSync(schemaPath, schema);
  console.log("Schema patched successfully.");
} else {
  console.log("Schema already patched.");
}
