# Md Kaif Nezami - Portfolio

A modern, professional portfolio website for Md Kaif Nezami, an Embedded Systems & Robotics Engineer specializing in UAV systems and autonomous drone technology.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Modern icon library

## Features

- **Deep Aerospace Dark Mode Theme** - Professional dark blue/black backgrounds with glowing cyan accents
- **Glassmorphism Design** - Frosted glass cards with subtle borders
- **Responsive Layout** - Fully mobile-friendly design
- **Smooth Scrolling** - Navigation links scroll smoothly to sections
- **Interactive Elements** - Glowing hover effects and animated progress bars
- **Component-Based Architecture** - Modular, maintainable code structure

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── Navigation.tsx
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Skills.tsx
│       ├── Projects.tsx
│       ├── Achievements.tsx
│       ├── Contact.tsx
│       └── Footer.tsx
├── public/
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Sections

1. **Hero** - Introduction with name, title, and call-to-action buttons
2. **About** - Background, education, and key achievements
3. **Skills** - Visual skill categories with progress bars
4. **Projects** - Featured projects with glassmorphism cards
5. **Achievements** - Certifications and accomplishments
6. **Contact** - Contact information and form

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  background: {
    dark: "#0a1428",
    lighter: "#1a1f3a",
  },
  accent: {
    cyan: "#00d4ff",
    glow: "rgba(0, 212, 255, 0.5)",
  },
}
```

### Fonts

The project uses Inter and Space Grotesk fonts. To change fonts, update `src/app/layout.tsx` and `tailwind.config.ts`.

## License

© 2024 Md Kaif Nezami. All rights reserved.
