/**
 * The Annnimate starter-pack components are vendored as plain JSX (the same
 * bytes the pack ships) under src/components/annnimate/. They are outside the
 * TypeScript program on purpose, so every import resolves to this wildcard
 * declaration instead of pulling untyped third-party code into `tsc`.
 */
declare module "@/components/annnimate/*" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any;
  export default Component;
}
