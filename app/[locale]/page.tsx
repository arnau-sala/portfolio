// Generate static params for all supported locales
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ca' }
  ];
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Hello, I'm Arnau Sala Araujo
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Computer Science Student
        </p>
        <p className="text-gray-400">
          Portfolio is working!
        </p>
      </div>
    </div>
  );
}