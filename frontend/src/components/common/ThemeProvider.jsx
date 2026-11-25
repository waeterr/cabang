import { useEffect } from 'react';
import useThemeStore from '../../store/themeStore';

const ThemeProvider = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return children;
};

export default ThemeProvider;
