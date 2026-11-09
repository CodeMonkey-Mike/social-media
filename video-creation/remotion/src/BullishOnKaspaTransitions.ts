// BullishOnKaspaTransitions.ts: the comp's single door to the shared transition infra (./transitions/*).
import { ENGINES, framesForRow, getTransition, TransitionRow } from './transitions/registry';
export { TransitionClip } from './transitions/TransitionClip';
export { ENGINES, framesForRow };

export const getTransitionRow = (id: string): TransitionRow => {
  const r = getTransition(id);
  if (!r) throw new Error(`unknown transition id ${id}`);
  return r;
};
