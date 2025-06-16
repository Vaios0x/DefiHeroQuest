// Configuration for the custom quest and portfolio system
export default {
  project: "defi-yield-quest-sherry",
  framework: "react-vite",
  logLevel: "info",
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      backoff: 'exponential',
      randomize: true,
    },
  },
  social: {
    enableGuildFeatures: true,
    enableCommunityValidation: true,
    enableSocialNotifications: true,
  },
  dirs: ["./src/triggerkit"],
  defi: {
    network: 'avalanche',
    enableSocialLayer: true,
    supportedProtocols: ['Aave', 'Trader Joe', 'Benqi', 'Pangolin']
  },
};