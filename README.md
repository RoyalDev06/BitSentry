# BitSentry AML

> **Bitcoin Transaction Monitoring & AML Investigation Platform**

BitSentry AML is a Bitcoin-focused Anti-Money Laundering (AML) investigation and transaction monitoring platform designed to help Virtual Asset Service Providers (VASPs), OTC desks, digital asset platforms, and compliance teams identify, investigate, and manage potentially suspicious Bitcoin activity.

The platform combines transaction monitoring, risk assessment, alert management, address investigation, and case management into a centralized compliance workflow.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Git & Branching Strategy](#git--branching-strategy)
- [Testing and Code Quality](#testing-and-code-quality)
- [Pull Request Workflow](#pull-request-workflow)
- [Contributing](#contributing)
- [Project Status](#project-status)
- [Team](#team)
- [License](#license)

---

## Overview

The growth of cryptocurrency adoption has increased the need for effective monitoring and investigation of digital asset transactions.

Traditional AML workflows can become difficult to manage when compliance teams need to analyze large numbers of transactions, identify suspicious activity, investigate wallet addresses, and maintain records of ongoing investigations.

**BitSentry AML** is being developed as a centralized platform for monitoring Bitcoin activity and supporting AML investigations.

The platform is intended to provide compliance analysts with tools to:

- Monitor Bitcoin transactions
- Identify potentially suspicious activity
- Assign risk indicators to transactions and entities
- Generate and manage alerts
- Investigate Bitcoin addresses
- Analyze transaction relationships
- Create and manage AML investigation cases
- Maintain an organized investigation workflow

---

## Problem Statement

Bitcoin transactions are publicly visible on the blockchain, but interpreting that activity for AML purposes requires more than simply viewing individual transactions.

Compliance teams may need to:

- Monitor high volumes of transactions
- Identify unusual transaction patterns
- Investigate suspicious addresses
- Correlate transactions and wallet activity
- Prioritize alerts based on risk
- Maintain investigation records
- Track cases from initial detection through resolution

BitSentry AML aims to bring these activities into a unified investigation environment.

---

## Objectives

The project aims to:

1. Provide centralized Bitcoin transaction monitoring.
2. Support risk-based identification of potentially suspicious activity.
3. Provide investigators with address and transaction investigation tools.
4. Organize suspicious activity into manageable alerts and cases.
5. Provide visual and structured information to support AML investigations.
6. Establish a foundation that can be extended with additional AML analytics and data sources.

---

# Core Features

## 1. Dashboard

The dashboard provides a high-level overview of AML monitoring activity.

Planned/implemented dashboard information includes:

- Transaction monitoring statistics
- Risk indicators
- Alert summaries
- Investigation/case statistics
- Recent suspicious activity
- AML monitoring trends

---

## 2. Transaction Monitoring

BitSentry monitors Bitcoin transaction activity and provides investigators with structured transaction information.

Transaction information may include:

- Transaction ID
- Input and output addresses
- Transaction amount
- Timestamp
- Transaction status
- Risk information
- Related alerts

The transaction interface is designed to help analysts move from a transaction-level view into deeper investigation.

---

## 3. Risk Assessment

Transactions and addresses can be evaluated using risk indicators to help investigators prioritize suspicious activity.

Risk categories used by the platform include:

- Low
- Medium
- High
- Critical

Risk assessment can be extended with additional AML detection rules and analytics as the project develops.

---

## 4. Alerts

The Alerts module provides a centralized location for potentially suspicious activity detected by the monitoring system.

Analysts can use alerts to:

- Review suspicious activity
- Examine associated transactions
- Investigate related addresses
- Assess risk
- Initiate an investigation case
- Track alert status

---

## 5. Address Investigation

The Addresses module allows investigators to examine Bitcoin addresses and their associated activity.

Investigation capabilities include:

- Address identification
- Transaction history
- Incoming and outgoing activity
- Related transactions
- Risk information
- Investigation context

---

## 6. Transaction & Address Analysis

BitSentry is designed to support investigation of relationships between Bitcoin transactions and addresses.

This provides a foundation for visualizing transaction flows and understanding relationships between blockchain entities.

Future investigation capabilities may include graph-based transaction analysis and wallet relationship visualization.

---

## 7. Case Management

The Cases module provides a structured workspace for AML investigations.

Cases can be used to organize:

- Investigation details
- Associated alerts
- Transactions
- Addresses
- Risk information
- Investigation status
- Analyst notes and findings

The goal is to provide a clear lifecycle from suspicious activity detection to investigation and resolution.

---

# System Architecture

BitSentry follows a modular application architecture designed to separate the frontend, backend services, and shared application contracts.

```text
                    ┌──────────────────────────┐
                    │       BitSentry AML      │
                    │      Web Application     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │        Frontend          │
                    │ React + TypeScript       │
                    │ Routing / UI / State     │
                    └────────────┬─────────────┘
                                 │
                          API / Data Layer
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │         Backend          │
                    │ API / AML Processing     │
                    │ Transaction Services    │
                    └────────────┬─────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
        ┌───────────────────┐        ┌───────────────────┐
        │ Blockchain / Data │        │  AML / Risk Logic │
        │ Sources           │        │  & Detection      │
        └───────────────────┘        └───────────────────┘
```

The architecture is intended to allow individual components to evolve independently while maintaining clear interfaces between them.

---

# Technology Stack

## Frontend

- **React** — User interface
- **TypeScript** — Type-safe application development
- **Vite** — Frontend development and build tooling
- **Tailwind CSS** — Styling and design system
- **React Router** — Client-side routing
- **Lucide React** — Interface icons
- **TanStack Query** — Server-state/data management
- **TanStack Table** — Data tables
- **Zustand** — Application state management
- **Recharts** — Data visualization

## Backend

The backend provides the API and processing layer used by the frontend.

Backend components are being developed separately from the frontend and are responsible for services such as:

- Transaction data processing
- AML-related processing
- Risk assessment
- Alerts
- Cases
- Address and transaction data

> Backend technologies and infrastructure should be updated here as the backend implementation is finalized.

## Blockchain/Data Layer

The platform is focused on Bitcoin transaction data and is designed to integrate with blockchain data sources for transaction and address analysis.

---

# Project Structure

The repository is organized to keep frontend and backend responsibilities separated.

```text
BitSentry/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   └── ...
│
├── packages/
│   └── shared/
│       └── ...
│
├── README.md
└── ...
```

> The exact structure may evolve as the project develops. New directories should follow the team's agreed architecture rather than introducing duplicate structures.

---

# Getting Started

## Prerequisites

Before running the project locally, ensure you have the relevant development tools installed:

- Git
- Node.js
- npm
- A modern web browser
- Backend dependencies required by the current backend implementation

Check your Node.js and npm versions:

```bash
node --version
npm --version
```

---

# Clone the Repository

Clone the repository:

```bash
git clone https://github.com/RoyalDev06/BitSentry.git
```

Navigate into the project:

```bash
cd BitSentry
```

---

# Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# Frontend Commands

### Start development server

```bash
npm run dev
```

### Build the application

```bash
npm run build
```

### Run linting

```bash
npm run lint
```

### Preview the production build

```bash
npm run preview
```

---

# Environment Configuration

Environment variables should be stored in local environment files and **must not be committed to the repository**.

For example:

```text
frontend/
├── .env
├── .env.example
└── ...
```

A `.env.example` file should contain variable names without exposing secrets.

Example:

```env
VITE_API_BASE_URL=
```

Developers should create their own local `.env` file based on the project's environment requirements.

> Never commit API keys, private keys, passwords, access tokens, or other credentials.

---

# Development Workflow

BitSentry is developed collaboratively using GitHub Issues, feature branches, pull requests, and code review.

Development should generally follow this workflow:

```text
Issue
  │
  ▼
Feature Branch
  │
  ▼
Implementation
  │
  ▼
Testing
  │
  ▼
Commit
  │
  ▼
Push
  │
  ▼
Pull Request
  │
  ▼
Code Review
  │
  ▼
Merge
```

---

# Git & Branching Strategy

The project uses feature branches to keep development work isolated.

Before starting new work, update your local development branch:

```bash
git checkout develop
git pull origin develop
```

Create a feature branch:

```bash
git checkout -b feature/<feature-name>
```

For example:

```bash
git checkout -b feature/dashboard-interface
```

Make your changes, then check the working tree:

```bash
git status
```

Stage your changes:

```bash
git add .
```

Commit using a clear message:

```bash
git commit -m "feat: implement dashboard interface"
```

Push the branch:

```bash
git push -u origin feature/dashboard-interface
```

Then open a Pull Request on GitHub.

---

# Branch Naming

Use descriptive branch names based on the work being performed.

Examples:

```text
feature/dashboard-interface
feature/alerts-management
feature/transaction-investigation
feature/case-management
fix/transaction-table
docs/update-readme
refactor/api-services
```

---

# Commit Convention

Use clear, conventional commit messages.

Examples:

```text
feat: implement dashboard interface
feat: add alert filtering
feat: add transaction investigation view
fix: resolve responsive sidebar issue
docs: update project README
refactor: simplify transaction service
test: add alert component tests
```

Keep commits focused on a logical change rather than combining unrelated work.

---

# Pull Request Workflow

Every feature should be submitted through a Pull Request.

A Pull Request should include:

### Summary

Briefly explain what was implemented.

### Changes

List the major changes made.

### Testing

Describe how the changes were tested.

### Related Issue

Link the relevant GitHub Issue.

Example:

```text
Closes #2
```

Before opening a Pull Request, developers should verify that their changes:

- Build successfully
- Pass linting
- Do not introduce unrelated changes
- Follow the project's existing design system
- Follow the agreed architecture
- Do not expose secrets or credentials

---

# Frontend Design System

The BitSentry frontend uses a dark-first AML investigation interface.

### Primary surfaces

```text
Background: #0A0A0A
Surface:    #121212
Hover:      #1C1C1E
Border:     #27272A
```

### Brand colors

```text
Bitcoin Orange: #F7931A
Brand Gold:     #D4A72C
Brand Teal:     #14B8A6
```

### Risk indicators

```text
Low:      #10B981
Medium:   #F59E0B
High:     #F97316
Critical: #EF4444
```

The frontend uses CSS variables and Tailwind theme tokens defined in:

```text
frontend/src/index.css
```

Components should use the existing semantic design tokens rather than introducing arbitrary colors.

---

# Security Considerations

BitSentry deals with potentially sensitive financial and investigative information.

Developers should:

- Never commit credentials or API keys.
- Never hard-code secrets into frontend code.
- Validate data received from external services.
- Apply appropriate authorization to protected backend resources.
- Avoid exposing sensitive investigation information unnecessarily.
- Use secure communication between application components.
- Follow applicable AML, data protection, and information security requirements when handling real-world data.

The project should use synthetic or authorized test data during development unless appropriate access and controls have been established.

---

# Project Status

BitSentry AML is currently under active development.

### Current frontend foundation

The frontend application shell currently includes:

- Application layout
- Responsive sidebar
- Header
- React Router configuration
- Dashboard route
- Alerts route
- Transactions route
- Addresses route
- Cases route
- Active navigation states
- Responsive mobile navigation
- Light/dark theme switching
- Theme persistence

Additional application functionality is being developed through separate GitHub Issues and feature branches.

---

# Roadmap

The project is being developed incrementally.

Planned areas include:

- [ ] Frontend application shell
- [ ] Application routing
- [ ] Responsive navigation
- [ ] Light/dark theme support
- [ ] Dashboard analytics
- [ ] Alert management
- [ ] Transaction investigation
- [ ] Address investigation
- [ ] Case management
- [ ] Advanced transaction relationship visualization
- [ ] AML detection and risk rules
- [ ] Backend integration
- [ ] End-to-end testing
- [ ] Production deployment

The roadmap will evolve as implementation and project requirements are refined.

---

# Contributing

Contributions are made through the project's GitHub workflow.

1. Select or create a GitHub Issue.
2. Assign yourself or coordinate with the relevant team member.
3. Create a feature branch from the current development branch.
4. Implement the required functionality.
5. Test your changes.
6. Commit your changes using a clear commit message.
7. Push your feature branch.
8. Open a Pull Request.
9. Address review feedback.
10. Merge after approval.

Avoid making unrelated changes within a feature branch.

---

# Team

BitSentry AML is being developed collaboratively as part of the Bitcoin cohort capstone project.

The team is organized around separate frontend and backend responsibilities, with development coordinated through GitHub Issues, feature branches, and Pull Requests.


---

# License

This project is currently developed as a cohort/capstone project.

License and usage terms will be defined by the project maintainers before public production distribution.

---

## BitSentry AML

**Bitcoin Transaction Monitoring & AML Investigation Platform**

Built to help compliance teams move from **transaction detection → risk assessment → investigation → case management** in one platform.
