// lib/Spinner.tsx
export default function Spinner({ size = 6 }: { size?: number }) {
  // size in Tailwind units, default is 6 => w-6 h-6
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30">
      <div
        className={`w-${size} h-${size} border-2 border-red-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
}
