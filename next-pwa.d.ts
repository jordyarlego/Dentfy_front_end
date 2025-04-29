// next-pwa.d.ts

declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAOptions {
    dest: string;
    register: boolean;
    skipWaiting: boolean;
    disable: boolean;
  }

  function withPWA(options: PWAOptions): (nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}
