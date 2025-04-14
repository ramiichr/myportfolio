import type { LocalizedData } from "@/types";

export const portfolioData: LocalizedData = {
  profile: {
    en: {
      name: "Rami Cheikh Rouhou",
      title: "Frontend Developer",
      description:
        "A passionate frontend developer with a Masters in Media Informatics. With a strong foundation in modern technologies such as React, Vue.js and JavaScript and experience in developing user-centric solutions, I specialize in building impactful applications, solving complex problems, meeting deadlines and delivering scalable projects.",
      email: "ramii.cheikhrouhou@gmail.com",
      phone: "+49 176 20174689",
      location: "Dresden, Germany",
      social: {
        github: "https://github.com/ramiichr",
        linkedin: "https://www.linkedin.com/in/rami-cheikh-rouhou/",
        twitter: "https://twitter.com",
      },
    },
    de: {
      name: "Rami Cheikh Rouhou",
      title: "Frontend Entwickler",
      description:
        "Ein leidenschaftlicher Frontend Entwickler mit einem Master in Medieninformatik. Mit einem starken Fundament in modernen Technologien wie React, Vue.js und JavaScript und Erfahrung in der Entwicklung von nutzerzentrierten Lösungen, bin ich darauf spezialisiert, wirkungsvolle Anwendungen zu erstellen, komplexe Probleme zu lösen, Fristen einzuhalten und skalierbare Projekte zu liefern.",
      email: "ramii.cheikhrouhou@gmail.com",
      phone: "+49 176 20174689",
      location: "Dresden, Deutschland",
      social: {
        github: "https://github.com/ramiichr",
        linkedin: "https://www.linkedin.com/in/rami-cheikh-rouhou/",
        twitter: "https://twitter.com",
      },
    },
  },
  projects: {
    en: [
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        description:
          "A modern, responsive portfolio website built with Next.js and TypeScript. Features include internationalization (English/German), dark/light mode, animations with Framer Motion, and a dashboard for visitor analytics using Redis.",
        image: "/portfolio.png?height=200&width=350",
        tags: [
          "Next.js",
          "TypeScript",
          "Framer Motion",
          "Tailwind CSS",
          "Redis",
        ],
        link: "https://rami-cheikhrouhou.vercel.app/",
        github: "https://github.com/ramiichr/myportfolio",
        category: "web",
        featured: true,
      },
      {
        id: "exchange-flow",
        title: "Exchange Flow",
        description:
          "A currency converter application that provides real-time exchange rates for over 150 currencies. Features include historical rate charts, currency comparison, and a clean, intuitive interface with responsive design for all devices.",
        image: "/exchangeflow.png?height=200&width=350",
        tags: [
          "Next.js",
          "React Query",
          "Chart.js",
          "Tailwind CSS",
          "API Integration",
        ],
        link: "https://exchange-flow.vercel.app/",
        github: "https://github.com/ramiichr/CurrencyConverter",
        category: "web",
        featured: true,
      },
      {
        id: "weather-forecast-app",
        title: "Weather Forecast App",
        description:
          "A comprehensive weather application that provides current conditions and 7-day forecasts for any location. Features include interactive maps, hourly forecasts, air quality index, and severe weather alerts with a responsive design.",
        image: "/weather.png?height=200&width=350",
        tags: [
          "React",
          "OpenWeather API",
          "Leaflet Maps",
          "CSS Modules",
          "Responsive Design",
        ],
        link: "https://weather-forecast-liveapp.vercel.app/",
        github: "https://github.com/ramiichr/WeatherForecastApp",
        category: "web",
        featured: true,
      },
    ],
    de: [
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        description:
          "Eine moderne, responsive Portfolio-Website, entwickelt mit Next.js und TypeScript. Zu den Funktionen gehören Internationalisierung (Englisch/Deutsch), Dark/Light-Modus, Animationen mit Framer Motion und ein Dashboard für Besucheranalysen mit Redis.",
        image: "/portfolio.png?height=200&width=350",
        tags: [
          "Next.js",
          "TypeScript",
          "Framer Motion",
          "Tailwind CSS",
          "Redis",
        ],
        link: "https://rami-cheikhrouhou.vercel.app/",
        github: "https://github.com/ramiichr/myportfolio",
        category: "web",
        featured: true,
      },
      {
        id: "exchange-flow",
        title: "Exchange Flow",
        description:
          "Eine Währungsumrechner-Anwendung, die Echtzeit-Wechselkurse für über 150 Währungen bietet. Zu den Funktionen gehören historische Kursdiagramme, Währungsvergleiche und eine übersichtliche, intuitive Benutzeroberfläche mit responsivem Design für alle Geräte.",
        image: "/exchangeflow.png?height=200&width=350",
        tags: [
          "Next.js",
          "React Query",
          "Chart.js",
          "Tailwind CSS",
          "API Integration",
        ],
        link: "https://exchange-flow.vercel.app/",
        github: "https://github.com/ramiichr/CurrencyConverter",
        category: "web",
        featured: true,
      },
      {
        id: "weather-forecast-app",
        title: "Weather Forecast App",
        description:
          "Eine umfassende Wetter-Anwendung, die aktuelle Bedingungen und 7-Tage-Vorhersagen für jeden Ort bietet. Zu den Funktionen gehören interaktive Karten, stündliche Vorhersagen, Luftqualitätsindex und Unwetterwarnungen mit einem responsiven Design.",
        image: "/weather.png?height=200&width=350",
        tags: [
          "React",
          "OpenWeather API",
          "Leaflet Maps",
          "CSS Modules",
          "Responsive Design",
        ],
        link: "https://weather-forecast-liveapp.vercel.app/",
        github: "https://github.com/ramiichr/WeatherForecastApp",
        category: "web",
        featured: true,
      },
    ],
  },
  skills: [
    { name: "HTML5", icon: "html5", category: "frontend" },
    { name: "CSS3", icon: "css3", category: "frontend" },
    { name: "SASS/SCSS", icon: "sass", category: "frontend" },
    { name: "Bootstrap", icon: "bootstrap5", category: "frontend" },
    { name: "Tailwind CSS", icon: "tailwindcss", category: "frontend" },
    { name: "JavaScript", icon: "js", category: "frontend" },
    { name: "TypeScript", icon: "typescript", category: "frontend" },
    { name: "React", icon: "reactjs", category: "frontend" },
    { name: "Next.js", icon: "nextjs2", category: "frontend" },
    { name: "Vue.js", icon: "vuejs", category: "frontend" },
    { name: "Node.js", icon: "nodejs", category: "backend" },
    { name: "Express.js", icon: "", category: "backend" },
    { name: "PHP 8", icon: "php", category: "backend" },
    { name: "Symfony", icon: "", category: "backend" },
    { name: "Ruby on Rails", icon: "ruby", category: "backend" },
    { name: "Redis", icon: "redis", category: "backend" },
    { name: "MySQL", icon: "mysql", category: "backend" },
    { name: "Docker", icon: "docker", category: "backend" },
    { name: "Git", icon: "git", category: "tools" },
    { name: "GitHub", icon: "github", category: "tools" },
    { name: "Jira", icon: "jira", category: "tools" },
    { name: "Bitbucket", icon: "bitbucket", category: "tools" },
    { name: "VS Code", icon: "vscode", category: "tools" },
    { name: "Linux", icon: "linux", category: "tools" },
    { name: "Figma", icon: "figma", category: "tools" },
  ],
  experiences: {
    en: [
      {
        position: "Frontend Developer (Working Student)",
        company: "German eTrade GmbH",
        period: "Mar 2021 - Dec 2024",
        location: "Dresden, Germany",
        description: [
          "Development of user-friendly and responsive single-page applications (SPA) with React.js and JavaScript.",
          "Implementation of appealing and intuitive user interfaces, taking into account UX/UI principles and mobile-first approaches with SCSS/SASS and HTML5.",
          "Optimization and further development of existing applications with a focus on performance, scalability and user-friendliness.",
          "Ensuring high code quality through clean code principles, code reviews and automated testing.",
          "Use of modern build and deployment tools (Docker, Bitbucket, Git, Jira) to ensure an efficient development process.",
          "Work closely with designers and backend developers to optimize the application architecture and technical implementation of UI/UX concepts.",
          "Active contribution to the implementation of new features and the continuous improvement of development processes.",
        ],
      },
      {
        position: "Internship for Bachelor Thesis",
        company: "AISA (Tunisair Group)",
        period: "Jan 2016 - Jun 2016",
        location: "Tunis, Tunisia",
        description: [
          "Development of a web application for the billing of services used at Tunis Airport.",
          "Modeling and development of a software for the planning and responsible organization of the logistical organization of employees, availability, management requests and the allocation of tangible and intangible resources.",
          "The project is based on PHP OOP and MVC model architecture",
        ],
      },
    ],
    de: [
      {
        position: "Frontend Entwickler (Werkstudent)",
        company: "German eTrade GmbH",
        period: "Mär 2021 - Dez 2024",
        location: "Dresden, Deutschland",
        description: [
          "Entwicklung benutzerfreundlicher und responsiver Single-Page-Applications (SPA) mit React.js und JavaScript.",
          "Umsetzung ansprechender und intuitiver Benutzeroberflächen unter Berücksichtigung von UX/UI-Prinzipien sowie Mobile-First-Ansätzen mit SCSS/SASS und HTML5.",
          "Optimierung und Weiterentwicklung bestehender Anwendungen mit Fokus auf Performance, Skalierbarkeit und Benutzerfreundlichkeit.",
          "Sicherstellung hoher Code-Qualität durch Clean Code-Prinzipien, Code-Reviews und automatisiertes Testen.",
          "Nutzung moderner Build- und Deployment-Tools (Docker, Bitbucket, Git, Jira) zur Sicherstellung eines effizienten Entwicklungsprozesses.",
          "Enge Zusammenarbeit mit Designern und Backend-Entwicklern zur Optimierung der Anwendungsarchitektur und technischen Umsetzung von UI/UX-Konzepten.",
          "Aktive Beteiligung an der Implementierung neuer Features und der kontinuierlichen Verbesserung von Entwicklungsprozessen.",
        ],
      },
      {
        position: "Praktikum zur Bachelorarbeit",
        company: "AISA (Tunisair Group)",
        period: "Jan 2016 - Jun 2016",
        location: "Tunis, Tunesien",
        description: [
          "Entwicklung einer Webanwendung zur Abrechnung der am Flughafen Tunis in Anspruch genommenen Dienstleistungen. ",
          "Modellierung und Entwicklung einer Software zur Planung und verantwortlichen Organisation der logistischen Organisation der Mitarbeiter, der Verfügbarkeit, der Managementanfragen und der Zuordnung von materiellen und immateriellen Ressourcen. ",
          "Das Projekt basiert auf PHP OOP und MVC Modellarchitektur",
        ],
      },
    ],
  },
  education: {
    en: [
      {
        degree: "Master of Science in Media Informatics",
        institution: "Technische Hochschule Köln",
        period: "Mar 2019 - Oct 2023",
        location: "Cologne, Germany",
        description: [
          "Focus: Weaving the Web",
          "Topic of the Master's thesis: Decentralized Social Media App in Web 3.0",
          "Grade of the Master's thesis: 3.0 (satisfactory)",
          "Grade of the colloquium: 2.7 (satisfactory)",
          "Overall grade: 2.7 (satisfactory)",
        ],
      },
      {
        degree: "Bachelor of Science in Informatics",
        institution:
          "Institut supérieur des sciences appliquées et de la technologie de Mateur",
        period: "Sep 2013 - Jun 2016",
        location: "Mateur, Tunisia",
        description: [
          "Focus: Computer systems and software ",
          "Topic of the Bachelor's thesis: Development of a web application for billing services used at Tunis-Carthage Airport. ",
          "Overall grade: (16/20) (2.5: good)",
        ],
      },
      {
        degree: "Baccalaureate in Computer Science (Abitur)",
        institution: "Lycée Route de Tabarka",
        period: "Sep 2009 - Jun 2013",
        location: "Mateur, Tunisia",
        description: [
          "Acquired knowledge: HTML, CSS, JavaScript, PHP, MySQL, Microsoft Access 2007, algorithms and data structures",
        ],
      },
    ],
    de: [
      {
        degree: "Master of Science in Medieninformatik",
        institution: "Technische Hochschule Köln",
        period: "Mär 2019 - Okt 2023",
        location: "Köln, Deutschland",
        description: [
          "Schwerpunkt: Weaving the Web ",
          "Thema der Masterarbeit: Dezentralisierte Social Media App im Web 3.0 ",
          "Note der Masterarbeit: 3,0 (befriedigend)",
          "Note des Kolloquiums: 2,7 (befriedigend) ",
          "Gesamtnote: 2,7 (befriedigend)",
        ],
      },
      {
        degree: "Bachelor of Science in Informatik",
        institution:
          "Institut supérieur des sciences appliquées et de la technologie de Mateur",
        period: "Sep 2013 - Jun 2016",
        location: "Mateur, Tunesien",
        description: [
          "Schwerpunkt: Computersysteme und Software ",
          "Thema der Bachelor-Thesis: Entwicklung einer Webanwendung zur Abrechnung der am Flughafen Tunis-Carthage in Anspruch genommenen Dienstleistungen. ",
          "Gesamtnote: (16/20) (2,5: gut)",
        ],
      },
      {
        degree: "Baccalaureate in Computerwissenschaften (Abitur)",
        institution: "Lycée Route de Tabarka",
        period: "Sep 2009 - Jun 2013",
        location: "Mateur, Tunesien",
        description: [
          "Erworbene Kenntnisse: HTML, CSS, JavaScript, PHP, MySQL, Microsoft Access 2007, Algorithmen und Datenstrukturen",
        ],
      },
    ],
  },
};
