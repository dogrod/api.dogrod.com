declare module NodeJS  {
  interface Process {
    // env: env,
  }
  interface ProcessEnv {
    SESSION_SECRET: string,
    MONGODB_URI: string,
    MONGOLAB_URI: string,
  }
}