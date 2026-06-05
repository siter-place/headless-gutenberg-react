import { useCallback, useEffect, useRef } from 'react';
import { useSyncExternalStore } from 'react';
import { injectLightboxOverlay } from '../lib/injectLightboxOverlay';
import { injectServerData } from '../lib/injectServerData';
import { loadScriptModule } from '../lib/loadScriptModule';
import {
  getInteractivityBundlePath,
  SUPPORTED_INTERACTIVE_BLOCKS,
} from '../lib/wp-interactive-blocks';

export interface UseInteractiveBlocksOptions {
  basePath: string;
  blocks?: string[];
  containerRef: React.RefObject<HTMLElement | null>;
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

function hasInteractiveBlocks(blocks: string[]): boolean {
  return blocks.some((name) => SUPPORTED_INTERACTIVE_BLOCKS.has(name));
}

function detectInteractiveBlocksInDom(
  container: HTMLElement | null
): boolean {
  if (!container) return false;
  return container.querySelector('[data-wp-interactive]') !== null;
}

export function useInteractiveBlocks(
  options: UseInteractiveBlocksOptions
): UseInteractiveBlocksResult {
  const { basePath, blocks, containerRef } = options;

  const stateRef = useRef<LoadState>(IDLE);
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
    if (typeof document === 'undefined') {
      stateRef.current = DONE;
      notify();
      return;
    }

    const needsInteractivity = blocks
      ? hasInteractiveBlocks(blocks)
      : detectInteractiveBlocksInDom(containerRef.current);

    if (!needsInteractivity) {
      stateRef.current = DONE;
      notify();
      return;
    }

    stateRef.current = IDLE;
    notify();

    let cancelled = false;

    async function load() {
      try {
        if (containerRef.current) {
          injectServerData(containerRef.current);
          injectLightboxOverlay(containerRef.current);
        }
        const bundlePath = getInteractivityBundlePath(basePath);
        await loadScriptModule(bundlePath);

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

    const timerId = setTimeout(() => {
      if (!cancelled) load();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [basePath, blocks, containerRef, notify]);

  return useSyncExternalStore(subscribe, getSnapshot, () => IDLE);
}
