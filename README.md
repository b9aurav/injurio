<br />
<div align="center">
  <a href="https://github.com/b9aurav/injurio">
    <img src="./public/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">injurio</h3>
  <p align="center">
    An Injury tracking system
    <br />
  </p>
</div>

## Screenshots

|||
| :------------------: | :------------------: |
| ![reports](/public/reports.png) | ![sm-reports](/public/sm-reports.png) |
| ![create-report](/public/create-report.png) | ![sm-create-report](/public/sm-create-report.png) |
| ![bar-chart](/public/bar-chart.png) | ![sm-chart](/public/sm-chart.png) |
| ![edit-report](/public/edit-report.png) | ![sm-reports](/public/sm-reports.png) |

## Features

- [x] Report: Users should be able to create, view, update, and delete an injury report.
      Each injury report have the following
  - [x] Name of reporter
  - [x] Date & time of injury
  - [x] Body Map: Use should be able to encircle different areas of injury on a body map image such as below. The system should automatically number label them.
  - [x] List of injuries: For each area encircled the user should be able to give details of the injury.
- [ ] List of Reports: The user should be able to see a list / table of all the injuries reported
  - [x] the user should see the name, date time of injury and date of report
  - [x] The user should be able to sort by any of the fields mentioned above
  - [x] The user should be able to search by name
  - [ ] The user should be able to filter by start and end date of datetime of injury and date time of report
- [x] User Authentication: Users should be able to register for an account on the app using Google login and email login. Authentication should be implemented using Auth0. Once registered, users should be able to log in and log out of their account, and view a history of their tasks.
- [x] UI/UX: The application should have a clean and user-friendly interface, built using Grommet or Ant as the design library, that is responsive and works well on desktop and mobile devices. It should be visually appealing and easy to use.

## Bonus Features

- [x] Progressive Web App (PWA): The entire application could be built as a fully responsive Progressive Web App (PWA) that can be installed on a user's home screen, works offline, and provides an app-like experience across different devices and platforms.
- [ ] Automatic location detection: When the user encircles an area of injury the label could be automatically detected instead of just a number e.g. in the previously mentioned example instead of 1 & 2 the system could automatically label them ‘left hand’ and ‘left foot’. These labels need not be anatomically precise or accurate for the sake of this task.
- [x] Analytics Dashboard: analytics dashboard that provides visualizations of relevant metrics. (Injuries per month).

## Tech Stack

- Front-end: Next.js with Grommet or Ant as the design library.
- Back-end: PostgreSQL database with Prisma as the ORM for database connectivity.
- Authentication: Auth0 for user authentication, with options for Google login and email login.
- Analytics: Chart.js
- Progressive Web App (PWA)

## Direcory Structure

```
.
└── injurio
    ├── components                 // Includes custom components.
    │   ├── bodyMap.tsx              // Component to encircle body parts for enjuries.
    │   ├── createReportModal.tsx    // Modal component to create report.
    │   └── editReportModal.tsx      // Modal component to edit report.
    ├── lib                        // Third-party library modules.
    │   └── prisma.ts                // To export single prisma client among all modules.
    ├── pages                      // Includes Page modules and API routes.
    │   ├── api                      // API Routes
    │   │   ├── [auth0].ts            // Auth0 user authentication module.
    │   │   ├── injury                 // Includes required API routes for injury (Create, Get, Delete)
    │   │   ├── report                 // Includes required API routes for report (Create, Get, Update, Delete)
    │   │   └── user                   // Includes required API routes for user (Create, Get)
    │   ├── analytics.tsx            // Analytics Page
    │   ├── home.tsx                 // Home Page
    │   ├── index.tsx                // Index Page
    │   ├── login.tsx                // Login Page
    │   └── report.tsx               // Report Page
    ├── prisma                      // Prisma Files
    │   └── schema.prisma             // Prisma Schema
    ├── public                      // Includes public files (logo, favicon, manifest, etc...)
    └── styles                      // Includes CSS files
        └── globals.css               // Single css file for all modules
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/](http://localhost:3000/api/[endpoint]). This endpoint can be edited in `pages/api/[endpoint]`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
