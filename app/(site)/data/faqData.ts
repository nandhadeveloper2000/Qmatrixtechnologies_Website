export type FAQItem = {
  q: string;
  a: string;
};

export type FAQCategory = {
  id: string;
  label: string;
  items: FAQItem[];
};

export const faqCategories: FAQCategory[] = [
  {
    id: "general",
    label: "General Questions",
    items: [
      {
        q: "What is the scope of Oracle and PL/SQL training?",
        a: "Oracle and PL/SQL are widely used in database management, preparing you for backend development, enterprise applications, and database administration roles.",
      },
      {
        q: "Why should I learn Snowflake?",
        a: "Snowflake is one of the most in-demand cloud data platforms, ideal for data engineering, analytics, and business intelligence careers.",
      },
      {
        q: "Which cloud platform should I choose – AWS, Azure, or GCP?",
        a: "AWS has the largest market share, Azure integrates seamlessly with Microsoft tools, and GCP excels in AI/ML. We guide you based on your career goals.",
      },
    ],
  },
  {
    id: "support",
    label: "Support team",
    items: [
      {
        q: "Does QMatrix help with placements after course completion?",
        a: "Yes, we provide resume building, mock interviews, and job placement support through strong recruiter partnerships.",
      },
      {
        q: "Do you provide mentoring during the course?",
        a: "Yes, you get trainer support, doubt-clearing sessions, and guidance for projects, interviews, and career roadmap.",
      },
    ],
  },
  {
    id: "misc",
    label: "Miscellaneous",
    items: [
      {
        q: "Do you provide UI/UX design training?",
        a: "Yes, our UI/UX training focuses on design systems, usability principles, tools, and real-world projects to build strong portfolios.",
      },
      {
        q: "How is QMatrix different from other training institutes?",
        a: "We offer real-time projects, expert mentors, structured curriculum, and dedicated placement assistance to make you industry-ready.",
      },
    ],
  },
  {
    id: "don",
    label: "Donsectetur",
    items: [
      {
        q: "Do you provide live projects?",
        a: "Yes. Each course includes hands-on tasks and real-time projects to build job-ready confidence.",
      },
    ],
  },
  {
    id: "gab",
    label: "Gabitasse",
    items: [
      {
        q: "Do you provide course recordings?",
        a: "Yes, recordings/support materials are provided based on course plan so you can revise anytime.",
      },
    ],
  },
];