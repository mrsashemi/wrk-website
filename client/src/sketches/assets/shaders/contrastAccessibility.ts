export const contrastFragment: string = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vTexCoord;
  uniform vec2 res;
  uniform vec2 mouse;

  uniform float time;

  // our texture coming from p5
  uniform sampler2D uiBackground;
  uniform sampler2D uiForeground;

  #define light 0.05
  #define dark 0.2
  
  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  float gammaCorrection(float colorChannel) {
    if (colorChannel <= 0.03928) return colorChannel / 1.055;
    return pow((colorChannel + 0.055) / 1.055, 2.4);
  }
  
  float W3Luminance(vec3 rgb) {
    float r = gammaCorrection(rgb.r);
    float g = gammaCorrection(rgb.g);
    float b = gammaCorrection(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b; // Correction for perceptual color differences
  }
  
  bool lightenBackground(float bgl, float fgl) {
    if (fgl == bgl) return bgl < 0.5;
    else return bgl > fgl;
  }
  
  float newLuminance(float fgl, float target, bool up) {
    if (up) return (target * (fgl + 0.075)) + 0.05;
    else return ((fgl + 0.05 - (target * 0.05)) / target);
  }
  
  vec3 shiftHSV(vec3 bg, float fgl, float targetRatio) {
    vec3 bghsv = rgb2hsv(bg);
    bool up = lightenBackground(bghsv.z, fgl);
    float newLum = newLuminance(fgl, targetRatio, up);
    bghsv.z = up ? max(bghsv.z, newLum + light) : min(bghsv.z, newLum + dark);
    vec3 rgb = hsv2rgb(bghsv);
    return up ? 
      vec3(
        max(bg.r, rgb.r), 
        max(bg.g, rgb.g), 
        max(bg.b, rgb.b)
      ) : vec3(
        min(bg.r, rgb.r), 
        min(bg.g, rgb.g), 
        min(bg.b, rgb.b)
      );
  }
  
  vec3 makeAccessible(vec3 bg, vec3 fg) {
    float bgl = W3Luminance(bg);
    float fgl = W3Luminance(fg);
    float targetRatio = 4.5; //compliance level, 7.0 for AAA
    return shiftHSV(bg, fgl, targetRatio);
  }
  
  void main() {
    vec2 uv = vTexCoord; 
    vec4 bg = texture2D(uiBackground, uv);
    vec4 fg = texture2D(uiForeground, uv);
    float blank = fg.r + fg.g + fg.b;

    vec4 dom;

    vec3 result = makeAccessible(bg.rgb, vec3(1.0));

    if (blank == 0.0) dom = vec4(result, 1.0);
    else dom = fg;



    gl_FragColor = dom;//vec4(result, 1.0);
  }
`