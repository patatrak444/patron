// La pila sulla schiena (GDD sezione 3): merci miste, si scarica per tipo ovunque sia nella pila.

export type ItemKind = 'leaf' | 'paste' | 'scrap';

export interface Stack {
  /** Dal basso verso l'alto. */
  items: ItemKind[];
  capacity: number;
}

export function createStack(capacity: number): Stack {
  return { items: [], capacity };
}

export function isFull(s: Stack): boolean {
  return s.items.length >= s.capacity;
}

export function countOf(s: Stack, kind: ItemKind): number {
  let n = 0;
  for (const it of s.items) if (it === kind) n++;
  return n;
}

/** Aggiunge in cima; falso se la pila è piena. */
export function push(s: Stack, kind: ItemKind): boolean {
  if (isFull(s)) return false;
  s.items.push(kind);
  return true;
}

/** Toglie il pezzo più in alto di quel tipo; falso se non ce n'è. */
export function take(s: Stack, kind: ItemKind): boolean {
  for (let i = s.items.length - 1; i >= 0; i--) {
    if (s.items[i] === kind) {
      s.items.splice(i, 1);
      return true;
    }
  }
  return false;
}
