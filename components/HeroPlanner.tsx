'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeroPlanner({ regionNames }: { regionNames: string[] }) {
  const router = useRouter();
  const [region, setRegion] = useState('all');
  const [access, setAccess] = useState('all');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region !== 'all') params.set('region', region);
    if (access !== 'all') params.set('access', access);
    router.push(`/compare/${params.toString() ? '?' + params.toString() : ''}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Plan a snorkeling trip"
      className="mt-11 grid max-w-2xl grid-cols-1 gap-2.5 rounded-[20px] border border-white/20 bg-[#082a2d]/45 p-3.5 backdrop-blur-sm sm:grid-cols-[1.2fr_1fr_auto] sm:items-center sm:p-2.5"
    >
      <label className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 sm:border-r sm:border-white/15">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 opacity-85">
          <path
            d="M9 16s5.5-5.1 5.5-9A5.5 5.5 0 0 0 3.5 7c0 3.9 5.5 9 5.5 9Z"
            stroke="#EAFBF8"
            strokeWidth="1.6"
          />
          <circle cx="9" cy="7" r="1.8" stroke="#EAFBF8" strokeWidth="1.6" />
        </svg>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full appearance-none bg-transparent text-sm font-semibold text-[#F5FDFB]"
        >
          <option className="text-ink" value="all">
            Anywhere on the coast
          </option>
          {regionNames.map((r) => (
            <option key={r} className="text-ink" value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 opacity-85">
          <circle cx="8" cy="8" r="5.5" stroke="#EAFBF8" strokeWidth="1.6" />
          <path d="M12.2 12.2 16 16" stroke="#EAFBF8" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <select
          value={access}
          onChange={(e) => setAccess(e.target.value)}
          className="w-full appearance-none bg-transparent text-sm font-semibold text-[#F5FDFB]"
        >
          <option className="text-ink" value="all">
            Any access type
          </option>
          <option className="text-ink" value="shore">
            Shore, walk right in
          </option>
          <option className="text-ink" value="boat">
            Boat access
          </option>
          <option className="text-ink" value="tour_required">
            Tour required
          </option>
        </select>
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-5 py-3.5 text-sm font-bold text-[#241009] transition hover:-translate-y-0.5"
      >
        Find a spot
      </button>
    </form>
  );
}
