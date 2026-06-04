import { useCallback, useEffect, useRef } from 'react';
import { useSyncExternalStore } from 'react';
import { loadScriptModule } from '../lib/loadScriptModule';
import {
  BLOCKS_REQUIRING_ROUTER,
  getBlockScriptUrl,
  getInteractivityRouterUrl,
  getInteractivityRuntimeUrl,
  INTERACTIVE_BLOCK_MAP,
} from '../lib/wp-interactive-blocks';

export interface UseInteractiveBlocksOptions {
  wpBaseUrl: string;
  blocks?: string[];
  containerRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
}

export interface UseInteractiveBlocksResult {
  loaded: boolean;
  error: string | null;
}

interface LoadState {
  loaded: boolean;
  error: string | null;
}

const IDLE: LoadState = { loaded: false, error: null };
const DONE: LoadState = { loaded: true, error: null };
const DISABLED: LoadState = { loaded: false, error: null };

function detectBlocksFromDom(
  container: HTMLElement | null
): string[] {
  if (!container) return [];

  const elements = container.querySelectorAll('[data-wp-interactive]');
  const blockNames = new Set<string>();
  for (const el of elements) {
    const name = el.getAttribute('data-wp-interactive');
    if (name && name in INTERACTIVE_BLOCK_MAP) {
      blockNames.add(name);
    }
  }
  return Array.from(blockNames);
}

export function useInteractiveBlocks(
  options: UseInteractiveBlocksOptions
): UseInteractiveBlocksResult {
  const { wpBaseUrl, blocks, containerRef, enabled = false } = options;

  const stateRef = useRef<LoadState>(enabled ? IDLE : DISABLED);
  const listenersRef = useRef(new Set<() => void>());

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  const getSnapshot = useCallback(() => stateRef.current, []);

  const notify = useCallback(() => {
    for (const listener of listenersRef.current) listener();
  }, []);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') {
      stateRef.current = DISABLED;
      notify();
      return;
    }

    const neededBlocks =
      blocks ?? detectBlocksFromDom(containerRef.current);

    if (neededBlocks.length === 0) {
      stateRef.current = DONE;
      notify();
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        await loadScriptModule(getInteractivityRuntimeUrl(wpBaseUrl));

        const needsRouter = neededBlocks.some((b) =>
          BLOCKS_REQUIRING_ROUTER.has(b)
        );
        if (needsRouter) {
          await loadScriptModule(getInteractivityRouterUrl(wpBaseUrl));
        }

        const blockLoads = neededBlocks
          .map((name) => getBlockScriptUrl(wpBaseUrl, name))
          .filter((url): url is string => url !== null)
          .map((url) => loadScriptModule(url));

        await Promise.all(blockLoads);

        if (!cancelled) {
          stateRef.current = DONE;
          notify();
        }
      } catch (err) {
        if (!cancelled) {
          stateRef.current = {
            loaded: false,
            error:
              err instanceof Error ? err.message : 'Failed to load interactive blocks',
          };
          notify();
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [enabled, wpBaseUrl, blocks, containerRef, notify]);

  return useSyncExternalStore(subscribe, getSnapshot, () => DISABLED);
}
