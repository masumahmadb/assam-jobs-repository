// Design Tokens - Single source of truth for the design system
// All components should reference these tokens

export const colors = {
  // Primary brand colors (tea theme)
  tea: {
    50: '#faf9f7',
    100: '#f0ece6',
    200: '#e1d7cb',
    300: '#cdbfa6',
    400: '#b09d7b',
    500: '#9a8258',
    600: '#7d673e',  // Primary
    700: '#63512f',  // Primary hover
    800: '#4f4128',
    900: '#3d331f',  // Primary text
  },

  // Accent colors (muga - golden silk)
  muga: {
    50: '#fff8ed',
    100: '#ffefd6',
    200: '#ffdeac',
    300: '#ffc770',
    400: '#ffaf33',
    500: '#e6a01a',  // Primary accent
    600: '#d48b0e',  // Hover
    700: '#b06a0c',
    800: '#8d530c',
    900: '#71440e',
  },

  // Gamosa colors (red accent)
  gamosa: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Error/destructive
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Sand/cream backgrounds
  sand: {
    50: '#fdfcf9',
    100: '#f9f5f0',
    200: '#f0e9e0',
    300: '#e3d9ca',
    400: '#d0c0a8',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
  },

  // Neutral
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px
  DEFAULT: '0.5rem',  // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
  // Custom
  xl2: '0.875rem',  // 14px
  xl3: '1.125rem',  // 18px
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Custom
  'tea-sm': '0 1px 2px 0 rgb(125 103 62 / 0.1)',
  'tea-md': '0 4px 6px -1px rgb(125 103 62 / 0.1)',
  'tea-lg': '0 10px 15px -3px rgb(125 103 62 / 0.1)',
};

export const typography = {
  fontFamily: {
    display: ['Noto Sans', 'system-ui', 'sans-serif'],
    body: ['Noto Sans', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
};

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Semantic color mappings for easy use
export const semanticColors = {
  // Backgrounds
  bg: {
    primary: 'white',
    secondary: 'colors.sand.50',
    tertiary: 'colors.sand.100',
    inverted: 'colors.tea.900',
    subtle: 'colors.tea.50',
    hover: 'colors.tea.100',
    active: 'colors.tea.200',
  },
  // Text
  text: {
    primary: 'colors.tea.900',
    secondary: 'colors.tea.600',
    muted: 'colors.tea.400',
    inverse: 'white',
    link: 'colors.tea.600',
    linkHover: 'colors.tea.700',
    disabled: 'colors.tea.400',
  },
  // Borders
  border: {
    default: 'colors.tea.200',
    strong: 'colors.tea.300',
    focus: 'colors.tea.500',
    error: 'colors.gamosa.500',
    success: 'colors.success.500',
  },
  // Interactive
  interactive: {
    primary: {
      bg: 'colors.tea.600',
      bgHover: 'colors.tea.700',
      bgActive: 'colors.tea.800',
      text: 'white',
    },
    secondary: {
      bg: 'colors.tea.100',
      bgHover: 'colors.tea.200',
      bgActive: 'colors.tea.300',
      text: 'colors.tea.900',
    },
    outline: {
      bg: 'transparent',
      border: 'colors.tea.600',
      text: 'colors.tea.700',
      bgHover: 'colors.tea.50',
      textHover: 'colors.tea.700',
    },
    ghost: {
      bg: 'transparent',
      text: 'colors.tea.700',
      bgHover: 'colors.tea.100',
      textHover: 'colors.tea.900',
    },
    destructive: {
      bg: 'colors.gamosa.500',
      bgHover: 'colors.gamosa.600',
      bgActive: 'colors.gamosa.700',
      text: 'white',
    },
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  transitions,
  breakpoints,
  zIndex,
  animation,
  semanticColors,
};