export function SpotlightBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute right-0 top-40 h-[300px] w-[300px] rounded-full bg-orange-500/20 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[100px]" />
    </div>
  );
}