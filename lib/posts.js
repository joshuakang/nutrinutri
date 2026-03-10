const posts = [
  {
    slug: "high-protein-breakfasts-that-keep-you-full",
    title: "7 High-Protein Breakfasts That Keep You Full",
    excerpt: "Simple breakfast formulas to hit your protein target before noon.",
    topic: "Meal Planning",
    date: "2026-02-22",
    readTime: "6 min",
    content: [
      "Protein at breakfast helps reduce appetite later in the day and improves total daily protein distribution.",
      "Build each meal around one clear anchor: eggs, Greek yogurt, cottage cheese, tofu scramble, or a whey blend.",
      "Pair your protein source with high-fiber carbs and produce for slower digestion and better satiety.",
      "Use repeatable formulas so busy mornings still support your goals without relying on willpower.",
    ],
  },
  {
    slug: "creatine-for-women-benefits-safety-and-dosage",
    title: "Creatine for Women: Benefits, Safety, and Dosage",
    excerpt: "What current studies suggest about performance, recovery, and cognition.",
    topic: "Supplements",
    date: "2026-02-14",
    readTime: "8 min",
    content: [
      "Creatine monohydrate has strong evidence for improved high-intensity performance and training adaptations.",
      "The most practical protocol is 3-5 grams daily, with or without a loading phase depending on urgency.",
      "Hydration, consistent use, and buying third-party tested products are the main implementation details.",
      "For most healthy adults, safety data supports long-term use at recommended doses.",
    ],
  },
  {
    slug: "build-a-fat-loss-plate-without-tracking-calories",
    title: "How to Build a Fat Loss Plate (Without Tracking Every Calorie)",
    excerpt: "A visual plate method using fiber, protein, and volume foods.",
    topic: "Weight Management",
    date: "2026-01-29",
    readTime: "7 min",
    content: [
      "Start with half a plate of non-starchy vegetables to add volume and improve meal satisfaction.",
      "Add a palm-sized lean protein source and one cupped handful of quality carbohydrate.",
      "Use fats intentionally, not accidentally: one thumb-sized portion is enough for flavor and adherence.",
      "This structure works because it guides portions while preserving flexibility for different cuisines.",
    ],
  },
  {
    slug: "pre-workout-nutrition-timing-for-busy-schedules",
    title: "Pre-Workout Nutrition Timing for Busy Schedules",
    excerpt: "Practical fueling timing windows for morning and evening training.",
    topic: "Sports Nutrition",
    date: "2026-01-16",
    readTime: "5 min",
    content: [
      "For sessions under 60 minutes, a light carb-based snack 30-60 minutes prior is often enough.",
      "Longer or harder sessions benefit from carbs plus some protein 60-120 minutes before training.",
      "When training early, prioritize digestibility and convenience over complexity.",
      "The best timing strategy is the one you can repeat across your real calendar.",
    ],
  },
  {
    slug: "the-fiber-gap-why-most-adults-miss-the-mark",
    title: "The Fiber Gap: Why Most Adults Miss the Mark",
    excerpt: "How to add 10g extra fiber daily with low-effort food swaps.",
    topic: "Gut Health",
    date: "2025-12-21",
    readTime: "6 min",
    content: [
      "Most adults consume far less than recommended fiber targets due to refined-food-heavy routines.",
      "Simple swaps like beans, berries, oats, and seeded bread can close the gap quickly.",
      "Increase intake gradually and hydrate well to minimize digestive discomfort.",
      "A consistent 8-10 gram increase can improve satiety, regularity, and long-term cardiometabolic health markers.",
    ],
  },
  {
    slug: "reading-supplement-labels-without-getting-misled",
    title: "Reading Supplement Labels Without Getting Misled",
    excerpt: "A quick checklist to evaluate ingredient forms and dosage quality.",
    topic: "Supplements",
    date: "2025-12-04",
    readTime: "9 min",
    content: [
      "Start by checking active ingredient dose against evidence-based ranges, not marketing claims.",
      "Identify ingredient forms, since bioavailability can vary substantially across compounds.",
      "Look for third-party certification to reduce contamination and label-accuracy risk.",
      "Skip proprietary blends that hide exact amounts needed for informed decisions.",
    ],
  },
];

export function getPosts() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function getAllTopics() {
  return [...new Set(posts.map((post) => post.topic))];
}
