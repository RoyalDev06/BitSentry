# BitSentry AML — Frontend

The frontend application for BitSentry AML, a Bitcoin transaction monitoring and AML investigation platform.

BitSentry AML helps analysts monitor Bitcoin activity, identify potentially suspicious transactions through explainable risk indicators, review alerts, and manage investigations.

> **Development environment:** Bitcoin regtest/testnet only.  
> The system does not determine that a person is committing financial crime. It identifies potentially suspicious activity based on documented risk indicators.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React** | Frontend UI |
| **TypeScript** | Type-safe development |
| **Vite** | Development server and build tool |
| **Tailwind CSS** | Styling and design system |
| **React Router** | Application routing |
| **Lucide React** | Icons |
| **TanStack Query** | Server-state/API management |
| **Zustand** | Client-side state management |
| **React Hook Form** | Form handling |
| **Zod** | Validation |
| **Recharts** | Data visualization |
| **TanStack Table** | Data tables |
| **Vitest** | Unit testing |
| **React Testing Library** | Component testing |
| **MSW** | API mocking during development |

---

## Project Structure

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── alerts/
│   │   ├── transactions/
│   │   ├── addresses/
│   │   └── cases/
│   │
│   ├── hooks/
│   ├── mocks/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Alerts/
│   │   ├── Transactions/
│   │   ├── Addresses/
│   │   ├── Cases/
│   │   ├── Reports/
│   │   └── Settings/
│   │
│   ├── routes/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

### Folder Responsibilities

* **`components/`**: Reusable UI and feature-specific components.
* **`pages/`**: Page-level views corresponding to application routes.
* **`services/`**: API communication and backend service functions.
* **`hooks/`**: Reusable React hooks and application-specific logic.
* **`stores/`**: Global client-side state managed with Zustand.
* **`types/`**: Shared TypeScript interfaces, types, enums, and API response types.
* **`mocks/`**: Mock API responses and development data.
* **`routes/`**: Application routing configuration.
* **`assets/`**: Static frontend assets such as images and other resources.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git

Check your versions:

```bash
node --version
npm --version
git --version
```

### Installation

1. Clone the team's repository:
   ```bash
   git clone <REPOSITORY_URL>
   ```
2. Move into the frontend directory:
   ```bash
   cd <repository>/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a local environment file:

```bash
.env
```

Environment variables will be added as backend/API integration is implemented.  
**Do not commit `.env` files containing secrets.**  
The repository should contain a `.env.example` file showing required variables without exposing credentials.

Example:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

### Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Code Quality

Before opening a pull request, make sure the project builds successfully.

Run:

```bash
npm run build
npm run lint
npm run test
```

If formatting checks are available:

```bash
npm run fmt-check
```

The exact commands should always match the scripts defined in `package.json`.

---

## Design System

BitSentry AML uses a dark-first analyst interface with support for both dark and light themes.

Global design tokens are defined in:

```text
src/index.css
```

Components should use the design-system tokens instead of hardcoding colors.  

### Theme System

BitSentry supports:
* **Dark theme** — default
* **Light theme**

The theme is controlled using the `data-theme` attribute on the root HTML element.

Dark theme:
```html
<html>
```

Light theme:
```html
<html data-theme="light">
```

Theme switching will eventually be handled through the application's theme state/toggle.

### Core Colors

#### Dark Theme

| Token | Color | Purpose |
| :--- | :--- | :--- |
| **Background** | `#0A0A0A` | Main application background |
| **Surface** | `#121212` | Cards and panels |
| **Surface Hover** | `#1C1C1E` | Hovered surfaces |
| **Border** | `#27272A` | Subtle borders |
| **Primary Text** | `#FFFFFF` | Main text |
| **Secondary Text** | `#9CA3AF` | Supporting text |
| **Muted Text** | `#6B7280` | Less prominent text |

#### Light Theme

| Token | Color | Purpose |
| :--- | :--- | :--- |
| **Background** | `#F8FAFC` | Main application background |
| **Surface** | `#FFFFFF` | Cards and panels |
| **Surface Hover** | `#F1F5F9` | Hovered surfaces |
| **Border** | `#E2E8F0` | Subtle borders |
| **Primary Text** | `#111827` | Main text |
| **Secondary Text** | `#4B5563` | Supporting text |
| **Muted Text** | `#6B7280` | Less prominent text |

#### Brand Colors

Brand colors remain consistent between themes.

| Token | Color | Purpose |
| :--- | :--- | :--- |
| **Bitcoin Orange** | `#F7931A` | Bitcoin/primary brand accent |
| **Gold** | `#D4A72C` | Secondary brand accent |
| **Teal** | `#14B8A6` | Supporting brand accent |

In the light theme, darker variants of gold and teal are used where necessary to maintain readability.

#### AML Risk Colors

Risk colors communicate risk semantics, not branding.

| Level | Color | Meaning |
| :--- | :--- | :--- |
| **Low** | `#10B981` | Lower-risk activity |
| **Medium** | `#F59E0B` | Activity requiring additional attention |
| **High** | `#F97316` | Activity with multiple or stronger indicators |
| **Critical** | `#EF4444` | Activity meeting the highest configured threshold |

The light theme uses darker accessible variants where necessary while maintaining the same semantic meaning.

---

## Frontend Architecture

The frontend communicates with the backend through the REST API.

```text
┌─────────────────────┐
│      React UI       │
│                     │
│ Dashboard           │
│ Alerts              │
│ Transactions        │
│ Addresses           │
│ Cases               │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│      Backend        │
│      NestJS         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ PostgreSQL / Bitcoin│
│ Core / AML Engine   │
└─────────────────────┘
```

The frontend must not communicate directly with Bitcoin Core. All blockchain and AML-related operations should go through the backend API.

### Planned API Integration

The frontend will consume endpoints such as:

#### Dashboard
* `GET /api/v1/dashboard/summary`
* `GET /api/v1/dashboard/risk-distribution`
* `GET /api/v1/dashboard/activity`

#### Alerts
* `GET /api/v1/alerts`
* `GET /api/v1/alerts/:id`
* `PATCH /api/v1/alerts/:id/status`

#### Transactions
* `GET /api/v1/transactions`
* `GET /api/v1/transactions/:txid`
* `GET /api/v1/transactions/:txid/graph`

#### Addresses
* `GET /api/v1/addresses/:address`
* `GET /api/v1/addresses/:address/transactions`

#### Cases
* `GET /api/v1/cases`
* `POST /api/v1/cases`
* `GET /api/v1/cases/:id`
* `PATCH /api/v1/cases/:id`
* `POST /api/v1/cases/:id/notes`
* `GET /api/v1/cases/:id/activity`

---

## Development Workflow

We use feature branches rather than working directly on `main`.

```text
main ──
       ├── feature/frontend-foundation
       ├── feature/frontend-dashboard
       ├── feature/frontend-alerts
       ├── feature/frontend-transactions
       └── feature/frontend-cases
```

### 1. Start from develop
```bash
git checkout develop
git pull origin develop
```

### 2. Create a feature branch
```bash
git checkout -b feature/frontend-dashboard
```

Examples:
* `feature/frontend-dashboard`
* `feature/frontend-alerts`
* `feature/frontend-transactions`
* `feature/frontend-cases`
* `fix/alert-filter`
* `fix/table-pagination`

### 3. Make your changes
Keep changes focused on the feature you are working on.

### 4. Check your work
```bash
npm run build
npm run lint
npm run test
```

### 5. Commit
```bash
git add .
git commit -m "feat: add dashboard risk summary"
```

Examples:
* `feat: add alerts table`
* `feat: add transaction details`
* `fix: correct alert filtering`
* `test: add dashboard tests`
* `refactor: simplify transaction service`
* `docs: update frontend setup`

### 6. Push your branch
```bash
git push -u origin feature/frontend-dashboard
```

### 7. Open a Pull Request
Open the PR from:

```text
feature/your-feature
        ↓
     main
```
---

