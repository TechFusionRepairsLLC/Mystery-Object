import './globals.css';

export const metadata = {
  title: 'Mystery Object',
  description: 'Daily puzzle game where players guess the object from clue images.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
