'use client';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2 ${sizes[size]}`}>
      <div className="relative">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-berlin-gold to-berlin-gold-dark flex items-center justify-center">
          <span className="text-berlin-black font-black text-sm md:text-base">B</span>
        </div>
      </div>
      <span className="font-bold tracking-tight">
        <span className="text-berlin-gold">Berlin</span>
        <span className="opacity-80"> Wallet</span>
      </span>
    </div>
  );
}
