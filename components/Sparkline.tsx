"use client";

export default function Sparkline({
  values,
  color = "var(--brand)",
  height = 46,
}: {
  values: number[];
  color?: string;
  height?: number;
}) {
  const w = 380;
  const h = height;
  const pad = 3;
  if (values.length < 2) {
    return <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} />;
  }
  const max = Math.max(...values, 0.001);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 0.001);
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const last = pts[pts.length - 1];

  // Grid lines for chart paper feel
  const gridLines: React.ReactElement[] = [];
  for (let i = 1; i <= 4; i++) {
    const y = pad + (i / 5) * (h - pad * 2);
    gridLines.push(
      <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} className="sparkline-grid" />
    );
  }
  for (let i = 1; i <= 8; i++) {
    const x = pad + (i / 9) * (w - pad * 2);
    gridLines.push(
      <line key={`v${i}`} x1={x} y1={pad} x2={x} y2={h - pad} className="sparkline-grid" />
    );
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden>
      {gridLines}
      <polygon points={area} fill={color} opacity="0.12" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}