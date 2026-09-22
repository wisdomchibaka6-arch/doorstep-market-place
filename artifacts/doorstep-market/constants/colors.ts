/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Doorstep Market brand palette
    text: '#102348',
    tint: '#2D66C8',

    // Core surfaces
    background: '#F7F9FD',
    foreground: '#102348',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#102348',

    // Primary action color (buttons, links, active states)
    primary: '#2D66C8',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#EAF1FE',
    secondaryForeground: '#1C4C9B',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#F1F4F9',
    mutedForeground: '#71809A',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#DDEAFF',
    accentForeground: '#1C4C9B',

    // Destructive actions (delete, error states)
    destructive: '#D94F61',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#D8E1EF',
    input: '#CBD7E8',

    navy: '#102348',
    blue: '#2D66C8',
    softBlue: '#EAF1FE',
    green: '#1B9B68',
    yellow: '#F2B134',
    pink: '#E96A83',
    purple: '#805BC8',
    cyan: '#41A7D8',
    orange: '#F09A43',
    surfaceBlue: '#F1F6FF',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
