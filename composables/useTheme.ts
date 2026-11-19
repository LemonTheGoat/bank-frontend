export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'securebank-theme';

export const useTheme = () => {
  const theme = useState<Theme>('theme', () => 'dark');

  // Reads the saved choice on the client before the first render; dark when nothing is stored
  const initTheme = () => {
    if (!import.meta.client) return;
    theme.value = localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  };

  const applyTheme = (value: Theme) => {
    theme.value = value;
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, value);
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
  };

  const toggleTheme = () => applyTheme(theme.value === 'dark' ? 'light' : 'dark');

  return { theme, applyTheme, initTheme, syncFromDocument: initTheme, toggleTheme };
};
