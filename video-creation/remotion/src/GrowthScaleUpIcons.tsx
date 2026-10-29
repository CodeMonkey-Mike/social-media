// GrowthScaleUpIcons.tsx: the project's own flat icons + seat tag for the kinetic-text devices of growth-scale-up
// (the kt-icon-pop engine takes the art as a React node; the 2023 artwork does not survive). Built here to the device
// rows' numbers, palette = COVER-PLAN chapter_themes (seat A cyan #00c2ff TEAM OF ONE, seat B gold #ffd700 TEAM OF FIVE).
import React from 'react';

export const SEAT_A = '#00c2ff';
export const SEAT_B = '#ffd700';
export const SEAT_A_LIGHT = '#006A9E';
export const SEAT_B_LIGHT = '#8a6d00';

const blob = (c: string) => (
  <circle cx="50" cy="50" r="48" fill="rgba(20,24,28,0.55)" stroke={c} strokeWidth="3" />
);

export const OnePersonIcon: React.FC<{ color?: string }> = ({ color = SEAT_A }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    {blob(color)}
    <circle cx="50" cy="36" r="13" fill={color} />
    <path d="M26 76 C26 58 74 58 74 76 Z" fill={color} />
  </svg>
);

export const FivePeopleIcon: React.FC<{ color?: string }> = ({ color = SEAT_B }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    {blob(color)}
    {[
      [22, 46, 7],
      [36, 40, 8],
      [50, 36, 9.5],
      [64, 40, 8],
      [78, 46, 7],
    ].map(([x, y, r], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={r} fill={color} />
        <path d={`M${x - r * 1.6} ${y + r * 3.4} C${x - r * 1.6} ${y + r * 1.4} ${x + r * 1.6} ${y + r * 1.4} ${x + r * 1.6} ${y + r * 3.4} Z`} fill={color} />
      </g>
    ))}
  </svg>
);

export const CalendarIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    {blob('#ffffff')}
    <rect x="24" y="28" width="52" height="46" rx="6" fill="#ffffff" />
    <rect x="24" y="28" width="52" height="13" rx="6" fill="#E70001" />
    <rect x="33" y="21" width="5" height="13" rx="2" fill="#ffffff" />
    <rect x="62" y="21" width="5" height="13" rx="2" fill="#ffffff" />
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={30 + c * 11} y={46 + r * 9} width="7" height="6" rx="1" fill={r === 1 && c === 2 ? '#E70001' : '#9aa3ad'} />))}
  </svg>
);

export const AgentIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    {blob('#ffffff')}
    <rect x="28" y="34" width="44" height="34" rx="9" fill="#ffffff" />
    <circle cx="41" cy="50" r="5" fill={SEAT_A} />
    <circle cx="59" cy="50" r="5" fill={SEAT_A} />
    <rect x="47" y="22" width="6" height="12" fill="#ffffff" />
    <circle cx="50" cy="20" r="5" fill={SEAT_A} />
    <rect x="40" y="60" width="20" height="3" rx="1.5" fill="#33404d" />
    <rect x="20" y="44" width="7" height="14" rx="3" fill="#ffffff" />
    <rect x="73" y="44" width="7" height="14" rx="3" fill="#ffffff" />
  </svg>
);

export const FunnelIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    {blob('#ffffff')}
    <path d="M22 28 H78 L58 54 V74 L42 80 V54 Z" fill="#ffffff" />
    <rect x="22" y="28" width="56" height="7" fill={SEAT_A} />
    <rect x="32" y="41" width="36" height="5" fill={SEAT_A} opacity="0.7" />
  </svg>
);

export const LifebuoyIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="50" r="40" fill="none" stroke="#E70001" strokeWidth="20" />
    {[45, 135, 225, 315].map((a) => (
      <path
        key={a}
        d="M50 10 A40 40 0 0 1 64 12.5 L60 22.5 A30 30 0 0 0 50 20 Z"
        transform={`rotate(${a - 10} 50 50)`}
        fill="#ffffff"
      />
    ))}
    <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff" strokeWidth="20" strokeDasharray="20 42.8" strokeDashoffset="10" />
    <circle cx="50" cy="50" r="50" fill="none" stroke="#33404d" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="#33404d" strokeWidth="1.5" />
  </svg>
);

/** A seat tag (KT-ICON 'seat tag TEAM OF ONE / FIVE'): a dark pill with the seat icon and label in the seat accent. */
export const SeatTag: React.FC<{ seat: 'one' | 'five' }> = ({ seat }) => {
  const c = seat === 'one' ? SEAT_A : SEAT_B;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 30px 0 14px',
        boxSizing: 'border-box',
        borderRadius: 999,
        background: 'rgba(8,14,18,0.82)',
        border: `4px solid ${c}`,
        boxShadow: '5px 6px 14px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ width: 92, height: 92, flex: 'none' }}>{seat === 'one' ? <OnePersonIcon /> : <FivePeopleIcon />}</div>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          fontStyle: 'italic',
          fontSize: 50,
          color: c,
          whiteSpace: 'nowrap',
          letterSpacing: 1,
          textShadow: '3px 4px 6px rgba(0,0,0,0.6)',
        }}
      >
        {seat === 'one' ? 'TEAM OF ONE' : 'TEAM OF FIVE'}
      </div>
    </div>
  );
};
