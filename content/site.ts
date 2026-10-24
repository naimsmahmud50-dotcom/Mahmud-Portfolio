export interface SiteConfig {
  name: string;
  roles: string[];
  tagline: string;
  location: string;
  timeZone: string;
  email: string;
  phone: string;
  socials: {
    github: string;
    linkedin: string;
    whatsapp: string;
    telegram: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Mahmud Hasan",
  roles: [
    "AI Automation Expert",
    "Full-Stack Web App Developer",
    "Android App Developer",
    "Autonomous Agent Engineer",
  ],
  tagline:
    "Architecting intelligent automation systems and high-craft digital products that scale autonomously.",
  location: "Bangladesh",
  timeZone: "Asia/Dhaka",
  // Clearly marked placeholders / verified channels
  email: "mahmudhasan.infodev@gmail.com",
  phone: "+880 1767-850859",
  socials: {
    github: "https://github.com/naimsmahmud50-dotcom",
    linkedin:
      "https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    whatsapp: "https://wa.me/8801767850859",
    telegram: "https://t.me/naimsmahmud50",
  },
};
