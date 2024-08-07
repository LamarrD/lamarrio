// This is lamarr.io/

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <img className="w-32 h-32 rounded-full" src="/lamarr.jpeg" alt="Profile picture" />
      <h1 className="text-5xl md:text-7xl font-bold mb-4">Lamarr Henry</h1>
      <div className="flex space-x-4">
        <h2 className="p-2 rounded text-xl md:text-2xl">Builder</h2>
        <h2 className="p-2 rounded text-xl md:text-2xl">Teacher</h2>
        <h2 className="p-2 rounded text-xl md:text-2xl">Hacker</h2>
      </div>
    </div>
  );
}
