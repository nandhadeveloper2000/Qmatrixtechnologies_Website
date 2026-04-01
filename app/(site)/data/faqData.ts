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
        q: "What is qmatrix Technologies?",
        a: "qmatrix Technologies provides industry-focused training in Snowflake Data Engineering with strong placement support.",
      },
      {
        q: "What course do you offer?",
        a: "We offer a Snowflake Data Engineer course covering SQL, ETL, cloud basics, and real-time projects.",
      },
      {
        q: "Who can join this course?",
        a: "Freshers, graduates, and working professionals looking to enter data engineering can join.",
      },
      {
        q: "Is prior coding knowledge required?",
        a: "Basic SQL knowledge is helpful but not mandatory. We start from fundamentals.",
      },
      {
        q: "What is the course duration?",
        a: "The course duration is typically 2–3 months depending on the batch.",
      },
      {
        q: "Do you provide certification?",
        a: "Yes, we provide a course completion certificate.",
      },
      {
        q: "Is the training online or offline?",
        a: "We offer both online and offline training options.",
      },
    ],
  },

  {
    id: "support",
    label: "Support Team",
    items: [
      {
        q: "How can I contact qmatrix support?",
        a: "You can reach us via phone, email, or through our website contact form.",
      },
      {
        q: "Do you provide doubt support?",
        a: "Yes, we provide full-time doubt clarification support.",
      },
      {
        q: "Is mentor guidance available?",
        a: "Yes, experienced mentors guide you throughout the course.",
      },
      {
        q: "Do you provide interview support?",
        a: "Yes, we provide interview preparation, mock interviews, and guidance.",
      },
      {
        q: "Are recorded sessions available?",
        a: "Yes, all sessions are recorded for future reference.",
      },
      {
        q: "Do you provide project assistance?",
        a: "Yes, we assist you with real-time projects.",
      },
      {
        q: "Is support available after course completion?",
        a: "Yes, we provide post-training support.",
      },
    ],
  },

  {
    id: "course",
    label: "Course & Training",
    items: [
      {
        q: "What topics are covered in the course?",
        a: "Snowflake, SQL, ETL, dbt, AWS basics, and real-time industry scenarios.",
      },
      {
        q: "Do you provide real-time projects?",
        a: "Yes, hands-on real-time projects are included.",
      },
      {
        q: "Will I get practical experience?",
        a: "Yes, the course is focused on practical learning and implementation.",
      },
      {
        q: "Is the course beginner-friendly?",
        a: "Yes, we start from basics and progress to advanced topics.",
      },
      {
        q: "Do you teach cloud concepts?",
        a: "Yes, AWS and cloud fundamentals are included.",
      },
      {
        q: "Is this course job-oriented?",
        a: "Yes, the course is designed to make you job-ready.",
      },
      {
        q: "Do you provide study materials?",
        a: "Yes, complete study materials are provided.",
      },
    ],
  },

  {
    id: "placement",
    label: "Placement Support",
    items: [
      {
        q: "Do you provide placement assistance?",
        a: "Yes, we provide 100% placement support with guidance and opportunities.",
      },
      {
        q: "Will you help with resume preparation?",
        a: "Yes, we help build professional, ATS-friendly resumes.",
      },
      {
        q: "Do you conduct mock interviews?",
        a: "Yes, regular mock interviews are conducted.",
      },
      {
        q: "Are job referrals provided?",
        a: "Yes, we share job openings and referrals.",
      },
      {
        q: "What companies hire your students?",
        a: "Students are placed in leading IT and data-driven companies.",
      },
      {
        q: "How long does it take to get a job?",
        a: "Typically within a few months depending on performance.",
      },
      {
        q: "Do you guarantee placement?",
        a: "We provide strong placement support and career guidance.",
      },
    ],
  },

  {
    id: "why-us",
    label: "Why Choose Us",
    items: [
      {
        q: "Why choose qmatrix Technologies?",
        a: "We provide industry-focused training, real-time projects, and strong placement support.",
      },
      {
        q: "Are trainers experienced?",
        a: "Yes, all trainers are industry experts.",
      },
      {
        q: "Do you provide real-time scenarios?",
        a: "Yes, we focus on real-world use cases.",
      },
      {
        q: "Is the course updated?",
        a: "Yes, content is regularly updated with latest technologies.",
      },
      {
        q: "Do you offer flexible timings?",
        a: "Yes, flexible batch timings are available.",
      },
      {
        q: "Is this course suitable for career switch?",
        a: "Yes, it is ideal for transitioning into data engineering.",
      },
      {
        q: "What is the success rate of students?",
        a: "Many of our students successfully get placed in IT roles.",
      },
    ],
  },
];