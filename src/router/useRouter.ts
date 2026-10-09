import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
  createElement
} from 'react';

export type ConnectionSpeed = 'fast' | 'medium' | 'slow' | 'offline';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  back: () => void;
  isLoading: boolean;
  connectionSpeed: ConnectionSpeed;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  back: () => {},
  isLoading: false,
  connectionSpeed: 'fast'
});

function detectConnectionSpeed(): ConnectionSpeed {
  if (typeof navigator === 'undefined') return 'fast';
  if (!navigator.onLine) return 'offline';

  // Network Information API inspection
  const nav = navigator as unknown as {
    connection?: {
      effectiveType?: string;
      rtt?: number;
      downlink?: number;
      saveData?: boolean;
    };
  };

  const conn = nav.connection;
  if (conn) {
    if (
      conn.effectiveType === 'slow-2g' ||
      conn.effectiveType === '2g' ||
      (conn.rtt && conn.rtt > 800) ||
      (conn.downlink && conn.downlink < 0.6)
    ) {
      return 'slow';
    }
    if (
      conn.effectiveType === '3g' ||
      (conn.rtt && conn.rtt > 350) ||
      (conn.downlink && conn.downlink < 2.0)
    ) {
      return 'medium';
    }
  }

  return 'fast';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionSpeed>(() => detectConnectionSpeed());

  // Listen to network status changes (online/offline & connection changes)
  useEffect(() => {
    const handleStatus = () => {
      setConnectionSpeed(detectConnectionSpeed());
    };

    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    const nav = navigator as unknown as {
      connection?: {
        addEventListener?: (event: string, handler: () => void) => void;
        removeEventListener?: (event: string, handler: () => void) => void;
      };
    };

    if (nav.connection?.addEventListener) {
      nav.connection.addEventListener('change', handleStatus);
    }

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
      if (nav.connection?.removeEventListener) {
        nav.connection.removeEventListener('change', handleStatus);
      }
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === to) return;

    const speed = detectConnectionSpeed();
    setConnectionSpeed(speed);
    setIsLoading(true);

    // Duration is proportional to internet connectivity
    const duration = speed === 'slow' ? 1200 : speed === 'medium' ? 600 : 320;

    setTimeout(() => {
      window.history.pushState({}, '', to);
      setPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsLoading(false);
    }, duration);
  }, []);

  const back = useCallback(() => {
    if (typeof window === 'undefined') return;
    setIsLoading(true);
    setTimeout(() => {
      window.history.back();
      setIsLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return createElement(
    RouterContext.Provider,
    { value: { path, navigate, back, isLoading, connectionSpeed } },
    children
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({
  href,
  children,
  className = '',
  title,
  ariaLabel,
  onClick
}: {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return createElement(
    'a',
    {
      href,
      onClick: handleClick,
      className,
      title,
      'aria-label': ariaLabel
    },
    children
  );
}
