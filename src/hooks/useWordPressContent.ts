import { useCallback, useEffect, useRef } from 'react';
import { useSyncExternalStore } from 'react';
import type { WordPressRenderedContent } from '../types/wordpress';

export interface UseWordPressContentOptions {
  wpBaseUrl: string;
  postType?: string;
  id?: number;
  slug?: string;
  headless?: boolean;
}

export interface UseWordPressContentResult {
  post: WordPressRenderedContent | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface FetchState {
  post: WordPressRenderedContent | null;
  loading: boolean;
  error: Error | null;
}

function buildUrl(
  wpBaseUrl: string,
  postType: string,
  id: number | undefined,
  slug: string | undefined,
  headless: boolean
): string | null {
  const base = wpBaseUrl.replace(/\/+$/, '');

  if (id == null && !slug) return null;

  let url: string;
  if (id != null) {
    url = `${base}/wp-json/wp/v2/${postType}/${id}`;
  } else {
    url = `${base}/wp-json/wp/v2/${postType}?slug=${encodeURIComponent(slug!)}`;
  }

  if (headless) {
    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}siter_headless=1`;
  }

  return url;
}

const NO_URL_STATE: FetchState = {
  post: null,
  loading: false,
  error: new Error('Either id or slug must be provided'),
};

export function useWordPressContent(
  options: UseWordPressContentOptions
): UseWordPressContentResult {
  const {
    wpBaseUrl,
    postType = 'posts',
    id,
    slug,
    headless = true,
  } = options;

  const url = buildUrl(wpBaseUrl, postType, id, slug, headless);

  const stateRef = useRef<FetchState>(
    url === null ? NO_URL_STATE : { post: null, loading: true, error: null }
  );
  const listenersRef = useRef(new Set<() => void>());
  const abortRef = useRef<AbortController | null>(null);

  const notify = useCallback(() => {
    for (const listener of listenersRef.current) listener();
  }, []);

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  const getSnapshot = useCallback(() => stateRef.current, []);

  const executeFetch = useCallback(
    (fetchUrl: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      stateRef.current = { post: null, loading: true, error: null };
      notify();

      fetch(fetchUrl, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `WordPress API error: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then(
          (data: WordPressRenderedContent | WordPressRenderedContent[]) => {
            const result = Array.isArray(data) ? data[0] ?? null : data;
            stateRef.current = { post: result, loading: false, error: null };
            notify();
          }
        )
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          stateRef.current = {
            post: null,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          };
          notify();
        });
    },
    [notify]
  );

  const refetch = useCallback(() => {
    if (url !== null) executeFetch(url);
  }, [url, executeFetch]);

  useEffect(() => {
    if (url === null) {
      stateRef.current = NO_URL_STATE;
      notify();
      return;
    }

    executeFetch(url);

    return () => {
      abortRef.current?.abort();
    };
  }, [url, executeFetch, notify]);

  const state = useSyncExternalStore(subscribe, getSnapshot, () =>
    url === null ? NO_URL_STATE : { post: null, loading: true, error: null }
  );

  return { ...state, refetch };
}
