--
-- PostgreSQL database dump
--

\restrict Dg5zNELi7iOh3SWksSj9pc53IjIyZni2n9IdP09AOOZGIKiHWPWz3E4j8wPlFaa

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AccountType" AS ENUM (
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE'
);


--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ActivityType" AS ENUM (
    'CLUB',
    'SPORT',
    'SOCIETY'
);


--
-- Name: ApplicationStage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ApplicationStage" AS ENUM (
    'APPLIED',
    'REVIEW',
    'INTERVIEW',
    'ADMITTED',
    'REJECTED'
);


--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'EXCUSED'
);


--
-- Name: BudgetStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BudgetStatus" AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'ACTIVE',
    'CLOSED'
);


--
-- Name: CommunicationChannel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CommunicationChannel" AS ENUM (
    'SMS',
    'EMAIL',
    'PUSH_NOTIFICATION'
);


--
-- Name: CommunicationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CommunicationStatus" AS ENUM (
    'SENT',
    'DELIVERED',
    'FAILED'
);


--
-- Name: Department; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Department" AS ENUM (
    'ACADEMICS',
    'ADMINISTRATION',
    'TRANSPORT',
    'KITCHEN',
    'SUPPORT'
);


--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DocumentType" AS ENUM (
    'REPORT_CARD',
    'TRANSCRIPT',
    'LEAVING_CERTIFICATE'
);


--
-- Name: Gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


--
-- Name: HardwareStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."HardwareStatus" AS ENUM (
    'ONLINE',
    'OFFLINE',
    'MAINTENANCE'
);


--
-- Name: HardwareType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."HardwareType" AS ENUM (
    'BIOMETRIC_SCANNER',
    'RFID_READER',
    'SMART_BOARD',
    'ACCESS_CONTROL'
);


--
-- Name: IncidentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."IncidentStatus" AS ENUM (
    'OPEN',
    'RESOLVED'
);


--
-- Name: InvitationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvitationStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'EXPIRED',
    'REVOKED'
);


--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'UNPAID',
    'PARTIALLY_PAID',
    'PAID',
    'CANCELLED'
);


--
-- Name: JournalStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."JournalStatus" AS ENUM (
    'DRAFT',
    'POSTED',
    'CANCELLED'
);


--
-- Name: LevelType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LevelType" AS ENUM (
    'PRE_PRIMARY',
    'PRIMARY',
    'JUNIOR',
    'SENIOR'
);


--
-- Name: MessageChannel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MessageChannel" AS ENUM (
    'EMAIL',
    'SMS',
    'BOTH'
);


--
-- Name: ModuleStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ModuleStatus" AS ENUM (
    'ACTIVE',
    'EXPIRED',
    'TRIAL'
);


--
-- Name: ParentRelationship; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ParentRelationship" AS ENUM (
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'SPONSOR',
    'OTHER'
);


--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'BANK_TRANSFER',
    'MOBILE_MONEY',
    'CREDIT_CARD',
    'CHEQUE'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'ALLOCATED',
    'UNALLOCATED',
    'REFUNDED',
    'REVERSED',
    'FAILED'
);


--
-- Name: ReconciliationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReconciliationStatus" AS ENUM (
    'DRAFT',
    'COMPLETED'
);


--
-- Name: RequestPriority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RequestPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH'
);


--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


--
-- Name: ScaleType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ScaleType" AS ENUM (
    'NUMERIC_PERCENTAGE',
    'CBC_RUBRIC'
);


--
-- Name: SeverityLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SeverityLevel" AS ENUM (
    'MINOR',
    'MODERATE',
    'SEVERE'
);


--
-- Name: StaffStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StaffStatus" AS ENUM (
    'ACTIVE',
    'ON_LEAVE',
    'RESIGNED',
    'TERMINATED'
);


--
-- Name: StudentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StudentStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'TRANSFERRED',
    'ALUMNI'
);


--
-- Name: TargetAudience; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TargetAudience" AS ENUM (
    'ALL',
    'STAFF',
    'PARENTS',
    'STUDENTS'
);


--
-- Name: TenantStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TenantStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED'
);


--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TransactionType" AS ENUM (
    'IN',
    'OUT'
);


--
-- Name: TripType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TripType" AS ENUM (
    'TWO_WAY',
    'ONE_WAY_MORNING',
    'ONE_WAY_EVENING'
);


--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'LOCKED',
    'SUSPENDED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AIAuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIAuditLog" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    intent text NOT NULL,
    prompt text NOT NULL,
    response text NOT NULL,
    "toolUsed" text,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AIKnowledgeBase; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIKnowledgeBase" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AcademicSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AcademicSettings" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "anonymousGrading" boolean DEFAULT false NOT NULL,
    "strictInvigilation" boolean DEFAULT true NOT NULL,
    "autoPublishResults" boolean DEFAULT false NOT NULL,
    "lockGradesAfterPublish" boolean DEFAULT true NOT NULL,
    "minPassMark" double precision DEFAULT 40 NOT NULL,
    "distinctionMark" double precision DEFAULT 80 NOT NULL,
    "requireDailyAttendance" boolean DEFAULT true NOT NULL,
    "notifyParentsOnAbsence" boolean DEFAULT false NOT NULL,
    "absenceWarningThreshold" integer DEFAULT 3 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "periodDurationMinutes" integer DEFAULT 40 NOT NULL,
    "periodsPerDay" integer DEFAULT 8 NOT NULL,
    "schoolEndTime" text DEFAULT '15:30'::text NOT NULL,
    "schoolStartTime" text DEFAULT '08:00'::text NOT NULL,
    "breakSlots" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "enableRemedialClasses" boolean DEFAULT false NOT NULL,
    "remedialAfterSchool" boolean DEFAULT false NOT NULL,
    "remedialBeforeSchool" boolean DEFAULT false NOT NULL,
    "remedialEndTime" text DEFAULT '07:30'::text NOT NULL,
    "remedialHolidays" boolean DEFAULT false NOT NULL,
    "remedialStartTime" text DEFAULT '06:30'::text NOT NULL,
    "remedialWeekends" boolean DEFAULT false NOT NULL
);


--
-- Name: AcademicTerm; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AcademicTerm" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActiveTerm" boolean DEFAULT false NOT NULL
);


--
-- Name: AcademicYear; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AcademicYear" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActiveYear" boolean DEFAULT false NOT NULL
);


--
-- Name: AccessRequest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AccessRequest" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    request text NOT NULL,
    reason text,
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    priority public."RequestPriority" DEFAULT 'MEDIUM'::public."RequestPriority" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resolvedAt" timestamp(3) without time zone
);


--
-- Name: AdmissionApplication; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AdmissionApplication" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "admissionNumber" text NOT NULL,
    "studentName" text NOT NULL,
    grade text NOT NULL,
    "parentName" text NOT NULL,
    "parentPhone" text NOT NULL,
    "parentEmail" text,
    stage public."ApplicationStage" DEFAULT 'APPLIED'::public."ApplicationStage" NOT NULL,
    alert boolean DEFAULT false NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "formData" jsonb
);


--
-- Name: AiDailyBrief; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AiDailyBrief" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AiFaqCache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AiFaqCache" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AiSystemState; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AiSystemState" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    state jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdById" text NOT NULL,
    "targetAudience" public."TargetAudience" NOT NULL,
    "targetClassId" text,
    "publishDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiryDate" timestamp(3) without time zone
);


--
-- Name: Applicant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Applicant" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "jobOpeningId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    phone text,
    status text DEFAULT 'Applied'::text NOT NULL,
    "resumeUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Appraisal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Appraisal" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    "reviewerId" text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'Pending'::text NOT NULL,
    score double precision,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Asset; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Asset" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "assetTag" text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "purchaseDate" timestamp(3) without time zone,
    "purchaseCost" double precision DEFAULT 0 NOT NULL,
    condition text DEFAULT 'GOOD'::text NOT NULL,
    "facilityId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AttendanceRecord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AttendanceRecord" (
    id text NOT NULL,
    "registerId" text NOT NULL,
    "studentId" text NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    remarks text
);


--
-- Name: AttendanceRegister; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AttendanceRegister" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicTermId" text NOT NULL,
    "streamId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "recordedById" text NOT NULL
);


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    "entityName" text NOT NULL,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AuthorizationRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuthorizationRule" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    action text NOT NULL,
    trigger text NOT NULL,
    approver text NOT NULL,
    status text DEFAULT 'Active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BankAccount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BankAccount" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "bankName" text NOT NULL,
    "accountName" text NOT NULL,
    "accountNumber" text NOT NULL,
    "branchName" text,
    "swiftCode" text,
    currency text DEFAULT 'KES'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: BankReconciliation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BankReconciliation" (
    id text NOT NULL,
    "bankAccountId" text NOT NULL,
    "statementDate" timestamp(3) without time zone NOT NULL,
    "statementBalance" double precision NOT NULL,
    "systemBalance" double precision NOT NULL,
    difference double precision NOT NULL,
    status public."ReconciliationStatus" DEFAULT 'DRAFT'::public."ReconciliationStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BankTransaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BankTransaction" (
    id text NOT NULL,
    "bankAccountId" text NOT NULL,
    type public."TransactionType" NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    reference text,
    "isReconciled" boolean DEFAULT false NOT NULL,
    "reconciliationId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Benefit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Benefit" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    provider text NOT NULL,
    type text NOT NULL,
    "limit" text NOT NULL,
    status text DEFAULT 'Active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BoardingAttendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BoardingAttendance" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Branch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Branch" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "levelTypes" public."LevelType"[],
    address text,
    capacity integer,
    founded text,
    head text,
    status text DEFAULT 'Active'::text NOT NULL
);


--
-- Name: Budget; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Budget" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "financialYearId" text NOT NULL,
    name text NOT NULL,
    "totalAmount" double precision DEFAULT 0 NOT NULL,
    "spentAmount" double precision DEFAULT 0 NOT NULL,
    status public."BudgetStatus" DEFAULT 'DRAFT'::public."BudgetStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BudgetApproval; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BudgetApproval" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "budgetId" text NOT NULL,
    "requestedBy" text NOT NULL,
    status public."ApprovalStatus" DEFAULT 'PENDING'::public."ApprovalStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BudgetScenario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BudgetScenario" (
    id text NOT NULL,
    "budgetId" text NOT NULL,
    name text NOT NULL,
    description text,
    "adjustedAmount" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CateringMenu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CateringMenu" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "dayOfWeek" text NOT NULL,
    "mealType" text NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Certification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Certification" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    name text NOT NULL,
    issuer text NOT NULL,
    "issueDate" timestamp(3) without time zone NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    status text DEFAULT 'Active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ChartOfAccount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChartOfAccount" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "accountCode" text NOT NULL,
    "accountName" text NOT NULL,
    "accountType" public."AccountType" NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: Class; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Class" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "branchId" text NOT NULL,
    name text NOT NULL
);


--
-- Name: ClinicInventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClinicInventory" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "itemName" text NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    unit text,
    "expiryDate" timestamp(3) without time zone,
    status text DEFAULT 'IN_STOCK'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ClinicVisit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClinicVisit" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "visitDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reason text NOT NULL,
    diagnosis text,
    treatment text,
    "handledBy" text,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CommunicationLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommunicationLog" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "recipientUserId" text,
    channel public."CommunicationChannel" NOT NULL,
    "contactAddress" text NOT NULL,
    subject text,
    body text NOT NULL,
    status public."CommunicationStatus" DEFAULT 'SENT'::public."CommunicationStatus" NOT NULL,
    "providerError" text,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CommunicationSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommunicationSettings" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "emailProvider" text DEFAULT 'SMTP'::text NOT NULL,
    "smtpHost" text,
    "smtpPort" integer,
    "smtpUser" text,
    "smtpPassword" text,
    "smsProvider" text DEFAULT 'TWILIO'::text NOT NULL,
    "smsApiKey" text,
    "smsSenderId" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CommunicationTrigger; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommunicationTrigger" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    event text NOT NULL,
    channel public."MessageChannel" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "templateId" text
);


--
-- Name: Conversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Conversation" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "participantOneId" text NOT NULL,
    "participantTwoId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastMessageAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CustomReport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CustomReport" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    type text DEFAULT 'FINANCIAL'::text NOT NULL,
    config jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text
);


--
-- Name: Deduction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Deduction" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    amount double precision,
    percentage double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: DepartmentBudget; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DepartmentBudget" (
    id text NOT NULL,
    "budgetId" text NOT NULL,
    "departmentName" text NOT NULL,
    "allocatedAmount" double precision DEFAULT 0 NOT NULL,
    "spentAmount" double precision DEFAULT 0 NOT NULL
);


--
-- Name: DigitalResource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DigitalResource" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    url text,
    "uploadedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    author text,
    downloads integer DEFAULT 0 NOT NULL,
    size text,
    status text DEFAULT 'Active'::text NOT NULL
);


--
-- Name: DisciplinaryAction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DisciplinaryAction" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    offense text NOT NULL,
    action text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'Active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: DisciplinaryIncident; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DisciplinaryIncident" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "reportedById" text NOT NULL,
    "incidentDate" timestamp(3) without time zone NOT NULL,
    severity public."SeverityLevel" NOT NULL,
    description text NOT NULL,
    "actionTaken" text,
    status public."IncidentStatus" DEFAULT 'OPEN'::public."IncidentStatus" NOT NULL
);


--
-- Name: DocumentTemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DocumentTemplate" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type public."DocumentType" NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "showClassTeacherRemarks" boolean DEFAULT true NOT NULL,
    "showPrincipalRemarks" boolean DEFAULT true NOT NULL,
    "showAttendance" boolean DEFAULT true NOT NULL,
    "showBehavior" boolean DEFAULT true NOT NULL,
    "footerText" text
);


--
-- Name: Election; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Election" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audience text DEFAULT 'Students'::text NOT NULL,
    voters integer DEFAULT 0 NOT NULL
);


--
-- Name: ElectionCandidate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ElectionCandidate" (
    id text NOT NULL,
    "electionId" text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    votes integer DEFAULT 0 NOT NULL
);


--
-- Name: EmergencyContact; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EmergencyContact" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    name text NOT NULL,
    relationship text NOT NULL,
    "phoneNumber" text NOT NULL,
    "alternativePhone" text,
    email text,
    priority integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: EngagementCampaign; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EngagementCampaign" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    target text NOT NULL,
    status text NOT NULL,
    conversion text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: EngagementEvent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EngagementEvent" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    rsvps text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: EngagementSurvey; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EngagementSurvey" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    audience text NOT NULL,
    responses integer DEFAULT 0 NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Exam; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Exam" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicTermId" text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL
);


--
-- Name: ExamResult; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ExamResult" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examId" text NOT NULL,
    "studentId" text NOT NULL,
    "subjectId" text NOT NULL,
    "numericScore" double precision,
    "rubricScore" integer,
    "gradeId" text,
    "teacherRemarks" text
);


--
-- Name: ExtracurricularActivity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ExtracurricularActivity" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "activityType" public."ActivityType" NOT NULL,
    "patronId" text
);


--
-- Name: ExtracurricularMembership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ExtracurricularMembership" (
    id text NOT NULL,
    "activityId" text NOT NULL,
    "studentId" text NOT NULL,
    role text DEFAULT 'MEMBER'::text NOT NULL,
    "joinedDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Facility; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Facility" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    capacity integer,
    location text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FeeItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FeeItem" (
    id text NOT NULL,
    "feeStructureId" text NOT NULL,
    name text NOT NULL,
    amount double precision NOT NULL
);


--
-- Name: FeeStructure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FeeStructure" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "classId" text NOT NULL,
    name text NOT NULL,
    "totalAmount" double precision NOT NULL
);


--
-- Name: Feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Feedback" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "senderId" text NOT NULL,
    "recipientId" text NOT NULL,
    category text NOT NULL,
    content text NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FinanceSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FinanceSettings" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "invoicePrefix" text DEFAULT 'INV-'::text NOT NULL,
    "receiptPrefix" text DEFAULT 'REC-'::text NOT NULL,
    "allowPartialPayments" boolean DEFAULT true NOT NULL,
    "requireDiscountApproval" boolean DEFAULT false NOT NULL,
    "taxRate" double precision DEFAULT 0 NOT NULL,
    "defaultCurrency" text DEFAULT 'KES'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FinancialYear; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FinancialYear" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isClosed" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FoodInventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FoodInventory" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "itemName" text NOT NULL,
    category text NOT NULL,
    quantity double precision DEFAULT 0 NOT NULL,
    unit text NOT NULL,
    "minLevel" double precision DEFAULT 0 NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    status text DEFAULT 'IN_STOCK'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FuelRecord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FuelRecord" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "vehicleId" text NOT NULL,
    amount double precision DEFAULT 0 NOT NULL,
    cost double precision DEFAULT 0 NOT NULL,
    odometer integer,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Goal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Goal" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'On Track'::text NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: GoodsReceivedNote; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GoodsReceivedNote" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "grnNumber" text NOT NULL,
    "poId" text NOT NULL,
    "supplierId" text NOT NULL,
    "receivedDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "receivedBy" text NOT NULL,
    condition text DEFAULT 'GOOD'::text NOT NULL,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: GradingScale; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GradingScale" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "scaleType" public."ScaleType" NOT NULL
);


--
-- Name: GradingScaleRange; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GradingScaleRange" (
    id text NOT NULL,
    "gradingScaleId" text NOT NULL,
    "gradeLabel" text NOT NULL,
    "minScore" double precision NOT NULL,
    "maxScore" double precision NOT NULL,
    "defaultRemarks" text
);


--
-- Name: Grievance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Grievance" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text,
    "isAnonymous" boolean DEFAULT false NOT NULL,
    subject text NOT NULL,
    category text NOT NULL,
    severity text DEFAULT 'Medium'::text NOT NULL,
    status text DEFAULT 'Open'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: HardwareDevice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HardwareDevice" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type public."HardwareType" NOT NULL,
    "ipAddress" text,
    "macAddress" text,
    status public."HardwareStatus" DEFAULT 'OFFLINE'::public."HardwareStatus" NOT NULL,
    "lastPing" timestamp(3) without time zone,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Hostel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Hostel" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    capacity integer DEFAULT 0 NOT NULL,
    warden text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: HostelAllocation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HostelAllocation" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "hostelId" text NOT NULL,
    "roomId" text NOT NULL,
    "studentId" text NOT NULL,
    "dateAllocated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: HostelRoom; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HostelRoom" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "hostelId" text NOT NULL,
    "roomNumber" text NOT NULL,
    capacity integer DEFAULT 1 NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'AVAILABLE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Inspection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Inspection" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "facilityId" text NOT NULL,
    inspector text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Interview; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Interview" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "applicantId" text NOT NULL,
    "staffId" text NOT NULL,
    "scheduledDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'Scheduled'::text NOT NULL,
    feedback text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: InventoryBalance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InventoryBalance" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "storeId" text NOT NULL,
    "itemId" text NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: InventoryItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InventoryItem" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    unit text NOT NULL,
    "minStockLevel" integer DEFAULT 0 NOT NULL,
    "unitCost" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicTermId" text NOT NULL,
    "studentId" text NOT NULL,
    "invoiceNumber" text NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "subTotal" double precision NOT NULL,
    discount double precision DEFAULT 0 NOT NULL,
    "totalAmount" double precision NOT NULL,
    "amountPaid" double precision DEFAULT 0 NOT NULL,
    "balanceDue" double precision NOT NULL,
    status public."InvoiceStatus" DEFAULT 'UNPAID'::public."InvoiceStatus" NOT NULL,
    notes text
);


--
-- Name: InvoiceItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InvoiceItem" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    description text NOT NULL,
    amount double precision NOT NULL
);


--
-- Name: JobOpening; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JobOpening" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    department public."Department",
    type text NOT NULL,
    location text NOT NULL,
    status text DEFAULT 'Active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: JournalEntry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JournalEntry" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "financialYearId" text,
    "entryNumber" text NOT NULL,
    "entryDate" timestamp(3) without time zone NOT NULL,
    description text NOT NULL,
    status public."JournalStatus" DEFAULT 'DRAFT'::public."JournalStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: JournalLine; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JournalLine" (
    id text NOT NULL,
    "journalEntryId" text NOT NULL,
    "chartOfAccountId" text NOT NULL,
    description text,
    debit double precision DEFAULT 0 NOT NULL,
    credit double precision DEFAULT 0 NOT NULL
);


--
-- Name: KitchenTask; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KitchenTask" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    description text,
    "assignedTo" text,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LeadershipPosition; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LeadershipPosition" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    "studentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'Vacant'::text NOT NULL,
    "supervisorId" text,
    term text
);


--
-- Name: LeaveBalance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LeaveBalance" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    type text NOT NULL,
    allocated integer NOT NULL,
    used integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LeaveRequest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LeaveRequest" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    type text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    reason text,
    status text DEFAULT 'Pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LibraryBook; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LibraryBook" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    isbn text,
    category text,
    status text DEFAULT 'AVAILABLE'::text NOT NULL,
    copies integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LibraryCirculation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LibraryCirculation" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "bookId" text NOT NULL,
    "memberId" text NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "returnDate" timestamp(3) without time zone,
    status text DEFAULT 'ISSUED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LibraryMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LibraryMember" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "membershipDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "maxBooks" integer DEFAULT 3 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MaintenanceRecord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MaintenanceRecord" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "assetId" text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    cost double precision DEFAULT 0 NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "performedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MealAttendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MealAttendance" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "mealType" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'PRESENT'::text NOT NULL,
    scanned boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: MedicalRecord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MedicalRecord" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "bloodGroup" text,
    allergies text,
    conditions text,
    immunizations text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: MessageTemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MessageTemplate" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    channel public."MessageChannel" NOT NULL,
    subject text,
    body text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Onboarding; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Onboarding" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    department text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    steps jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Parent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Parent" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "nationalIdNumber" text,
    "phonePrimary" text NOT NULL,
    "phoneSecondary" text,
    "residentialAddress" text
);


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "invoiceId" text,
    "recordedById" text NOT NULL,
    "receiptNumber" text NOT NULL,
    amount double precision NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paymentMethod" public."PaymentMethod" NOT NULL,
    "referenceNumber" text,
    notes text,
    status public."PaymentStatus" DEFAULT 'ALLOCATED'::public."PaymentStatus" NOT NULL,
    "studentId" text
);


--
-- Name: PaymentGateway; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PaymentGateway" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "providerName" text NOT NULL,
    "apiKey" text,
    "apiSecret" text,
    "paybillNumber" text,
    "isActive" boolean DEFAULT false NOT NULL
);


--
-- Name: PayrollRun; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PayrollRun" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    period text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'Draft'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Payslip; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payslip" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "payrollRunId" text NOT NULL,
    "staffId" text NOT NULL,
    "basicPay" double precision NOT NULL,
    allowances double precision NOT NULL,
    deductions double precision NOT NULL,
    "netPay" double precision NOT NULL,
    status text DEFAULT 'Generated'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    "moduleId" text NOT NULL,
    "actionName" text NOT NULL
);


--
-- Name: PettyCashAccount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PettyCashAccount" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PettyCashTransaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PettyCashTransaction" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    type public."TransactionType" NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "receiptUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PurchaseOrder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PurchaseOrder" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "poNumber" text NOT NULL,
    "requestId" text NOT NULL,
    "supplierId" text NOT NULL,
    "totalAmount" double precision NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deliveryDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PurchaseRequest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PurchaseRequest" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "requestNumber" text NOT NULL,
    department text,
    "requestedBy" text NOT NULL,
    description text NOT NULL,
    amount double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "supplierId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Refund; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Refund" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "paymentId" text NOT NULL,
    amount double precision NOT NULL,
    reason text,
    "refundDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "recordedById" text NOT NULL
);


--
-- Name: ReportCard; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReportCard" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examId" text NOT NULL,
    "studentId" text NOT NULL,
    "totalScore" double precision,
    "averageScore" double precision,
    "overallGrade" text,
    "classTeacherRemarks" text,
    "principalRemarks" text,
    "isPublished" boolean DEFAULT false NOT NULL
);


--
-- Name: Role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    "tenantId" text,
    name text NOT NULL
);


--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL
);


--
-- Name: SalaryStructure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SalaryStructure" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "baseRangeMin" double precision NOT NULL,
    "baseRangeMax" double precision NOT NULL,
    grade text NOT NULL,
    department public."Department",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: SecurityPolicy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SecurityPolicy" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'Active'::text NOT NULL,
    scope text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Staff" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    "employeeNumber" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "jobTitle" text NOT NULL,
    department public."Department" NOT NULL,
    "hireDate" timestamp(3) without time zone NOT NULL,
    status public."StaffStatus" DEFAULT 'ACTIVE'::public."StaffStatus" NOT NULL,
    "salaryStructureId" text,
    "dateOfBirth" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    gender text
);


--
-- Name: StockIssue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StockIssue" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "issueNumber" text NOT NULL,
    "itemId" text NOT NULL,
    "storeId" text NOT NULL,
    quantity integer NOT NULL,
    "issuedTo" text NOT NULL,
    department text,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: StockMovement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StockMovement" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "movementType" text NOT NULL,
    "itemId" text NOT NULL,
    quantity integer NOT NULL,
    "sourceStoreId" text,
    "destinationStoreId" text,
    reference text,
    notes text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Store; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Store" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    location text,
    "managerId" text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Stream; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Stream" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "classId" text NOT NULL,
    name text NOT NULL,
    "classTeacherId" text,
    capacity integer NOT NULL
);


--
-- Name: Student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text,
    "admissionNumber" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "dateOfBirth" timestamp(3) without time zone NOT NULL,
    gender public."Gender" NOT NULL,
    "medicalConditions" text,
    status public."StudentStatus" DEFAULT 'ACTIVE'::public."StudentStatus" NOT NULL,
    "enrollmentDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: StudentDocument; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudentDocument" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    title text NOT NULL,
    "documentType" text NOT NULL,
    "fileUrl" text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: StudentEnrollment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudentEnrollment" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "studentId" text NOT NULL,
    "classId" text NOT NULL,
    "streamId" text NOT NULL,
    "rollNumber" text
);


--
-- Name: StudentParent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudentParent" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "parentId" text NOT NULL,
    relationship public."ParentRelationship" NOT NULL,
    "isEmergencyContact" boolean DEFAULT false NOT NULL,
    "isFinancialSponsor" boolean DEFAULT false NOT NULL,
    "canPickupFromSchool" boolean DEFAULT false NOT NULL
);


--
-- Name: Subject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Subject" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    "isCoreSubject" boolean DEFAULT true NOT NULL
);


--
-- Name: SubjectAllocation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SubjectAllocation" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "staffId" text NOT NULL,
    "subjectId" text NOT NULL,
    "streamId" text NOT NULL
);


--
-- Name: Supplier; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Supplier" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "contactName" text,
    email text,
    phone text,
    address text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: SystemModule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SystemModule" (
    id text NOT NULL,
    name text NOT NULL,
    "isMandatory" boolean DEFAULT false NOT NULL,
    description text
);


--
-- Name: Tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tenant" (
    id text NOT NULL,
    name text NOT NULL,
    "domainPrefix" text NOT NULL,
    "logoUrl" text,
    status public."TenantStatus" DEFAULT 'ACTIVE'::public."TenantStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    address text,
    "contactEmail" text,
    "contactPhone" text,
    "dateFormat" text DEFAULT 'DD/MM/YYYY'::text NOT NULL,
    motto text,
    timezone text DEFAULT 'Africa/Nairobi'::text NOT NULL,
    website text,
    "primaryColor" text DEFAULT '#0ea5e9'::text,
    "secondaryColor" text DEFAULT '#1e293b'::text,
    "subscriptionPlan" text DEFAULT 'Free'::text NOT NULL,
    "loginBackgroundUrl" text,
    "loginDisplayName" text,
    "showSchoolNameOnLogin" boolean DEFAULT true NOT NULL
);


--
-- Name: TenantSubscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TenantSubscription" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "moduleId" text NOT NULL,
    status public."ModuleStatus" DEFAULT 'ACTIVE'::public."ModuleStatus" NOT NULL,
    "validUntil" timestamp(3) without time zone
);


--
-- Name: TenantUser; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TenantUser" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tenantId" text NOT NULL,
    "roleId" text NOT NULL,
    "branchId" text
);


--
-- Name: Timesheet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Timesheet" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    "regularHours" double precision DEFAULT 0 NOT NULL,
    "overtimeHours" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'Draft'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TrainingProgram; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TrainingProgram" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    description text,
    "instructorId" text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'Active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TrainingRequest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TrainingRequest" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "staffId" text NOT NULL,
    "courseTitle" text NOT NULL,
    provider text,
    cost double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'Pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TransportAssignment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TransportAssignment" (
    id text NOT NULL,
    "routeId" text NOT NULL,
    "studentId" text NOT NULL,
    "pickupPoint" text NOT NULL,
    "tripType" public."TripType" NOT NULL
);


--
-- Name: TransportRoute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TransportRoute" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "routeName" text NOT NULL,
    "driverId" text,
    "vehiclePlate" text,
    "costPerTerm" double precision
);


--
-- Name: Trip; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Trip" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "routeId" text NOT NULL,
    "vehicleId" text NOT NULL,
    "driverId" text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'SCHEDULED'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "phoneNumber" text,
    "isVerified" boolean DEFAULT false NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: UserGroup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserGroup" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: UserGroupMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserGroupMember" (
    id text NOT NULL,
    "groupId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: UserInvitation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserInvitation" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    email text NOT NULL,
    "roleId" text NOT NULL,
    status public."InvitationStatus" DEFAULT 'PENDING'::public."InvitationStatus" NOT NULL,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Vehicle" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "registrationNumber" text NOT NULL,
    make text,
    model text,
    capacity integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "driverId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: WelfareSession; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WelfareSession" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "sessionDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    counselor text NOT NULL,
    category text NOT NULL,
    notes text,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: WorkOrder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WorkOrder" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "orderNumber" text NOT NULL,
    title text NOT NULL,
    description text,
    priority text DEFAULT 'MEDIUM'::text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "assignedTo" text,
    "facilityId" text,
    "assetId" text,
    "dueDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: AIAuditLog AIAuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIAuditLog"
    ADD CONSTRAINT "AIAuditLog_pkey" PRIMARY KEY (id);


--
-- Name: AIKnowledgeBase AIKnowledgeBase_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIKnowledgeBase"
    ADD CONSTRAINT "AIKnowledgeBase_pkey" PRIMARY KEY (id);


--
-- Name: AcademicSettings AcademicSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AcademicSettings"
    ADD CONSTRAINT "AcademicSettings_pkey" PRIMARY KEY (id);


--
-- Name: AcademicTerm AcademicTerm_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AcademicTerm"
    ADD CONSTRAINT "AcademicTerm_pkey" PRIMARY KEY (id);


--
-- Name: AcademicYear AcademicYear_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AcademicYear"
    ADD CONSTRAINT "AcademicYear_pkey" PRIMARY KEY (id);


--
-- Name: AccessRequest AccessRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AccessRequest"
    ADD CONSTRAINT "AccessRequest_pkey" PRIMARY KEY (id);


--
-- Name: AdmissionApplication AdmissionApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdmissionApplication"
    ADD CONSTRAINT "AdmissionApplication_pkey" PRIMARY KEY (id);


--
-- Name: AiDailyBrief AiDailyBrief_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AiDailyBrief"
    ADD CONSTRAINT "AiDailyBrief_pkey" PRIMARY KEY (id);


--
-- Name: AiFaqCache AiFaqCache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AiFaqCache"
    ADD CONSTRAINT "AiFaqCache_pkey" PRIMARY KEY (id);


--
-- Name: AiSystemState AiSystemState_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AiSystemState"
    ADD CONSTRAINT "AiSystemState_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: Applicant Applicant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Applicant"
    ADD CONSTRAINT "Applicant_pkey" PRIMARY KEY (id);


--
-- Name: Appraisal Appraisal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Appraisal"
    ADD CONSTRAINT "Appraisal_pkey" PRIMARY KEY (id);


--
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceRecord AttendanceRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceRegister AttendanceRegister_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRegister"
    ADD CONSTRAINT "AttendanceRegister_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: AuthorizationRule AuthorizationRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuthorizationRule"
    ADD CONSTRAINT "AuthorizationRule_pkey" PRIMARY KEY (id);


--
-- Name: BankAccount BankAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankAccount"
    ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY (id);


--
-- Name: BankReconciliation BankReconciliation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankReconciliation"
    ADD CONSTRAINT "BankReconciliation_pkey" PRIMARY KEY (id);


--
-- Name: BankTransaction BankTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankTransaction"
    ADD CONSTRAINT "BankTransaction_pkey" PRIMARY KEY (id);


--
-- Name: Benefit Benefit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Benefit"
    ADD CONSTRAINT "Benefit_pkey" PRIMARY KEY (id);


--
-- Name: BoardingAttendance BoardingAttendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BoardingAttendance"
    ADD CONSTRAINT "BoardingAttendance_pkey" PRIMARY KEY (id);


--
-- Name: Branch Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);


--
-- Name: BudgetApproval BudgetApproval_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetApproval"
    ADD CONSTRAINT "BudgetApproval_pkey" PRIMARY KEY (id);


--
-- Name: BudgetScenario BudgetScenario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetScenario"
    ADD CONSTRAINT "BudgetScenario_pkey" PRIMARY KEY (id);


--
-- Name: Budget Budget_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_pkey" PRIMARY KEY (id);


--
-- Name: CateringMenu CateringMenu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CateringMenu"
    ADD CONSTRAINT "CateringMenu_pkey" PRIMARY KEY (id);


--
-- Name: Certification Certification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Certification"
    ADD CONSTRAINT "Certification_pkey" PRIMARY KEY (id);


--
-- Name: ChartOfAccount ChartOfAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChartOfAccount"
    ADD CONSTRAINT "ChartOfAccount_pkey" PRIMARY KEY (id);


--
-- Name: Class Class_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_pkey" PRIMARY KEY (id);


--
-- Name: ClinicInventory ClinicInventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicInventory"
    ADD CONSTRAINT "ClinicInventory_pkey" PRIMARY KEY (id);


--
-- Name: ClinicVisit ClinicVisit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicVisit"
    ADD CONSTRAINT "ClinicVisit_pkey" PRIMARY KEY (id);


--
-- Name: CommunicationLog CommunicationLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationLog"
    ADD CONSTRAINT "CommunicationLog_pkey" PRIMARY KEY (id);


--
-- Name: CommunicationSettings CommunicationSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationSettings"
    ADD CONSTRAINT "CommunicationSettings_pkey" PRIMARY KEY (id);


--
-- Name: CommunicationTrigger CommunicationTrigger_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationTrigger"
    ADD CONSTRAINT "CommunicationTrigger_pkey" PRIMARY KEY (id);


--
-- Name: Conversation Conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY (id);


--
-- Name: CustomReport CustomReport_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CustomReport"
    ADD CONSTRAINT "CustomReport_pkey" PRIMARY KEY (id);


--
-- Name: Deduction Deduction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Deduction"
    ADD CONSTRAINT "Deduction_pkey" PRIMARY KEY (id);


--
-- Name: DepartmentBudget DepartmentBudget_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DepartmentBudget"
    ADD CONSTRAINT "DepartmentBudget_pkey" PRIMARY KEY (id);


--
-- Name: DigitalResource DigitalResource_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DigitalResource"
    ADD CONSTRAINT "DigitalResource_pkey" PRIMARY KEY (id);


--
-- Name: DisciplinaryAction DisciplinaryAction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DisciplinaryAction"
    ADD CONSTRAINT "DisciplinaryAction_pkey" PRIMARY KEY (id);


--
-- Name: DisciplinaryIncident DisciplinaryIncident_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DisciplinaryIncident"
    ADD CONSTRAINT "DisciplinaryIncident_pkey" PRIMARY KEY (id);


--
-- Name: DocumentTemplate DocumentTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DocumentTemplate"
    ADD CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY (id);


--
-- Name: ElectionCandidate ElectionCandidate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ElectionCandidate"
    ADD CONSTRAINT "ElectionCandidate_pkey" PRIMARY KEY (id);


--
-- Name: Election Election_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Election"
    ADD CONSTRAINT "Election_pkey" PRIMARY KEY (id);


--
-- Name: EmergencyContact EmergencyContact_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmergencyContact"
    ADD CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY (id);


--
-- Name: EngagementCampaign EngagementCampaign_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EngagementCampaign"
    ADD CONSTRAINT "EngagementCampaign_pkey" PRIMARY KEY (id);


--
-- Name: EngagementEvent EngagementEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EngagementEvent"
    ADD CONSTRAINT "EngagementEvent_pkey" PRIMARY KEY (id);


--
-- Name: EngagementSurvey EngagementSurvey_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EngagementSurvey"
    ADD CONSTRAINT "EngagementSurvey_pkey" PRIMARY KEY (id);


--
-- Name: ExamResult ExamResult_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_pkey" PRIMARY KEY (id);


--
-- Name: Exam Exam_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_pkey" PRIMARY KEY (id);


--
-- Name: ExtracurricularActivity ExtracurricularActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExtracurricularActivity"
    ADD CONSTRAINT "ExtracurricularActivity_pkey" PRIMARY KEY (id);


--
-- Name: ExtracurricularMembership ExtracurricularMembership_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExtracurricularMembership"
    ADD CONSTRAINT "ExtracurricularMembership_pkey" PRIMARY KEY (id);


--
-- Name: Facility Facility_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Facility"
    ADD CONSTRAINT "Facility_pkey" PRIMARY KEY (id);


--
-- Name: FeeItem FeeItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeeItem"
    ADD CONSTRAINT "FeeItem_pkey" PRIMARY KEY (id);


--
-- Name: FeeStructure FeeStructure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_pkey" PRIMARY KEY (id);


--
-- Name: Feedback Feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_pkey" PRIMARY KEY (id);


--
-- Name: FinanceSettings FinanceSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FinanceSettings"
    ADD CONSTRAINT "FinanceSettings_pkey" PRIMARY KEY (id);


--
-- Name: FinancialYear FinancialYear_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FinancialYear"
    ADD CONSTRAINT "FinancialYear_pkey" PRIMARY KEY (id);


--
-- Name: FoodInventory FoodInventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodInventory"
    ADD CONSTRAINT "FoodInventory_pkey" PRIMARY KEY (id);


--
-- Name: FuelRecord FuelRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FuelRecord"
    ADD CONSTRAINT "FuelRecord_pkey" PRIMARY KEY (id);


--
-- Name: Goal Goal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Goal"
    ADD CONSTRAINT "Goal_pkey" PRIMARY KEY (id);


--
-- Name: GoodsReceivedNote GoodsReceivedNote_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GoodsReceivedNote"
    ADD CONSTRAINT "GoodsReceivedNote_pkey" PRIMARY KEY (id);


--
-- Name: GradingScaleRange GradingScaleRange_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GradingScaleRange"
    ADD CONSTRAINT "GradingScaleRange_pkey" PRIMARY KEY (id);


--
-- Name: GradingScale GradingScale_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GradingScale"
    ADD CONSTRAINT "GradingScale_pkey" PRIMARY KEY (id);


--
-- Name: Grievance Grievance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grievance"
    ADD CONSTRAINT "Grievance_pkey" PRIMARY KEY (id);


--
-- Name: HardwareDevice HardwareDevice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HardwareDevice"
    ADD CONSTRAINT "HardwareDevice_pkey" PRIMARY KEY (id);


--
-- Name: HostelAllocation HostelAllocation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_pkey" PRIMARY KEY (id);


--
-- Name: HostelRoom HostelRoom_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelRoom"
    ADD CONSTRAINT "HostelRoom_pkey" PRIMARY KEY (id);


--
-- Name: Hostel Hostel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Hostel"
    ADD CONSTRAINT "Hostel_pkey" PRIMARY KEY (id);


--
-- Name: Inspection Inspection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Inspection"
    ADD CONSTRAINT "Inspection_pkey" PRIMARY KEY (id);


--
-- Name: Interview Interview_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_pkey" PRIMARY KEY (id);


--
-- Name: InventoryBalance InventoryBalance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InventoryBalance"
    ADD CONSTRAINT "InventoryBalance_pkey" PRIMARY KEY (id);


--
-- Name: InventoryItem InventoryItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InventoryItem"
    ADD CONSTRAINT "InventoryItem_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceItem InvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: JobOpening JobOpening_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobOpening"
    ADD CONSTRAINT "JobOpening_pkey" PRIMARY KEY (id);


--
-- Name: JournalEntry JournalEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_pkey" PRIMARY KEY (id);


--
-- Name: JournalLine JournalLine_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JournalLine"
    ADD CONSTRAINT "JournalLine_pkey" PRIMARY KEY (id);


--
-- Name: KitchenTask KitchenTask_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KitchenTask"
    ADD CONSTRAINT "KitchenTask_pkey" PRIMARY KEY (id);


--
-- Name: LeadershipPosition LeadershipPosition_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeadershipPosition"
    ADD CONSTRAINT "LeadershipPosition_pkey" PRIMARY KEY (id);


--
-- Name: LeaveBalance LeaveBalance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveBalance"
    ADD CONSTRAINT "LeaveBalance_pkey" PRIMARY KEY (id);


--
-- Name: LeaveRequest LeaveRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveRequest"
    ADD CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY (id);


--
-- Name: LibraryBook LibraryBook_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryBook"
    ADD CONSTRAINT "LibraryBook_pkey" PRIMARY KEY (id);


--
-- Name: LibraryCirculation LibraryCirculation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryCirculation"
    ADD CONSTRAINT "LibraryCirculation_pkey" PRIMARY KEY (id);


--
-- Name: LibraryMember LibraryMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryMember"
    ADD CONSTRAINT "LibraryMember_pkey" PRIMARY KEY (id);


--
-- Name: MaintenanceRecord MaintenanceRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MaintenanceRecord"
    ADD CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY (id);


--
-- Name: MealAttendance MealAttendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MealAttendance"
    ADD CONSTRAINT "MealAttendance_pkey" PRIMARY KEY (id);


--
-- Name: MedicalRecord MedicalRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MedicalRecord"
    ADD CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY (id);


--
-- Name: MessageTemplate MessageTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MessageTemplate"
    ADD CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Onboarding Onboarding_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Onboarding"
    ADD CONSTRAINT "Onboarding_pkey" PRIMARY KEY (id);


--
-- Name: Parent Parent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_pkey" PRIMARY KEY (id);


--
-- Name: PaymentGateway PaymentGateway_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentGateway"
    ADD CONSTRAINT "PaymentGateway_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PayrollRun PayrollRun_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PayrollRun"
    ADD CONSTRAINT "PayrollRun_pkey" PRIMARY KEY (id);


--
-- Name: Payslip Payslip_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payslip"
    ADD CONSTRAINT "Payslip_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: PettyCashAccount PettyCashAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PettyCashAccount"
    ADD CONSTRAINT "PettyCashAccount_pkey" PRIMARY KEY (id);


--
-- Name: PettyCashTransaction PettyCashTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PettyCashTransaction"
    ADD CONSTRAINT "PettyCashTransaction_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrder PurchaseOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseRequest PurchaseRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchaseRequest"
    ADD CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY (id);


--
-- Name: Refund Refund_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_pkey" PRIMARY KEY (id);


--
-- Name: ReportCard ReportCard_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReportCard"
    ADD CONSTRAINT "ReportCard_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SalaryStructure SalaryStructure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SalaryStructure"
    ADD CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY (id);


--
-- Name: SecurityPolicy SecurityPolicy_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SecurityPolicy"
    ADD CONSTRAINT "SecurityPolicy_pkey" PRIMARY KEY (id);


--
-- Name: Staff Staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Staff"
    ADD CONSTRAINT "Staff_pkey" PRIMARY KEY (id);


--
-- Name: StockIssue StockIssue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockIssue"
    ADD CONSTRAINT "StockIssue_pkey" PRIMARY KEY (id);


--
-- Name: StockMovement StockMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY (id);


--
-- Name: Store Store_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_pkey" PRIMARY KEY (id);


--
-- Name: Stream Stream_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Stream"
    ADD CONSTRAINT "Stream_pkey" PRIMARY KEY (id);


--
-- Name: StudentDocument StudentDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentDocument"
    ADD CONSTRAINT "StudentDocument_pkey" PRIMARY KEY (id);


--
-- Name: StudentEnrollment StudentEnrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_pkey" PRIMARY KEY (id);


--
-- Name: StudentParent StudentParent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentParent"
    ADD CONSTRAINT "StudentParent_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: SubjectAllocation SubjectAllocation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SubjectAllocation"
    ADD CONSTRAINT "SubjectAllocation_pkey" PRIMARY KEY (id);


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (id);


--
-- Name: Supplier Supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY (id);


--
-- Name: SystemModule SystemModule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemModule"
    ADD CONSTRAINT "SystemModule_pkey" PRIMARY KEY (id);


--
-- Name: TenantSubscription TenantSubscription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantSubscription"
    ADD CONSTRAINT "TenantSubscription_pkey" PRIMARY KEY (id);


--
-- Name: TenantUser TenantUser_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_pkey" PRIMARY KEY (id);


--
-- Name: Tenant Tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (id);


--
-- Name: Timesheet Timesheet_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Timesheet"
    ADD CONSTRAINT "Timesheet_pkey" PRIMARY KEY (id);


--
-- Name: TrainingProgram TrainingProgram_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingProgram"
    ADD CONSTRAINT "TrainingProgram_pkey" PRIMARY KEY (id);


--
-- Name: TrainingRequest TrainingRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingRequest"
    ADD CONSTRAINT "TrainingRequest_pkey" PRIMARY KEY (id);


--
-- Name: TransportAssignment TransportAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransportAssignment"
    ADD CONSTRAINT "TransportAssignment_pkey" PRIMARY KEY (id);


--
-- Name: TransportRoute TransportRoute_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransportRoute"
    ADD CONSTRAINT "TransportRoute_pkey" PRIMARY KEY (id);


--
-- Name: Trip Trip_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_pkey" PRIMARY KEY (id);


--
-- Name: UserGroupMember UserGroupMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGroupMember"
    ADD CONSTRAINT "UserGroupMember_pkey" PRIMARY KEY (id);


--
-- Name: UserGroup UserGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGroup"
    ADD CONSTRAINT "UserGroup_pkey" PRIMARY KEY (id);


--
-- Name: UserInvitation UserInvitation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserInvitation"
    ADD CONSTRAINT "UserInvitation_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);


--
-- Name: WelfareSession WelfareSession_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WelfareSession"
    ADD CONSTRAINT "WelfareSession_pkey" PRIMARY KEY (id);


--
-- Name: WorkOrder WorkOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_pkey" PRIMARY KEY (id);


--
-- Name: AcademicSettings_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AcademicSettings_tenantId_key" ON public."AcademicSettings" USING btree ("tenantId");


--
-- Name: AdmissionApplication_admissionNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AdmissionApplication_admissionNumber_key" ON public."AdmissionApplication" USING btree ("admissionNumber");


--
-- Name: AiSystemState_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AiSystemState_tenantId_key" ON public."AiSystemState" USING btree ("tenantId");


--
-- Name: Asset_assetTag_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Asset_assetTag_key" ON public."Asset" USING btree ("assetTag");


--
-- Name: AttendanceRecord_registerId_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AttendanceRecord_registerId_studentId_key" ON public."AttendanceRecord" USING btree ("registerId", "studentId");


--
-- Name: AttendanceRegister_streamId_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AttendanceRegister_streamId_date_key" ON public."AttendanceRegister" USING btree ("streamId", date);


--
-- Name: ChartOfAccount_tenantId_accountCode_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ChartOfAccount_tenantId_accountCode_key" ON public."ChartOfAccount" USING btree ("tenantId", "accountCode");


--
-- Name: Class_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Class_tenantId_name_key" ON public."Class" USING btree ("tenantId", name);


--
-- Name: CommunicationSettings_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CommunicationSettings_tenantId_key" ON public."CommunicationSettings" USING btree ("tenantId");


--
-- Name: CommunicationTrigger_tenantId_event_channel_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CommunicationTrigger_tenantId_event_channel_key" ON public."CommunicationTrigger" USING btree ("tenantId", event, channel);


--
-- Name: Conversation_participantOneId_participantTwoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Conversation_participantOneId_participantTwoId_key" ON public."Conversation" USING btree ("participantOneId", "participantTwoId");


--
-- Name: ExamResult_examId_studentId_subjectId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ExamResult_examId_studentId_subjectId_key" ON public."ExamResult" USING btree ("examId", "studentId", "subjectId");


--
-- Name: ExtracurricularMembership_activityId_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ExtracurricularMembership_activityId_studentId_key" ON public."ExtracurricularMembership" USING btree ("activityId", "studentId");


--
-- Name: FeeStructure_academicYearId_classId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "FeeStructure_academicYearId_classId_name_key" ON public."FeeStructure" USING btree ("academicYearId", "classId", name);


--
-- Name: FinanceSettings_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "FinanceSettings_tenantId_key" ON public."FinanceSettings" USING btree ("tenantId");


--
-- Name: FinancialYear_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "FinancialYear_tenantId_name_key" ON public."FinancialYear" USING btree ("tenantId", name);


--
-- Name: GoodsReceivedNote_grnNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GoodsReceivedNote_grnNumber_key" ON public."GoodsReceivedNote" USING btree ("grnNumber");


--
-- Name: HostelAllocation_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HostelAllocation_studentId_key" ON public."HostelAllocation" USING btree ("studentId");


--
-- Name: InventoryBalance_storeId_itemId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "InventoryBalance_storeId_itemId_key" ON public."InventoryBalance" USING btree ("storeId", "itemId");


--
-- Name: InventoryItem_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "InventoryItem_code_key" ON public."InventoryItem" USING btree (code);


--
-- Name: Invoice_tenantId_invoiceNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Invoice_tenantId_invoiceNumber_key" ON public."Invoice" USING btree ("tenantId", "invoiceNumber");


--
-- Name: JournalEntry_tenantId_entryNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "JournalEntry_tenantId_entryNumber_key" ON public."JournalEntry" USING btree ("tenantId", "entryNumber");


--
-- Name: LeaveBalance_tenantId_staffId_type_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LeaveBalance_tenantId_staffId_type_key" ON public."LeaveBalance" USING btree ("tenantId", "staffId", type);


--
-- Name: LibraryMember_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LibraryMember_studentId_key" ON public."LibraryMember" USING btree ("studentId");


--
-- Name: MedicalRecord_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "MedicalRecord_studentId_key" ON public."MedicalRecord" USING btree ("studentId");


--
-- Name: Payment_tenantId_receiptNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Payment_tenantId_receiptNumber_key" ON public."Payment" USING btree ("tenantId", "receiptNumber");


--
-- Name: PurchaseOrder_poNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PurchaseOrder_poNumber_key" ON public."PurchaseOrder" USING btree ("poNumber");


--
-- Name: PurchaseRequest_requestNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PurchaseRequest_requestNumber_key" ON public."PurchaseRequest" USING btree ("requestNumber");


--
-- Name: ReportCard_examId_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ReportCard_examId_studentId_key" ON public."ReportCard" USING btree ("examId", "studentId");


--
-- Name: Staff_tenantId_employeeNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Staff_tenantId_employeeNumber_key" ON public."Staff" USING btree ("tenantId", "employeeNumber");


--
-- Name: StockIssue_issueNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StockIssue_issueNumber_key" ON public."StockIssue" USING btree ("issueNumber");


--
-- Name: Stream_classId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Stream_classId_name_key" ON public."Stream" USING btree ("classId", name);


--
-- Name: StudentEnrollment_academicYearId_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StudentEnrollment_academicYearId_studentId_key" ON public."StudentEnrollment" USING btree ("academicYearId", "studentId");


--
-- Name: StudentParent_studentId_parentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "StudentParent_studentId_parentId_key" ON public."StudentParent" USING btree ("studentId", "parentId");


--
-- Name: Student_tenantId_admissionNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Student_tenantId_admissionNumber_key" ON public."Student" USING btree ("tenantId", "admissionNumber");


--
-- Name: SubjectAllocation_academicYearId_staffId_subjectId_streamId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "SubjectAllocation_academicYearId_staffId_subjectId_streamId_key" ON public."SubjectAllocation" USING btree ("academicYearId", "staffId", "subjectId", "streamId");


--
-- Name: Subject_tenantId_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Subject_tenantId_code_key" ON public."Subject" USING btree ("tenantId", code);


--
-- Name: TenantSubscription_tenantId_moduleId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TenantSubscription_tenantId_moduleId_key" ON public."TenantSubscription" USING btree ("tenantId", "moduleId");


--
-- Name: TenantUser_userId_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TenantUser_userId_tenantId_key" ON public."TenantUser" USING btree ("userId", "tenantId");


--
-- Name: Tenant_domainPrefix_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tenant_domainPrefix_key" ON public."Tenant" USING btree ("domainPrefix");


--
-- Name: TransportAssignment_routeId_studentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TransportAssignment_routeId_studentId_key" ON public."TransportAssignment" USING btree ("routeId", "studentId");


--
-- Name: UserGroupMember_groupId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UserGroupMember_groupId_userId_key" ON public."UserGroupMember" USING btree ("groupId", "userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phoneNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_phoneNumber_key" ON public."User" USING btree ("phoneNumber");


--
-- Name: Vehicle_registrationNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Vehicle_registrationNumber_key" ON public."Vehicle" USING btree ("registrationNumber");


--
-- Name: WorkOrder_orderNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "WorkOrder_orderNumber_key" ON public."WorkOrder" USING btree ("orderNumber");


--
-- Name: AIAuditLog AIAuditLog_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIAuditLog"
    ADD CONSTRAINT "AIAuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIAuditLog AIAuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIAuditLog"
    ADD CONSTRAINT "AIAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIKnowledgeBase AIKnowledgeBase_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIKnowledgeBase"
    ADD CONSTRAINT "AIKnowledgeBase_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AcademicSettings AcademicSettings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AcademicSettings"
    ADD CONSTRAINT "AcademicSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AcademicTerm AcademicTerm_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AcademicTerm"
    ADD CONSTRAINT "AcademicTerm_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AcademicTerm AcademicTerm_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AcademicTerm"
    ADD CONSTRAINT "AcademicTerm_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AcademicYear AcademicYear_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AcademicYear"
    ADD CONSTRAINT "AcademicYear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AccessRequest AccessRequest_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AccessRequest"
    ADD CONSTRAINT "AccessRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AccessRequest AccessRequest_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AccessRequest"
    ADD CONSTRAINT "AccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AdmissionApplication AdmissionApplication_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AdmissionApplication"
    ADD CONSTRAINT "AdmissionApplication_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AiDailyBrief AiDailyBrief_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AiDailyBrief"
    ADD CONSTRAINT "AiDailyBrief_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AiFaqCache AiFaqCache_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AiFaqCache"
    ADD CONSTRAINT "AiFaqCache_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AiSystemState AiSystemState_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AiSystemState"
    ADD CONSTRAINT "AiSystemState_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_targetClassId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_targetClassId_fkey" FOREIGN KEY ("targetClassId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Applicant Applicant_jobOpeningId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Applicant"
    ADD CONSTRAINT "Applicant_jobOpeningId_fkey" FOREIGN KEY ("jobOpeningId") REFERENCES public."JobOpening"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Applicant Applicant_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Applicant"
    ADD CONSTRAINT "Applicant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Appraisal Appraisal_reviewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Appraisal"
    ADD CONSTRAINT "Appraisal_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Appraisal Appraisal_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Appraisal"
    ADD CONSTRAINT "Appraisal_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Appraisal Appraisal_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Appraisal"
    ADD CONSTRAINT "Appraisal_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Asset Asset_facilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES public."Facility"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Asset Asset_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRecord AttendanceRecord_registerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES public."AttendanceRegister"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRecord AttendanceRecord_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRegister AttendanceRegister_academicTermId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRegister"
    ADD CONSTRAINT "AttendanceRegister_academicTermId_fkey" FOREIGN KEY ("academicTermId") REFERENCES public."AcademicTerm"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRegister AttendanceRegister_recordedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRegister"
    ADD CONSTRAINT "AttendanceRegister_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRegister AttendanceRegister_streamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRegister"
    ADD CONSTRAINT "AttendanceRegister_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES public."Stream"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRegister AttendanceRegister_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRegister"
    ADD CONSTRAINT "AttendanceRegister_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankAccount BankAccount_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankAccount"
    ADD CONSTRAINT "BankAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankReconciliation BankReconciliation_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankReconciliation"
    ADD CONSTRAINT "BankReconciliation_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public."BankAccount"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankTransaction BankTransaction_bankAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankTransaction"
    ADD CONSTRAINT "BankTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES public."BankAccount"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankTransaction BankTransaction_reconciliationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankTransaction"
    ADD CONSTRAINT "BankTransaction_reconciliationId_fkey" FOREIGN KEY ("reconciliationId") REFERENCES public."BankReconciliation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Benefit Benefit_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Benefit"
    ADD CONSTRAINT "Benefit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BoardingAttendance BoardingAttendance_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BoardingAttendance"
    ADD CONSTRAINT "BoardingAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BoardingAttendance BoardingAttendance_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BoardingAttendance"
    ADD CONSTRAINT "BoardingAttendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Branch Branch_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetApproval BudgetApproval_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetApproval"
    ADD CONSTRAINT "BudgetApproval_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BudgetScenario BudgetScenario_budgetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BudgetScenario"
    ADD CONSTRAINT "BudgetScenario_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES public."Budget"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Budget Budget_financialYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_financialYearId_fkey" FOREIGN KEY ("financialYearId") REFERENCES public."FinancialYear"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Budget Budget_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Budget"
    ADD CONSTRAINT "Budget_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CateringMenu CateringMenu_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CateringMenu"
    ADD CONSTRAINT "CateringMenu_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certification Certification_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Certification"
    ADD CONSTRAINT "Certification_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certification Certification_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Certification"
    ADD CONSTRAINT "Certification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChartOfAccount ChartOfAccount_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChartOfAccount"
    ADD CONSTRAINT "ChartOfAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Class Class_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Class Class_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClinicInventory ClinicInventory_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicInventory"
    ADD CONSTRAINT "ClinicInventory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClinicVisit ClinicVisit_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicVisit"
    ADD CONSTRAINT "ClinicVisit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClinicVisit ClinicVisit_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicVisit"
    ADD CONSTRAINT "ClinicVisit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommunicationLog CommunicationLog_recipientUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationLog"
    ADD CONSTRAINT "CommunicationLog_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CommunicationLog CommunicationLog_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationLog"
    ADD CONSTRAINT "CommunicationLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommunicationSettings CommunicationSettings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationSettings"
    ADD CONSTRAINT "CommunicationSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommunicationTrigger CommunicationTrigger_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationTrigger"
    ADD CONSTRAINT "CommunicationTrigger_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."MessageTemplate"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CommunicationTrigger CommunicationTrigger_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunicationTrigger"
    ADD CONSTRAINT "CommunicationTrigger_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversation Conversation_participantOneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_participantOneId_fkey" FOREIGN KEY ("participantOneId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversation Conversation_participantTwoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_participantTwoId_fkey" FOREIGN KEY ("participantTwoId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversation Conversation_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversation"
    ADD CONSTRAINT "Conversation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CustomReport CustomReport_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CustomReport"
    ADD CONSTRAINT "CustomReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Deduction Deduction_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Deduction"
    ADD CONSTRAINT "Deduction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DepartmentBudget DepartmentBudget_budgetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DepartmentBudget"
    ADD CONSTRAINT "DepartmentBudget_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES public."Budget"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DigitalResource DigitalResource_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DigitalResource"
    ADD CONSTRAINT "DigitalResource_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DisciplinaryAction DisciplinaryAction_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DisciplinaryAction"
    ADD CONSTRAINT "DisciplinaryAction_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DisciplinaryAction DisciplinaryAction_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DisciplinaryAction"
    ADD CONSTRAINT "DisciplinaryAction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DisciplinaryIncident DisciplinaryIncident_reportedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DisciplinaryIncident"
    ADD CONSTRAINT "DisciplinaryIncident_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DisciplinaryIncident DisciplinaryIncident_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DisciplinaryIncident"
    ADD CONSTRAINT "DisciplinaryIncident_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DisciplinaryIncident DisciplinaryIncident_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DisciplinaryIncident"
    ADD CONSTRAINT "DisciplinaryIncident_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DocumentTemplate DocumentTemplate_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DocumentTemplate"
    ADD CONSTRAINT "DocumentTemplate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ElectionCandidate ElectionCandidate_electionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ElectionCandidate"
    ADD CONSTRAINT "ElectionCandidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES public."Election"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Election Election_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Election"
    ADD CONSTRAINT "Election_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmergencyContact EmergencyContact_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmergencyContact"
    ADD CONSTRAINT "EmergencyContact_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmergencyContact EmergencyContact_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmergencyContact"
    ADD CONSTRAINT "EmergencyContact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EngagementCampaign EngagementCampaign_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EngagementCampaign"
    ADD CONSTRAINT "EngagementCampaign_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EngagementEvent EngagementEvent_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EngagementEvent"
    ADD CONSTRAINT "EngagementEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EngagementSurvey EngagementSurvey_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EngagementSurvey"
    ADD CONSTRAINT "EngagementSurvey_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamResult ExamResult_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamResult ExamResult_gradeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES public."GradingScaleRange"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ExamResult ExamResult_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamResult ExamResult_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamResult ExamResult_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exam Exam_academicTermId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_academicTermId_fkey" FOREIGN KEY ("academicTermId") REFERENCES public."AcademicTerm"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exam Exam_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExtracurricularActivity ExtracurricularActivity_patronId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExtracurricularActivity"
    ADD CONSTRAINT "ExtracurricularActivity_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ExtracurricularActivity ExtracurricularActivity_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExtracurricularActivity"
    ADD CONSTRAINT "ExtracurricularActivity_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExtracurricularMembership ExtracurricularMembership_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExtracurricularMembership"
    ADD CONSTRAINT "ExtracurricularMembership_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."ExtracurricularActivity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExtracurricularMembership ExtracurricularMembership_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExtracurricularMembership"
    ADD CONSTRAINT "ExtracurricularMembership_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Facility Facility_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Facility"
    ADD CONSTRAINT "Facility_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeItem FeeItem_feeStructureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeeItem"
    ADD CONSTRAINT "FeeItem_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES public."FeeStructure"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeStructure FeeStructure_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeStructure FeeStructure_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeStructure FeeStructure_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Feedback Feedback_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Feedback Feedback_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Feedback Feedback_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FinanceSettings FinanceSettings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FinanceSettings"
    ADD CONSTRAINT "FinanceSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FinancialYear FinancialYear_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FinancialYear"
    ADD CONSTRAINT "FinancialYear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FoodInventory FoodInventory_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodInventory"
    ADD CONSTRAINT "FoodInventory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FuelRecord FuelRecord_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FuelRecord"
    ADD CONSTRAINT "FuelRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FuelRecord FuelRecord_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FuelRecord"
    ADD CONSTRAINT "FuelRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Goal Goal_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Goal"
    ADD CONSTRAINT "Goal_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Goal Goal_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Goal"
    ADD CONSTRAINT "Goal_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GoodsReceivedNote GoodsReceivedNote_poId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GoodsReceivedNote"
    ADD CONSTRAINT "GoodsReceivedNote_poId_fkey" FOREIGN KEY ("poId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GoodsReceivedNote GoodsReceivedNote_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GoodsReceivedNote"
    ADD CONSTRAINT "GoodsReceivedNote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GoodsReceivedNote GoodsReceivedNote_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GoodsReceivedNote"
    ADD CONSTRAINT "GoodsReceivedNote_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradingScaleRange GradingScaleRange_gradingScaleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GradingScaleRange"
    ADD CONSTRAINT "GradingScaleRange_gradingScaleId_fkey" FOREIGN KEY ("gradingScaleId") REFERENCES public."GradingScale"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradingScale GradingScale_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GradingScale"
    ADD CONSTRAINT "GradingScale_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Grievance Grievance_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grievance"
    ADD CONSTRAINT "Grievance_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Grievance Grievance_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grievance"
    ADD CONSTRAINT "Grievance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HardwareDevice HardwareDevice_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HardwareDevice"
    ADD CONSTRAINT "HardwareDevice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelAllocation HostelAllocation_hostelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES public."Hostel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: HostelAllocation HostelAllocation_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."HostelRoom"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: HostelAllocation HostelAllocation_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelAllocation HostelAllocation_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelRoom HostelRoom_hostelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelRoom"
    ADD CONSTRAINT "HostelRoom_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES public."Hostel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelRoom HostelRoom_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HostelRoom"
    ADD CONSTRAINT "HostelRoom_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Hostel Hostel_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Hostel"
    ADD CONSTRAINT "Hostel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inspection Inspection_facilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Inspection"
    ADD CONSTRAINT "Inspection_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES public."Facility"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Inspection Inspection_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Inspection"
    ADD CONSTRAINT "Inspection_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interview Interview_applicantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES public."Applicant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interview Interview_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interview Interview_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Interview"
    ADD CONSTRAINT "Interview_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryBalance InventoryBalance_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InventoryBalance"
    ADD CONSTRAINT "InventoryBalance_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."InventoryItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryBalance InventoryBalance_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InventoryBalance"
    ADD CONSTRAINT "InventoryBalance_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryBalance InventoryBalance_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InventoryBalance"
    ADD CONSTRAINT "InventoryBalance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryItem InventoryItem_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InventoryItem"
    ADD CONSTRAINT "InventoryItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvoiceItem InvoiceItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_academicTermId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_academicTermId_fkey" FOREIGN KEY ("academicTermId") REFERENCES public."AcademicTerm"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobOpening JobOpening_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobOpening"
    ADD CONSTRAINT "JobOpening_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JournalEntry JournalEntry_financialYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_financialYearId_fkey" FOREIGN KEY ("financialYearId") REFERENCES public."FinancialYear"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: JournalEntry JournalEntry_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JournalLine JournalLine_chartOfAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JournalLine"
    ADD CONSTRAINT "JournalLine_chartOfAccountId_fkey" FOREIGN KEY ("chartOfAccountId") REFERENCES public."ChartOfAccount"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JournalLine JournalLine_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JournalLine"
    ADD CONSTRAINT "JournalLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public."JournalEntry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: KitchenTask KitchenTask_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KitchenTask"
    ADD CONSTRAINT "KitchenTask_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LeadershipPosition LeadershipPosition_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeadershipPosition"
    ADD CONSTRAINT "LeadershipPosition_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LeadershipPosition LeadershipPosition_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeadershipPosition"
    ADD CONSTRAINT "LeadershipPosition_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LeaveBalance LeaveBalance_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveBalance"
    ADD CONSTRAINT "LeaveBalance_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LeaveBalance LeaveBalance_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveBalance"
    ADD CONSTRAINT "LeaveBalance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LeaveRequest LeaveRequest_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveRequest"
    ADD CONSTRAINT "LeaveRequest_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LeaveRequest LeaveRequest_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveRequest"
    ADD CONSTRAINT "LeaveRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryBook LibraryBook_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryBook"
    ADD CONSTRAINT "LibraryBook_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryCirculation LibraryCirculation_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryCirculation"
    ADD CONSTRAINT "LibraryCirculation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."LibraryBook"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryCirculation LibraryCirculation_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryCirculation"
    ADD CONSTRAINT "LibraryCirculation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."LibraryMember"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryCirculation LibraryCirculation_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryCirculation"
    ADD CONSTRAINT "LibraryCirculation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryMember LibraryMember_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryMember"
    ADD CONSTRAINT "LibraryMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryMember LibraryMember_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryMember"
    ADD CONSTRAINT "LibraryMember_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MaintenanceRecord MaintenanceRecord_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MaintenanceRecord"
    ADD CONSTRAINT "MaintenanceRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MaintenanceRecord MaintenanceRecord_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MaintenanceRecord"
    ADD CONSTRAINT "MaintenanceRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MealAttendance MealAttendance_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MealAttendance"
    ADD CONSTRAINT "MealAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MealAttendance MealAttendance_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MealAttendance"
    ADD CONSTRAINT "MealAttendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MedicalRecord MedicalRecord_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MedicalRecord"
    ADD CONSTRAINT "MedicalRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MedicalRecord MedicalRecord_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MedicalRecord"
    ADD CONSTRAINT "MedicalRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessageTemplate MessageTemplate_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MessageTemplate"
    ADD CONSTRAINT "MessageTemplate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Onboarding Onboarding_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Onboarding"
    ADD CONSTRAINT "Onboarding_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Parent Parent_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Parent Parent_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaymentGateway PaymentGateway_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaymentGateway"
    ADD CONSTRAINT "PaymentGateway_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_recordedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PayrollRun PayrollRun_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PayrollRun"
    ADD CONSTRAINT "PayrollRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payslip Payslip_payrollRunId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payslip"
    ADD CONSTRAINT "Payslip_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES public."PayrollRun"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payslip Payslip_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payslip"
    ADD CONSTRAINT "Payslip_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payslip Payslip_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payslip"
    ADD CONSTRAINT "Payslip_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Permission Permission_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."SystemModule"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PettyCashAccount PettyCashAccount_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PettyCashAccount"
    ADD CONSTRAINT "PettyCashAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PettyCashTransaction PettyCashTransaction_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PettyCashTransaction"
    ADD CONSTRAINT "PettyCashTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."PettyCashAccount"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseOrder PurchaseOrder_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public."PurchaseRequest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrder PurchaseOrder_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrder PurchaseOrder_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseRequest PurchaseRequest_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchaseRequest"
    ADD CONSTRAINT "PurchaseRequest_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseRequest PurchaseRequest_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchaseRequest"
    ADD CONSTRAINT "PurchaseRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Refund Refund_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."Payment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Refund Refund_recordedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Refund Refund_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReportCard ReportCard_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReportCard"
    ADD CONSTRAINT "ReportCard_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReportCard ReportCard_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReportCard"
    ADD CONSTRAINT "ReportCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReportCard ReportCard_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReportCard"
    ADD CONSTRAINT "ReportCard_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Role Role_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SalaryStructure SalaryStructure_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SalaryStructure"
    ADD CONSTRAINT "SalaryStructure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Staff Staff_salaryStructureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Staff"
    ADD CONSTRAINT "Staff_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES public."SalaryStructure"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Staff Staff_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Staff"
    ADD CONSTRAINT "Staff_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Staff Staff_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Staff"
    ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockIssue StockIssue_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockIssue"
    ADD CONSTRAINT "StockIssue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."InventoryItem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockIssue StockIssue_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockIssue"
    ADD CONSTRAINT "StockIssue_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockIssue StockIssue_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockIssue"
    ADD CONSTRAINT "StockIssue_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockMovement StockMovement_destinationStoreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_destinationStoreId_fkey" FOREIGN KEY ("destinationStoreId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."InventoryItem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockMovement StockMovement_sourceStoreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_sourceStoreId_fkey" FOREIGN KEY ("sourceStoreId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Store Store_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Store Store_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Stream Stream_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Stream"
    ADD CONSTRAINT "Stream_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Stream Stream_classTeacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Stream"
    ADD CONSTRAINT "Stream_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Stream Stream_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Stream"
    ADD CONSTRAINT "Stream_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentDocument StudentDocument_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentDocument"
    ADD CONSTRAINT "StudentDocument_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentDocument StudentDocument_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentDocument"
    ADD CONSTRAINT "StudentDocument_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_streamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES public."Stream"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentParent StudentParent_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentParent"
    ADD CONSTRAINT "StudentParent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Parent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentParent StudentParent_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentParent"
    ADD CONSTRAINT "StudentParent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentParent StudentParent_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudentParent"
    ADD CONSTRAINT "StudentParent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Student Student_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Student Student_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SubjectAllocation SubjectAllocation_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SubjectAllocation"
    ADD CONSTRAINT "SubjectAllocation_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SubjectAllocation SubjectAllocation_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SubjectAllocation"
    ADD CONSTRAINT "SubjectAllocation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SubjectAllocation SubjectAllocation_streamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SubjectAllocation"
    ADD CONSTRAINT "SubjectAllocation_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES public."Stream"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SubjectAllocation SubjectAllocation_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SubjectAllocation"
    ADD CONSTRAINT "SubjectAllocation_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SubjectAllocation SubjectAllocation_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SubjectAllocation"
    ADD CONSTRAINT "SubjectAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subject Subject_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Supplier Supplier_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantSubscription TenantSubscription_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantSubscription"
    ADD CONSTRAINT "TenantSubscription_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."SystemModule"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantSubscription TenantSubscription_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantSubscription"
    ADD CONSTRAINT "TenantSubscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantUser TenantUser_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TenantUser TenantUser_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantUser TenantUser_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantUser TenantUser_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Timesheet Timesheet_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Timesheet"
    ADD CONSTRAINT "Timesheet_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Timesheet Timesheet_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Timesheet"
    ADD CONSTRAINT "Timesheet_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TrainingProgram TrainingProgram_instructorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingProgram"
    ADD CONSTRAINT "TrainingProgram_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TrainingProgram TrainingProgram_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingProgram"
    ADD CONSTRAINT "TrainingProgram_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TrainingRequest TrainingRequest_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingRequest"
    ADD CONSTRAINT "TrainingRequest_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TrainingRequest TrainingRequest_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingRequest"
    ADD CONSTRAINT "TrainingRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransportAssignment TransportAssignment_routeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransportAssignment"
    ADD CONSTRAINT "TransportAssignment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES public."TransportRoute"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransportAssignment TransportAssignment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransportAssignment"
    ADD CONSTRAINT "TransportAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransportRoute TransportRoute_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransportRoute"
    ADD CONSTRAINT "TransportRoute_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TransportRoute TransportRoute_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TransportRoute"
    ADD CONSTRAINT "TransportRoute_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Trip Trip_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Trip Trip_routeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES public."TransportRoute"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Trip Trip_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Trip Trip_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserGroupMember UserGroupMember_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGroupMember"
    ADD CONSTRAINT "UserGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."UserGroup"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserGroupMember UserGroupMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGroupMember"
    ADD CONSTRAINT "UserGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserGroup UserGroup_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGroup"
    ADD CONSTRAINT "UserGroup_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserInvitation UserInvitation_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserInvitation"
    ADD CONSTRAINT "UserInvitation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserInvitation UserInvitation_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserInvitation"
    ADD CONSTRAINT "UserInvitation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Vehicle Vehicle_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Vehicle Vehicle_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WelfareSession WelfareSession_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WelfareSession"
    ADD CONSTRAINT "WelfareSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WelfareSession WelfareSession_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WelfareSession"
    ADD CONSTRAINT "WelfareSession_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkOrder WorkOrder_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkOrder WorkOrder_facilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES public."Facility"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkOrder WorkOrder_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Dg5zNELi7iOh3SWksSj9pc53IjIyZni2n9IdP09AOOZGIKiHWPWz3E4j8wPlFaa

