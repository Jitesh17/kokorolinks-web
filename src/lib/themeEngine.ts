export function getThemeVariables(themeConfig: any) {
  const palette = themeConfig?.palette || {};
  const typography = themeConfig?.typography || {};

  return {
    "--color-primary": palette.primary || "#8b0000",
    "--color-bg": palette.secondary || "#ffffff",
    "--color-text": palette.text || "#171717",
    "--font-heading": typography.heading === 'script' 
        ? '"Great Vibes", cursive' 
        : '"Cormorant Garamond", serif',
  };
}