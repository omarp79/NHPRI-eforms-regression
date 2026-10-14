const ENV_DOMAINS = {
  dev: 'https://dev.nhpri.org/',
  qa: 'https://www.nhpri.org/',
  staging: 'https://staging.nhpri.org/',
};

export const EnvManager = {
  setEnv(target: 'dev' | 'qa' | 'staging' | string): string {
    const envKey = target.toLowerCase().trim();

    if (envKey in ENV_DOMAINS) {
      return ENV_DOMAINS[envKey as keyof typeof ENV_DOMAINS];
    }
    throw new Error(`❌ Invalid environment requested: "${target}". Expected 'dev', 'qa', or 'staging'.`);
  }
};