import type { SVGProps } from "react";
import type { EscaleId } from "@/lib/escales";
import type { BadgeId } from "@/lib/badges";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconArrowRight = (p: P) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const IconArrowLeft = (p: P) => <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
export const IconCheck = (p: P) => <Svg {...p}><path d="M5 12l5 5 9-10" /></Svg>;
export const IconHome = (p: P) => <Svg {...p}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></Svg>;
export const IconMap = (p: P) => <Svg {...p}><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></Svg>;
export const IconScreen = (p: P) => <Svg {...p}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M7 9l3 2-3 2M12 13h4" /></Svg>;
export const IconChart = (p: P) => <Svg {...p}><path d="M6 21V11M12 21V4M18 21v-7" /></Svg>;
export const IconFlag = (p: P) => <Svg {...p}><path d="M4 21V4h13l-2 4 2 4H4" /></Svg>;
export const IconInfo = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>;
export const IconAlert = (p: P) => <Svg {...p}><path d="M12 3l10 18H2z" /><path d="M12 10v4M12 17h.01" /></Svg>;
export const IconLock = (p: P) => <Svg {...p}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Svg>;
export const IconClock = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const IconPaperclip = (p: P) => <Svg {...p}><path d="M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8" /></Svg>;
export const IconPlay = (p: P) => <Svg {...p}><path d="M7 4l13 8-13 8z" /></Svg>;
export const IconLogout = (p: P) => <Svg {...p}><path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11" /></Svg>;

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" stroke="var(--signal)" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="17" cy="7" r="3.2" />
      <path d="M17 10.2V29" />
      <path d="M10 15h14" />
      <path d="M5 20c0 5.5 5.4 9 12 9s12-3.5 12-9" />
      <path d="M3 22l2-2 2 2M27 22l2-2 2 2" />
    </svg>
  );
}

export function EscaleIcon({ escale, ...p }: P & { escale: EscaleId }) {
  switch (escale) {
    case "usine":
      return <Svg strokeWidth={1.6} {...p}><path d="M3 20V10l5 3V10l5 3V6h3v14z" /><path d="M17 6V3h2v17" /><path d="M2 20h20" /></Svg>;
    case "atelier":
      return <Svg strokeWidth={1.6} {...p}><rect x="6" y="8" width="12" height="10" rx="2" /><path d="M12 8V4" /><circle cx="12" cy="3.5" r="1" /><circle cx="9.5" cy="12.5" r="1" /><circle cx="14.5" cy="12.5" r="1" /><path d="M3 12v3M21 12v3" /></Svg>;
    case "centrale":
      return <Svg strokeWidth={1.6} {...p}><path d="M13 2 5 14h6l-1 8 8-12h-6z" /></Svg>;
    case "chantier":
      return <Svg strokeWidth={1.6} {...p}><path d="M4 21V5h10" /><path d="M4 5h10l6 4" /><path d="M14 5v4" /><path d="M17 9v5" /><rect x="15" y="14" width="4" height="3" /><path d="M2 21h20" /></Svg>;
    default:
      return <Svg strokeWidth={1.6} {...p}><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></Svg>;
  }
}

export function BadgeIcon({ badge, ...p }: P & { badge: BadgeId }) {
  switch (badge) {
    case "premiers-pas":
      return <Svg {...p}><path d="M4 21V4h13l-2 4 2 4H4" /></Svg>;
    case "socle":
      return <Svg {...p}><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></Svg>;
    case "escale-bouclee":
      return <Svg {...p}><circle cx="12" cy="5" r="2.5" /><path d="M12 7.5V21M7 11h10M4 15c0 3.5 3.6 6 8 6s8-2.5 8-6" /></Svg>;
    case "sans-faute":
      return <Svg {...p}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></Svg>;
    case "explorateur":
      return <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></Svg>;
    case "laborantin":
      return <Svg {...p}><path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3" /><path d="M7 15h10" /></Svg>;
    case "capitaine":
      return <Svg {...p}><path d="M3 9l4 3 5-7 5 7 4-3-2 10H5z" /></Svg>;
  }
}
