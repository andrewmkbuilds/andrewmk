/**
 * IndexNow configuration.
 *
 * IndexNow has no account and no secret: the key is published in plain sight at
 * `/<key>.txt`, which is exactly how the protocol proves that whoever submits
 * URLs for a host controls it. So this key is public by design — it is not a
 * credential, it must never be moved into the secrets store, and it can be
 * rotated by changing both this value and the file in `public/` together.
 *
 * The matching file is generated into `public/` by
 * `scripts/generate-public-data.ts` from this constant, so the two can never
 * drift. `scripts/indexnow.ts` submits URLs (see AGENTS.md, "IndexNow").
 */
export const INDEXNOW_KEY = "9706aeb2d9455bf866549edc85019fac";

/** Where the key file is served from the site root, as IndexNow requires. */
export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;

/** The shared endpoint fans out to every participating engine (Bing, Yandex, Seznam, Naver). */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
