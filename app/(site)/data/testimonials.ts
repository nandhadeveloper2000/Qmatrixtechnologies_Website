export type Testimonial = {
  name: string;
  role: string;
  review: string;
  rating?: number;
};

export const testimonials: Testimonial[] = [
  {
    name: "Vengadesh",
    role: "Snowflake Data Engineer",
    review:
      "I completed the Snowflake Data Engineer training and found the sessions easy to understand. The trainer explained concepts clearly with real-time examples. It was a great learning experience and helped boost my career growth.",
    rating: 5,
  },
  {
    name: "Bhuvana",
    role: "Data Engineer Trainee",
    review:
      "The training was well-structured with clear explanations and hands-on Snowflake practice. The real-time scenarios helped me gain strong practical knowledge.",
    rating: 5,
  },
  {
    name: "Yadhav",
    role: "Data Engineering Student",
    review:
      "The course focused on practical Snowflake concepts with hands-on sessions. It was a valuable experience that improved my confidence in data engineering.",
    rating: 5,
  },
  {
    name: "Prasanth",
    role: "Digital Marketing Executive",
    review:
      "I chose WHY TAP for my Digital Marketing course, and I'm so glad I did! The training provided was top-notch, with practical insights into real-world strategies. The hands-on projects and live sessions helped me understand the latest trends and build confidence.",
    rating: 5,
  },
];