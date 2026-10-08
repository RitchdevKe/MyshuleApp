# MyShule Database Schema & Interconnection Architecture

This document serves as the comprehensive schema reference, entity-relationship map, and disaster recovery blueprint for the **MyShule ERP & Parent Portal** database.

---

## 1. Architecture Overview

- **Database Engine:** PostgreSQL 16+
- **ORM / DDL Management:** Prisma ORM (`prisma/schema.prisma`)
- **Multi-Tenancy Model:** Shared database with discriminator-column (`tenantId`) across all operational models, enforcing strict data isolation per school.
- **Backups in Repository:**
  - `database/schema.sql`: Pure SQL DDL (tables, sequences, indexes, enums, foreign keys).
  - `database/full_backup.sql`: Complete snapshot including schema, default configuration, and populated school/parent data.

---

## 2. Core Entity Relationships (ERD)

```mermaid
erDiagram
    Tenant ||--o{ Branch : "has branches"
    Tenant ||--o{ TenantUser : "has tenant users"
    User ||--o{ TenantUser : "belongs to tenants"
    TenantUser }o--|| Role : "assigned role"
    Role ||--o{ RolePermission : "has permissions"

    Branch ||--o{ Class : "has classes"
    Class ||--o{ Stream : "has streams"
    Tenant ||--o{ AcademicYear : "manages"
    AcademicYear ||--o{ AcademicTerm : "divided into"

    Tenant ||--o{ Student : "enrolled in"
    Student ||--o{ StudentEnrollment : "has enrollments"
    Stream ||--o{ StudentEnrollment : "contains students"
    AcademicYear ||--o{ StudentEnrollment : "active academic year"

    Tenant ||--o{ Parent : "registered guardians"
    Parent ||--o{ StudentParent : "guardian of"
    Student ||--o{ StudentParent : "linked to"

    Tenant ||--o{ Exam : "schedules exams"
    AcademicTerm ||--o{ Exam : "belongs to term"
    Exam ||--o{ ExamSubject : "contains subjects"
    Student ||--o{ AssessmentResult : "scores"
    ExamSubject ||--o{ AssessmentResult : "result for"

    Tenant ||--o{ FeeStructure : "sets fee structures"
    Class ||--o{ FeeStructure : "fee defined for class"
    Student ||--o{ StudentInvoice : "billed via invoices"
    StudentInvoice ||--o{ InvoiceItem : "composed of items"
    StudentInvoice ||--o{ FeePayment : "paid via payments"
```

---

## 3. Subsystem Interconnection Map

### 3.1 Multi-Tenancy & Access Control
- **`Tenant`**: The root organization representing an individual school.
- **`User`**: Global user account holding authentication credentials (`email`, `passwordHash`, `phone`).
- **`TenantUser`**: Associative bridge linking `User` $\leftrightarrow$ `Tenant`, establishing which school a user belongs to and assigning their `Role`.
- **`Role`** & **`RolePermission`**: Defines role-based authorization (e.g., `SUPER_ADMIN`, `PRINCIPAL`, `TEACHER`, `ACCOUNTANT`, `PARENT`).

### 3.2 School Structure & Academic Calendar
- **`Branch`**: Physical campus/branch under a `Tenant`.
- **`Class`**: Academic grade level (e.g., "Grade 1", "Form 4"), scoped to `Tenant` and `Branch`.
- **`Stream`**: Specific section/division under a `Class` (e.g., "North", "Blue", "East").
- **`AcademicYear`**: School calendar year (e.g., `2026`). Contains an `isActiveYear` flag.
- **`AcademicTerm`**: Specific semester/term (e.g., `Term 1`, `Term 2`) with start and end dates.

### 3.3 Student Life & Guardians
- **`Student`**: The core student profile (`admissionNumber`, `firstName`, `lastName`, `dob`, `gender`, `status`).
- **`StudentEnrollment`**: Historical and active placement of a `Student` within a `Stream`, `Class`, and `AcademicYear`.
- **`Parent`**: Guardian account linked optionally to a `User` login for the Parent Portal.
- **`StudentParent`**: Many-to-many relationship linking `Parent` and `Student` with relationship type (Father, Mother, Legal Guardian) and emergency contact priority.

### 3.4 Examinations & Performance Analytics
- **`Subject`**: Academic disciplines taught in the school.
- **`Exam`**: An assessment period (e.g., "Mid-Term Examination 2026").
- **`ExamSubject`**: Subject-specific exam configuration including maximum marks and grading scale.
- **`AssessmentResult`**: Individual student score, grade, remarks, and performance percentiles.
- **`GradingScale`** & **`GradingScaleDetail`**: Score ranges mapped to letter grades (A, B, C, D, E) and GPA points.

### 3.5 Finance, Billing & Fee Payments
- **`FeeStructure`**: The approved term fee package for a specific `Class` and `AcademicYear`.
- **`FeeItem`**: Individual components of the fee structure (Tuition, Boarding, Activity, Transport, Uniform).
- **`StudentInvoice`**: Direct student account bill generated from the fee structure.
- **`InvoiceItem`**: Line item breakdown on a student invoice.
- **`FeePayment`**: Transactions recorded against invoices (Cash, Bank Transfer, M-Pesa, Card) with transaction references and reconciliation status.

### 3.6 Operations Subsystems
- **Hostels:** `Hostel` $\rightarrow$ `HostelRoom` $\rightarrow$ `HostelAllocation` $\rightarrow$ `Student`.
- **Transport:** `Vehicle` $\rightarrow$ `TransportRoute` $\rightarrow$ `Trip` $\rightarrow$ `FuelRecord`.
- **Catering:** `CateringMenu` $\rightarrow$ `FoodInventory` $\rightarrow$ `KitchenTask` $\rightarrow$ `MealAttendance`.
- **Health:** `ClinicVisit` $\rightarrow$ `MedicalRecord` $\rightarrow$ `WelfareSession` $\rightarrow$ `Student`.
- **Inventory:** `Store` $\rightarrow$ `InventoryItem` $\rightarrow$ `StockMovement` $\rightarrow$ `StockIssue`.
- **Library:** `LibraryBook` $\rightarrow$ `LibraryMember` $\rightarrow$ `LibraryCirculation`.

---

## 4. Disaster Recovery: Rebuilding Database from Scratch

If access to the AWS instance is lost, follow these steps to recreate the database on any new PostgreSQL server (e.g., Supabase, Neon, AWS RDS, DigitalOcean, or local Docker):

### Step 1: Provision a New PostgreSQL Database
Create a new database instance:
```sql
CREATE DATABASE myshule_db;
CREATE USER myshule_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE myshule_db TO myshule_admin;
```

### Step 2: Restore Options

#### Option A: Restore Complete Snapshot with Existing Data (Fastest)
Use `database/full_backup.sql` to restore both all table structures and all data:
```bash
psql -h <HOST> -p 5432 -U myshule_admin -d myshule_db -f database/full_backup.sql
```

#### Option B: Rebuild Clean Schema Only via SQL
If you wish to start with empty tables:
```bash
psql -h <HOST> -p 5432 -U myshule_admin -d myshule_db -f database/schema.sql
```

#### Option C: Rebuild via Prisma CLI
Point your `.env` to the new connection string and push the schema directly:
```bash
# In .env
DATABASE_URL="postgresql://myshule_admin:your_secure_password@<HOST>:5432/myshule_db?schema=public"

# Push schema directly to the new database
npx prisma db push

# Generate client
npx prisma generate
```
