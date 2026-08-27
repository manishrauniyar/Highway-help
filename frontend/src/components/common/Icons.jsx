import React from 'react'

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IconWrap = ({ children, size = 22, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...base}>{children}</svg>
)

export const BikeIcon = (p) => <IconWrap {...p}><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M5.5 17.5 9 10h5l3 3.5h2.5" /><path d="M9 10 8 6h3" /></IconWrap>

export const CarIcon = (p) => <IconWrap {...p}><path d="M3 16v-3.5L5 8h14l2 4.5V16" /><path d="M3 16h18" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /><path d="M6 12h12" /></IconWrap>

export const BatteryIcon = (p) => <IconWrap {...p}><rect x="3" y="8" width="16" height="9" rx="1.5" /><path d="M19 11h2v3h-2" /><path d="M8 12h2l-1 2h2l-2 3" /></IconWrap>

export const PunctureIcon = (p) => <IconWrap {...p}><circle cx="12" cy="12" r="8" /><path d="M12 4v2M12 18v2M4 12h2M18 12h2" /><path d="M9 12l2 2 4-4" /></IconWrap>

export const TyreIcon = (p) => <IconWrap {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3" /></IconWrap>

export const TowingIcon = (p) => <IconWrap {...p}><path d="M2 16h6v-4H4z" /><path d="M8 16h9l3-3.5V9h-8v7" /><path d="M11 9V6h4l2 3" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></IconWrap>

export const LocationIcon = (p) => <IconWrap {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" /></IconWrap>

export const PhoneIcon = (p) => <IconWrap {...p}><path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C10 22 2 14 2 6a2 2 0 0 1 2-2z" /></IconWrap>

export const StarIcon = ({ filled, ...p }) => (
  <IconWrap {...p}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill={filled ? 'currentColor' : 'none'} />
  </IconWrap>
)

export const ShieldIcon = (p) => <IconWrap {...p}><path d="M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6z" /><path d="M9 12l2 2 4-4.5" /></IconWrap>

export const ClockIcon = (p) => <IconWrap {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></IconWrap>

export const FuelIcon = (p) => <IconWrap {...p}><path d="M5 20V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14" /><path d="M4 20h11" /><path d="M14 9h2.5L19 11.5V16a1.5 1.5 0 0 1-3 0v-1.5" /><path d="M7 6h5" /></IconWrap>

export const MenuIcon = (p) => <IconWrap {...p}><path d="M4 7h16M4 12h16M4 17h16" /></IconWrap>

export const CloseIcon = (p) => <IconWrap {...p}><path d="M6 6l12 12M18 6L6 18" /></IconWrap>

export const CheckIcon = (p) => <IconWrap {...p}><path d="M5 12.5l4.5 4.5L19 7" /></IconWrap>

export const ArrowRightIcon = (p) => <IconWrap {...p}><path d="M5 12h13M13 6l6 6-6 6" /></IconWrap>

export const AlertIcon = (p) => <IconWrap {...p}><path d="M12 3l10 18H2z" /><path d="M12 10v4" /><circle cx="12" cy="17.3" r="0.4" fill="currentColor" /></IconWrap>

export const WalletIcon = (p) => <IconWrap {...p}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14" r="1.2" fill="currentColor" /></IconWrap>

export const UserIcon = (p) => <IconWrap {...p}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></IconWrap>

export const WrenchIcon = (p) => <IconWrap {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z" /></IconWrap>

export const NavIcon = (p) => <IconWrap {...p}><path d="M3 11l17-8-8 17-2-7z" /></IconWrap>

export const iconMap = {
  bike: BikeIcon,
  car: CarIcon,
  battery: BatteryIcon,
  puncture: PunctureIcon,
  tyre: TyreIcon,
  towing: TowingIcon,
}
