# SalesScout — AI-Powered Lead Generation Platform (Frontend)

SalesScout is a web application that automates lead generation for sales teams. Users submit a website URL, and the platform analyzes the site, discovers relevant contacts, and generates personalized outreach emails — turning a manual prospecting workflow into a few clicks.

This repository contains the **customer-facing frontend**, built with Next.js and React. It is shared publicly as a **portfolio sample** to demonstrate code quality, architecture, and UI/UX craftsmanship. It is not a deployable, complete copy of the production application — see [Notes on this repository](#notes-on-this-repository) below.

## Key Features

- **URL-based analysis** — submit a company website and let the platform do the research
- **Automated contact & email discovery** — surfaces relevant decision-makers and outreach details
- **Job processing pipeline** — track scraping/analysis jobs from submission to completion, with live status
- **Results dashboard** — review, filter, and act on generated leads
- **System stats & queue visibility** — monitor throughput and job health at a glance
- **User profile & account management**
- **Dark/light theme support**, responsive layout, and smooth motion/UI polish throughout

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS, Radix UI |
| Data & charts | Recharts |
| Animation | Framer Motion |
| Networking | Axios |
| Icons | Lucide |

## Project Structure

```
app/            Route-level pages (App Router)
components/     Reusable UI and feature components
components/ui/  Design-system primitives (button, card, modal, input, badge...)
context/        React context providers
hooks/          Custom React hooks
lib/            Client utilities (API layer, helpers)
```

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> This frontend expects a companion backend API. As noted below, the private implementation details of that integration are not included in this showcase build, so certain features will not be functional when run standalone.

## Notes on this repository

This is a **portfolio snapshot**, not the production codebase. To protect proprietary business logic:

- The **admin module** (admin dashboard, user management, activity/audit logs, system notifications) has been removed.
- Core integration logic — the authenticated API client and session/auth handling — has been replaced with non-functional stubs.

What remains reflects the real structure, component design, and UI implementation of the shipped product, and is representative of the code quality and patterns used throughout.

## License

This code is shared for **viewing and reference purposes only**. See [LICENSE](./LICENSE) — copying, reuse, redistribution, or use in another project is not permitted without prior written permission.

## About

Built by [thefabcode](https://thefabcode.com). For inquiries about this project or custom development work, feel free to reach out.
