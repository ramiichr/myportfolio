// Define types for our API data
export interface Profile {
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
  category: "web" | "three" | "data";
  featured?: boolean;
}

export interface Skill {
  name: string;
  icon: string;
  category: "frontend" | "backend" | "tools";
}

export interface Experience {
  position: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  description: string[];
}

export interface LocalizedData {
  profile: {
    en: Profile;
    de: Profile;
  };
  projects: {
    en: Project[];
    de: Project[];
  };
  skills: Skill[];
  experiences: {
    en: Experience[];
    de: Experience[];
  };
  education: {
    en: Education[];
    de: Education[];
  };
}
