// halloween-2022: the SHARED Remotion engines of the effects theme halloween-2022 (one parametric component per device,
// video-creation/assets/effects/library.json, devices hw-*). Shared infra: project comps import from
// './effects/halloween-2022' (whitelisted by lint_comp_imports.py); nothing here imports a project file. The clock
// (KtClock), the shutter blur and the sound placer (KtSfx) are the kinetic-text ones: import them from
// './effects/kinetic-text'.
export * from './types';
export * from './motion';
export * from './sfx';
export * from './media';
export * from './HwWordPop';
export * from './HwZoomSlideshow';
export * from './HwSplitPanels';
export * from './HwBloodTitle';
export * from './HwBloodPromo';
export * from './HwCameraShake';
export * from './HwDropBounce';
export * from './HwZoomPunch';
export * from './HwSubscribeLikeBell';
export * from './registry';
