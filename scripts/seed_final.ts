import { PrismaClient, Department, PaymentMethod, AttendanceStatus, PaymentStatus, InvoiceStatus, LevelType, ModuleStatus, StudentStatus, ParentRelationship } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_DOMAIN = "demo";

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Victor", "Peggy", "Sybil", "Trent", "Walter"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez"];

async function run() {
  console.log("Starting comprehensive demo seed...");

  let demoTenant = await prisma.tenant.findUnique({ where: { domainPrefix: DEMO_DOMAIN } });
  if (!demoTenant) {
    console.log("Creating Demo Tenant...");
    demoTenant = await prisma.tenant.create({
      data: {
        name: "MyShule Demo Academy",
        domainPrefix: DEMO_DOMAIN,
        contactEmail: "admin@demo.myshule.ke",
        contactPhone: "+254700000000",
        address: "123 Demo Street, Nairobi",
        status: ModuleStatus.ACTIVE
      }
    });
  }
  const tenantId = demoTenant.id;

  console.log("Wiping existing demo data...");
  const wipeFilters = { where: { tenantId } };
  
  await prisma.payment.deleteMany(wipeFilters);
  await prisma.invoiceItem.deleteMany({ where: { invoice: { tenantId } } });
  await prisma.invoice.deleteMany(wipeFilters);
  await prisma.attendanceRecord.deleteMany({ where: { register: { tenantId } } });
  await prisma.attendanceRegister.deleteMany(wipeFilters);
  await prisma.examResult.deleteMany({ where: { exam: { tenantId } } });
  await prisma.exam.deleteMany(wipeFilters);
  await prisma.studentEnrollment.deleteMany(wipeFilters);
  await prisma.studentParent.deleteMany({ where: { tenantId } });
  await prisma.student.deleteMany(wipeFilters);
  await prisma.staff.deleteMany(wipeFilters);
  await prisma.parent.deleteMany(wipeFilters);
  await prisma.subject.deleteMany(wipeFilters);
  await prisma.stream.deleteMany(wipeFilters);
  await prisma.class.deleteMany(wipeFilters);
  await prisma.branch.deleteMany(wipeFilters);
  await prisma.academicTerm.deleteMany(wipeFilters);
  await prisma.academicYear.deleteMany(wipeFilters);
  await prisma.inventoryBalance.deleteMany({ where: { tenantId } });
  await prisma.inventoryItem.deleteMany({ where: { tenantId } });
  await prisma.store.deleteMany(wipeFilters);
  await prisma.trip.deleteMany({ where: { vehicle: { tenantId } } });
  await prisma.vehicle.deleteMany({ where: { tenantId } });
  await prisma.engagementEvent.deleteMany(wipeFilters);

  console.log("Creating School Structure...");
  const branch = await prisma.branch.create({
    data: {
      tenantId,
      name: "Main Campus",
      levelTypes: [LevelType.PRIMARY, LevelType.JUNIOR]
    }
  });

  const year = await prisma.academicYear.create({
    data: { tenantId, name: "2026", startDate: new Date("2026-01-01"), endDate: new Date("2026-11-30"), isActiveYear: true }
  });
  const term1 = await prisma.academicTerm.create({ data: { tenantId, academicYearId: year.id, name: "Term 1", startDate: new Date("2026-01-10"), endDate: new Date("2026-04-10"), isActiveTerm: false }});
  const term2 = await prisma.academicTerm.create({ data: { tenantId, academicYearId: year.id, name: "Term 2", startDate: new Date("2026-05-10"), endDate: new Date("2026-08-10"), isActiveTerm: false }});
  const term3 = await prisma.academicTerm.create({ data: { tenantId, academicYearId: year.id, name: "Term 3", startDate: new Date("2026-09-01"), endDate: new Date("2026-11-20"), isActiveTerm: true }});

  const classes = [];
  for (let c of ["Grade 1", "Grade 2", "Grade 3"]) {
    const cls = await prisma.class.create({ data: { tenantId, name: c, branchId: branch.id }});
    classes.push(cls);
  }

  const streams = [];
  for (let cls of classes) {
    for (let s of ["East", "West"]) {
      const st = await prisma.stream.create({ data: { tenantId, name: s, classId: cls.id, capacity: 30 }});
      streams.push(st);
    }
  }

  const subjects = [];
  for (let s of ["Mathematics", "English", "Science"]) {
    const sub = await prisma.subject.create({ data: { tenantId, name: s, code: s.substring(0,3).toUpperCase(), isCoreSubject: true }});
    subjects.push(sub);
  }

  console.log("Creating Staff...");
  const staffMembers = [];
  for(let i=0; i<10; i++) {
    const timestamp = Date.now();
    const user = await prisma.user.create({
      data: {
        email: `staff${i}_${timestamp}@demo.myshule.ke`,
        passwordHash: "hashedpassword",
        status: "ACTIVE"
      }
    });

    const staff = await prisma.staff.create({
      data: {
        tenantId,
        userId: user.id,
        firstName: randomChoice(firstNames),
        lastName: randomChoice(lastNames),
        employeeNumber: `EMP${1000+i}`,
        jobTitle: i === 0 ? "Principal" : "Teacher",
        department: Department.ACADEMICS,
        gender: randomChoice(["MALE", "FEMALE"]),
        dateOfBirth: randomDate(new Date(1970, 0, 1), new Date(2000, 0, 1)),
        hireDate: randomDate(new Date(2015, 0, 1), new Date(2025, 0, 1)),
        status: "ACTIVE"
      }
    });
    staffMembers.push(staff);
  }

  console.log("Creating 60 Students...");
  const students = [];
  for(let i=0; i<60; i++) {
    const pFirst = randomChoice(firstNames);
    const pLast = randomChoice(lastNames);
    
    const timestamp = Date.now();
    const pUser = await prisma.user.create({
      data: {
        email: `parent${i}_${timestamp}@example.com`,
        passwordHash: "hashedpassword",
        status: "ACTIVE"
      }
    });

    const parent = await prisma.parent.create({
      data: {
        tenantId,
        userId: pUser.id,
        firstName: pFirst,
        lastName: pLast,
        phonePrimary: `+254720${randomInt(100000, 999999)}`,
        nationalIdNumber: `${randomInt(10000000, 99999999)}`
      }
    });

    const sFirst = randomChoice(firstNames);
    const student = await prisma.student.create({
      data: {
        tenantId,
        firstName: sFirst,
        lastName: pLast,
        admissionNumber: `ADM${2000 + i}`,
        dateOfBirth: randomDate(new Date(2012, 0, 1), new Date(2018, 0, 1)),
        enrollmentDate: randomDate(new Date(2023, 0, 1), new Date(2026, 0, 1)),
        gender: randomChoice(["MALE", "FEMALE"]),
        status: StudentStatus.ACTIVE
      }
    });

    await prisma.studentParent.create({
      data: {
        tenantId,
        studentId: student.id,
        parentId: parent.id,
        relationship: ParentRelationship.MOTHER,
        isEmergencyContact: true
      }
    });

    const strm = randomChoice(streams);
    const enrollment = await prisma.studentEnrollment.create({
      data: {
        tenantId,
        studentId: student.id,
        academicYearId: year.id,
        classId: strm.classId,
        streamId: strm.id,
        rollNumber: `${randomInt(1, 40)}`
      }
    });
    students.push({ student, enrollment });
  }

  console.log("Generating Invoices & Payments...");
  for(let s of students) {
    const billAmount = 15000 + randomInt(0, 5) * 1000;
    const rand = Math.random();
    let amountPaid = 0;
    let status: InvoiceStatus = InvoiceStatus.UNPAID;
    
    if(rand < 0.4) { amountPaid = billAmount; status = InvoiceStatus.PAID; }
    else if (rand < 0.8) { amountPaid = randomInt(5000, billAmount - 1000); status = InvoiceStatus.PARTIALLY_PAID; }
    else { amountPaid = randomInt(0, 2000); }
    
    const balanceDue = billAmount - amountPaid;

    const invoice = await prisma.invoice.create({
      data: {
        tenantId,
        studentId: s.student.id,
        academicTermId: term3.id,
        invoiceNumber: `INV-T3-${s.student.admissionNumber}`,
        totalAmount: billAmount,
        subTotal: billAmount,
        amountPaid: amountPaid,
        balanceDue: balanceDue,
        dueDate: new Date("2026-09-15"),
        status: status
      }
    });

    if (amountPaid > 0) {
      await prisma.payment.create({
        data: {
          tenantId,
          invoiceId: invoice.id,
          studentId: s.student.id,
          recordedById: staffMembers[0].userId,
          receiptNumber: `RCT-${randomInt(10000, 99999)}`,
          amount: amountPaid,
          paymentMethod: PaymentMethod.MOBILE_MONEY,
          paymentDate: randomDate(new Date("2026-09-01"), new Date()),
          status: PaymentStatus.ALLOCATED
        }
      });
    }
  }

  console.log("Generating Operations Data...");
  const store = await prisma.store.create({
    data: {
      tenantId,
      name: "Main Store"
    }
  });

  const items = ["Chalk Boxes", "Textbooks", "Exercise Books", "Pens"];
  for(let item of items) {
    const qty = randomInt(5, 500);
    const min = randomInt(50, 100);
    await prisma.inventoryItem.create({
      data: {
        tenantId,
        name: item,
        code: `ITM-${randomInt(1000, 9999)}`,
        category: "STATIONERY",
        unit: "Pieces",
        minStockLevel: min,
        unitCost: randomInt(100, 1000),
        status: "ACTIVE",
        inventoryBalances: {
          create: {
            tenantId,
            quantity: qty,
            storeId: store.id
          }
        }
      }
    });
  }

  await prisma.vehicle.create({ data: { tenantId, registrationNumber: "KAA 123A", capacity: 40, make: "Isuzu", model: "Bus", status: "ACTIVE" }});
  
  console.log("Generating Calendar Events...");
  await prisma.engagementEvent.create({ data: { tenantId, name: "Mid-Term Exams", date: new Date("2026-10-10"), location: "Classes", rsvps: "All" }});
  await prisma.engagementEvent.create({ data: { tenantId, name: "Sports Day", date: new Date("2026-09-25"), location: "Field", rsvps: "Parents" }});

  console.log("Generating Exams...");
  const exam = await prisma.exam.create({
    data: {
      tenantId,
      academicTermId: term2.id,
      name: "Term 2 Mid-Terms",
      startDate: new Date("2026-07-10"),
      endDate: new Date("2026-07-14")
    }
  });

  for(let s of students) {
    await prisma.examResult.create({
      data: {
        tenantId,
        examId: exam.id,
        studentId: s.student.id,
        subjectId: subjects[0].id, 
        numericScore: randomInt(40, 100),
        teacherRemarks: "Good",
      }
    });
  }

  console.log("Comprehensive Seed Complete! The demo account is now rich with data.");
}

run().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
