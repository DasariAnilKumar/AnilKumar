(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,22016,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return y},useLinkStatus:function(){return x}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=e.r(90809),a=e.r(43476),l=i._(e.r(71645)),c=e.r(95057),u=e.r(8372),s=e.r(18581),f=e.r(18967),d=e.r(5550),p=e.r(88540),v=e.r(91949),m=e.r(73668),h=e.r(9396);function y(t){var r;let n,o,i,[y,x]=(0,l.useOptimistic)(v.IDLE_LINK_STATUS),b=(0,l.useRef)(null),{href:S,as:P,children:R,prefetch:w=null,passHref:E,replace:_,shallow:j,scroll:N,onClick:A,onMouseEnter:T,onTouchStart:L,legacyBehavior:C=!1,onNavigate:O,transitionTypes:z,ref:k,unstable_dynamicOnHover:D,...I}=t;n=R,C&&("string"==typeof n||"number"==typeof n)&&(n=(0,a.jsx)("a",{children:n}));let U=l.default.useContext(u.AppRouterContext),M=!1!==w,F=!1===w?"none":!0===w?"full":"auto",B="none"!==F?"auto"===F?h.FetchStrategy.PPR:h.FetchStrategy.Full:h.FetchStrategy.PPR,$="string"==typeof(r=P||S)?r:(0,c.formatUrl)(r);if(C){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});o=l.default.Children.only(n)}let K=C?o&&"object"==typeof o&&o.ref:k,X,V=l.default.useCallback(e=>(null!==U&&(b.current=(0,v.mountLinkInstance)(e,$,U,B,M,x,X)),()=>{b.current&&((0,v.unmountLinkForCurrentNavigation)(b.current),b.current=null),(0,v.unmountPrefetchableInstance)(e)}),[M,$,U,B,x,X]),q={ref:(0,s.useMergedRef)(V,K),onClick(t){C||"function"!=typeof A||A(t),C&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(t),!U||t.defaultPrevented||function(t,r,n,o,i,a,c,u="none"){if("u">typeof window){let s,{nodeName:f}=t.currentTarget;if("A"===f.toUpperCase()&&((s=t.currentTarget.getAttribute("target"))&&"_self"!==s||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){o&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),a){let e=!1;if(a({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);l.default.startTransition(()=>{d(r,o?"replace":"push",!1===i?p.ScrollBehavior.NoScroll:p.ScrollBehavior.Default,n.current,c,u)})}}(t,$,b,_,N,O,z,F)},onMouseEnter(e){C||"function"!=typeof T||T(e),C&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),U&&M&&(0,v.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){C||"function"!=typeof L||L(e),C&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),U&&M&&(0,v.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,f.isAbsoluteUrl)($)?q.href=$:C&&!E&&("a"!==o.type||"href"in o.props)||(q.href=(0,d.addBasePath)($)),i=C?l.default.cloneElement(o,q):(0,a.jsx)("a",{...I,...q,children:n}),(0,a.jsx)(g.Provider,{value:y,children:i})}let g=(0,l.createContext)(v.IDLE_LINK_STATUS),x=()=>(0,l.useContext)(g);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return o}});let n=e.r(71645);function o(e,t){let r=(0,n.useRef)(null),o=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=o.current;t&&(o.current=null,t())}else e&&(r.current=i(e,n)),t&&(o.current=i(t,n))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return i}});let n=e.r(18967),o=e.r(52817);function i(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,o.hasBasePath)(r.pathname)}catch(e){return!1}}},98183,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return c},searchParamsToUrlQuery:function(){return i},urlQueryToSearchParams:function(){return l}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});function i(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function a(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function l(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,a(e));else t.set(r,a(n));return t}function c(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},95057,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return l},formatWithValidation:function(){return u},urlObjectKeys:function(){return c}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=e.r(90809)._(e.r(98183)),a=/https?|ftp|gopher|file/;function l(e){let{auth:t,hostname:r}=e,n=e.protocol||"",o=e.pathname||"",l=e.hash||"",c=e.query||"",u=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?u=t+e.host:r&&(u=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(u+=":"+e.port)),c&&"object"==typeof c&&(c=String(i.urlQueryToSearchParams(c)));let s=e.search||c&&`?${c}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||a.test(n))&&!1!==u?(u="//"+(u||""),o&&"/"!==o[0]&&(o="/"+o)):u||(u=""),l&&"#"!==l[0]&&(l="#"+l),s&&"?"!==s[0]&&(s="?"+s),o=o.replace(/[?#]/g,encodeURIComponent),s=s.replace("#","%23"),`${n}${u}${o}${s}${l}`}let c=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function u(e){return l(e)}},18967,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return y},MiddlewareNotFoundError:function(){return S},MissingStaticPage:function(){return b},NormalizeError:function(){return g},PageNotFoundError:function(){return x},SP:function(){return m},ST:function(){return h},WEB_VITALS:function(){return i},execOnce:function(){return a},getDisplayName:function(){return f},getLocationOrigin:function(){return u},getURL:function(){return s},isAbsoluteUrl:function(){return c},isResSent:function(){return d},loadGetInitialProps:function(){return v},normalizeRepeatedSlashes:function(){return p},stringifyError:function(){return P}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=["CLS","FCP","FID","INP","LCP","TTFB"];function a(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let l=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,c=e=>{let t=e.charCodeAt(0);return!!(t>=65&&t<=90||t>=97&&t<=122)&&l.test(e)};function u(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function s(){let{href:e}=window.location,t=u();return e.substring(t.length)}function f(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function d(e){return e.finished||e.headersSent}function p(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function v(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await v(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&d(r))return n;if(!n)throw Object.defineProperty(Error(`"${f(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let m="u">typeof performance,h=m&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class y extends Error{}class g extends Error{}class x extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class b extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class S extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function P(e){return JSON.stringify({message:e.message,stack:e.stack})}},29306,e=>{"use strict";var t=e.i(43476),r=e.i(22016),n=e.i(71645);function o({size:e=260}){let r=(0,n.useRef)(null);return(0,n.useEffect)(()=>{let t,n=r.current;if(!n)return;let o=n.getContext("webgl",{alpha:!0,antialias:!0});if(!o)return;let i=`
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,a=`
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uTime;

      // Simplex-like 3D noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Signed distance function for morphing rich organic liquid chrome blob
      float map(vec3 p) {
        float baseRadius = 0.62;
        
        // Rich multi-layered organic liquid waves
        float t = uTime * 0.68;
        float n1 = snoise(p * 1.85 + vec3(0.0, t * 0.75, t * 0.45)) * 0.145;
        float n2 = snoise(p * 3.7 - vec3(t * 0.55, 0.0, t * 0.65)) * 0.062;
        float n3 = snoise(p * 6.8 + vec3(t * 0.35, t * 0.55, 0.0)) * 0.022;
        
        // Interactive mouse push/pull deformation
        vec2 m = (uMouse - 0.5) * 2.0;
        vec3 mousePos = vec3(m.x * 0.7, -m.y * 0.7, 0.6);
        float mouseDist = length(p - mousePos);
        float mouseInfl = smoothstep(0.85, 0.0, mouseDist) * 0.07;
        
        return length(p) - baseRadius - (n1 + n2 + n3 + mouseInfl);
      }

      // Normal computation via tetrahedron gradient
      vec3 calcNormal(vec3 p) {
        const float eps = 0.0015;
        const vec2 k = vec2(1.0, -1.0);
        return normalize(
          k.xyy * map(p + k.xyy * eps) +
          k.yyx * map(p + k.yyx * eps) +
          k.yxy * map(p + k.yxy * eps) +
          k.xxx * map(p + k.xxx * eps)
        );
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
        
        // Generous camera distance to guarantee full visibility without any edge clipping
        vec3 ro = vec3(0.0, 0.0, 2.5);
        vec3 rd = normalize(vec3(uv, -1.5));

        float dO = 0.0;
        float dS = 0.0;
        vec3 p = ro;
        bool hit = false;

        for (int i = 0; i < 75; i++) {
          p = ro + rd * dO;
          dS = map(p);
          if (dS < 0.001) {
            hit = true;
            break;
          }
          dO += dS;
          if (dO > 4.5) break;
        }

        if (!hit) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
        }

        vec3 N = calcNormal(p);
        vec3 V = -rd;

        // Primary key light from top-right
        vec3 keyLightDir = normalize(vec3(1.15, 1.55, 1.65));
        float diff = max(dot(N, keyLightDir), 0.0);
        vec3 H = normalize(keyLightDir + V);
        float spec = pow(max(dot(N, H), 0.0), 38.0);
        
        // Fill light from bottom-left
        vec3 fillLightDir = normalize(vec3(-1.0, -0.75, 0.95));
        float fillDiff = max(dot(N, fillLightDir), 0.0) * 0.35;

        // Overhead soft studio reflection
        vec3 topLightDir = normalize(vec3(0.0, 1.0, 0.6));
        float topDiff = max(dot(N, topLightDir), 0.0) * 0.25;

        // Fresnel rim reflection
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

        // Rich dark chrome / obsidian glossy metallic material
        vec3 darkBase = vec3(0.04, 0.04, 0.045);
        vec3 midTone = vec3(0.18, 0.19, 0.22);
        vec3 highlight = vec3(0.96, 0.98, 1.0);
        vec3 rimGlow = vec3(0.35, 0.38, 0.45);

        vec3 col = darkBase;
        col += midTone * (diff * 0.75 + fillDiff + topDiff);
        col += highlight * (spec * 1.35);
        col += rimGlow * (fresnel * 0.85);

        // Ambient crevice occlusion
        float ao = clamp(0.5 + 0.5 * map(p + N * 0.1) / 0.1, 0.0, 1.0);
        col *= (0.42 + 0.58 * ao);

        gl_FragColor = vec4(col, 1.0);
      }
    `,l=(e,t)=>{let r=o.createShader(e);return r?(o.shaderSource(r,t),o.compileShader(r),o.getShaderParameter(r,o.COMPILE_STATUS))?r:(console.error(o.getShaderInfoLog(r)),o.deleteShader(r),null):null},c=l(o.VERTEX_SHADER,i),u=l(o.FRAGMENT_SHADER,a);if(!c||!u)return;let s=o.createProgram();if(!s)return;if(o.attachShader(s,c),o.attachShader(s,u),o.linkProgram(s),!o.getProgramParameter(s,o.LINK_STATUS))return void console.error(o.getProgramInfoLog(s));o.useProgram(s);let f=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,f),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),o.STATIC_DRAW);let d=o.getAttribLocation(s,"position");o.enableVertexAttribArray(d),o.vertexAttribPointer(d,2,o.FLOAT,!1,0,0);let p=o.getUniformLocation(s,"uResolution"),v=o.getUniformLocation(s,"uMouse"),m=o.getUniformLocation(s,"uTime"),h={x:.5,y:.5,targetX:.5,targetY:.5},y=performance.now(),g=e=>{let t=n.getBoundingClientRect();h.targetX=(e.clientX-t.left)/t.width,h.targetY=(e.clientY-t.top)/t.height},x=()=>{h.targetX=.5,h.targetY=.5};window.addEventListener("mousemove",g),n.addEventListener("mouseleave",x);let b=()=>{let r=Math.min(window.devicePixelRatio||1,2),i=e*r,a=e*r;(n.width!==i||n.height!==a)&&(n.width=i,n.height=a,o.viewport(0,0,i,a)),h.x+=(h.targetX-h.x)*.08,h.y+=(h.targetY-h.y)*.08;let l=(performance.now()-y)/1e3;o.uniform2f(p,i,a),o.uniform2f(v,h.x,h.y),o.uniform1f(m,l),o.drawArrays(o.TRIANGLES,0,6),t=requestAnimationFrame(b)};return b(),()=>{cancelAnimationFrame(t),window.removeEventListener("mousemove",g),n.removeEventListener("mouseleave",x),o.deleteProgram(s)}},[e]),(0,t.jsx)("div",{style:{width:e,height:e,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"},children:(0,t.jsx)("canvas",{ref:r,style:{width:e,height:e,display:"block"}})})}e.s(["default",0,function(){return(0,t.jsxs)("div",{className:"not-found-page",children:[(0,t.jsx)("header",{className:"not-found-header",children:(0,t.jsx)(r.default,{href:"/",className:"not-found-brand",children:"ANIL KUMAR"})}),(0,t.jsxs)("main",{className:"not-found-main",children:[(0,t.jsxs)("div",{className:"not-found-centerpiece",children:[(0,t.jsx)("span",{className:"not-found-digit",children:"4"}),(0,t.jsx)("div",{className:"not-found-blob-wrap",children:(0,t.jsx)(o,{size:340})}),(0,t.jsx)("span",{className:"not-found-digit",children:"4"})]}),(0,t.jsx)("div",{className:"not-found-actions",children:(0,t.jsx)(r.default,{href:"/",className:"not-found-pill-btn",children:(0,t.jsx)("span",{children:"RETURN HOME"})})})]}),(0,t.jsx)("footer",{className:"not-found-footer",children:(0,t.jsx)("span",{children:"©2026 DASARI ANIL KUMAR. ALL RIGHTS RESERVED."})})]})}],29306)}]);