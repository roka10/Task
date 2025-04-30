
---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
cd project
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

---

## Core Functionality

### Authentication

- **Register** as a student or teacher (with profile image, department, phone).
- **Login** with email and password.
- **Role-based routing**: students and teachers see different dashboards and features.

### Student Features

- **Dashboard**: Overview of upcoming tests, completed tests, and average score.
- **Take Tests**: Join scheduled tests with proctoring and security checks.
- **View Results**: See recent and past test results, with detailed analytics.
- **Profile & Settings**: Manage personal info and preferences.

### Teacher Features

- **Dashboard**: Overview of created tests, student participation, and analytics.
- **Test Creator**: Create, edit, and schedule tests with various question types (MCQ, single/multiple choice, true/false, short answer).
- **Analytics**: View performance data, average scores, and student progress.
- **Student Management**: View and manage student groups.
- **Profile & Settings**: Manage teacher info and preferences.

### Test Proctoring & Security

- **Video Proctoring**: Uses webcam to monitor students during tests.
- **Full-Screen Enforcement**: Detects and warns on exit from full-screen.
- **Local Storage**: Uses IndexedDB for offline support and data integrity.

### Notifications & Help

- **Notification Center**: Real-time updates for test schedules, results, and system messages.
- **Help Center**: FAQ and support for users.

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **State Management**: React Context, Zustand
- **Routing**: React Router
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Proctoring**: face-api.js, react-webcam
- **Storage**: IndexedDB (via Dexie, idb)
- **PDF/CSV Export**: jsPDF, PapaParse

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Credits

- [lucide-react](https://lucide.dev/) for icons
- [face-api.js](https://github.com/justadudewhohacks/face-api.js/) for proctoring
- [Recharts](https://recharts.org/) for analytics

---

## Contact

For questions or support, please open an issue or contact the maintainer.
