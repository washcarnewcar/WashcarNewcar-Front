let httpOnly = false;
let secure = false;

const HTTP_ONLY = process.env.NEXT_PUBLIC_HTTP_ONLY;
if (HTTP_ONLY) {
  httpOnly = JSON.parse(HTTP_ONLY);
}
const SECURE = process.env.NEXT_PUBLIC_SECURE;
if (SECURE) {
  secure = JSON.parse(SECURE);
}

export { httpOnly, secure };
