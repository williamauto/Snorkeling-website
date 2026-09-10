const BUBBLES = [
  { left: '4%', size: 8, duration: 11, delay: 0, drift: 18 },
  { left: '12%', size: 5, duration: 14, delay: 2, drift: -22 },
  { left: '20%', size: 11, duration: 9, delay: 4, drift: 12 },
  { left: '29%', size: 6, duration: 16, delay: 1, drift: -14 },
  { left: '38%', size: 9, duration: 12, delay: 6, drift: 26 },
  { left: '47%', size: 5, duration: 15, delay: 3, drift: -18 },
  { left: '56%', size: 12, duration: 10, delay: 5, drift: 10 },
  { left: '65%', size: 7, duration: 13, delay: 0.5, drift: -24 },
  { left: '74%', size: 10, duration: 17, delay: 7, drift: 16 },
  { left: '83%', size: 6, duration: 11, delay: 2.5, drift: -12 },
  { left: '91%', size: 9, duration: 14, delay: 5.5, drift: 20 },
  { left: '97%', size: 5, duration: 9, delay: 1.5, drift: -16 },
];

export default function Bubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="wfc-bubble"
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--drift': `${b.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
