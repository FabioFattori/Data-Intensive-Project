import 'src/global.css';

import { useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';

import { requestMaker } from './layouts/core/requestMaker';


// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  const reset = async () => {
    try {
      await requestMaker("reset");
      console.log("Reset successful");
    } catch (error) {
      console.error("Error during reset:", error);
    }
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  window.addEventListener('beforeunload', (e) => {
    reset();
  });

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
