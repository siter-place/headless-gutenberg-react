import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useSyncExternalStore } from 'react';

const LINK_ATTR = 'data-siter-headless-css';

export interface HeadlessAssetsState {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const IDLE_STATE: HeadlessAssetsState = {
  loaded: true,
  loading: false,
  error: null,
};

function findExistingLink(url: string): boolean {
  const links = document.head.querySelectorAll<HTMLLinkElement>(
    `link[${LINK_ATTR}]`
  );
  for (const link of links) {
    if (link.getAttribute('href') === url) return true;
  }
  return false;
}

export function useHeadlessAssets(
  cssUrls: string[] | undefined
): HeadlessAssetsState {
  const urlsKey = useMemo(
    () => (cssUrls ?? []).join('\n'),
    [cssUrls]
  );
  const hasUrls = urlsKey.length > 0;
  const stateRef = useRef<HeadlessAssetsState>(IDLE_STATE);
  const injectedRefs = useRef<HTMLLinkElement[]>([]);
  const listenersRef = useRef(new Set<() => void>());

  const subscribe = useCallback((onStoreChange: () => void) => {
    listenersRef.current.add(onStoreChange);
    return () => { listenersRef.current.delete(onStoreChange); };
  }, []);

  const getSnapshot = useCallback(() => stateRef.current, []);

  const notify = useCallback(() => {
    for (const listener of listenersRef.current) {
      listener();
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!hasUrls) {
      stateRef.current = IDLE_STATE;
      notify();
      return;
    }

    const urls = urlsKey.split('\n');
    const links: HTMLLinkElement[] = [];
    let pending = 0;
    let errorMsg: string | null = null;

    for (const url of urls) {
      if (findExistingLink(url)) continue;

      pending++;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute(LINK_ATTR, 'true');

      link.addEventListener('load', () => {
        pending--;
        if (pending === 0) {
          stateRef.current = { loaded: true, loading: false, error: errorMsg };
          notify();
        }
      });

      link.addEventListener('error', () => {
        pending--;
        errorMsg = `Failed to load CSS: ${url}`;
        if (pending === 0) {
          stateRef.current = { loaded: false, loading: false, error: errorMsg };
          notify();
        }
      });

      document.head.appendChild(link);
      links.push(link);
    }

    injectedRefs.current = links;

    if (pending > 0) {
      stateRef.current = { loaded: false, loading: true, error: null };
    } else {
      stateRef.current = IDLE_STATE;
    }
    notify();

    return () => {
      for (const link of injectedRefs.current) {
        link.remove();
      }
      injectedRefs.current = [];
    };
  }, [urlsKey, hasUrls, notify]);

  return useSyncExternalStore(subscribe, getSnapshot, () => IDLE_STATE);
}
