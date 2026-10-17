const ENV_DOMAINS = {
  dev: 'https://dev.nhpri.org/',
  qa: 'https://nhpri.org/',
  staging: 'https://staging.nhpri.org/',
} as const;

type EnvironmentKey = keyof typeof ENV_DOMAINS;

export const Environment = {
  setEnv(target: EnvironmentKey | (string & {})): string {
    const envKey = target.toLowerCase().trim() as EnvironmentKey;

    if (envKey in ENV_DOMAINS) {
      return ENV_DOMAINS[envKey];
    }
    const validKeys = Object.keys(ENV_DOMAINS).join(', ');
    throw new Error(`❌ Invalid environment requested: "${target}". Expected one of: ${validKeys}.`);
  }
};