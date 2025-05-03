const tintColorLight = '#2D8EFF'; // clean transit blue
const tintColorDark = '#60AFFF'; // soft glowing blue for dark mode

export const Colors = {
  light: {
    text: '#1C1C1E', // near-black for legibility
    background: '#F4F6F8', // soft light grey, easy on eyes
    tint: tintColorLight, // for links, active buttons
    icon: '#6C737A', // muted grey for icons
    tabIconDefault: '#A0A5AA', // neutral icon color
    tabIconSelected: tintColorLight,
    card: '#FFFFFF', // cards or surfaces
    border: '#E1E3E6', // subtle separators
    alert: '#E63946', // for errors or delays
    success: '#2ECC71', // for on-time or success state
  },
  dark: {
    text: '#F5F7FA', // soft white
    background: '#121212', // dark but not pitch black
    tint: tintColorDark,
    icon: '#C1C7CD',
    tabIconDefault: '#7B848E',
    tabIconSelected: tintColorDark,
    card: '#1E1E1E',
    border: '#2C2C2E',
    alert: '#FF6B6B',
    success: '#28C76F',
  },
};
