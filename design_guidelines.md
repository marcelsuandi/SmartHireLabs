# SmartHire Design Guidelines

## Design Approach
**System-Based Approach**: Drawing from Material Design and modern enterprise UI patterns (Linear, Notion) optimized for productivity and data-dense interfaces. This recruitment platform prioritizes usability, clarity, and efficient workflows over visual flair.

## Typography System
- **Primary Font**: Inter or SF Pro Display via Google Fonts
- **Hierarchy**:
  - H1 (Page Titles): 2xl (24px), font-semibold
  - H2 (Section Headers): xl (20px), font-semibold  
  - H3 (Card/Panel Titles): lg (18px), font-medium
  - Body: base (16px), font-normal
  - Small/Meta: sm (14px), font-normal
  - Table Headers: sm (14px), font-semibold, uppercase tracking-wide

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section margins: mb-8, mt-6
- Card spacing: p-6
- Form field gaps: gap-4
- Table cell padding: px-4 py-3

**Grid Structure**:
- Dashboard cards: 3-column grid on desktop (grid-cols-3), stack on mobile
- Two-column forms: grid-cols-2 gap-6 on desktop, single column on mobile
- Sidebar navigation: 240px fixed width, collapsible on mobile

## Component Library

### Navigation
- **Sidebar** (Admin/Manager/Candidate): Fixed left panel, 240px wide, icons + labels, active state with subtle background, hierarchical with section dividers
- **Top Bar**: Logo left, user profile/logout right, role badge display

### Dashboard Components
- **Summary Cards**: Elevated cards with icon, metric number (3xl, bold), label below, hover lift effect
- **Data Tables**: Striped rows, sticky header, sort indicators, pagination footer, row actions in rightmost column
- **Chatbot Panel** (Candidate): Fixed right sidebar 320px, chat bubble interface, input at bottom, conversation history scrollable

### Forms
- **Input Fields**: Full-width labels above, bordered inputs with focus ring, helper text below, error states in red with icon
- **File Upload**: Dashed border dropzone, file preview card with name/size/remove action
- **Select Dropdowns**: Native styled selects with chevron indicator
- **Action Buttons**: Primary (solid), Secondary (outlined), Danger (red solid for reject)

### Tables
- **Candidate Tables**: Sticky header row, alternating row backgrounds, status badges (pill-shaped with role-specific colors), action buttons grouped in final column
- **Status Badges**: Applied (gray), Processing (blue), Passed Selection (yellow), Accepted (green), Rejected (red)

### Modals & Overlays
- **Confirmation Dialogs**: Centered overlay, max-w-md, title + message + action buttons (Cancel + Confirm)
- **Detail Panels**: Slide-in from right (or modal), full candidate info with tabs for Education/Skills/Experience
- **Job Detail**: Modal with job description, requirements list, apply button prominent at bottom

## Page-Specific Layouts

### Landing Page (Public)
- **Hero Section**: Full viewport height (h-screen), centered content with large heading (4xl), subheading, dual CTA buttons (Sign Up primary, Login secondary), subtle gradient background
- **Features Section**: 3-column grid with icon + title + description cards, py-16
- **Image**: Abstract tech/recruitment illustration as hero background (subtle, low opacity overlay)

### Auth Pages
- **Login/Register**: Centered card (max-w-md), logo top, form fields stacked, demo account buttons below main form as small outlined buttons

### Candidate Dashboard
- **Layout**: Three-column top (application count cards), main content area with recent activity table, fixed chatbot panel right (320px)
- **Chatbot**: Message bubbles (user right-aligned blue, bot left-aligned gray), timestamp, typing indicator, input with send icon

### Admin Candidate Management
- **Layout**: Full-width table with filters/search bar above, status dropdown filters, bulk action toolbar when rows selected
- **Detail View**: Split panel - left shows candidate data tabs, right shows application timeline/history

### Settings Pages (Admin)
- **Tabbed Interface**: Horizontal tabs (Users, Departments, Positions, Jobs), active tab underlined
- **CRUD Tables**: Add New button top right, inline edit/delete actions, search bar above table

### Manager Pages
- **Dashboard**: Metric cards top row, pending reviews table below, quick action buttons for Accept/Reject
- **Reports**: Date range picker, filter controls, preview table, Export CSV button prominent

## Interaction Patterns
- **Hover States**: Subtle background change on rows/cards (2% darker), button background shifts
- **Loading States**: Skeleton loaders for tables, spinner for buttons during actions
- **Toasts**: Top-right notifications for success/error actions (green/red, auto-dismiss 3s)
- **Empty States**: Centered icon + message + action button when no data

## Responsive Behavior
- **Desktop (lg+)**: Sidebar visible, multi-column dashboards, tables full-featured
- **Tablet (md)**: Collapsible sidebar, 2-column grids
- **Mobile**: Hamburger menu, stacked layouts, horizontal scroll for wide tables, bottom navigation for key actions

## Images
- **Landing Hero**: Use a modern, professional recruitment/hiring themed illustration or photo (team collaboration, interview scene, or abstract tech graphic) with 40% opacity overlay for text readability
- No other images needed - this is a data-focused application

## Forms & Data Entry
- **Validation**: Inline error messages below fields, red border on invalid inputs, success checkmark on valid
- **Required Fields**: Asterisk (*) indicator on labels
- **CV Upload**: Preview card with PDF icon, file name, file size, Replace/Remove buttons