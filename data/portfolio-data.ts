import type { LocalizedData } from "@/types";

export const portfolioData: LocalizedData = {
  profile: {
    en: {
      name: "Rami Cheikh Rouhou",
      title: "Web Developer",
      description:
        "I create modern web applications with cutting-edge technologies",
      email: "ramii.cheikhrouhou@gmail.com",
      phone: "+49 176 20174689",
      location: "Dresden, Germany",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    de: {
      name: "Rami Cheikh Rouhou",
      title: "Webentwickler",
      description:
        "Ich erstelle moderne Webanwendungen mit fortschrittlichen Technologien",
      email: "ramii.cheikhrouhou@gmail.com",
      phone: "+49 176 20174689",
      location: "Dresden, Deutschland",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
  },
  projects: {
    en: [
      {
        id: "ecommerce-platform",
        title: "E-Commerce Platform",
        description:
          "A full-stack e-commerce solution with payment processing and order management.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "#",
        github: "#",
        category: "web",
        featured: true,
      },
      {
        id: "task-management",
        title: "Task Management App",
        description:
          "A collaborative task tracker with real-time updates and team functionality.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["TypeScript", "React", "Firebase", "Tailwind CSS"],
        link: "#",
        github: "#",
        category: "web",
        featured: true,
      },
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        description:
          "A customizable portfolio template for creative professionals and developers.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Next.js", "Three.js", "Framer Motion", "Tailwind CSS"],
        link: "#",
        github: "#",
        category: "three",
        featured: true,
      },
      {
        id: "data-visualization",
        title: "Interactive Data Visualization",
        description:
          "A dashboard for visualizing complex datasets with filtering and export capabilities.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["D3.js", "React", "Node.js", "CSV"],
        link: "#",
        github: "#",
        category: "data",
      },
      {
        id: "product-configurator",
        title: "3D Product Configurator",
        description:
          "An interactive 3D product viewer with customization options.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Three.js", "React", "WebGL", "GLSL"],
        link: "#",
        github: "#",
        category: "three",
      },
      {
        id: "social-dashboard",
        title: "Social Media Dashboard",
        description:
          "A comprehensive analytics dashboard for social media management.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["React", "ChartJS", "REST API", "Redux"],
        link: "#",
        github: "#",
        category: "data",
      },
    ],
    de: [
      {
        id: "ecommerce-platform",
        title: "E-Commerce Plattform",
        description:
          "Eine Full-Stack-E-Commerce-Lösung mit Zahlungsabwicklung und Auftragsverwaltung.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "#",
        github: "#",
        category: "web",
        featured: true,
      },
      {
        id: "task-management",
        title: "Aufgabenverwaltungs-App",
        description:
          "Ein kollaborativer Aufgabentracker mit Echtzeit-Updates und Teamfunktionalität.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["TypeScript", "React", "Firebase", "Tailwind CSS"],
        link: "#",
        github: "#",
        category: "web",
        featured: true,
      },
      {
        id: "portfolio-website",
        title: "Portfolio-Website",
        description:
          "Eine anpassbare Portfolio-Vorlage für Kreativprofis und Entwickler.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Next.js", "Three.js", "Framer Motion", "Tailwind CSS"],
        link: "#",
        github: "#",
        category: "three",
        featured: true,
      },
      {
        id: "data-visualization",
        title: "Interaktive Datenvisualisierung",
        description:
          "Ein Dashboard zur Visualisierung komplexer Datensätze mit Filter- und Exportfunktionen.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["D3.js", "React", "Node.js", "CSV"],
        link: "#",
        github: "#",
        category: "data",
      },
      {
        id: "product-configurator",
        title: "3D-Produktkonfigurator",
        description:
          "Ein interaktiver 3D-Produktbetrachter mit Anpassungsoptionen.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Three.js", "React", "WebGL", "GLSL"],
        link: "#",
        github: "#",
        category: "three",
      },
      {
        id: "social-dashboard",
        title: "Social Media Dashboard",
        description:
          "Ein umfassendes Analyse-Dashboard für Social-Media-Management.",
        image: "/placeholder.svg?height=200&width=350",
        tags: ["React", "ChartJS", "REST API", "Redux"],
        link: "#",
        github: "#",
        category: "data",
      },
    ],
  },
  skills: [
    { name: "React", icon: "⚛️", category: "frontend" },
    { name: "TypeScript", icon: "🔷", category: "frontend" },
    { name: "Next.js", icon: "▲", category: "frontend" },
    { name: "Three.js", icon: "🔺", category: "frontend" },
    { name: "Framer Motion", icon: "🔄", category: "frontend" },
    { name: "Tailwind CSS", icon: "🎨", category: "frontend" },
    { name: "HTML5/CSS3", icon: "🌐", category: "frontend" },
    { name: "Node.js", icon: "🟢", category: "backend" },
    { name: "Express", icon: "🚂", category: "backend" },
    { name: "REST API", icon: "🔌", category: "backend" },
    { name: "MongoDB", icon: "🍃", category: "backend" },
    { name: "PostgreSQL", icon: "🐘", category: "backend" },
    { name: "Firebase", icon: "🔥", category: "backend" },
    { name: "Git", icon: "🔄", category: "tools" },
    { name: "GitHub", icon: "🐙", category: "tools" },
    { name: "VS Code", icon: "📝", category: "tools" },
    { name: "Figma", icon: "🎨", category: "tools" },
    { name: "Responsive Design", icon: "📱", category: "tools" },
    { name: "SEO", icon: "🔍", category: "tools" },
    { name: "Performance Optimization", icon: "⚡", category: "tools" },
  ],
  experiences: {
    en: [
      {
        position: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        period: "2021 - Present",
        description:
          "Lead development of responsive web applications using React, TypeScript, and Next.js. Implemented 3D experiences with Three.js and optimized application performance.",
      },
      {
        position: "Web Developer",
        company: "Digital Agency",
        period: "2018 - 2021",
        description:
          "Developed and maintained client websites and web applications. Worked with various frontend frameworks and integrated with backend APIs.",
      },
      {
        position: "Junior Developer",
        company: "Startup Hub",
        period: "2016 - 2018",
        description:
          "Built responsive interfaces using modern JavaScript frameworks. Collaborated with designers and backend developers to implement new features.",
      },
    ],
    de: [
      {
        position: "Senior Frontend-Entwickler",
        company: "Tech Solutions Inc.",
        period: "2021 - Heute",
        description:
          "Leitung der Entwicklung responsiver Webanwendungen mit React, TypeScript und Next.js. Implementierung von 3D-Erlebnissen mit Three.js und Optimierung der Anwendungsleistung.",
      },
      {
        position: "Webentwickler",
        company: "Digital Agency",
        period: "2018 - 2021",
        description:
          "Entwicklung und Wartung von Kunden-Websites und Webanwendungen. Arbeit mit verschiedenen Frontend-Frameworks und Integration mit Backend-APIs.",
      },
      {
        position: "Junior-Entwickler",
        company: "Startup Hub",
        period: "2016 - 2018",
        description:
          "Erstellung responsiver Benutzeroberflächen mit modernen JavaScript-Frameworks. Zusammenarbeit mit Designern und Backend-Entwicklern zur Implementierung neuer Funktionen.",
      },
    ],
  },
  education: {
    en: [
      {
        degree: "Master of Computer Science",
        institution: "Tech University",
        period: "2014 - 2016",
      },
      {
        degree: "Bachelor of Science in Web Development",
        institution: "Digital College",
        period: "2010 - 2014",
      },
      {
        degree: "Online Courses & Certifications",
        institution: "Various Platforms",
        period: "Ongoing",
      },
    ],
    de: [
      {
        degree: "Master in Informatik",
        institution: "Tech Universität",
        period: "2014 - 2016",
      },
      {
        degree: "Bachelor of Science in Webentwicklung",
        institution: "Digital College",
        period: "2010 - 2014",
      },
      {
        degree: "Online-Kurse & Zertifizierungen",
        institution: "Verschiedene Plattformen",
        period: "Fortlaufend",
      },
    ],
  },
};
