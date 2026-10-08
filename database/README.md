# Database Directory

This folder contains the complete backups and architecture mapping for the MyShule PostgreSQL database:

| File | Purpose | Description |
| :--- | :--- | :--- |
| **`SCHEMA_RELATIONS.md`** | Architecture & Recovery Guide | Comprehensive ER diagrams, entity interconnection map, and disaster recovery commands. |
| **`schema.sql`** | Clean DDL Schema | Pure SQL tables, relations, triggers, constraints, indexes, and enums (177 KB). |
| **`full_backup.sql`** | Full Data & Schema Backup | Complete snapshot of schema plus seeded school data, users, and parent portal records (1.05 MB). |

For complete restoration instructions and relationship diagrams, see [SCHEMA_RELATIONS.md](./SCHEMA_RELATIONS.md).
