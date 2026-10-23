// Eventi interni (GDD sezione 14, principio 4).
// La logica emette, effetti, suoni e tutorial ascoltano.

/** Catalogo degli eventi di gioco. Ogni tappa aggiunge i suoi. */
export interface GameEvents {
  'sim:step': { time: number };
}

type Handler<T> = (payload: T) => void;

export interface Bus<E extends object> {
  on<K extends keyof E>(type: K, handler: Handler<E[K]>): () => void;
  off<K extends keyof E>(type: K, handler: Handler<E[K]>): void;
  emit<K extends keyof E>(type: K, payload: E[K]): void;
}

export function createBus<E extends object>(): Bus<E> {
  const handlers = new Map<keyof E, Set<Handler<never>>>();

  const off: Bus<E>['off'] = (type, handler) => {
    handlers.get(type)?.delete(handler as Handler<never>);
  };

  return {
    on(type, handler) {
      let set = handlers.get(type);
      if (!set) {
        set = new Set();
        handlers.set(type, set);
      }
      set.add(handler as Handler<never>);
      return () => off(type, handler);
    },
    off,
    emit(type, payload) {
      const set = handlers.get(type);
      if (!set) return;
      for (const handler of [...set]) (handler as Handler<E[typeof type]>)(payload);
    },
  };
}
