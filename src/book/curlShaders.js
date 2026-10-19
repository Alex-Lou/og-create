// Les shaders du Livre (curlBook.js) : la feuille s'enroule sur un cylindre qui suit le doigt (sommets) ; lumière,
// reflet sur le pli, ombre portée et transparence du papier (pixels)
export const VERT = `
attribute vec2 aUV;
uniform vec2 uPage, uOrigin, uCanvas, uL, uDir;
uniform float uR, uCurl, uDepth;
varying vec2 vUV;
varying vec3 vN;
varying float vD;
void main() {
  vec2 p = aUV * uPage;
  vec3 pos = vec3(p, 0.0);
  vec3 n = vec3(0.0, 0.0, 1.0);
  float d = dot(p - uL, uDir);
  if (uCurl > 0.5 && d > 0.0) {
    vec2 base = p - uDir * d;
    float half_ = 3.14159265 * uR;
    if (d < half_) {
      float a = d / uR;
      pos.xy = base + uDir * (uR * sin(a));
      pos.z = uR * (1.0 - cos(a));
      n = vec3(-uDir * sin(a), cos(a));
    } else {
      pos.xy = base - uDir * (d - half_);
      pos.z = 2.0 * uR;
      n = vec3(0.0, 0.0, -1.0);
    }
  }
  vUV = aUV;
  vN = n;
  vD = d;
  vec2 c = uCanvas * 0.5;
  vec2 world = uOrigin + pos.xy;
  vec2 sp = c + (world - c) * (uDepth / (uDepth - pos.z));
  gl_Position = vec4(sp.x / uCanvas.x * 2.0 - 1.0, 1.0 - sp.y / uCanvas.y * 2.0, -pos.z / (4.0 * uR + 1.0), 1.0);
}`;
export const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uFront, uBack;
uniform vec2 uPageF;
uniform float uMode, uCurlF, uRF, uCorner, uAlpha, uMirror, uBackPage;
varying vec2 vUV;
varying vec3 vN;
varying float vD;
void main() {
  vec2 p = vUV * uPageF;
  // Page de gauche à plat : la reliure est à droite, les grands coins à gauche
  vec2 pm = uMirror > 0.5 ? vec2(uPageF.x - p.x, p.y) : p;
  float rc = pm.x > uPageF.x * 0.5 ? uCorner : uCorner * 0.3;
  vec2 inner = clamp(pm, vec2(rc), uPageF - vec2(rc));
  float mask = clamp(0.5 - (length(pm - inner) - rc), 0.0, 1.0);
  if (mask <= 0.0) discard;
  vec3 col;
  if (uMode > 0.5) {
    col = texture2D(uFront, vUV).rgb;
    if (uCurlF > 0.5 && vD > 0.0) col *= 1.0 - 0.5 * exp(-max(vD - uRF * 0.6, 0.0) / (uRF * 2.2));
  } else {
    vec3 n = normalize(vN);
    bool front = n.z >= 0.0;
    vec3 nv = front ? n : -n;
    vec3 base;
    if (front) base = texture2D(uFront, vUV).rgb;
    else if (uBackPage > 0.5) {
      // Verso imprimé (double page) : la page suivante, vue de l'autre côté de la feuille
      vec3 paper = texture2D(uBack, vec2(1.0 - vUV.x, vUV.y)).rgb;
      base = mix(paper, paper * texture2D(uFront, vUV).rgb, 0.06);
    } else {
      vec3 paper = texture2D(uBack, vUV).rgb;
      base = mix(paper, paper * texture2D(uFront, vUV).rgb, 0.12);
    }
    vec3 L = normalize(vec3(-0.35, -0.55, 1.0));
    float diff = clamp(dot(nv, L) / L.z, 0.0, 1.0);
    float shade = mix(0.58, 1.0, diff);
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(nv, H), 0.0), 42.0) * 0.2 * uCurlF * step(0.0, vD);
    float ao = 1.0;
    if (uCurlF > 0.5 && vD < 0.0) ao = 1.0 - 0.3 * exp(vD / (uRF * 1.3));
    col = base * shade * ao + spec;
  }
  float a = mask * uAlpha;
  gl_FragColor = vec4(col * a, a);
}`;
