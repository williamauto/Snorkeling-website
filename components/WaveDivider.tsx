export default function WaveDivider({ fill = 'var(--bg)' }: { fill?: string }) {
  return (
    <svg
      className="absolute inset-x-0 -bottom-px z-[2] block leading-none"
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ height: 72, width: '100%' }}
    >
      <path
        d="M0,64 C240,110 480,20 720,48 C960,76 1200,96 1440,56 L1440,110 L0,110 Z"
        fill={fill}
      />
    </svg>
  );
}
