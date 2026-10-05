# Data Dictionary — Pet Veterinary Clinic Management System

This document provides the complete, accurate data dictionary for all database entities, attributes, data types, keys, and constraints based on the active system schema.

---

### 1. USER
Stores account and profile information for all system actors (Administrators, Veterinarians, and Pet Owners).

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique user identifier |
| **firstName** | String | | User's first name |
| **middleName** | String (Optional) | | User's middle name (if applicable) |
| **lastName** | String | | User's last name |
| **email** | String | **UQ** | Unique login email address |
| **password** | String (Hashed) | | Securely encrypted password (bcrypt) |
| **phone** | String (Optional) | | Contact phone number |
| **address** | String (Optional) | | Residential / clinic address |
| **role** | Enum (`Role`) | | User role: `ADMIN`, `VET`, or `OWNER` |
| **createdAt** | DateTime | | Timestamp of account registration |

---

### 2. PET
Stores registered patient and pet profile records linked to pet owners.

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique pet identifier |
| **name** | String | | Pet / animal name |
| **species** | String | | Type of animal (e.g., Canine, Feline, Avian) |
| **breed** | String (Optional) | | Breed of the pet |
| **gender** | String (Optional) | | Gender of the pet (Male, Female) |
| **age** | Float (Optional) | | Age in years / months |
| **weight** | Float (Optional) | | Weight in kilograms (kg) |
| **color** | String (Optional) | | Pet color / markings |
| **ownerId** | String (UUID) | **FK** | References `User(id)` (Pet Owner) |

---

### 3. CONSULTATION
Stores clinical consultation logs, examination findings, diagnoses, and treatment plans.

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique consultation record ID |
| **petId** | String (UUID) | **FK** | References `Pet(id)` (Patient) |
| **date** | DateTime | | Date and time consultation was conducted |
| **symptoms** | String / Text | | Clinical symptoms reported and observed |
| **diagnosis** | String / Text | | Veterinary medical diagnosis |
| **treatment** | String / Text | | Prescribed medical treatment and recommendations |

---

### 4. VACCINATION
Stores immunization history and next scheduled due dates for proactive reminder alerts.

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique vaccination record ID |
| **petId** | String (UUID) | **FK** | References `Pet(id)` (Patient) |
| **vaccineName** | String | | Name of vaccine administered (e.g., Anti-Rabies, 5-in-1) |
| **dateGiven** | DateTime | | Date when vaccination was given |
| **nextDue** | DateTime (Optional) | | Next scheduled due date for booster/follow-up |
| **notes** | String / Text (Optional) | | Clinical notes, manufacturer batch/serial info |

---

### 5. MEDICATION
Maintains the veterinary pharmacy catalog, stock levels, minimum stock alerts, and unit pricing.

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique medication identifier |
| **name** | String | | Generic or medicine name |
| **brand** | String (Optional) | | Brand / manufacturer name |
| **category** | String (Optional) | | Classification (e.g., Antibiotic, Anti-inflammatory, Vitamin) |
| **stock** | Integer | | Current available quantity on hand |
| **minStock** | Integer | | Reorder threshold / low-stock alert level |
| **price** | Float | | Unit price in Philippine Peso (₱) |

---

### 6. APPOINTMENT
Manages clinical appointment bookings, scheduling, and lifecycle statuses.

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique appointment ID |
| **ownerId** | String (UUID) | **FK** | References `User(id)` (Pet Owner booking the visit) |
| **petId** | String (UUID) | **FK** | References `Pet(id)` (Patient pet) |
| **date** | DateTime | | Scheduled appointment date and time |
| **reason** | String | | Reason for visit (Consultation, Vaccination, Surgery, Grooming) |
| **status** | Enum (`AppointmentStatus`) | | Current status: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |
| **notes** | String / Text (Optional) | | Special instructions or remarks |

---

### 7. COSTING (BILLING)
Stores service cost calculations, clinical billing summaries, and total transaction amounts.

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique costing / transaction ID |
| **ownerId** | String (UUID) | **FK** | References `User(id)` (Client being billed) |
| **petId** | String (UUID, Optional) | **FK** | References `Pet(id)` (Optional associated patient) |
| **date** | DateTime | | Date and time transaction was recorded |
| **notes** | String / Text (Optional) | | General transaction remarks or billing notes |
| **totalAmount** | Float | | Total calculated amount in Philippine Peso (₱) |

---

### 8. COSTINGITEM
Stores itemized charges for services and dispensed medications with automated stock synchronization.

| Field Name | Data Type | Key | Description |
| :--- | :--- | :---: | :--- |
| **id** | String (UUID) | **PK** | Unique line item identifier |
| **costingId** | String (UUID) | **FK** | References `Costing(id)` (Parent transaction, `onDelete: Cascade`) |
| **medicationId** | String (UUID, Optional) | **FK** | References `Medication(id)` (Linked medicine for stock decrement) |
| **category** | Enum (`CostingCategory`) | | Category: `CONSULTATION`, `MEDICATION`, `VACCINATION`, `OTHER` |
| **description** | String | | Service description or medicine name |
| **quantity** | Integer | | Quantity of items / units dispensed (default: `1`) |
| **price** | Float | | Unit price per item/service |
| **total** | Float | | Line item total amount (`quantity * price`) |

---

### 9. ENUMS DEFINITIONS

#### Role
- `ADMIN` — Clinic owner / full administrative access.
- `VET` — Veterinarian / clinical documentation & patient records.
- `OWNER` — Pet owner / client mobile app user.

#### AppointmentStatus
- `PENDING` — Requested by pet owner, awaiting clinic confirmation.
- `CONFIRMED` — Accepted & scheduled on the clinic calendar.
- `CANCELLED` — Cancelled by client or clinic.
- `COMPLETED` — Visit completed by attending veterinarian.

#### CostingCategory
- `CONSULTATION` — Professional veterinary examination & diagnostic fees.
- `MEDICATION` — In-house pharmacy medications (decrements inventory stock).
- `VACCINATION` — Vaccine dose & administration fee.
- `OTHER` — Laboratory tests, grooming, surgical, or boarding charges.
