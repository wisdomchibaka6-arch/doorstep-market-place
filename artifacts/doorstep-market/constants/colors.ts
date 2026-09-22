/**
 * Semantic design tokens for the mobile app.
 *
 * Doorstep brand palette — green-forward identity matching the flyer:
 *   Primary Green  #288426   (logo, buttons, highlights)
 *   Dark Green     #1E6E1D   (headlines, accents)
 *   Light Green    #A8D08D   (decorative, map pin)
 *   Dark Grey      #1A1A1A   (primary text)
 *   Off-white      #FDFDFD   (background)
 */

const colors = {
  light: {
    // Doorstep brand palette
    text: '#1A1A1A',
    tint: '#288426',

    // Core surfaces
    background: '#FDFDFD',
    foreground: '#1A1A1A',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#1A1A1A',

    // Primary action color (buttons, links, active states)
    primary: '#288426',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E8F5E8',
    secondaryForeground: '#1E6E1D',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#F0F7F0',
    mutedForeground: '#5A6B5A',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#A8D08D',
    accentForeground: '#1E6E1D',

    // Destructive actions (delete, error states)
    destructive: '#D94F61',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#C8E6C8',
    input: '#B5D8B5',

    navy: '#1A1A1A',
    blue: '#288426',
    softBlue: '#E8F5E8',
    green: '#1E6E1D',
    yellow: '#F2B134',
    pink: '#E96A83',
    purple: '#805BC8',
    cyan: '#41A7D8',
    orange: '#F09A43',
    surfaceBlue: '#E8F5E8',
  },

  // Border radius (in px).
  radius: 8,
};

export default colors;
