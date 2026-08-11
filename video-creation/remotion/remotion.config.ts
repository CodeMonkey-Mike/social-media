import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// 20-core machine; measured 2026-06-18: cc8 ~10.4fps vs cc4 ~7.5fps, cc12 negligible gain
// (bottleneck is OffthreadVideo decode of the 14-min spine, not CPU count).
Config.setConcurrency(8);
// Hardware acceleration: Remotion does NOT support GPU (NVENC) h264 encode on Windows
// (verified 2026-06-18: "Codec h264 does not support hardware acceleration on win32").
// So the H.264 encode is CPU on this machine regardless. 'if-possible' keeps it from
// erroring and would use GPU on macOS/Linux. The render-time bottleneck is Chrome frame
// rasterization, governed by setConcurrency below — that's the real speed lever here.
Config.setHardwareAcceleration("if-possible");
// Serve video-creation/assets/ as the public directory so staticFile() resolves there
Config.setPublicDir("../assets");
