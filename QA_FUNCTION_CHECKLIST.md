# SafeScape Functional QA Checklist

Last updated: 2026-03-24

Use this file as a live tracker for what is working, what is broken, and what still needs UX/performance improvement.

## Status Legend

- `[ ]` Not tested yet
- `[x]` Verified working
- `BUG` Broken or failing
- `IMPROVE` Works but needs UX/performance polish

---

## 1) Core App, Routing, and Authentication

| Check | ID | Function | URL / Endpoint | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | CORE-01 | Landing page loads for guest | `GET /` |  |  |
| [ ] | CORE-02 | About page loads | `GET /about` |  |  |
| [ ] | CORE-03 | Login page opens | `GET /login` |  |  |
| [ ] | CORE-04 | Login works with valid credentials | `POST /login` |  |  |
| [ ] | CORE-05 | Login error handling works for invalid credentials | `POST /login` |  |  |
| [ ] | CORE-06 | Register page opens | `GET /register` |  |  |
| [ ] | CORE-07 | Register flow works | `POST /register` |  |  |
| [ ] | CORE-08 | Forgot password request works | `POST /forgot-password` |  |  |
| [ ] | CORE-09 | Password reset works with token | `POST /reset-password` |  |  |
| [ ] | CORE-10 | Logout works | `POST /logout` |  |  |
| [ ] | CORE-11 | Profile page loads for authenticated user | `GET /profile` |  |  |
| [ ] | CORE-12 | `/dashboard` redirects by role correctly | `GET /dashboard` |  |  |
| [ ] | CORE-13 | Admin route guard blocks non-admin users | `GET /admin` |  |  |
| [ ] | CORE-14 | Sanctum authenticated user endpoint works | `GET /api/user` |  |  |

---

## 2) Navigation and Mobile UX

| Check | ID | Function | Area | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | NAV-01 | Mobile hamburger opens/closes correctly | Top navbar |  |  |
| [ ] | NAV-02 | Mobile menu links navigate correctly | Top navbar |  |  |
| [ ] | NAV-03 | Notification button opens popover | Top navbar |  |  |
| [ ] | NAV-04 | Header buttons are aligned and not cramped on small screens | Top navbar |  |  |
| [ ] | NAV-05 | Sticky header does not overlap content when scrolling | Global layout |  |  |
| [ ] | NAV-06 | Desktop nav links match user permissions | Desktop navbar |  |  |

---

## 3) Landing Page Modules

| Check | ID | Function | Area | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | LAND-01 | Hero carousel loads images from API | `HeroCarousel` |  |  |
| [ ] | LAND-02 | Hero carousel autoplay works smoothly | `HeroCarousel` |  |  |
| [ ] | LAND-03 | Fullscreen/view-image action works | `HeroCarousel` |  |  |
| [ ] | LAND-04 | Quick access cards route to correct dashboards | `FeaturedCards` |  |  |
| [ ] | LAND-05 | Quick access cards respect role/permission filtering | `FeaturedCards` |  |  |
| [ ] | LAND-06 | “Meet Berong” text spacing is correct on mobile | `LandingAboutSection` |  |  |
| [ ] | LAND-07 | About section scroll animations are smooth and not clipping content | `LandingAboutSection` |  |  |
| [ ] | LAND-08 | Final assessment CTA buttons are clickable and route correctly | `LandingAssessmentSection` |  |  |

---

## 4) User Dashboards and Learning Flows

| Check | ID | Function | URL / Area | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | DASH-01 | Kids dashboard loads and shows modules | `GET /kids` |  |  |
| [ ] | DASH-02 | Adult dashboard loads published blogs | `GET /adult` |  |  |
| [ ] | DASH-03 | Professional dashboard loads properly | `GET /professional` |  |  |
| [ ] | DASH-04 | Unauthorized role access is blocked/redirected correctly | All role routes |  |  |
| [ ] | DASH-05 | Blog detail pages open correctly from lists | Adult/Professional content |  |  |
| [ ] | DASH-06 | Video list playback and metadata display correctly | Adult/Professional/Kids |  |  |

---

## 5) Assessments (Pre-Test / Post-Test)

| Check | ID | Function | Endpoint | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | ASM-01 | Questions load successfully | `GET /api/assessment/questions` |  |  |
| [ ] | ASM-02 | Pre-test submit works and stores score | `POST /api/assessments/pre-test` |  |  |
| [ ] | ASM-03 | Post-test submit works and stores score | `POST /api/assessments/post-test` |  |  |
| [ ] | ASM-04 | Assessment history endpoint returns correct timeline | `GET /api/assessments/history` |  |  |
| [ ] | ASM-05 | Post-test unlock logic is enforced correctly | UI + backend rules |  |  |

---

## 6) Admin Panel - Content Management

| Check | ID | Function | Endpoint / Tab | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | ADM-01 | Admin dashboard loads all tabs without errors | `GET /admin` |  |  |
| [ ] | ADM-02 | Carousel image upload returns URL | `POST /api/admin/upload` |  |  |
| [ ] | ADM-03 | Add carousel item works | `POST /api/admin/carousel` |  |  |
| [ ] | ADM-04 | Edit carousel item works | `PUT /api/admin/carousel/{id}` |  |  |
| [ ] | ADM-05 | Delete carousel item works | `DELETE /api/admin/carousel/{id}` |  |  |
| [ ] | ADM-06 | Reorder carousel persists order | `POST /api/admin/carousel/reorder` |  |  |
| [ ] | ADM-07 | Add blog post works | `POST /api/admin/blogs` |  |  |
| [ ] | ADM-08 | Edit blog post works | `PUT /api/admin/blogs/{id}` |  |  |
| [ ] | ADM-09 | Delete blog post works | `DELETE /api/admin/blogs/{id}` |  |  |
| [ ] | ADM-10 | Blog reorder persists order | `POST /api/admin/blogs/reorder` |  |  |
| [ ] | ADM-11 | Add video works | `POST /api/admin/videos` |  |  |
| [ ] | ADM-12 | Edit video works | `PUT /api/admin/videos/{id}` |  |  |
| [ ] | ADM-13 | Delete video works | `DELETE /api/admin/videos/{id}` |  |  |
| [ ] | ADM-14 | Add quick question works | `POST /api/admin/quick-questions` |  |  |
| [ ] | ADM-15 | Edit quick question works | `PUT /api/admin/quick-questions/{id}` |  |  |
| [ ] | ADM-16 | Delete quick question works | `DELETE /api/admin/quick-questions/{id}` |  |  |
| [ ] | ADM-17 | Add fire code section works | `POST /api/admin/fire-codes` |  |  |
| [ ] | ADM-18 | Edit fire code section works | `PUT /api/admin/fire-codes/{id}` |  |  |
| [ ] | ADM-19 | Delete fire code section works | `DELETE /api/admin/fire-codes/{id}` |  |  |

---

## 7) Admin Panel - User and Analytics

| Check | ID | Function | Endpoint / Tab | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | USR-01 | User list loads | `GET /api/admin/users` |  |  |
| [ ] | USR-02 | User search works (name/email/role) | Admin users tab |  |  |
| [ ] | USR-03 | Update user role works | `PUT /api/admin/users/{id}/role` |  |  |
| [ ] | USR-04 | Update user permissions works | `PATCH /api/admin/users/{id}/permissions` |  |  |
| [ ] | ANA-01 | Admin stats endpoint returns valid metrics | `GET /api/admin/stats` |  |  |
| [ ] | ANA-02 | Admin analytics endpoint loads dashboard data | `GET /api/admin/analytics` |  |  |
| [ ] | ANA-03 | Admin analytics page route renders correctly | `GET /admin/analytics` |  |  |

---

## 8) Kids and Simulation APIs

| Check | ID | Function | Endpoint | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | KID-01 | Kids modules API returns active modules | `GET /api/kids/modules` |  |  |
| [ ] | KID-02 | Kids module detail loads by ID | `GET /api/kids/modules/{id}` |  |  |
| [ ] | KID-03 | Kids progress update saves | `POST /api/kids/progress` |  |  |
| [ ] | KID-04 | SafeScape progress read works | `GET /api/kids/safescape` |  |  |
| [ ] | KID-05 | SafeScape progress update saves | `POST /api/kids/safescape` |  |  |
| [ ] | SIM-01 | Floor plan CRUD works | `/api/floor-plans/*` |  |  |
| [ ] | SIM-02 | Floor plan clone works | `POST /api/floor-plans/{id}/clone` |  |  |
| [ ] | SIM-03 | Fire simulation starts and returns job/status | `POST /api/floor-plans/{id}/simulate` |  |  |
| [ ] | SIM-04 | Simulation status polling works | `GET /api/floor-plans/{id}/status` |  |  |

---

## 9) Engagement, Notifications, and API Consistency

| Check | ID | Function | Endpoint | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | ENG-01 | Event logging works | `POST /api/engagement/log` |  |  |
| [ ] | ENG-02 | Engagement stats endpoint works | `GET /api/engagement/stats` |  |  |
| [ ] | ENG-03 | Leaderboard endpoint works | `GET /api/engagement/leaderboard` |  |  |
| [ ] | ENG-04 | Notifications fetch works | `GET /api/engagement/notifications` |  |  |
| [ ] | ENG-05 | Mark notifications as read works | `POST /api/engagement/notifications/read` |  |  |
| [ ] | ENG-06 | Frontend notification routes match backend routes | `notification-popover.tsx` vs API routes |  | Check mismatch risk (`/api/notifications` vs `/api/engagement/notifications`) |

---

## 10) Performance and Mobile Optimization

| Check | ID | Function | Area | Result | Bug / Improvement Notes |
|---|---|---|---|---|---|
| [ ] | PERF-01 | Initial page load is responsive on low-end mobile | Landing page |  |  |
| [ ] | PERF-02 | Scroll remains smooth on mobile sections with animation | Landing/About |  |  |
| [ ] | PERF-03 | Image lazy-loading works for below-the-fold assets | Global images |  |  |
| [ ] | PERF-04 | Hero first image has priority loading | Hero carousel |  |  |
| [ ] | PERF-05 | No layout shifts when navbar/menu opens | Mobile nav |  |  |
| [ ] | PERF-06 | Lighthouse mobile performance score target met (>= 80) | `GET /` |  |  |
| [ ] | PERF-07 | No critical console/network errors in common flows | Browser DevTools |  |  |

---

## 11) Current Bug Backlog

| ID | Severity | Area | Summary | Repro Steps | Owner | Status |
|---|---|---|---|---|---|---|
| BUG-001 |  |  |  |  |  | Open |
| BUG-002 |  |  |  |  |  | Open |
| BUG-003 |  |  |  |  |  | Open |

---

## 12) Improvement Backlog

| ID | Priority | Area | Improvement Idea | Expected Impact | Owner | Status |
|---|---|---|---|---|---|---|
| IMP-001 |  |  |  |  |  | Planned |
| IMP-002 |  |  |  |  |  | Planned |
| IMP-003 |  |  |  |  |  | Planned |

