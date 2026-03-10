import "./globals.css";

export const metadata = {
  title: "NutriNotes | Personal Blog",
  description:
    "Personal nutrition and lifestyle blog with evidence-based articles, recipes, and wellness tips.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
