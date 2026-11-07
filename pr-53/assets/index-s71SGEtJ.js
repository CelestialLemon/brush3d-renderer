(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`attached`,t=1e3,n=1001,r=1002,i=1003,a=1004,o=1005,s=1006,c=1007,l=1008,u=1009,d=1010,f=1011,p=1012,m=1013,h=1014,g=1015,_=1016,v=1017,y=1018,b=1020,x=35902,S=35899,C=1021,w=1022,T=1023,E=1026,D=1027,O=1028,k=1029,A=1030,ee=1031,te=1033,j=33776,ne=33777,re=33778,M=33779,ie=35840,ae=35841,oe=35842,se=35843,ce=36196,le=37492,ue=37496,de=37808,fe=37809,pe=37810,me=37811,he=37812,ge=37813,_e=37814,N=37815,ve=37816,ye=37817,be=37818,P=37819,xe=37820,F=37821,Se=36492,Ce=36494,we=36495,Te=36283,Ee=36284,De=36285,Oe=36286,ke=2300,Ae=2301,je=2302,Me=2400,Ne=2401,Pe=2402,Fe=2500,Ie=3200,Le=3201,Re=`srgb`,ze=`srgb-linear`,Be=`linear`,Ve=`srgb`,He=7680,Ue=35044,We=35048,Ge=`300 es`,Ke=2e3,qe=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Je=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Ye=1234567,Xe=Math.PI/180,Ze=180/Math.PI;function Qe(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Je[e&255]+Je[e>>8&255]+Je[e>>16&255]+Je[e>>24&255]+`-`+Je[t&255]+Je[t>>8&255]+`-`+Je[t>>16&15|64]+Je[t>>24&255]+`-`+Je[n&63|128]+Je[n>>8&255]+`-`+Je[n>>16&255]+Je[n>>24&255]+Je[r&255]+Je[r>>8&255]+Je[r>>16&255]+Je[r>>24&255]).toLowerCase()}function I(e,t,n){return Math.max(t,Math.min(n,e))}function $e(e,t){return(e%t+t)%t}function et(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function tt(e,t,n){return e===t?0:(n-e)/(t-e)}function nt(e,t,n){return(1-n)*e+n*t}function rt(e,t,n,r){return nt(e,t,1-Math.exp(-n*r))}function it(e,t=1){return t-Math.abs($e(e,t*2)-t)}function at(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function ot(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function st(e,t){return e+Math.floor(Math.random()*(t-e+1))}function ct(e,t){return e+Math.random()*(t-e)}function lt(e){return e*(.5-Math.random())}function ut(e){e!==void 0&&(Ye=e);let t=Ye+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function dt(e){return e*Xe}function ft(e){return e*Ze}function pt(e){return!(e&e-1)&&e!==0}function mt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function ht(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function gt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:console.warn(`THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function _t(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`Invalid component type.`)}}function vt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`Invalid component type.`)}}var yt={DEG2RAD:Xe,RAD2DEG:Ze,generateUUID:Qe,clamp:I,euclideanModulo:$e,mapLinear:et,inverseLerp:tt,lerp:nt,damp:rt,pingpong:it,smoothstep:at,smootherstep:ot,randInt:st,randFloat:ct,randFloatSpread:lt,seededRandom:ut,degToRad:dt,radToDeg:ft,isPowerOfTwo:pt,ceilPowerOfTwo:mt,floorPowerOfTwo:ht,setQuaternionFromProperEuler:gt,normalize:vt,denormalize:_t},L=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=I(this.x,e.x,t.x),this.y=I(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=I(this.x,e,t),this.y=I(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(I(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(I(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},bt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(o===0)e[t+0]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u;else if(o===1)e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=m;else{if(u!==m||s!==d||c!==f||l!==p){let e=1-o,t=s*d+c*f+l*p+u*m,n=t>=0?1:-1,r=1-t*t;if(r>2**-52){let i=Math.sqrt(r),a=Math.atan2(i,t*n);e=Math.sin(e*a)/i,o=Math.sin(o*a)/i}let i=o*n;if(s=s*e+d*i,c=c*e+f*i,l=l*e+p*i,u=u*e+m*i,e===1-o){let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(I(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,i=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+i*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=i,this;let s=1-o*o;if(s<=2**-52){let e=1-t;return this._w=e*a+t*this._w,this._x=e*n+t*this._x,this._y=e*r+t*this._y,this._z=e*i+t*this._z,this.normalize(),this}let c=Math.sqrt(s),l=Math.atan2(c,o),u=Math.sin((1-t)*l)/c,d=Math.sin(t*l)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=i*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class e{constructor(t=0,n=0,r=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=r}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(St.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(St.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=I(this.x,e.x,t.x),this.y=I(this.y,e.y,t.y),this.z=I(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=I(this.x,e,t),this.y=I(this.y,e,t),this.z=I(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(I(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return xt.copy(this).projectOnVector(e),this.sub(xt)}reflect(e){return this.sub(xt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(I(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},xt=new R,St=new bt,z=class e{constructor(t,n,r,i,a,o,s,c,l){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ct.makeScale(e,t)),this}rotate(e){return this.premultiply(Ct.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ct.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ct=new z;function wt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Tt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Et(){let e=Tt(`canvas`);return e.style.display=`block`,e}var Dt={};function Ot(e){e in Dt||(Dt[e]=!0,console.warn(e))}function kt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var At=new z().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),jt=new z().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mt(){let e={enabled:!0,workingColorSpace:ze,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Pt(e.r),e.g=Pt(e.g),e.b=Pt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ft(e.r),e.g=Ft(e.g),e.b=Ft(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Be:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Ot(`THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Ot(`THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[ze]:{primaries:t,whitePoint:r,transfer:Be,toXYZ:At,fromXYZ:jt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Re},outputColorSpaceConfig:{drawingBufferColorSpace:Re}},[Re]:{primaries:t,whitePoint:r,transfer:Ve,toXYZ:At,fromXYZ:jt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Re}}}),e}var Nt=Mt();function Pt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ft(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var It,Lt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{It===void 0&&(It=Tt(`canvas`)),It.width=e.width,It.height=e.height;let t=It.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=It}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Tt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Pt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Pt(t[e]/255)*255):t[e]=Pt(t[e]);return{data:t,width:e.width,height:e.height}}return console.warn(`THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Rt=0,zt=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rt++}),this.uuid=Qe(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Bt(r[t].image)):e.push(Bt(r[t]))}else e=Bt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Bt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Lt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn(`THREE.Texture: Unable to serialize Texture.`),{})}var Vt=0,Ht=new R,Ut=class e extends qe{constructor(t=e.DEFAULT_IMAGE,r=e.DEFAULT_MAPPING,i=n,a=n,o=s,c=l,d=T,f=u,p=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vt++}),this.uuid=Qe(),this.name=``,this.source=new zt(t),this.mipmaps=[],this.mapping=r,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=o,this.minFilter=c,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new L(0,0),this.repeat=new L(1,1),this.center=new L(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new z,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ht).x}get height(){return this.source.getSize(Ht).y}get depth(){return this.source.getSize(Ht).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case t:e.x-=Math.floor(e.x);break;case n:e.x=e.x<0?0:1;break;case r:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case t:e.y-=Math.floor(e.y);break;case n:e.y=e.y<0?0:1;break;case r:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ut.DEFAULT_IMAGE=null,Ut.DEFAULT_MAPPING=300,Ut.DEFAULT_ANISOTROPY=1;var B=class e{constructor(t=0,n=0,r=0,i=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=r,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=I(this.x,e.x,t.x),this.y=I(this.y,e.y,t.y),this.z=I(this.z,e.z,t.z),this.w=I(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=I(this.x,e,t),this.y=I(this.y,e,t),this.z=I(this.z,e,t),this.w=I(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(I(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Wt=class extends qe{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:s,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new B(0,0,e,t),this.scissorTest=!1,this.viewport=new B(0,0,e,t);let r=new Ut({width:e,height:t,depth:n.depth});this.textures=[];let i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:s,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new zt(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:`dispose`})}},Gt=class extends Wt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Kt=class extends Ut{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=i,this.minFilter=i,this.wrapR=n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},qt=class extends Gt{constructor(e=1,t=1,n=1,r={}){super(e,t,r),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Kt(null,e,t,n),this._setTextureOptions(r),this.texture.isRenderTargetTexture=!0}},Jt=class extends Ut{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=i,this.minFilter=i,this.wrapR=n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Yt=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Zt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Zt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Zt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Zt):Zt.fromBufferAttribute(r,t),Zt.applyMatrix4(e.matrixWorld),this.expandByPoint(Zt);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Qt.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Qt.copy(e.boundingBox)),Qt.applyMatrix4(e.matrixWorld),this.union(Qt)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zt),Zt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(on),sn.subVectors(this.max,on),$t.subVectors(e.a,on),en.subVectors(e.b,on),tn.subVectors(e.c,on),nn.subVectors(en,$t),rn.subVectors(tn,en),an.subVectors($t,tn);let t=[0,-nn.z,nn.y,0,-rn.z,rn.y,0,-an.z,an.y,nn.z,0,-nn.x,rn.z,0,-rn.x,an.z,0,-an.x,-nn.y,nn.x,0,-rn.y,rn.x,0,-an.y,an.x,0];return!un(t,$t,en,tn,sn)||(t=[1,0,0,0,1,0,0,0,1],!un(t,$t,en,tn,sn))?!1:(cn.crossVectors(nn,rn),t=[cn.x,cn.y,cn.z],un(t,$t,en,tn,sn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Xt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xt)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Xt=[new R,new R,new R,new R,new R,new R,new R,new R],Zt=new R,Qt=new Yt,$t=new R,en=new R,tn=new R,nn=new R,rn=new R,an=new R,on=new R,sn=new R,cn=new R,ln=new R;function un(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){ln.fromArray(e,a);let o=i.x*Math.abs(ln.x)+i.y*Math.abs(ln.y)+i.z*Math.abs(ln.z),s=t.dot(ln),c=n.dot(ln),l=r.dot(ln);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var dn=new Yt,fn=new R,pn=new R,mn=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?dn.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fn.subVectors(e,this.center);let t=fn.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(fn,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(pn.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fn.copy(e.center).add(pn)),this.expandByPoint(fn.copy(e.center).sub(pn))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},hn=new R,gn=new R,_n=new R,vn=new R,yn=new R,bn=new R,xn=new R,Sn=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){gn.copy(e).add(t).multiplyScalar(.5),_n.copy(t).sub(e).normalize(),vn.copy(this.origin).sub(gn);let i=e.distanceTo(t)*.5,a=-this.direction.dot(_n),o=vn.dot(this.direction),s=-vn.dot(_n),c=vn.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(gn).addScaledVector(_n,d),f}intersectSphere(e,t){hn.subVectors(e.center,this.origin);let n=hn.dot(this.direction),r=hn.dot(hn)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,n,r,i){yn.subVectors(t,e),bn.subVectors(n,e),xn.crossVectors(yn,bn);let a=this.direction.dot(xn),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;vn.subVectors(this.origin,e);let s=o*this.direction.dot(bn.crossVectors(vn,bn));if(s<0)return null;let c=o*this.direction.dot(yn.cross(vn));if(c<0||s+c>a)return null;let l=-o*vn.dot(xn);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},V=class e{constructor(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Cn.setFromMatrixColumn(e,0).length(),i=1/Cn.setFromMatrixColumn(e,1).length(),a=1/Cn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Tn,e,En)}lookAt(e,t,n){let r=this.elements;return kn.subVectors(e,t),kn.lengthSq()===0&&(kn.z=1),kn.normalize(),Dn.crossVectors(n,kn),Dn.lengthSq()===0&&(Math.abs(n.z)===1?kn.x+=1e-4:kn.z+=1e-4,kn.normalize(),Dn.crossVectors(n,kn)),Dn.normalize(),On.crossVectors(kn,Dn),r[0]=Dn.x,r[4]=On.x,r[8]=kn.x,r[1]=Dn.y,r[5]=On.y,r[9]=kn.y,r[2]=Dn.z,r[6]=On.z,r[10]=kn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],ee=r[10],te=r[14],j=r[3],ne=r[7],re=r[11],M=r[15];return i[0]=a*x+o*T+s*k+c*j,i[4]=a*S+o*E+s*A+c*ne,i[8]=a*C+o*D+s*ee+c*re,i[12]=a*w+o*O+s*te+c*M,i[1]=l*x+u*T+d*k+f*j,i[5]=l*S+u*E+d*A+f*ne,i[9]=l*C+u*D+d*ee+f*re,i[13]=l*w+u*O+d*te+f*M,i[2]=p*x+m*T+h*k+g*j,i[6]=p*S+m*E+h*A+g*ne,i[10]=p*C+m*D+h*ee+g*re,i[14]=p*w+m*O+h*te+g*M,i[3]=_*x+v*T+y*k+b*j,i[7]=_*S+v*E+y*A+b*ne,i[11]=_*C+v*D+y*ee+b*re,i[15]=_*w+v*O+y*te+b*M,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15];return p*(+i*s*u-r*c*u-i*o*d+n*c*d+r*o*f-n*s*f)+m*(+t*s*f-t*c*d+i*a*d-r*a*f+r*c*l-i*s*l)+h*(+t*c*u-t*o*f-i*a*u+n*a*f+i*o*l-n*c*l)+g*(-r*o*l-t*s*u+t*o*d+r*a*u-n*a*d+n*s*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=u*h*c-m*d*c+m*s*f-o*h*f-u*s*g+o*d*g,v=p*d*c-l*h*c-p*s*f+a*h*f+l*s*g-a*d*g,y=l*m*c-p*u*c+p*o*f-a*m*f-l*o*g+a*u*g,b=p*u*s-l*m*s-p*o*d+a*m*d+l*o*h-a*u*h,x=t*_+n*v+r*y+i*b;if(x===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/x;return e[0]=_*S,e[1]=(m*d*i-u*h*i-m*r*f+n*h*f+u*r*g-n*d*g)*S,e[2]=(o*h*i-m*s*i+m*r*c-n*h*c-o*r*g+n*s*g)*S,e[3]=(u*s*i-o*d*i-u*r*c+n*d*c+o*r*f-n*s*f)*S,e[4]=v*S,e[5]=(l*h*i-p*d*i+p*r*f-t*h*f-l*r*g+t*d*g)*S,e[6]=(p*s*i-a*h*i-p*r*c+t*h*c+a*r*g-t*s*g)*S,e[7]=(a*d*i-l*s*i+l*r*c-t*d*c-a*r*f+t*s*f)*S,e[8]=y*S,e[9]=(p*u*i-l*m*i-p*n*f+t*m*f+l*n*g-t*u*g)*S,e[10]=(a*m*i-p*o*i+p*n*c-t*m*c-a*n*g+t*o*g)*S,e[11]=(l*o*i-a*u*i-l*n*c+t*u*c+a*n*f-t*o*f)*S,e[12]=b*S,e[13]=(l*m*r-p*u*r+p*n*d-t*m*d-l*n*h+t*u*h)*S,e[14]=(p*o*r-a*m*r-p*n*s+t*m*s+a*n*h-t*o*h)*S,e[15]=(a*u*r-l*o*r+l*n*s-t*u*s-a*n*d+t*o*d)*S,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,i=Cn.set(r[0],r[1],r[2]).length(),a=Cn.set(r[4],r[5],r[6]).length(),o=Cn.set(r[8],r[9],r[10]).length();this.determinant()<0&&(i=-i),e.x=r[12],e.y=r[13],e.z=r[14],wn.copy(this);let s=1/i,c=1/a,l=1/o;return wn.elements[0]*=s,wn.elements[1]*=s,wn.elements[2]*=s,wn.elements[4]*=c,wn.elements[5]*=c,wn.elements[6]*=c,wn.elements[8]*=l,wn.elements[9]*=l,wn.elements[10]*=l,t.setFromRotationMatrix(wn),n.x=i,n.y=a,n.z=o,this}makePerspective(e,t,n,r,i,a,o=Ke,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Ke,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Cn=new R,wn=new V,Tn=new R(0,0,0),En=new R(1,1,1),Dn=new R,On=new R,kn=new R,An=new V,jn=new bt,Mn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(I(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-I(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(I(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-I(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(I(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-I(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return An.makeRotationFromQuaternion(e),this.setFromRotationMatrix(An,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return jn.setFromEuler(this),this.setFromQuaternion(jn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mn.DEFAULT_ORDER=`XYZ`;var Nn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Pn=0,Fn=new R,In=new bt,Ln=new V,Rn=new R,zn=new R,Bn=new R,Vn=new bt,Hn=new R(1,0,0),Un=new R(0,1,0),Wn=new R(0,0,1),Gn={type:`added`},Kn={type:`removed`},qn={type:`childadded`,child:null},Jn={type:`childremoved`,child:null},Yn=class e extends qe{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pn++}),this.uuid=Qe(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new R,n=new Mn,r=new bt,i=new R(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new V},normalMatrix:{value:new z}}),this.matrix=new V,this.matrixWorld=new V,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.multiply(In),this}rotateOnWorldAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.premultiply(In),this}rotateX(e){return this.rotateOnAxis(Hn,e)}rotateY(e){return this.rotateOnAxis(Un,e)}rotateZ(e){return this.rotateOnAxis(Wn,e)}translateOnAxis(e,t){return Fn.copy(e).applyQuaternion(this.quaternion),this.position.add(Fn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hn,e)}translateY(e){return this.translateOnAxis(Un,e)}translateZ(e){return this.translateOnAxis(Wn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Rn.copy(e):Rn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),zn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(zn,Rn,this.up):Ln.lookAt(Rn,zn,this.up),this.quaternion.setFromRotationMatrix(Ln),r&&(Ln.extractRotation(r.matrixWorld),In.setFromRotationMatrix(Ln),this.quaternion.premultiply(In.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(console.error(`THREE.Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Gn),qn.child=e,this.dispatchEvent(qn),qn.child=null):console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Kn),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ln),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Gn),qn.child=e,this.dispatchEvent(qn),qn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zn,e,Bn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zn,Vn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let e=this.children;for(let t=0,n=e.length;t<n;t++)e[t].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Yn.DEFAULT_UP=new R(0,1,0),Yn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Yn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Xn=new R,Zn=new R,Qn=new R,$n=new R,er=new R,tr=new R,nr=new R,rr=new R,ir=new R,ar=new R,or=new B,sr=new B,cr=new B,lr=class e{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Xn.subVectors(e,t),r.cross(Xn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Xn.subVectors(r,t),Zn.subVectors(n,t),Qn.subVectors(e,t);let a=Xn.dot(Xn),o=Xn.dot(Zn),s=Xn.dot(Qn),c=Zn.dot(Zn),l=Zn.dot(Qn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,$n)!==null&&$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,$n)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,$n.x),s.addScaledVector(a,$n.y),s.addScaledVector(o,$n.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return or.setScalar(0),sr.setScalar(0),cr.setScalar(0),or.fromBufferAttribute(e,t),sr.fromBufferAttribute(e,n),cr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(or,i.x),a.addScaledVector(sr,i.y),a.addScaledVector(cr,i.z),a}static isFrontFacing(e,t,n,r){return Xn.subVectors(n,t),Zn.subVectors(e,t),Xn.cross(Zn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xn.subVectors(this.c,this.b),Zn.subVectors(this.a,this.b),Xn.cross(Zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;er.subVectors(r,n),tr.subVectors(i,n),rr.subVectors(e,n);let s=er.dot(rr),c=tr.dot(rr);if(s<=0&&c<=0)return t.copy(n);ir.subVectors(e,r);let l=er.dot(ir),u=tr.dot(ir);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(er,a);ar.subVectors(e,i);let f=er.dot(ar),p=tr.dot(ar);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(tr,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return nr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(nr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(er,a).addScaledVector(tr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ur={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},dr={h:0,s:0,l:0},fr={h:0,s:0,l:0};function pr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var H=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Re){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Nt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Nt.workingColorSpace){if(e=$e(e,1),t=I(t,0,1),n=I(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=pr(i,r,e+1/3),this.g=pr(i,r,e),this.b=pr(i,r,e-1/3)}return Nt.colorSpaceToWorking(this,r),this}setStyle(e,t=Re){function n(t){t!==void 0&&parseFloat(t)<1&&console.warn(`THREE.Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:console.warn(`THREE.Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);console.warn(`THREE.Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Re){let n=ur[e.toLowerCase()];return n===void 0?console.warn(`THREE.Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Pt(e.r),this.g=Pt(e.g),this.b=Pt(e.b),this}copyLinearToSRGB(e){return this.r=Ft(e.r),this.g=Ft(e.g),this.b=Ft(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Re){return Nt.workingToColorSpace(mr.copy(this),e),Math.round(I(mr.r*255,0,255))*65536+Math.round(I(mr.g*255,0,255))*256+Math.round(I(mr.b*255,0,255))}getHexString(e=Re){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Nt.workingColorSpace){Nt.workingToColorSpace(mr.copy(this),t);let n=mr.r,r=mr.g,i=mr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Nt.workingColorSpace){return Nt.workingToColorSpace(mr.copy(this),t),e.r=mr.r,e.g=mr.g,e.b=mr.b,e}getStyle(e=Re){Nt.workingToColorSpace(mr.copy(this),e);let t=mr.r,n=mr.g,r=mr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(dr),this.setHSL(dr.h+e,dr.s+t,dr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(dr),e.getHSL(fr);let n=nt(dr.h,fr.h,t),r=nt(dr.s,fr.s,t),i=nt(dr.l,fr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},mr=new H;H.NAMES=ur;var hr=0,gr=class extends qe{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hr++}),this.uuid=Qe(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new H(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=He,this.stencilZFail=He,this.stencilZPass=He,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},_r=class extends gr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new H(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},vr=new R,yr=new L,br=0,xr=class{constructor(e,t,n=!1){if(Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:br++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Ue,this.updateRanges=[],this.gpuType=g,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)yr.fromBufferAttribute(this,t),yr.applyMatrix3(e),this.setXY(t,yr.x,yr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyMatrix3(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyMatrix4(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyNormalMatrix(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.transformDirection(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=_t(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_t(t,this.array)),t}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_t(t,this.array)),t}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_t(t,this.array)),t}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_t(t,this.array)),t}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),r=vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),r=vt(r,this.array),i=vt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}},Sr=class extends xr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Cr=class extends xr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},wr=class extends xr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Tr=0,Er=new V,Dr=new Yn,Or=new R,kr=new Yt,Ar=new Yt,jr=new R,Mr=class e extends qe{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tr++}),this.uuid=Qe(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(wt(e)?Cr:Sr)(e,1):e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new z().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Er.makeRotationFromQuaternion(e),this.applyMatrix4(Er),this}rotateX(e){return Er.makeRotationX(e),this.applyMatrix4(Er),this}rotateY(e){return Er.makeRotationY(e),this.applyMatrix4(Er),this}rotateZ(e){return Er.makeRotationZ(e),this.applyMatrix4(Er),this}translate(e,t,n){return Er.makeTranslation(e,t,n),this.applyMatrix4(Er),this}scale(e,t,n){return Er.makeScale(e,t,n),this.applyMatrix4(Er),this}lookAt(e){return Dr.lookAt(e),Dr.updateMatrix(),this.applyMatrix4(Dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Or).negate(),this.translate(Or.x,Or.y,Or.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new wr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&console.warn(`THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];kr.setFromBufferAttribute(n),this.morphTargetsRelative?(jr.addVectors(this.boundingBox.min,kr.min),this.boundingBox.expandByPoint(jr),jr.addVectors(this.boundingBox.max,kr.max),this.boundingBox.expandByPoint(jr)):(this.boundingBox.expandByPoint(kr.min),this.boundingBox.expandByPoint(kr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new R,1/0);else if(e){let n=this.boundingSphere.center;if(kr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ar.setFromBufferAttribute(n),this.morphTargetsRelative?(jr.addVectors(kr.min,Ar.min),kr.expandByPoint(jr),jr.addVectors(kr.max,Ar.max),kr.expandByPoint(jr)):(kr.expandByPoint(Ar.min),kr.expandByPoint(Ar.max))}kr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)jr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(jr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)jr.fromBufferAttribute(a,t),o&&(Or.fromBufferAttribute(e,t),jr.add(Or)),r=Math.max(r,n.distanceToSquared(jr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv;this.hasAttribute(`tangent`)===!1&&this.setAttribute(`tangent`,new xr(new Float32Array(4*n.count),4));let a=this.getAttribute(`tangent`),o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new R,s[e]=new R;let c=new R,l=new R,u=new R,d=new L,f=new L,p=new L,m=new R,h=new R;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new R,y=new R,b=new R,x=new R;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0)n=new xr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new R,i=new R,a=new R,o=new R,s=new R,c=new R,l=new R,u=new R;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jr.fromBufferAttribute(e,t),jr.normalize(),e.setXYZ(t,jr.x,jr.y,jr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new xr(a,r,i)}if(this.index===null)return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:`dispose`})}},Nr=new V,Pr=new Sn,Fr=new mn,Ir=new R,Lr=new R,Rr=new R,zr=new R,Br=new R,Vr=new R,Hr=new R,Ur=new R,Wr=class extends Yn{constructor(e=new Mr,t=new _r){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Vr.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Br.fromBufferAttribute(s,e),a?Vr.addScaledVector(Br,r):Vr.addScaledVector(Br.sub(t),r))}t.add(Vr)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fr.copy(n.boundingSphere),Fr.applyMatrix4(i),Pr.copy(e.ray).recast(e.near),!(Fr.containsPoint(Pr.origin)===!1&&(Pr.intersectSphere(Fr,Ir)===null||Pr.origin.distanceToSquared(Ir)>(e.far-e.near)**2))&&(Nr.copy(i).invert(),Pr.copy(e.ray).applyMatrix4(Nr),(n.boundingBox===null||Pr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Pr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Kr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Kr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Kr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Kr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Gr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Ur.copy(s),Ur.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Ur);return l<n.near||l>n.far?null:{distance:l,point:Ur.clone(),object:e}}function Kr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Lr),e.getVertexPosition(c,Rr),e.getVertexPosition(l,zr);let u=Gr(e,t,n,r,Lr,Rr,zr,Hr);if(u){let e=new R;lr.getBarycoord(Hr,Lr,Rr,zr,e),i&&(u.uv=lr.getInterpolatedAttribute(i,s,c,l,e,new L)),a&&(u.uv1=lr.getInterpolatedAttribute(a,s,c,l,e,new L)),o&&(u.normal=lr.getInterpolatedAttribute(o,s,c,l,e,new R),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new R,materialIndex:0};lr.getNormal(Lr,Rr,zr,t.normal),u.face=t,u.barycoord=e}return u}var qr=class e extends Mr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new wr(c,3)),this.setAttribute(`normal`,new wr(l,3)),this.setAttribute(`uv`,new wr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new R;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Jr(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone():Array.isArray(i)?t[n][r]=i.slice():t[n][r]=i}}return t}function Yr(e){let t={};for(let n=0;n<e.length;n++){let r=Jr(e[n]);for(let e in r)t[e]=r[e]}return t}function Xr(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Zr(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Nt.workingColorSpace}var Qr={clone:Jr,merge:Yr},$r=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ei=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ti=class extends gr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$r,this.fragmentShader=ei,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Jr(e.uniforms),this.uniformsGroups=Xr(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ni=class extends Yn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new V,this.projectionMatrix=new V,this.projectionMatrixInverse=new V,this.coordinateSystem=Ke,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ri=new R,ii=new L,ai=new L,oi=class extends ni{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ze*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Xe*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ze*2*Math.atan(Math.tan(Xe*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ri.x,ri.y).multiplyScalar(-e/ri.z),ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ri.x,ri.y).multiplyScalar(-e/ri.z)}getViewSize(e,t){return this.getViewBounds(e,ii,ai),t.subVectors(ai,ii)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Xe*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},si=-90,ci=1,li=class extends Yn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new oi(si,ci,e,t);r.layers=this.layers,this.add(r);let i=new oi(si,ci,e,t);i.layers=this.layers,this.add(i);let a=new oi(si,ci,e,t);a.layers=this.layers,this.add(a);let o=new oi(si,ci,e,t);o.layers=this.layers,this.add(o);let s=new oi(si,ci,e,t);s.layers=this.layers,this.add(s);let c=new oi(si,ci,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,i),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,s),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},ui=class extends Ut{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},di=class extends Gt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ui(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new qr(5,5,5),i=new ti({name:`CubemapFromEquirect`,uniforms:Jr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Wr(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=s),new li(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},fi=class extends Yn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},pi={type:`move`},mi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pi)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new fi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},hi=class extends Yn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mn,this.environmentIntensity=1,this.environmentRotation=new Mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},gi=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Ue,this.updateRanges=[],this.version=0,this.uuid=Qe()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qe()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qe()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},_i=new R,vi=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)_i.fromBufferAttribute(this,t),_i.applyMatrix4(e),this.setXYZ(t,_i.x,_i.y,_i.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_i.fromBufferAttribute(this,t),_i.applyNormalMatrix(e),this.setXYZ(t,_i.x,_i.y,_i.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_i.fromBufferAttribute(this,t),_i.transformDirection(e),this.setXYZ(t,_i.x,_i.y,_i.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=_t(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=_t(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=_t(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=_t(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=_t(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),r=vt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),r=vt(r,this.array),i=vt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){console.log(`THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new xr(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log(`THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},yi=new R,bi=new B,xi=new B,Si=new R,Ci=new V,wi=new R,Ti=new mn,Ei=new V,Di=new Sn,Oi=class extends Wr{constructor(t,n){super(t,n),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=e,this.bindMatrix=new V,this.bindMatrixInverse=new V,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Yt),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,wi),this.boundingBox.expandByPoint(wi)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new mn),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,wi),this.boundingSphere.expandByPoint(wi)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ti.copy(this.boundingSphere),Ti.applyMatrix4(r),e.ray.intersectsSphere(Ti)!==!1&&(Ei.copy(r).invert(),Di.copy(e.ray).applyMatrix4(Ei),(this.boundingBox===null||Di.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,Di)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new B,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn(`THREE.SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;bi.fromBufferAttribute(r.attributes.skinIndex,e),xi.fromBufferAttribute(r.attributes.skinWeight,e),yi.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let e=0;e<4;e++){let r=xi.getComponent(e);if(r!==0){let i=bi.getComponent(e);Ci.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(Si.copy(yi).applyMatrix4(Ci),r)}}return t.applyMatrix4(this.bindMatrixInverse)}},ki=class extends Yn{constructor(){super(),this.isBone=!0,this.type=`Bone`}},Ai=class extends Ut{constructor(e=null,t=1,n=1,r,a,o,s,c,l=i,u=i,d,f){super(null,o,s,c,l,u,r,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ji=new V,Mi=new V,Ni=class e{constructor(e=[],t=[]){this.uuid=Qe(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn(`THREE.Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new V)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new V;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:Mi;ji.multiplyMatrices(i,t[r]),ji.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Ai(t,e,e,T,g);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(console.warn(`THREE.Skeleton: No bone found with UUID:`,r),i=new ki),this.bones.push(i),this.boneInverses.push(new V().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},Pi=class extends xr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Fi=new V,Ii=new V,Li=[],Ri=new Yt,zi=new V,Bi=new Wr,Vi=new mn,Hi=class extends Wr{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Pi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,zi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Yt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fi),Ri.copy(e.boundingBox).applyMatrix4(Fi),this.boundingBox.union(Ri)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new mn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fi),Vi.copy(e.boundingSphere).applyMatrix4(Fi),this.boundingSphere.union(Vi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Bi.geometry=this.geometry,Bi.material=this.material,Bi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vi.copy(this.boundingSphere),Vi.applyMatrix4(n),e.ray.intersectsSphere(Vi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Fi),Ii.multiplyMatrices(n,Fi),Bi.matrixWorld=Ii,Bi.raycast(e,Li);for(let e=0,n=Li.length;e<n;e++){let n=Li[e];n.instanceId=i,n.object=this,t.push(n)}Li.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Pi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ai(new Float32Array(r*this.count),r,this.count,O,g));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;i[s]=o,i.set(n,s+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ui=new R,Wi=new R,Gi=new z,Ki=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ui.subVectors(n,t).cross(Wi.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Ui),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let i=-(e.start.dot(this.normal)+this.constant)/r;return i<0||i>1?null:t.copy(e.start).addScaledVector(n,i)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Gi.getNormalMatrix(e),r=this.coplanarPoint(Ui).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},qi=new mn,Ji=new L(.5,.5),Yi=new R,Xi=class{constructor(e=new Ki,t=new Ki,n=new Ki,r=new Ki,i=new Ki,a=new Ki){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ke,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(e){return qi.center.set(0,0,0),qi.radius=.7071067811865476+Ji.distanceTo(e.center),qi.applyMatrix4(e.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Yi.x=r.normal.x>0?e.max.x:e.min.x,Yi.y=r.normal.y>0?e.max.y:e.min.y,Yi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Yi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Zi=class extends gr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new H(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Qi=new R,$i=new R,ea=new V,ta=new Sn,na=new mn,ra=new R,ia=new R,aa=class extends Yn{constructor(e=new Mr,t=new Zi){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)Qi.fromBufferAttribute(t,e-1),$i.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=Qi.distanceTo($i);e.setAttribute(`lineDistance`,new wr(n,1))}else console.warn(`THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(r),na.radius+=i,e.ray.intersectsSphere(na)===!1)return;ea.copy(r).invert(),ta.copy(e.ray).applyMatrix4(ea);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=oa(this,e,ta,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=oa(this,e,ta,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=oa(this,e,ta,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=oa(this,e,ta,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function oa(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(Qi.fromBufferAttribute(s,i),$i.fromBufferAttribute(s,a),n.distanceSqToSegment(Qi,$i,ra,ia)>r)return;ra.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(ra);if(!(c<t.near||c>t.far))return{distance:c,point:ia.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var sa=new R,ca=new R,la=class extends aa{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)sa.fromBufferAttribute(t,e),ca.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+sa.distanceTo(ca);e.setAttribute(`lineDistance`,new wr(n,1))}else console.warn(`THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},ua=class extends aa{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},da=class extends gr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new H(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},fa=new V,pa=new Sn,ma=new mn,ha=new R,ga=class extends Yn{constructor(e=new Mr,t=new da){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ma.copy(n.boundingSphere),ma.applyMatrix4(r),ma.radius+=i,e.ray.intersectsSphere(ma)===!1)return;fa.copy(r).invert(),pa.copy(e.ray).applyMatrix4(fa);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);ha.fromBufferAttribute(l,n),_a(ha,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)ha.fromBufferAttribute(l,a),_a(ha,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function _a(e,t,n,r,i,a,o){let s=pa.distanceSqToPoint(e);if(s<n){let n=new R;pa.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var va=class extends Ut{constructor(e,t,n=h,r,a,o,s=i,c=i,l,u=E,d=1){if(u!==1026&&u!==1027)throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new zt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ya=class extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ba=class e extends Mr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new wr(u,3)),this.setAttribute(`normal`,new wr(d,3)),this.setAttribute(`uv`,new wr(f,2));function _(){let a=new R,_=new R,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new L,m=new R,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},xa=class e extends ba{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Sa=class e extends Mr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new wr(i,3)),this.setAttribute(`normal`,new wr(i.slice(),3)),this.setAttribute(`uv`,new wr(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new R,r=new R,i=new R;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new R;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new R;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new R,t=new R,n=new R,r=new R,o=new L,s=new L,c=new L;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.details)}},Ca=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn(`THREE.Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new L:new R);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new R,r=[],i=[],a=[],o=new R,s=new V;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new R)}i[0]=new R,a[0]=new R;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(I(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(I(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function wa(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}var Ta=class extends Ca{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new L){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(wa(o,s.x,c.x,l.x,u.x),wa(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new L().fromArray(n))}return this}},Ea=class e extends Sa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Da=class e extends Mr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new wr(p,3)),this.setAttribute(`normal`,new wr(m,3)),this.setAttribute(`uv`,new wr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Oa=class e extends Mr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i},n=Math.floor(n),r=Math.floor(r);let a=[],o=[],s=[],c=[],l=new R,u=new R,d=new R;for(let a=0;a<=n;a++)for(let f=0;f<=r;f++){let p=f/r*i,m=a/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(p),u.y=(e+t*Math.cos(m))*Math.sin(p),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),l.x=e*Math.cos(p),l.y=e*Math.sin(p),d.subVectors(u,l).normalize(),s.push(d.x,d.y,d.z),c.push(f/r),c.push(a/n)}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,o=(r+1)*(e-1)+t,s=(r+1)*e+t;a.push(n,i,s),a.push(i,o,s)}this.setIndex(a),this.setAttribute(`position`,new wr(o,3)),this.setAttribute(`normal`,new wr(s,3)),this.setAttribute(`uv`,new wr(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},ka=class extends ti{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Aa=class extends gr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new H(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new H(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new L(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ja=class extends Aa{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new L(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return I(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new H(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new H(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new H(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Ma=class extends gr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Ie,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Na=class extends gr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Pa(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Fa(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Ia(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r}function La(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i}function Ra(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0){if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push(...o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}}var za=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`call to abstract method`)}intervalChanged_(){}},Ba=class extends za{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Me,endingEnd:Me}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ne:i=e,o=2*t-n;break;case Pe:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Ne:a=e,s=2*n-t;break;case Pe:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Va=class extends za{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Ha=class extends za{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ua=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Pa(t,this.TimeBufferType),this.values=Pa(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Pa(e.times,Array),values:Pa(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Va(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ba(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ke:t=this.InterpolantFactoryMethodDiscrete;break;case Ae:t=this.InterpolantFactoryMethodLinear;break;case je:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return console.warn(`THREE.KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ke;case this.InterpolantFactoryMethodLinear:return Ae;case this.InterpolantFactoryMethodSmooth:return je}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error(`THREE.KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(console.error(`THREE.KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){console.error(`THREE.KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){console.error(`THREE.KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Fa(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){console.error(`THREE.KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===je,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Ua.prototype.ValueTypeName=``,Ua.prototype.TimeBufferType=Float32Array,Ua.prototype.ValueBufferType=Float32Array,Ua.prototype.DefaultInterpolation=Ae;var Wa=class extends Ua{constructor(e,t,n){super(e,t,n)}};Wa.prototype.ValueTypeName=`bool`,Wa.prototype.ValueBufferType=Array,Wa.prototype.DefaultInterpolation=ke,Wa.prototype.InterpolantFactoryMethodLinear=void 0,Wa.prototype.InterpolantFactoryMethodSmooth=void 0;var Ga=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}};Ga.prototype.ValueTypeName=`color`;var Ka=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}};Ka.prototype.ValueTypeName=`number`;var qa=class extends za{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)bt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Ja=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new qa(this.times,this.values,this.getValueSize(),e)}};Ja.prototype.ValueTypeName=`quaternion`,Ja.prototype.InterpolantFactoryMethodSmooth=void 0;var Ya=class extends Ua{constructor(e,t,n){super(e,t,n)}};Ya.prototype.ValueTypeName=`string`,Ya.prototype.ValueBufferType=Array,Ya.prototype.DefaultInterpolation=ke,Ya.prototype.InterpolantFactoryMethodLinear=void 0,Ya.prototype.InterpolantFactoryMethodSmooth=void 0;var Xa=class extends Ua{constructor(e,t,n,r){super(e,t,n,r)}};Xa.prototype.ValueTypeName=`vector`;var Za=class{constructor(e=``,t=-1,n=[],r=Fe){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=Qe(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push($a(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i.userData=JSON.parse(e.userData||`{}`),i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let e=0,r=n.length;e!==r;++e)t.push(Ua.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=Ia(o);o=La(o,1,c),s=La(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new Ka(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}static parseAnimation(e,t){if(console.warn(`THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185`),!e)return console.error(`THREE.AnimationClip: No animation in JSONLoader data.`),null;let n=function(e,t,n,r,i){if(n.length!==0){let a=[],o=[];Ra(n,a,o,r),a.length!==0&&i.push(new e(t,a,o))}},r=[],i=e.name||`default`,a=e.fps||30,o=e.blendMode,s=e.length||-1,c=e.hierarchy||[];for(let e=0;e<c.length;e++){let i=c[e].keys;if(i&&i.length!==0){if(i[0].morphTargets){let e={},t=0;for(;t<i.length;t++)if(i[t].morphTargets)for(let n=0;n<i[t].morphTargets.length;n++)e[i[t].morphTargets[n]]=-1;for(let n in e){let e=[],a=[];for(let r=0;r!==i[t].morphTargets.length;++r){let r=i[t];e.push(r.time),a.push(+(r.morphTarget===n))}r.push(new Ka(`.morphTargetInfluence[`+n+`]`,e,a))}s=e.length*a}else{let a=`.bones[`+t[e].name+`]`;n(Xa,a+`.position`,i,`pos`,r),n(Ja,a+`.quaternion`,i,`rot`,r),n(Xa,a+`.scale`,i,`scl`,r)}}}return r.length===0?null:new this(i,s,r,o)}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Qa(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return Ka;case`vector`:case`vector2`:case`vector3`:case`vector4`:return Xa;case`color`:return Ga;case`quaternion`:return Ja;case`bool`:case`boolean`:return Wa;case`string`:return Ya}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function $a(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=Qa(e.type);if(e.times===void 0){let t=[],n=[];Ra(e.keys,t,n,`value`),e.times=t,e.values=n}return t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e)}var eo={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(this.files[e]=t)},get:function(e){if(this.enabled!==!1)return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}},to=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},no=class{constructor(e){this.manager=e===void 0?to:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};no.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var ro={},io=class extends Error{constructor(e,t){super(e),this.response=t}},ao=class extends no{constructor(e){super(e),this.mimeType=``,this.responseType=``,this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=eo.get(`file:${e}`);if(i!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0),i;if(ro[e]!==void 0){ro[e].push({onLoad:t,onProgress:n,onError:r});return}ro[e]=[],ro[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`,signal:typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&console.warn(`THREE.FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=ro[e],r=t.body.getReader(),i=t.headers.get(`X-File-Size`)||t.headers.get(`Content-Length`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}},t=>{e.error(t)})}}});return new Response(c)}throw new io(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===``)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{eo.add(`file:${e}`,t);let n=ro[e];delete ro[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=ro[e];if(n===void 0)throw this.manager.itemError(e),t;delete ro[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},oo=new WeakMap,so=class extends no{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=eo.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=oo.get(a);e===void 0&&(e=[],oo.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Tt(`img`);function s(){l(),t&&t(this);let n=oo.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}oo.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),eo.remove(`image:${e}`);let n=oo.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}oo.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),eo.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},co=class extends no{constructor(e){super(e)}load(e,t,n,r){let i=new Ut,a=new so(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},lo=class extends Yn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new H(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},uo=new V,fo=new R,po=new R,mo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new L(512,512),this.mapType=u,this.map=null,this.mapPass=null,this.matrix=new V,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xi,this._frameExtents=new L(1,1),this._viewportCount=1,this._viewports=[new B(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;fo.setFromMatrixPosition(e.matrixWorld),t.position.copy(fo),po.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(po),t.updateMatrixWorld(),uo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(uo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ho=class extends mo{constructor(){super(new oi(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ze*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},go=class extends lo{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(Yn.DEFAULT_UP),this.updateMatrix(),this.target=new Yn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new ho}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},_o=new V,vo=new R,yo=new R,bo=class extends mo{constructor(){super(new oi(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new L(4,2),this._viewportCount=6,this._viewports=[new B(2,1,1,1),new B(0,1,1,1),new B(3,1,1,1),new B(1,1,1,1),new B(3,0,1,1),new B(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,i=e.distance||n.far;i!==n.far&&(n.far=i,n.updateProjectionMatrix()),vo.setFromMatrixPosition(e.matrixWorld),n.position.copy(vo),yo.copy(n.position),yo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(yo),n.updateMatrixWorld(),r.makeTranslation(-vo.x,-vo.y,-vo.z),_o.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_o,n.coordinateSystem,n.reversedDepth)}},xo=class extends lo{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new bo}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},So=class extends ni{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Co=class extends mo{constructor(){super(new So(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},wo=class extends lo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Yn.DEFAULT_UP),this.updateMatrix(),this.target=new Yn,this.shadow=new Co}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},To=class{static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.slice(0,t+1)}static resolveURL(e,t){return typeof e!=`string`||e===``?``:(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,`$1`)),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Eo=class extends Mr{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type=`InstancedBufferGeometry`,this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},Do=new WeakMap,Oo=class extends no{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>`u`&&console.warn(`THREE.ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&console.warn(`THREE.ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=eo.get(`image-bitmap:${e}`);if(a!==void 0){if(i.manager.itemStart(e),a.then){a.then(n=>{if(Do.has(a)===!0)r&&r(Do.get(a)),i.manager.itemError(e),i.manager.itemEnd(e);else return t&&t(n),i.manager.itemEnd(e),n});return}return setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a}let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader,o.signal=typeof AbortSignal.any==`function`?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let s=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign(i.options,{colorSpaceConversion:`none`}))}).then(function(n){return eo.add(`image-bitmap:${e}`,n),t&&t(n),i.manager.itemEnd(e),n}).catch(function(t){r&&r(t),Do.set(s,t),eo.remove(`image-bitmap:${e}`),i.manager.itemError(e),i.manager.itemEnd(e)});eo.add(`image-bitmap:${e}`,s),i.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},ko=class extends oi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ao=`\\[\\]\\.:\\/`,jo=RegExp(`[\\[\\]\\.:\\/]`,`g`),Mo=`[^\\[\\]\\.:\\/]`,No=`[^`+Ao.replace(`\\.`,``)+`]`,Po=`((?:WC+[\\/:])*)`.replace(`WC`,Mo),Fo=`(WCOD+)?`.replace(`WCOD`,No),Io=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Mo),Lo=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Mo),Ro=RegExp(`^`+Po+Fo+Io+Lo+`$`),zo=[`material`,`materials`,`bones`,`map`],Bo=class{constructor(e,t,n){let r=n||Vo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Vo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(jo,``)}static parseTrackName(e){let t=Ro.exec(e);if(t===null)throw Error(`PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);zo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn(`THREE.PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){console.error(`THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;console.error(`THREE.PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Vo.Composite=Bo,Vo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Vo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Vo.prototype.GetterByBindingType=[Vo.prototype._getValue_direct,Vo.prototype._getValue_array,Vo.prototype._getValue_arrayElement,Vo.prototype._getValue_toArray],Vo.prototype.SetterByBindingTypeAndVersioning=[[Vo.prototype._setValue_direct,Vo.prototype._setValue_direct_setNeedsUpdate,Vo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Vo.prototype._setValue_array,Vo.prototype._setValue_array_setNeedsUpdate,Vo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Vo.prototype._setValue_arrayElement,Vo.prototype._setValue_arrayElement_setNeedsUpdate,Vo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Vo.prototype._setValue_fromArray,Vo.prototype._setValue_fromArray_setNeedsUpdate,Vo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ho=new L,Uo=class{constructor(e=new L(1/0,1/0),t=new L(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Ho.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ho).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}};function Wo(e,t,n,r){let i=Go(r);switch(n){case C:return e*t;case O:return e*t/i.components*i.byteLength;case k:return e*t/i.components*i.byteLength;case A:return e*t*2/i.components*i.byteLength;case ee:return e*t*2/i.components*i.byteLength;case w:return e*t*3/i.components*i.byteLength;case T:return e*t*4/i.components*i.byteLength;case te:return e*t*4/i.components*i.byteLength;case j:case ne:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case re:case M:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ae:case se:return Math.max(e,16)*Math.max(t,8)/4;case ie:case oe:return Math.max(e,8)*Math.max(t,8)/2;case ce:case le:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ue:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fe:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case pe:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case me:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case he:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ge:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case N:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ve:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ye:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case be:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case P:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case xe:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case F:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Se:case Ce:case we:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Te:case Ee:return Math.ceil(e/4)*Math.ceil(t/4)*8;case De:case Oe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Go(e){switch(e){case u:case d:return{byteLength:1,components:1};case p:case f:case _:return{byteLength:2,components:1};case v:case y:return{byteLength:2,components:4};case h:case m:case g:return{byteLength:4,components:1};case x:case S:return{byteLength:4,components:3}}throw Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`180`}})),typeof window<`u`&&(window.__THREE__?console.warn(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`180`);function Ko(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function qo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var U={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},W={common:{diffuse:{value:new H(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new z},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new z}},envmap:{envMap:{value:null},envMapRotation:{value:new z},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new z}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new z}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new z},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new z},normalScale:{value:new L(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new z},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new z}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new z}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new z}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new H(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new H(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0},uvTransform:{value:new z}},sprite:{diffuse:{value:new H(16777215)},opacity:{value:1},center:{value:new L(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new z},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0}}},Jo={basic:{uniforms:Yr([W.common,W.specularmap,W.envmap,W.aomap,W.lightmap,W.fog]),vertexShader:U.meshbasic_vert,fragmentShader:U.meshbasic_frag},lambert:{uniforms:Yr([W.common,W.specularmap,W.envmap,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.fog,W.lights,{emissive:{value:new H(0)}}]),vertexShader:U.meshlambert_vert,fragmentShader:U.meshlambert_frag},phong:{uniforms:Yr([W.common,W.specularmap,W.envmap,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.fog,W.lights,{emissive:{value:new H(0)},specular:{value:new H(1118481)},shininess:{value:30}}]),vertexShader:U.meshphong_vert,fragmentShader:U.meshphong_frag},standard:{uniforms:Yr([W.common,W.envmap,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.roughnessmap,W.metalnessmap,W.fog,W.lights,{emissive:{value:new H(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:U.meshphysical_vert,fragmentShader:U.meshphysical_frag},toon:{uniforms:Yr([W.common,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.gradientmap,W.fog,W.lights,{emissive:{value:new H(0)}}]),vertexShader:U.meshtoon_vert,fragmentShader:U.meshtoon_frag},matcap:{uniforms:Yr([W.common,W.bumpmap,W.normalmap,W.displacementmap,W.fog,{matcap:{value:null}}]),vertexShader:U.meshmatcap_vert,fragmentShader:U.meshmatcap_frag},points:{uniforms:Yr([W.points,W.fog]),vertexShader:U.points_vert,fragmentShader:U.points_frag},dashed:{uniforms:Yr([W.common,W.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:U.linedashed_vert,fragmentShader:U.linedashed_frag},depth:{uniforms:Yr([W.common,W.displacementmap]),vertexShader:U.depth_vert,fragmentShader:U.depth_frag},normal:{uniforms:Yr([W.common,W.bumpmap,W.normalmap,W.displacementmap,{opacity:{value:1}}]),vertexShader:U.meshnormal_vert,fragmentShader:U.meshnormal_frag},sprite:{uniforms:Yr([W.sprite,W.fog]),vertexShader:U.sprite_vert,fragmentShader:U.sprite_frag},background:{uniforms:{uvTransform:{value:new z},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:U.background_vert,fragmentShader:U.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new z}},vertexShader:U.backgroundCube_vert,fragmentShader:U.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:U.cube_vert,fragmentShader:U.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:U.equirect_vert,fragmentShader:U.equirect_frag},distanceRGBA:{uniforms:Yr([W.common,W.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:U.distanceRGBA_vert,fragmentShader:U.distanceRGBA_frag},shadow:{uniforms:Yr([W.lights,W.fog,{color:{value:new H(0)},opacity:{value:1}}]),vertexShader:U.shadow_vert,fragmentShader:U.shadow_frag}};Jo.physical={uniforms:Yr([Jo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new z},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new z},clearcoatNormalScale:{value:new L(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new z},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new z},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new z},sheen:{value:0},sheenColor:{value:new H(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new z},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new z},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new z},transmissionSamplerSize:{value:new L},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new z},attenuationDistance:{value:0},attenuationColor:{value:new H(0)},specularColor:{value:new H(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new z},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new z},anisotropyVector:{value:new L},anisotropyMap:{value:null},anisotropyMapTransform:{value:new z}}]),vertexShader:U.meshphysical_vert,fragmentShader:U.meshphysical_frag};var Yo={r:0,b:0,g:0},Xo=new Mn,Zo=new V;function Qo(e,t,n,r,i,a,o){let s=new H(0),c=a===!0?0:1,l,u,d=null,f=0,p=null;function m(e){let r=e.isScene===!0?e.background:null;return r&&r.isTexture&&(r=(e.backgroundBlurriness>0?n:t).get(r)),r}function h(t){let n=!1,i=m(t);i===null?_(s,c):i&&i.isColor&&(_(i,1),n=!0);let a=e.xr.getEnvironmentBlendMode();a===`additive`?r.buffers.color.setClear(0,0,0,1,o):a===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(e.autoClear||n)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let r=m(n);r&&(r.isCubeTexture||r.mapping===306)?(u===void 0&&(u=new Wr(new qr(1,1,1),new ti({name:`BackgroundCubeMaterial`,uniforms:Jr(Jo.backgroundCube.uniforms),vertexShader:Jo.backgroundCube.vertexShader,fragmentShader:Jo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),Xo.copy(n.backgroundRotation),Xo.x*=-1,Xo.y*=-1,Xo.z*=-1,r.isCubeTexture&&r.isRenderTargetTexture===!1&&(Xo.y*=-1,Xo.z*=-1),u.material.uniforms.envMap.value=r,u.material.uniforms.flipEnvMap.value=r.isCubeTexture&&r.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Zo.makeRotationFromEuler(Xo)),u.material.toneMapped=Nt.getTransfer(r.colorSpace)!==Ve,(d!==r||f!==r.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),u.layers.enableAll(),t.unshift(u,u.geometry,u.material,0,0,null)):r&&r.isTexture&&(l===void 0&&(l=new Wr(new Da(2,2),new ti({name:`BackgroundMaterial`,uniforms:Jr(Jo.background.uniforms),vertexShader:Jo.background.vertexShader,fragmentShader:Jo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=r,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.toneMapped=Nt.getTransfer(r.colorSpace)!==Ve,r.matrixAutoUpdate===!0&&r.updateMatrix(),l.material.uniforms.uvTransform.value.copy(r.matrix),(d!==r||f!==r.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null))}function _(t,n){t.getRGB(Yo,Zr(e)),r.buffers.color.setClear(Yo.r,Yo.g,Yo.b,n,o)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,_(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,_(s,c)},render:h,addToRenderList:g,dispose:v}}function $o(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n){let i=n.wireframe===!0,a=r[e.id];a===void 0&&(a={},r[e.id]=a);let o=a[t.id];o===void 0&&(o={},a[t.id]=o);let s=o[i];return s===void 0&&(s=f(c()),o[i]=s),s}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){w();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e.id]}function C(e){for(let t in r){let n=r[t];if(n[e.id]===void 0)continue;let i=n[e.id];for(let e in i)u(i[e].object),delete i[e];delete n[e.id]}}function w(){T(),o=!0,a!==i&&(a=i,l(a.object))}function T(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:w,resetDefaultState:T,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function es(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}function c(e,i,a,s){if(a===0)return;let c=t.get(`WEBGL_multi_draw`);if(c===null)for(let t=0;t<e.length;t++)o(e[t],i[t],s[t]);else{c.multiDrawArraysInstancedWEBGL(r,e,0,i,0,s,0,a);let t=0;for(let e=0;e<a;e++)t+=i[e]*s[e];n.update(t,r,1)}}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s,this.renderMultiDrawInstances=c}function ts(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(console.warn(`THREE.WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=m>0,S=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,vertexTextures:x,maxSamples:S}}function ns(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Ki,s=new z,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}function rs(e){let t=new WeakMap;function n(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function r(r){if(r&&r.isTexture){let a=r.mapping;if(a===303||a===304){if(t.has(r)){let e=t.get(r).texture;return n(e,r.mapping)}{let a=r.image;if(a&&a.height>0){let o=new di(a.height);return o.fromEquirectangularTexture(e,r),t.set(r,o),r.addEventListener(`dispose`,i),n(o.texture,r.mapping)}return null}}}return r}function i(e){let n=e.target;n.removeEventListener(`dispose`,i);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function a(){t=new WeakMap}return{get:r,dispose:a}}var is=4,as=[.125,.215,.35,.446,.526,.582],os=20,ss=new So,cs=new H,ls=null,us=0,ds=0,fs=!1,ps=(1+Math.sqrt(5))/2,ms=1/ps,hs=[new R(-ps,ms,0),new R(ps,ms,0),new R(-ms,0,ps),new R(ms,0,ps),new R(0,ps,-ms),new R(0,ps,ms),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],gs=new R,_s=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=gs}=i;ls=this._renderer.getRenderTarget(),us=this._renderer.getActiveCubeFace(),ds=this._renderer.getActiveMipmapLevel(),fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cs(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ss(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ls,us,ds),this._renderer.xr.enabled=fs,e.scissorTest=!1,bs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ls=this._renderer.getRenderTarget(),us=this._renderer.getActiveCubeFace(),ds=this._renderer.getActiveMipmapLevel(),fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:s,minFilter:s,generateMipmaps:!1,type:_,format:T,colorSpace:ze,depthBuffer:!1},r=ys(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ys(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=vs(r)),this._blurMaterial=xs(r,e,t)}return r}_compileMaterial(e){let t=new Wr(this._lodPlanes[0],e);this._renderer.compile(t,ss)}_sceneToCubeUV(e,t,n,r,i){let a=new oi(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(cs),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null));let d=new _r({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1}),f=new Wr(new qr,d),p=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,p=!0):(d.color.copy(cs),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;bs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(f,a),c.render(e,a)}f.geometry.dispose(),f.material.dispose(),c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cs()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ss());let i=r?this._cubemapMaterial:this._equirectMaterial,a=new Wr(this._lodPlanes[0],i),o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;bs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,ss)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let t=1;t<r;t++){let n=Math.sqrt(this._sigmas[t]*this._sigmas[t]-this._sigmas[t-1]*this._sigmas[t-1]),i=hs[(r-t-1)%hs.length];this._blur(e,t-1,t,n,i)}t.autoClear=n}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&console.error(`blur direction must be either latitudinal or longitudinal!`);let l=new Wr(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):os;m>os&&console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${os}`);let h=[],g=0;for(let e=0;e<os;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];bs(t,3*v*(r>_-is?r-_+is:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,ss)}};function vs(e){let t=[],n=[],r=[],i=e,a=e-is+1+as.length;for(let o=0;o<a;o++){let a=2**i;n.push(a);let s=1/a;o>e-is?s=as[o-e+is-1]:o===0&&(s=0),r.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Mr;h.setAttribute(`position`,new xr(f,3)),h.setAttribute(`uv`,new xr(p,2)),h.setAttribute(`faceIndex`,new xr(m,1)),t.push(h),i>is&&i--}return{lodPlanes:t,sizeLods:n,sigmas:r}}function ys(e,t,n){let r=new Gt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function bs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function xs(e,t,n){let r=new Float32Array(os),i=new R(0,1,0);return new ti({name:`SphericalGaussianBlur`,defines:{n:os,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ws(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ss(){return new ti({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:ws(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Cs(){return new ti({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ws(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ws(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ts(e){let t=new WeakMap,n=null;function r(r){if(r&&r.isTexture){let o=r.mapping,s=o===303||o===304,c=o===301||o===302;if(s||c){let o=t.get(r),l=o===void 0?0:o.texture.pmremVersion;if(r.isRenderTargetTexture&&r.pmremVersion!==l)return n===null&&(n=new _s(e)),o=s?n.fromEquirectangular(r,o):n.fromCubemap(r,o),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),o.texture;if(o!==void 0)return o.texture;{let l=r.image;return s&&l&&l.height>0||c&&l&&i(l)?(n===null&&(n=new _s(e)),o=s?n.fromEquirectangular(r):n.fromCubemap(r),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),r.addEventListener(`dispose`,a),o.texture):null}}}return r}function i(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function a(e){let n=e.target;n.removeEventListener(`dispose`,a);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function o(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:o}}function Es(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r;switch(n){case`WEBGL_depth_texture`:r=e.getExtension(`WEBGL_depth_texture`)||e.getExtension(`MOZ_WEBGL_depth_texture`)||e.getExtension(`WEBKIT_WEBGL_depth_texture`);break;case`EXT_texture_filter_anisotropic`:r=e.getExtension(`EXT_texture_filter_anisotropic`)||e.getExtension(`MOZ_EXT_texture_filter_anisotropic`)||e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);break;case`WEBGL_compressed_texture_s3tc`:r=e.getExtension(`WEBGL_compressed_texture_s3tc`)||e.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);break;case`WEBGL_compressed_texture_pvrtc`:r=e.getExtension(`WEBGL_compressed_texture_pvrtc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);break;default:r=e.getExtension(n)}return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Ot(`THREE.WebGLRenderer: `+e+` extension not supported.`),t}}}function Ds(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else if(i!==void 0){let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}else return;let s=new(wt(n)?Cr:Sr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Os(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}function d(e,i,s,c){if(s===0)return;let u=t.get(`WEBGL_multi_draw`);if(u===null)for(let t=0;t<e.length;t++)l(e[t]/o,i[t],c[t]);else{u.multiDrawElementsInstancedWEBGL(r,i,0,a,e,0,c,0,s);let t=0;for(let e=0;e<s;e++)t+=i[e]*c[e];n.update(t,r,1)}}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function ks(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:console.error(`THREE.WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function As(e,t,n){let r=new WeakMap,i=new B;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),_=new Kt(h,p,m,u);_.type=g,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new L(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function js(e,t,n,r){let i=new WeakMap;function a(a){let o=r.render.frame,c=a.geometry,l=t.get(a,c);if(i.get(l)!==o&&(t.update(l),i.set(l,o)),a.isInstancedMesh&&(a.hasEventListener(`dispose`,s)===!1&&a.addEventListener(`dispose`,s),i.get(a)!==o&&(n.update(a.instanceMatrix,e.ARRAY_BUFFER),a.instanceColor!==null&&n.update(a.instanceColor,e.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let e=a.skeleton;i.get(e)!==o&&(e.update(),i.set(e,o))}return l}function o(){i=new WeakMap}function s(e){let t=e.target;t.removeEventListener(`dispose`,s),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:a,dispose:o}}var Ms=new Ut,Ns=new va(1,1),Ps=new Kt,Fs=new Jt,Is=new ui,Ls=[],Rs=[],zs=new Float32Array(16),Bs=new Float32Array(9),Vs=new Float32Array(4);function Hs(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ls[i];if(a===void 0&&(a=new Float32Array(i),Ls[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Us(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Ws(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Gs(e,t){let n=Rs[t];n===void 0&&(n=new Int32Array(t),Rs[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Ks(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function qs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Us(n,t))return;e.uniform2fv(this.addr,t),Ws(n,t)}}function Js(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Us(n,t))return;e.uniform3fv(this.addr,t),Ws(n,t)}}function Ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Us(n,t))return;e.uniform4fv(this.addr,t),Ws(n,t)}}function Xs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Us(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ws(n,t)}else{if(Us(n,r))return;Vs.set(r),e.uniformMatrix2fv(this.addr,!1,Vs),Ws(n,r)}}function Zs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Us(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ws(n,t)}else{if(Us(n,r))return;Bs.set(r),e.uniformMatrix3fv(this.addr,!1,Bs),Ws(n,r)}}function Qs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Us(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ws(n,t)}else{if(Us(n,r))return;zs.set(r),e.uniformMatrix4fv(this.addr,!1,zs),Ws(n,r)}}function $s(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function ec(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Us(n,t))return;e.uniform2iv(this.addr,t),Ws(n,t)}}function tc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Us(n,t))return;e.uniform3iv(this.addr,t),Ws(n,t)}}function nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Us(n,t))return;e.uniform4iv(this.addr,t),Ws(n,t)}}function rc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Us(n,t))return;e.uniform2uiv(this.addr,t),Ws(n,t)}}function ac(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Us(n,t))return;e.uniform3uiv(this.addr,t),Ws(n,t)}}function oc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Us(n,t))return;e.uniform4uiv(this.addr,t),Ws(n,t)}}function sc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Ns.compareFunction=515,a=Ns):a=Ms,n.setTexture2D(t||a,i)}function cc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Fs,i)}function lc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Is,i)}function uc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Ps,i)}function dc(e){switch(e){case 5126:return Ks;case 35664:return qs;case 35665:return Js;case 35666:return Ys;case 35674:return Xs;case 35675:return Zs;case 35676:return Qs;case 5124:case 35670:return $s;case 35667:case 35671:return ec;case 35668:case 35672:return tc;case 35669:case 35673:return nc;case 5125:return rc;case 36294:return ic;case 36295:return ac;case 36296:return oc;case 35678:case 36198:case 36298:case 36306:case 35682:return sc;case 35679:case 36299:case 36307:return cc;case 35680:case 36300:case 36308:case 36293:return lc;case 36289:case 36303:case 36311:case 36292:return uc}}function fc(e,t){e.uniform1fv(this.addr,t)}function pc(e,t){let n=Hs(t,this.size,2);e.uniform2fv(this.addr,n)}function mc(e,t){let n=Hs(t,this.size,3);e.uniform3fv(this.addr,n)}function hc(e,t){let n=Hs(t,this.size,4);e.uniform4fv(this.addr,n)}function gc(e,t){let n=Hs(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function _c(e,t){let n=Hs(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function vc(e,t){let n=Hs(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function yc(e,t){e.uniform1iv(this.addr,t)}function bc(e,t){e.uniform2iv(this.addr,t)}function xc(e,t){e.uniform3iv(this.addr,t)}function Sc(e,t){e.uniform4iv(this.addr,t)}function Cc(e,t){e.uniform1uiv(this.addr,t)}function wc(e,t){e.uniform2uiv(this.addr,t)}function Tc(e,t){e.uniform3uiv(this.addr,t)}function Ec(e,t){e.uniform4uiv(this.addr,t)}function Dc(e,t,n){let r=this.cache,i=t.length,a=Gs(n,i);Us(r,a)||(e.uniform1iv(this.addr,a),Ws(r,a));for(let e=0;e!==i;++e)n.setTexture2D(t[e]||Ms,a[e])}function Oc(e,t,n){let r=this.cache,i=t.length,a=Gs(n,i);Us(r,a)||(e.uniform1iv(this.addr,a),Ws(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Fs,a[e])}function kc(e,t,n){let r=this.cache,i=t.length,a=Gs(n,i);Us(r,a)||(e.uniform1iv(this.addr,a),Ws(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Is,a[e])}function Ac(e,t,n){let r=this.cache,i=t.length,a=Gs(n,i);Us(r,a)||(e.uniform1iv(this.addr,a),Ws(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Ps,a[e])}function jc(e){switch(e){case 5126:return fc;case 35664:return pc;case 35665:return mc;case 35666:return hc;case 35674:return gc;case 35675:return _c;case 35676:return vc;case 5124:case 35670:return yc;case 35667:case 35671:return bc;case 35668:case 35672:return xc;case 35669:case 35673:return Sc;case 5125:return Cc;case 36294:return wc;case 36295:return Tc;case 36296:return Ec;case 35678:case 36198:case 36298:case 36306:case 35682:return Dc;case 35679:case 36299:case 36307:return Oc;case 35680:case 36300:case 36308:case 36293:return kc;case 36289:case 36303:case 36311:case 36292:return Ac}}var Mc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=dc(t.type)}},Nc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=jc(t.type)}},Pc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Fc=/(\w+)(\])?(\[|\.)?/g;function Ic(e,t){e.seq.push(t),e.map[t.id]=t}function Lc(e,t,n){let r=e.name,i=r.length;for(Fc.lastIndex=0;;){let a=Fc.exec(r),o=Fc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Ic(n,l===void 0?new Mc(s,e,t):new Nc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Pc(s),Ic(n,e)),n=e}}}var Rc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Lc(n,e.getUniformLocation(t,n.name),this)}}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function zc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Bc=37297,Vc=0;function Hc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Uc=new z;function Wc(e){Nt._getMatrix(Uc,Nt.workingColorSpace,e);let t=`mat3( ${Uc.elements.map(e=>e.toFixed(4))} )`;switch(Nt.getTransfer(e)){case Be:return[t,`LinearTransferOETF`];case Ve:return[t,`sRGBTransferOETF`];default:return console.warn(`THREE.WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Gc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Hc(e.getShaderSource(t),r)}return i}function Kc(e,t){let n=Wc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}function qc(e,t){let n;switch(t){case 1:n=`Linear`;break;case 2:n=`Reinhard`;break;case 3:n=`Cineon`;break;case 4:n=`ACESFilmic`;break;case 6:n=`AgX`;break;case 7:n=`Neutral`;break;case 5:n=`Custom`;break;default:console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`,t),n=`Linear`}return`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Jc=new R;function Yc(){return Nt.getLuminanceCoefficients(Jc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Jc.x.toFixed(4)}, ${Jc.y.toFixed(4)}, ${Jc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Xc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter($c).join(`
`)}function Zc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Qc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function $c(e){return e!==``}function el(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function tl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var nl=/^[ \t]*#include +<([\w\d./]+)>/gm;function rl(e){return e.replace(nl,al)}var il=new Map;function al(e,t){let n=U[t];if(n===void 0){let e=il.get(t);if(e!==void 0)n=U[e],console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return rl(n)}var ol=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sl(e){return e.replace(ol,cl)}function cl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ll(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}function ul(e){let t=`SHADOWMAP_TYPE_BASIC`;return e.shadowMapType===1?t=`SHADOWMAP_TYPE_PCF`:e.shadowMapType===2?t=`SHADOWMAP_TYPE_PCF_SOFT`:e.shadowMapType===3&&(t=`SHADOWMAP_TYPE_VSM`),t}function dl(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:t=`ENVMAP_TYPE_CUBE_UV`}return t}function fl(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:t=`ENVMAP_MODE_REFRACTION`}return t}function pl(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`}return t}function ml(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function hl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ul(n),l=dl(n),u=fl(n),d=pl(n),f=ml(n),p=Xc(n),m=Zc(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter($c).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter($c).join(`
`),_.length>0&&(_+=`
`)):(g=[ll(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter($c).join(`
`),_=[ll(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor||n.batchingColor?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:U.tonemapping_pars_fragment,n.toneMapping===0?``:qc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,U.colorspace_pars_fragment,Kc(`linearToOutputTexel`,n.outputColorSpace),Yc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter($c).join(`
`)),o=rl(o),o=el(o,n),o=tl(o,n),s=rl(s),s=el(s,n),s=tl(s,n),o=sl(o),s=sl(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=zc(i,i.VERTEX_SHADER,y),S=zc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Gc(i,x,`vertex`),n=Gc(i,S,`fragment`);console.error(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):console.warn(`THREE.WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Rc(i,h),T=Qc(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Bc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Vc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var gl=0,_l=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new vl(e),t.set(e,n)),n}},vl=class{constructor(e){this.id=gl++,this.code=e,this.usedTimes=0}};function yl(e,t,n,r,i,a,o){let s=new Nn,c=new _l,l=new Set,u=[],d=i.logarithmicDepthBuffer,f=i.vertexTextures,p=i.precision,m={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function h(e){return l.add(e),e===0?`uv`:`uv${e}`}function g(a,s,u,g,_){let v=g.fog,y=_.geometry,b=a.isMeshStandardMaterial?g.environment:null,x=(a.isMeshStandardMaterial?n:t).get(a.envMap||b),S=x&&x.mapping===306?x.image.height:null,C=m[a.type];a.precision!==null&&(p=i.getMaxPrecision(a.precision),p!==a.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,a.precision,`not supported, using`,p,`instead.`));let w=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,T=w===void 0?0:w.length,E=0;y.morphAttributes.position!==void 0&&(E=1),y.morphAttributes.normal!==void 0&&(E=2),y.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Jo[C];D=e.vertexShader,O=e.fragmentShader}else D=a.vertexShader,O=a.fragmentShader,c.update(a),k=c.getVertexShaderID(a),A=c.getFragmentShaderID(a);let ee=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),j=_.isInstancedMesh===!0,ne=_.isBatchedMesh===!0,re=!!a.map,M=!!a.matcap,ie=!!x,ae=!!a.aoMap,oe=!!a.lightMap,se=!!a.bumpMap,ce=!!a.normalMap,le=!!a.displacementMap,ue=!!a.emissiveMap,de=!!a.metalnessMap,fe=!!a.roughnessMap,pe=a.anisotropy>0,me=a.clearcoat>0,he=a.dispersion>0,ge=a.iridescence>0,_e=a.sheen>0,N=a.transmission>0,ve=pe&&!!a.anisotropyMap,ye=me&&!!a.clearcoatMap,be=me&&!!a.clearcoatNormalMap,P=me&&!!a.clearcoatRoughnessMap,xe=ge&&!!a.iridescenceMap,F=ge&&!!a.iridescenceThicknessMap,Se=_e&&!!a.sheenColorMap,Ce=_e&&!!a.sheenRoughnessMap,we=!!a.specularMap,Te=!!a.specularColorMap,Ee=!!a.specularIntensityMap,De=N&&!!a.transmissionMap,Oe=N&&!!a.thicknessMap,ke=!!a.gradientMap,Ae=!!a.alphaMap,je=a.alphaTest>0,Me=!!a.alphaHash,Ne=!!a.extensions,Pe=0;a.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Pe=e.toneMapping);let Fe={shaderID:C,shaderType:a.type,shaderName:a.name,vertexShader:D,fragmentShader:O,defines:a.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:a.isRawShaderMaterial===!0,glslVersion:a.glslVersion,precision:p,batching:ne,batchingColor:ne&&_._colorsTexture!==null,instancing:j,instancingColor:j&&_.instanceColor!==null,instancingMorph:j&&_.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:ze,alphaToCoverage:!!a.alphaToCoverage,map:re,matcap:M,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:ce,displacementMap:f&&le,emissiveMap:ue,normalMapObjectSpace:ce&&a.normalMapType===1,normalMapTangentSpace:ce&&a.normalMapType===0,metalnessMap:de,roughnessMap:fe,anisotropy:pe,anisotropyMap:ve,clearcoat:me,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:P,dispersion:he,iridescence:ge,iridescenceMap:xe,iridescenceThicknessMap:F,sheen:_e,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:Te,specularIntensityMap:Ee,transmission:N,transmissionMap:De,thicknessMap:Oe,gradientMap:ke,opaque:a.transparent===!1&&a.blending===1&&a.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:Me,combine:a.combine,mapUv:re&&h(a.map.channel),aoMapUv:ae&&h(a.aoMap.channel),lightMapUv:oe&&h(a.lightMap.channel),bumpMapUv:se&&h(a.bumpMap.channel),normalMapUv:ce&&h(a.normalMap.channel),displacementMapUv:le&&h(a.displacementMap.channel),emissiveMapUv:ue&&h(a.emissiveMap.channel),metalnessMapUv:de&&h(a.metalnessMap.channel),roughnessMapUv:fe&&h(a.roughnessMap.channel),anisotropyMapUv:ve&&h(a.anisotropyMap.channel),clearcoatMapUv:ye&&h(a.clearcoatMap.channel),clearcoatNormalMapUv:be&&h(a.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:P&&h(a.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&h(a.iridescenceMap.channel),iridescenceThicknessMapUv:F&&h(a.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&h(a.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&h(a.sheenRoughnessMap.channel),specularMapUv:we&&h(a.specularMap.channel),specularColorMapUv:Te&&h(a.specularColorMap.channel),specularIntensityMapUv:Ee&&h(a.specularIntensityMap.channel),transmissionMapUv:De&&h(a.transmissionMap.channel),thicknessMapUv:Oe&&h(a.thicknessMap.channel),alphaMapUv:Ae&&h(a.alphaMap.channel),vertexTangents:!!y.attributes.tangent&&(ce||pe),vertexColors:a.vertexColors,vertexAlphas:a.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,pointsUvs:_.isPoints===!0&&!!y.attributes.uv&&(re||Ae),fog:!!v,useFog:a.fog===!0,fogExp2:!!v&&v.isFogExp2,flatShading:a.flatShading===!0&&a.wireframe===!1,sizeAttenuation:a.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:_.isSkinnedMesh===!0,morphTargets:y.morphAttributes.position!==void 0,morphNormals:y.morphAttributes.normal!==void 0,morphColors:y.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:s.directional.length,numPointLights:s.point.length,numSpotLights:s.spot.length,numSpotLightMaps:s.spotLightMap.length,numRectAreaLights:s.rectArea.length,numHemiLights:s.hemi.length,numDirLightShadows:s.directionalShadowMap.length,numPointLightShadows:s.pointShadowMap.length,numSpotLightShadows:s.spotShadowMap.length,numSpotLightShadowsWithMaps:s.numSpotLightShadowsWithMaps,numLightProbes:s.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:a.dithering,shadowMapEnabled:e.shadowMap.enabled&&u.length>0,shadowMapType:e.shadowMap.type,toneMapping:Pe,decodeVideoTexture:re&&a.map.isVideoTexture===!0&&Nt.getTransfer(a.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ue&&a.emissiveMap.isVideoTexture===!0&&Nt.getTransfer(a.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:a.premultipliedAlpha,doubleSided:a.side===2,flipSided:a.side===1,useDepthPacking:a.depthPacking>=0,depthPacking:a.depthPacking||0,index0AttributeName:a.index0AttributeName,extensionClipCullDistance:Ne&&a.extensions.clipCullDistance===!0&&r.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ne&&a.extensions.multiDraw===!0||ne)&&r.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:r.has(`KHR_parallel_shader_compile`),customProgramCacheKey:a.customProgramCacheKey()};return Fe.vertexUv1s=l.has(1),Fe.vertexUv2s=l.has(2),Fe.vertexUv3s=l.has(3),l.clear(),Fe}function _(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(v(n,t),y(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function v(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function y(e,t){s.disableAll(),t.supportsVertexTextures&&s.enable(0),t.instancing&&s.enable(1),t.instancingColor&&s.enable(2),t.instancingMorph&&s.enable(3),t.matcap&&s.enable(4),t.envMap&&s.enable(5),t.normalMapObjectSpace&&s.enable(6),t.normalMapTangentSpace&&s.enable(7),t.clearcoat&&s.enable(8),t.iridescence&&s.enable(9),t.alphaTest&&s.enable(10),t.vertexColors&&s.enable(11),t.vertexAlphas&&s.enable(12),t.vertexUv1s&&s.enable(13),t.vertexUv2s&&s.enable(14),t.vertexUv3s&&s.enable(15),t.vertexTangents&&s.enable(16),t.anisotropy&&s.enable(17),t.alphaHash&&s.enable(18),t.batching&&s.enable(19),t.dispersion&&s.enable(20),t.batchingColor&&s.enable(21),t.gradientMap&&s.enable(22),e.push(s.mask),s.disableAll(),t.fog&&s.enable(0),t.useFog&&s.enable(1),t.flatShading&&s.enable(2),t.logarithmicDepthBuffer&&s.enable(3),t.reversedDepthBuffer&&s.enable(4),t.skinning&&s.enable(5),t.morphTargets&&s.enable(6),t.morphNormals&&s.enable(7),t.morphColors&&s.enable(8),t.premultipliedAlpha&&s.enable(9),t.shadowMapEnabled&&s.enable(10),t.doubleSided&&s.enable(11),t.flipSided&&s.enable(12),t.useDepthPacking&&s.enable(13),t.dithering&&s.enable(14),t.transmission&&s.enable(15),t.sheen&&s.enable(16),t.opaque&&s.enable(17),t.pointsUvs&&s.enable(18),t.decodeVideoTexture&&s.enable(19),t.decodeVideoTextureEmissive&&s.enable(20),t.alphaToCoverage&&s.enable(21),e.push(s.mask)}function b(e){let t=m[e.type],n;if(t){let e=Jo[t];n=Qr.clone(e.uniforms)}else n=e.uniforms;return n}function x(t,n){let r;for(let e=0,t=u.length;e<t;e++){let t=u[e];if(t.cacheKey===n){r=t,++r.usedTimes;break}}return r===void 0&&(r=new hl(e,n,t,a),u.push(r)),r}function S(e){if(--e.usedTimes===0){let t=u.indexOf(e);u[t]=u[u.length-1],u.pop(),e.destroy()}}function C(e){c.remove(e)}function w(){c.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:C,programs:u,dispose:w}}function bl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function xl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.z===t.z?e.id-t.id:e.z-t.z:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Sl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Cl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(n,r,i,a,o,s){let c=e[t];return c===void 0?(c={id:n.id,object:n,geometry:r,material:i,groupOrder:a,renderOrder:n.renderOrder,z:o,group:s},e[t]=c):(c.id=n.id,c.object=n,c.geometry=r,c.material=i,c.groupOrder=a,c.renderOrder=n.renderOrder,c.z=o,c.group=s),t++,c}function s(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function c(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function l(e,t){n.length>1&&n.sort(e||xl),r.length>1&&r.sort(t||Sl),i.length>1&&i.sort(t||Sl)}function u(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:s,unshift:c,finish:u,sort:l}}function wl(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Cl,e.set(t,[i])):n>=r.length?(i=new Cl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Tl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new R,color:new H};break;case`SpotLight`:n={position:new R,direction:new R,color:new H,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new R,color:new H,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new R,skyColor:new H,groundColor:new H};break;case`RectAreaLight`:n={color:new H,position:new R,halfWidth:new R,halfHeight:new R}}return e[t.id]=n,n}}}function El(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new L};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new L};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new L,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Dl=0;function Ol(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function kl(e){let t=new Tl,n=El(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new R);let i=new R,a=new V,o=new V;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Ol);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=W.LTC_FLOAT_1,r.rectAreaLTC2=W.LTC_FLOAT_2):(r.rectAreaLTC1=W.LTC_HALF_1,r.rectAreaLTC2=W.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Dl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Al(e){let t=new kl(e),n=[],r=[];function i(e){l.camera=e,n.length=0,r.length=0}function a(e){n.push(e)}function o(e){r.push(e)}function s(){t.setup(n)}function c(e){t.setupView(n,e)}let l={lightsArray:n,shadowsArray:r,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:s,setupLightsView:c,pushLight:a,pushShadow:o}}function jl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Al(e),t.set(n,[a])):r>=i.length?(a=new Al(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ml=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Nl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Pl(e,t,n){let r=new Xi,a=new L,o=new L,s=new B,c=new Ma({depthPacking:Le}),l=new Na,u={},d=n.maxTextureSize,f={0:1,1:0,2:2},p=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new L},radius:{value:4}},vertexShader:Ml,fragmentShader:Nl}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new Mr;h.setAttribute(`position`,new xr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new Wr(h,p),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let v=this.type;this.render=function(t,n,c){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||t.length===0)return;let l=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=v!==3&&this.type===3,h=v===3&&this.type!==3;for(let l=0,u=t.length;l<u;l++){let u=t[l],f=u.shadow;if(f===void 0){console.warn(`THREE.WebGLShadowMap:`,u,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;a.copy(f.mapSize);let g=f.getFrameExtents();if(a.multiply(g),o.copy(f.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(o.x=Math.floor(d/g.x),a.x=o.x*g.x,f.mapSize.x=o.x),a.y>d&&(o.y=Math.floor(d/g.y),a.y=o.y*g.y,f.mapSize.y=o.y)),f.map===null||m===!0||h===!0){let e=this.type===3?{}:{minFilter:i,magFilter:i};f.map!==null&&f.map.dispose(),f.map=new Gt(a.x,a.y,e),f.map.texture.name=u.name+`.shadowMap`,f.camera.updateProjectionMatrix()}e.setRenderTarget(f.map),e.clear();let _=f.getViewportCount();for(let e=0;e<_;e++){let t=f.getViewport(e);s.set(o.x*t.x,o.y*t.y,o.x*t.z,o.y*t.w),p.viewport(s),f.updateMatrices(u,e),r=f.getFrustum(),x(n,c,f.camera,u,this.type)}f.isPointLightShadow!==!0&&this.type===3&&y(f,c),f.needsUpdate=!1}v=this.type,_.needsUpdate=!1,e.setRenderTarget(l,u,f)};function y(n,r){let i=t.update(g);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Gt(a.x,a.y)),p.uniforms.shadow_pass.value=n.map.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,p,g,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,m,g,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=b(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)x(c[e],i,a,o,s)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}var Fl={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function Il(e,t){function n(){let t=!1,n=new B,r=null,i=new B(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ue(e.DEPTH_TEST):de(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Fl[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(r&&(t=1-t),e.clearDepth(t),o=t)},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ue(e.STENCIL_TEST):de(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new H(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,A=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),te=!1,j=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),te=j>=2):(j=parseFloat(/^WebGL (\d)/.exec(ne)[1]),te=j>=1);let re=null,M={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new B().fromArray(ie),se=new B().fromArray(ae);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ue(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),ue(e.CULL_FACE),_e(0);function ue(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function de(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function fe(t,n){return d[t]!==n&&(e.bindFramebuffer(t,n),d[t]=n,t===e.DRAW_FRAMEBUFFER&&(d[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(d[e.DRAW_FRAMEBUFFER]=n),!0)}function pe(t,n){let r=p,i=!1;if(t){r=f.get(n),r===void 0&&(r=[],f.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function me(t){return m!==t&&(e.useProgram(t),m=t,!0)}let he={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};he[103]=e.MIN,he[104]=e.MAX;let ge={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function _e(t,n,r,i,a,o,s,c,l,u){if(t===0)h===!0&&(de(e.BLEND),h=!1);else if(h===!1&&(ue(e.BLEND),h=!0),t!==5){if(t!==g||u!==T){if((_!==100||b!==100)&&(e.blendEquation(e.FUNC_ADD),_=100,b=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:console.error(`THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:console.error(`THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}v=null,y=null,x=null,S=null,C.set(0,0,0),w=0,g=t,T=u}}else a||=n,o||=r,s||=i,(n!==_||a!==b)&&(e.blendEquationSeparate(he[n],he[a]),_=n,b=a),(r!==v||i!==y||o!==x||s!==S)&&(e.blendFuncSeparate(ge[r],ge[i],ge[o],ge[s]),v=r,y=i,x=o,S=s),(c.equals(C)===!1||l!==w)&&(e.blendColor(c.r,c.g,c.b,l),C.copy(c),w=l),g=t,T=!1}function N(t,n){t.side===2?de(e.CULL_FACE):ue(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?_e(0):_e(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),P(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ue(e.SAMPLE_ALPHA_TO_COVERAGE):de(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){E!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),E=t)}function ye(t){t===0?de(e.CULL_FACE):(ue(e.CULL_FACE),t!==D&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),D=t}function be(t){t!==O&&(te&&e.lineWidth(t),O=t)}function P(t,n,r){t?(ue(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(e.polygonOffset(n,r),k=n,A=r)):de(e.POLYGON_OFFSET_FILL)}function xe(t){t?ue(e.SCISSOR_TEST):de(e.SCISSOR_TEST)}function F(t){t===void 0&&(t=e.TEXTURE0+ee-1),re!==t&&(e.activeTexture(t),re=t)}function Se(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+ee-1:re);let i=M[r];i===void 0&&(i={type:void 0,texture:void 0},M[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Ce(){let t=M[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function we(){try{e.compressedTexImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Te(){try{e.compressedTexImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ee(){try{e.texSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function De(){try{e.texSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ae(){try{e.texStorage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function je(){try{e.texStorage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Me(){try{e.texImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ne(){try{e.texImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Pe(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Fe(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function Ie(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Le(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Re(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},re=null,M={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new H(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,A=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ue,disable:de,bindFramebuffer:fe,drawBuffers:pe,useProgram:me,setBlending:_e,setMaterial:N,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:P,setScissorTest:xe,activeTexture:F,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:we,compressedTexImage3D:Te,texImage2D:Me,texImage3D:Ne,updateUBOMapping:Ie,uniformBlockBinding:Le,texStorage2D:Ae,texStorage3D:je,texSubImage2D:Ee,texSubImage3D:De,compressedTexSubImage2D:Oe,compressedTexSubImage3D:ke,scissor:Pe,viewport:Fe,reset:Re}}function Ll(e,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new L,y=new WeakMap,b,x=new WeakMap,S=!1;try{S=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function C(e,t){return S?new OffscreenCanvas(e,t):Tt(`canvas`)}function w(e,t,n){let r=1,i=Me(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);b===void 0&&(b=C(n,a));let o=t?C(n,a):b;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function T(e){return e.generateMipmaps}function E(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(t,n,r,i,a=!1){if(t!==null){if(e[t]!==void 0)return e[t];console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '`+t+`'`)}let o=n;if(n===e.RED&&(r===e.FLOAT&&(o=e.R32F),r===e.HALF_FLOAT&&(o=e.R16F),r===e.UNSIGNED_BYTE&&(o=e.R8)),n===e.RED_INTEGER&&(r===e.UNSIGNED_BYTE&&(o=e.R8UI),r===e.UNSIGNED_SHORT&&(o=e.R16UI),r===e.UNSIGNED_INT&&(o=e.R32UI),r===e.BYTE&&(o=e.R8I),r===e.SHORT&&(o=e.R16I),r===e.INT&&(o=e.R32I)),n===e.RG&&(r===e.FLOAT&&(o=e.RG32F),r===e.HALF_FLOAT&&(o=e.RG16F),r===e.UNSIGNED_BYTE&&(o=e.RG8)),n===e.RG_INTEGER&&(r===e.UNSIGNED_BYTE&&(o=e.RG8UI),r===e.UNSIGNED_SHORT&&(o=e.RG16UI),r===e.UNSIGNED_INT&&(o=e.RG32UI),r===e.BYTE&&(o=e.RG8I),r===e.SHORT&&(o=e.RG16I),r===e.INT&&(o=e.RG32I)),n===e.RGB_INTEGER&&(r===e.UNSIGNED_BYTE&&(o=e.RGB8UI),r===e.UNSIGNED_SHORT&&(o=e.RGB16UI),r===e.UNSIGNED_INT&&(o=e.RGB32UI),r===e.BYTE&&(o=e.RGB8I),r===e.SHORT&&(o=e.RGB16I),r===e.INT&&(o=e.RGB32I)),n===e.RGBA_INTEGER&&(r===e.UNSIGNED_BYTE&&(o=e.RGBA8UI),r===e.UNSIGNED_SHORT&&(o=e.RGBA16UI),r===e.UNSIGNED_INT&&(o=e.RGBA32UI),r===e.BYTE&&(o=e.RGBA8I),r===e.SHORT&&(o=e.RGBA16I),r===e.INT&&(o=e.RGBA32I)),n===e.RGB&&(r===e.UNSIGNED_INT_5_9_9_9_REV&&(o=e.RGB9_E5),r===e.UNSIGNED_INT_10F_11F_11F_REV&&(o=e.R11F_G11F_B10F)),n===e.RGBA){let t=a?Be:Nt.getTransfer(i);r===e.FLOAT&&(o=e.RGBA32F),r===e.HALF_FLOAT&&(o=e.RGBA16F),r===e.UNSIGNED_BYTE&&(o=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),r===e.UNSIGNED_SHORT_4_4_4_4&&(o=e.RGBA4),r===e.UNSIGNED_SHORT_5_5_5_1&&(o=e.RGB5_A1)}return(o===e.R16F||o===e.R32F||o===e.RG16F||o===e.RG32F||o===e.RGBA16F||o===e.RGBA32F)&&u.get(`EXT_color_buffer_float`),o}function A(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,console.warn(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ee(e,t){return T(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),ne(t),t.isVideoTexture&&y.delete(t)}function j(e){let t=e.target;t.removeEventListener(`dispose`,j),M(t)}function ne(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=x.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&re(e),Object.keys(r).length===0&&x.delete(n)}f.remove(e)}function re(t){let n=f.get(t);e.deleteTexture(n.__webglTexture);let r=t.source,i=x.get(r);delete i[n.__cacheKey],h.memory.textures--}function M(t){let n=f.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),f.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,n=r.length;t<n;t++){let n=f.get(r[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),f.remove(r[t])}f.remove(t)}let ie=0;function ae(){ie=0}function oe(){let e=ie;return e>=p.maxTextures&&console.warn(`THREE.WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),ie+=1,e}function se(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ce(t,n){let r=f.get(t);if(t.isVideoTexture&&Ae(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&r.__version!==t.version){let e=t.image;if(e===null)console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);else{ve(r,t,n);return}}else t.isExternalTexture&&(r.__webglTexture=t.sourceTexture?t.sourceTexture:null);d.bindTexture(e.TEXTURE_2D,r.__webglTexture,e.TEXTURE0+n)}function le(t,n){let r=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version?ve(r,t,n):d.bindTexture(e.TEXTURE_2D_ARRAY,r.__webglTexture,e.TEXTURE0+n)}function ue(t,n){let r=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version?ve(r,t,n):d.bindTexture(e.TEXTURE_3D,r.__webglTexture,e.TEXTURE0+n)}function de(t,n){let r=f.get(t);t.version>0&&r.__version!==t.version?ye(r,t,n):d.bindTexture(e.TEXTURE_CUBE_MAP,r.__webglTexture,e.TEXTURE0+n)}let fe={[t]:e.REPEAT,[n]:e.CLAMP_TO_EDGE,[r]:e.MIRRORED_REPEAT},pe={[i]:e.NEAREST,[a]:e.NEAREST_MIPMAP_NEAREST,[o]:e.NEAREST_MIPMAP_LINEAR,[s]:e.LINEAR,[c]:e.LINEAR_MIPMAP_NEAREST,[l]:e.LINEAR_MIPMAP_LINEAR},me={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function he(t,n){if(n.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(n.magFilter===1006||n.magFilter===1007||n.magFilter===1005||n.magFilter===1008||n.minFilter===1006||n.minFilter===1007||n.minFilter===1005||n.minFilter===1008)&&console.warn(`THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(t,e.TEXTURE_WRAP_S,fe[n.wrapS]),e.texParameteri(t,e.TEXTURE_WRAP_T,fe[n.wrapT]),(t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY)&&e.texParameteri(t,e.TEXTURE_WRAP_R,fe[n.wrapR]),e.texParameteri(t,e.TEXTURE_MAG_FILTER,pe[n.magFilter]),e.texParameteri(t,e.TEXTURE_MIN_FILTER,pe[n.minFilter]),n.compareFunction&&(e.texParameteri(t,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(t,e.TEXTURE_COMPARE_FUNC,me[n.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(n.magFilter===1003||n.minFilter!==1005&&n.minFilter!==1008||n.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(n.anisotropy>1||f.get(n).__currentAnisotropy){let r=u.get(`EXT_texture_filter_anisotropic`);e.texParameterf(t,r.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(n.anisotropy,p.getMaxAnisotropy())),f.get(n).__currentAnisotropy=n.anisotropy}}}function ge(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,te));let i=n.source,a=x.get(i);a===void 0&&(a={},x.set(i,a));let o=se(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&re(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function _e(e,t,n){return Math.floor(Math.floor(e/n)/t)}function N(t,n,r,i){let a=t.updateRanges;if(a.length===0)d.texSubImage2D(e.TEXTURE_2D,0,0,0,n.width,n.height,r,i,n.data);else{a.sort((e,t)=>e.start-t.start);let o=0;for(let e=1;e<a.length;e++){let t=a[o],r=a[e],i=t.start+t.count,s=_e(r.start,n.width,4),c=_e(t.start,n.width,4);r.start<=i+1&&s===c&&_e(r.start+r.count-1,n.width,4)===s?t.count=Math.max(t.count,r.start+r.count-t.start):(++o,a[o]=r)}a.length=o+1;let s=e.getParameter(e.UNPACK_ROW_LENGTH),c=e.getParameter(e.UNPACK_SKIP_PIXELS),l=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,n.width);for(let t=0,o=a.length;t<o;t++){let o=a[t],s=Math.floor(o.start/4),c=Math.ceil(o.count/4),l=s%n.width,u=Math.floor(s/n.width),f=c;e.pixelStorei(e.UNPACK_SKIP_PIXELS,l),e.pixelStorei(e.UNPACK_SKIP_ROWS,u),d.texSubImage2D(e.TEXTURE_2D,0,l,u,f,1,r,i,n.data)}t.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,s),e.pixelStorei(e.UNPACK_SKIP_PIXELS,c),e.pixelStorei(e.UNPACK_SKIP_ROWS,l)}}function ve(t,n,r){let i=e.TEXTURE_2D;(n.isDataArrayTexture||n.isCompressedArrayTexture)&&(i=e.TEXTURE_2D_ARRAY),n.isData3DTexture&&(i=e.TEXTURE_3D);let a=ge(t,n),o=n.source;d.bindTexture(i,t.__webglTexture,e.TEXTURE0+r);let s=f.get(o);if(o.version!==s.__version||a===!0){d.activeTexture(e.TEXTURE0+r);let t=Nt.getPrimaries(Nt.workingColorSpace),c=n.colorSpace===``?null:Nt.getPrimaries(n.colorSpace),l=n.colorSpace===``||t===c?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,l);let u=w(n.image,!1,p.maxTextureSize);u=je(n,u);let f=m.convert(n.format,n.colorSpace),h=m.convert(n.type),g=k(n.internalFormat,f,h,n.colorSpace,n.isVideoTexture);he(i,n);let _,v=n.mipmaps,y=n.isVideoTexture!==!0,b=s.__version===void 0||a===!0,x=o.dataReady,S=ee(n,u);if(n.isDepthTexture)g=A(n.format===D,n.type),b&&(y?d.texStorage2D(e.TEXTURE_2D,1,g,u.width,u.height):d.texImage2D(e.TEXTURE_2D,0,g,u.width,u.height,0,f,h,null));else if(n.isDataTexture){if(v.length>0){y&&b&&d.texStorage2D(e.TEXTURE_2D,S,g,v[0].width,v[0].height);for(let t=0,n=v.length;t<n;t++)_=v[t],y?x&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,_.width,_.height,f,h,_.data):d.texImage2D(e.TEXTURE_2D,t,g,_.width,_.height,0,f,h,_.data);n.generateMipmaps=!1}else y?(b&&d.texStorage2D(e.TEXTURE_2D,S,g,u.width,u.height),x&&N(n,u,f,h)):d.texImage2D(e.TEXTURE_2D,0,g,u.width,u.height,0,f,h,u.data)}else if(n.isCompressedTexture){if(n.isCompressedArrayTexture){y&&b&&d.texStorage3D(e.TEXTURE_2D_ARRAY,S,g,v[0].width,v[0].height,u.depth);for(let t=0,r=v.length;t<r;t++)if(_=v[t],n.format!==1023){if(f!==null){if(y){if(x){if(n.layerUpdates.size>0){let r=Wo(_.width,_.height,n.format,n.type);for(let i of n.layerUpdates){let n=_.data.subarray(i*r/_.data.BYTES_PER_ELEMENT,(i+1)*r/_.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,i,_.width,_.height,1,f,n)}n.clearLayerUpdates()}else d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,_.width,_.height,u.depth,f,_.data)}}else d.compressedTexImage3D(e.TEXTURE_2D_ARRAY,t,g,_.width,_.height,u.depth,0,_.data,0,0)}else console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else y?x&&d.texSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,_.width,_.height,u.depth,f,h,_.data):d.texImage3D(e.TEXTURE_2D_ARRAY,t,g,_.width,_.height,u.depth,0,f,h,_.data)}else{y&&b&&d.texStorage2D(e.TEXTURE_2D,S,g,v[0].width,v[0].height);for(let t=0,r=v.length;t<r;t++)_=v[t],n.format===1023?y?x&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,_.width,_.height,f,h,_.data):d.texImage2D(e.TEXTURE_2D,t,g,_.width,_.height,0,f,h,_.data):f===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):y?x&&d.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,_.width,_.height,f,_.data):d.compressedTexImage2D(e.TEXTURE_2D,t,g,_.width,_.height,0,_.data)}}else if(n.isDataArrayTexture){if(y){if(b&&d.texStorage3D(e.TEXTURE_2D_ARRAY,S,g,u.width,u.height,u.depth),x){if(n.layerUpdates.size>0){let t=Wo(u.width,u.height,n.format,n.type);for(let r of n.layerUpdates){let n=u.data.subarray(r*t/u.data.BYTES_PER_ELEMENT,(r+1)*t/u.data.BYTES_PER_ELEMENT);d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,r,u.width,u.height,1,f,h,n)}n.clearLayerUpdates()}else d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,u.width,u.height,u.depth,f,h,u.data)}}else d.texImage3D(e.TEXTURE_2D_ARRAY,0,g,u.width,u.height,u.depth,0,f,h,u.data)}else if(n.isData3DTexture)y?(b&&d.texStorage3D(e.TEXTURE_3D,S,g,u.width,u.height,u.depth),x&&d.texSubImage3D(e.TEXTURE_3D,0,0,0,0,u.width,u.height,u.depth,f,h,u.data)):d.texImage3D(e.TEXTURE_3D,0,g,u.width,u.height,u.depth,0,f,h,u.data);else if(n.isFramebufferTexture){if(b){if(y)d.texStorage2D(e.TEXTURE_2D,S,g,u.width,u.height);else{let t=u.width,n=u.height;for(let r=0;r<S;r++)d.texImage2D(e.TEXTURE_2D,r,g,t,n,0,f,h,null),t>>=1,n>>=1}}}else if(v.length>0){if(y&&b){let t=Me(v[0]);d.texStorage2D(e.TEXTURE_2D,S,g,t.width,t.height)}for(let t=0,n=v.length;t<n;t++)_=v[t],y?x&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,f,h,_):d.texImage2D(e.TEXTURE_2D,t,g,f,h,_);n.generateMipmaps=!1}else if(y){if(b){let t=Me(u);d.texStorage2D(e.TEXTURE_2D,S,g,t.width,t.height)}x&&d.texSubImage2D(e.TEXTURE_2D,0,0,0,f,h,u)}else d.texImage2D(e.TEXTURE_2D,0,g,f,h,u);T(n)&&E(i),s.__version=o.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function ye(t,n,r){if(n.image.length!==6)return;let i=ge(t,n),a=n.source;d.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+r);let o=f.get(a);if(a.version!==o.__version||i===!0){d.activeTexture(e.TEXTURE0+r);let t=Nt.getPrimaries(Nt.workingColorSpace),s=n.colorSpace===``?null:Nt.getPrimaries(n.colorSpace),c=n.colorSpace===``||t===s?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,c);let l=n.isCompressedTexture||n.image[0].isCompressedTexture,u=n.image[0]&&n.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!l&&!u?f[e]=w(n.image[e],!0,p.maxCubemapSize):f[e]=u?n.image[e].image:n.image[e],f[e]=je(n,f[e]);let h=f[0],g=m.convert(n.format,n.colorSpace),_=m.convert(n.type),v=k(n.internalFormat,g,_,n.colorSpace),y=n.isVideoTexture!==!0,b=o.__version===void 0||i===!0,x=a.dataReady,S=ee(n,h);he(e.TEXTURE_CUBE_MAP,n);let C;if(l){y&&b&&d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];n.format===1023?y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):d.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=n.mipmaps,y&&b){C.length>0&&S++;let t=Me(f[0]);d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(u){y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let n=0;n<C.length;n++){let r=C[n].image[t].image;y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,r.width,r.height,g,_,r.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,r.width,r.height,0,g,_,r.data)}}else{y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let n=0;n<C.length;n++){let r=C[n];y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,g,_,r.image[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,g,_,r.image[t])}}}T(n)&&E(e.TEXTURE_CUBE_MAP),o.__version=a.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function be(t,n,r,i,a,o){let s=m.convert(r.format,r.colorSpace),c=m.convert(r.type),l=k(r.internalFormat,s,c,r.colorSpace),u=f.get(n),p=f.get(r);if(p.__renderTarget=n,!u.__hasExternalTextures){let t=Math.max(1,n.width>>o),r=Math.max(1,n.height>>o);a===e.TEXTURE_3D||a===e.TEXTURE_2D_ARRAY?d.texImage3D(a,o,l,t,r,n.depth,0,s,c,null):d.texImage2D(a,o,l,t,r,0,s,c,null)}d.bindFramebuffer(e.FRAMEBUFFER,t),ke(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,i,a,p.__webglTexture,0,Oe(n)):(a===e.TEXTURE_2D||a>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&a<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,i,a,p.__webglTexture,o),d.bindFramebuffer(e.FRAMEBUFFER,null)}function P(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=A(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,c=Oe(n);ke(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,c,o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,c,o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=k(a.internalFormat,o,s,a.colorSpace),l=Oe(n);r&&ke(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,n.width,n.height):ke(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,l,c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function xe(t,n){if(n&&n.isWebGLCubeRenderTarget)throw Error(`Depth Texture with cube render targets is not supported`);if(d.bindFramebuffer(e.FRAMEBUFFER,t),!(n.depthTexture&&n.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);let r=f.get(n.depthTexture);r.__renderTarget=n,r.__webglTexture&&n.depthTexture.image.width===n.width&&n.depthTexture.image.height===n.height||(n.depthTexture.image.width=n.width,n.depthTexture.image.height=n.height,n.depthTexture.needsUpdate=!0),ce(n.depthTexture,0);let i=r.__webglTexture,a=Oe(n);if(n.depthTexture.format===1026)ke(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,i,0,a):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,i,0);else if(n.depthTexture.format===1027)ke(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,i,0,a):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,i,0);else throw Error(`Unknown depthTexture format`)}function F(t){let n=f.get(t),r=t.isWebGLCubeRenderTarget===!0;if(n.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(n.__depthDisposeCallback&&n.__depthDisposeCallback(),e){let t=()=>{delete n.__boundDepthTexture,delete n.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),n.__depthDisposeCallback=t}n.__boundDepthTexture=e}if(t.depthTexture&&!n.__autoAllocateDepthBuffer){if(r)throw Error(`target.depthTexture not supported in Cube render targets`);let e=t.texture.mipmaps;e&&e.length>0?xe(n.__webglFramebuffer[0],t):xe(n.__webglFramebuffer,t)}else if(r){n.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[r]),n.__webglDepthbuffer[r]===void 0)n.__webglDepthbuffer[r]=e.createRenderbuffer(),P(n.__webglDepthbuffer[r],t,!1);else{let i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=n.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,i,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[0]):d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer),n.__webglDepthbuffer===void 0)n.__webglDepthbuffer=e.createRenderbuffer(),P(n.__webglDepthbuffer,t,!1);else{let r=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,i=n.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,r,e.RENDERBUFFER,i)}}d.bindFramebuffer(e.FRAMEBUFFER,null)}function Se(t,n,r){let i=f.get(t);n!==void 0&&be(i.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),r!==void 0&&F(t)}function Ce(t){let n=t.texture,r=f.get(t),i=f.get(n);t.addEventListener(`dispose`,j);let a=t.textures,o=t.isWebGLCubeRenderTarget===!0,s=a.length>1;if(s||(i.__webglTexture===void 0&&(i.__webglTexture=e.createTexture()),i.__version=n.version,h.memory.textures++),o){r.__webglFramebuffer=[];for(let t=0;t<6;t++)if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer[t]=[];for(let i=0;i<n.mipmaps.length;i++)r.__webglFramebuffer[t][i]=e.createFramebuffer()}else r.__webglFramebuffer[t]=e.createFramebuffer()}else{if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer=[];for(let t=0;t<n.mipmaps.length;t++)r.__webglFramebuffer[t]=e.createFramebuffer()}else r.__webglFramebuffer=e.createFramebuffer();if(s)for(let t=0,n=a.length;t<n;t++){let n=f.get(a[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&ke(t)===!1){r.__webglMultisampledFramebuffer=e.createFramebuffer(),r.__webglColorRenderbuffer=[],d.bindFramebuffer(e.FRAMEBUFFER,r.__webglMultisampledFramebuffer);for(let n=0;n<a.length;n++){let i=a[n];r.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,r.__webglColorRenderbuffer[n]);let o=m.convert(i.format,i.colorSpace),s=m.convert(i.type),c=k(i.internalFormat,o,s,i.colorSpace,t.isXRRenderTarget===!0),l=Oe(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,r.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(r.__webglDepthRenderbuffer=e.createRenderbuffer(),P(r.__webglDepthRenderbuffer,t,!0)),d.bindFramebuffer(e.FRAMEBUFFER,null)}}if(o){d.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture),he(e.TEXTURE_CUBE_MAP,n);for(let i=0;i<6;i++)if(n.mipmaps&&n.mipmaps.length>0)for(let a=0;a<n.mipmaps.length;a++)be(r.__webglFramebuffer[i][a],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,a);else be(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,0);T(n)&&E(e.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(s){for(let n=0,i=a.length;n<i;n++){let i=a[n],o=f.get(i),s=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(s=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(s,o.__webglTexture),he(s,i),be(r.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0+n,s,0),T(i)&&E(s)}d.unbindTexture()}else{let a=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(a=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(a,i.__webglTexture),he(a,n),n.mipmaps&&n.mipmaps.length>0)for(let i=0;i<n.mipmaps.length;i++)be(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,a,i);else be(r.__webglFramebuffer,t,n,e.COLOR_ATTACHMENT0,a,0);T(n)&&E(a),d.unbindTexture()}t.depthBuffer&&F(t)}function we(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(T(r)){let t=O(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),E(t),d.unbindTexture()}}}let Te=[],Ee=[];function De(t){if(t.samples>0){if(ke(t)===!1){let n=t.textures,r=t.width,i=t.height,a=e.COLOR_BUFFER_BIT,o=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,s=f.get(t),c=n.length>1;if(c)for(let t=0;t<n.length;t++)d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);d.bindFramebuffer(e.READ_FRAMEBUFFER,s.__webglMultisampledFramebuffer);let l=t.texture.mipmaps;l&&l.length>0?d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer[0]):d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer);for(let l=0;l<n.length;l++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(a|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(a|=e.STENCIL_BUFFER_BIT)),c){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,s.__webglColorRenderbuffer[l]);let t=f.get(n[l]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,r,i,0,0,r,i,a,e.NEAREST),_===!0&&(Te.length=0,Ee.length=0,Te.push(e.COLOR_ATTACHMENT0+l),t.depthBuffer&&t.resolveDepthBuffer===!1&&(Te.push(o),Ee.push(o),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ee)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Te))}if(d.bindFramebuffer(e.READ_FRAMEBUFFER,null),d.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),c)for(let t=0;t<n.length;t++){d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,s.__webglColorRenderbuffer[t]);let r=f.get(n[t]).__webglTexture;d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,r,0)}d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Oe(e){return Math.min(p.maxSamples,e.samples)}function ke(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function Ae(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function je(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Nt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):console.error(`THREE.WebGLTextures: Unsupported texture color space:`,n)),t}function Me(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=oe,this.resetTextureUnits=ae,this.setTexture2D=ce,this.setTexture2DArray=le,this.setTexture3D=ue,this.setTextureCube=de,this.rebindTextures=Se,this.setupRenderTarget=Ce,this.updateRenderTargetMipmap=we,this.updateMultisampleRenderTarget=De,this.setupDepthRenderbuffer=F,this.setupFrameBufferTexture=be,this.useMultisampledRTT=ke}function Rl(e,t){function n(n,r=``){let i,a=Nt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var zl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bl=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Vl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ya(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ti({vertexShader:zl,fragmentShader:Bl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Wr(new Da(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hl=class extends qe{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,d=null,f=null,p=null,m=null,g=typeof XRWebGLBinding<`u`,_=new Vl,v={},y=t.getContextAttributes(),x=null,S=null,C=[],w=[],O=new L,k=null,A=new oi;A.viewport=new B;let ee=new oi;ee.viewport=new B;let te=[A,ee],j=new ko,ne=null,re=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new mi,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new mi,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new mi,C[e]=t),t.getHandSpace()};function M(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,M),r.removeEventListener(`selectstart`,M),r.removeEventListener(`selectend`,M),r.removeEventListener(`squeeze`,M),r.removeEventListener(`squeezestart`,M),r.removeEventListener(`squeezeend`,M),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}ne=null,re=null,_.reset();for(let e in v)delete v[e];e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(O.width,O.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,M),r.addEventListener(`selectstart`,M),r.addEventListener(`selectend`,M),r.addEventListener(`squeeze`,M),r.addEventListener(`squeezestart`,M),r.addEventListener(`squeezeend`,M),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),y.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(O),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?D:E,a=y.stencil?b:h);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Gt(f.textureWidth,f.textureHeight,{format:T,type:u,depthTexture:new va(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Gt(p.framebufferWidth,p.framebufferHeight,{format:T,type:u,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),pe.setContext(r),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let oe=new R,se=new R;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),j.near=ee.near=A.near=t,j.far=ee.far=A.far=n,(ne!==j.near||re!==j.far)&&(r.updateRenderState({depthNear:j.near,depthFar:j.far}),ne=j.near,re=j.far),j.layers.mask=e.layers.mask|6,A.layers.mask=j.layers.mask&3,ee.layers.mask=j.layers.mask&5;let i=e.parent,a=j.cameras;le(j,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(j,A,ee):j.projectionMatrix.copy(A.projectionMatrix),ue(e,j,i)};function ue(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Ze*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(j)},this.getCameraTexture=function(e){return v[e]};let de=null;function fe(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==j.cameras.length&&(j.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=te[n];o===void 0&&(o=new oi,o.layers.enable(n),o.viewport=new B,te[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(j.matrix.copy(o.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),i===!0&&j.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new ya,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}de&&de(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let pe=new Ko;pe.setAnimationLoop(fe),this.setAnimationLoop=function(e){de=e},this.dispose=function(){}}},Ul=new Mn,Wl=new V;function Gl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Zr(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isMeshBasicMaterial||t.isMeshLambertMaterial?a(e,t):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,Ul.copy(o),Ul.x*=-1,Ul.y*=-1,Ul.z*=-1,a.isCubeTexture&&a.isRenderTargetTexture===!1&&(Ul.y*=-1,Ul.z*=-1),e.envMapRotation.value.setFromMatrix4(Wl.makeRotationFromEuler(Ul)),e.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Kl(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`):console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var ql=class{constructor(e={}){let{canvas:t=Et(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);m=n.getContextAttributes().alpha}else m=a;let h=new Uint32Array(4),g=new Int32Array(4),v=null,y=null,b=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let S=this,C=!1;this._outputColorSpace=Re;let w=0,T=0,E=null,D=-1,O=null,k=new B,A=new B,ee=null,te=new H(0),j=0,ne=t.width,re=t.height,M=1,ie=null,ae=null,oe=new B(0,0,ne,re),se=new B(0,0,ne,re),ce=!1,le=new Xi,ue=!1,de=!1,fe=new V,pe=new R,me=new B,he={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ge=!1;function _e(){return E===null?M:1}let N=n;function ve(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r180`),t.addEventListener(`webglcontextlost`,Ge,!1),t.addEventListener(`webglcontextrestored`,qe,!1),t.addEventListener(`webglcontextcreationerror`,Je,!1),N===null){let t=`webgl2`;if(N=ve(t,e),N===null)throw ve(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}}catch(e){throw console.error(`THREE.WebGLRenderer: `+e.message),e}let ye,be,P,xe,F,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Be,Ve,He;function Ue(){ye=new Es(N),ye.init(),Be=new Rl(N,ye),be=new ts(N,ye,e,Be),P=new Il(N,ye),be.reversedDepthBuffer&&p&&P.buffers.depth.setReversed(!0),xe=new ks(N),F=new bl,Se=new Ll(N,ye,P,F,be,Be,xe),Ce=new rs(S),we=new Ts(S),Te=new qo(N),Ve=new $o(N,Te),Ee=new Ds(N,Te,xe,Ve),De=new js(N,Ee,Te,xe),Fe=new As(N,be,Se),Me=new ns(F),Oe=new yl(S,Ce,we,ye,be,Ve,Me),ke=new Gl(S,F),Ae=new wl,je=new jl(ye),Pe=new Qo(S,Ce,we,P,De,m,s),Ne=new Pl(S,De,be),He=new Kl(N,xe,be,P),Ie=new es(N,ye,xe),Le=new Os(N,ye,xe),xe.programs=Oe.programs,S.capabilities=be,S.extensions=ye,S.properties=F,S.renderLists=Ae,S.shadowMap=Ne,S.state=P,S.info=xe}Ue();let We=new Hl(S,N);this.xr=We,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let e=ye.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=ye.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return M},this.setPixelRatio=function(e){e!==void 0&&(M=e,this.setSize(ne,re,!1))},this.getSize=function(e){return e.set(ne,re)},this.setSize=function(e,n,r=!0){We.isPresenting?console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`):(ne=e,re=n,t.width=Math.floor(e*M),t.height=Math.floor(n*M),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ne*M,re*M).floor()},this.setDrawingBufferSize=function(e,n,r){ne=e,re=n,M=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.getCurrentViewport=function(e){return e.copy(k)},this.getViewport=function(e){return e.copy(oe)},this.setViewport=function(e,t,n,r){e.isVector4?oe.set(e.x,e.y,e.z,e.w):oe.set(e,t,n,r),P.viewport(k.copy(oe).multiplyScalar(M).round())},this.getScissor=function(e){return e.copy(se)},this.setScissor=function(e,t,n,r){e.isVector4?se.set(e.x,e.y,e.z,e.w):se.set(e,t,n,r),P.scissor(A.copy(se).multiplyScalar(M).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(e){P.setScissorTest(ce=e)},this.setOpaqueSort=function(e){ie=e},this.setTransparentSort=function(e){ae=e},this.getClearColor=function(e){return e.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(E!==null){let t=E.texture.format;e=t===1033||t===1031||t===1029}if(e){let e=E.texture.type,t=e===1009||e===1014||e===1012||e===1020||e===1017||e===1018,n=Pe.getClearColor(),r=Pe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(h[0]=i,h[1]=a,h[2]=o,h[3]=r,N.clearBufferuiv(N.COLOR,0,h)):(g[0]=i,g[1]=a,g[2]=o,g[3]=r,N.clearBufferiv(N.COLOR,0,g))}else r|=N.COLOR_BUFFER_BIT}t&&(r|=N.DEPTH_BUFFER_BIT),n&&(r|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ge,!1),t.removeEventListener(`webglcontextrestored`,qe,!1),t.removeEventListener(`webglcontextcreationerror`,Je,!1),Pe.dispose(),Ae.dispose(),je.dispose(),F.dispose(),Ce.dispose(),we.dispose(),De.dispose(),Ve.dispose(),He.dispose(),Oe.dispose(),We.dispose(),We.removeEventListener(`sessionstart`,et),We.removeEventListener(`sessionend`,tt),nt.stop()};function Ge(e){e.preventDefault(),console.log(`THREE.WebGLRenderer: Context Lost.`),C=!0}function qe(){console.log(`THREE.WebGLRenderer: Context Restored.`),C=!1;let e=xe.autoReset,t=Ne.enabled,n=Ne.autoUpdate,r=Ne.needsUpdate,i=Ne.type;Ue(),xe.autoReset=e,Ne.enabled=t,Ne.autoUpdate=n,Ne.needsUpdate=r,Ne.type=i}function Je(e){console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ye(e){let t=e.target;t.removeEventListener(`dispose`,Ye),Xe(t)}function Xe(e){Ze(e),F.remove(e)}function Ze(e){let t=F.get(e).programs;t!==void 0&&(t.forEach(function(e){Oe.releaseProgram(e)}),e.isShaderMaterial&&Oe.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=he);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=dt(e,t,n,r,i);P.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ee.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ve.setup(i,r,s,n,c);let h,g=Ie;if(c!==null&&(h=Te.get(c),g=Le,g.setIndex(h)),i.isMesh)r.wireframe===!0?(P.setLineWidth(r.wireframeLinewidth*_e()),g.setMode(N.LINES)):g.setMode(N.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),P.setLineWidth(e*_e()),i.isLineSegments?g.setMode(N.LINES):i.isLineLoop?g.setMode(N.LINE_LOOP):g.setMode(N.LINE_STRIP)}else i.isPoints?g.setMode(N.POINTS):i.isSprite&&g.setMode(N.TRIANGLES);if(i.isBatchedMesh){if(i._multiDrawInstances!==null)Ot(`THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection.`),g.renderMultiDrawInstances(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount,i._multiDrawInstances);else if(ye.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Te.get(c).bytesPerElement:1,o=F.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(N,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Qe(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,ct(e,t,n),e.side=0,e.needsUpdate=!0,ct(e,t,n),e.side=2):ct(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),y=je.get(n),y.init(t),x.push(y),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(y.pushLight(e),e.castShadow&&y.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(y.pushLight(e),e.castShadow&&y.pushShadow(e))}),y.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];Qe(a,n,e),r.add(a)}else Qe(t,n,e),r.add(t)}}),y=x.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){F.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}ye.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let I=null;function $e(e){I&&I(e)}function et(){nt.stop()}function tt(){nt.start()}let nt=new Ko;nt.setAnimationLoop($e),typeof self<`u`&&nt.setContext(self),this.setAnimationLoop=function(e){I=e,We.setAnimationLoop(e),e===null?nt.stop():nt.start()},We.addEventListener(`sessionstart`,et),We.addEventListener(`sessionend`,tt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(C===!0)return;if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),We.enabled===!0&&We.isPresenting===!0&&(We.cameraAutoUpdate===!0&&We.updateCamera(t),t=We.getCamera()),e.isScene===!0&&e.onBeforeRender(S,e,t,E),y=je.get(e,x.length),y.init(t),x.push(y),fe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),le.setFromProjectionMatrix(fe,Ke,t.reversedDepth),de=this.localClippingEnabled,ue=Me.init(this.clippingPlanes,de),v=Ae.get(e,b.length),v.init(),b.push(v),We.enabled===!0&&We.isPresenting===!0){let e=S.xr.getDepthSensingMesh();e!==null&&rt(e,t,-1/0,S.sortObjects)}rt(e,t,0,S.sortObjects),v.finish(),S.sortObjects===!0&&v.sort(ie,ae),ge=We.enabled===!1||We.isPresenting===!1||We.hasDepthSensing()===!1,ge&&Pe.addToRenderList(v,e),this.info.render.frame++,ue===!0&&Me.beginShadows();let n=y.state.shadowsArray;Ne.render(n,e,t),ue===!0&&Me.endShadows(),this.info.autoReset===!0&&this.info.reset();let r=v.opaque,i=v.transmissive;if(y.setupLights(),t.isArrayCamera){let n=t.cameras;if(i.length>0)for(let t=0,a=n.length;t<a;t++){let a=n[t];at(r,i,e,a)}ge&&Pe.render(e);for(let t=0,r=n.length;t<r;t++){let r=n[t];it(v,e,r,r.viewport)}}else i.length>0&&at(r,i,e,t),ge&&Pe.render(e),it(v,e,t);E!==null&&T===0&&(Se.updateMultisampleRenderTarget(E),Se.updateRenderTargetMipmap(E)),e.isScene===!0&&e.onAfterRender(S,e,t),Ve.resetDefaultState(),D=-1,O=null,x.pop(),x.length>0?(y=x[x.length-1],ue===!0&&Me.setGlobalState(S.clippingPlanes,y.state.camera)):y=null,b.pop(),v=b.length>0?b[b.length-1]:null};function rt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)y.pushLight(e),e.castShadow&&y.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||le.intersectsSprite(e)){r&&me.setFromMatrixPosition(e.matrixWorld).applyMatrix4(fe);let t=De.update(e),i=e.material;i.visible&&v.push(e,t,i,n,me.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||le.intersectsObject(e))){let t=De.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),me.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),me.copy(e.boundingSphere.center)),me.applyMatrix4(e.matrixWorld).applyMatrix4(fe)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&v.push(e,t,s,n,me.z,o)}}else i.visible&&v.push(e,t,i,n,me.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)rt(i[e],t,n,r)}function it(e,t,n,r){let i=e.opaque,a=e.transmissive,o=e.transparent;y.setupLightsView(n),ue===!0&&Me.setGlobalState(S.clippingPlanes,n),r&&P.viewport(k.copy(r)),i.length>0&&ot(i,t,n),a.length>0&&ot(a,t,n),o.length>0&&ot(o,t,n),P.buffers.depth.setTest(!0),P.buffers.depth.setMask(!0),P.buffers.color.setMask(!0),P.setPolygonOffset(!1)}function at(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[r.id]===void 0&&(y.state.transmissionRenderTarget[r.id]=new Gt(1,1,{generateMipmaps:!0,type:ye.has(`EXT_color_buffer_half_float`)||ye.has(`EXT_color_buffer_float`)?_:u,minFilter:l,samples:4,stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Nt.workingColorSpace}));let a=y.state.transmissionRenderTarget[r.id],o=r.viewport||k;a.setSize(o.z*S.transmissionResolutionScale,o.w*S.transmissionResolutionScale);let s=S.getRenderTarget(),c=S.getActiveCubeFace(),d=S.getActiveMipmapLevel();S.setRenderTarget(a),S.getClearColor(te),j=S.getClearAlpha(),j<1&&S.setClearColor(16777215,.5),S.clear(),ge&&Pe.render(n);let f=S.toneMapping;S.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),y.setupLightsView(r),ue===!0&&Me.setGlobalState(S.clippingPlanes,r),ot(e,n,r),Se.updateMultisampleRenderTarget(a),Se.updateRenderTargetMipmap(a),ye.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let a=t[i],o=a.object,s=a.geometry,c=a.material,l=a.group;if(c.side===2&&o.layers.test(r.layers)){let t=c.side;c.side=1,c.needsUpdate=!0,st(o,n,r,s,c,l),c.side=t,c.needsUpdate=!0,e=!0}}e===!0&&(Se.updateMultisampleRenderTarget(a),Se.updateRenderTargetMipmap(a))}S.setRenderTarget(s,c,d),S.setClearColor(te,j),p!==void 0&&(r.viewport=p),S.toneMapping=f}function ot(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],o=a.object,s=a.geometry,c=a.group,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&st(o,t,n,s,l,c)}}function st(e,t,n,r,i,a){e.onBeforeRender(S,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(S,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,S.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,S.renderBufferDirect(n,t,r,i,e,a),i.side=2):S.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(S,t,n,r,i,a)}function ct(e,t,n){t.isScene!==!0&&(t=he);let r=F.get(e),i=y.state.lights,a=y.state.shadowsArray,o=i.state.version,s=Oe.getParameters(e,i.state,a,t,n),c=Oe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial?t.environment:null,r.fog=t.fog,r.envMap=(e.isMeshStandardMaterial?we:Ce).get(e.envMap||r.environment),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Ye),l=new Map,r.programs=l);let u=l.get(c);if(u!==void 0){if(r.currentProgram===u&&r.lightsStateVersion===o)return ut(e,s),u}else s.uniforms=Oe.getUniforms(e),e.onBeforeCompile(s,S),u=Oe.acquireProgram(s,c),l.set(c,u),r.uniforms=s.uniforms;let d=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(d.clippingPlanes=Me.uniform),ut(e,s),r.needsLights=pt(e),r.lightsStateVersion=o,r.needsLights&&(d.ambientLightColor.value=i.state.ambient,d.lightProbe.value=i.state.probe,d.directionalLights.value=i.state.directional,d.directionalLightShadows.value=i.state.directionalShadow,d.spotLights.value=i.state.spot,d.spotLightShadows.value=i.state.spotShadow,d.rectAreaLights.value=i.state.rectArea,d.ltc_1.value=i.state.rectAreaLTC1,d.ltc_2.value=i.state.rectAreaLTC2,d.pointLights.value=i.state.point,d.pointLightShadows.value=i.state.pointShadow,d.hemisphereLights.value=i.state.hemi,d.directionalShadowMap.value=i.state.directionalShadowMap,d.directionalShadowMatrix.value=i.state.directionalShadowMatrix,d.spotShadowMap.value=i.state.spotShadowMap,d.spotLightMatrix.value=i.state.spotLightMatrix,d.spotLightMap.value=i.state.spotLightMap,d.pointShadowMap.value=i.state.pointShadowMap,d.pointShadowMatrix.value=i.state.pointShadowMatrix),r.currentProgram=u,r.uniformsList=null,u}function lt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Rc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ut(e,t){let n=F.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function dt(e,t,n,r,i){t.isScene!==!0&&(t=he),Se.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial?t.environment:null,s=E===null?S.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:ze,c=(r.isMeshStandardMaterial?we:Ce).get(r.envMap||o),l=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,u=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),d=!!n.morphAttributes.position,f=!!n.morphAttributes.normal,p=!!n.morphAttributes.color,m=0;r.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(m=S.toneMapping);let h=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,g=h===void 0?0:h.length,_=F.get(r),v=y.state.lights;if(ue===!0&&(de===!0||e!==O)){let t=e===O&&r.id===D;Me.setState(r,e,t)}let b=!1;r.version===_.__version?_.needsLights&&_.lightsStateVersion!==v.state.version?b=!0:_.outputColorSpace===s?i.isBatchedMesh&&_.batching===!1||!i.isBatchedMesh&&_.batching===!0||i.isBatchedMesh&&_.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&_.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&_.instancing===!1||!i.isInstancedMesh&&_.instancing===!0||i.isSkinnedMesh&&_.skinning===!1||!i.isSkinnedMesh&&_.skinning===!0||i.isInstancedMesh&&_.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&_.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&_.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&_.instancingMorph===!1&&i.morphTexture!==null?b=!0:_.envMap===c?r.fog===!0&&_.fog!==a||_.numClippingPlanes!==void 0&&(_.numClippingPlanes!==Me.numPlanes||_.numIntersection!==Me.numIntersection)?b=!0:_.vertexAlphas===l&&_.vertexTangents===u&&_.morphTargets===d&&_.morphNormals===f&&_.morphColors===p&&_.toneMapping===m?_.morphTargetsCount!==g&&(b=!0):b=!0:b=!0:b=!0:(b=!0,_.__version=r.version);let x=_.currentProgram;b===!0&&(x=ct(r,t,i));let C=!1,w=!1,T=!1,k=x.getUniforms(),A=_.uniforms;if(P.useProgram(x.program)&&(C=!0,w=!0,T=!0),r.id!==D&&(D=r.id,w=!0),C||O!==e){P.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),k.setValue(N,`projectionMatrix`,e.projectionMatrix),k.setValue(N,`viewMatrix`,e.matrixWorldInverse);let t=k.map.cameraPosition;t!==void 0&&t.setValue(N,pe.setFromMatrixPosition(e.matrixWorld)),be.logarithmicDepthBuffer&&k.setValue(N,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&k.setValue(N,`isOrthographic`,e.isOrthographicCamera===!0),O!==e&&(O=e,w=!0,T=!0)}if(i.isSkinnedMesh){k.setOptional(N,i,`bindMatrix`),k.setOptional(N,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),k.setValue(N,`boneTexture`,e.boneTexture,Se))}i.isBatchedMesh&&(k.setOptional(N,i,`batchingTexture`),k.setValue(N,`batchingTexture`,i._matricesTexture,Se),k.setOptional(N,i,`batchingIdTexture`),k.setValue(N,`batchingIdTexture`,i._indirectTexture,Se),k.setOptional(N,i,`batchingColorTexture`),i._colorsTexture!==null&&k.setValue(N,`batchingColorTexture`,i._colorsTexture,Se));let ee=n.morphAttributes;if((ee.position!==void 0||ee.normal!==void 0||ee.color!==void 0)&&Fe.update(i,n,x),(w||_.receiveShadow!==i.receiveShadow)&&(_.receiveShadow=i.receiveShadow,k.setValue(N,`receiveShadow`,i.receiveShadow)),r.isMeshGouraudMaterial&&r.envMap!==null&&(A.envMap.value=c,A.flipEnvMap.value=c.isCubeTexture&&c.isRenderTargetTexture===!1?-1:1),r.isMeshStandardMaterial&&r.envMap===null&&t.environment!==null&&(A.envMapIntensity.value=t.environmentIntensity),w&&(k.setValue(N,`toneMappingExposure`,S.toneMappingExposure),_.needsLights&&ft(A,T),a&&r.fog===!0&&ke.refreshFogUniforms(A,a),ke.refreshMaterialUniforms(A,r,M,re,y.state.transmissionRenderTarget[e.id]),Rc.upload(N,lt(_),A,Se)),r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Rc.upload(N,lt(_),A,Se),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&k.setValue(N,`center`,i.center),k.setValue(N,`modelViewMatrix`,i.modelViewMatrix),k.setValue(N,`normalMatrix`,i.normalMatrix),k.setValue(N,`modelMatrix`,i.matrixWorld),r.isShaderMaterial||r.isRawShaderMaterial){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];He.update(n,x),He.bind(n,x)}}return x}function ft(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function pt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(e,t,n){let r=F.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),F.get(e.texture).__webglTexture=t,F.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=F.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0};let mt=N.createFramebuffer();this.setRenderTarget=function(e,t=0,n=0){E=e,w=t,T=n;let r=!0,i=null,a=!1,o=!1;if(e){let s=F.get(e);if(s.__useDefaultFramebuffer!==void 0)P.bindFramebuffer(N.FRAMEBUFFER,null),r=!1;else if(s.__webglFramebuffer===void 0)Se.setupRenderTarget(e);else if(s.__hasExternalTextures)Se.rebindTextures(e,F.get(e.texture).__webglTexture,F.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(s.__boundDepthTexture!==t){if(t!==null&&F.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);Se.setupDepthRenderbuffer(e)}}let c=e.texture;(c.isData3DTexture||c.isDataArrayTexture||c.isCompressedArrayTexture)&&(o=!0);let l=F.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(i=Array.isArray(l[t])?l[t][n]:l[t],a=!0):i=e.samples>0&&Se.useMultisampledRTT(e)===!1?F.get(e).__webglMultisampledFramebuffer:Array.isArray(l)?l[n]:l,k.copy(e.viewport),A.copy(e.scissor),ee=e.scissorTest}else k.copy(oe).multiplyScalar(M).floor(),A.copy(se).multiplyScalar(M).floor(),ee=ce;if(n!==0&&(i=mt),P.bindFramebuffer(N.FRAMEBUFFER,i)&&r&&P.drawBuffers(e,i),P.viewport(k),P.scissor(A),P.setScissorTest(ee),a){let r=F.get(e.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(o){let r=t;for(let t=0;t<e.textures.length;t++){let i=F.get(e.textures[t]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=F.get(e.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,t.__webglTexture,n)}D=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=F.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){P.bindFramebuffer(N.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(!be.textureFormatReadable(c)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!be.textureTypeReadable(l)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&(e.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+s),N.readPixels(t,n,r,i,Be.convert(c),Be.convert(l),a))}finally{let e=E===null?null:F.get(E).__webglFramebuffer;P.bindFramebuffer(N.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=F.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){P.bindFramebuffer(N.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(!be.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!be.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,d),N.bufferData(N.PIXEL_PACK_BUFFER,a.byteLength,N.STREAM_READ),e.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+s),N.readPixels(t,n,r,i,Be.convert(l),Be.convert(u),0);let f=E===null?null:F.get(E).__webglFramebuffer;P.bindFramebuffer(N.FRAMEBUFFER,f);let p=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await kt(N,p,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,d),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,a),N.deleteBuffer(d),N.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Se.setTexture2D(e,0),N.copyTexSubImage2D(N.TEXTURE_2D,n,0,0,o,s,i,a),P.unbindTexture()};let ht=N.createFramebuffer(),gt=N.createFramebuffer();this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=null){a===null&&(i===0?a=0:(Ot(`WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels.`),a=i,i=0));let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Be.convert(t.format),_=Be.convert(t.type),v;t.isData3DTexture?(Se.setTexture3D(t,0),v=N.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Se.setTexture2DArray(t,0),v=N.TEXTURE_2D_ARRAY):(Se.setTexture2D(t,0),v=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,t.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,t.unpackAlignment);let y=N.getParameter(N.UNPACK_ROW_LENGTH),b=N.getParameter(N.UNPACK_IMAGE_HEIGHT),x=N.getParameter(N.UNPACK_SKIP_PIXELS),S=N.getParameter(N.UNPACK_SKIP_ROWS),C=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,h.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,h.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,l),N.pixelStorei(N.UNPACK_SKIP_ROWS,u),N.pixelStorei(N.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=F.get(e),r=F.get(t),h=F.get(n.__renderTarget),g=F.get(r.__renderTarget);P.bindFramebuffer(N.READ_FRAMEBUFFER,h.__webglFramebuffer),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(e).__webglTexture,i,d+n),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(t).__webglTexture,a,m+n)),N.blitFramebuffer(l,u,o,s,f,p,o,s,N.DEPTH_BUFFER_BIT,N.NEAREST);P.bindFramebuffer(N.READ_FRAMEBUFFER,null),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||F.has(e)){let n=F.get(e),r=F.get(t);P.bindFramebuffer(N.READ_FRAMEBUFFER,ht),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,gt);for(let e=0;e<c;e++)w?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,n.__webglTexture,i),T?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,r.__webglTexture,a),i===0?T?N.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):N.copyTexSubImage2D(v,a,f,p,l,u,o,s):N.blitFramebuffer(l,u,o,s,f,p,o,s,N.COLOR_BUFFER_BIT,N.NEAREST);P.bindFramebuffer(N.READ_FRAMEBUFFER,null),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?N.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?N.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):N.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):N.texSubImage2D(N.TEXTURE_2D,a,f,p,o,s,g,_,h);N.pixelStorei(N.UNPACK_ROW_LENGTH,y),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,b),N.pixelStorei(N.UNPACK_SKIP_PIXELS,x),N.pixelStorei(N.UNPACK_SKIP_ROWS,S),N.pixelStorei(N.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&N.generateMipmap(v),P.unbindTexture()},this.initRenderTarget=function(e){F.get(e).__webglFramebuffer===void 0&&Se.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Se.setTextureCube(e,0):e.isData3DTexture?Se.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Se.setTexture2DArray(e,0):Se.setTexture2D(e,0),P.unbindTexture()},this.resetState=function(){w=0,T=0,E=null,P.reset(),Ve.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Ke}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Nt._getUnpackColorSpace()}},Jl=[`spring`,`summer`,`autumn`,`winter`],Yl=[`mild`,`wet`,`dry`,`hot`,`gales`,`stormy`,`hard`,`highRiver`],Xl={spring:{sunrise:6,sunset:19},summer:{sunrise:5,sunset:21},autumn:{sunrise:7,sunset:18},winter:{sunrise:8,sunset:16}},Zl={spring:45,summer:58,autumn:45,winter:25},Ql={spring:.85,summer:1,autumn:.85,winter:.7},$l=Object.freeze({sunrise:6,noon:12,sunset:20,height:58,arc:1}),eu=1,tu=2,nu=4,ru=.5,iu=23.5;function au(e){let t=Xl[e.season],n=e.sunrise??t.sunrise,r=e.sunset??t.sunset;r===n&&(r=n+t.sunset-t.sunrise);let i=r-n;i>0&&i<=24||(i=(i%24+24)%24);let a=Math.min(iu,Math.max(ru,i)),o=n+i/2;return Object.freeze({sunrise:o-a/2,noon:o,sunset:o+a/2,height:Zl[e.season],arc:Ql[e.season]})}var ou=new WeakMap;function su(e){let t=ou.get(e);if(t)return t;let n=$l,r=Math.min(1,(24-(e.sunset-e.sunrise))/nu),i=eu*r,a=tu*r;return t=[[n.sunrise-eu,e.sunrise-i],[n.sunrise,e.sunrise],[n.noon,e.noon],[n.sunset,e.sunset],[n.sunset+tu,e.sunset+a],[n.sunrise-eu+24,e.sunrise-i+24]],ou.set(e,t),t}var cu=(e,t)=>t+((e-t)%24+24)%24;function lu(e,t,n){let r=su(t),i=1-n,a=cu(e,r[0][n]),o=0;for(;o<r.length-2&&a>=r[o+1][n];)o++;let s=(a-r[o][n])/(r[o+1][n]-r[o][n]);return((r[o][i]+(r[o+1][i]-r[o][i])*s)%24+24)%24}var uu=(e,t)=>lu(e,t,1),du=(e,t)=>lu(e,t,0),fu=[{hour:5,sunAz:80,sunEl:-6,sunColor:6122152,skyColor:8160968,rimColor:9207496,hazeColor:7173296,skyTop:2897264,skyBottom:9076664,shadeHue:285,shadeLean:.55,shadeDepth:.42,litHue:280,litLean:.2,hazeDensity:.03,hazeFloor:.14,hazeMax:.55,exposure:.75,saturation:.9,cloudDim:.6,cloudHaze:.85,night:.7,nightShift:.7},{hour:7,sunAz:95,sunEl:10,sunColor:16762255,skyColor:11122918,rimColor:16756848,hazeColor:13157340,skyTop:7312854,skyBottom:15976870,shadeHue:270,shadeLean:.45,shadeDepth:.36,litHue:70,litLean:.18,hazeDensity:.03,hazeFloor:.1,hazeMax:.5,exposure:1,saturation:1.05,cloudDim:.8,cloudHaze:.85,night:0,nightShift:0},{hour:12,sunAz:115,sunEl:58,sunColor:16774364,skyColor:11850994,rimColor:16769162,hazeColor:12573935,skyTop:5215712,skyBottom:13625076,shadeHue:215,shadeLean:.4,shadeDepth:.3,litHue:95,litLean:.05,hazeDensity:.022,hazeFloor:.03,hazeMax:.45,exposure:1,saturation:1,cloudDim:1,cloudHaze:.85,night:0,nightShift:0},{hour:17.5,sunAz:215,sunEl:16,sunColor:16757864,skyColor:11053280,rimColor:16754248,hazeColor:15909538,skyTop:7114710,skyBottom:16173728,shadeHue:275,shadeLean:.6,shadeDepth:.34,litHue:60,litLean:.2,hazeDensity:.026,hazeFloor:.08,hazeMax:.5,exposure:1,saturation:1,cloudDim:.75,cloudHaze:.4,night:0,nightShift:0},{hour:19.5,sunAz:240,sunEl:2,sunColor:16748394,skyColor:9406152,rimColor:16743002,hazeColor:14131112,skyTop:4938408,skyBottom:16097416,shadeHue:295,shadeLean:.55,shadeDepth:.4,litHue:45,litLean:.35,hazeDensity:.03,hazeFloor:.1,hazeMax:.55,exposure:.9,saturation:1.1,cloudDim:.5,cloudHaze:.4,night:0,nightShift:0},{hour:22,sunAz:260,sunEl:35,sunColor:9608923,skyColor:6318504,rimColor:8231648,hazeColor:4343928,skyTop:1317436,skyBottom:3095154,shadeHue:275,shadeLean:.65,shadeDepth:.5,litHue:255,litLean:.5,hazeDensity:.03,hazeFloor:.14,hazeMax:.5,exposure:.55,saturation:.82,cloudDim:.5,cloudHaze:.85,night:1,nightShift:1}],pu=fu.find(e=>e.hour===$l.noon),mu={Dawn:7,Noon:12,"Golden hour":17.5,Sunset:19.5,Night:22};function hu(e){return Object.fromEntries(Object.entries(mu).map(([t,n])=>[t,du(n,e)]))}var gu=(e,t,n)=>e+(t-e)*n,_u=(e,t,n)=>e+((t-e+540)%360-180)*n,vu=(e,t,n)=>new H(e).lerp(new H(t),n);function yu(e,t=$l){let n=(e%24+24)%24,r=bu(t===$l?n:uu(n,t));if(r.hour=n,t.height!==$l.height||t.arc!==$l.arc){let e=1-r.night;if(r.sunEl>0){let n=((pu.sunEl/t.height)**2-1)/pu.sunEl**2;r.sunEl=gu(r.sunEl,r.sunEl/Math.sqrt(1+n*r.sunEl*r.sunEl),e)}r.sunAz=pu.sunAz+((r.sunAz-pu.sunAz+540)%360-180)*gu(1,t.arc,e)}return r}function bu(e){let t=(e%24+24)%24,n=[{...fu[fu.length-1],hour:fu[fu.length-1].hour-24},...fu,{...fu[0],hour:fu[0].hour+24}],r=0;for(;r<n.length-2&&t>=n[r+1].hour;)r++;let i=n[r],a=n[r+1],o=(t-i.hour)/(a.hour-i.hour),s=o*o*(3-2*o);return{hour:t,sunAz:_u(i.sunAz,a.sunAz,s),sunEl:gu(i.sunEl,a.sunEl,s),dayEl:gu(i.sunEl,a.sunEl,s),sunColor:vu(i.sunColor,a.sunColor,s),skyColor:vu(i.skyColor,a.skyColor,s),rimColor:vu(i.rimColor,a.rimColor,s),hazeColor:vu(i.hazeColor,a.hazeColor,s),skyTop:vu(i.skyTop,a.skyTop,s),skyBottom:vu(i.skyBottom,a.skyBottom,s),shadeHue:_u(i.shadeHue,a.shadeHue,s),shadeLean:gu(i.shadeLean,a.shadeLean,s),shadeDepth:gu(i.shadeDepth,a.shadeDepth,s),litHue:_u(i.litHue,a.litHue,s),litLean:gu(i.litLean,a.litLean,s),hazeDensity:gu(i.hazeDensity,a.hazeDensity,s),hazeMax:gu(i.hazeMax,a.hazeMax,s),hazeFloor:gu(i.hazeFloor,a.hazeFloor,s),exposure:gu(i.exposure,a.exposure,s),saturation:gu(i.saturation,a.saturation,s),cloudDim:gu(i.cloudDim,a.cloudDim,s),cloudHaze:gu(i.cloudHaze,a.cloudHaze,s),night:gu(i.night,a.night,s),nightShift:gu(i.nightShift,a.nightShift,s)}}function xu(e,t){let n=e.getIndex(),r=e.getAttribute(`position`);if(!n)return[e];let i=new Map;for(let e=0;e<n.count;e+=3){let a=n.getX(e),o=n.getX(e+1),s=n.getX(e+2),c=(r.getX(a)+r.getX(o)+r.getX(s))/3,l=(r.getZ(a)+r.getZ(o)+r.getZ(s))/3,u=`${Math.floor(c/t)},${Math.floor(l/t)}`,d=i.get(u);d||i.set(u,d=[]),d.push(a,o,s)}if(i.size<=1)return[Su(e)];let a=Object.keys(e.attributes),o=[];for(let t of i.values()){let n=new Map,r=[],i=t.map(e=>{let t=n.get(e);return t===void 0&&(t=r.length,n.set(e,t),r.push(e)),t}),s=new Mr;for(let t of a){let n=e.getAttribute(t),i=n.itemSize,a=new n.array.constructor(r.length*i);r.forEach((e,t)=>{for(let r=0;r<i;r++)a[t*i+r]=n.array[e*i+r]}),s.setAttribute(t,new xr(a,i,n.normalized))}s.setIndex(r.length>65535?new Cr(i,1):new Sr(i,1)),s.userData={...e.userData},o.push(Su(s))}return e.dispose(),o}function Su(e){return e.computeBoundingSphere(),e.boundingSphere.radius+=5,e}var Cu=yt.degToRad(30),wu=class{camera=new So(-1,1,1,-1,1,400);target=new R;view=0;zoom=32;yaw=yt.degToRad(45);constructor(e=0,t=32){this.view=e,this.zoom=t,this.yaw=this.goalYaw()}get heading(){return this.yaw}goalYaw(){return yt.degToRad(45+90*this.view)}turn(e){this.view=(this.view+e+4)%4}update(e,t=!1){let n=this.goalYaw(),r=n-this.yaw;return r=Math.atan2(Math.sin(r),Math.cos(r)),this.yaw=t||Math.abs(r)<1e-4?n:this.yaw+r*(1-Math.exp(-e*9)),Math.abs(r)>1e-4}backward(){return new R(Math.sin(this.yaw)*Math.cos(Cu),Math.sin(Cu),Math.cos(this.yaw)*Math.cos(Cu))}pan(e,t){let n=new R(Math.cos(this.yaw),0,-Math.sin(this.yaw)),r=new R(-Math.sin(this.yaw),0,-Math.cos(this.yaw));this.target.addScaledVector(n,-e/this.zoom).addScaledVector(r,t/this.zoom/Math.sin(Cu))}apply(e,t){let n=e/this.zoom/2,r=t/this.zoom/2,i=this.camera;i.left=-n,i.right=n,i.top=r,i.bottom=-r,i.near=1,i.far=300,i.position.copy(this.target).addScaledVector(this.backward(),120),i.up.set(0,1,0),i.lookAt(this.target),i.updateProjectionMatrix(),i.updateMatrixWorld()}},Tu={size:30,warp:.35,rough:.5,billow:.7,soft:.6,heavy:{size:48,warp:.4,rough:.5,billow:.6,soft:1,from:.3,to:.85}},Eu=e=>.25+.12*Math.max(0,e),Du=5,Ou=.70710678;function ku(e,t,n){let r=Math.imul(e,2376512323)^Math.imul(t,3625334849)^Math.imul(n,3407524639);return r^=r>>>16,r=Math.imul(r,2146121005),r^=r>>>15,r=Math.imul(r,2221713035),r^=r>>>16,r>>>0}var Au=(e,t)=>Math.imul(e,2654435769)+Math.imul(t,2246822507)>>>0,ju=(e,t)=>e-t*Math.floor(e/t);function Mu(e,t,n){let r=e&7;return r<4?r<2?r&1?-t:t:r&1?-n:n:((r&1?-t:t)+(r&2?-n:n))*Ou}var Nu=e=>e*e*e*(e*(e*6-15)+10);function Pu(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=e-i,s=t-a,c=ju(i,n),l=ju(a,n),u=c+1===n?0:c+1,d=l+1===n?0:l+1,f=Mu(ku(c,l,r),o,s),p=Mu(ku(u,l,r),o-1,s),m=Mu(ku(c,d,r),o,s-1),h=Mu(ku(u,d,r),o-1,s-1),g=Nu(o),_=Nu(s),v=f+(p-f)*g;return v+(m+(h-m)*g-v)*_}var Fu=2,Iu=16;function Lu(e,t,n,r,i=0){let a=Pu(e*.5,t*.5,128,Au(r,i+8)),o=Pu(e*.5,t*.5,128,Au(r,i+9)),s=0,c=0,l=1,u=1,d=256;for(let f=0;f<Du;f++){let p=f<Fu?n.warp:0,m=Pu((e+p*a)*u,(t+p*o)*u,d,Au(r,i+f));f>0&&(m=m*(1-n.billow)+(.35-Math.abs(m))*n.billow),s+=l*m,c+=l,l*=n.rough,u*=2,d*=2}return s/c}function Ru(e,t=Tu){let n=t.heavy;return n?Gu((e-n.from)/(n.to-n.from)):0}function zu(e,t=Tu,n=0,r=0){let i=1/t.size,a=(e.x-n)*i,o=(e.z-r)*i;return[a-256*Math.floor(a/256),o-256*Math.floor(o/256)]}var Bu=new Map,Vu=64;function Hu(e){let t=Bu.get(e);if(t)return t;let n=36864,r=(e,t)=>{let r=new Float64Array(n),i=0,a=0;for(let n=0;n<192;n++)for(let o=0;o<192;o++){let s=Lu(o*1.6180339+.31,n*1.324718+.77,e,0,t);r[n*192+o]=s,i+=s,a+=s*s}let o=i/n;return[r,o,Math.sqrt(Math.max(a/n-o*o,1e-12))]},[i,a,o]=r(e,0),[s,c,l]=e.heavy?r(e.heavy,Iu):[i,a,o],u=new Float64Array(65),d=new Map,f=t=>{let r=d.get(t);if(r)return r;let[u,f]=Uu(t),p=new Float64Array(n),m=1/0,h=-1/0;for(let e=0;e<n;e++){let t=(u?u*((i[e]-a)/o):0)+(f?f*((s[e]-c)/l):0);p[e]=t,m=Math.min(m,t),h=Math.max(h,t)}let g=Wu(e,t),_=1024,v=new Float64Array(_),y=(h-m)/_;for(let e of p)v[Math.min(1023,Math.floor((e-m)/y))]++;let b=e=>{let t=0;for(let n=0;n<_;n++)t+=v[n]*Gu((m+(n+.5)*y-e)/g);return t/n};return r=e=>{let t=m-g,n=h;for(let r=0;r<40;r++){let r=(t+n)/2;b(r)>e?t=r:n=r}return(t+n)/2},d.set(t,r),r};for(let t=0;t<=Vu;t++)u[t]=f(Ru(t/Vu,e))(t/Vu);return t={light:[a,1/o],heavy:[c,1/l],covers:u},Bu.set(e,t),t}function Uu(e){let t=1/Math.sqrt((1-e)*(1-e)+e*e);return[(1-e)*t,e*t]}var Wu=(e,t)=>e.soft+((e.heavy?.soft??e.soft)-e.soft)*t;function Gu(e){let t=e<0?0:e>1?1:e;return t*t*(3-2*t)}var Ku=1e4,qu=-1e4;function Ju(e,t){let n=Hu(t),r=Wu(t,Ru(e,t));if(!(e>0))return[Ku,r];if(e>=1)return[qu,r];let i=e*Vu,a=Math.min(63,Math.floor(i)),o=i-a;return[n.covers[a]+(n.covers[a+1]-n.covers[a])*o,r]}function Yu(e,t=Tu,n=0,r=0){let i=t.heavy??t,a=Hu(t),[o,s]=Ju(e.cover,t),[c,l]=Uu(Ru(e.cover,t));return{uCloudShape:[1/t.size,t.warp,t.rough,t.billow],uCloudHeavy:[1/i.size,i.warp,i.rough,i.billow],uCloudShift:[...zu(e,t,n,r),...zu(e,i,n,r)],uCloudNorm:[...a.light,...a.heavy],uCloudThreshold:[o,s,c,l],uCloudSeed:Xu(e.seed)}}var Xu=e=>Math.floor(e)>>>0&2147483647,Zu=`
uniform vec4 uCloudShape;      // the light layer: 1 / its size, its warp, rough and billow
uniform vec4 uCloudHeavy;      // the heavy layer, the same
uniform vec4 uCloudShift;      // the drift in each layer's cells, taken round the period: light xy, heavy zw
uniform vec4 uCloudNorm;       // each layer's mean and 1 / its spread: light xy, heavy zw
uniform vec4 uCloudThreshold;  // the cover's threshold, the rim's softness, and each layer's weight
uniform int uCloudSeed;
uint cloudHash(uint x, uint y, uint s) {
  uint h = (x * 0x8da6b343u) ^ (y * 0xd8163841u) ^ (s * 0xcb1ab31fu);
  h ^= h >> 16u; h *= 0x7feb352du;
  h ^= h >> 15u; h *= 0x846ca68bu;
  h ^= h >> 16u;
  return h;
}
uint cloudSalt(int layer) { return uint(uCloudSeed) * 0x9e3779b9u + uint(layer) * 0x85ebca6bu; }
float cloudWrap(float i, float p) { return i - p * floor(i / p); }
float cloudGrad(uint h, float fx, float fy) {
  uint g = h & 7u;
  float sx = (g & 1u) != 0u ? -fx : fx;
  if (g < 4u) return g < 2u ? sx : ((g & 1u) != 0u ? -fy : fy);
  return (sx + ((g & 2u) != 0u ? -fy : fy)) * ${Ou};
}
float cloudFade(float t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
float cloudNoise(vec2 q, float period, uint s) {
  vec2 i = floor(q), f = q - i;
  float x0 = cloudWrap(i.x, period), y0 = cloudWrap(i.y, period);
  float x1 = x0 + 1.0 == period ? 0.0 : x0 + 1.0, y1 = y0 + 1.0 == period ? 0.0 : y0 + 1.0;
  float a = cloudGrad(cloudHash(uint(x0), uint(y0), s), f.x, f.y);
  float b = cloudGrad(cloudHash(uint(x1), uint(y0), s), f.x - 1.0, f.y);
  float c = cloudGrad(cloudHash(uint(x0), uint(y1), s), f.x, f.y - 1.0);
  float d = cloudGrad(cloudHash(uint(x1), uint(y1), s), f.x - 1.0, f.y - 1.0);
  float u = cloudFade(f.x), v = cloudFade(f.y);
  float ab = a + (b - a) * u, cd = c + (d - c) * u;
  return ab + (cd - ab) * v;
}
float cloudDensity(vec2 q, vec4 shape, int base) {
  vec2 w = vec2(cloudNoise(q * 0.5, 128.0, cloudSalt(base + 8)), cloudNoise(q * 0.5, 128.0, cloudSalt(base + 9)));
  float sum = 0.0, norm = 0.0, amp = 1.0, f = 1.0, period = 256.0;
  for (int k = 0; k < ${Du}; k++) {
    float n = cloudNoise((q + (k < ${Fu} ? shape.y : 0.0) * w) * f, period, cloudSalt(base + k));
    if (k > 0) n = n * (1.0 - shape.w) + (0.35 - abs(n)) * shape.w;
    sum += amp * n;
    norm += amp; amp *= shape.z; f *= 2.0; period *= 2.0;
  }
  return sum / norm;
}
float cloudShadeAt(vec2 xz) {
  float d = 0.0;
  if (uCloudThreshold.z > 0.0) d += uCloudThreshold.z * ((cloudDensity(xz * uCloudShape.x - uCloudShift.xy, uCloudShape, 0) - uCloudNorm.x) * uCloudNorm.y);
  if (uCloudThreshold.w > 0.0) d += uCloudThreshold.w * ((cloudDensity(xz * uCloudHeavy.x - uCloudShift.zw, uCloudHeavy, ${Iu}) - uCloudNorm.z) * uCloudNorm.w);
  float s = clamp((d - uCloudThreshold.x) / uCloudThreshold.y, 0.0, 1.0);
  return s * s * (3.0 - 2.0 * s);
}
`,Qu=`
uniform sampler2D uCloudMap;
uniform vec4 uCloudRect;     // the map's corner (x, z) and 1 / its side
float cloudMapShade(vec2 xz) { return texture(uCloudMap, (xz - uCloudRect.xy) * uCloudRect.zw).r; }
`,$u={height:16,rise:.2,size:256},ed=`
precision highp float;
in vec3 position;
uniform vec4 uCloudRect;
out vec2 vXZ;
void main() {
  vXZ = (position.xy * 0.5 + 0.5) / uCloudRect.zw;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,td=`
precision highp float;
precision highp int;
${Zu}
in vec2 vXZ;
out vec4 fragColor;
void main() { fragColor = vec4(cloudShadeAt(vXZ), 0.0, 0.0, 1.0); }
`,nd=class{uniforms;size;target;material;scene=new hi;camera=new So(-1,1,1,-1,0,1);drawn=``;constructor(e,t=512){this.uniforms=e,this.size=t,this.target=new Gt(t,t,{type:_,format:O,depthBuffer:!1,minFilter:s,magFilter:s,generateMipmaps:!1,wrapS:n,wrapT:n}),this.uniforms.uCloudMap.value=this.target.texture,this.material=new ka({glslVersion:Ge,vertexShader:ed,fragmentShader:td,depthTest:!1,depthWrite:!1,uniforms:{uCloudRect:this.uniforms.uCloudRect,uCloudShape:{value:new B},uCloudHeavy:{value:new B},uCloudShift:{value:new B},uCloudNorm:{value:new B},uCloudThreshold:{value:new B},uCloudSeed:{value:0}}});let r=new Wr(new Da(2,2),this.material);r.frustumCulled=!1,this.scene.add(r)}setArea(e,t,n){let r=this.uniforms.uCloudRect.value;(r.x!==e||r.y!==t||r.z!==1/n)&&(r.set(e,t,1/n,1/n),this.drawn=``)}draw(e,t,n=Tu){let r=JSON.stringify(t.cover>0&&t.cover<1?[t,n]:[t.cover]);if(r===this.drawn)return;this.drawn=r;let i=this.material.uniforms,a=this.uniforms.uCloudRect.value,{uCloudSeed:o,...s}=Yu(t,n,a.x,a.y);for(let[e,t]of Object.entries(s))i[e].value.fromArray(t);i.uCloudSeed.value=o,e.setRenderTarget(this.target),e.render(this.scene,this.camera)}dispose(){this.target.dispose(),this.material.dispose()}},rd={shift:0,chroma:1,light:0},id={sun:[1,1,1],sky:[1,1,1],haze:[1,1,1],shadeHue:215,shadeTurn:0,shadeDepth:0,litLean:1,hazeDensity:1,saturation:1},ad={spring:{shift:9,chroma:1.13,light:.015},summer:rd,autumn:{shift:-19,chroma:.7,light:-.03},winter:{shift:-30,chroma:.52,light:.02}},od={spring:{...id,sun:[.99,1,1.02],haze:[.97,1,1.02],shadeHue:205,shadeTurn:.15,hazeDensity:.85,saturation:1.03},summer:{...id,sun:[1.02,1,.97],haze:[1.03,1,.95],litLean:1.15,hazeDensity:1.1},autumn:{...id,sun:[1.04,.99,.9],haze:[1.05,.99,.9],shadeHue:285,shadeTurn:.15,litLean:1.3,hazeDensity:1.15},winter:{...id,sun:[.96,.99,1.06],sky:[.96,.99,1.06],haze:[.95,.99,1.07],shadeHue:255,shadeTurn:.3,shadeDepth:.02,litLean:.6,saturation:.94}};function sd(e,t,n){let r=t=>({shift:e.shift-22*t,chroma:e.chroma*(1-.2*t),light:e.light+.04*t});switch(n){case`dry`:return r(t===`summer`?1:.5);case`hot`:return r(t===`summer`?.75:.4);case`wet`:return{shift:e.shift*.6+4,chroma:e.chroma*1.1,light:e.light-.015};case`hard`:return{...e,chroma:e.chroma*.8,light:e.light+.03};case`mild`:return{shift:e.shift*.6,chroma:1+(e.chroma-1)*.6,light:e.light*.6};default:return e}}function cd(e){return e?sd(ad[e.season],e.season,e.character):rd}var ld=yt.smoothstep,ud=Math.PI/180,dd=e=>ld(e,100,114)*(1-ld(e,195,220));function fd(e,t,n){let r=n.shift===0&&n.chroma===1&&n.light===0,i=NaN,a=NaN,o=NaN,s=0,c=0,l=0;for(let u=0;u<e.length;u+=3){let d=e[u],f=e[u+1],p=e[u+2];if(r){t[u]=d,t[u+1]=f,t[u+2]=p;continue}if(d===i&&f===a&&p===o){t[u]=s,t[u+1]=c,t[u+2]=l;continue}i=d,a=f,o=p;let m=Math.cbrt(.4122214708*d+.5363325363*f+.0514459929*p),h=Math.cbrt(.2119034982*d+.6806995451*f+.1073969566*p),g=Math.cbrt(.0883024619*d+.2817188376*f+.6299787005*p),_=.2104542553*m+.793617785*h-.0040720468*g,v=1.9779984951*m-2.428592205*h+.4505937099*g,y=.0259040371*m+.7827717662*h-.808675766*g,b=Math.hypot(v,y),x=Math.atan2(y,v)/ud;x<0&&(x+=360);let S=dd(x)*ld(b,.02,.06);if(S<=0){t[u]=s=d,t[u+1]=c=f,t[u+2]=l=p;continue}x+=n.shift*S*(n.shift>0?1-ld(x,140,172):1),b*=1+(n.chroma-1)*S,_+=n.light*S;let C=b*Math.cos(x*ud),w=b*Math.sin(x*ud),T=(_+.3963377774*C+.2158037573*w)**3,E=(_-.1055613458*C-.0638541728*w)**3,D=(_-.0894841775*C-1.291485548*w)**3;t[u]=s=Math.max(0,4.0767416621*T-3.3077115913*E+.2309699292*D),t[u+1]=c=Math.max(0,-1.2684380046*T+2.6097574011*E-.3413193965*D),t[u+2]=l=Math.max(0,-.0041960863*T-.7034186147*E+1.707614701*D)}}var pd=(e,t,n)=>e.setRGB(e.r*(1+(t[0]-1)*n),e.g*(1+(t[1]-1)*n),e.b*(1+(t[2]-1)*n)),md=(e,t,n)=>e+(((t-e)%360+540)%360-180)*n;function hd(e,t){if(!t)return e;let n=od[t.season],r=1-e.night;return r<=0||(pd(e.sunColor,n.sun,r),pd(e.rimColor,n.sun,r),pd(e.skyColor,n.sky,r),pd(e.hazeColor,n.haze,r),pd(e.skyTop,n.sky,r),pd(e.skyBottom,n.haze,r),e.shadeHue=md(e.shadeHue,n.shadeHue,n.shadeTurn*r),e.shadeDepth+=n.shadeDepth*r,e.litLean*=1+(n.litLean-1)*r,e.hazeDensity*=1+(n.hazeDensity-1)*r,e.saturation*=1+(n.saturation-1)*r),e}var gd={sky:1,shadowFade:.4,shadowLift:1,shadowBlur:4,contrast:.78,litLean:.04,skyChroma:.8,shadeHue:270,shadeTurn:.8,rim:.04,hazeDensity:.5,hazeFloor:.5,exposure:.7,saturation:1},_d={contrast:.88,saturation:1.03,hazeDensity:.7,hazeFloor:.6,exposure:.43},vd=(e,t,n)=>e+(t-e)*n,yd=(e,t,n)=>e+((t-e+540)%360-180)*n,bd=e=>.2126*e.r+.7152*e.g+.0722*e.b,xd=e=>e.clone().multiplyScalar(1/Math.max(e.r,e.g,e.b,.001));function Sd(e,t){let n=bd(e);return new H(vd(n,e.r,t),vd(n,e.g,t),vd(n,e.b,t))}var Cd=e=>e*e,wd=e=>{let t=Math.min(1,Math.max(0,(e-.85)/.15));return t*t*(3-2*t)},Td=.8,Ed=.4,Dd=.65;function Od(e,t,n){if(t<=0)return e;let r=t,i=e.night,a=Sd(xd(e.skyColor),n.skyChroma),o=a.clone().multiplyScalar(bd(e.hazeColor)/Math.max(bd(a),.001)),s=vd(n.exposure*e.cloudDim,_d.exposure,i)**(r*(1.5-.5*r));return{...e,sunColor:xd(e.sunColor).lerp(a,r*.98).multiplyScalar(vd(Math.max(e.sunColor.r,e.sunColor.g,e.sunColor.b),1,r)),rimColor:e.rimColor.clone().multiplyScalar(vd(1,n.rim,r)),hazeColor:e.hazeColor.clone().lerp(o,r*e.cloudHaze),skyTop:e.skyTop.clone().lerp(Sd(e.skyTop,.4),r),skyBottom:e.skyBottom.clone().lerp(Sd(e.skyBottom,.4),r),shadeHue:yd(e.shadeHue,n.shadeHue,r*n.shadeTurn),shadeDepth:e.shadeDepth*vd(1,vd(n.contrast,_d.contrast,i),r),litLean:e.litLean*vd(1,n.litLean,r),hazeDensity:e.hazeDensity*vd(1,vd(n.hazeDensity,_d.hazeDensity,i),r),hazeFloor:e.hazeFloor*vd(1,vd(n.hazeFloor,_d.hazeFloor,i),r),exposure:e.exposure*s,saturation:e.saturation*vd(1,vd(n.saturation,_d.saturation,i),r)}}var kd=1.5,Ad=.15,jd=1.25,Md=.6,Nd=`
uniform sampler2D tWaterA;     // the water as it was (level, flow x, flow z, mud per cell)
uniform sampler2D tWaterB;     // the water as last sent
uniform float uWaterBlend;     // how far it has eased from A to B
uniform vec4 uWaterGrid;       // x0, z0, 1 / cell, 0 with no map
uniform float uWaterHigh;      // the highest the wet surface is, as it was and as last sent
vec4 waterCell(ivec2 c) {
  ivec2 n = textureSize(tWaterA, 0);
  c = clamp(c, ivec2(0), n - 1);
  return mix(texelFetch(tWaterA, c, 0), texelFetch(tWaterB, c, 0), uWaterBlend);
}
// The sheet over a point, on its own triangles (split from the +x cell to the +z one, as WaterField.index lays them):
// per cell, the surface (x), the surface it continues, before its dive (y; the same where it's wet), and its mud (z;
// how far down, negative, where it dives: the water isn't drawn below -HIDDEN_DIVE). Far below everything off the grid
// or with no map.
vec3 waterSheet(vec2 xz) {
  if (uWaterGrid.w < 0.5) return vec3(-1.0e6, -1.0e6, -1.0e6);
  vec2 g = (xz - uWaterGrid.xy) * uWaterGrid.z - 0.5;
  ivec2 n = textureSize(tWaterA, 0);
  // Off the sheet (which reaches the grid's edge, half a cell past the edge cells' centres).
  if (g.x < -0.5 || g.y < -0.5 || g.x > float(n.x) - 0.5 || g.y > float(n.y) - 0.5) return vec3(-1.0e6, -1.0e6, -1.0e6);
  vec2 i = floor(g), f = g - i;
  ivec2 c = ivec2(i);
  vec4 a = waterCell(c), b = waterCell(c + ivec2(1, 0)), d = waterCell(c + ivec2(0, 1)), e = waterCell(c + ivec2(1, 1));
  // Where it dives, its mud is how far down, negative (layWater).
  vec3 va = vec3(a.x, a.x - min(a.w, 0.0), a.w), vb = vec3(b.x, b.x - min(b.w, 0.0), b.w);
  vec3 vd = vec3(d.x, d.x - min(d.w, 0.0), d.w), ve = vec3(e.x, e.x - min(e.w, 0.0), e.w);
  return f.x + f.y < 1.0 ? va + (vb - va) * f.x + (vd - va) * f.y : ve + (vd - ve) * (1.0 - f.x) + (vb - ve) * (1.0 - f.y);
}
// The water's surface over a point, metres, as drawn.
float waterTop(vec2 xz) { return waterSheet(xz).x; }
// The surface of the water nearest a point: as drawn where it's wet, and on dry land the water it's nearest (the surface
// the sheet dives from). What the reflection leaves out is what's under it: a fence standing in a flood isn't mirrored
// below the flood, and nor is a dry hollow lower than the river beside it (mirrored, it would show in the river).
float waterNear(vec2 xz) { return waterSheet(xz).y; }
`;function Pd(e){let{nx:t,nz:n,level:r}=e,i=t*n;if(r.length!==i)throw Error(`water map: ${r.length} levels for ${t} x ${n} cells`);let a=new Float32Array(i*4),o=new Uint8Array(i).fill(255),s=new Float32Array(i).fill(-1/0),c=new Int32Array(i),l=new Int32Array(i),u=0;for(let t=0;t<i;t++)Number.isNaN(r[t])||(a[t*4]=r[t],a[t*4+1]=e.flowX?.[t]??0,a[t*4+2]=e.flowZ?.[t]??0,a[t*4+3]=yt.clamp(e.mud?.[t]??0,0,1),o[t]=0,s[t]=r[t],c[u++]=t);let d=new Float32Array(u);for(let e=0;e<u;e++)d[e]=r[c[e]];for(let e=1;u&&e<255;e++){let r=0;for(let i=0;i<u;i++){let u=c[i],d=u%t,f=(u-d)/t,p=s[u],m=d>0?-1:0,h=+(d<t-1),g=f>0?-1:0,_=+(f<n-1);for(let n=g;n<=_;n++)for(let i=m;i<=h;i++){let c=u+n*t+i,d=o[c];d<e||(d===255&&(o[c]=e,l[r++]=c),p>s[c]&&(s[c]=p,a[c*4+1]=a[u*4+1],a[c*4+2]=a[u*4+2],a[c*4+3]=a[u*4+3]))}}[c,l]=[l,c],u=r}for(let e=0;e<i;e++){if(o[e]===0)continue;let t=Number.isFinite(s[e])?Math.min(kd*Math.max(0,o[e]-1),4):4;a[e*4]=Number.isFinite(s[e])?s[e]-t:-1e3,t>0&&(a[e*4+3]=-t)}return d.sort((e,t)=>e-t),{data:a,dist:o,low:d[0]??0,high:d[d.length-1]??0,mid:d.length?d[d.length>>1]:null}}var Fd=class{geometry=null;a=Id(1,1);b=Id(1,1);grid=new B(0,0,1,0);mirror=0;low=0;high=0;wetLow=0;wetHigh=0;any=!1;get shownLow(){return this.wetLow-jd}floor=null;nx=0;nz=0;cell=1;x0=0;z0=0;from=null;to=null;start=0;ease=0;blend(e){if(this.ease<=0)return 1;let t=yt.clamp((e-this.start)/this.ease,0,1);return t*t*(3-2*t)}settle(e){return!this.any||!this.to||this.to.mid!==null||this.blend(e)<1?!1:(this.any=!1,!0)}set(e,t,n=Md){if(!e){this.any=!1,this.from=this.to=null,this.grid.w=0,this.floor=null;return}let r=Pd(e);if(!(this.geometry&&this.to&&e.nx===this.nx&&e.nz===this.nz&&e.cell===this.cell&&e.x0===this.x0&&e.z0===this.z0))this.nx=e.nx,this.nz=e.nz,this.cell=e.cell,this.x0=e.x0,this.z0=e.z0,this.build(),this.from=r,n=0;else{let e=this.blend(t),n=this.from,r=this.to,i=new Float32Array(n.data.length);for(let t=0;t<i.length;t++)i[t]=n.data[t]+(r.data[t]-n.data[t])*e;let a=new Uint8Array(n.dist.length);for(let t=0;t<a.length;t++)a[t]=e<1?Math.min(n.dist[t],r.dist[t]):r.dist[t];let o=(e<1?[n,r]:[r]).filter(e=>e.mid!==null);this.from={data:i,dist:a,low:Math.min(...o.map(e=>e.low)),high:Math.max(...o.map(e=>e.high)),mid:o.length?r.mid??n.mid:null}}n>0&&r.mid===null&&this.from.mid!==null?this.to={...r,data:Ld(this.from.data)}:(n>0&&r.mid!==null&&this.from.mid===null&&(this.from={...this.from,data:Ld(r.data)}),this.to=r),this.start=t,this.ease=n,this.upload(this.a,this.from.data),this.upload(this.b,this.to.data),this.grid.set(this.x0,this.z0,1/this.cell,1),this.mirror=r.mid??this.from.mid??0,this.floor=r.mid===null?null:r.low,this.any=r.mid!==null||n>0&&this.from.mid!==null,this.index()}upload(e,t){e.image.data=t,e.needsUpdate=!0}build(){this.geometry?.dispose(),this.a.dispose(),this.b.dispose();let{nx:e,nz:t,cell:n,x0:r,z0:i}=this,a=e+2,o=t+2;this.a=Id(e,t),this.b=Id(e,t);let s=(e,t)=>e===0?0:e===t+1?t:e-.5,c=new Float32Array(a*o*3),l=new Float32Array(a*o*2);for(let u=0;u<o;u++)for(let o=0;o<a;o++){let d=u*a+o;c[d*3]=r+s(o,e)*n,c[d*3+2]=i+s(u,t)*n,l[d*2]=Math.min(Math.max(o-1,0),e-1),l[d*2+1]=Math.min(Math.max(u-1,0),t-1)}let u=new Mr;u.setAttribute(`position`,new xr(c,3)),u.setAttribute(`uv`,new xr(l,2)),u.setIndex(new xr(new Uint32Array((a-1)*(o-1)*6),1).setUsage(We)),u.boundingBox=new Yt,this.geometry=u}index(){let e=this.geometry,{nx:t,nz:n}=this,r=this.from.dist,i=this.to.dist,a=t+2,o=n+2,s=new Uint8Array(a*o);for(let e=0;e<o;e++){let o=Math.min(Math.max(e-1,0),n-1)*t;for(let n=0;n<a;n++){let c=o+Math.min(Math.max(n-1,0),t-1);s[e*a+n]=+(r[c]<=1||i[c]<=1)}}let c=e.index,l=c.array,u=0,d=1/0,f=-1/0,p=1/0,m=-1/0;for(let e=0;e<n+1;e++)for(let n=0;n<t+1;n++){let t=e*a+n;if(!(s[t]|s[t+1]|s[t+a]|s[t+a+1]))continue;let r=t+1,i=t+a,o=i+1;l[u++]=t,l[u++]=i,l[u++]=r,l[u++]=r,l[u++]=i,l[u++]=o,d=Math.min(d,n),f=Math.max(f,n+1),p=Math.min(p,e),m=Math.max(m,e+1)}c.clearUpdateRanges(),c.addUpdateRange(0,u),c.needsUpdate=!0,e.setDrawRange(0,u);let h=[this.from,this.to].filter(e=>e.mid!==null);this.wetLow=Math.min(...h.map(e=>e.low),1/0),this.wetHigh=Math.max(...h.map(e=>e.high),-1/0),h.length||(this.wetLow=this.wetHigh=0),this.low=this.wetLow-4,this.high=this.wetHigh;let g=e.boundingBox,_=e.attributes.position.array;u?(g.min.set(_[(p*a+d)*3],this.low,_[(p*a+d)*3+2]),g.max.set(_[(m*a+f)*3],this.high,_[(m*a+f)*3+2])):(g.makeEmpty(),this.any=!1),e.boundingSphere=null}};function Id(e,t){return new Ai(new Float32Array(e*t*4),e,t,T,g)}function Ld(e){let t=e.slice();for(let e=0;e<t.length;e+=4)t[e]-=4,t[e+3]=-4;return t}var Rd=`
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
// 2D simplex noise (Ashima Arts, MIT), in [-1, 1].
vec3 permute3(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute3(permute3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm2(vec2 p) { return snoise(p) * 0.65 + snoise(p * 2.13 + 17.1) * 0.35; }
// Brush strokes: noise stretched along a direction, so it reads as dabs laid side by side rather than as a cloud.
float strokes(vec2 p, float angle) {
  float c = cos(angle), s = sin(angle);
  vec2 q = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
  return snoise(q * vec2(0.55, 2.6)) * 0.6 + snoise(q * vec2(1.3, 5.5) + 31.7) * 0.4;
}
// Brush dabs: the plane covered in overlapping, elongated dabs (cells in a stretched, turned frame), each with its own
// value, the way a painter lays strokes side by side. The cells blend softly into their neighbours (a smooth Voronoi), so a
// dab has a soft, rounded edge rather than a cut one. Returns the dab value in about [-1, 1].
float dabs(vec2 p, float angle, float stretch) {
  float c = cos(angle), s = sin(angle);
  vec2 q = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
  q.x /= stretch;
  vec2 i = floor(q), f = fract(q);
  float sum = 0.0, wsum = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = hash22(i + g) * 0.9 + 0.05;
    vec2 r = g + o - f;
    r.x *= stretch * 0.5;
    float w = exp(-9.0 * dot(r, r));
    sum += w * (hash12(i + g + 4.1) * 2.0 - 1.0);
    wsum += w;
  }
  return sum / max(wsum, 1e-5);
}
// Two layers of dabs at different sizes and angles, so no grid shows: a value in about [-1, 1].
float dabLayer(vec2 p, float scale, float angle) {
  float a = dabs(p * scale, angle, 2.6);
  float b = dabs(p * scale * 1.9 + 17.3, angle + 0.4, 2.2);
  // Bristle streaks along the stroke.
  float hair = snoise(vec2(dot(p, vec2(cos(angle), sin(angle))) * scale * 1.2, dot(p, vec2(-sin(angle), cos(angle))) * scale * 9.0));
  return clamp(a * 1.25, -1.0, 1.0) * 0.6 + b * 0.3 + hair * 0.12;
}
// Dabs laid along a direction that may change across a surface. Turning the whole pattern by a varying angle would swirl it
// (far from the origin a small turn is a big shift), so the dabs are laid at fixed 30° steps and the two nearest blended.
float paintDabs(vec2 p, float scale, float angle) {
  const float STEP = 0.5235988;
  float k = angle / STEP, k0 = floor(k), w = smoothstep(0.3, 0.7, k - k0);
  return mix(dabLayer(p, scale, k0 * STEP), dabLayer(p, scale, (k0 + 1.0) * STEP), w);
}
float paintStrokes(vec2 p, float angle) {
  const float STEP = 0.5235988;
  float k = angle / STEP, k0 = floor(k), w = smoothstep(0.3, 0.7, k - k0);
  return mix(strokes(p, k0 * STEP), strokes(p, (k0 + 1.0) * STEP), w);
}
`,zd=`
vec3 linToOklab(vec3 c) {
  c = max(c, 0.0);
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(l, 1.0 / 3.0); m = pow(m, 1.0 / 3.0); s = pow(s, 1.0 / 3.0);
  return vec3(0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
              1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
              0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLinRaw(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
              -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
              -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 oklabToLin(vec3 c) { return max(oklabToLinRaw(c), 0.0); }
// To linear sRGB, keeping the hue and lightness and giving up chroma when the colour is out of gamut, as a painter's pigment
// would (clipping the channels instead turns a deep green shade neon).
vec3 oklabToLinFit(vec3 lab) {
  vec3 c = oklabToLinRaw(lab);
  if (min(c.r, min(c.g, c.b)) >= 0.0) return c;
  float lo = 0.0, hi = 1.0;
  for (int i = 0; i < 6; i++) {
    float m = (lo + hi) * 0.5;
    vec3 t = oklabToLinRaw(vec3(lab.x, lab.yz * m));
    if (min(t.r, min(t.g, t.b)) >= 0.0) lo = m; else hi = m;
  }
  return max(oklabToLinRaw(vec3(lab.x, lab.yz * lo)), 0.0);
}
// Rotates a colour's hue by 'turn' radians, scales its chroma and shifts its lightness, in OKLCh.
vec3 lchShift(vec3 lab, float dL, float cMul, float turn) {
  float c = cos(turn), s = sin(turn);
  vec2 ab = vec2(c * lab.y - s * lab.z, s * lab.y + c * lab.z) * cMul;
  return vec3(lab.x + dL, ab);
}
// Pulls a colour's hue part of the way towards a target hue (radians in OKLab's a-b plane), the short way round, and never
// more than about 40°: a painter cools a shade, he doesn't swap its colour (yellow wheat in shade stays a warm olive).
vec3 hueToward(vec3 lab, float target, float amount) {
  float h = atan(lab.z, lab.y);
  float d = mod(target - h + 3.14159265, 6.2831853) - 3.14159265;
  float c = length(lab.yz), nh = h + clamp(d * amount, -0.7, 0.7);
  return vec3(lab.x, c * cos(nh), c * sin(nh));
}
`,Bd=`
uniform vec3 uSunDir;        // world, towards the sun
uniform vec3 uSunColor;      // linear, multiplies the lit band
uniform vec3 uSkyColor;      // linear, the light that fills shadows from above
uniform vec3 uRimColor;      // linear, the warm edge light on foliage
uniform float uShadeHue;     // OKLab hue the shade band leans to (radians)
uniform float uShadeLean;    // how far it leans (0..1)
uniform float uShadeDepth;   // lightness taken off in shade
uniform float uLitHue;       // OKLab hue the lit band leans to
uniform float uLitLean;
uniform vec3 uOvercast;      // under cloud: x the share of light from the whole sky, y the share of cast shadow taken away,
                             // z how much wider shadows' edges get (see overcast.ts)
uniform float uTime;
uniform vec2 uWindDir;       // where the wind blows towards, a unit vector in xz
uniform float uWindSpeed;    // m/s, the wind's average (the game's, eased by the game)
uniform vec2 uWindDrift;     // how far the leaves in the air have been carried downwind (metres)
uniform float uWindFlutter;  // the leaves' flutter phase (radians)
uniform vec3 uViewBack;     // the main camera's backward direction (wind moves things only across it)
uniform sampler2D uShadowMap;
uniform mat4 uShadowMatrix;  // world -> shadow-map uv and depth
uniform vec2 uShadowTexel;
uniform float uMirror;       // 1 while drawing the water's reflection: the scene mirrored in the plane y = uMirrorY
uniform float uMirrorY;      // (the water at another height reads it shifted on screen: see WATER_FRAG)
${Nd}
`,Vd=`
${Qu}
uniform float uCloudStrength;  // how much a cloud's shade counts: as direct as the sun is (none before dawn, faint by the moon)
uniform vec3 uCloudOvercast;   // under a cloud, as uOvercast
uniform vec3 uCloudSunColor;   // under a cloud, as uSunColor
uniform vec3 uCloudRimColor;   // under a cloud, as uRimColor
uniform vec4 uCloudBands;      // under a cloud: the shade's hue (radians from uShadeHue, the short way), its depth, the lit
                               // band's lean, and the exposure (over the grade's)
uniform float uLightExposure;  // in the gaps: the exposure, over the grade's
// The cloud's shade here, 0 in the sun .. 1 under the deepest of it, as strong as the sun is direct.
float gCloud = 0.0;
void cloudAt(vec3 p) { gCloud = cloudMapShade(p.xz) * uCloudStrength; }
vec3 overcastHere() { return mix(uOvercast, uCloudOvercast, gCloud); }
vec3 sunColorHere() { return mix(uSunColor, uCloudSunColor, gCloud); }
vec3 rimColorHere() { return mix(uRimColor, uCloudRimColor, gCloud); }
float shadeHueHere() { return uShadeHue + uCloudBands.x * gCloud; }
vec3 exposeHere(vec3 c) { return c * mix(uLightExposure, uCloudBands.w, gCloud); }
`,Hd=`
uniform sampler2D uSkyMap;
uniform vec4 uSkyRect;        // the sky map's corner (x, z) and 1 / its side
uniform vec3 uGapSkyTop;      // the sky in the gaps between the clouds, overhead
uniform vec3 uGapSkyBottom;   // and low down
uniform vec3 uCloudLit;       // a cloud's sunlit side, in the hour's light
uniform vec3 uCloudBelly;     // its underside; and the whole sky once it closes
uniform float uSkyClosed;     // how far the sky has closed, 0..1
float skyCloudAt(vec2 xz) { return texture(uSkyMap, (xz - uSkyRect.xy) * uSkyRect.zw).r; }
// Where a ray from p along r meets the clouds; rays near the horizon as if a little higher.
vec2 skyPoint(vec3 p, vec3 r) { return p.xz + r.xz / max(r.y, ${$u.rise.toFixed(2)}) * ${$u.height.toFixed(1)}; }
// The sky at xz, the gaps' between the top and the bottom by low (0 overhead .. 1 the horizon); cloud is how much of it
// is cloud.
vec3 mirrorSky(vec2 xz, float low, out float cloud) {
  vec3 gap = mix(uGapSkyTop, uGapSkyBottom, low);
  cloud = skyCloudAt(xz);
  float closed = uSkyClosed;
  // Lit (the developer's pick, #8): the side towards the sun bright, the thick middle a cooler grey.
  float sunward = skyCloudAt(xz + normalize(uSunDir.xz + vec2(1e-4, 0.0)) * 8.0);
  float edge = smoothstep(0.0, 0.25, cloud - sunward);
  vec3 belly = mix(mix(uCloudLit, uCloudBelly, 0.85) * 0.9, uCloudBelly, closed);
  vec3 col = mix(mix(mix(uCloudLit, uCloudBelly, closed), belly, smoothstep(0.5, 1.0, cloud)), uCloudLit * 1.15,
    edge * (1.0 - closed));
  return mix(gap, col, cloud);
}
`,Ud=`
float sunVisibility(vec3 worldPos, vec3 n, float brush) {
  vec3 p = worldPos + n * 0.04;
  vec4 s = uShadowMatrix * vec4(p, 1.0);
  vec3 uvz = s.xyz / s.w;
  if (uvz.x < 0.0 || uvz.x > 1.0 || uvz.y < 0.0 || uvz.y > 1.0 || uvz.z > 1.0) return 1.0;
  // The brush wobbles where the edge is sampled, so a shadow's border is painted rather than ruled.
  vec2 wob = vec2(brush, snoise(worldPos.xz * 1.7 + 9.0)) * uShadowTexel * 2.5;
  vec3 overcast = overcastHere();
  float vis = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 2.39996 + hash12(worldPos.xz * 31.0) * 6.283;
    float r = sqrt((float(i) + 0.5) / 8.0) * 2.2 * (1.0 + overcast.z);
    vec2 o = vec2(cos(a), sin(a)) * r * uShadowTexel + wob;
    float d = texture(uShadowMap, uvz.xy + o).r;
    vis += (uvz.z - 0.0015 > d) ? 0.0 : 1.0;
  }
  return mix(vis / 8.0, 1.0, overcast.y);
}
`,Wd=`
// The look's light colours as tints: their hue, at a set strength, with the brightness left to the exposure.
vec3 tintOf(vec3 c, float amount) { return mix(vec3(1.0), c / max(max(c.r, c.g), max(c.b, 1e-3)), amount); }
vec3 sunTint() { return tintOf(sunColorHere(), 0.4); }
vec3 skyTint() { return tintOf(uSkyColor, 0.45); }
// How lit a surface is by the sun, 0..1, measured against flat ground: flat ground is in full sun whatever the hour (a
// painter keeps an evening meadow warm and lit), slopes and sides turned away from the sun fall into half-tone and shade.
// Under cloud the light comes from the whole sky instead: tops lit, sides in half-tone, undersides in shade.
float sunLight(vec3 n, float wrap) {
  float rel = dot(n, uSunDir) / max(uSunDir.y, 0.3);
  float sun = clamp((rel + wrap) / (1.0 + wrap), 0.0, 1.0);
  return mix(sun, clamp(0.5 + 0.5 * n.y, 0.0, 1.0), overcastHere().x);
}
// The direction brush strokes run on the ground: along the contours where it slopes, a set angle where it's flat.
float contourAngle(vec3 n, float fallback) {
  float m = length(n.xz);
  float a = atan(n.z, n.x) + 1.5707963;
  vec2 v = vec2(cos(2.0 * a), sin(2.0 * a)) * smoothstep(0.02, 0.12, m) + vec2(cos(2.0 * fallback), sin(2.0 * fallback)) * 0.25;
  return mod(atan(v.y, v.x) * 0.5, 3.14159265);
}

vec3 paintBands(vec3 base, float light, float soft, float upness) {
  vec3 lab = linToOklab(base);
  float shadeHue = shadeHueHere(), shadeDepth = mix(uShadeDepth, uCloudBands.y, gCloud), litLean = mix(uLitLean, uCloudBands.z, gCloud);
  // Shade: darker, a touch richer, with some of the look's shade colour mixed in (teal at noon, violet at dusk), the way a
  // painter cools a shadow with blue rather than black. Mixing, not turning the hue: yellow wheat in shade goes olive, not red.
  vec3 shadeMix = vec3(0.0, cos(shadeHue), sin(shadeHue)) * uShadeLean * 0.09;
  vec3 shade = lchShift(lab, -shadeDepth * lab.x, 1.1, 0.0) + shadeMix;
  // Half-tone: between, with less of it.
  vec3 half_ = lchShift(lab, -shadeDepth * 0.45 * lab.x, 1.06, 0.0) + shadeMix * 0.45;
  // Lit: the colour itself, warmed by the hour.
  vec3 lit = lchShift(lab, 0.02, 1.05, 0.0) + vec3(0.0, cos(uLitHue), sin(uLitHue)) * litLean * 0.09;
  float t1 = smoothstep(0.30 - soft, 0.30 + soft, light);
  float t2 = smoothstep(0.62 - soft, 0.62 + soft, light);
  vec3 col = oklabToLinFit(mix(mix(shade, half_, t1), lit, t2));
  // The sky fills the shade from above; the sun tints the lit band.
  vec3 sky = skyTint() * (0.8 + 0.2 * upness);
  return mix(col * sky, col * sunTint(), t2 * 0.85 + t1 * 0.15);
}
`,Gd=`
// The waterline on things standing in the water (#18, the developer's pick "foam line"): a thin line of foam where the
// water meets them (not along blades and leaves, where it would speckle), and a faint wet band above it, darker where the
// water has wetted them, its top ragged.
// Only where the water is drawn, not where the sheet dives under the land, and not on things floating in it (gFloats, set
// by the material: a boat's inside is dry, and its own wet line rides with it).
float gFloats = 0.0;
vec3 waterline(vec3 color, vec3 p, float dy) {
  vec3 sheet = waterSheet(p.xz);
  // Where the water is drawn (as sheetHidden judges it).
  float shown = smoothstep(-${Ad}, -${Ad/2}, sheet.z);
  float h = p.y - sheet.x;
  if (shown <= 0.0 || h < -0.05 || h > 0.3) return color;
  float top = 0.16 + 0.07 * snoise(p.xz * 2.7 + p.y * 1.3);
  float wet = (1.0 - smoothstep(top * 0.6, top, h)) * smoothstep(-0.05, 0.0, h) * shown;
  vec3 lab = linToOklab(color);
  vec3 wetColor = oklabToLin(vec3(lab.x * 0.66, lab.yz * 1.15));
  color = mix(color, wetColor, wet * 0.55);
#ifndef THIN
  float w = max(dy, 0.004);
  float line = (1.0 - smoothstep(0.025, 0.025 + w, abs(h - 0.01))) * shown;
  // Fainter along the ground's shore than round things standing in the water.
#ifdef FIELDS
  line *= 0.45;
#endif
  color = mix(color, exposeHere(vec3(0.86, 0.86, 0.82) * mix(skyTint(), sunTint(), 0.5)), line * 0.8);
#endif
  return color;
}
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gAux;   // view normal xy, view depth, ink (1 inked, 0 painted)
void writeGBuffer(vec3 color, vec3 worldNormal, float viewDepth, float ink, float alpha) {
  // (Taken before any fragment leaves, where its neighbours' are still there to compare with.)
  float dy = fwidth(vWorldPos.y);
  // In the reflection, what's under the water isn't reflected: under the water nearest (waterNear; a flood stands higher
  // than the river).
  if (uMirror > 0.5 && vWorldPos.y < waterNear(vWorldPos.xz) - 0.01) discard;
#ifndef WATER_SHEET
  if (gFloats < 0.5 && vWorldPos.y < uWaterHigh + 0.3) color = waterline(color, vWorldPos, dy);
#endif
  vec3 vn = normalize((viewMatrix * vec4(worldNormal, 0.0)).xyz);
  // The reflection is stored premultiplied (over a clear, transparent black), so the water can filter it without darkening
  // the edges of what's reflected.
  gColor = vec4(uMirror > 0.5 ? color * alpha : color, alpha);
  gAux = vec4(vn.xy, viewDepth, ink);
}
`,Kd=5.5,qd=1.1,Jd={lift:2,linger:5,rise:.8,top:7,head:1},Yd=1,Xd=1,Zd=.6,Qd=.5,$d=.7,ef=20,tf=.4,nf=class e{a=e.texture();b=e.texture();blend=0;grid=new B(0,0,1,1);any=!1;storm=0;look=Jd;source=null;lift=new Float32Array;ground=new Float32Array;groundHalf=new Uint16Array;emptyHalf=new Uint16Array;blank=new Set;d=new Float32Array;m=new Float32Array;d2=new Float32Array;m2=new Float32Array;speed=new Float32Array;speedSet=!1;speedTick=0;nx=0;nz=0;cell=1;x0=0;z0=0;tick=-1;snapA=null;snapB=null;fresh=!0;static texture(){let e=new Ai(new Uint16Array(4),1,1,T,_);return e.magFilter=s,e.minFilter=s,e.wrapS=e.wrapT=n,e.needsUpdate=!0,e}setSource(e){this.source=e,this.nx&&this.layLift()}restart(){this.fresh=!0}set(e,t,n){if(this.blend=e.tick===t.tick?1:n,t!==this.snapB||e!==this.snapA||this.fresh){if((this.nx!==t.nx||this.nz!==t.nz||this.cell!==t.cell||this.x0!==t.x0||this.z0!==t.z0)&&this.lay(t),this.fresh||t.tick<this.tick||t.tick>this.tick+10){this.d.fill(0),this.m.fill(0),this.any=!1,this.speedSet=!1;for(let e=0;e<ef;e++)this.step(t,tf);this.fresh=!1,this.upload(this.a),this.upload(this.b)}else{for(;this.tick<e.tick;)this.step(e);for(e===this.snapB?this.swap():this.upload(this.a);this.tick<t.tick;)this.step(t);this.upload(this.b)}this.tick=t.tick,this.snapA=e,this.snapB=t}}swap(){let e=this.a;this.a=this.b,this.b=e}lay(e){this.nx=e.nx,this.nz=e.nz,this.cell=e.cell,this.x0=e.x0,this.z0=e.z0;let t=e.nx*e.nz;this.grid.set(e.x0,e.z0,1/(e.nx*e.cell),1/(e.nz*e.cell)),this.lift=new Float32Array(t),this.ground=new Float32Array(t),this.groundHalf=new Uint16Array(t),this.emptyHalf=new Uint16Array(t),this.d=new Float32Array(t),this.m=new Float32Array(t),this.d2=new Float32Array(t),this.m2=new Float32Array(t),this.speed=new Float32Array(t),this.speedSet=!1,this.layLift(),this.fresh=!0}layLift(){let{nx:e,nz:t,cell:n,x0:r,z0:i}=this;this.lift.fill(0);let a=n<=4?this.source:null;if(a&&this.ground.fill(0),a)for(let o=0;o<t;o++)for(let t=0;t<e;t++){let s=r+(t+.5)*n,c=i+(o+.5)*n,l=Math.floor((s-a.x0)/a.cell),u=Math.floor((c-a.z0)/a.cell);l<0||u<0||l>=a.nx||u>=a.nz||(this.lift[o*e+t]=a.lift[u*a.nx+l],this.ground[o*e+t]=a.ground[u*a.nx+l])}for(let e=0;e<this.ground.length;e++)this.groundHalf[e]=of(this.ground[e]),this.emptyHalf[e]=of(this.ground[e]+Qd);this.blank.clear(),this.speedSet=!1}step(e,t=.1){if(this.tick++,this.storm<=0&&!this.any){this.speedSet=!1;return}let{nx:n,nz:r}=this,i=this.cell,a=this.look,o=Math.exp(-t/a.linger),s=Zd*t/i,c=this.d,l=this.m,u=this.d2,d=this.m2,f=this.lift,p=e.u,m=e.v,h=this.speed,g=Math.max(Kd,qd*e.speed),_=this.storm*a.lift*t,v=this.speedSet?this.storm*a.head*Xd:0,y=$d*a.top,b=Math.max(t,(e.tick-this.speedTick)*.1),x=a.rise*t,S=a.top,C=n-1,w=r-1,T=!1;for(let e=0,i=0;e<r;e++)for(let a=0;a<n;a++,i++){let E=p[i],D=m[i],O=a-E*s,k=e-D*s;O=O<0?0:O>C?C:O,k=k<0?0:k>w?w:k;let A=O|0,ee=k|0;A>n-2&&(A=n-2),ee>r-2&&(ee=r-2);let te=O-A,j=k-ee,ne=ee*n+A,re=ne+n,M=c[ne],ie=c[ne+1],ae=c[re],oe=c[re+1],se=0,ce=0;if(M+ie+ae+oe>0){let e=(1-te)*(1-j),t=te*(1-j),n=(1-te)*j,r=te*j;se=(M*e+ie*t+ae*n+oe*r)*o,ce=(l[ne]*e+l[ne+1]*t+l[re]*n+l[re+1]*r)*o,ce=Math.min(ce+se*x,se*S)}let le=f[i];if(le>0&&_>0){let e=Math.sqrt(E*E+D*D),n=e-g;if(n>0){let e=_*le*n/(1+n/6);se+=e,ce+=e*Qd}let r=(e-h[i])/b-Yd;if(v>0&&r>0&&n>-2){let e=v*le*Math.min(r,10)*t;se+=e,ce+=e*y}h[i]=e}se<1e-4?(se=0,ce=0):T=!0,u[i]=se,d[i]=ce}this.d=u,this.m=d,this.d2=c,this.m2=l,this.any=T,this.speedSet=_>0,this.speedTick=e.tick}upload(e){let t=this.nx*this.nz,n=e.image.data;if((e.image.width!==this.nx||e.image.height!==this.nz)&&(n=new Uint16Array(t*4),e.image={data:n,width:this.nx,height:this.nz},e.dispose(),this.blank.delete(e)),this.any)this.blank.delete(e);else{if(this.blank.has(e))return;this.blank.add(e)}let r=this.d,i=this.m,a=this.ground,o=this.groundHalf,s=this.emptyHalf;for(let e=0,c=0;e<t;e++,c+=4){let t=r[e];n[c+1]=o[e],n[c+3]=0,t>0?(n[c]=of(t),n[c+2]=of(a[e]+i[e]/t)):(n[c]=0,n[c+2]=s[e])}e.needsUpdate=!0}},rf=new Float32Array(1),af=new Uint32Array(rf.buffer);function of(e){rf[0]=e;let t=af[0],n=t>>>23&255;return n<113?t>>>16&32768:t>>>16&32768|n-112<<10|t>>>13&1023}var sf={calm:0,breeze:5,gale:17,storm:25,hurricane:35};function cf(e){let t=`calm`;for(let[n,r]of Object.entries(sf))e>=r-.5&&(t=n);return t}var lf=1.3620689655172413;function uf(e,t){let n=Math.cos(t),r=Math.sin(t),i=e=>new Float32Array(4).fill(e);return{nx:2,nz:2,cell:1e4,x0:-1e4,z0:-1e4,tick:0,speed:e,dirX:n,dirZ:r,gustiness:0,u:i(e*n),v:i(e*r),k:i(1),fu:i(e*n),fv:i(e*r)}}var df=class e{a=e.texture();b=e.texture();blend=0;grid=new B(0,0,1,1);usual=e.texture(O);snapA=null;snapB=null;mean=new Float32Array;meanTick=-1;meanGrid=``;meanSnap=null;meanSpan=0;static texture(e=A){let t=new Ai(new Uint16Array(e===1030?2:1),1,1,e,_);return t.magFilter=s,t.minFilter=s,t.wrapS=t.wrapT=n,t.needsUpdate=!0,t}set(t,n,r){if(this.grid.set(n.x0,n.z0,1/(n.nx*n.cell),1/(n.nz*n.cell)),n!==this.snapB||t!==this.snapA){if(t===this.snapB){let e=this.a;this.a=this.b,this.b=e}else e.upload(this.a,t);this.snapA=t,e.upload(this.b,n),this.snapB=n,this.updateUsual(n)}this.blend=t.tick===n.tick?1:r}static upload(e,t){let n=t.nx*t.nz,r=e.image.data;(e.image.width!==t.nx||e.image.height!==t.nz)&&(r=new Uint16Array(n*2),e.image={data:r,width:t.nx,height:t.nz},e.dispose());for(let e=0;e<n;e++)r[e*2]=of(t.u[e]),r[e*2+1]=of(t.v[e]);e.needsUpdate=!0}updateUsual(e){if(e===this.meanSnap)return;this.meanSnap=e;let t=e.nx*e.nz,n=this.usual,r=`${e.nx} ${e.nz} ${e.cell} ${e.x0} ${e.z0}`,i=this.mean;if(r!==this.meanGrid||e.tick<=this.meanTick||e.tick>this.meanTick+50){this.meanGrid=r,i=this.mean=new Float32Array(t);for(let n=0;n<t;n++)i[n]=Math.hypot(e.u[n],e.v[n]);this.meanSpan=.1}else{let n=(e.tick-this.meanTick)*.1;this.meanSpan=Math.min(ff,this.meanSpan+n);let r=Math.max(n/this.meanSpan,1-Math.exp(-n/ff));for(let n=0;n<t;n++){let t=e.u[n],a=e.v[n];i[n]+=(Math.sqrt(t*t+a*a)-i[n])*r}}this.meanTick=e.tick;let a=n.image.data;(n.image.width!==e.nx||n.image.height!==e.nz)&&(a=new Uint16Array(t),n.image={data:a,width:e.nx,height:e.nz},n.dispose());for(let e=0;e<t;e++)a[e]=of(i[e]);n.needsUpdate=!0}},ff=20,pf=Math.cos(25*Math.PI/180),mf=1.3,hf=6,gf=class e{speed=0;dirX=1;dirZ=0;gust=0;driftX=0;driftZ=0;flutter=0;haze={hx:1,hz:0,stretch:1,drift:0,streak:0};hazeNext=null;hazeFade=0;carried=0;time=null;set(e,t,n){let r=e.tick===t.tick?1:n,i=(e,t)=>e+(t-e)*r;this.speed=i(e.speed,t.speed),this.gust=i(e.gustiness,t.gustiness);let a=i(e.dirX,t.dirX),o=i(e.dirZ,t.dirZ),s=Math.hypot(a,o)||1;this.dirX=a/s,this.dirZ=o/s}static driftSpeed(e){return .8+.4*e}static hazeSpeed(e){return .12+.1*e}static dustSpeed(e){return .3+.3*e}static hazeStretch(e,t){return 1+e/10*(1+t)}hazeRate(){return yt.lerp(e.hazeSpeed(this.speed),e.dustSpeed(this.speed),this.carried)}streakRate(){return 2*e.dustSpeed(this.speed)}static flutterRate(e){return 2*Math.PI*(.7+2.3*e/(e+12))}hazeFrame(t=0,n=0){return{hx:this.dirX,hz:this.dirZ,stretch:e.hazeStretch(this.speed,this.carried),drift:t,streak:n}}restart(){this.time=null}update(t){let n=this.time===null?-1:t-this.time;if(this.time=t,n<0){let n=e.driftSpeed(this.speed)*t;this.driftX=this.dirX*n,this.driftZ=this.dirZ*n,this.haze=this.hazeFrame(),this.haze.drift=this.hazeRate()*t/this.haze.stretch,this.haze.streak=this.streakRate()*t/6,this.hazeNext=null,this.hazeFade=0,this.flutter=e.flutterRate(this.speed)*t;return}let r=Math.ceil(Math.min(n,30)/.1);for(let e=0;e<r;e++)this.step(n/r)}step(t){let n=e.driftSpeed(this.speed)*t;this.driftX+=this.dirX*n,this.driftZ+=this.dirZ*n,this.flutter+=e.flutterRate(this.speed)*t;for(let e of this.hazeNext?[this.haze,this.hazeNext]:[this.haze])e.drift+=this.hazeRate()*t/e.stretch,e.streak+=this.streakRate()*t/6;if(this.hazeNext)this.hazeFade=Math.min(1,this.hazeFade+t/hf),this.hazeFade>=1&&(this.haze=this.hazeNext,this.hazeNext=null,this.hazeFade=0);else{let t=this.haze,n=e.hazeStretch(this.speed,this.carried)/t.stretch;(this.dirX*t.hx+this.dirZ*t.hz<pf||n>mf||n<1/mf)&&(this.hazeNext=this.hazeFrame(t.drift+37.1,t.streak+53.3),this.hazeFade=0)}}},_f=`

uniform sampler2D tWindA;    // the game's wind map at its earlier tick and its later (see WindField)
uniform sampler2D tWindB;
uniform sampler2D tWindUsual; // how hard the ground air usually blows there (m/s, see WindField.usual)
uniform float uWindBlend;    // the frame's share of the way between them
uniform vec4 uWindGrid;      // the map's corner (x, z) and 1 over its size (x, z)
uniform float uWindOn;       // 1, or 0 to read a still wind (the shelter map's pass)

float windForce() { return clamp(uWindSpeed / 35.0, 0.0, 1.5); }
vec3 windDir3() { return vec3(uWindDir.x, 0.0, uWindDir.y); }
vec2 windGround(vec2 xz) {
  vec2 uv = (xz - uWindGrid.xy) * uWindGrid.zw;
  return mix(texture2D(tWindA, uv).xy, texture2D(tWindB, uv).xy, uWindBlend) * uWindOn;
}
// A wind's direction as a vector in the ground plane, or the wind's as a whole where it's still.
vec3 windDirOf(vec2 w) { float l = length(w); return l > 0.01 ? vec3(w.x, 0.0, w.y) / l : windDir3(); }
// How hard it blows at a point against how hard it usually blows there: 1 as usual, more in a gust.
float windGustHere(vec2 xz) {
  vec2 uv = (xz - uWindGrid.xy) * uWindGrid.zw;
  return length(windGround(xz)) / max(texture2D(tWindUsual, uv).x, 0.3);
}
float windGust(vec2 xz) { return clamp(0.5 * length(windGround(xz)) / max(uWindSpeed, 0.5), 0.0, 1.0); }
`;function vf(e=5e3){let t=2654435769,n=()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,t|1);return e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296},r=[5937722,8367678,11055178,13148224,11565626,9071162].map(e=>new H(e)),i=[],a=[],o=[],s=[],c=[],l=[],u=[];for(let t=0;t<e;t++){let e=[n(),n(),n()],d=n(),f=.06+n()*.06,p=r[Math.floor(n()*r.length)].clone().offsetHSL((n()-.5)*.03,0,(n()-.5)*.08);for(let[t,n]of[[-1,-1],[1,-1],[1,1],[-1,1]])i.push(...e),a.push(0,1,0),o.push(p.r,p.g,p.b),s.push(.3,.5,-1,.4),c.push(t,n,f,d),l.push(0,0);let m=t*4;u.push(m,m+1,m+2,m,m+2,m+3)}let d=new Mr;return d.setAttribute(`position`,new wr(i,3)),d.setAttribute(`normal`,new wr(a,3)),d.setAttribute(`color`,new wr(o,3)),d.setAttribute(`aPaint`,new wr(s,4)),d.setAttribute(`aCard`,new wr(c,4)),d.setAttribute(`uv`,new wr(l,2)),d.setIndex(new Cr(u,1)),d}function yf(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=e-i,s=t-a,c=(e,t,i,a)=>{let o=((t%n+n)%n*n+(e%n+n)%n)*2;return r[o]*i+r[o+1]*a},l=e=>e*e*e*(e*(e*6-15)+10),u=c(i,a,o,s),d=c(i+1,a,o-1,s),f=c(i,a+1,o,s-1),p=c(i+1,a+1,o-1,s-1),m=l(o),h=l(s);return(u+(d-u)*m+(f-u)*h+(u-d-f+p)*m*h)*1.4}function bf(){let e=12345,n=()=>(e=e*1664525+1013904223>>>0)/4294967296,r=new Float32Array(512);for(let e=0;e<256;e++){let t=n()*Math.PI*2;r[e*2]=Math.cos(t),r[e*2+1]=Math.sin(t)}let i=new Uint8Array(65536);for(let e=0;e<256;e++)for(let t=0;t<256;t++){let n=yf((t+.5)*16/256,(e+.5)*16/256,16,r);i[e*256+t]=Math.round(yt.clamp(n*.5+.5,0,1)*255)}let a=new Ai(i,256,256,O,u);return a.wrapS=a.wrapT=t,a.magFilter=a.minFilter=s,a.needsUpdate=!0,a}var xf=(e,t)=>e.clone().multiplyScalar(.5).add(t.clone().multiplyScalar(.5)),Sf=null;function Cf(e,t,n,r){if(!Sf){let e=yu(12);Sf=xf(e.sunColor,e.skyColor)}let i=xf(n,r);return e.setRGB(t.r*i.r/Sf.r,t.g*i.g/Sf.g,t.b*i.b/Sf.b)}var wf=.6,Tf=`
uniform highp sampler2D uShelterFull;
uniform highp sampler2D uShelterPartial;
uniform highp sampler2D uShelterLand;
uniform mat4 uShelterMatrix;
// The map's depth to height: height = x - depth * y.
uniform vec2 uShelterHeight;
uniform float uShelterTexels;
// Whether p is under what the map at its texel holds, by a margin, so a roof doesn't shelter itself. A texel left clear
// (1, the far plane) holds nothing, however low p is.
float shelterUnder(highp sampler2D map, ivec2 t, float depth) {
  t = clamp(t, ivec2(0), ivec2(int(uShelterTexels) - 1));
  float d = texelFetch(map, t, 0).r;
  return d < 1.0 ? step(d, depth) : 0.0;
}
// Bilinear: the four texels round p, each compared, then blended.
float shelterSoft(highp sampler2D map, vec2 uv, float depth) {
  vec2 st = uv * uShelterTexels - 0.5;
  vec2 f = fract(st);
  ivec2 t = ivec2(floor(st));
  float a = shelterUnder(map, t, depth), b = shelterUnder(map, t + ivec2(1, 0), depth);
  float c = shelterUnder(map, t + ivec2(0, 1), depth), d = shelterUnder(map, t + ivec2(1, 1), depth);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float shelter(vec3 p) {
  vec3 s = (uShelterMatrix * vec4(p, 1.0)).xyz;
  if (any(lessThan(s.xy, vec2(0.0))) || any(greaterThan(s.xy, vec2(1.0)))) return 0.0;
  // Ten centimetres: a texel of a roof's slope, and a little more.
  float depth = s.z - 0.1 / uShelterHeight.y;
  return max(shelterSoft(uShelterFull, s.xy, depth), ${wf.toFixed(2)} * shelterSoft(uShelterPartial, s.xy, depth));
}
// The height a map holds over a point (its nearest texel), or -1e4 where it holds nothing or off the map.
float shelterHeightIn(highp sampler2D map, vec3 p) {
  vec3 s = (uShelterMatrix * vec4(p, 1.0)).xyz;
  if (any(lessThan(s.xy, vec2(0.0))) || any(greaterThan(s.xy, vec2(1.0)))) return -1e4;
  ivec2 t = clamp(ivec2(s.xy * uShelterTexels), ivec2(0), ivec2(int(uShelterTexels) - 1));
  float d = texelFetch(map, t, 0).r;
  return d < 1.0 ? uShelterHeight.x - d * uShelterHeight.y : -1e4;
}
float shelterTop(vec3 p) { return shelterHeightIn(uShelterFull, p); }
// The highest crown over p (where a drop a crown catches stops), and the land's own height there (the ground).
float crownTop(vec3 p) { return shelterHeightIn(uShelterPartial, p); }
float landTop(vec3 p) { return shelterHeightIn(uShelterLand, p); }
`,Ef=new V().set(0,0,0,-2,0,0,0,-2,0,0,0,0,0,0,0,1),Df=class{size;uniforms={uShelterFull:{value:null},uShelterPartial:{value:null},uShelterLand:{value:null},uShelterMatrix:{value:new V().copy(Ef)},uShelterHeight:{value:new L(0,1)},uShelterTexels:{value:1}};dirty=!0;area=null;full;partial;land;camera=new So(-1,1,1,-1,0,1);overlay;overlayScene=new hi;box=new Yt;constructor(e=1024){this.size=e;let t=()=>{let t=new Gt(e,e,{depthBuffer:!0,format:O});return t.depthTexture=new va(e,e,h),t};this.full=t(),this.partial=t(),this.land=t(),this.uniforms.uShelterFull.value=this.full.depthTexture,this.uniforms.uShelterPartial.value=this.partial.depthTexture,this.uniforms.uShelterLand.value=this.land.depthTexture,this.uniforms.uShelterTexels.value=e,this.overlay=new ti({glslVersion:Ge,vertexShader:Of,fragmentShader:kf,uniforms:{...this.uniforms,tAux:{value:null},uCameraWorld:{value:new V},uHalf:{value:new L},uResolution:{value:new L}},transparent:!0,depthTest:!1,depthWrite:!1});let n=new Wr(new Da(2,2),this.overlay);n.frustumCulled=!1,this.overlayScene.add(n)}changed(){this.dirty=!0}setArea(e){this.area=e,this.dirty=!0}draw(e,t,n,r,i){if(!this.dirty)return!1;this.dirty=!1;let a=this.area??r;if(!a)return this.uniforms.uShelterMatrix.value.copy(Ef),!0;let o=this.box.makeEmpty(),s=-1/0;for(let e of t.children){let t=e;if(!t.isMesh||!t.visible)continue;t.geometry.boundingBox||t.geometry.computeBoundingBox();let r=t.geometry.boundingBox.clone().applyMatrix4(t.matrixWorld);o.union(r),n.some(e=>e.mesh===t&&e.cover!==`none`)&&(s=Math.max(s,r.max.y))}let c=(o.isEmpty()?0:o.min.y)-1;s=Math.max(s,c)+1;let l=this.camera,u=a.side/2;l.left=-u,l.right=u,l.top=u,l.bottom=-u,l.near=0,l.far=s-c,l.position.set(a.x,s,a.z),l.up.set(-Math.sin(a.turn),0,-Math.cos(a.turn)),l.lookAt(a.x,c,a.z),l.updateProjectionMatrix(),l.updateMatrixWorld();let d=new V().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);this.uniforms.uShelterMatrix.value.copy(d).multiply(l.projectionMatrix).multiply(l.matrixWorldInverse),this.uniforms.uShelterHeight.value.set(s,s-c);let f=[];for(let e of t.children)e.visible&&(e.visible=!1,f.push(e));let p=n.map(e=>[e,e.mesh.material,e.mesh.visible]),m=i();for(let r of[`full`,`partial`,`land`]){for(let e of n)e.mesh.visible=e.cover===r&&f.includes(e.mesh),e.mesh.material=e.depth;e.setRenderTarget(r===`full`?this.full:r===`partial`?this.partial:this.land),e.clear(!1,!0,!1),e.render(t,l)}m();for(let[e,t,n]of p)e.mesh.material=t,e.mesh.visible=n;for(let e of f)e.visible=!0;return!0}drawOverlay(e,t,n,r,i){let a=this.overlay.uniforms;a.tAux.value=t,a.uCameraWorld.value.copy(n.matrixWorld),a.uHalf.value.set(n.right,n.top),a.uResolution.value.set(r,i),e.render(this.overlayScene,this.camera)}dispose(){this.full.dispose(),this.partial.dispose(),this.land.dispose(),this.overlay.dispose()}},Of=`
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,kf=`
precision highp float;
${Tf}
uniform sampler2D tAux;
uniform mat4 uCameraWorld;
uniform vec2 uHalf;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 fragColor;
void main() {
  // The map itself, from above, in the bottom-left corner: roofs blue (lighter higher up), crowns teal.
  float inset = min(uResolution.x, uResolution.y) * 0.32;
  vec2 px = gl_FragCoord.xy - 12.0;
  if (px.x >= 0.0 && px.y >= 0.0 && px.x < inset && px.y < inset) {
    vec2 uv = px / inset;
    float full = texture(uShelterFull, uv).r, part = texture(uShelterPartial, uv).r;
    vec3 col = vec3(0.93, 0.9, 0.82);
    if (part < 1.0) col = mix(vec3(0.55, 0.85, 0.75), vec3(0.2, 0.55, 0.5), part);
    if (full < 1.0 && full <= part) col = mix(vec3(0.75, 0.85, 1.0), vec3(0.1, 0.25, 0.75), smoothstep(0.0, 1.0, full));
    fragColor = vec4(col, 0.92);
    return;
  }
  vec4 aux = texture(tAux, vUv);
  if (aux.z <= 0.0) discard;
  // Where this pixel is: the view's orthographic camera, back along its view by the depth.
  vec3 p = (uCameraWorld * vec4((vUv * 2.0 - 1.0) * uHalf, -aux.z, 1.0)).xyz;
  float under = shelter(p);
  vec3 s = (uShelterMatrix * vec4(p, 1.0)).xyz;
  bool onMap = all(greaterThanEqual(s.xy, vec2(0.0))) && all(lessThanEqual(s.xy, vec2(1.0)));
  // A roof's own top: at the full map's height there.
  float top = onMap ? 1.0 - smoothstep(0.08, 0.2, abs(shelterTop(p) - p.y)) : 0.0;
  float hatch = step(0.5, fract((gl_FragCoord.x + gl_FragCoord.y) / 10.0));
  float full = clamp((under - ${wf.toFixed(2)}) / ${.4.toFixed(2)}, 0.0, 1.0);
  float part = min(under, ${wf.toFixed(2)}) / ${wf.toFixed(2)} - full;
  vec4 col = vec4(0.0);
  col = mix(col, vec4(0.45, 0.95, 0.85, 0.4), part);
  col = mix(col, vec4(0.15, 0.35, 1.0, 0.45 + 0.25 * hatch), full);
  col = mix(col, vec4(1.0, 0.85, 0.2, 0.55), top * (1.0 - full));
  if (col.a <= 0.0) discard;
  fragColor = col;
}
`,Af={a:{density:.12,stroke:[3,6,1,.34],taper:.7,speed:[6,9],slant:.6,splash:[0,.4,.28],veil:[.32,1,10,.15,22],rings:[.5,.06,.4,0]},b:{density:.18,stroke:[2,1.4,.3,.42],taper:.5,speed:[7,10],slant:.7,splash:[1,.28,.2],veil:[.26,.3,6,.6,12],rings:[.32,.022,.5,0]},c:{density:.16,stroke:[1.1,3.2,.5,.55],taper:.9,speed:[6,9],slant:.6,splash:[2,.32,.3],veil:[.3,.6,2.8,.45,14],rings:[.36,.04,.45,1]}},jf=65536,Mf=8,Nf=16,Pf=Nf*1.15,Ff=.3,If=1.2,Lf=8,Rf=8,zf=`
${Bd}
${Rd}
${zd}
${Vd}
${Wd}
${_f}
${Tf}
attribute vec3 aCorner;  // x across (-1, 1); y along the stroke (0 its tail, 1 its head) or up the splash (-1, 1); z 0 the stroke, 1 the splash
uniform vec2 uScreen;
uniform vec3 uViewTarget;
uniform vec4 uRainCells;   // the cells drawn: x, y the first (world cell), z how many across, w how many in all
uniform vec4 uRain;        // x the drops a cell shown (by rank), y how far the rain has fallen (m), z a drop's cycle (m), w how fast it falls (m/s)
uniform vec4 uRainStroke;  // its length (m), width (px), softness, opacity
uniform vec4 uRainShape;   // its taper, how far the wind slants it, the splash's shape, the splash's size (m)
uniform float uRainSplash; // how far a drop would fall while it splashes (m)
varying vec4 vShape;       // the stroke: px across, px along from the tail, its length and half its width in px. The splash: its corner, its shape, its age (0..1)
varying vec4 vColor;       // its colour, and how opaque
varying float vPart;       // 0 the stroke, 1 the splash
const float CELL = ${Mf.toFixed(1)};
const float COLUMN = ${Nf.toFixed(1)};
const float RANK_FADE = ${Ff};
// Starting high over the land, a drop fades in over its first few metres, so none appears out of nothing.
const float FADE_IN = 3.0;

vec2 screenOf(vec3 p, out float z) {
  vec4 c = projectionMatrix * viewMatrix * vec4(p, 1.0);
  z = c.z / c.w;
  return c.xy / c.w;
}
// Where a drop falling down its slanted path (at height y it is over g - slant (y - base)) from \`top\` first meets the
// cover a map holds: stepping down the path to the first point under the cover, then halving the step between it and
// the last point over it. The steps are about a metre apart across the land (so a panel's edge isn't stepped over) and
// two up and down; straight down, one look. Far below the land if it meets none. A path that grazes the downwind edge of
// cover between two steps (a strip under a metre, in a wind) gets by, as rain blows in under an eave.
float coverAlong(highp sampler2D map, vec2 g, vec2 slant, float base, float top) {
  if (dot(slant, slant) < 1e-4) return shelterHeightIn(map, vec3(g.x, 0.0, g.y));
  float over = top;
  int steps = int(clamp(ceil((top - base) * max(length(slant), 0.5)), 8.0, 24.0));
  for (int i = 0; i <= steps; i++) {
    float y = mix(top, base, float(i) / float(steps));
    vec2 at = g - slant * (y - base);
    if (shelterHeightIn(map, vec3(at.x, 0.0, at.y)) < y) { over = y; continue; }
    if (i == 0) return top;
    float under = y;
    for (int j = 0; j < 3; j++) {
      float m = 0.5 * (over + under);
      vec2 am = g - slant * (m - base);
      if (shelterHeightIn(map, vec3(am.x, 0.0, am.y)) < m) over = m; else under = m;
    }
    return under;
  }
  return -1e9;
}

void main() {
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  vShape = vec4(0.0); vColor = vec4(0.0); vPart = aCorner.z;
  // Which drop: its cell of the world and its place among the cell's (its rank: the first ones show in the lightest
  // rain), and its own four random numbers, all from those, so a drop is the same whichever cells are drawn.
  int cells = int(uRainCells.w), across_ = int(uRainCells.z);
  int index = gl_InstanceID % cells, slot = gl_InstanceID / cells;
  vec2 cell = uRainCells.xy + vec2(float(index % across_), float(index / across_));
  vec2 seed = cell + float(slot) * vec2(61.7, -37.3);
  vec4 rnd = vec4(hash12(seed), hash12(seed + 19.19), hash12(seed + 47.7), hash12(seed + 83.3));
  float show = clamp((uRain.x - float(slot) - rnd.x * (1.0 - RANK_FADE)) / RANK_FADE, 0.0, 1.0);
  if (show <= 0.0) return;
  // Where it is in its fall, and where it lands this time round: somewhere new in its cell each fall.
  float u = uRain.y / uRain.z + rnd.y * 37.0;
  float round_ = mod(floor(u), 4096.0), fallen = fract(u) * uRain.z;
  vec2 g = (cell + hash22(vec2(rnd.z * 4093.0 + round_ * 1.618, rnd.w * 3967.0 + round_ * 0.7071))) * CELL;
  // Slanted by the wind where it lands: blown along at the wind's speed as it falls.
  vec2 slant = windGround(g) / max(uRain.w, 1.0) * uRainShape.y;
  slant *= min(1.0, ${If.toFixed(2)} / max(length(slant), 1e-4));
  // Where it would stop in the open: the land, or the water over it.
  float land = landTop(vec3(g.x, 0.0, g.y));
  if (land < -1e3) return;
  vec3 sheet = waterSheet(g);
  bool wet = sheet.z > -${(Ad*.5).toFixed(3)} && sheet.x > land;
  float base = wet ? sheet.x : land;
  float top = base + COLUMN * (0.85 + 0.3 * fract(rnd.y * 5.13));
  // Off the screen, its whole path (a straight line, so between its ends): nothing more to do.
  float z0, z1;
  vec2 s0 = screenOf(vec3(g.x, base, g.y), z0);
  vec2 top0 = g - slant * (top - base);
  vec2 s1 = screenOf(vec3(top0.x, top, top0.y), z1);
  // Its widest stroke or its splash may reach past the path's ends by up to this much (px).
  float pxPerMetre = projectionMatrix[0][0] * uScreen.x * 0.5;
  vec2 reach = 1.0 + 2.0 * max(0.65 * uRainStroke.y + 1.0, max(uRainShape.w * pxPerMetre, 3.0)) / uScreen;
  if (any(greaterThan(min(s0, s1), reach)) || any(lessThan(max(s0, s1), -reach))) return;

  // Where it stops: there, or a roof, or (some of the time) a crown, along the way.
  float stop = base;
  float roof = coverAlong(uShelterFull, g, slant, base, top);
  if (roof > stop) { stop = roof; wet = false; }
  bool caught = false;
  if (rnd.w < ${wf.toFixed(2)}) {
    float crown = coverAlong(uShelterPartial, g, slant, base, top);
    // Lost among the leaves somewhere under the crown's top.
    if (crown > stop) { stop = max(crown - fract(rnd.z * 7.31) * 2.0, stop); caught = true; }
  }
  float drop = top - stop;
  float length_ = uRainStroke.x * (0.8 + 0.4 * fract(rnd.z * 3.7));
  vec2 half_ = uScreen * 0.5;

  // Lit as rain is where it is: by the sky, a little by the sun, as bright as the light there.
  vec3 mid = vec3(g.x, stop + 1.0, g.y);
  cloudAt(mid);
  vec3 col = exposeHere(vec3(0.78, 0.82, 0.86) * mix(skyTint(), sunTint(), 0.3));
  float alpha = show;

  if (aCorner.z < 0.5) {
    // The stroke: its head falling from the top to where it stops, its tail a stroke's length behind, both stopping there.
    float head = max(top - fallen, stop), tail = max(min(top - fallen + length_, top), stop);
    if (tail - head < 1e-3) return;
    vec2 ha = g - slant * (head - base), ta = g - slant * (tail - base);
    float za, zb;
    vec2 sa = screenOf(vec3(ta.x, tail, ta.y), za) * half_, sb = screenOf(vec3(ha.x, head, ha.y), zb) * half_;
    vec2 d = sb - sa;
    float len = length(d);
    vec2 dir = len > 1e-3 ? d / len : vec2(0.0, -1.0), across = vec2(-dir.y, dir.x);
    // Each a little wider or narrower, fainter or stronger than the next, as a brush lays them.
    float hw = 0.5 * uRainStroke.y * (0.7 + 0.6 * fract(rnd.w * 11.3)), pad = hw + 1.0;
    float t = aCorner.y;
    vec2 sp = mix(sa, sb, t) + dir * (t * 2.0 - 1.0) * pad + across * aCorner.x * pad;
    gl_Position = vec4(sp / half_, mix(za, zb, t), 1.0);
    vShape = vec4(aCorner.x * pad, t * len + (t * 2.0 - 1.0) * pad, len, hw);
    // Fading as it shortens into what it hit, so its round end doesn't linger and blink out.
    float left = smoothstep(0.0, 0.4 * length_, tail - head);
    vColor = vec4(col, alpha * uRainStroke.w * (0.65 + 0.35 * fract(rnd.z * 17.9)) * smoothstep(0.0, FADE_IN, fallen) * left);
  } else {
    // The splash, where it landed, for a moment after: not on the water (the water's rings are its splash) nor in a crown.
    float age = (fallen - drop) / uRainSplash;
    if (wet || caught || age < 0.0 || age > 1.0) return;
    vec2 at = g - slant * (stop - base);
    // Brought a little towards the camera, so the land it lies on doesn't hide it.
    vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
    float z;
    vec2 sc = screenOf(vec3(at.x, stop + 0.05, at.y) + toCam * 0.3, z) * half_;
    float size = max(uRainShape.w * pxPerMetre, 3.0);
    gl_Position = vec4((sc + aCorner.xy * size) / half_, z, 1.0);
    vShape = vec4(aCorner.xy, uRainShape.z, age);
    vColor = vec4(col, alpha * min(1.0, uRainStroke.w * 1.6));
  }
}
`,Bf=`
precision highp float;
uniform vec4 uRainStroke;
uniform vec4 uRainShape;
varying vec4 vShape;
varying vec4 vColor;
varying float vPart;
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gAux;
// A soft line's cover at d px from its middle, half w px wide: from a crisp edge (a pixel's blur) to a soft fall-off.
float lineCover(float d, float w, float soft) {
  float crisp = clamp(w + 0.5 - d, 0.0, 1.0);
  float x = d / max(w + 0.5, 0.75);
  return mix(crisp, exp(-x * x * 2.5), soft);
}
void main() {
  float a;
  if (vPart < 0.5) {
    float len = vShape.z, along = clamp(vShape.y, 0.0, len), t = len > 0.0 ? along / len : 1.0;
    // Thinner and fainter towards the tail.
    float taper = mix(1.0 - uRainShape.x, 1.0, t);
    float w = vShape.w * taper;
    // Thinner than a pixel: as wide as a pixel, fainter.
    float thin = min(1.0, w / 0.6);
    a = lineCover(length(vec2(vShape.x, vShape.y - along)), max(w, 0.6), uRainStroke.z) * thin * taper;
  } else {
    vec2 q = vShape.xy;
    float age = vShape.w, shape = vShape.z;
    float grow = smoothstep(0.0, 0.25, age), fade = (1.0 - age) * (1.0 - age);
    if (shape < 0.5) {
      // A soft dab, flat on the ground, widening.
      float r = length(q * vec2(1.0, 2.2)) / mix(0.45, 1.0, grow);
      a = (1.0 - smoothstep(0.4, 1.0, r)) * 0.7;
    } else if (shape < 1.5) {
      // A crown: a few short ticks thrown up and out from where it landed.
      vec2 o = q - vec2(0.0, -0.55);
      float r = length(o), ang = atan(o.x, o.y);
      float k = clamp(floor(ang / 0.5 + 0.5), -2.0, 2.0);
      float off = abs(ang - k * 0.5) * r;
      float reach = mix(0.35, 1.05, grow);
      a = (1.0 - smoothstep(0.05, 0.12, off)) * smoothstep(reach - 0.5, reach - 0.3, r) * (1.0 - smoothstep(reach - 0.1, reach, r));
      a *= step(abs(ang), 1.3);
    } else {
      // Beads: a few drops thrown up, rising and falling.
      a = 0.0;
      for (int i = 0; i < 3; i++) {
        float fi = float(i) - 1.0;
        vec2 c = vec2(fi * 0.55 * grow, -0.5 + (0.8 - abs(fi) * 0.3) * sin(age * 3.1416));
        a = max(a, 1.0 - smoothstep(0.12, 0.24, length((q - c) * vec2(1.0, 1.3))));
      }
    }
    a *= fade * smoothstep(0.0, 0.2, age);
  }
  a *= vColor.a;
  if (a < 0.004) discard;
  gColor = vec4(vColor.rgb * a, a);
  // The aux as it was: no lines on the rain, and the fog and haze by what's behind it.
  gAux = vec4(0.0);
}
`,Vf=`
uniform vec4 uRings;     // x the share of cells with a ring each time, y the widest ring (m), z the line's width (m), w how strong
uniform float uRingsDot; // the drop's dot at the centre, 0..1
float rainRings(vec2 xz) {
  float cell = uRings.y * 2.0;
  vec2 q = xz / cell, i = floor(q);
  // At least about a pixel wide, so the rings don't shimmer as the camera draws back; fainter as they shrink to nothing.
  float px = max(length(fwidth(xz)), 1e-4);
  float w = max(uRings.z, px * 0.8);
  float far = smoothstep(px * 4.0, px * 10.0, uRings.y);
  float sum = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 c = i + vec2(x, y);
    float h = hash12(c * 1.37 + 0.5);
    float beat = uTime * (0.9 + 0.5 * h) + h * 9.0;
    float k = floor(beat), life = fract(beat);
    // Whether this cell rings this time, faded over a band of the share rather than switched, so a ring already spreading
    // as the rain eases off or sets in fades rather than blinks.
    float on = clamp((uRings.x - hash12(c * 3.1 + mod(k, 512.0) * 0.731) * 0.85) / 0.15, 0.0, 1.0);
    if (on <= 0.0) continue;
    vec2 r = hash22(c + mod(k, 512.0) * vec2(7.13, 3.71));
    vec2 centre = (c + 0.2 + 0.6 * r) * cell;
    float d = length(xz - centre), rad = life * uRings.y * (0.6 + 0.4 * r.x);
    float fade = (1.0 - life) * (1.0 - life) * smoothstep(0.0, 0.06, life);
    float ring = exp(-pow((d - rad) / w, 2.0)) * fade;
    float dot_ = exp(-pow(d / (w * 1.6), 2.0)) * (1.0 - smoothstep(0.0, 0.3, life));
    sum += (ring + dot_ * uRingsDot) * on;
  }
  return min(sum, 1.0) * uRings.w * far;
}
`,Hf=`
uniform vec4 uRainVeil;       // x how thick, y how far its streaks have fallen (in their noise's cells), z its slant across the screen, w how crisp
uniform vec4 uRainVeilShape;  // x its streaks' width (m), y their length (m), z its sheets' size (m), w how far its sheets have fallen (cells)
uniform vec3 uRainVeilColor;
// How far past the camera's target it's at its thickest (m).
const float VEIL_FAR = 30.0;
float rainVeil(vec2 ndc, float depth) {
  if (uRainVeil.x <= 0.0) return 0.0;
  float far = smoothstep(0.0, VEIL_FAR, depth - uTargetDepth);
  // Where the pixel is in the view's plane (m), moving with the land as the camera pans.
  vec3 r = normalize(uCamRight), u = normalize(uCamUp);
  vec2 s = vec2(dot(uCamPos, r) + ndc.x * length(uCamRight), dot(uCamPos, u) + ndc.y * length(uCamUp));
  s.x += s.y * uRainVeil.z;
  float n = fogNoise(vec2(s.x / uRainVeilShape.x, s.y / uRainVeilShape.y + uRainVeil.y));
  float streak = smoothstep(mix(-0.2, 0.25, uRainVeil.w), mix(0.9, 0.45, uRainVeil.w), n);
  float sheets = fogNoise(s / uRainVeilShape.z + vec2(31.0, uRainVeilShape.w)) * 0.5 + 0.5;
  return uRainVeil.x * far * mix(0.3, 1.0, streak) * mix(0.45, 1.0, sheets);
}
`;function Uf(){let e=new Eo,t=new Float32Array([-1,0,0,1,0,0,-1,1,0,1,1,0,-1,-1,1,1,-1,1,-1,1,1,1,1,1]);return e.setAttribute(`aCorner`,new xr(t,3)),e.setAttribute(`position`,new xr(new Float32Array(24),3)),e.setIndex([0,1,2,2,1,3,4,5,6,6,5,7]),e.instanceCount=0,e.boundingBox=new Yt,e.boundingSphere=new mn(new R,1/0),e}var Wf=class{uniforms={uRainCells:{value:new B(0,0,1,1)},uRain:{value:new B(0,0,1,8)},uRainStroke:{value:new B},uRainShape:{value:new B},uRainSplash:{value:1},uRings:{value:new B(0,.4,.04,0)},uRingsDot:{value:0}};veil={uRainVeil:{value:new B},uRainVeilShape:{value:new B(1,1,1,1)},uRainVeilColor:{value:new H}};mesh;look=Af.a;fallen=0;last=NaN;box=new Yt;corner=new R;forward=new R;constructor(e,t){let n=Uf(),r=new ti({glslVersion:Ge,uniforms:{...e,...t,...this.uniforms},vertexShader:zf,fragmentShader:Bf,transparent:!0,depthWrite:!1,side:2,blending:5,blendSrc:201,blendDst:205,blendSrcAlpha:201,blendDstAlpha:205});this.mesh=new Wr(n,r),this.mesh.frustumCulled=!1,this.mesh.userData.kind=`rain`,this.mesh.userData.reflect=!1,this.mesh.userData.under=!1}update(e,t,n,r,i,a,o,s,c){let l=this.look,u=a?yt.clamp(t,0,1):0,d=yt.lerp(l.speed[0],l.speed[1],u),f=e-this.last;f>=0?this.fallen+=d*(f<=1?f:.1):this.fallen=d*e,this.last=e;let p=l.splash[2]*(l.speed[0]+l.speed[1])*.5,m=Nf*1.15+Math.max(l.stroke[0]*1.2,p)+1,h=l.density*u**.6*Math.min((n/44)**2,4)*i*Mf*Mf,g=this.uniforms,_=Math.min(If,o.length()/Math.max(d,1)*l.slant*1.5+.1),v=this.box.makeEmpty(),y=this.forward.set(0,0,-1).transformDirection(s.matrixWorld);for(let e of[c-Lf,c+Rf+Pf])for(let[t,n]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let r=this.corner.set(t,n,0).unproject(s);r.addScaledVector(y,(e-r.y)/y.y),v.expandByPoint(r)}let b=_*26.4+2,x=Math.floor((v.min.x-b)/Mf),S=Math.floor((v.min.z-b)/Mf),C=Math.floor((v.max.x+b)/Mf)-x+1,w=C*(Math.floor((v.max.z+b)/Mf)-S+1),T=Math.min(Math.ceil(h),Math.floor(jf/w));g.uRainCells.value.set(x,S,C,w),g.uRain.value.set(h,this.fallen%(m*4096),m,d),g.uRainStroke.value.set(l.stroke[0],l.stroke[1]*Math.sqrt(n/44)*r,l.stroke[2],l.stroke[3]),g.uRainShape.value.set(l.taper,l.slant,l.splash[0],l.splash[1]),g.uRainSplash.value=p;let E=this.mesh.geometry;E.instanceCount=w*T,this.mesh.visible=T>0,g.uRings.value.set(Math.min(1,u*1.1),l.rings[0],l.rings[1],l.rings[2]*Math.min(1,.4+u)),g.uRingsDot.value=l.rings[3];let D=this.veil,O=this.corner.setFromMatrixColumn(s.matrixWorld,0).normalize(),k=o.x*O.x+o.y*O.z,A=this.fallen*Math.cos(Math.PI/6);D.uRainVeil.value.set(l.veil[0]*u,A/l.veil[2]%16,k*l.slant/(d*Math.cos(Math.PI/6)),l.veil[3]),D.uRainVeilShape.value.set(l.veil[1],l.veil[2],l.veil[4],A*.25/l.veil[4]%16)}setVeilColor(e){e(this.veil.uRainVeilColor.value,Gf)}},Gf=new H().setRGB(.74,.78,.82);function Kf(){return{uSunDir:{value:new R(.3,.8,.5).normalize()},uSunColor:{value:new H(1,1,1)},uSkyColor:{value:new H(1,1,1)},uRimColor:{value:new H(1,.8,.4)},uShadeHue:{value:-1.6},uShadeLean:{value:.3},uShadeDepth:{value:.3},uLitHue:{value:1.3},uLitLean:{value:.1},uOvercast:{value:new R},uTime:{value:0},uWindDir:{value:new L(1,0)},uWindSpeed:{value:0},uWindDrift:{value:new L},uWindFlutter:{value:0},tWindA:{value:null},tWindB:{value:null},tWindUsual:{value:null},uWindBlend:{value:0},uWindGrid:{value:new B(0,0,1,1)},uWindOn:{value:1},tTreePose:{value:null},uViewBack:{value:new R(0,0,1)},uViewTarget:{value:new R},uShadowMap:{value:null},uShadowMatrix:{value:new V},uShadowTexel:{value:new L(1/2048,1/2048)},uMirror:{value:0},uMirrorY:{value:0},tWaterA:{value:null},tWaterB:{value:null},uWaterBlend:{value:1},uWaterGrid:{value:new B(0,0,1,0)},uWaterHigh:{value:-1e6},uLandSquare:{value:new B(0,0,0,0)},uUnder:{value:null},uUnderAux:{value:null},uReflect:{value:null},uScreen:{value:new L(1,1)},uSkyTop:{value:new H},uSkyBottom:{value:new H},uCloudMap:{value:null},uCloudRect:{value:new B(-64,-64,1/128,1/128)},uCloudStrength:{value:0},uCloudOvercast:{value:new R},uCloudSunColor:{value:new H(1,1,1)},uCloudRimColor:{value:new H(1,.8,.4)},uCloudBands:{value:new B(0,.3,.1,1)},uLightExposure:{value:1},uSkyMap:{value:null},uSkyRect:{value:new B(-128,-128,1/256,1/256)},uGapSkyTop:{value:new H},uGapSkyBottom:{value:new H},uCloudLit:{value:new H},uCloudBelly:{value:new H},uSkyClosed:{value:0}}}var qf=`
// The silhouettes drawn first (see prepassMaterial) must land at exactly the depth the painting does, on every GPU.
invariant gl_Position;
${Bd}
${Rd}
${_f}
attribute vec4 aPaint;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
// Where the point is with no wind: the brush is keyed to it, so the paint moves with what moves, not through it.
varying vec3 vRestPos;
// Puts a world position on screen, mirrored in the water when drawing its reflection. The surface is still lit where it
// really is (vWorldPos and the normal stay unmirrored), so a tree in the water shows its shaded underside.
// A movement with its part along the main camera's view taken out: on screen it looks the same, but nothing comes nearer or
// goes farther, so things that overlap never swap which is in front. (Wind moving leaves to and fro in depth would swap
// overlapping dabs of different colours, and the swatches would pop.) Mirrored in the reflection. The sun's shadow pass uses
// the main camera's direction too, so the shadows move with what casts them.
vec3 acrossView(vec3 d) {
  vec3 b = uMirror > 0.5 ? uViewBack * vec3(1.0, -1.0, 1.0) : uViewBack;
  return d - b * dot(d, b);
}
// How a point of a tree moves in the wind (tree: its foot's x and z, its height, and how much of its top's movement this
// point takes; a height of 0 is no tree; id: the tree's texel in tTreePose). The top is where the tree's spring has it
// (TreeSprings); the rest bends with it from the foot, by the share built into each point (growTree). The movement is drawn
// across the view only (drawnShift), so a bending crown's strokes never swap which is in front.
uniform sampler2D tTreePose;
vec3 treeWind(vec4 tree, float id) {
  if (tree.z <= 0.0) return vec3(0.0);
  int i = int(id + 0.5);
  vec2 top = texelFetch(tTreePose, ivec2(i % 256, i / 256), 0).xy * uWindOn;
  vec3 d = vec3(top.x, 0.0, top.y);
  // The top dips a little as the tree leans over.
  d.y -= dot(d, d) / (1.4 * tree.z);
  return d * tree.w;
}
// A tree's movement as drawn. It's real 3D where it's lit (vWorldPos) and in the sun's shadow pass, so it shades and casts
// its shadow where it really is; for the eye only its part across the view is drawn (see acrossView), which puts it on the
// same pixels without changing its depth, so neighbouring trees rocking out of step never swap their overlapping edges.
vec3 drawnShift(vec3 d) {
#ifdef SHADOW_PASS
  return d;
#else
  return acrossView(d);
#endif
}
void place(vec3 world) {
  if (uMirror > 0.5) world.y = 2.0 * uMirrorY - world.y;
  vec4 vp = viewMatrix * vec4(world, 1.0);
  vViewDepth = -vp.z;
  gl_Position = projectionMatrix * vp;
}
`,Jf=`
${qf}
varying vec2 vUv;
#ifdef TREES
attribute vec4 aTree;
attribute float aTreeId;
#endif
#ifdef CROP
varying float vGust;
#endif
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vRestPos = wp.xyz;
#ifdef CROP
  // The field gives a little under each gust: its top sinks and drifts downwind.
  vGust = windGust(wp.xz);
  float give = vGust * windForce();
  wp.xyz += (windDir3() * 0.1 - vec3(0.0, 0.14, 0.0)) * give;
#endif
  vWorldPos = wp.xyz;
#ifdef TREES
  vec3 tree = treeWind(aTree, aTreeId);
  vWorldPos += tree;
  wp.xyz += drawnShift(tree);
#endif
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vUv = uv;
  place(wp.xyz);
}
`,Yf=`
${qf}
varying vec2 vFlow;
varying float vMud;
varying vec2 vMirrorShift;
void main() {
  vec4 w = waterCell(ivec2(uv + 0.5));
  vec4 wp = modelMatrix * vec4(position.x, w.x, position.z, 1.0);
  vRestPos = wp.xyz;
  vWorldPos = wp.xyz;
  vNormal = vec3(0.0, 1.0, 0.0);
  vColor = WATER_COLOR;
  vPaint = vec4(0.0);
  vFlow = w.yz;
  vMud = w.w;
  vMirrorShift = (projectionMatrix * viewMatrix * vec4(0.0, 2.0 * (w.x - uMirrorY), 0.0, 0.0)).xy * 0.5;
  place(wp.xyz);
}
`,Xf=`
${qf}
attribute vec4 aCard;
attribute vec4 aTree;
attribute float aTreeId;
uniform vec2 uScreen;
varying vec4 vCard;
varying vec3 vDabNormal;
varying float vCardPx;
varying float vFlash;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  float a = aPaint.z >= 0.0 ? aPaint.z + (aCard.w - 0.5) * 0.7 : aCard.w * 6.2831853;
  vec2 c = mat2(cos(a), sin(a), -sin(a), cos(a)) * aCard.xy;
  vec4 wc = modelMatrix * vec4(position, 1.0);
  vec3 rest = wc.xyz + (right * c.x + up * c.y) * aCard.z;
  // Wind: the crown moves with its tree (see treeWind and drawnShift); each dab flutters on its own, faster and wider as the
  // wind rises (though leaves turn edge-on and stop flapping, so not much), never more than a little of its size, and only
  // across the view (see acrossView).
  float s = uWindSpeed, seed = aCard.w;
  float g = windGust(aTree.z > 0.0 ? aTree.xy : wc.xz);
  float amp = min(0.004 + 0.045 * s / (s + 12.0), 0.15 * aCard.z) * (0.7 + 0.6 * g);
  float ph = uWindFlutter * (0.8 + 0.4 * fract(seed * 7.13)) + seed * 40.0;
  vec3 flutter = (windDir3() * sin(ph) + vec3(-uWindDir.y, 0.0, uWindDir.x) * 0.5 * sin(ph * 1.31 + seed * 9.0)
    + vec3(0.0, 0.5 * cos(ph * 0.87 + seed * 21.0), 0.0)) * amp;
  vec3 tree = treeWind(aTree, aTreeId);
  wc.xyz += acrossView(flutter);
  // In a gale and up, leaves on the windward side turn over in the gusts and show their pale undersides. Slowly, a few at a
  // time, in waves that travel with the gusts, so no dab blinks.
  float windward = smoothstep(-0.3, 0.6, -dot(normalize(mat3(modelMatrix) * normal), windDir3()));
  float turn = g + 0.35 * sin(uWindFlutter * 0.13 * (0.8 + 0.4 * fract(seed * 3.7)) + seed * 51.0);
  vFlash = smoothstep(0.35, 0.8, windForce()) * smoothstep(0.55, 0.95, turn) * (0.35 + 0.65 * windward);
  vec3 world = wc.xyz + (right * c.x + up * c.y) * aCard.z;
  vWorldPos = world + tree;
  vRestPos = rest;
  vNormal = normalize(mat3(modelMatrix) * normal);
  // Each dab bulges towards the viewer a little; kept faint, so turning the camera doesn't relight the crown.
  vDabNormal = normalize(right * c.x * 0.55 + up * c.y * 0.55 + toCam * 0.45);
  vColor = color;
  vPaint = aPaint;
  vCard = aCard;
  // Screen pixels per unit of the card, for its edge's antialiasing (orthographic: the same everywhere on screen).
  vCardPx = aCard.z * projectionMatrix[0][0] * uScreen.x * 0.5;
  place(world + drawnShift(tree));
}
`,Zf=`
${qf}
attribute vec4 aBlade;
uniform vec2 uScreen;
varying vec2 vBlade;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  // Blades are flat, and a flat blade seen edge-on is a sliver under a pixel wide that crawls as the camera moves. Turn each
  // most of the way to face the camera, and keep it at least a pixel and a bit across. The turn works on the blade's axis as
  // an unoriented line (angles doubled), so it never jumps as the camera turns past a blade edge-on. Every vertex of a blade
  // carries the same angle, so all of them turn the axis identically, then take their own signed distance along it: rows
  // stay in step and mirrored vertices stay on opposite sides. Not in the sun's shadow pass: no camera there.
#ifndef SHADOW_PASS
  vec3 across = mat3(modelMatrix) * vec3(cos(aBlade.w), 0.0, sin(aBlade.w));
  float stretch = length(across.xz);
  if (aBlade.z != 0.0 && stretch > 1e-6) {
    vec2 dir = across.xz / stretch;
    float a = atan(dir.y, dir.x), b = atan(viewMatrix[2][0], viewMatrix[0][0]);
    vec2 m = mix(vec2(cos(2.0 * a), sin(2.0 * a)), vec2(cos(2.0 * b), sin(2.0 * b)), 0.75);
    float c = 0.5 * atan(m.y, m.x);
    vec2 axis = vec2(cos(c), sin(c));
    axis *= dot(axis, dir) < 0.0 ? -1.0 : 1.0;
    float halfWidth = abs(aBlade.z) * stretch;
    float pxPerMetre = projectionMatrix[0][0] * uScreen.x * 0.5;
    wp.xz += axis * sign(aBlade.z) * max(halfWidth, 0.6 / pxPerMetre) - dir * aBlade.z * stretch;
  }
#endif
  // Wind: each blade bends with the wind where it stands (the game's map: further in a gust, less in a hedge's lee), more
  // towards the tip and with the square of the speed, and rocks about that; the tip dips as it bends. Across the view only,
  // so blades never swap which is in front.
  vRestPos = wp.xyz;
  vec2 here = windGround(wp.xz);
  float h = aBlade.x * aBlade.x, s = length(here);
  vec3 dir = windDirOf(here);
  float bend = 0.02 + 0.0035 * s + 2.4e-4 * s * s;
  float rock = sin(uWindFlutter * 0.8 * (0.85 + 0.3 * aBlade.y) + aBlade.y * 6.283 + wp.x * 0.7) * (0.012 + 0.0025 * s);
  float d = min(bend + rock, 0.6) * h;
  wp.xyz += acrossView(dir * d - vec3(0.0, d * d * 1.2, 0.0));
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vBlade = aBlade.xy;
  place(wp.xyz);
}
`,Qf=`
${qf}
attribute vec4 aCard;
uniform vec2 uScreen;
uniform vec3 uViewTarget;
varying vec4 vCard;
varying vec3 vDabNormal;
varying float vCardPx;
varying float vFlash;
const float BOX = 128.0;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  float seed = aCard.w, k = fract(seed * 13.71);
  float share = smoothstep(14.0, 40.0, uWindSpeed);
  float show = smoothstep(k, k + 0.08, share * 1.08);
  // Carried by the gusts, some leaves faster than others, wandering a little across the wind.
  vec2 side = vec2(-uWindDir.y, uWindDir.x);
  float ph = uWindFlutter * (0.2 + 0.15 * fract(seed * 5.3)) + seed * 30.0;
  vec2 xz = position.xy * BOX + uWindDrift * (1.0 + 0.6 * fract(seed * 3.1)) + side * sin(ph * 0.7) * 1.5;
  vec2 rel = mod(xz - uViewTarget.xz + BOX * 0.5, BOX) - BOX * 0.5;
  float fade = 1.0 - smoothstep(0.4 * BOX, 0.48 * BOX, max(abs(rel.x), abs(rel.y)));
  float size = aCard.z * show * fade;
  vec3 c0 = vec3(uViewTarget.x + rel.x, uViewTarget.y + 1.0 + position.z * 6.0 + sin(ph) * 0.8, uViewTarget.z + rel.y);
  // Tumbling: the leaf turns on the screen, and narrows and widens as it flips over.
  float a = seed * 6.2831853 + ph * 1.7;
  vec2 c = mat2(cos(a), sin(a), -sin(a), cos(a)) * (aCard.xy * vec2(1.0, max(abs(cos(ph * 2.3)), 0.2)));
  vec3 world = c0 + (right * c.x + up * c.y) * size;
  vWorldPos = world;
  // Its paint is the leaf's own, wherever it flies.
  vRestPos = position * BOX;
  vNormal = normalize(vec3(sin(ph * 2.3), 1.0, cos(ph * 1.9)));
  vDabNormal = toCam;
  vColor = color;
  vPaint = aPaint;
  vCard = aCard;
  vCardPx = max(size, 1e-4) * projectionMatrix[0][0] * uScreen.x * 0.5;
  vFlash = 0.0;
  place(world);
}
`,$f=`
${Bd}
${Rd}
${zd}
${Vd}
${Ud}
${Wd}
${_f}
varying vec3 vWorldPos;
varying vec3 vRestPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
${Gd}
vec3 toCamera() { return normalize(vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2])); }

#ifdef BASIS
// The brush by place, baked at load (basisBakeMaterial): for each of the BASIS brush scales, seven layers over the ground's
// square, the brush on the flat at 0°, 30°, ... 180°. paintDabs and paintStrokes only ever blend two of those angles, so
// the two either side of 'angle', blended as they blend them, give the brush there: dabs, strokes, fine strokes, drift.
uniform highp sampler2DArray uBasis;
uniform mat3 uFieldsMap;
uniform float uBasisScales[BASIS];
vec4 basisFields(vec2 xz, float scale, float angle) {
  float k = angle / 0.5235988, k0 = floor(k), w = smoothstep(0.3, 0.7, k - k0);
  // The nearest scale baked.
  float layers = 0.0, nearest = abs(scale - uBasisScales[0]);
  for (int i = 1; i < BASIS; i++) {
    float d = abs(scale - uBasisScales[i]);
    if (d < nearest) { nearest = d; layers = float(i * 7); }
  }
  k0 += layers;
  vec2 uv = (uFieldsMap * vec3(xz, 1.0)).xy;
  return (mix(texture(uBasis, vec3(uv, k0)), texture(uBasis, vec3(uv, k0 + 1.0)), w) - 0.5) / 0.45;
}
#endif

// Where the brush runs on a surface: across the ground on flat faces, up the sides on steep ones, blended between the three
// world planes by the normal, so curved surfaces (stones, trunks, the wheat's rounded edge) carry no seam. The top plane's
// strokes follow the contours, the sides' run at the surface's set angle.
vec3 planeWeights(vec3 n) {
  vec3 w = pow(abs(n), vec3(4.0));
  // Planes under 1% are skipped; take that much off each so the skip doesn't leave a step.
  w = max(w / (w.x + w.y + w.z) - 0.01, 0.0);
  return w / (w.x + w.y + w.z);
}
float dabsOn(vec3 p, vec3 w, float scale, float top, float side) {
  float s = 0.0;
  if (w.y > 0.0) s += w.y * paintDabs(p.xz, scale, top);
  if (w.x > 0.0) s += w.x * paintDabs(p.zy, scale, side);
  if (w.z > 0.0) s += w.z * paintDabs(p.xy, scale, side);
  return s;
}
float strokesOn(vec3 p, vec3 w, float top, float side) {
  float s = 0.0;
  if (w.y > 0.0) s += w.y * paintStrokes(p.xz, top);
  if (w.x > 0.0) s += w.x * paintStrokes(p.zy, side);
  if (w.z > 0.0) s += w.z * paintStrokes(p.xy, side);
  return s;
}

// The surface's own colour, drifting in hue and value across the world (one meadow runs yellow-green to emerald to teal),
// by 'amount'; 'dab' is the brush mark's own shift, already as strong as the surface wants it.
// 'drift' is driftField's value there.
float driftField(vec3 p) { return fbm2(p.xz * 0.06 + 3.1); }
vec3 driftColorOf(vec3 base, float drift, float amount, float dab) {
  vec3 lab = linToOklab(base);
  lab = lchShift(lab, drift * 0.02 * amount + dab * 0.05, 1.0 + drift * 0.05 * amount + dab * 0.08, drift * 0.12 * amount + dab * 0.13);
  return oklabToLin(lab);
}
vec3 driftColor(vec3 base, vec3 p, float amount, float dab) { return driftColorOf(base, driftField(p), amount, dab); }

float rimLight(vec3 n, float amount) {
  float f = pow(1.0 - clamp(dot(n, toCamera()), 0.0, 1.0), 2.5);
  return amount * f * smoothstep(-0.1, 0.5, dot(n, uSunDir));
}
`,ep=`
vec4 brushFields(vec3 p, vec3 n) {
  vec3 w = planeWeights(n);
  float angle = contourAngle(n, vPaint.z);
  return vec4(dabsOn(p, w, vPaint.y, angle, vPaint.z), strokesOn(p * vPaint.y * 0.6, w, angle, vPaint.z),
    strokesOn(p * vPaint.y * 1.3, w, angle, vPaint.z), driftField(p));
}
`,tp=`
${$f}
${ep}
varying vec2 vUv;
#ifdef CROP
varying float vGust;
#endif
#ifdef FIELDS
// The ground's brush fields, over the square uFieldsMap takes the ground's x and z to; stored as 0.5 + value / 2.
uniform sampler2D uFields;
uniform mat3 uFieldsMap;
#endif
void main() {
  cloudAt(vWorldPos);
  vec3 n = normalize(vNormal);
  vec3 p = vRestPos;
#ifdef FIELDS
  vec4 fields = texture(uFields, (uFieldsMap * vec3(p.xz, 1.0)).xy) * 2.0 - 1.0;
#elif defined(BASIS)
  // A crop's brush: on top, read by place; down its sides (a field's edges, whatever its height), worked out live. As
  // brushFields, term by term.
  vec3 w = planeWeights(n);
  vec4 top = basisFields(p.xz, vPaint.y, contourAngle(n, vPaint.z));
  vec4 fields = vec4(w.y * top.xyz, top.w);
  float s = vPaint.y, side = vPaint.z;
  if (w.x > 0.0) fields.xyz += w.x * vec3(paintDabs(p.zy, s, side), paintStrokes(p.zy * s * 0.6, side), paintStrokes(p.zy * s * 1.3, side));
  if (w.z > 0.0) fields.xyz += w.z * vec3(paintDabs(p.xy, s, side), paintStrokes(p.xy * s * 0.6, side), paintStrokes(p.xy * s * 1.3, side));
#else
  vec4 fields = brushFields(p, n);
#endif
  // aPaint.x is how much brushwork shows here: a painter works the banks, edges and turns of the land and leaves the
  // open lawn as quiet colour.
  float detail = vPaint.x;
  float dab = fields.x * detail;
  float br = fields.y;
  vec3 base = driftColorOf(vColor, fields.w, 1.0, dab);
  float vis = sunVisibility(vWorldPos, n, br);
  // Cast shadows on the ground fall to half-tone rather than deep shade: the land stays light and calm.
  float floor_ = mix(0.18, 0.3, smoothstep(0.5, 0.7, abs(n.y)));
  float light = sunLight(n, 0.3) * mix(floor_, 1.0, vis) + dab * 0.07 + br * 0.04 * detail;
  // A fine, faint layer of strokes everywhere, so close up even the quiet lawn is paint, not airbrush. It fades out (its
  // contrast, not its place) as the camera pulls back and the strokes get too small to read.
  vec3 fp = p * vPaint.y * 1.3;
  float fine = fields.z * (1.0 - smoothstep(0.12, 0.4, length(fwidth(fp))));
  light += fine * 0.04;
#ifdef CROP
  // Wind in a field, the way a painter shows it: the gusts roll through as long bands of light (the stalks bent over,
  // showing their paler sides to the sky), with a little shade in the troughs between, stronger as the wind rises.
  float force = smoothstep(0.0, 0.6, windForce());
  float sheen = smoothstep(0.45, 0.85, vGust) - (1.0 - smoothstep(0.1, 0.4, vGust)) * 0.5;
  light += sheen * force * 0.16;
  base = mix(base, oklabToLin(lchShift(linToOklab(base), 0.05, 0.8, 0.0)), max(sheen, 0.0) * force * 0.6);
#endif
  vec3 col = paintBands(base, light, 0.05, n.y * 0.5 + 0.5);
  col += rimColorHere() * rimLight(n, vPaint.w);
  writeGBuffer(exposeHere(col), n, vViewDepth, 0.0, 1.0);
}
`,np=`
float dabShape(vec2 c, float seed, float aspect) {
  vec2 q = vec2(c.x, c.y / max(aspect, 0.2));
  float ang = atan(q.y, q.x);
  float lobes = sin(ang * 5.0 + seed) * 0.07 + sin(ang * 9.0 + seed * 1.7) * 0.04;
  // Pointed ends along the stroke: the sides pull in as |x| grows.
  float taper = (1.0 - aspect) * 0.35 * c.x * c.x;
  return 1.0 - length(q) - taper + lobes * aspect + snoise(c * 2.4 + seed) * 0.12;
}
`,rp=`
// Thin things (blades, leaves): no foam line along them, only the wet band (waterline).
#define THIN 1
${$f}
${np}
varying vec4 vCard;
varying vec3 vDabNormal;
varying float vCardPx;
varying float vFlash;
void main() {
  vec2 c = vCard.xy;
  float seed = vCard.w * 91.0;
  float edge = dabShape(c, seed, vPaint.y);
  // The edge softened over one pixel. Its slope comes from the ellipse, not from fwidth: screen derivatives are taken per
  // 2x2 block of pixels, so they change as the picture moves by one pixel and the edges would shimmer. The reflection is drawn
  // at half size and mirrored (the card no longer faces the camera squarely), so there the derivatives are the right measure.
  vec2 q = vec2(c.x, c.y / max(vPaint.y, 0.2));
  float slope = length(vec2(q.x, q.y / max(vPaint.y, 0.2))) / max(length(q), 1e-3);
  float px = uMirror > 0.5 ? 1.0 / max(fwidth(edge), 1e-4) : vCardPx / (slope * 1.2);
  float alpha = clamp(edge * px + 0.5, 0.0, 1.0);
  if (alpha < 0.02) discard;
#ifdef PREPASS
  // Only the dab's shape and coverage: the painting comes after, where the dab shows.
#ifdef MIRROR_CLIP
  if (vWorldPos.y < waterNear(vWorldPos.xz) - 0.01) discard;
#endif
  gColor = vec4(0.0, 0.0, 0.0, alpha);
  gAux = vec4(0.0);
  return;
#endif
  cloudAt(vWorldPos);
  vec3 nCanopy = normalize(vNormal);
  vec3 n = normalize(nCanopy + vDabNormal * 0.2);
  vec3 p = vRestPos;
  // Strokes follow the dab, so each one carries a couple of brush marks.
  float br = strokes(c * 1.6 + seed, seed);
  vec3 base = driftColor(vColor, p, vPaint.x, br * 0.35 * vPaint.x);
  // A leaf turned over by the wind shows its underside: paler, greyer and cooler, a silvery green.
  vec3 under = linToOklab(base);
  under = hueToward(lchShift(under, 0.13, 0.5, 0.0), shadeHueHere(), 0.25);
  base = mix(base, oklabToLinFit(under), vFlash * 0.75);
  float vis = sunVisibility(vWorldPos, nCanopy, br);
  // In the crown's own shadow the lumps still read: the shadow lowers the light rather than flattening it.
  float lit = sunLight(n, 0.35);
  // Out of the sun, a mass is still lit by the sky from above: tops lighter than undersides, so the shade keeps its form.
  float light = lit * mix(0.32, 1.0, vis) + br * 0.08 + nCanopy.y * 0.12 * (1.0 - vis * lit);
  // A dab is a touch darker at its lower edge, where it tucks under the next.
  light -= (1.0 - smoothstep(-1.0, 0.6, c.y)) * 0.06;
  vec3 col = paintBands(base, light, 0.07, nCanopy.y * 0.5 + 0.5);
  // A crown's shade goes deeper than the ground's, and cooler: the dark under a tree is what makes it a mass.
  vec3 lab = linToOklab(col);
  float shade = 1.0 - smoothstep(0.25, 0.6, light);
  lab.x *= 1.0 - 0.22 * shade;
  col = oklabToLinFit(hueToward(lab, shadeHueHere(), 0.08 * shade));
  col += rimColorHere() * rimLight(nCanopy, vPaint.w) * vis * 0.15;
  // Against the sun the crown's edges glow, light coming through the leaves.
  float behind = smoothstep(0.0, 0.7, dot(-toCamera(), uSunDir));
  // Light through a leaf takes the leaf's colour: a warm yellow-green, not the sun's orange.
  float side = pow(1.0 - abs(dot(nCanopy, toCamera())), 3.0);
  col += rimColorHere() * tintOf(base, 0.75) * behind * side * vPaint.w * 0.7 * mix(0.4, 1.0, vis);
  writeGBuffer(exposeHere(col), n, vViewDepth, 0.0, alpha);
}
`,ip=`
// Thin things (blades, leaves): no foam line along them, only the wet band (waterline).
#define THIN 1
${$f}
varying vec2 vBlade;
void main() {
  // Grass is lit like the ground it grows from (its normal is the ground's), so a meadow reads as one painted surface.
  cloudAt(vWorldPos);
  vec3 n = normalize(vNormal);
  vec3 p = vRestPos;
  float angle = contourAngle(n, vPaint.z);
#ifdef BASIS
  vec4 fields = basisFields(p.xz, vPaint.y, angle);
  float dab = fields.x * 0.6;
  float br = fields.y;
  vec3 base = driftColorOf(vColor, fields.w, vPaint.x, dab);
#else
  float dab = paintDabs(p.xz, vPaint.y, angle) * 0.6;
  float br = paintStrokes(p.xz * vPaint.y * 0.6, angle);
  vec3 base = driftColor(vColor, p, vPaint.x, dab);
#endif
  float vis = sunVisibility(vWorldPos, n, br);
  float light = sunLight(n, 0.3) * mix(0.18, 1.0, vis) + dab * 0.07 + br * 0.04;
  // Tips catch a little more light than roots.
  light += (vBlade.x - 0.5) * 0.1;
  vec3 col = paintBands(base, light, 0.06, 0.8);
  col += rimColorHere() * vPaint.w * vBlade.x * vBlade.x * vis * 0.25;
  writeGBuffer(exposeHere(col), n, vViewDepth, 0.0, 1.0);
}
`,ap=`
${$f}
${Hd}
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
varying vec2 vUv;
void main() {
  cloudAt(vWorldPos);
  vec3 n = normalize(vNormal);
  // Mirroring flips which side faces the camera.
  if (gl_FrontFacing == (uMirror > 0.5)) n = -n;
  vec3 p = vWorldPos;
  float finish = vPaint.x;
  // It floats (no waterline on it, #18).
  gFloats = vPaint.w;
  vec3 base = vColor;
  float vis = sunVisibility(p, n, 0.0);
  float light = sunLight(n, 0.2) * mix(0.2, 1.0, vis);
  if (finish > 1.5 && finish < 2.5) {
    // Timber: a few long grain streaks.
    float g = snoise(vec2(vUv.x * 1.5, vUv.y * 24.0)) * 0.5 + 0.5;
    base = oklabToLin(lchShift(linToOklab(base), (g - 0.5) * 0.05, 1.0, 0.0));
  }
  vec3 col = paintBands(base, light, 0.02, n.y * 0.5 + 0.5);
  if (finish > 2.5) {
    // Tin (uv in metres: down the slope, along the ridge): its corrugations, as tone only, never lines; fading out
    // before they're a few pixels apart, so they don't crawl.
    float q = vUv.y * vPaint.z;
    float fade = 1.0 - smoothstep(0.12, 0.3, max(fwidth(q), 1e-4));
    col *= 1.0 - 0.09 * fade * (0.5 + 0.5 * cos(q * 6.2831853));
  }
  if (finish > 0.5 && finish < 1.5) {
    // Solar glass: deep blue cells under the sky's reflection: the clouds drift across the whole array (one sky over all
    // of it, the water's too), brightest where the glass turns towards the horizon, with a sheen where the sun is.
    vec2 cells = vUv * vPaint.yz;
    // Lines a pixel's worth antialiased, and fading out as the cells shrink to a few pixels, so they don't crawl.
    vec2 fw = max(fwidth(cells), 1e-4);
    vec2 line = clamp((0.03 - (0.5 - abs(fract(cells) - 0.5))) / fw + 0.5, 0.0, 1.0);
    float grid = max(line.x, line.y) * (1.0 - smoothstep(0.12, 0.3, max(fw.x, fw.y)));
    vec3 v = toCamera();
    // In the water's reflection the glass is seen from the camera's mirror image, below the water.
    if (uMirror > 0.5) v.y = -v.y;
    vec3 r = reflect(-v, n);
    float fres = 0.2 + 0.5 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
    // The sky it faces, the clouds drifting through it (#8), and long glints across the rows.
    float cloud;
    vec3 seen = mirrorSky(skyPoint(p, r), 1.0 - clamp(r.y * 1.5, 0.0, 1.0), cloud);
    float glint = smoothstep(0.75, 1.0, sin(dot(p.xz, vec2(0.55, 0.35)) + fbm2(p.xz * 0.1) * 1.5));
    // Dark glass mirrors weakly: a cloud shows as a paler patch in its blue, not white.
    seen = mix(mix(uGapSkyTop, uGapSkyBottom, 1.0 - clamp(r.y * 1.5, 0.0, 1.0)), seen, 0.5);
    vec3 sky = mix(seen, mix(uSkyBottom, vec3(1.0), 0.5), glint * 0.6);
    vec3 glass = mix(col, sky * sunTint(), clamp(fres + cloud * 0.15 + glint * 0.4, 0.0, 1.0));
    float sun = pow(max(dot(r, uSunDir), 0.0), 6.0);
    // No sun to shine in it under a cloud.
    glass = mix(glass, vec3(1.0) * sunTint(), sun * 0.6 * vis * (1.0 - gCloud));
    col = mix(glass, glass * 1.3 + 0.04, grid * 0.35);
  }
  writeGBuffer(exposeHere(col), n, vViewDepth, 1.0, 1.0);
}
`,op=400,sp={ripple:.0035,chop:.006,chopMax:1.5,reflectNudge:1.6,blurPx:3},cp=e=>Number.isInteger(e)?e.toFixed(1):String(e),lp=`
uniform vec4 uLandSquare;
bool sheetHidden(vec3 p, float mud) {
  if (mud < -${Ad}) return true;
  if (uLandSquare.z <= 0.0) return false;
  vec2 d = p.xz - uLandSquare.xy;
  float c = cos(uLandSquare.w), s = sin(uLandSquare.w);
  return max(abs(c * d.x - s * d.y), abs(s * d.x + c * d.y)) > uLandSquare.z;
}
`,up=`
${$f}
${Hd}
uniform sampler2D uUnder;
uniform sampler2D uUnderAux;
uniform sampler2D uReflect;
uniform vec2 uScreen;
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
varying vec2 vFlow;
varying float vMud;
varying vec2 vMirrorShift;
${lp}
${Tf}
${Vf}
// The flow carries the ripples and the glints along (a flow map: two copies, each carried for a while and then put back,
// crossfaded so neither's jump shows, each place on its own beat so no pulse runs over the whole river). However the flow
// turns and changes speed across the water, the pattern is never dragged out of shape.
const float FLOW_CYCLE = 4.0;
float crest(float ripple) { return smoothstep(-0.15, 0.35, ripple); }
// Glints of sun on the ripples' crests: little dashes lying across the flow, carried along by it, each winking in and
// out on its own beat. Sparse and soft, so they sit on the clear water rather than whiting it out.
float sparkle(vec2 q, vec2 dir) {
  vec2 fq = vec2(dot(q, dir), dot(q, vec2(-dir.y, dir.x))) * vec2(3.5, 1.6);
  vec2 cell = floor(fq), f = fract(fq) - 0.5 - (hash22(cell) - 0.5) * 0.5;
  float h = hash12(cell + 7.3);
  float wink = max(0.0, sin(uTime * (2.0 + h * 3.0) + h * 40.0));
  return (1.0 - smoothstep(0.5, 1.0, length(f / vec2(0.15, 0.3)))) * step(0.5, h) * wink;
}
// Fast water's streaks (#18): long bands of light along the flow, in the flow's own frame, carried as the ripples are.
float streaks(vec2 q, vec2 dir) {
  vec2 r = vec2(dot(q, dir), dot(q, vec2(-dir.y, dir.x)));
  return snoise(r * vec2(0.2, 3.0)) * 0.65 + snoise(r * vec2(0.45, 6.5) + 5.0) * 0.35;
}
void main() {
  if (sheetHidden(vWorldPos, vMud)) discard;
  // How much the silt shows: a little soon browns water (and halfway between teal and brown is grey).
  float mud = 1.0 - pow(1.0 - clamp(vMud, 0.0, 1.0), 3.0);
  cloudAt(vWorldPos);
  vec3 n = vec3(0.0, 1.0, 0.0);
  vec3 p = vWorldPos;
  vec2 flow = vFlow;
  float speed = length(flow);
  // The ripples lie along the flow; still water lies along the map's x.
  float flowA = speed > 1e-4 ? atan(flow.y, flow.x) : 0.0;
  vec2 dir = vec2(cos(flowA), sin(flowA));
  vec2 uv = gl_FragCoord.xy / uScreen;
  float beat = uTime / FLOW_CYCLE + snoise(p.xz * 0.11 + 3.0) * 0.5;
  float f1 = fract(beat), f2 = fract(beat + 0.5);
  float w1 = 1.0 - abs(2.0 * f1 - 1.0), w2 = 1.0 - w1;
  // The two copies' weights, keeping the pattern's strength through the crossfade (two unlike patterns averaged are fainter).
  float norm = inversesqrt(w1 * w1 + w2 * w2);
  vec2 q1 = p.xz - flow * f1 * FLOW_CYCLE, q2 = p.xz - flow * f2 * FLOW_CYCLE + vec2(17.3, 9.1);
  // Ripples: long, soft swells along the flow, and their screen-space nudge.
  float ripple1 = strokes(q1 * 1.3, flowA) * 0.65 + strokes(q1 * 2.9 + 7.0, flowA + 0.3) * 0.35;
  float ripple2 = strokes(q2 * 1.3, flowA) * 0.65 + strokes(q2 * 2.9 + 7.0, flowA + 0.3) * 0.35;
  float ripple = (ripple1 * w1 + ripple2 * w2) * norm;
  vec2 nudge = (vec2(snoise(q1 * 1.7), snoise(q1 * 1.7 + 19.0)) * w1 + vec2(snoise(q2 * 1.7), snoise(q2 * 1.7 + 19.0)) * w2) * norm
    * ${cp(sp.ripple)};
  // Chop: the wind raises short wavelets across its direction that run downwind, rougher in the gusts. They break up the
  // reflection, and in a storm their crests whiten. They travel as short waves do, about a metre a second in a storm, far
  // slower than the gusts: any faster and they flicker, and the glints and whitecaps keyed to them blink.
  float windA = atan(uWindDir.y, uWindDir.x);
  float chopAmt = smoothstep(0.03, 0.7, windForce()) * (0.5 + windGust(p.xz));
  vec2 cq = p.xz - uWindDrift * 0.1;
  float chop = strokes(cq * 3.2, windA + 1.5707963) * 0.6 + strokes(cq * 6.5 + 3.0, windA + 1.3) * 0.4;
  ripple = mix(ripple, chop, clamp(chopAmt * 0.8, 0.0, 0.8)) + chop * chopAmt * 0.25;
  nudge += vec2(snoise(cq * 4.0), snoise(cq * 4.0 + 7.0)) * ${cp(sp.chop)} * chopAmt;
  // Cat's paws (#36): where a gust passes over the water in a light wind, a patch of it roughens: fine ripples that
  // break up the reflection a little, darken it a little and glint. The look is the developer's pick, "glitter": the
  // glints carry it, and the mild darkening lets the patch read as one. The patch travels with the gust; the ripples stay
  // nearly put, as they do on a pond. Gone in a dead calm, and from about 8 m/s, when the whole surface is chop. (Their nudge, with the chop's
  // in a light wind, stays well inside WATER_REACH.)
  // Water lies low among banks and trees, sheltered more in some places than others, so a gust is read against how hard
  // the wind usually blows just there: a paw where it's blowing a quarter harder than usual.
  // The wind's cells are a metre or more and a gust spans many, so its edge is broken up by a ragged noise carried with
  // the air: scalloped patches a few metres across, and small ones running ahead, not the whole stream dimming at once.
  // Only round a gust: in the usual wind the noise alone would make paws.
  vec2 bq = (p.xz - uWindDrift * 0.8) * 0.4;
  float ragged = snoise(bq) * 0.6 + snoise(bq * 2.3 + 5.0) * 0.4;
  float gustHere = windGustHere(p.xz);
  float paw = smoothstep(1.15, 1.3, gustHere + ragged * 0.35 * smoothstep(1.0, 1.15, gustHere))
    * smoothstep(0.5, 2.0, uWindSpeed) * (1.0 - smoothstep(6.0, 10.0, uWindSpeed));
  vec2 pq = p.xz * 7.0 - uWindDir * uTime * 0.15;
  nudge += vec2(snoise(pq), snoise(pq + 11.0)) * 0.002 * paw;

  // Under the water.
  vec2 uvBed = uv + nudge;
  vec3 bed = texture(uUnder, uvBed).rgb;
  float bedDepth = texture(uUnderAux, uvBed).z;
  float path = bedDepth > 0.0 ? max(bedDepth - vViewDepth, 0.0) : 3.0;
  vec3 waterLab = linToOklab(vColor);
  vec3 scatter = oklabToLin(lchShift(waterLab, 0.06, 1.35, 0.0));
  vec3 absorb = vec3(1.9, 0.75, 0.6);
  // Muddy water (#18, the developer's pick "brown"): silt makes it ochre brown and opaque, the bed lost a hand's depth down.
  scatter = mix(scatter, vec3(0.28, 0.15, 0.045), mud);
  absorb = mix(absorb, vec3(4.0, 4.4, 5.0), mud);
  vec3 through = exp(-absorb * path);
  float vis = sunVisibility(p, n, ripple);
  // The body of the water is lit from above by the sky; the sun shows in its sparks.
  // The bed and the reflection are lit where they are already; the water's own light is exposed here (exposeHere).
  // (Silt is lit as the land is, by the sun as much as the sky.)
  scatter = exposeHere(scatter * mix(skyTint(), mix(skyTint(), sunTint(), 0.6), mud) * mix(0.75, 1.0, vis));
  vec3 under = bed * through + scatter * (1.0 - through);

  // The reflection, and the sky where nothing is reflected: looking down at 30 degrees, the water mirrors the sky 30 degrees up.
  // Taken through a small blur: the reflection is drawn at half size, and its thin bright things (grass blades above all)
  // would flicker as the camera moves.
  vec2 rt = ${cp(sp.blurPx)} / uScreen;
  vec2 ruv = uv + nudge * ${cp(sp.reflectNudge)} - vMirrorShift;
  vec4 refl = (texture(uReflect, ruv) * 2.0 + texture(uReflect, ruv + vec2(rt.x, 0.0)) + texture(uReflect, ruv - vec2(rt.x, 0.0))
    + texture(uReflect, ruv + vec2(0.0, rt.y)) + texture(uReflect, ruv - vec2(0.0, rt.y))) / 6.0;
  // The upper sky, and on the ripples' crests, which tilt towards the horizon, the glow low in it: a mean of the two would be grey.
  // The clouds in it (#8) along the mirrored ray, shaken by the ripples.
  vec3 sky = exposeHere(mix(uGapSkyTop, uGapSkyBottom, 0.25));
  vec3 mirrored = sky * (1.0 - refl.a) + refl.rgb;
  // Mostly see-through: the bed shows in the shallows, and the reflection grows only where the water is deep and dark.
  float depthy = 1.0 - (through.g * 0.5 + through.b * 0.5);
  // (Muddy water is opaque, but its silt is what shows, not a deep pool's mirror.)
  float fres = clamp(0.08 + depthy * 0.22 * (1.0 - 0.6 * mud) + ripple * 0.1, 0.0, 0.5);
  vec3 col = mix(under, mirrored, fres);
  // The clouds in it (#8), along the mirrored ray and shaken by the ripples: their light over the sky's, alike over the
  // shallows and the deep (the depth is read at half size, and its grain would show against a bright cloud and shimmer as
  // the camera moves), and over the faint things mirrored in front of them (thin blades), not the solid ones. How strongly
  // they show: the developer's pick, "clear" (#8).
  float cloud;
  vec3 clouded = exposeHere(mirrorSky(skyPoint(p, reflect(-toCamera(), n)) + nudge * ${cp(op)}, 0.25, cloud));
  vec2 wide = rt * 2.5;
  float cover = (refl.a * 2.0 + texture(uReflect, ruv + wide).a + texture(uReflect, ruv - wide).a
    + texture(uReflect, ruv + vec2(wide.x, -wide.y)).a + texture(uReflect, ruv - vec2(wide.x, -wide.y)).a) / 6.0;
  float solid = smoothstep(0.35, 0.9, cover);
  // Fading out at the very edge, where only a film of water lies over the bank.
  float film = smoothstep(0.0, 0.5, path);
  col += (clouded - sky) * (1.0 - solid) * film * 0.365 * (0.85 + 0.3 * ripple);
  col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.25)), smoothstep(0.5, 0.9, ripple) * 0.25 * depthy * (1.0 - 0.6 * mud));
  // Sparkle: glints of sun on the ripples' crests (sparkle), carried by the flow as the ripples are.
  float spark = (sparkle(q1, dir) * w1 + sparkle(q2, dir) * w2) * crest(ripple);
  // No glints under a cloud.
  // (The river's own glints dim a little in a paw, as it darkens.)
  col = mix(col, exposeHere(mix(vec3(1.0), sunTint(), 0.5)),
    spark * vis * (1.0 - gCloud) * (0.2 + depthy * 0.4) * (1.0 - paw * 0.28));
  // The paws: a little darker and cooler, as a roughened patch mirrors less of the bright sky, and glinting in fine points
  // that wink quickly, as many more tiny facets catch the sun. Only as bright as the sun is direct (uCloudStrength): none
  // under full cover or before dawn, faint by the moon. (gCloud is the cloud's shade already scaled by uCloudStrength, so
  // this is the direct light times the cloud's gap.)
  col = mix(col, col * vec3(0.5, 0.58, 0.68), paw * 0.35);
  vec2 gq = p.xz * 6.0 - uWindDir * uTime * 0.15;
  vec2 gc = floor(gq), gf = fract(gq) - 0.5 - (hash22(gc) - 0.5) * 0.6;
  float gh = hash12(gc + 3.1);
  float glit = (1.0 - smoothstep(0.1, 0.2, length(gf))) * step(0.4, gh) * max(0.0, sin(uTime * (5.0 + gh * 6.0) + gh * 50.0));
  col = mix(col, exposeHere(mix(vec3(1.0), sunTint(), 0.5)), glit * paw * vis * max(uCloudStrength - gCloud, 0.0));
  // Fast water (#18, the developer's pick "streaks"), from about a metre a second: the stream in spate.
  float fast = smoothstep(0.45, 1.1, speed);
  if (fast > 0.0) {
    // Streaks: the surface torn into long bands along the flow, their faces catching the sky's glow, darker between.
    float st = (streaks(q1, dir) * w1 + streaks(q2, dir) * w2) * norm;
    col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.35) * skyTint()), smoothstep(0.2, 0.7, st) * fast * 0.32);
    col *= 1.0 - (1.0 - smoothstep(-0.7, -0.2, st)) * fast * 0.14;
  }
  // Whitecaps on the chop's crests in a storm.
  float caps = smoothstep(0.55, 0.9, chop) * smoothstep(0.45, 1.0, windForce()) * smoothstep(0.4, 0.9, windGust(p.xz) + 0.2);
  col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.6) * skyTint()), caps * 0.45);
  // Rain's rings (#11): pale lines of the sky's light where the drops land, fewer under a crown, none under a roof.
  if (uRings.x > 0.0) {
    float rings = rainRings(p.xz) * (1.0 - shelter(p));
    col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.45) * skyTint()), rings);
  }
  writeGBuffer(col, n, vViewDepth, 0.0, 1.0);
}
`,dp=`
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gAux;
#if defined(MIRROR_CLIP) || defined(WATER_SHEET)
varying vec3 vWorldPos;
#endif
#ifdef MIRROR_CLIP
${Nd}
#endif
#ifdef WATER_SHEET
${lp}
varying float vMud;
#endif
void main() {
#ifdef WATER_SHEET
  if (sheetHidden(vWorldPos, vMud)) discard;
#endif
#ifdef MIRROR_CLIP
  // As writeGBuffer does in the reflection: what's under the water isn't reflected.
  if (vWorldPos.y < waterNear(vWorldPos.xz) - 0.01) discard;
#endif
  gColor = vec4(0.0); gAux = vec4(0.0);
}
`,fp=`
void main() { gl_FragColor = vec4(1.0); }
`,pp=`
${Rd}
${np}
varying vec4 vCard;
varying vec4 vPaint;
void main() {
  if (dabShape(vCard.xy, vCard.w * 91.0, vPaint.y) < 0.0) discard;
  gl_FragColor = vec4(1.0);
}
`,mp={paint:Jf,ground:Jf,crop:Jf,ink:Jf,water:Yf,foliage:Xf,grass:Zf,debris:Qf},hp={paint:tp,ground:tp,crop:tp,ink:ap,water:up,foliage:rp,grass:ip,debris:rp},gp=new H(2911860),_p={paint:{TREES:1},ground:{TREES:1},crop:{CROP:1},water:{WATER_SHEET:1,WATER_COLOR:`vec3(${gp.r.toFixed(6)}, ${gp.g.toFixed(6)}, ${gp.b.toFixed(6)})`}},vp=e=>e===`foliage`||e===`debris`,yp=e=>e===`grass`||vp(e)||e===`ink`?2:0;function bp(e,t){let n=new ti({glslVersion:Ge,uniforms:{...t},vertexShader:mp[e],fragmentShader:hp[e],defines:{..._p[e]},vertexColors:!0,side:yp(e)});return vp(e)&&(n.alphaToCoverage=!0),n}function xp(e,t,n=!1){let r=new ti({glslVersion:Ge,uniforms:{...t},vertexShader:mp[e],fragmentShader:vp(e)?hp[e]:dp,defines:{..._p[e],PREPASS:1,...n?{MIRROR_CLIP:1}:{}},vertexColors:!0,side:yp(e),colorWrite:!1});return vp(e)&&(r.alphaToCoverage=!0),r}function Sp(e,t){return new ti({uniforms:{...t},vertexShader:mp[e],fragmentShader:vp(e)?pp:fp,defines:{..._p[e],SHADOW_PASS:1},vertexColors:!0,side:2,colorWrite:!1})}var Cp=`
attribute vec4 aPaint;
uniform mat3 uFieldsMap;
varying vec3 vRestPos;
varying vec3 vNormal;
varying vec4 vPaint;
// The rest of the painting's inputs, unused here.
varying vec3 vWorldPos;
varying vec3 vColor;
varying float vViewDepth;
void main() {
  vRestPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vPaint = aPaint;
  vWorldPos = vRestPos; vColor = vec3(0.0); vViewDepth = 0.0;
  gl_Position = vec4((uFieldsMap * vec3(vRestPos.xz, 1.0)).xy * 2.0 - 1.0, 0.0, 1.0);
}
`,wp=`
${$f}
${ep}
void main() {
  gColor = brushFields(vRestPos, normalize(vNormal)) * 0.5 + 0.5;
  gAux = vec4(0.0);
}
`;function Tp(e,t){return new ti({glslVersion:Ge,uniforms:{...e,uFieldsMap:{value:t}},vertexShader:Cp,fragmentShader:wp,side:2,depthTest:!1,depthWrite:!1})}var Ep=`
uniform mat3 uFieldsUnmap;
varying vec3 vRestPos;
// The rest of the painting's inputs, unused here.
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
void main() {
  vec2 xz = (uFieldsUnmap * vec3(position.xy * 0.5 + 0.5, 1.0)).xy;
  vRestPos = vec3(xz.x, 0.0, xz.y);
  vWorldPos = vRestPos; vNormal = vec3(0.0, 1.0, 0.0); vColor = vec3(0.0); vPaint = vec4(0.0); vViewDepth = 0.0;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Dp=`
${$f}
uniform float uBakeScale;
uniform float uBakeLayer;
void main() {
  // As paintDabs and paintStrokes work them out at the layer's angle. Stored as 0.5 + 0.45 value: dabs reach a little
  // past 1.
  float angle = uBakeLayer * 0.5235988;
  vec2 p = vRestPos.xz;
  float s = uBakeScale;
  gColor = vec4(dabLayer(p, s, angle), strokes(p * s * 0.6, angle), strokes(p * s * 1.3, angle), driftField(vRestPos)) * 0.45 + 0.5;
  gAux = vec4(0.0);
}
`;function Op(e,t,n,r){return new ti({glslVersion:Ge,uniforms:{...e,uFieldsUnmap:{value:t},uBakeScale:{value:n},uBakeLayer:{value:r}},vertexShader:Ep,fragmentShader:Dp,side:2,depthTest:!1,depthWrite:!1})}var kp=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,Ap=`
precision highp float;
uniform sampler2D tColor;
uniform sampler2D tAux;
uniform vec2 uResolution;
uniform float uLineWidth;
uniform float uLines;
uniform float uTargetDepth;
uniform vec3 uHazeColor;
uniform float uHazeDensity;
uniform float uHazeMax;
uniform float uHazeFloor;
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
uniform float uExposure;
uniform float uSaturation;
uniform float uNightShift;
uniform float uShadeHue;
uniform float uGrain;
// Where a pixel is in the world: the camera's position, its right and up scaled to half the view, and its forward (the
// camera is orthographic, so every pixel looks the same way and its depth is a distance along it).
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
// The fog (#9): its colour as lit; x how thick, y its base, z its top, w how far under its top it thins (metres). Its
// patches lie in a frame laid along the wind (WindState.haze): x, y its heading, z how far they're drawn out along it, w
// how far they've drifted; and a second frame fading in after the wind turns (uFogNext, uFogFade: how far it's in), so a
// turn never swings them. uFogStreak: how far dust's streaks have blown along each.
uniform sampler2D tFogNoise;
uniform vec3 uFogColor;
uniform vec4 uFog;
uniform vec4 uFogFrame;
uniform vec4 uFogNext;
uniform float uFogFade;
uniform vec2 uFogStreak;
// Dust (#9): x how far the haze is dust, y how strong its streaks are, z how much the gusts thicken and thin it.
uniform vec3 uDust;
// The wind as a whole (the gusts are in its map: see WIND_GLSL).
uniform float uWindSpeed;
uniform vec2 uWindDir;
// Fresh dust (#36, dust.ts): its field at the wind's last two ticks (the optical depth, the ground's height, the dust's
// top), the frame's share of the way between them, where it lies (its corner, 1 over its size), whether there's any, and
// its colour as lit.
uniform sampler2D tDustA;
uniform sampler2D tDustB;
uniform float uDustBlend;
uniform vec4 uDustGrid;
uniform float uDustOn;
uniform vec3 uDustColor;
uniform float uDustReach;
// The heat's shimmer (#9): x how far it shifts the picture (pixels), y the time (seconds).
uniform vec2 uShimmer;
varying vec2 vUv;
${Rd}
${zd}
${_f}

const float FAR = 1e4;
float depthOf(vec4 a) { return a.z <= 0.0 ? FAR : a.z; }

// The fog gathers over FOG_SOFT_BASE metres above its base, if it has one, and thins to nothing at its top over uFog.w
// metres: most of its depth, so a shallow mist lies thickest along the water and in the hollows, and a deep fog veils all
// the land while roofs and crowns rise out of it. Its thickness is per depth of the layer, so a shallow mist and a deep fog
// of the same amount hide the bottom of the layer alike.
const float FOG_SOFT_BASE = 1.0;
const float FOG_NOISE_CELLS = ${16 .toFixed(1)};
const float FOG_DENSITY = 2.5;
// The most it hides: the farm still shows through the thickest.
const float FOG_MAX = 0.85;

// The baked noise (fog.ts) at a point in noise cells: about -1..1.
float fogNoise(vec2 p) { return texture2D(tFogNoise, p / FOG_NOISE_CELLS).r * 2.0 - 1.0; }
${Hf}

// How thick the fog is at a height, 0..1.
float fogProfile(float y) {
  return clamp((uFog.z - y) / uFog.w, 0.0, 1.0) * clamp((y - uFog.y) / FOG_SOFT_BASE, 0.0, 1.0);
}

// Patches, keyed to the world and drifting with the wind, stretched along it: a thick fog covers everything, a thin one
// breaks up, and the low parts of the layer keep it longest. Two sizes, drifting at different speeds, so the patches
// change shape as they go rather than sliding as one sheet.
float fogPatchIn(vec4 f, vec2 xz) {
  vec2 q = vec2(dot(xz, f.xy) / f.z - f.w, dot(xz, vec2(-f.y, f.x)));
  return fogNoise(q * 0.055) * 0.65 + fogNoise(q * 0.14 + vec2(f.w * 0.035, 0.0) + 11.0) * 0.35;
}
float fogPatch(vec2 xz, float y) {
  float n = fogPatchIn(uFogFrame, xz);
  if (uFogFade > 0.0) n = mix(n, fogPatchIn(uFogNext, xz), smoothstep(0.0, 1.0, uFogFade));
  float bias = (uFog.x - 0.35) * 2.5 + fogProfile(y) * 0.5 - 0.25;
  return smoothstep(-0.5, 0.5, n + bias);
}

// Dust, how much thicker (or thinner, below 1) it is at a point: the gusts sweep it in in waves, thinning between them, and fine streaks blow along the wind through it, quicker than its clouds,
// strongest in a gust. It thickens the dust rather than moving where its patches start, so it shows in a storm's thick
// dust too. Read once, at the surface: the few metres the view crosses in the layer wouldn't show, and reading it at every
// step cost most of what dust adds.
// The gusts are the game's (windGust, from its map): the same that bow the grass, crest for crest.
float fogStreakIn(vec4 f, float drift, vec2 xz) {
  vec2 s = vec2(dot(xz, f.xy) / ${6 .toFixed(1)} - drift, dot(xz, vec2(-f.y, f.x)));
  return fogNoise(s * 0.6 + 5.0);
}
float fogDust(vec2 xz) {
  if (uDust.x <= 0.0) return 1.0;
  float gust = windGust(xz);
  float n = fogStreakIn(uFogFrame, uFogStreak.x, xz);
  if (uFogFade > 0.0) n = mix(n, fogStreakIn(uFogNext, uFogStreak.y, xz), smoothstep(0.0, 1.0, uFogFade));
  float streak = n * uDust.y * (0.3 + 1.4 * gust);
  return max(1.0 + uDust.x * (streak + (gust - 0.5) * uDust.z), 0.1);
}

// The share of a surface the fog hides: summed along the view's path up out of the layer from the surface, in a few
// steps, so a patch veils what's under it and things rising out of the fog clear it.
float fogAt(vec3 p) {
  float ya = max(p.y, uFog.y), yb = uFog.z;
  if (yb <= ya) return 0.0;
  vec3 back = -uCamFwd;
  float dy = (yb - ya) / 4.0, sum = 0.0;
  for (int i = 0; i < 4; i++) {
    float y = ya + (float(i) + 0.5) * dy;
    vec3 q = p + back * ((y - p.y) / back.y);
    sum += fogProfile(y) * fogPatch(q.xz, y);
  }
  return FOG_MAX * (1.0 - exp(-sum * dy / uFog.w * uFog.x * FOG_DENSITY * fogDust(p.xz)));
}

// Fresh dust: how much of a surface it hides. Summed along the view's path up out of the dust from the surface, in a few
// steps (up to the look's top and half a metre over), each reading the field where the path is then: a puff is a column
// over the ground, thick up to its top and thinning over the top half metre, so it veils what's behind and below it and
// has depth as the view looks through it.
const float DUST_MAX = 0.8;
vec3 dustField(vec2 xz) {
  vec2 uv = (xz - uDustGrid.xy) * uDustGrid.zw;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec3(0.0);
  return mix(texture2D(tDustA, uv).xyz, texture2D(tDustB, uv).xyz, uDustBlend);
}
float freshDust(vec3 p) {
  if (uDustOn <= 0.0) return 0.0;
  vec3 back = -uCamFwd;
  const int STEPS = 5;
  float dy = uDustReach / float(STEPS), sum = 0.0;
  for (int i = 0; i < STEPS; i++) {
    float y = p.y + (float(i) + 0.5) * dy;
    vec3 f = dustField((p + back * ((y - p.y) / back.y)).xz);
    float depth = max(f.z - f.y, 0.1);
    sum += f.x / depth * clamp((f.z - y) / 0.5 + 0.5, 0.0, 1.0) * step(f.y - 0.3, y);
  }
  return DUST_MAX * (1.0 - exp(-sum * dy / back.y));
}

// Laid over a colour: a veil of its colour, with a trace of the paint's own colour given back over it at the veil's
// lightness. The developer's pick (#9, 'tint'): the fog drains colour, as fog does, but the land under it isn't flat
// grey. A plain veil drained it all; giving back more (0.3, 0.6) read less like fog.
const float FOG_KEEP = 0.15;
vec3 fogOver(vec3 c, float f) {
  if (f <= 0.0) return c;
  vec3 v = mix(c, uFogColor, f);
  vec3 lab = linToOklab(v);
  lab.yz += linToOklab(c).yz * FOG_KEEP * f;
  return oklabToLinFit(lab);
}

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

// Where a pixel is in the world, from its place on the screen and its depth.
vec3 worldAt(vec2 uv, float d) {
  vec2 ndc = uv * 2.0 - 1.0;
  return uCamPos + uCamRight * ndc.x + uCamUp * ndc.y + uCamFwd * d;
}

void main() {
  vec2 uv = vUv;
  vec4 aux = texture2D(tAux, uv);
  // Heat shimmer: the picture wavers sideways a fraction of a pixel, in thin bands keyed to the world that rise and drift
  // (the hot air over the land), so it stays with the land as the camera moves.
  if (uShimmer.x > 0.0 && aux.z > 0.0) {
    vec3 p = worldAt(uv, aux.z);
    vec2 q = vec2(dot(p.xz, normalize(uCamRight.xz)) * 0.8, p.y * 4.0 + dot(p.xz, normalize(uCamUp.xz)) * 2.0 - uShimmer.y * 1.6);
    uv.x += fogNoise(q + uShimmer.y * vec2(0.15, 0.0)) * uShimmer.x / uResolution.x;
    aux = texture2D(tAux, uv);
  }
  vec4 painted = texture2D(tColor, uv);
  vec3 c = painted.rgb;
  float d = depthOf(aux);
  bool sky = d >= FAR;

  if (sky) {
    // Under any rain drawn over it (see rain.ts: premultiplied, over nothing).
    c = mix(uSkyBottom, uSkyTop, smoothstep(0.2, 1.0, vUv.y)) * (1.0 - painted.a) + painted.rgb;
  }

  // Ink: a line on an inked surface where it ends against something farther (its silhouette) or folds sharply (a crease).
  // Lines are drawn only on the inked side, in a darker, richer shade of the surface's own colour, never black.
  float edge = 0.0;
  if (uLines > 0.5 && aux.w > 0.02) {
    vec2 px = uLineWidth / uResolution;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.785398;
      vec2 o = vec2(cos(a), sin(a)) * px;
      vec4 b = texture2D(tAux, uv + o);
      float dd = depthOf(b) - d;
      float sil = smoothstep(0.06, 0.16, dd);
      float crease = b.w * smoothstep(0.3, 0.55, length(aux.xy - b.xy));
      edge = max(edge, max(sil, crease * 0.85));
    }
    edge *= aux.w;
  }

  // Fog or dust: lying on the land, over the surface and under the distance's haze.
  float fog = 0.0;
  if (!sky && uFog.x > 0.0) {
    fog = fogAt(worldAt(uv, d));
    c = fogOver(c, fog);
  }

  // Fresh dust, lifted by the gusts: over the fog, a veil of the earth's colour.
  if (!sky && uDustOn > 0.0) c = mix(c, uDustColor, freshDust(worldAt(uv, d)));

  // Haze: the hour's air over everything, thickening with distance past the camera's target.
  if (!sky) {
    float far = max(d - uTargetDepth, 0.0);
    float haze = max((1.0 - exp(-far * uHazeDensity)) * uHazeMax, uHazeFloor);
    c = mix(c, uHazeColor, haze);
  }

  // The veil of rain over the distance (#11), over the haze: rain between the eye and the far land.
  c = mix(c, uRainVeilColor, rainVeil(uv * 2.0 - 1.0, d));

  // In fog, lines fade halfway with what they draw. The developer's pick (#9, 'soft'): fading all the way looked more like
  // a painting, but the things the player can use got lost in the fog.
  edge *= 1.0 - fog / FOG_MAX * 0.5;
  if (edge > 0.0) {
    vec3 lab = linToOklab(c);
    vec3 ink = hueToward(lchShift(lab, -0.45 * lab.x, 1.25, 0.0), uShadeHue, 0.25);
    c = mix(c, oklabToLinFit(ink), edge * 0.9);
  }

  // Grade: exposure, a soft shoulder instead of a hard clip, richer chroma.
  c *= uExposure;
  c = c / (1.0 + max(c - 0.8, 0.0) * 0.9);
  vec3 lab = linToOklab(c);
  lab.yz *= uSaturation;
  // At night, from yellow-green towards blue (the 'blue' night).
  lab.yz += vec2(0.005, -0.035) * uNightShift;
  c = oklabToLinFit(lab);

  vec3 o = toSrgb(c);
  // A faint canvas tooth, and a gentle vignette.
  o += (hash12(gl_FragCoord.xy) - 0.5) * uGrain;
  vec2 v = vUv - 0.5;
  o *= 1.0 - dot(v, v) * 0.35;
  gl_FragColor = vec4(o, 1.0);
}
`,jp=13620952,Mp={clear:{cloud:0},scattered:{cloud:.3},overcast:{cloud:1},"soft-rain":{cloud:.7,rain:.35},storm:{cloud:1,rain:.9},mist:{cloud:.2,haze:{amount:.4,color:jp,top:.6}},fog:{cloud:.6,haze:{amount:.6,color:jp,top:4}},"low-cloud":{cloud:1,haze:{amount:.7,color:jp,top:9,base:4.5}},dust:{cloud:.4,heat:.5,haze:{amount:.7,color:12884578,top:6,kind:`dust`}},"heat-wave":{cloud:0,heat:1},snow:{cloud:.9,snow:.5},blizzard:{cloud:1,snow:1}},Np=1.5,Pp=class{goal={cloud:0,sunUnder:0,rain:0,snow:0,heat:0,haze:0,hazeColor:new H(jp),hazeTop:4,dust:0,hazeBase:null};cloud=0;clouds={cover:0,x:0,z:0,seed:0};drift={x:0,z:0,vx:0,vz:0,since:null};overcast=0;sunUnder=0;rain=0;snow=0;heat=0;haze=0;hazeColor=new H(jp);hazeTop=4;hazeBase=-50;dust=0;ground=-50;time=null;setGround(e){this.ground=e,this.hazeBase=Math.max(this.hazeBase,Math.min(e,this.goal.hazeTop))}baseGoal(){return Math.min(this.goal.hazeBase??this.ground,this.goal.hazeTop)}set(e,t=!1){let n=this.goal,r=(e=0)=>yt.clamp(e,0,1);if(n.cloud=r(e.cloud),n.sunUnder=r(e.sunUnder),n.rain=r(e.rain),n.snow=r(e.snow),n.heat=r(e.heat),n.haze=r(e.haze?.amount),e.haze&&(n.hazeColor.setHex(e.haze.color),n.hazeTop=e.haze.top,n.hazeBase=e.haze.base??null,n.dust=+(e.haze.kind===`dust`),this.haze<.01&&(this.hazeColor.copy(n.hazeColor),this.hazeTop=n.hazeTop,this.hazeBase=this.baseGoal(),this.dust=n.dust)),this.cloud=this.clouds.cover=n.cloud,e.drift){let t=this.drift;t.x=e.drift.x,t.z=e.drift.z,t.vx=e.drift.vx??0,t.vz=e.drift.vz??0,t.since=null,this.clouds.x=t.x,this.clouds.z=t.z}e.cloudSeed!==void 0&&(this.clouds.seed=e.cloudSeed),t&&this.snap()}snap(){let e=this.goal;this.cloud=this.overcast=e.cloud,this.sunUnder=e.sunUnder,this.rain=e.rain,this.snow=e.snow,this.heat=e.heat,this.haze=e.haze,this.hazeColor.copy(e.hazeColor),this.hazeTop=e.hazeTop,this.hazeBase=this.baseGoal(),this.dust=e.dust}update(e){let t=this.drift;(t.since===null||e<t.since)&&(t.since=e);let n=Math.max(0,e-t.since);this.clouds.x=t.x+t.vx*n,this.clouds.z=t.z+t.vz*n;let r=this.time===null?0:e-this.time;if(this.time=e,r<=0)return;let i=this.goal,a=1-Math.exp(-r/Np);this.overcast+=(i.cloud-this.overcast)*a,this.sunUnder+=(i.sunUnder-this.sunUnder)*a,this.rain+=(i.rain-this.rain)*a,this.snow+=(i.snow-this.snow)*a,this.heat+=(i.heat-this.heat)*a,this.haze+=(i.haze-this.haze)*a,this.hazeColor.lerp(i.hazeColor,a),this.hazeTop+=(i.hazeTop-this.hazeTop)*a,this.hazeBase+=(this.baseGoal()-this.hazeBase)*a,this.dust+=(i.dust-this.dust)*a}},Fp={sun:16766094,sunTurn:.7,sunGain:1.1,skyTurn:.35,haze:16111776,hazeDensity:1.6,hazeFloor:.1,contrast:.92,exposure:1.05,saturation:.95,litLean:.25,shimmer:3.5},Ip=(e,t,n)=>e+(t-e)*n,Lp=e=>.2126*e.r+.7152*e.g+.0722*e.b,Rp=e=>Math.max(e.r,e.g,e.b,.001),zp=e=>e.clone().multiplyScalar(1/Rp(e)),Bp=(e,t)=>e.clone().multiplyScalar(Lp(t)/Math.max(Lp(e),1e-4)),Vp=(e,t)=>t*(1-e.night)*yt.smoothstep(e.sunEl,-4,12);function Hp(e,t,n){let r=t.dust*Math.min(1,t.haze*1.4),i=Vp(e,t.heat);if(r<=0&&i<=0)return e;let a={...e};if(r>0){let n=t.hazeColor,i=zp(new H(n.r**1.6,n.g**1.6,n.b**1.6));a.sunColor=e.sunColor.clone().lerp(i.multiplyScalar(Rp(e.sunColor)),.9*r).multiplyScalar(1-.3*r),a.skyColor=e.skyColor.clone().lerp(zp(n).multiplyScalar(Rp(e.skyColor)),.6*r),a.rimColor=e.rimColor.clone().multiplyScalar(1-.5*r),a.hazeColor=e.hazeColor.clone().lerp(Bp(n,e.hazeColor),r),a.hazeDensity=e.hazeDensity*(1+2*r),a.hazeFloor=e.hazeFloor+.15*r,a.exposure=e.exposure*(1-.15*r)}if(i>0){let t=new H(n.sun),r=new H(n.haze);a.sunColor=a.sunColor.clone().lerp(zp(t).multiplyScalar(Rp(a.sunColor)),n.sunTurn*i).multiplyScalar(Ip(1,n.sunGain,i)),a.skyColor=a.skyColor.clone().lerp(Bp(zp(t),a.skyColor),n.skyTurn*i),a.hazeColor=a.hazeColor.clone().lerp(Bp(r,a.hazeColor).lerp(r,.5),i),a.hazeDensity*=Ip(1,n.hazeDensity,i),a.hazeFloor=Ip(a.hazeFloor,Math.max(a.hazeFloor,n.hazeFloor),i),a.shadeDepth=e.shadeDepth*Ip(1,n.contrast,i),a.litLean=Ip(e.litLean,Math.max(e.litLean,n.litLean),i),a.exposure*=Ip(1,n.exposure,i),a.saturation=e.saturation*Ip(1,n.saturation,i)}return a}var Up={sun:1,exposure:.6,sky:.45,shadowFade:.35,shadowSun:.85,shadowBlur:1.5,rim:1.2,warmth:1.4,depth:.95,air:.3},Wp=(e,t,n)=>e+(t-e)*n,Gp=(e,t,n)=>e+((t-e+540)%360-180)*n,Kp=yt.smoothstep;function qp(e,t,n){return e*(1-Kp(t.night,0,.15))*Kp(t.dayEl,-2,3)*(1-Kp(t.dayEl,14,26))*Kp(n,.6,1)}function Jp(e,t,n){return n<=0?e:{...e,sky:Wp(e.sky,t.sky,n),shadowFade:Wp(e.shadowFade,t.shadowFade,n),shadowLift:e.shadowLift*(1-t.shadowSun*n),shadowBlur:Wp(e.shadowBlur,t.shadowBlur,n)}}function Yp(e,t,n,r){if(r<=0)return e;let i=n.air*r;return{...e,sunColor:e.sunColor.clone().lerp(t.sunColor,n.sun*r),rimColor:e.rimColor.clone().lerp(t.rimColor.clone().multiplyScalar(n.rim),r),shadeDepth:Wp(e.shadeDepth,t.shadeDepth*n.depth,r),litHue:Gp(e.litHue,t.litHue,r),litLean:Wp(e.litLean,t.litLean*n.warmth,r),hazeColor:e.hazeColor.clone().lerp(t.hazeColor,i),exposure:Wp(e.exposure,t.exposure,n.exposure*r),saturation:Wp(e.saturation,t.saturation,i)}}var Xp={hedge:8,crown:4.4,railFence:.4},Zp=.1,Qp=Math.fround;function $p(e,t,n,r=0){let i=(t-e.x0)/e.cell-.5,a=(n-e.z0)/e.cell-.5,o=Math.max(0,Math.min(e.nx-2,Math.floor(i))),s=Math.max(0,Math.min(e.nz-2,Math.floor(a))),c=Math.max(0,Math.min(1,i-o)),l=Math.max(0,Math.min(1,a-s)),u=0,d=0;for(let t=0;t<2;t++)for(let n=0;n<2;n++){let i=(s+t)*e.nx+o+n,a=(n?c:1-c)*(t?l:1-l),[f,p]=em(e,i,r);u+=f*a,d+=p*a}return[u,d]}function em(e,t,n){let r=e.u[t],i=e.v[t];if(n<=.75)return[r,i];let a=Math.min(1,(n-.75)/7.25),o=1+.5*a+.01*Math.max(0,n-8),s=Math.min(1,Math.max(0,1-e.k[t])),c=(1-a)*(1-a+a*s),l=o*e.fu[t],u=o*e.fv[t];return[Qp(l+c*(r-l)),Qp(u+c*(i-u))]}function tm(e,t,n,r,i,a=0){let o=$p(e,r,i,a),s=$p(t,r,i,a);return[o[0]+(s[0]-o[0])*n,o[1]+(s[1]-o[1])*n]}var nm={cypress:1,broadleaf:.55,fruit:.5,round:.5,bush:.35},rm={cypress:{hz:.6,damping:.12,drag:.008},broadleaf:{hz:.45,damping:.18,drag:.012},fruit:{hz:.7,damping:.18,drag:.012},round:{hz:.8,damping:.16,drag:.012},bush:{hz:1.5,damping:.25,drag:.015}};function im(e){return .36*(1-Math.exp(-(e*e)/676))}var am=.3,om=.7,sm=1/60,cm=.25,lm=256;function um(e,t){let n=Math.floor(e),r=e-n,i=r*r*(3-2*r),a=e=>{let n=Math.imul(e^t,739982445)^695872825;return n=Math.imul(n^n>>>15,2246822507),n^=n>>>13,(n>>>0)/4294967296*2-1};return a(n)+(a(n+1)-a(n))*i}var dm=class e{texture=e.makeTexture(1);trees=[];ids=new Map;state=new Float32Array;seeds=new Int32Array;time=null;placed=0;static makeTexture(e){let t=new Ai(new Float32Array(lm*e*4),lm,e,T,g);return t.needsUpdate=!0,t}add(t){let n=t.map(e=>{let t=`${e.x} ${e.z} ${e.kind}`,n=this.ids.get(t);return n===void 0&&(n=this.trees.length,this.ids.set(t,n),this.trees.push(e)),n}),r=this.trees.length;if(r>this.seeds.length){let t=new Float32Array(r*4);t.set(this.state),this.state=t,this.seeds=Int32Array.from(this.trees,e=>Math.imul(Math.round(e.x*97),2654435761)^Math.round(e.z*131));let n=Math.ceil(r/lm);if(n!==this.texture.image.height){let t=this.texture.image.data;this.texture.dispose(),this.texture=e.makeTexture(n),this.texture.image.data.set(t)}}return n}target(e,t,n,r,i){let a=this.trees[e],o=this.seeds[e],[s,c]=tm(n[0],n[1],n[2],a.x,a.z,6),l=s/lf,u=c/lf,d=Math.hypot(l,u);if(d<1e-4)return i[0]=i[1]=0,d;let f=l/d,p=u/d,m=am*r,h=e=>.75*um(t/om,o+e)+.5*um(t/(2.7*om),o+e+7),g=im(d*Math.max(0,1+m*h(0)))*a.height,_=im(d)*a.height*m*.6*h(3);return i[0]=f*g-p*_,i[1]=p*g+f*_,d}restart(){this.time=null}update(e,t,n){let r=this.trees.length;if(!r||!t)return;let i=this.time===null?-1:e-this.time;this.time=e;let a=this.state,o=[0,0],s=r=>{this.target(r,e,t,n,o),a.set([o[0],o[1],0,0],r*4)};if(i<0||i>1)for(let e=0;e<r;e++)s(e);else{for(let e=this.placed;e<r;e++)s(e);for(let r=0;r<this.placed&&i>0;r++){let s=this.trees[r],c=rm[s.kind],l=2*Math.PI*c.hz/Math.sqrt(s.scale),u=Math.ceil(i/Math.min(sm,cm/l)),d=i/u;for(let s=1;s<=u;s++){let u=this.target(r,e-i+s*d,t,n,o),f=2*Math.min(1,c.damping+c.drag*u)*l,p=a[r*4+2],m=a[r*4+3];p+=(l*l*(o[0]-a[r*4])-f*p)*d,m+=(l*l*(o[1]-a[r*4+1])-f*m)*d,a[r*4]+=p*d,a[r*4+1]+=m*d,a[r*4+2]=p,a[r*4+3]=m}}if(i===0&&this.placed===r)return}this.placed=r;let c=this.texture.image.data;for(let e=0;e<r;e++)c[e*4]=a[e*4],c[e*4+1]=a[e*4+1];this.texture.needsUpdate=!0}},fm=1.6,pm=new H(13150074),mm=[`debris`,`rain`],hm=class{canvas;gl;scene=new hi;view=new wu;shared=Kf();settings={lines:!0,shadows:!0,grain:.012,prepass:!0,waterScissor:!0,equalDepth:!0,falling:!0,fallingShare:1,shelterDebug:!1};width=1;height=1;screenRatio;pixelRatio;maxPixels=1/0;timer=null;output=null;gbuffer;shadowTarget;sunCamera=new So(-1,1,1,-1,.5,400);shadowCenter;shadowRadius;shadowFollow;post;postScene=new hi;postCamera=new So(-1,1,1,-1,0,1);materials=new Map;casters=[];silhouettes=new fi;twins=[];fields=new Map;underTarget;reflectTarget;look=null;seasonSet=null;dayNow=$l;seasonal=new Map;ownColours=new WeakMap;water=new Fd;waterMesh=null;wind=new gf;windField=new df;trees=new dm;windNow=null;dust=new nf;weather=new Pp;shelter;rain;rainShown=!0;cloudMap;skyMap;cloudShape=Tu;constructor(e,t={}){this.canvas=e,this.gl=new ql({canvas:e,antialias:!1,alpha:!1,preserveDrawingBuffer:!0}),this.gl.autoClear=!1,this.screenRatio=t.pixelRatio??Math.min(window.devicePixelRatio||1,2),this.pixelRatio=this.screenRatio;let n=t.samples??4;this.gbuffer=new Gt(1,1,{count:2,samples:n,type:_,format:T,depthBuffer:!0,minFilter:s,magFilter:s});let r=t.shadowMapSize??2048;this.shadowTarget=new Gt(r,r,{depthBuffer:!0}),this.shadowTarget.depthTexture=new va(r,r,h),this.shared.uShadowMap.value=this.shadowTarget.depthTexture,this.shared.uShadowTexel.value.set(1/r,1/r),this.shadowCenter=t.shadowCenter?.clone()??new R,this.shadowRadius=t.shadowRadius??30,this.shadowFollow=t.shadowFollow??!1;let i=()=>new Gt(1,1,{count:2,type:_,format:T,depthBuffer:!0,minFilter:s,magFilter:s});this.shelter=new Df(t.shelterSize??1024),this.rain=new Wf(this.shared,this.shelter.uniforms),this.scene.add(this.rain.mesh),this.cloudMap=new nd(this.shared),this.skyMap=new nd({uCloudMap:this.shared.uSkyMap,uCloudRect:this.shared.uSkyRect},$u.size),this.underTarget=i(),this.reflectTarget=i(),this.shared.uUnder.value=this.underTarget.textures[0],this.shared.uUnderAux.value=this.underTarget.textures[1],this.shared.uReflect.value=this.reflectTarget.textures[0],this.post=new ti({vertexShader:kp,fragmentShader:Ap,depthTest:!1,depthWrite:!1,uniforms:{tColor:{value:this.gbuffer.textures[0]},tAux:{value:this.gbuffer.textures[1]},uResolution:{value:new L(1,1)},uLineWidth:{value:1.5},uLines:{value:1},uTargetDepth:{value:120},uHazeColor:{value:new H},uHazeDensity:{value:.02},uHazeMax:{value:.4},uHazeFloor:{value:0},uSkyTop:{value:new H},uSkyBottom:{value:new H},uExposure:{value:1},uSaturation:{value:1},uNightShift:{value:0},uShadeHue:{value:0},uGrain:{value:.012},uCamPos:{value:new R},uCamRight:{value:new R},uCamUp:{value:new R},uCamFwd:{value:new R},uFogColor:{value:new H},uFog:{value:new B},tFogNoise:{value:bf()},uDust:{value:new R},uFogFrame:{value:new B(1,0,1,0)},uFogNext:{value:new B(1,0,1,0)},uFogFade:{value:0},uFogStreak:{value:new L},uWindSpeed:this.shared.uWindSpeed,uWindDir:this.shared.uWindDir,tWindA:this.shared.tWindA,tWindB:this.shared.tWindB,uWindBlend:this.shared.uWindBlend,uWindGrid:this.shared.uWindGrid,uWindOn:this.shared.uWindOn,uShimmer:{value:new L},tDustA:{value:this.dust.a},tDustB:{value:this.dust.b},uDustBlend:{value:0},uDustGrid:{value:this.dust.grid},uDustOn:{value:0},uDustColor:{value:new H},uDustReach:{value:4.5},...this.rain.veil}}),this.postScene.add(new Wr(new Da(2,2),this.post)),this.silhouettes.visible=!1,this.scene.add(this.silhouettes),this.add(vf(),`debris`,{castShadow:!1})}setWind(e,t,n){this.wind.set(e,t,n),this.windField.set(e,t,n);let r=this.weather;this.dust.storm=r.dust*yt.smoothstep(r.haze,0,.1)*Math.min(1,.5+r.haze/.5),this.dust.set(e,t,n),this.windNow=[e,t,n]}setDustSource(e){this.dust.setSource(e)}setWeather(e,t=!1){this.weather.set(e,t)}material(e){let t=this.materials.get(e);return t||(t={main:bp(e,this.shared),depth:Sp(e,this.shared),prepass:xp(e,this.shared),mirrorPrepass:xp(e,this.shared,!0)},e===`water`&&Object.assign(t.main.uniforms,this.shelter.uniforms,this.rain.uniforms),this.materials.set(e,t)),t.main}add(e,t,n={}){if(n.tile&&t!==`water`){let r=e.getAttribute(`color`),i=r&&this.ownColours.get(r),a=i&&Float32Array.from(r.array);i&&r.array.set(i);let o=xu(e,n.tile);a&&r.array.set(a);let s=o.map(e=>this.addOne(e,t,n,!0));return s[0].userData.tiles=s,s[0]}return this.addOne(e,t,n,!1)}addOne(e,t,n,r){let i=e.userData.trees,a=e.getAttribute(`aTreeId`);if(i?.length&&a){let t=this.trees.add(i),n=a.array;for(let e=0;e<n.length;e++)n[e]=t[n[e]];e.userData.trees=void 0}let o=n.seasonal??(t===`ground`||t===`grass`);o&&this.seasonal.set(e,(this.seasonal.get(e)??0)+1),this.turn(e);let s=new Wr(e,this.material(t));s.userData.seasonal=o,s.frustumCulled=r,s.userData.kind=t,s.userData.under=n.under??!1,s.userData.reflect=n.reflect??t!==`water`,s.userData.fields=n.fields,s.userData.cover=n.cover??(t===`ink`?`full`:t===`foliage`?`partial`:`none`),(s.userData.cover!==`none`||t===`ground`)&&this.shelter.changed(),t===`ground`&&(this.cloudArea=!1),this.scene.add(s),t===`ground`&&(this.setHazeGround(),this.land=null),(n.castShadow??t!==`water`)&&this.casters.push(s);let c=new Wr(e,this.materials.get(t).prepass);return c.frustumCulled=r,c.renderOrder=-1,c.matrixAutoUpdate=!1,c.matrixWorldAutoUpdate=!1,this.silhouettes.add(c),this.twins.push([s,c]),s}remove(e){let t=e.userData.tiles;if(t){for(let e of t)e.userData.tiles=void 0,this.remove(e);return}this.scene.remove(e),e.userData.seasonal&&this.unseason(e.geometry),this.casters=this.casters.filter(t=>t!==e);let n=this.twins.findIndex(([t])=>t===e);n>=0&&(this.silhouettes.remove(this.twins[n][1]),this.twins.splice(n,1)),(e.userData.cover!==`none`||e.userData.kind===`ground`)&&this.shelter.changed(),e.userData.kind===`ground`&&(this.setHazeGround(),this.cloudArea=!1,this.land=null)}setFields(e,t){let n=this.materials.get(e)?.main;if(this.fields.get(e)?.dispose(),this.fields.delete(e),!n)return!1;delete n.defines.FIELDS,delete n.defines.BASIS,n.needsUpdate=!0;let r=this.scene.children.filter(t=>t.userData.kind===e),i=this.scene.children.find(e=>e.userData.kind===`ground`&&e.userData.fields),a=i?.userData.fields;if(t<=0||!i||!a)return!1;let o=Math.cos(a.turn)/a.side,c=Math.sin(a.turn)/a.side,l=new z().set(o,-c,.5-o*a.x+c*a.z,c,o,.5-c*a.x-o*a.z,0,0,1),d={type:u,format:T,depthBuffer:!1,minFilter:s,magFilter:s,generateMipmaps:!1},f=new hi,p=(e,t=0)=>{this.gl.setRenderTarget(e,t),this.gl.setClearColor(8421504,1),this.gl.clear(!0,!1,!1),this.gl.render(f,this.postCamera)},m;if(e!==`ground`){let e=[...new Set(r.flatMap(e=>{let t=e.geometry.getAttribute(`aPaint`);return Array.from({length:t.count},(e,n)=>t.getY(n))}))];if(e.length===0||e.length>8)return!1;m=new qt(t,t,e.length*7,d);let i=new Wr(new Da(2,2));i.frustumCulled=!1,f.add(i);let a=l.clone().invert();e.forEach((e,t)=>{for(let n=0;n<7;n++){let r=Op(this.shared,a,e,n);i.material=r,p(m,t*7+n),r.dispose()}}),i.geometry.dispose(),n.uniforms.uBasis={value:m.texture},n.uniforms.uBasisScales={value:e},n.defines.BASIS=e.length}else{m=new Gt(t,t,d);let e=Tp(this.shared,l);for(let t of r.filter(e=>e.userData.fields)){let n=new Wr(t.geometry,e);n.frustumCulled=!1,t.updateMatrixWorld(),n.matrixWorld.copy(t.matrixWorld),n.matrixAutoUpdate=!1,n.matrixWorldAutoUpdate=!1,f.add(n)}p(m),e.dispose(),n.uniforms.uFields={value:m.texture},n.defines.FIELDS=1}return this.gl.setRenderTarget(null),this.fields.set(e,m),n.uniforms.uFieldsMap={value:l},!0}paintOver(e,t){for(let[n,r]of this.materials)r.main.depthWrite=!e,r.main.depthFunc=e&&t(n)?4:3}setVisible(e,t){if(e===`rain`)this.rainShown=t;else if(e===`water`)this.waterShown=t,this.waterMesh&&(this.waterMesh.visible=t&&this.water.any);else for(let n of this.scene.children)n.userData.kind===e&&n.visible!==t&&(n.visible=t,(n.userData.cover!==`none`||e===`ground`)&&this.shelter.changed())}setWater(e,t=Md){let n=this.water.geometry;this.water.set(e,this.shared.uTime.value,t);let r=this.shared;r.tWaterA.value=this.water.a,r.tWaterB.value=this.water.b,r.uWaterGrid.value.copy(this.water.grid),this.water.geometry===n&&this.waterMesh||(this.waterMesh&&this.remove(this.waterMesh),this.waterMesh=this.water.geometry?this.add(this.water.geometry,`water`):null),this.waterMesh&&(this.waterMesh.visible=this.water.any&&this.waterShown),this.setHazeGround()}waterShown=!0;setHazeGround(){let e=this.water.floor===null?1/0:this.water.floor-1;for(let t of this.scene.children){if(t.userData.kind!==`ground`)continue;let n=t.geometry;n.boundingBox||n.computeBoundingBox(),e=Math.min(e,n.boundingBox.min.y)}Number.isFinite(e)&&this.weather.setGround(e-.5)}resize(e,t){this.pixelRatio=Math.min(this.screenRatio,Math.sqrt(this.maxPixels/Math.max(1,e*t))),this.gl.setPixelRatio(this.pixelRatio),this.gl.setSize(e,t,!1),this.width=this.canvas.width,this.height=this.canvas.height,this.gbuffer.setSize(this.width,this.height);let n=Math.max(1,Math.round(this.width/2)),r=Math.max(1,Math.round(this.height/2));this.underTarget.setSize(n,r),this.reflectTarget.setSize(n,r),this.shared.uScreen.value.set(this.width,this.height),this.post.uniforms.uResolution.value.set(this.width,this.height)}setLook(e){this.look=e}setSeason(e){this.seasonSet=e&&{...e},this.dayNow=e?au(e):$l;for(let e of this.seasonal.keys())this.turn(e)}unseason(e){let t=this.seasonal.get(e);if(t===void 0)return;if(t>1){this.seasonal.set(e,t-1);return}this.seasonal.delete(e);let n=e.getAttribute(`color`),r=n&&this.ownColours.get(n);if(n&&r){for(let e of this.seasonal.keys())if(e.getAttribute(`color`)===n)return;n.array.set(r),n.needsUpdate=!0,this.ownColours.delete(n)}}turn(e){if(!this.seasonal.has(e))return;let t=e.getAttribute(`color`);if(!t)return;let n=cd(this.seasonSet),r=this.ownColours.get(t);(r||n.shift!==0||n.chroma!==1||n.light!==0)&&(r||this.ownColours.set(t,r=Float32Array.from(t.array)),fd(r,t.array,n),t.needsUpdate=!0)}get season(){return this.seasonSet&&{...this.seasonSet}}get day(){return this.dayNow}setHour(e){this.look=hd(yu(e,this.dayNow),this.seasonSet)}applyLook(e){let t=this.weather.overcast,n=gd,r=yt.smoothstep(e.sunEl,-8,6),i=r*yt.lerp(1,Ed,e.night),a=yt.lerp(t,wd(t),i),o=this.weather,s=e=>Hp(e,o,Fp),c=qp(o.sunUnder,e,t)*i,l=(t,n)=>Yp(t,e,Up,c*n),u=Od(e,t,n),d=s({...u,hazeColor:l(u,t).hazeColor}),f=s(l(Od(e,a,n),a)),p=s(l(Od(e,1,n),1)),m=this.shared,h=Jp(n,Up,c),g=Cd(a),_=g*h.shadowLift;m.uOvercast.value.set(g*h.sky,g*h.shadowFade,g*h.shadowBlur),m.uCloudOvercast.value.set(h.sky,yt.lerp(yt.lerp(Td,n.shadowFade,_),h.shadowFade,c),h.shadowBlur),m.uCloudStrength.value=i;let v=yt.degToRad(f.sunAz),y=yt.degToRad(Math.max(f.sunEl,4));m.uSunDir.value.set(Math.cos(v)*Math.cos(y),Math.sin(y),Math.sin(v)*Math.cos(y)).normalize(),this.shadowDir.copy(m.uSunDir.value),_>0&&this.shadowDir.lerp(new R(0,1,0),_).normalize(),m.uSunColor.value.copy(f.sunColor).lerp(f.skyColor,1-r),m.uCloudSunColor.value.copy(p.sunColor).lerp(p.skyColor,1-r),m.uSkyColor.value.copy(f.skyColor),m.uRimColor.value.copy(f.rimColor).multiplyScalar(r),m.uCloudRimColor.value.copy(p.rimColor).multiplyScalar(r);let b=yt.degToRad;m.uShadeHue.value=b(f.shadeHue),m.uShadeLean.value=f.shadeLean,m.uShadeDepth.value=f.shadeDepth,m.uLitHue.value=b(f.litHue),m.uLitLean.value=f.litLean,m.uLightExposure.value=f.exposure/d.exposure;let x=yt.lerp(Dd,1,a);m.uCloudBands.value.set(b((p.shadeHue-f.shadeHue+540)%360-180),p.shadeDepth,p.litLean,p.exposure*x/d.exposure);let S=this.post.uniforms;S.uHazeColor.value.copy(d.hazeColor),S.uHazeDensity.value=d.hazeDensity,S.uHazeMax.value=d.hazeMax,S.uHazeFloor.value=d.hazeFloor,S.uSkyTop.value.copy(d.skyTop),S.uSkyBottom.value.copy(d.skyBottom),m.uSkyTop.value.copy(d.skyTop),m.uSkyBottom.value.copy(d.skyBottom),m.uGapSkyTop.value.copy(f.skyTop),m.uGapSkyBottom.value.copy(f.skyBottom),m.uCloudBelly.value.copy(p.skyTop).lerp(p.skyBottom,.25),c>0&&m.uCloudBelly.value.multiplyScalar(s(Od(e,a,n)).exposure/f.exposure);let C=e.sunColor,w=new H(1,1,1).lerp(C.clone().multiplyScalar(1/Math.max(C.r,C.g,C.b,.001)),.85);m.uCloudLit.value.copy(f.skyBottom).lerp(w,.7*yt.lerp(.15,1,r)),m.uSkyClosed.value=a,S.uExposure.value=d.exposure,S.uSaturation.value=d.saturation,S.uNightShift.value=d.nightShift,S.uShadeHue.value=b(d.shadeHue),this.applyFog(),S.uShimmer.value.set(Vp(f,o.heat)*Fp.shimmer,this.shared.uTime.value),this.updateSunCamera()}applyFog(){let e=this.weather,t=this.wind,n=this.post.uniforms,r=this.shared;Cf(n.uFogColor.value,e.hazeColor,r.uSunColor.value,r.uSkyColor.value);let i=yt.lerp(1/(1+Math.max(0,t.speed-5)/20),1,e.dust),a=Math.max(e.hazeBase,this.water.floor??e.hazeTop-4);n.uFog.value.set(e.haze*i,e.hazeBase,e.hazeTop,Math.max(.5,.7*(e.hazeTop-a)));let o=t.haze,s=t.hazeNext??o;n.uFogFrame.value.set(o.hx,o.hz,o.stretch,o.drift),n.uFogNext.value.set(s.hx,s.hz,s.stretch,s.drift),n.uFogFade.value=t.hazeNext?t.hazeFade:0,n.uFogStreak.value.set(o.streak,s.streak),n.uDust.value.set(e.dust,.25+.5*Math.min(t.speed/25,1),fm);let c=this.dust;n.tDustA.value=c.a,n.tDustB.value=c.b,n.uDustBlend.value=c.blend,n.uDustOn.value=+!!c.any,n.uDustReach.value=c.look.top+.5,Cf(n.uDustColor.value,pm.clone().lerp(e.hazeColor,e.dust),r.uSunColor.value,r.uSkyColor.value),this.rain.setVeilColor((e,t)=>Cf(e,t,r.uSunColor.value,r.uSkyColor.value))}updateSunCamera(){let e=this.sunCamera,t=this.shared.uSunDir.value;if(e.up.set(-t.x,0,-t.z),e.up.lengthSq()<1e-6&&e.up.set(0,0,1),e.near=1,e.far=300,this.shadowFollow){let t=this.view.target,n=this.shadowDir;e.position.copy(n).multiplyScalar(n.dot(t)+150),e.lookAt(e.position.clone().sub(n)),e.updateMatrixWorld(),this.followView()}else{let t=this.shadowRadius;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.position.copy(this.shadowCenter).addScaledVector(this.shadowDir,150),e.lookAt(this.shadowCenter)}e.updateProjectionMatrix(),e.updateMatrixWorld();let n=new V().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);this.shared.uShadowMatrix.value.copy(n).multiply(e.projectionMatrix).multiply(e.matrixWorldInverse),this.shadowDirty=!0}shadowDirty=!0;followView(){let e=this.sunCamera,t=this.view.camera;t.updateMatrixWorld();let n=(this.land??=gm.from(this.scene))??gm.FLAT,r=e.matrixWorldInverse,i=new R(0,0,-1).transformDirection(t.matrixWorld),a=1/0,o=-1/0,s=1/0,c=-1/0,l=new R,u=new R,d=()=>{l.applyMatrix4(r),a=Math.min(a,l.x),o=Math.max(o,l.x),s=Math.min(s,l.y),c=Math.max(c,l.y)};for(let e=0;e<=8;e++)for(let r=0;r<=8;r++){u.set(yt.lerp(t.left,t.right,e/8),yt.lerp(t.bottom,t.top,r/8),0).applyMatrix4(t.matrixWorld);let a=n.trace(u,i);l.copy(u).addScaledVector(i,a),d(),l.copy(u).addScaledVector(i,a+gm.TALL/i.y),d()}let f=(e,t)=>t>e||t<e-16?Math.ceil(t/8)*8:e,p=this.shadowSize[0]=f(this.shadowSize[0],o-a+6),m=this.shadowSize[1]=f(this.shadowSize[1],c-s+6),h=p/this.shadowTarget.width,g=m/this.shadowTarget.height;e.left=Math.round(((a+o)/2-p/2)/h)*h,e.right=e.left+p,e.bottom=Math.round(((s+c)/2-m/2)/g)*g,e.top=e.bottom+m}land=null;shadowSize=[0,0];shadowDir=new R(0,1,0);drawOnly(e,t,n){let r=[];for(let e of this.scene.children)e.visible&&!t(e)&&(e.visible=!1,r.push(e));e.scissorTest=n!==null,n&&e.scissor.copy(n),this.gl.setRenderTarget(e),this.gl.clear(!0,!0,!1),this.gl.render(this.scene,this.view.camera);for(let e of r)e.visible=!0}mirrorShift(){let e=this.water,t=2*Math.max(e.wetHigh-e.mirror,e.mirror-e.shownLow,0),n=this.view.camera,r=new V().multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).elements;return new L(r[4]*t*.5,r[5]*t*.5)}waterBox=new Uo;corner=new R;waterOnScreen(){let e=this.waterBox.makeEmpty(),t=this.corner;for(let n of this.scene.children){if(!n.visible||n.userData.kind!==`water`)continue;let r=n;r.geometry.boundingBox||r.geometry.computeBoundingBox();let i=r.geometry.boundingBox;for(let n=0;n<8;n++)t.set(n&1?i.max.x:i.min.x,n&2?i.max.y:i.min.y,n&4?i.max.z:i.min.z),t.applyMatrix4(r.matrixWorld).project(this.view.camera),e.expandByPoint(new L(t.x,t.y))}return e.isEmpty()||e.max.x<-1||e.min.x>1||e.max.y<-1||e.min.y>1?null:e}waterRect(e,t,n,r,i=new L){if(!this.settings.waterScissor)return null;let a=t.width,o=t.height,s=n+Math.abs(i.x)+r/this.width,c=n+Math.abs(i.y)+r/this.height,l=Math.max(0,Math.floor(((e.min.x+1)/2-s)*a)-2),u=Math.max(0,Math.floor(((e.min.y+1)/2-c)*o)-2),d=Math.min(a,Math.ceil(((e.max.x+1)/2+s)*a)+2),f=Math.min(o,Math.ceil(((e.max.y+1)/2+c)*o)+2);return new B(l,u,d-l,f-u)}drawShelter(){let e=this.scene.children.filter(e=>e.isMesh&&e.userData.cover!==void 0).map(e=>({mesh:e,cover:e.userData.kind===`ground`?`land`:e.userData.cover,depth:this.materials.get(e.userData.kind).depth})),t=this.scene.children.find(e=>e.userData.kind===`ground`&&e.userData.fields),n=this.shared;this.shelter.draw(this.gl,this.scene,e,t?.userData.fields??null,()=>{let e=[n.uTime.value,n.uWindSpeed.value,n.uWindOn.value,n.uWindFlutter.value,n.uWindDir.value.clone(),n.uWindDrift.value.clone(),n.uViewBack.value.clone()];return n.uTime.value=0,n.uWindSpeed.value=0,n.uWindOn.value=0,n.uWindFlutter.value=0,n.uWindDir.value.set(1,0),n.uWindDrift.value.set(0,0),n.uViewBack.value.set(0,1,0),()=>{[n.uTime.value,n.uWindSpeed.value,n.uWindOn.value,n.uWindFlutter.value]=e,n.uWindDir.value.copy(e[4]),n.uWindDrift.value.copy(e[5]),n.uViewBack.value.copy(e[6])}})}drawClouds(){if(!this.cloudArea){let e=this.scene.children.find(e=>e.userData.kind===`ground`&&e.userData.fields)?.userData.fields,t=e?e.side/2*(Math.abs(Math.cos(e.turn))+Math.abs(Math.sin(e.turn)))+2:64;this.cloudMap.setArea((e?.x??0)-t,(e?.z??0)-t,2*t),this.shared.uLandSquare.value.set(e?.x??0,e?.z??0,e?e.side/2:0,e?.turn??0);let n=t+$u.height/$u.rise;this.skyMap.setArea((e?.x??0)-n,(e?.z??0)-n,2*n),this.cloudArea=!!e}this.cloudMap.draw(this.gl,this.weather.clouds,this.cloudShape),this.skyMap.draw(this.gl,this.weather.clouds,this.cloudShape)}cloudArea=!1;windNowVector=new L;render(e){if(!this.look)throw Error(`setHour (or setLook) before render`);let t=this.timer;t?.mark(`setup`,!1);let n=this.shared,r=this.wind;n.uTime.value=e,r.carried=this.weather.dust,r.update(e),n.uWindDir.value.set(r.dirX,r.dirZ),n.uWindSpeed.value=r.speed,n.uWindDrift.value.set(r.driftX,r.driftZ);let i=this.windField;n.tWindA.value=i.a,n.tWindB.value=i.b,n.tWindUsual.value=i.usual,n.uWindBlend.value=i.blend,n.uWindGrid.value.copy(i.grid),this.trees.update(e,this.windNow,r.gust),n.tTreePose.value=this.trees.texture,n.uWindFlutter.value=r.flutter,this.weather.update(e),n.uWaterBlend.value=this.water.blend(e),this.water.settle(e)&&this.waterMesh&&(this.waterMesh.visible=!1),n.uMirrorY.value=this.water.mirror,n.uWaterHigh.value=this.water.any?this.water.wetHigh:-1e6,this.applyLook(this.look);let a=[];if(!this.settings.falling)for(let e of this.scene.children)e.visible&&mm.includes(e.userData.kind)&&(e.visible=!1,a.push(e));let o=this.screenRatio/this.pixelRatio;this.view.apply(this.width*o,this.height*o),n.uViewBack.value.copy(this.view.backward()),n.uViewTarget.value.copy(this.view.target),this.shadowFollow&&this.updateSunCamera();let s=this.view.camera,c=this.post.uniforms;c.uCamPos.value.copy(s.position),c.uCamRight.value.setFromMatrixColumn(s.matrixWorld,0).multiplyScalar(s.right),c.uCamUp.value.setFromMatrixColumn(s.matrixWorld,1).multiplyScalar(s.top),c.uCamFwd.value.setFromMatrixColumn(s.matrixWorld,2).negate(),this.rain.update(e,this.weather.rain,this.view.zoom,this.pixelRatio/this.screenRatio,this.settings.fallingShare,this.settings.falling&&this.rainShown,this.windNowVector.copy(n.uWindDir.value).multiplyScalar(n.uWindSpeed.value),s,this.view.target.y),this.scene.updateMatrixWorld();for(let[e,t]of this.twins)t.matrixWorld.copy(e.matrixWorld);let l=this.gl;if(t?.mark(`shelter`,this.shelter.dirty),this.shelter.dirty&&this.drawShelter(),t?.mark(`clouds`),this.drawClouds(),t?.mark(`shadow`),l.setRenderTarget(this.shadowTarget),l.clear(!1,!0,!1),this.settings.shadows){let e=new Map,t=[];for(let e of this.scene.children)!this.casters.includes(e)&&e.visible&&(e.visible=!1,t.push(e));for(let t of this.casters)e.set(t,t.material),t.material=this.materials.get(t.userData.kind).depth;l.render(this.scene,this.sunCamera);for(let[t,n]of e)t.material=n;for(let e of t)e.visible=!0}this.shadowDirty=!1,t?.mark(`under`),l.setClearColor(0,0);let u=this.waterOnScreen(),d=(sp.ripple+sp.chop*sp.chopMax)*1.1;u&&this.drawOnly(this.underTarget,e=>e.userData.under,this.waterRect(u,this.underTarget,d,0)),t?.mark(`reflect`);let f=this.settings.prepass;if(u){if(this.shared.uMirror.value=1,this.silhouettes.visible=f,f)for(let[e,t]of this.twins)t.visible=e.visible&&e.userData.reflect,t.material=this.materials.get(e.userData.kind).mirrorPrepass;this.paintOver(f,()=>!1);let e=[...this.materials.values()].flatMap(e=>[e.main,e.mirrorPrepass]).filter(e=>e.side===0);for(let t of e)t.side=1;let t=this.waterRect(u,this.reflectTarget,d*sp.reflectNudge,sp.blurPx,this.mirrorShift());this.drawOnly(this.reflectTarget,e=>e.userData.reflect||e===this.silhouettes,t);for(let t of e)t.side=0;this.shared.uMirror.value=0}if(t?.mark(`main`),l.setRenderTarget(this.gbuffer),l.clear(!0,!0,!1),this.silhouettes.visible=f,f)for(let[e,t]of this.twins)t.visible=e.visible,t.material=this.materials.get(e.userData.kind).prepass;this.paintOver(f,e=>this.settings.equalDepth&&e===`foliage`),l.render(this.scene,this.view.camera),this.silhouettes.visible=!1,this.paintOver(!1,()=>!1),t?.mark(`post`),l.setRenderTarget(this.output);let p=this.post.uniforms;p.uLines.value=+!!this.settings.lines,p.uGrain.value=this.settings.grain,p.uLineWidth.value=yt.clamp(.6+this.view.zoom/48,.8,2.2)*this.pixelRatio*.75,l.render(this.postScene,this.postCamera),this.settings.shelterDebug&&this.shelter.drawOverlay(l,this.gbuffer.textures[1],this.view.camera,this.width,this.height);for(let e of a)e.visible=!0;t?.endFrame()}},gm=class e{x0;z0;nx;nz;max;lo;hi;static TALL=16;static CELL=2;static FLAT=new e(0,0,0,0,new Float32Array,0,0);constructor(e,t,n,r,i,a,o){this.x0=e,this.z0=t,this.nx=n,this.nz=r,this.max=i,this.lo=a,this.hi=o}static from(t){let n=new Yt,r=t.children.filter(e=>e.userData.kind===`ground`&&e.isMesh);for(let e of r)n.expandByObject(e);if(n.isEmpty())return null;let i=e.CELL,a=Math.ceil((n.max.x-n.min.x)/i)+1,o=Math.ceil((n.max.z-n.min.z)/i)+1,s=new Float32Array(a*o).fill(n.min.y),c=new R;for(let e of r){let t=e.geometry.getAttribute(`position`);for(let r=0;r<t.count;r++){c.fromBufferAttribute(t,r).applyMatrix4(e.matrixWorld);let o=Math.floor((c.z-n.min.z)/i)*a+Math.floor((c.x-n.min.x)/i);c.y>s[o]&&(s[o]=c.y)}}return new e(n.min.x,n.min.z,a,o,s,n.min.y,n.max.y)}at(t,n){let r=e.CELL,i=Math.floor((t-this.x0)/r),a=Math.floor((n-this.z0)/r),o=-1/0;for(let e=-1;e<=0;e++)for(let t=-1;t<=0;t++){let n=i+t,r=a+e;n>=0&&r>=0&&n<this.nx&&r<this.nz&&(o=Math.max(o,this.max[r*this.nx+n]))}return o===-1/0?0:o}trace(e,t){if(this.nx===0)return-e.y/t.y;let n=Math.max(0,(this.hi-e.y)/t.y),r=(this.lo-e.y)/t.y;for(;n<r;n+=1){let r=e.x+t.x*n,i=e.y+t.y*n,a=e.z+t.z*n;if(i<=this.at(r,a))return n}return r}},_m=[0,1,0,0],G=class{kind;pos=[];nrm=[];col=[];paint=[];uv=[];extra=[];index=[];tree;treeId;trees=[];extraName;extraSize;constructor(e){this.kind=e,this.extraName=e===`foliage`?`aCard`:e===`grass`?`aBlade`:null,this.extraSize=e===`foliage`||e===`grass`?4:0,this.tree=e===`paint`||e===`foliage`?[]:null,this.treeId=this.tree?[]:null}get vertexCount(){return this.pos.length/3}vertex(e,t,n,r,i=[0,0],a=[]){this.pos.push(e.x,e.y,e.z),this.nrm.push(t.x,t.y,t.z),this.col.push(n.r,n.g,n.b),this.paint.push(...r),this.uv.push(...i);for(let e=0;e<this.extraSize;e++)this.extra.push(a[e]??0);return this.tree?.push(0,0,0,0),this.treeId?.push(0),this.vertexCount-1}markTree(e,t,n){if(!this.tree||!this.treeId)throw Error(`a ${this.kind} mesh has no trees`);let r=this.trees.push(t)-1;for(let i=e;i<this.vertexCount;i++)this.tree.splice(i*4,4,t.x,t.z,t.height,n(this.pos[i*3+1])),this.treeId[i]=r}heightsSince(e){let t=[];for(let n=e;n<this.vertexCount;n++)t.push(this.pos[n*3+1]);return t}tri(e,t,n){this.index.push(e,t,n)}quad(e,t,n,r){this.index.push(e,t,n,e,n,r)}addGeometry(e,t,n,r){let i=(e.index,e),a=i.getAttribute(`position`),o=i.getAttribute(`normal`),s=i.getAttribute(`uv`),c=new z().getNormalMatrix(t),l=new R,u=new R,d=this.vertexCount;for(let e=0;e<a.count;e++)l.fromBufferAttribute(a,e).applyMatrix4(t),u.fromBufferAttribute(o,e).applyMatrix3(c).normalize(),this.vertex(l,u,n,r,s?[s.getX(e),s.getY(e)]:[0,0]);if(i.index)for(let e=0;e<i.index.count;e++)this.index.push(d+i.index.getX(e));else for(let e=0;e<a.count;e++)this.index.push(d+e)}build(){let e=new Mr;return e.setAttribute(`position`,new wr(this.pos,3)),e.setAttribute(`normal`,new wr(this.nrm,3)),e.setAttribute(`color`,new wr(this.col,3)),e.setAttribute(`aPaint`,new wr(this.paint,4)),e.setAttribute(`uv`,new wr(this.uv,2)),this.extraName&&e.setAttribute(this.extraName,new wr(this.extra,this.extraSize)),this.tree&&e.setAttribute(`aTree`,new wr(this.tree,4)),this.treeId&&(e.setAttribute(`aTreeId`,new wr(this.treeId,1)),e.userData.trees=this.trees),this.vertexCount>65535?e.setIndex(new Cr(this.index,1)):e.setIndex(this.index),e}};function vm(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var ym=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]],bm=(()=>{let e=vm(1337),t=Array.from({length:256},(e,t)=>t);for(let n=255;n>0;n--){let r=Math.floor(e()*(n+1));[t[n],t[r]]=[t[r],t[n]]}return[...t,...t]})();function xm(e,t){let n=.5*(Math.sqrt(3)-1),r=(3-Math.sqrt(3))/6,i=(e+t)*n,a=Math.floor(e+i),o=Math.floor(t+i),s=(a+o)*r,c=e-(a-s),l=t-(o-s),[u,d]=c>l?[1,0]:[0,1],f=c-u+r,p=l-d+r,m=c-1+2*r,h=l-1+2*r,g=a&255,_=o&255,v=(e,t,n)=>{let r=.5-e*e-t*t;if(r<0)return 0;let i=ym[n%8];return r*=r,r*r*(i[0]*e+i[1]*t)};return 70*(v(c,l,bm[g+bm[_]])+v(f,p,bm[g+u+bm[_+d]])+v(m,h,bm[g+1+bm[_+1]]))}var K=e=>new H(e);function Sm(e,t=1e-4){t=Math.max(t,2**-52);let n={},r=e.getIndex(),i=e.getAttribute(`position`),a=r?r.count:i.count,o=0,s=Object.keys(e.attributes),c={},l={},u=[],d=[`getX`,`getY`,`getZ`,`getW`],f=[`setX`,`setY`,`setZ`,`setW`];for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.attributes[n];c[n]=new r.constructor(new r.array.constructor(r.count*r.itemSize),r.itemSize,r.normalized);let i=e.morphAttributes[n];i&&(l[n]||(l[n]=[]),i.forEach((e,t)=>{let r=new e.array.constructor(e.count*e.itemSize);l[n][t]=new e.constructor(r,e.itemSize,e.normalized)}))}let p=t*.5,m=10**Math.log10(1/t),h=p*m;for(let t=0;t<a;t++){let i=r?r.getX(t):t,a=``;for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),o=r.itemSize;for(let e=0;e<o;e++)a+=`${~~(r[d[e]](i)*m+h)},`}if(a in n)u.push(n[a]);else{for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),a=e.morphAttributes[n],u=r.itemSize,p=c[n],m=l[n];for(let e=0;e<u;e++){let t=d[e],n=f[e];if(p[n](o,r[t](i)),a)for(let e=0,r=a.length;e<r;e++)m[e][n](o,a[e][t](i))}}n[a]=o,u.push(o),o++}}let g=e.clone();for(let t in e.attributes){let e=c[t];if(g.setAttribute(t,new e.constructor(e.array.slice(0,o*e.itemSize),e.itemSize,e.normalized)),t in l)for(let e=0;e<l[t].length;e++){let n=l[t][e];g.morphAttributes[t][e]=new n.constructor(n.array.slice(0,o*n.itemSize),n.itemSize,n.normalized)}}return g.setIndex(u),g}function Cm(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`);let a=e.clone();return a.setIndex(i),a.clearGroups(),a}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}var q={lime:K(10929242),meadow:K(6987850),emerald:K(4229210),teal:K(3899502),moss:K(5210176),mud:K(6967864),bed:K(10126944),water:K(2911860),stone:K(10129796),reed:K(7309882),soil:K(9066036),timber:K(12947285),ceramic:K(15656658),brass:K(12618312),glass:K(1920928),bark:K(7227966),leaf:K(5151290),leafLight:K(9225290),fruitLeaf:K(5939262),cypress:K(3107394),fruit:K(15755820),wheatRoot:K(9083450),wheatTip:K(15778906),dirt:K(13084538),rut:K(10782304),wheat:K(16043854),wheatDeep:K(14457908),fence:K(12100746),crate:K(11565642),apple:K(14172204),deepLeaf:K(3108932)},J=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)};function wm(e){let t=.25;return{height:e,normal:(n,r)=>new R(e(n-t,r)-e(n+t,r),2*t,e(n,r-t)-e(n,r+t)).normalize()}}function Tm(e,t,n,r,i,a,o){let s=e.vertex(t,n,r,o,[0,0],[-1,-1,i,a]);e.vertex(t,n,r,o,[0,0],[1,-1,i,a]),e.vertex(t,n,r,o,[0,0],[1,1,i,a]),e.vertex(t,n,r,o,[0,0],[-1,1,i,a]),e.quad(s,s+1,s+2,s+3)}function Em(e){let t=e.scale??1,n=e.kind===`bush`||e.kind===`cypress`,r=(e.kind===`cypress`||e.kind===`bush`||e.kind===`round`?.8:2.2)*t;return{circle:{x:e.x,z:e.z,radius:r},drag:n?Xp.crown:Xp.crown/2}}function Dm(e,t,n,r,i){let a=r.scale??1,o=n.height(r.x,r.z)-.05,s=new R(r.x,o,r.z),c=e.vertexCount,l=t.vertexCount,u=r.kind===`cypress`,d=r.kind===`bush`,f=r.kind===`round`,p=[.4,2.5,1.57,0],m=(u?1.2:d?.25:f?.9:1.45)*a,h=(u?.16:d?.06:f?.1:.2)*Math.sqrt(a),g=new ba(h*.65,h,m+.4*a,9,5);e.addGeometry(g,new V().makeTranslation(r.x,o+(m+.4*a)/2,r.z),q.bark,p);let _=(t,n,r,i)=>{let o=new ba(i*Math.sqrt(a),r*Math.sqrt(a),t.distanceTo(n),6,3),s=new bt().setFromUnitVectors(new R(0,1,0),n.clone().sub(t).normalize());e.addGeometry(o,new V().compose(t.clone().lerp(n,.5),s,new R(1,1,1)),q.bark,p)},v=[],y=e=>new R(0,e,0);if(d){let e=2+ +(i()<.5),t=i()*Math.PI;for(let n=0;n<e;n++){let r=t+n/e*Math.PI*2,o=new R(Math.cos(r),0,Math.sin(r)).multiplyScalar(.25*a);v.push({c:s.clone().add(o).add(y((.6+i()*.2)*a)),r:(.45+i()*.12)*a,tone:i()})}}else if(f){if(v.push({c:s.clone().add(y(m+.55*a)),r:(.62+i()*.12)*a,tone:i()}),i()<.6){let e=i()*Math.PI*2;v.push({c:s.clone().add(new R(Math.cos(e)*.3*a,m+.75*a,Math.sin(e)*.3*a)),r:.42*a,tone:i()})}}else if(!u){let e=s.clone().add(y(m*.85)),t=3+ +(i()<.6),n=i()*Math.PI*2;for(let r=0;r<t;r++){let o=n+r/t*Math.PI*2+(i()-.5)*1,s=.6+i()*.45,c=(1.2+i()*1)*a,l=new R(Math.sin(s)*Math.cos(o),Math.cos(s),Math.sin(s)*Math.sin(o)),u=e.clone().addScaledVector(l,c);if(_(e,u,.1,.05),v.push({c:u.clone().addScaledVector(l,.25*a).add(y(.3*a)),r:(.75+i()*.45)*a,tone:i()}),i()<.55){let t=new R(-l.z,0,l.x).multiplyScalar((i()<.5?.5:-.5)*a);v.push({c:e.clone().addScaledVector(l,c*.5).add(t).add(y(.15*a)),r:(.45+i()*.2)*a,tone:i()})}}let r=e.clone().add(new R((i()-.5)*.4*a,(1.5+i()*.4)*a,(i()-.5)*.4*a));_(e,r,.09,.04),v.push({c:r.clone().add(y(.35*a)),r:(.7+i()*.25)*a,tone:i()})}let b=v.reduce((e,t)=>e.addScaledVector(t.c,1/v.length),new R),x=new R(1,1.2,1),S=r.leaf??(u?q.cypress:r.kind===`fruit`||d?q.fruitLeaf:q.leaf),C=a**.45,w=(e,t,n)=>{let r=J(-.1,.9,t.y),a=e.clone().offsetHSL(-.03*r,.05*r,.09*r);return a.multiplyScalar(1-n*.42),a.offsetHSL((i()-.5)*.012,(i()-.5)*.04,(i()-.5)*.02)};if(u){let e=5.4*a,n=5+Math.floor(i()*3),r=i()*Math.PI*2,o=e=>(.3+.75*Math.sin(Math.min(1,.22+e*2.6)*Math.PI/2)*(1-e*.86))*a,c=Math.round(420*a*a/C);for(let l=0;l<c;l++){let c=i()**.85,l=i()*Math.PI*2,u=.86+.2*Math.max(0,Math.cos((l-r)*n*.5))**2+(i()-.5)*.1,d=i()<.2?.5+i()*.4:0,f=o(c)*u*(1-d*.6),p=s.clone().add(new R(Math.cos(l)*f,1*a+c*e,Math.sin(l)*f)),m=new R(Math.cos(l),.25+c*.9,Math.sin(l)).normalize(),h=(d?.4+i()*.2:.17+i()*.13)*C;Tm(t,p,m,w(S,m,d),h,i(),[.7,.32+i()*.14,Math.PI/2,.35])}}for(let e of v){let n=S.clone().offsetHSL((e.tone-.5)*.03,0,(e.tone-.5)*.04),r=e.r/C;for(let a of[{count:14,depth:[.35,.3],size:[.5,.25],inner:1},{count:78,depth:[.68,.32],size:[.32,.22],inner:0},{count:34,depth:[1,.13],size:[.13,.09],inner:0}])for(let o=0,s=Math.round(a.count*r*r);o<s;o++){let r=i()*2-1,o=i()*Math.PI*2,s=Math.sqrt(1-r*r),c=new R(s*Math.cos(o)*1.12,r<0?r*.55:r,s*Math.sin(o)*1.12),l=a.depth[0]+i()*a.depth[1],u=e.c.clone().addScaledVector(c,e.r*l),d=u.clone().sub(b).multiply(x).normalize().multiplyScalar(.55).addScaledVector(c.clone().normalize(),.45).normalize(),f=a.inner?1:Math.max(0,(.85-l)/.25)*.5+(r<-.25?.4:0),p=(a.size[0]+i()*a.size[1])*C;Tm(t,u,d,w(n,d,Math.min(f,1)),p,i(),[.7,.45+i()*.35,-1,.7])}}let T=r.fruit??(r.kind===`fruit`?q.fruit:null);if(T){let e=Math.round(26*(r.fruitDensity??1)*v.reduce((e,t)=>e+t.r*t.r,0)/3);for(let n=0;n<e;n++){let e=v[Math.floor(i()*v.length)],n=i()*.9-.2,r=i()*Math.PI*2,a=Math.sqrt(1-n*n),o=new R(a*Math.cos(r),n,a*Math.sin(r));Tm(t,e.c.clone().addScaledVector(o,e.r*1),o,T.clone().offsetHSL((i()-.5)*.04,0,(i()-.5)*.08),(.1+i()*.04)*Math.min(1.2,C),i(),[.2,1,-1,.5])}}let E=t.heightsSince(l).sort((e,t)=>e-t),D=Math.max(E[E.length-1],...e.heightsSince(c))-o,O=Math.max(E[Math.floor(E.length*.1)]-o,D*.2),k=nm[r.kind],A=e=>{let t=Math.max(e-o,0);return Math.min(t/O,1)**2*(1-k)+Math.min(t/D,1)**2*k},ee={x:r.x,z:r.z,height:D,kind:r.kind,scale:a};e.markTree(c,ee,A),t.markTree(l,ee,A)}function Om(e,t,n,r,i,a,o,s=-1/0,c){let l=Sm(new Ea(1,2).deleteAttribute(`normal`).deleteAttribute(`uv`)),u=l.getAttribute(`position`),d=o()*100,f=.5+o()*.25,p=o()*Math.PI,m=new R,h=new R(0,1,0),g=new R(1.15,f,.9);for(let e=0;e<u.count;e++){m.fromBufferAttribute(u,e);let t=1+xm(m.x*1.3+d,m.z*1.3+m.y)*.18;m.multiplyScalar(t).multiply(g).applyAxisAngle(h,p),u.setXYZ(e,m.x,m.y,m.z)}l.computeVertexNormals();let _=(c??t.height(n,r))+i*f*(1-2*a),v=new V().compose(new R(n,_,r),new bt,new R(i,i,i)),y=l.getAttribute(`normal`),b=new R,x=new R,S=q.stone.clone().offsetHSL((o()-.5)*.04,(o()-.5)*.1,(o()-.5)*.12),C=e.vertexCount;for(let t=0;t<u.count;t++){b.fromBufferAttribute(u,t).applyMatrix4(v),x.fromBufferAttribute(y,t);let n=_>s+.05?Math.max(0,x.y-.35)*1.2:0;e.vertex(b,x,S.clone().lerp(q.moss,Math.min(n,.8)),[.6,3,.8,0])}let w=l.getIndex();for(let t=0;t<w.count;t+=3)e.tri(C+w.getX(t),C+w.getX(t+1),C+w.getX(t+2))}function km(e,t,n,r,i,a,o){let s=t.height(n,r),c=t.normal(n,r),l=a.clone().lerp(q.teal,.35).multiplyScalar(.82),u=a.clone().lerp(q.lime,.1),d=l.clone().lerp(u,.55),f=4+Math.floor(o()*4),p=[.8,.85,.8,.6];for(let t=0;t<f;t++){let t=o()*Math.PI*2,a=i*(.6+o()*.6),f=.035+o()*.02,m=.25+o()*.45,h=o(),g=Math.cos(t),_=Math.sin(t),v=-_*f,y=g*f,b=Math.atan2(g,-_),x=n+g*.04,S=r+_*.04,C=e.vertex({x:x-v,y:s-.02,z:S-y},c,l,p,[0,0],[0,h,-f,b]),w=e.vertex({x:x+v,y:s-.02,z:S+y},c,l,p,[0,0],[0,h,f,b]),T=x+g*m*a*.4,E=S+_*m*a*.4,D=s+a*.55,O=e.vertex({x:T+v*.7,y:D,z:E+y*.7},c,d,p,[0,0],[.55,h,f*.7,b]),k=e.vertex({x:T-v*.7,y:D,z:E-y*.7},c,d,p,[0,0],[.55,h,-f*.7,b]),A=e.vertex({x:x+g*m*a,y:s+a,z:S+_*m*a},c,u,p,[0,0],[1,h]);e.quad(C,w,O,k),e.tri(k,O,A)}}function Am(e,t,n,r,i){let a=8+Math.floor(i()*10),o=.5+i()*.45,s=[.6,.85,1.4,.5];for(let c=0;c<a;c++){let a=n+(i()-.5)*.45,c=r+(i()-.5)*.45,l=t.height(a,c)-.03,u=t.normal(a,c),d=i()*Math.PI,f=.018+i()*.012,p=o*(.6+i()*.5),m=Math.cos(d)*f,h=Math.sin(d)*f,g=(i()-.5)*.25,_=i(),v=q.reed.clone().lerp(q.teal,.4).multiplyScalar(.75),y=q.reed.clone().lerp(q.lime,.25*i()),b=e.vertex({x:a-m,y:l,z:c-h},u,v,s,[0,0],[0,_,-f,d]),x=e.vertex({x:a+m,y:l,z:c+h},u,v,s,[0,0],[0,_,f,d]),S=e.vertex({x:a+g*p,y:l+p,z:c+g*p*.5},u,y,s,[0,0],[1,_]);e.tri(b,x,S)}}function jm(e,t,n,r,i,a,o,s,c,l,u){for(let u=0;u<c;u++){let c=l()*Math.PI*2,u=Math.sqrt(l()),d=Math.sqrt(1-u*u)*(.6+l()*.4),f=new R(Math.cos(c)*d,u+.2,Math.sin(c)*d).normalize();Tm(e,new R(t+Math.cos(c)*d*i,n+u*a*.85,r+Math.sin(c)*d*i),f,s.clone().lerp(o,J(.1,.7,u)).offsetHSL((l()-.5)*.015,0,(l()-.5)*.05),(.1+l()*.07)*Math.max(.6,i/.35),l(),[.6,.6+l()*.3,-1,.6])}if(u)for(let o=0;o<4;o++){let o=l()*Math.PI*2,s=.3+l()*.55;Tm(e,new R(t+Math.cos(o)*i*.9,n+s*a,r+Math.sin(o)*i*.9),new R(Math.cos(o),.4,Math.sin(o)).normalize(),u.clone().offsetHSL((l()-.5)*.03,0,(l()-.5)*.08),.06+l()*.02,l(),[.2,1,-1,.5])}}function Mm(e,t,n,r,i,a,o,s){for(let c=0;c<a;c++){let a=n+(o()-.5)*2.4,c=r+(o()-.5)*2.4;s(a,c)&&Tm(e,new R(a,t.height(a,c)+.18+o()*.22,c),new R(0,1,0),i.clone().offsetHSL(0,0,(o()-.5)*.08),.055+o()*.035,o(),[.2,1,-1,.3])}}var Nm=class e{points=[];length;grid=null;static REACH=24;gridX=0;gridMin=0;gridCell=.35;gridN=0;gridNx=0;constructor(e,t=.5){let n=new Ta(e.map(([e,t])=>new L(e,t))),r=n.getLength(),i=Math.max(2,Math.ceil(r/t));for(let e of n.getSpacedPoints(i))this.points.push(e);this.length=r}near(e,t){let n=1/0,r=0,i=1,a=0,o=1,s=0,c=this.points;for(let l=0;l<c.length-1;l++){let u=c[l],d=c[l+1],f=d.x-u.x,p=d.y-u.y,m=f*f+p*p,h=Math.sqrt(m),g=Math.min(1,Math.max(0,((e-u.x)*f+(t-u.y)*p)/m)),_=u.x+f*g-e,v=u.y+p*g-t,y=_*_+v*v;y<n&&(n=y,r=s+g*h,i=f/h,a=p/h,o=f*(t-u.y)-p*(e-u.x)<0?1:-1),s+=h}return{distance:Math.sqrt(n),along:r,dx:i,dz:a,side:o}}distance(t,n,r=e.REACH){if(!this.grid){let e=1/0,t=1/0,n=-1/0,i=-1/0;for(let r of this.points)e=Math.min(e,r.x),n=Math.max(n,r.x),t=Math.min(t,r.y),i=Math.max(i,r.y);let a=this.gridCell;this.gridX=Math.floor((e-r)/a)*a,this.gridMin=Math.floor((t-r)/a)*a,this.gridNx=Math.ceil((n+r-this.gridX)/a)+1,this.gridN=Math.ceil((i+r-this.gridMin)/a)+1;let o=this.gridNx,s=this.gridN,c=new Float32Array(o*s);for(let e=0;e<s;e++)for(let t=0;t<o;t++)c[e*o+t]=this.near(this.gridX+t*a,this.gridMin+e*a).distance;this.grid=c}let i=this.gridNx,a=(t-this.gridX)/this.gridCell,o=(n-this.gridMin)/this.gridCell;if(a<0||o<0||a>=i-1||o>=this.gridN-1){let e=Math.max(0,-a,a-(i-1))*this.gridCell,t=Math.max(0,-o,o-(this.gridN-1))*this.gridCell;return r+Math.hypot(e,t)}let s=Math.floor(a),c=Math.floor(o),l=a-s,u=o-c,d=this.grid,f=d[c*i+s],p=d[c*i+s+1],m=d[(c+1)*i+s],h=d[(c+1)*i+s+1];return(f*(1-l)+p*l)*(1-u)+(m*(1-l)+h*l)*u}at(e){let t=this.points,n=0;for(let r=0;r<t.length-1;r++){let i=t[r],a=t[r+1],o=i.distanceTo(a);if(n+o>=e||r===t.length-2){let t=Math.min(1,Math.max(0,(e-n)/o));return{x:i.x+(a.x-i.x)*t,z:i.y+(a.y-i.y)*t,dx:(a.x-i.x)/o,dz:(a.y-i.y)/o}}n+=o}return{x:t[0].x,z:t[0].y,dx:1,dz:0}}},Pm=64,Fm=.5,Im=e=>6+2.2*Math.sin(e*.13+.5)+.8*Math.sin(e*.31),Lm=e=>2.2*.13*Math.cos(e*.13+.5)+.248*Math.cos(e*.31),Rm=(e,t)=>Math.abs(e-Im(t))/Math.sqrt(1+Lm(t)**2),zm={x0:-3.5,x1:-.5,z0:-1.5,z1:1.5},Bm={x:1.5,z:-4.5},Vm=[{kind:`fruit`,x:-6,z:-3.5,seed:11},{kind:`broadleaf`,x:-3,z:5.5,seed:23},{kind:`cypress`,x:10.5,z:2,seed:37}];function Hm(e,t){return .9*xm(e*.045,t*.045)+.2*xm(e*.11+5,t*.11-3)+.012*e}var Um=(()=>{let e=0;for(let t=-32;t<=32;t++)e+=Hm(Im(t),t);return e/65-.3})();function Wm(e,t){let n=Hm(e,t);return n+(Um+.28-n)*(1-J(2.2,9,Rm(e,t)))}function Gm(e,t){let n=Math.max(zm.x0-e,0,e-zm.x1),r=Math.max(zm.z0-t,0,t-zm.z1),i=1-J(0,1.5,Math.hypot(n,r)),a=Math.max(Math.abs(e-Bm.x)-1.2,0),o=Math.max(Math.abs(t-Bm.z)-.8,0),s=1-J(0,1.2,Math.hypot(a,o));return i>=s?[i,Wm((zm.x0+zm.x1)/2,(zm.z0+zm.z1)/2)]:[s,Wm(Bm.x,Bm.z)]}function Km(e,t){let n=Wm(e,t),[r,i]=Gm(e,t);n+=(i-n)*r;let a=Um-.8;return a+(n-a)*J(.3,2.3,Rm(e,t))}var qm=wm(Km),Jm=qm.normal,Ym=`summer`;function Xm(e,t=`summer`){return Ym=t,Zm(e),$m(e),eh(e),th(e),nh(e),rh(e),ih(e),{center:new R(0,0,0),radius:34,stream:Qm,wind:Vm.map(Em),height:Km,bare:()=>0}}function Zm(e){let t=new G(`paint`),n=Math.round(Pm/Fm)+1,r=new H;for(let e=0;e<n;e++)for(let i=0;i<n;i++){let n=-32+i*Fm,a=-32+e*Fm,o=Km(n,a),s=Rm(n,a),c=.4*(o-(Km(n+2.5,a)+Km(n-2.5,a)+Km(n,a+2.5)+Km(n,a-2.5))/4)+.6*(o-(Km(n+6,a)+Km(n-6,a)+Km(n,a+6)+Km(n,a-6))/4),l=xm(n*.07+11,a*.07-4)*.5+.5,u=xm(n*.19-7,a*.19+2)*.5+.5;r.copy(q.meadow).lerp(q.lime,J(0,.18,c)*.6+J(.6,.9,l)*.2).lerp(q.emerald,J(0,.2,-c)*.55+J(.65,.95,1-l)*.25).lerp(q.teal,J(.15,.35,-c)*.35+J(.75,1,u)*.15),r.lerp(q.moss,1-J(1.8,3.4,s)).lerp(q.mud,(1-J(1.45,1.9,s))*.8).lerp(q.bed,1-J(1.1,1.5,s));let[d]=Gm(n,a),f=[Math.min(1,Math.max(.12,Math.max(1-J(1.4,4.2,s),4*d*(1-d)*.9,J(.06,.2,Math.abs(c))*.7,...Vm.map(e=>(1-J(1.5,3.8,Math.hypot(n-e.x,a-e.z)))*.8))+xm(n*.21+3,a*.21-9)*.22+.1)),2,.7+xm(n*.05,a*.05)*.9,0];t.vertex({x:n,y:o,z:a},Jm(n,a),r,f)}for(let e=0;e<128;e++)for(let r=0;r<128;r++){let i=e*n+r;t.quad(i,i+n,i+n+1,i+1)}e.add(t.build(),`ground`,{under:!0,fields:{x:0,z:0,side:Pm,turn:0}})}var Qm={level:Um,grid:{nx:Pm,nz:Pm,cell:1,x0:-32,z0:-32},channel:(e,t)=>Rm(e,t)<1.6,along:(e,t)=>{let n=Lm(t),r=Math.hypot(n,1);return[-n/r,-1/r]}};function $m(e){let t=new G(`ink`),{x0:n,x1:r,z0:i,z1:a}=zm,o=Gm((n+r)/2,(i+a)/2)[1],s=r-n,c=a-i,l=(n+r)/2,u=(i+a)/2,d=new V;t.addGeometry(new qr(s-.1,.22,c-.1),d.makeTranslation(l,o+.05,u),q.soil,[0,1,0,0]);let f=(e,n,r,i)=>t.addGeometry(new qr(r,.26,i),new V().makeTranslation(e,o+.08,n),q.timber,[2,1,0,0]);if(f(l,i,s+.12,.12),f(l,a,s+.12,.12),f(n,u,.12,c),f(r,u,.12,c),e.add(t.build(),`ink`),Ym===`winter`)return;let p=Ym===`spring`,m=Ym===`autumn`,h=p?K(11061344):m?K(15654044):q.wheatTip,g=p?K(5144120):m?K(10521162):q.wheatRoot,_=new G(`crop`),v=p?.22:m?.08:.36;if(_.addGeometry(new qr(s-.5,v,c-.5),new V().makeTranslation(l,o+.16+v*.5+.12,u),h.clone().lerp(g,m?.6:.35),[1,3,.4,0]),e.add(_.build(),`crop`),m)return;let y=new G(`grass`),b=vm(5),x=new R(0,1,0),S=o+.16;for(let e=0;e<3;e++)for(let t=0;t<3;t++)for(let r=0;r<60;r++){let r=n+.12+e+b()*.86,a=i+.12+t+b()*.86,o=(.55+b()*.18)*(p?.55:1),s=(b()-.5)*.1,c=b(),l=b()*Math.PI,u=Math.cos(l)*.026,d=Math.sin(l)*.026,f=[.5,1.4,.4,.8],m=new R(r+s,S+o,a+s*.5),_=g.clone(),v=h.clone().lerp(g,b()*b()*.6).offsetHSL((b()-.5)*.03,0,(b()-.5)*.06),C=y.vertex({x:r-u,y:S,z:a-d},x,_,f,[0,0],[0,c,-.026,l]),w=y.vertex({x:r+u,y:S,z:a+d},x,_,f,[0,0],[0,c,.026,l]),T=y.vertex({x:m.x+u*.6,y:m.y-.16,z:m.z+d*.6},x,_.clone().lerp(v,.7),f,[0,0],[.8,c,.0156,l]),E=y.vertex({x:m.x-u*.6,y:m.y-.16,z:m.z-d*.6},x,_.clone().lerp(v,.7),f,[0,0],[.8,c,-.0156,l]);y.quad(C,w,T,E);let D=y.vertex({x:m.x-u*2.2,y:m.y-.06,z:m.z-d*2.2},x,v,f,[0,0],[.9,c,-.0572,l]),O=y.vertex({x:m.x+u*2.2,y:m.y-.06,z:m.z+d*2.2},x,v,f,[0,0],[.9,c,.0572,l]),k=y.vertex({x:m.x+s*.3,y:m.y+.12,z:m.z},x,v,f,[0,0],[1,c]);y.tri(E,T,O),y.tri(E,O,k),y.tri(E,k,D)}e.add(y.build(),`grass`,{castShadow:!1,seasonal:!1})}function eh(e){let t=new G(`paint`),n=new G(`foliage`);for(let e of Vm)Dm(t,n,qm,e,vm(e.seed));e.add(t.build(),`paint`),e.add(n.build(),`foliage`)}function th(e){let t=new G(`grass`),n=new G(`foliage`),r=vm(77),i=Pm/2-1,a=(e,t)=>e>zm.x0-.35&&e<zm.x1+.35&&t>zm.z0-.35&&t<zm.z1+.35||Math.abs(e-Bm.x)<1.25&&Math.abs(t-Bm.z)<.85||Rm(e,t)<1.6||Vm.some(n=>Math.hypot(e-n.x,t-n.z)<.35),o=(e,t)=>{let n=xm(e*.07+11,t*.07-4)*.5+.5;return q.meadow.clone().lerp(q.lime,J(.45,.85,n)*.8).lerp(q.emerald,J(.55,.9,1-n)*.7)},s=0;for(let e=0;s<6e3&&e<12e4;e++){let e=(r()*2-1)*i,n=(r()*2-1)*i;if(a(e,n))continue;let c=Math.max(1-J(1.6,3.4,Rm(e,n)),1-J(.2,1.4,Math.hypot(Math.max(zm.x0-e,0,e-zm.x1),Math.max(zm.z0-n,0,n-zm.z1))),...Vm.map(t=>1-J(.4,2.2,Math.hypot(e-t.x,n-t.z))),1-J(.3,1.4,Math.hypot(Math.max(Math.abs(e-Bm.x)-1.1,0),Math.max(Math.abs(n-Bm.z)-.7,0)))),l=Math.max(c,J(.55,.9,xm(e*.09+40,n*.09)*.5+.5)*.7);r()>l*.95+.04||(s++,km(t,qm,e,n,.18+l*.32,o(e,n),r))}let c=[K(15764400),K(16249572),K(16109374),K(10975960),K(15226698)],l={spring:55,summer:70,autumn:22,winter:0}[Ym];for(let e=0;e<l;e++){let e=(r()*2-1)*i,t=(r()*2-1)*i,o=c[Math.floor(r()*c.length)];Mm(n,qm,e,t,o,6+Math.floor(r()*14),r,(e,t)=>!a(e,t)&&Math.abs(e)<=i&&Math.abs(t)<=i)}e.add(t.build(),`grass`,{castShadow:!1}),e.add(n.build(),`foliage`,{castShadow:!1,cover:`none`})}function nh(e){let t=new G(`ink`),n=Gm(Bm.x,Bm.z)[1],r=yt.degToRad(28),i=yt.degToRad(15),a=new R(Bm.x,n+1,Bm.z),o=new bt().setFromEuler(new Mn(r,i,0,`YXZ`)),s=new V().compose(a,o,new R(1,1,1));t.addGeometry(new qr(2.2,.08,1.3),s,q.ceramic,[0,1,0,0]);let c=new R(0,1,0).applyQuaternion(o),l=(e,t)=>new R(e*1.04,.045,t*.6).applyMatrix4(s),u=[1,6,3,0],d=t.vertex(l(-1,-1),c,q.glass,u,[0,0]),f=t.vertex(l(1,-1),c,q.glass,u,[1,0]),p=t.vertex(l(1,1),c,q.glass,u,[1,1]),m=t.vertex(l(-1,1),c,q.glass,u,[0,1]);t.quad(d,m,p,f);for(let[e,r]of[[-.85,-.4],[.85,-.4],[-.85,.4],[.85,.4]]){let i=new R(e,-.04,r).applyMatrix4(s),a=i.y-n+.05;t.addGeometry(new ba(.045,.06,a,8),new V().makeTranslation(i.x,n+a/2-.05,i.z),q.brass,[0,1,0,0])}t.addGeometry(new qr(2,.12,1.1),new V().makeTranslation(Bm.x,n+.02,Bm.z),q.ceramic,[0,1,0,0]),e.add(t.build(),`ink`)}function rh(e){let t=new G(`paint`),n=vm(91),r=(e,r,i,a)=>Om(t,qm,e,r,i,a,n,Um),i=()=>{let e=(n()*2-1)*(Pm/2-2);return{z:e,x:Im(e),s:Lm(e)}};for(let e=0;e<70;e++){let{x:e,z:t,s:a}=i(),o=(n()*2-1)*1.5,s=1/Math.sqrt(1+a*a);r(e+o*s,t-o*a*s,.07+n()*.13,.4)}for(let e=0;e<9;e++){let{x:e,z:t,s:a}=i(),o=n()<.5?-1:1,s=1/Math.sqrt(1+a*a);for(let i=0,c=1+Math.floor(n()*3);i<c;i++){let i=o*(1.35+n()*.8),c=(n()-.5)*1.2;r(e+i*s,t+c-i*a*s,.18+n()*.28,.35)}}e.add(t.build(),`paint`,{under:!0})}function ih(e){let t=new G(`grass`),n=vm(53);for(let e=0;e<34;e++){let e=(n()*2-1)*(Pm/2-2),r=Lm(e),i=1/Math.sqrt(1+r*r),a=(n()<.5?-1:1)*(1.45+n()*.5),o=Im(e)+a*i,s=e-a*r*i;Vm.some(e=>Math.hypot(o-e.x,s-e.z)<1)||Am(t,qm,o,s,n)}e.add(t.build(),`grass`,{castShadow:!1})}var ah=class extends no{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new uh(e)}),this.register(function(e){return new dh(e)}),this.register(function(e){return new bh(e)}),this.register(function(e){return new xh(e)}),this.register(function(e){return new Sh(e)}),this.register(function(e){return new ph(e)}),this.register(function(e){return new mh(e)}),this.register(function(e){return new hh(e)}),this.register(function(e){return new gh(e)}),this.register(function(e){return new lh(e)}),this.register(function(e){return new _h(e)}),this.register(function(e){return new fh(e)}),this.register(function(e){return new yh(e)}),this.register(function(e){return new vh(e)}),this.register(function(e){return new sh(e)}),this.register(function(e){return new Ch(e)}),this.register(function(e){return new wh(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=To.extractUrlBase(e);a=To.resolveURL(t,this.path)}else a=To.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new ao(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===Th){try{a[Y.KHR_BINARY_GLTF]=new Oh(e)}catch(e){r&&r(e);return}i=JSON.parse(a[Y.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new eg(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case Y.KHR_MATERIALS_UNLIT:a[t]=new ch;break;case Y.KHR_DRACO_MESH_COMPRESSION:a[t]=new kh(i,this.dracoLoader);break;case Y.KHR_TEXTURE_TRANSFORM:a[t]=new Ah;break;case Y.KHR_MESH_QUANTIZATION:a[t]=new jh;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function oh(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}var Y={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_DISPERSION:`KHR_materials_dispersion`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},sh=class{constructor(e){this.parser=e,this.name=Y.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new H(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],ze);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new wo(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new xo(s),o.distance=c;break;case`spot`:o=new go(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),Kh(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},ch=class{constructor(){this.name=Y.KHR_MATERIALS_UNLIT}getMaterialType(){return _r}extendParams(e,t,n){let r=[];e.color=new H(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],ze),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,Re))}return Promise.all(r)}},lh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},uh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatMap`,a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatRoughnessMap`,a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(i.push(n.assignTexture(t,`clearcoatNormalMap`,a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){let e=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new L(e,e)}return Promise.all(i)}},dh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_DISPERSION}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name];return t.dispersion=r.dispersion===void 0?0:r.dispersion,Promise.resolve()}},fh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceMap`,a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceThicknessMap`,a.iridescenceThicknessTexture)),Promise.all(i)}},ph=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_SHEEN}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[];t.sheenColor=new H(0,0,0),t.sheenRoughness=0,t.sheen=1;let a=r.extensions[this.name];if(a.sheenColorFactor!==void 0){let e=a.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],ze)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&i.push(n.assignTexture(t,`sheenColorMap`,a.sheenColorTexture,Re)),a.sheenRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`sheenRoughnessMap`,a.sheenRoughnessTexture)),Promise.all(i)}},mh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&i.push(n.assignTexture(t,`transmissionMap`,a.transmissionTexture)),Promise.all(i)}},hh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_VOLUME}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.thickness=a.thicknessFactor===void 0?0:a.thicknessFactor,a.thicknessTexture!==void 0&&i.push(n.assignTexture(t,`thicknessMap`,a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;let o=a.attenuationColor||[1,1,1];return t.attenuationColor=new H().setRGB(o[0],o[1],o[2],ze),Promise.all(i)}},gh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_IOR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name];return t.ior=r.ior===void 0?1.5:r.ior,Promise.resolve()}},_h=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_SPECULAR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.specularIntensity=a.specularFactor===void 0?1:a.specularFactor,a.specularTexture!==void 0&&i.push(n.assignTexture(t,`specularIntensityMap`,a.specularTexture));let o=a.specularColorFactor||[1,1,1];return t.specularColor=new H().setRGB(o[0],o[1],o[2],ze),a.specularColorTexture!==void 0&&i.push(n.assignTexture(t,`specularColorMap`,a.specularColorTexture,Re)),Promise.all(i)}},vh=class{constructor(e){this.parser=e,this.name=Y.EXT_MATERIALS_BUMP}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return t.bumpScale=a.bumpFactor===void 0?1:a.bumpFactor,a.bumpTexture!==void 0&&i.push(n.assignTexture(t,`bumpMap`,a.bumpTexture)),Promise.all(i)}},yh=class{constructor(e){this.parser=e,this.name=Y.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:ja}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&i.push(n.assignTexture(t,`anisotropyMap`,a.anisotropyTexture)),Promise.all(i)}},bh=class{constructor(e){this.parser=e,this.name=Y.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},xh=class{constructor(e){this.parser=e,this.name=Y.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Sh=class{constructor(e){this.parser=e,this.name=Y.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return n.loadTextureImage(e,a.source,s)}},Ch=class{constructor(e){this.name=Y.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},wh=class{constructor(e){this.name=Y.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==Fh.TRIANGLES&&e.mode!==Fh.TRIANGLE_STRIP&&e.mode!==Fh.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new V,n=new R,a=new bt,s=new R(1,1,1),c=new Hi(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));for(let t in o)if(t===`_COLOR_0`){let e=o[t];c.instanceColor=new Pi(e.array,e.itemSize,e.normalized)}else t!==`TRANSLATION`&&t!==`ROTATION`&&t!==`SCALE`&&e.geometry.setAttribute(t,o[t]);Yn.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},Th=`glTF`,Eh=12,Dh={JSON:1313821514,BIN:5130562},Oh=class{constructor(e){this.name=Y.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Eh),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Th)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-Eh,i=new DataView(e,Eh),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Dh.JSON){let r=new Uint8Array(e,Eh+a,t);this.content=n.decode(r)}else if(r===Dh.BIN){let n=Eh+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},kh=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=Y.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=Bh[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=Bh[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=Ih[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,ze,n)})})}},Ah=class{constructor(){this.name=Y.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},jh=class{constructor(){this.name=Y.KHR_MESH_QUANTIZATION}},Mh=class extends za{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},Nh=new bt,Ph=class extends Mh{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return Nh.fromArray(i).normalize().toArray(i),i}},Fh={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ih={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Lh={9728:i,9729:s,9984:a,9985:c,9986:o,9987:l},Rh={33071:n,33648:r,10497:t},zh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Bh={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},Vh={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},Hh={CUBICSPLINE:void 0,LINEAR:Ae,STEP:ke},Uh={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function Wh(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new Aa({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function Gh(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function Kh(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function qh(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function Jh(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function Yh(e){let t,n=e.extensions&&e.extensions[Y.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+Xh(n.attributes):e.indices+`:`+Xh(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+Xh(e.targets[n]);return t}function Xh(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function Zh(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function Qh(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?`image/ktx2`:`image/png`}var $h=new V,eg=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new oh,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,i=!1,a=-1;if(typeof navigator<`u`){let e=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(e)===!0;let t=e.match(/Version\/(\d+)/);r=n&&t?parseInt(t[1],10):-1,i=e.indexOf(`Firefox`)>-1,a=i?e.match(/Firefox\/([0-9]+)\./)[1]:-1}this.textureLoader=typeof createImageBitmap>`u`||n&&r<17||i&&a<98?new co(this.options.manager):new Oo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ao(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return Gh(i,a,r),Kh(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){for(let e of a.scenes)e.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Y.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(To.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=zh[r.type],t=Ih[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new xr(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=zh[r.type],o=Ih[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new gi(f,u/s),t.cache.add(n,c)),p=new vi(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new xr(f,a,d);if(r.sparse!==void 0){let t=zh.SCALAR,n=Ih[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new xr(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}p.normalized=d}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=Lh[n.magFilter]||1006,t.minFilter=Lh[n.minFilter]||1008,t.wrapS=Rh[n.wrapS]||1e3,t.wrapT=Rh[n.wrapT]||1e3,t.generateMipmaps=!t.isCompressedTexture&&t.minFilter!==1003&&t.minFilter!==1006,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new Ut(e);t.needsUpdate=!0,n(t)}),t.load(To.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),Kh(e,a),e.userData.mimeType=a.mimeType||Qh(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[Y.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[Y.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[Y.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new da,gr.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new Zi,gr.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return Aa}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[Y.KHR_MATERIALS_UNLIT]){let e=r[Y.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new H(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],ze),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,Re)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||Uh.OPAQUE;if(l===Uh.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===Uh.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==_r&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new L(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==_r&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==_r){let e=i.emissiveFactor;o.emissive=new H().setRGB(e[0],e[1],e[2],ze)}return i.emissiveTexture!==void 0&&a!==_r&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,Re)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),Kh(n,i),t.associations.set(n,{materials:e}),i.extensions&&Gh(r,n,i),n})}createUniqueName(e){let t=Vo.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[Y.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return ng(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=Yh(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[Y.KHR_DRACO_MESH_COMPRESSION]?i(o):ng(new Mr,o,t),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?Wh(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===Fh.TRIANGLES||u.mode===Fh.TRIANGLE_STRIP||u.mode===Fh.TRIANGLE_FAN||u.mode===void 0)d=i.isSkinnedMesh===!0?new Oi(l,f):new Wr(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights(),u.mode===Fh.TRIANGLE_STRIP?d.geometry=Cm(d.geometry,1):u.mode===Fh.TRIANGLE_FAN&&(d.geometry=Cm(d.geometry,2));else if(u.mode===Fh.LINES)d=new la(l,f);else if(u.mode===Fh.LINE_STRIP)d=new aa(l,f);else if(u.mode===Fh.LINE_LOOP)d=new ua(l,f);else if(u.mode===Fh.POINTS)d=new ga(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&Jh(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),Kh(d,i),u.extensions&&Gh(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&Gh(r,c[0],i),c[0];let l=new fi;i.extensions&&Gh(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r)console.warn(`THREE.GLTFLoader: Missing camera parameters.`);else return n.type===`perspective`?t=new oi(yt.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new So(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Kh(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new V;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new Ni(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],a=e[1],o=e[2],s=e[3],c=e[4],l=[];for(let e=0,r=t.length;e<r;e++){let r=t[e],i=a[e],u=o[e],d=s[e],f=c[e];if(r===void 0)continue;r.updateMatrix&&r.updateMatrix();let p=n._createAnimationTracks(r,i,u,d,f);if(p)for(let e=0;e<p.length;e++)l.push(p[e])}let u=new Za(i,void 0,l);return Kh(u,r),u})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,$h)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new ki:t.length>1?new fi:t.length===1?t[0]:new Yn,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),Kh(o,i),i.extensions&&Gh(n,o,i),i.matrix!==void 0){let e=new V;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);if(!r.associations.has(o))r.associations.set(o,{});else if(i.mesh!==void 0&&r.meshCache.refs[i.mesh]>1){let e=r.associations.get(o);r.associations.set(o,{...e})}return r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new fi;n.name&&(i.name=r.createUniqueName(n.name)),Kh(i,n),n.extensions&&Gh(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++)i.add(e[t]);return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof gr||e instanceof Ut)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];Vh[i.path]===Vh.weights?e.traverse(function(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}):s.push(o);let c;switch(Vh[i.path]){case Vh.weights:c=Ka;break;case Vh.rotation:c=Ja;break;case Vh.translation:case Vh.scale:c=Xa;break;default:switch(n.itemSize){case 1:c=Ka;break;default:c=Xa}}let l=r.interpolation===void 0?Ae:Hh[r.interpolation],u=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new c(s[e]+`.`+Vh[i.path],t.array,u,l);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=Zh(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof Ja?Ph:Mh)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function tg(e,t,n){let r=t.attributes,i=new Yt;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new R(t[0],t[1],t[2]),new R(a[0],a[1],a[2])),e.normalized){let t=Zh(Ih[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new R,t=new R;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=Zh(Ih[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new mn;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function ng(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=Bh[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return Nt.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Nt.workingColorSpace}" not supported.`),Kh(e,t),tg(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:qh(e,t.targets,n)})}var rg={plain:_m,timber:[2,1,0,0],glass:[1,2,2,0],tin:[3,0,5,0]},ig=new ah;async function ag(e){return(await ig.loadAsync(e)).scene}function og(e,t,n,r=!1){t.updateMatrixWorld(!0);let i=new R,a=new R,o=new H;t.traverse(t=>{let s=t;if(!s.isMesh)return;let c=n.clone().multiply(s.matrixWorld),l=new z().getNormalMatrix(c),u=rg[s.material.name]??_m,d=s.geometry,f=r?[u[0],u[1],u[2],1]:u,p=d.getAttribute(`position`),m=d.getAttribute(`normal`),h=d.getAttribute(`_color`),g=d.getAttribute(`uv`),_=e.vertexCount;for(let t=0;t<p.count;t++)i.fromBufferAttribute(p,t).applyMatrix4(c),a.fromBufferAttribute(m,t).applyMatrix3(l).normalize(),h?o.setRGB(h.getX(t),h.getY(t),h.getZ(t)):o.setRGB(1,1,1),e.vertex(i,a,o,f,g?[g.getX(t),g.getY(t)]:[0,0]);let v=d.index;if(v)for(let t=0;t<v.count;t+=3)e.tri(_+v.getX(t),_+v.getX(t+1),_+v.getX(t+2));else for(let t=0;t<p.count;t+=3)e.tri(_+t,_+t+1,_+t+2)})}var sg=new URL(`shed-f7HxhUor.glb`,import.meta.url).href,cg=new URL(`farmhouse-DBOJeVf1.glb`,import.meta.url).href,lg=new URL(`barn-YqJTE8-n.glb`,import.meta.url).href,ug=new URL(`coop-BbpOdVA6.glb`,import.meta.url).href,dg=new URL(`well-C2WgFI3a.glb`,import.meta.url).href,fg=new URL(`glasshouse-BlQuOrhP.glb`,import.meta.url).href,pg=new URL(`windmill-BPIKSS3y.glb`,import.meta.url).href,mg=new URL(`haywagon-gpNb76Wi.glb`,import.meta.url).href,hg=new URL(`rowboat-BIcoTyBo.glb`,import.meta.url).href,gg=new URL(`scarecrow-CDpldgYo.glb`,import.meta.url).href,_g=88,vg=.5,yg=34,bg=Math.SQRT1_2,xg=(e,t)=>[(e-t)*bg,(-e-t)*bg],Sg=(e,t)=>[(e-t)*bg,(-e-t)*bg],Cg=e=>new Nm(e.map(([e,t])=>xg(e,t))),wg=(e,t,n=.5)=>Math.abs(e)<_g-n&&Math.abs(t)<_g-n,Tg=[[-38,-1],[-29,-4],[-23,-9],[-19.5,-15],[-17,-21],[-14,-27],[-12,-38]],Eg=Cg([[-8,-50],[-10.5,-44],...[...Tg].reverse(),[-48,-2],[-61,6],[-73,17],[-81,26],[-85,28.5],[-88,28.5]]),Dg=Cg([[7,-88],[7,-83],[5.5,-78],[1,-70],[-3,-62]]),Og=[Eg,Dg],kg=1.6,Ag={u:-6,v:-57,a:16,b:10.5};function jg(e,t){let n=(e-Ag.u)/Ag.a,r=(t-Ag.v)/Ag.b,i=Math.hypot(n,r),a=Math.atan2(r,n);return(i-(1+.1*xm(Math.cos(a)*1.4+3,Math.sin(a)*1.4)+.05*xm(Math.cos(a)*3.1,Math.sin(a)*3.1+7)))*(Ag.a+Ag.b)*.5}function Mg(e,t){let[n,r]=Sg(e,t);return Math.min(Eg.distance(e,t)/kg,Dg.distance(e,t)/kg,Math.max(0,1.4+jg(n,r)/kg))}var Ng=Cg([[-92,13],[-74,11.5],[-56,9],[-38,7],[-24,5.5],[-10,4],[4,4.5],[16,6],[26,8],[38,8.5],[47,9.5],[56,10],[68,9.5],[80,7.5],[92,6]]),Pg=Cg([[-92,-38],[-70,-32],[-50,-27],[-38,-25],[-27,-20.5],[-18,-18.5],[-6,-16.5],[6,-14.5],[16,-11.5]]),Fg=Cg([[16,-11.5],[20,-5],[22.5,1.5],[24.5,7.5]]),Ig=Cg([[16,-11.5],[25,-14.5],[38,-17.5],[54,-20],[70,-21],[92,-23]]),Lg=Cg([[-40,49],[-35,43],[-26,38],[-10,37],[10,37.5],[30,37],[54,36.5],[80,37],[92,38]]),Rg=[Ng,Pg,Fg,Ig,Lg,Cg([[56,10],[55.5,22],[54,36.5]]),Cg([[-2,-25],[1.5,-35],[7,-45],[12.5,-53]])],zg=1.05,Bg=(()=>{let e=Ng.points.map(e=>Sg(e.x,e.y));return t=>{for(let n=0;n<e.length-1;n++)if(e[n+1][0]>=t){let r=(t-e[n][0])/(e[n+1][0]-e[n][0]);return e[n][1]+(e[n+1][1]-e[n][1])*Math.min(1,Math.max(0,r))}return e[e.length-1][1]}})(),Vg=e=>Bg(e)+2.6+.35*Math.sin(e*.3+1),Hg=-13,Ug=(e,t)=>Math.min(t-Vg(e),e-Hg+.6*Math.sin(t*.4),33.5-t+.4*Math.sin(e*.27),33.5-e+.5*Math.sin(t*.31)),Wg=(e,t,n)=>Math.min(t-e.u0,e.u1-t,n-e.v0,e.v1-n)+.35*xm(t*.21+e.u0,n*.21+e.v0),Gg={u0:-16,u1:7.5,v0:41.5,v1:58.5},Kg={u0:11.5,u1:33.5,v0:41.5,v1:59},qg={u0:37.5,u1:72,v0:41.5,v1:58},Jg={u0:-16,u1:72,v0:62.5,v1:70.5},Yg={u0:18,u1:40,v0:-62,v1:-47},Xg={u0:-52,u1:-31,v0:-64,v1:-45},Zg={u0:42,u1:70,v0:3.5,v1:15.5},Qg={u0:56,u1:80,v0:-16,v1:-1},$g=[Gg,Kg,qg,Jg,Yg,Xg,Zg,Qg],e_=(e,t,n=0)=>$g.some(r=>Wg(r,e,t)>-n),t_=Array.from({length:4},(e,t)=>Cg([[-9.5+t*.6,-11.5+t*3.3],[-1,-10.4+t*3.3],[8.5-t*.5,-12+t*3.4]])),n_=q.fruitLeaf.clone().lerp(q.deepLeaf,.55),r_=Array.from({length:6},(e,t)=>Cg([[12+t*.4,-21-t*2.4],[36,-26-t*2.4]])),i_={u0:43,u1:76,v0:-56,v1:-27},a_=[[-2,14],[3,14.3],[8,14.6],[13,14.9],[18,15.2],[.5,19.5],[5.5,19.8],[10.5,20.1],[15.5,20.4],[20.5,20.7]];function o_(e,t,n,r,i,a){let[o,s]=xg(t,n);return{kind:e,x:o,z:s,scale:r,seed:i,...a?{leaf:a}:{}}}var s_={url:sg,u:-2.5,v:-20.5,facing:0,hx:2.3,hz:2.6,height:3},c_=[s_,{url:cg,u:64,v:21,facing:0,hx:6.8,hz:4.6,height:8,pad:!0},{url:lg,u:42.5,v:26,facing:0,hx:6.6,hz:4.6,height:8,pad:!0},{url:ug,u:73.5,v:8,facing:-Math.PI/2,hx:1.6,hz:1.4,height:1.9,pad:!0},{url:dg,u:61,v:7.5,facing:.3,hx:.9,hz:.9,height:2.3,pad:!0},{url:fg,u:71,v:-4.5,facing:0,hx:3.9,hz:2.2,height:3.3,pad:!0},{url:pg,u:-40,v:54,facing:0,hx:2.8,hz:2.8,height:15.4,pad:!0},{url:mg,u:49,v:16.5,facing:Math.PI/2+.25,hx:2.2,hz:1.2,height:2.4},{url:gg,u:-41,v:-54,facing:.4,hx:.4,hz:.4,height:2}],l_={url:hg,u:3,v:-58.3,facing:Math.PI/2+.12,hx:1.9,hz:.8,height:.6},u_={from:[14,-55],to:[3.5,-55.8],width:1.6};function d_(e,t,n){let r=t-e.u,i=n-e.v,a=Math.cos(e.facing),o=Math.sin(e.facing);return[r*a+i*o,r*o-i*a]}function f_(e,t,n){let[r,i]=d_(e,t,n);return Math.hypot(Math.max(0,Math.abs(r)-e.hx),Math.max(0,Math.abs(i)-e.hz))}var p_=(e,t,n)=>[...c_,l_].some(r=>f_(r,e,t)<n);function m_(e,t){let[n,r]=Sg(e,t),[i,a]=d_(s_,n,r);return[i,a]}var h_=(e,t,n=0)=>{let[r,i]=m_(e,t);return Math.abs(r)<2.3+n&&i>-1.7-n&&i<3.6+n},g_=[...[[-27,13,1.3],[-22.5,17,1.5],[-18,11.5,1.2],[-13.5,9.5,1.45],[-31,19.5,1.1],[-16,1,1.65],[-12,-1.5,1.25],[-25,22,1.3]].map(([e,t,n],r)=>o_(`cypress`,e,t,n,100+r)),...[[13,-1,2.1],[17.5,2.5,1.85],[18.5,-3.5,1.7],[14.5,-5.5,1.45],[10.5,2,1.3]].map(([e,t,n],r)=>o_(`broadleaf`,e,t,n,200+r,q.deepLeaf)),...[[-22,-3.5,1.1],[-13,-13,.95],[-26,-13,1],[-11,-22,1.15],[-30,1,.9],[4,-20,1.2],[27,-6,1.1],[29,2,.95]].map(([e,t,n],r)=>o_(`broadleaf`,e,t,n,300+r)),o_(`fruit`,-12.5,-8,1.05,400),o_(`broadleaf`,75,27,2.2,500,q.deepLeaf),o_(`broadleaf`,33.5,28,1.6,501),o_(`broadleaf`,79,10,1.5,502),o_(`broadleaf`,48,33,1.3,503),...[[-70,-16,2.1],[-64,9,1.8],[-80,20,1.9],[-62,-36,1.7],[-78,-50,2],[-30,47,1.4]].map(([e,t,n],r)=>o_(`broadleaf`,e,t,n,600+r,q.leaf.clone().lerp(q.deepLeaf,.3+.1*r))),...[[-24,-50,1.5],[-21,-66,1.3],[-9,-72.5,1.6],[6,-67,1.2],[-17,-44,1.1]].map(([e,t,n],r)=>o_(`broadleaf`,e,t,n,700+r,q.leafLight.clone().lerp(q.teal,.35))),...[[16,-45,1.3],[16.5,-50,1.1],[42,-46,1.4],[42.5,-51,1.2]].map(([e,t,n],r)=>o_(`cypress`,e,t,n,800+r))];for(let e=0;e<6;e++)for(let t=0;t<5;t++){let n=i_.u0+3+e*5.6+t%2*2.8,r=i_.v0+3+t*5.8;n>i_.u1-2||g_.push(o_(`fruit`,n+xm(e,t)*.6,r+xm(t,e)*.6,1+.2*xm(e*3,t*3),900+e*10+t))}var __=[[-9.4,-13.8,.3],[-7.4,-14.4,-.2],[-8.6,-12.2,.9]],v_=[[-11.2,-12.4,.1],[-11,-13.6,-.15]],y_=[[-6.4,-12.6],[-5.8,-13.4],[-10.2,-10.9]],b_=[-4.6,-10.8,1.1],x_=[[20.5,-7.6],[22,-7.9],[23.5,-8.2],[25,-8.5],[24,-44.5],[26,-44.3],[28,-44.1],[30,-44.2],[32,-44.4]],S_=[[-24,9.6,.3],[-22.2,10.8,1.2],[-26,11,2.2],[-6,66,.2],[-3.5,67.4,1.4],[14,64.5,.6],[22,68,2.4],[24,65.5,.1],[40,67,1],[52,64,2],[55,66.5,.4]],C_=()=>I_===`summer`?S_:S_.slice(0,3),w_=[[12.9,-6.2],[13.5,-6.9],[51,5.5],[51.8,4.8]],T_=[11,-7.5],E_=[[-7.8,-23.6],[8,-19],[-30,-10],[-33,-20],[-24,-30],[30,-3],[2,-27],[-31,3],[-46,-14],[-58,30],[-36,30],[-48,66],[-28,62],[30,-32],[-26,-76],[44,-66],[84,-40],[-84,-12]],D_=[Cg([[19.5,-13.5],[24,-12],[28.5,-11]]),Cg([[-50,-42],[-51,-30]]),Cg([[-51.5,-23],[-53,-6],[-55,4]]),Cg([[-88,-8],[-70,-7],[-54.5,-6]]),Cg([[-88,-44],[-66,-42],[-50,-42]]),Cg([[-88,28],[-76,30],[-66,31.5],[-58,34]])],O_=[Cg([[-18,40],[10,40.2],[35,40],[74,39.8]]),Cg([[-18,60.5],[10,60.5],[35,60.3],[74,60]]),Cg([[9.5,41],[9.5,59.5]]),Cg([[35.5,41],[35.5,59.5]]),Cg([[-18.5,41],[-18.5,70]]),Cg([[74.5,41],[74.5,70]]),Cg([[35,13],[35.5,34]]),Cg([[-50,-64],[-30,-66]])];function k_(e,t){let n=t>-25?.03*t:-.75+.012*(-25-t),r=.6*xm(e*.04,t*.04)+.25*xm(e*.1+5,t*.1-3),i=4.2*J(38,86,t)*(.8+.35*xm(e*.03+2,1))+2.8*J(-44,-88,e)*(.8+.3*xm(t*.035,4))+1.4*J(62,88,e)+1.6*J(-70,-90,t)+1*xm(e*.025-9,t*.025+6)*J(40,80,Math.max(Math.abs(e),Math.abs(t))),a=1.6*Math.exp(-(((e+40)/13)**2+((t-54)/11)**2));return n+r+i+a}var A_=(()=>{let e=0,t=Cg(Tg);for(let n of t.points)e+=k_(...Sg(n.x,n.y));return e/t.points.length-.3})(),j_=(e,t)=>Math.min(...Rg.map(n=>n.distance(e,t)));function M_(e,t){let n=j_(e,t),r=(1-J(.8,1.2,n))*J(.12,.3,n),[i,a]=m_(e,t),o=(1-J(1.7,2.5,Math.abs(i)))*J(1.2,1.6,a)*(1-J(3.4,4.6,a)),[s,c]=Sg(e,t);return Math.max(r,.8*o,.7*J(-.5,1,Wg(Zg,s,c)),.9*J(-.5,1,Wg(Kg,s,c)))}function N_(e,t){let[n,r]=Sg(e,t),i=Mg(e,t),a=k_(n,r);for(let e of c_){if(!e.pad)continue;let t=f_(e,n,r);t<3&&(a+=(k_(e.u,e.v)-a)*(1-J(.4,3,t)))}let o=A_+.35;a<o+.4&&(a=o+.4*Math.exp((a-o-.4)/.4)),a+=(A_+.28-a)*(1-J(2.2,10,i)),a-=.07*(1-J(.8500000000000001,1.55,j_(e,t)));let s=A_-.8-.7*J(0,7,-jg(n,r));return s+(a-s)*J(.3,2.3,i)}var P_=wm(N_),F_=24,I_=`summer`,L_={spring:`young`,summer:`ripe`,autumn:`stubble`,winter:`bare`};function R_(e,t=`summer`){I_=t;let n={add:(t,n,r={})=>e.add(t,n,{...r,tile:F_})};return G_(n),X_(n),Q_(n),$_(n),ev(n),tv(n),rv(n),ov(n),sv(n),cv(n),lv(n),uv(n),{center:new R(0,0,0),radius:_g*Math.SQRT2,stream:J_,wind:B_(),ready:V_(n),height:N_,bare:M_}}function z_(e,t,n,r,i,a){let o=[];for(let s=t;s<n;s+=2){let t=e.at(s),c=e.at(Math.min(n,s+2)),l=t.x-t.dz*r,u=t.z+t.dx*r,d=c.x-c.dz*r,f=c.z+c.dx*r;o.push({strip:{ax:l,az:u,bx:d,bz:f,width:i},drag:a})}return o}function B_(){let e=[];for(let t of D_)for(let n=0;n<t.length;n+=1){let r=t.at(n),i=t.at(Math.min(t.length,n+1));e.push({strip:{ax:r.x,az:r.z,bx:i.x,bz:i.z,width:.6},solid:!0,height:.6})}let t=c_.filter(e=>e.height>1.5&&e.hx>1).map(e=>{let[t,n]=xg(e.u,e.v);return{box:{x:t,z:n,hx:e.hx*.9,hz:e.hz*.9,turn:-(Math.PI/4+e.facing)},solid:!0,height:e.height}});return[...g_.map(Em),...iv.map(Em),...t_.flatMap(e=>z_(e,0,e.length,0,1.3,Xp.crown)),...r_.flatMap(e=>z_(e,0,e.length,0,1.2,Xp.crown/3)),...z_(Fg,2,17,-2.1,1.8,Xp.hedge),...z_(Pg,2,14,2.1,1.8,Xp.hedge),...O_.flatMap(e=>z_(e,0,e.length,0,1.8,Xp.hedge)),...t,...e]}async function V_(e){let t=new G(`ink`),n=await Promise.all([...c_,l_].map(e=>ag(e.url)));[...c_,l_].forEach((e,r)=>{let i=Math.PI/4+e.facing,[a,o]=xg(e.u,e.v),s=0,c=0;for(let t of[-1,0,1])for(let n of[-1,0,1]){let r=Math.cos(i),l=Math.sin(i),u=t*e.hx*.8,d=n*e.hz*.8;s+=N_(a+u*r+d*l,o-u*l+d*r),c++}let l=new V().compose(new R(a,e===l_?A_:s/c,o),new bt().setFromEuler(new Mn(0,i,0)),new R(1,1,1));og(t,n[r],l,e===l_)}),e.add(t.build(),`ink`)}var H_=(e,t,n,r)=>Math.max(0,...e.map(e=>1-J(.2,r,e.near(t,n).distance))),U_=(e,t)=>e>-11&&e<10&&t>-13.5&&t<.5,W_=(e,t)=>e>10&&e<38&&t<-18-(e-10)*.2&&t>-39;function G_(e){let t=new G(`paint`),n=Math.round(176/vg)+1,r=new H,i=q.soil.clone().lerp(q.dirt,.35),a=q.soil.clone().multiplyScalar(.78),o=q.lime.clone().lerp(q.wheatTip,.25),s=K(14205040);for(let e=0;e<n;e++)for(let c=0;c<n;c++){let n=-88+c*vg,l=-88+e*vg,[u,d]=xg(n,l),f=N_(u,d),p=Mg(u,d),m=j_(u,d),h=e=>(N_(u+e,d)+N_(u-e,d)+N_(u,d+e)+N_(u,d-e))/4,g=.4*(f-h(2.5))+.6*(f-h(6)),_=xm(u*.07+11,d*.07-4)*.5+.5,v=xm(u*.19-7,d*.19+2)*.5+.5;r.copy(q.meadow).lerp(q.lime,J(0,.18,g)*.6+J(.6,.9,_)*.2).lerp(q.emerald,J(0,.2,-g)*.55+J(.65,.95,1-_)*.25).lerp(q.teal,J(.15,.35,-g)*.35+J(.75,1,v)*.15);let y=J(62,84,Math.max(Math.abs(n),Math.abs(l)));r.lerp(q.emerald.clone().lerp(q.teal,.4),y*.35);let b=Ug(n,l),x=L_[I_],S=i.clone().lerp(a,(.5+.5*Math.sin((l+.6*Math.sin(n*.05))*(2*Math.PI/.9)))*.7);if(r.lerp(x===`young`?q.emerald.clone().lerp(q.moss,.5):x===`bare`?S:q.wheatDeep,J(-.6,.2,b)*.8),U_(n,l)&&r.lerp(q.lime,(1-H_(t_,u,d,1.1))*.35).lerp(q.dirt,(1-H_(t_,u,d,1.2))*.12),W_(n,l)){let e=H_(r_,u,d,.9);r.lerp(q.emerald,e*.4).lerp(q.lime,(1-e)*.25)}let C=e=>J(-.4,.6,Wg(e,n,l));x===`ripe`?r.lerp(q.emerald.clone().lerp(q.moss,.5),Math.max(C(Gg),C(qg)*.6)*.7):(r.lerp(x===`stubble`?q.emerald.clone().lerp(q.moss,.5):S,C(Gg)*.9),r.lerp(x===`young`?q.emerald.clone().lerp(q.moss,.5):x===`stubble`?q.wheatDeep:S,C(qg)*.85)),r.lerp(S,C(Kg)*.95),x===`young`&&r.lerp(q.meadow.clone().lerp(q.moss,.4),C(Kg)*(.5+.3*Math.sin(2*Math.PI/.9*n)));let w=+(Math.sin((n+1.5*Math.sin(l*.08))*(2*Math.PI/7))>0),T=Math.exp(-(((((n+1.5*Math.sin(l*.08))%7+7)%7-3.5)/.45)**2));I_===`summer`&&r.lerp(o.clone().lerp(q.meadow,w*.5),C(Jg)*.6).lerp(s,C(Jg)*T*.75);let E=.5+.5*Math.cos(2*Math.PI/1.7*l);r.lerp(i.clone().lerp(q.moss,.25+E*.3),C(Yg)*.75),r.lerp(i.clone().lerp(q.emerald,E*.35),C(Xg)*.8);let D=xm(u*.6,d*.6)*.25+xm(u*1.7+3,d*1.7)*.1;r.lerp(q.dirt.clone().lerp(q.rut,.3+.3*v),J(-.6,.8,Wg(Zg,n,l)+D*2)*.85),r.lerp(q.dirt.clone().lerp(q.meadow,.35),C(Qg)*.7);for(let e of g_)e.scale&&e.scale>1.4&&e.kind===`broadleaf`&&Math.abs(u-e.x)<6&&Math.abs(d-e.z)<6&&r.lerp(q.teal,(1-J(1.5,5,Math.hypot(u-e.x,d-e.z)))*.25);let O=1-J(.8,1.2,m+D),k=Math.exp(-(((m-.5)/.2)**2)),A=1-J(.12,.3,m+D*.4);r.lerp(q.dirt.clone().lerp(q.rut,k*.5).lerp(q.meadow,A*.55),O*.92);let[ee,te]=m_(u,d),j=(1-J(1.7,2.5,Math.abs(ee)+D))*J(1.2,1.6,te)*(1-J(3.4,4.6,te+D*1.5));r.lerp(q.dirt.clone().lerp(q.meadow,.2),j*.8),r.lerp(q.moss,1-J(1.8,3.4,p)).lerp(q.mud,(1-J(1.45,1.9,p))*.8).lerp(q.bed,1-J(1.1,1.5,p));let ne=Math.min(1,Math.max(.12,Math.max(1-J(1.4,4.2,p),Math.exp(-(((m-zg)/.6)**2))*.9,Math.exp(-((b/.8)**2))*.8,J(.06,.2,Math.abs(g))*.7)+xm(u*.21+3,d*.21-9)*.22+.1)),re=.7+xm(u*.05,d*.05)*.9;t.vertex({x:u,y:f,z:d},P_.normal(u,d),r,[ne,2,re,0])}for(let e=0;e<352;e++)for(let r=0;r<352;r++){let i=e*n+r;t.quad(i,i+1,i+n+1,i+n)}e.add(K_(t.build()),`ground`,{under:!0,fields:{x:0,z:0,side:176,turn:Math.PI/4}})}function K_(e){let t=e.getIndex(),n=e.getAttribute(`position`),r=new R,i=new R,a=new R;for(let e=0;e<t.count;e+=3)if(r.fromBufferAttribute(n,t.getX(e)),i.fromBufferAttribute(n,t.getX(e+1)),a.fromBufferAttribute(n,t.getX(e+2)),(i.z-r.z)*(a.x-r.x)-(i.x-r.x)*(a.z-r.z)<0){let n=t.getX(e+1);t.setX(e+1,t.getX(e+2)),t.setX(e+2,n)}return e}var q_=[Math.cos(.6)*.12,Math.sin(.6)*.12],J_={level:A_,grid:{nx:250,nz:250,cell:1,x0:-125,z0:-125},channel:(e,t)=>Mg(e,t)<1.6,along:(e,t)=>{let n=Og[0],r=1/0;for(let i of Og){let a=i.distance(e,t);a<r&&(r=a,n=i)}let i=n.near(e,t),a=1-J(0,6,-jg(...Sg(e,t)));return[-i.dx*a+q_[0]*(1-a),-i.dz*a+q_[1]*(1-a)]},land:(e,t)=>{let[n,r]=Sg(e,t);return Math.abs(n)<=_g&&Math.abs(r)<=_g}};function Y_(e,t){let n=new G(`crop`),r=Math.round((t.u1-t.u0)/vg)+1,i=Math.round((t.v1-t.v0)/vg)+1,a=(e,n)=>t.tall*J(0,1.1,t.inside(e,n))+.05*t.tall*xm(e*.5,n*.5)-.06,o=(e,t)=>{let[n,r]=xg(e,t);return N_(n,r)+a(e,t)},s=[],c=new H,l=Math.atan2(-1,1);for(let e=0;e<i;e++)for(let i=0;i<r;i++){let r=t.u0+i*vg,a=t.v0+e*vg,[u,d]=xg(r,a),f=.3,p=new R(o(r-f,a)-o(r+f,a),2*f,o(r,a-f)-o(r,a+f)),m=new R((p.x-p.z)*bg,p.y,(-p.x-p.z)*bg).normalize(),h=a-.9*Math.sin(r*.07),g=J(-.35,.35,Math.sin(h*t.rows)+.3*xm(r*.08,a*.3));c.copy(t.base).lerp(t.deep,g*t.banding).lerp(t.tip,J(.5,.9,xm(r*.06+9,a*.09))*.3).lerp(t.root,(1-J(.2,1.2,t.inside(r,a)))*.35),n.vertex({x:u,y:o(r,a),z:d},m,c,[.5,1.3,l,0]),s.push(t.inside(r,a)>-.5)}for(let e=0;e<i-1;e++)for(let t=0;t<r-1;t++){let i=e*r+t;(s[i]||s[i+1]||s[i+r]||s[i+r+1])&&n.quad(i,i+1,i+r+1,i+r)}if(e.add(K_(n.build()),`crop`),!t.stalks)return;let u=new G(`grass`),d=vm(t.seed),f=new R(0,1,0);for(let e=0,n=0;n<t.stalks&&e<t.stalks*16;e++){let e=t.u0+d()*(t.u1-t.u0),r=t.v0+d()*(t.v1-t.v0),i=t.inside(e,r);if(i<.05||i>1.3||!wg(e,r))continue;n++;let[a,o]=xg(e,r),s=N_(a,o),c=(.45+J(0,1.1,i)*.45+d()*.15)*t.tall/.8,l=(d()-.5)*.12,p=d()*Math.PI,m=d(),h=Math.cos(p)*.026,g=Math.sin(p)*.026,_=[.5,1.4,.4,.8],v=new R(a+l,s+c,o+l*.5),y=t.root.clone(),b=(t.stalkTip??t.tip).clone().lerp(t.deep,d()*.6),x=u.vertex({x:a-h,y:s,z:o-g},f,y,_,[0,0],[0,m,-.026,p]),S=u.vertex({x:a+h,y:s,z:o+g},f,y,_,[0,0],[0,m,.026,p]),C=u.vertex({x:v.x+h*.6,y:v.y-.16,z:v.z+g*.6},f,y.clone().lerp(b,.7),_,[0,0],[.8,m,.0156,p]),w=u.vertex({x:v.x-h*.6,y:v.y-.16,z:v.z-g*.6},f,y.clone().lerp(b,.7),_,[0,0],[.8,m,-.0156,p]);u.quad(x,S,C,w);let T=u.vertex({x:v.x-h*2.2,y:v.y-.06,z:v.z-g*2.2},f,b,_,[0,0],[.9,m,-.0572,p]),E=u.vertex({x:v.x+h*2.2,y:v.y-.06,z:v.z+g*2.2},f,b,_,[0,0],[.9,m,.0572,p]),D=u.vertex({x:v.x+l*.3,y:v.y+.12,z:v.z},f,b,_,[0,0],[1,m]);u.tri(w,C,E),u.tri(w,E,D),u.tri(w,D,T)}e.add(u.build(),`grass`,{castShadow:!1,seasonal:!1})}function X_(e){let t=L_[I_],n={base:K(8171594),deep:K(5936194),tip:K(11061344),root:K(5144120),stalkTip:K(10273882)},r={base:K(14730362),deep:K(12095560),tip:K(15654044),root:K(10521162),stalks:0,banding:.9};if(t!==`bare`&&Y_(e,{u0:-14,u1:yg,v0:4,v1:yg,inside:Ug,tall:.8,base:q.wheat,deep:q.wheatDeep,tip:q.wheatTip,root:q.wheatRoot,rows:1.7,banding:.7,stalks:2600,seed:5,...t===`young`?{...n,tall:.4,stalks:1400}:t===`stubble`?{...r,tall:.14}:{}}),t!==`bare`&&Y_(e,{...qg,u0:qg.u0-1,u1:qg.u1+1,v0:qg.v0-1,v1:qg.v1+1,inside:(e,t)=>Wg(qg,e,t),tall:.7,base:K(10271818),deep:K(7248446),tip:K(13815920),root:K(6195770),rows:2.2,banding:.5,stalks:1800,stalkTip:K(13159530),seed:6,...t===`young`?{...n,tall:.35,stalks:1e3}:t===`stubble`?{...r,tall:.12}:{}}),t===`young`||t===`bare`)return;let i=t===`stubble`,a=Gg,o=(e,t)=>Wg(a,e,t);Y_(e,{u0:a.u0-1,u1:a.u1+1,v0:a.v0-1,v1:a.v1+1,inside:o,tall:1.35,base:K(5147194),deep:K(3107386),tip:K(8038462),root:K(4091446),rows:3.6,banding:.6,stalks:0,seed:7,...i?{base:K(8024128),deep:K(5130796),tip:K(10127952),root:K(5263406)}:{}});let s=new G(`foliage`),c=vm(171),l=K(16171572),u=K(i?4861984:6963238),d=K(i?9075268:5937724);for(let e=a.v0+.6;e<a.v1;e+=.75)for(let t=a.u0+.4+(c()-.5)*.3;t<a.u1;t+=.55+(c()-.5)*.12){let n=t+(c()-.5)*.15,r=e+(c()-.5)*.12,a=o(n,r);if(a<.3)continue;let[f,p]=xg(n,r),m=N_(f,p)+1.35*J(0,1.1,a)+.15+c()*.25,[h,g]=xg(-.4,-.5),_=new R(h,i?-.1:.8,g).normalize(),v=new R(f,m,p);c()<.3&&Z_(s,v.clone().add(new R(0,-.2,0)),_,d.clone().offsetHSL(0,0,(c()-.5)*.08),.2,c());let y=l.clone().offsetHSL((c()-.5)*.02,0,(c()-.5)*.08),b=.17+c()*.04,x=c();i||Z_(s,v,_,y,b,x),Z_(s,v.clone().add(new R(0,.02,0)),_,u.clone().offsetHSL(0,0,(c()-.5)*.06),(.075+c()*.02)*(i?1.4:1),c())}e.add(s.build(),`foliage`,{castShadow:!0,cover:`none`})}function Z_(e,t,n,r,i,a){let o=e.vertex(t,n,r,[.2,1,-1,.5],[0,0],[-1,-1,i,a]);e.vertex(t,n,r,[.2,1,-1,.5],[0,0],[1,-1,i,a]),e.vertex(t,n,r,[.2,1,-1,.5],[0,0],[1,1,i,a]),e.vertex(t,n,r,[.2,1,-1,.5],[0,0],[-1,1,i,a]),e.quad(o,o+1,o+2,o+3)}function Q_(e){let t=new G(`ink`),n=yt.degToRad(22),r=new bt().setFromEuler(new Mn(n,0,0,`YXZ`)),i=[1,8,4,0],a=2.3;for(let[e,n]of a_){let[o,s]=xg(e,n),c=N_(o,s),l=new R(o,c+1.6,s),u=new V().compose(l,r,new R(1,1,1));t.addGeometry(new qr(4,.1,a),u,q.ceramic,[0,1,0,0]);let d=new R(0,1,0).applyQuaternion(r),f=(e,t)=>new R(e*1.93,.055,t*(a/2-.07)).applyMatrix4(u),p=t.vertex(f(-1,-1),d,q.glass,i,[0,0]),m=t.vertex(f(1,-1),d,q.glass,i,[1,0]),h=t.vertex(f(1,1),d,q.glass,i,[1,1]),g=t.vertex(f(-1,1),d,q.glass,i,[0,1]);t.quad(p,g,h,m);for(let e of[-1,1]){let n=o+e*4*.3;t.addGeometry(new ba(.07,.09,1.6,8),new V().makeTranslation(n,c+.78,s),q.brass,[0,1,0,0])}t.addGeometry(new qr(3,.09,.12),new V().makeTranslation(o,c+1.48,s),q.brass,[0,1,0,0])}e.add(t.build(),`ink`)}function $_(e){let t=new G(`ink`),n=vm(17),r=(e,r,i,a=1)=>{for(let i of e){let e=a+(n()-.5)*.1,o=new bt().setFromEuler(new Mn((n()-.5)*.08,n()*Math.PI,(n()-.5)*.08));t.addGeometry(new qr(.11,e,.11),new V().compose(i.clone().add(new R(0,e/2-.1,0)),o,new R(1,1,1)),r.clone().offsetHSL(0,0,(n()-.5)*.06),[0,1,0,0])}for(let a=0;a<e.length-1;a++){let o=e[a],s=e[a+1];for(let e of i){let i=o.clone().add(new R(0,e+(n()-.5)*.06,0)),a=s.clone().add(new R(0,e+(n()-.5)*.06,0)),c=a.clone().sub(i),l=c.length()+.25,u=new bt().setFromUnitVectors(new R(1,0,0),c.normalize());t.addGeometry(new qr(l,.075,.055),new V().compose(i.clone().lerp(a,.5),u,new R(1,1,1)),r.clone().offsetHSL(0,0,(n()-.5)*.08),[0,1,0,0])}}},i=(e,t,i,a)=>{let o=[];for(let r=t;r<=i;r+=2.3+(n()-.5)*.3){let t=e.at(r),n=t.x-t.dz*a,i=t.z+t.dx*a,[s,c]=Sg(n,i);wg(s,c,1)&&o.push(new R(n,N_(n,i),i))}r(o,q.fence,[.42,.78])},a=(e,t,n)=>e.near(...xg(t,n)).along;i(Ng,a(Ng,-11,4),a(Ng,27,8),-1.55),i(Ng,a(Ng,-36,7),a(Ng,-17,5),1.55),i(Ig,a(Ig,19,-12.5),a(Ig,36,-17),1.55),i(Ng,a(Ng,-88,12.8),a(Ng,-70,11),-1.55),i(Ng,a(Ng,72,9),a(Ng,88,6.3),-1.55),i(Ig,a(Ig,42,-18.3),a(Ig,88,-22.6),-1.55),i(Lg,a(Lg,-24,37.8),a(Lg,33,37),-1.55);let o=K(15656658),s=[[Qg.u0,Qg.v0],[Qg.u1,Qg.v0],[Qg.u1,Qg.v1],[Qg.u0,Qg.v1]];for(let e=0;e<4;e++){let[i,a]=s[e],[c,l]=s[(e+1)%4],u=Math.hypot(c-i,l-a),d=[];for(let t=0;t<=u+.01;t+=2){let n=t/u,r=i+(c-i)*n,o=a+(l-a)*n;if(e===2&&Math.abs(r-60.5)<1.1)continue;let[s,f]=xg(r,o);d.push(new R(s,N_(s,f),f))}let f=Math.atan2(-(xg(c,l)[1]-xg(i,a)[1]),xg(c,l)[0]-xg(i,a)[0]);for(let e=0;e<d.length-1;e++){let i=d[e],a=d[e+1];if(!(i.distanceTo(a)>2.5)){r([i,a],o,[.25,.7],1.05);for(let e=.07;e<1;e+=.15/i.distanceTo(a)){let r=i.clone().lerp(a,e);t.addGeometry(new qr(.08,.85,.035),new V().compose(r.add(new R(0,.42,0)),new bt().setFromEuler(new Mn(0,f,0)),new R(1,1,1)),o.clone().offsetHSL(0,0,(n()-.5)*.04),[0,1,0,0])}}}}{let e=[];for(let t=0;t<=10;t++){let n=t/10*Math.PI*2,[r,i]=xg(72.5+Math.cos(n)*3.4,8+Math.sin(n)*3.2);e.push(new R(r,N_(r,i),i))}r(e,q.fence.clone().lerp(q.timber,.3),[.25,.55,.85],.95)}e.add(t.build(),`ink`)}function ev(e){let t=new G(`ink`),n=vm(29),r=(e,r,i,a,o)=>{let s=Math.atan2(-e.dz,e.dx),c=new bt().setFromEuler(new Mn(0,s,0)),l=(t,n,r)=>new R(e.x+e.dx*t-e.dz*n,r,e.z+e.dz*t+e.dx*n);for(let e=-r/2;e<r/2;e+=.3){let r=q.timber.clone().lerp(q.fence,.4).offsetHSL(0,0,(n()-.5)*.08),o=new bt().setFromEuler(new Mn((n()-.5)*.03,s,0));t.addGeometry(new qr(.26,.07,i+(n()-.5)*.12),new V().compose(l(e+.13,0,a),o,new R(1,1,1)),r,[0,1,0,0])}for(let e of[-1,1])if(t.addGeometry(new qr(r+.4,.2,.16),new V().compose(l(0,e*(i/2-.15),a-.13),c,new R(1,1,1)),q.bark.clone().lerp(q.fence,.3),[0,1,0,0]),!o)t.addGeometry(new qr(r,.1,.1),new V().compose(l(0,e*(i/2-.05),a+.08),c,new R(1,1,1)),q.fence,[0,1,0,0]);else for(let n=-r/2+.3;n<=r/2;n+=2)t.addGeometry(new qr(.16,1.9,.16),new V().makeTranslation(...l(n,e*(i/2+.02),a-.75).toArray()),q.bark.clone().lerp(q.fence,.2),[0,1,0,0])};for(let e of[Pg,Ng]){let t={d:1/0,s:0};for(let n=0;n<e.length;n+=.25){let r=e.at(n),i=Eg.distance(r.x,r.z);i<t.d&&(t={d:i,s:n})}r(e.at(t.s),6.4*kg,2,A_+.5,!1)}let[i,a]=xg(...u_.from),[o,s]=xg(...u_.to),c=Math.hypot(o-i,s-a);r({x:(i+o)/2,z:(a+s)/2,dx:(o-i)/c,dz:(s-a)/c},c,u_.width,A_+.45,!0),e.add(t.build(),`ink`)}function tv(e){let t=new G(`paint`),n=new G(`foliage`),r=new G(`ink`),i=vm(61);for(let e of t_)for(let a=.6;a<e.length-.4;a+=1.5+(i()-.5)*.3){let o=e.at(a);if(Dm(t,n,P_,{kind:`bush`,x:o.x,z:o.z,seed:0,scale:.8+i()*.2,leaf:n_,fruit:q.apple,fruitDensity:3},i),i()<.5){let e=o.x+o.dz*.45,t=o.z-o.dx*.45,n=N_(e,t);r.addGeometry(new qr(.06,1.1,.06),new V().makeTranslation(e,n+.45,t),q.fence,[0,1,0,0])}}e.add(t.build(),`paint`),e.add(n.build(),`foliage`),e.add(r.build(),`ink`)}function nv(e,t,n=1){let[r,i]=Sg(e,t);return!wg(r,i,1)||Mg(e,t)<2.6||j_(e,t)<zg+n||e_(r,i,n)||Ug(r,i)>-1.5||p_(r,i,2+n)||av(e,t)||W_(r,i)||Wg(i_,r,i)>-1}function rv(e){let t=new G(`paint`),n=new G(`foliage`);for(let e of g_)Dm(t,n,P_,e,vm(e.seed));let r=vm(71);for(let[e,i,a,o]of[[Fg,2,17,-1],[Pg,2,14,1]])for(let s=i;s<a;s+=1.1+r()*.6){let i=e.at(s),a=o*(1.9500000000000002+r()*.3);Dm(t,n,P_,{kind:`bush`,x:i.x-i.dz*a,z:i.z+i.dx*a,seed:0,scale:1.1+r()*.4,leaf:q.emerald},r)}for(let e of Og)for(let i=1;i<e.length-1;i+=1.6+r()*1.4){if(xm(i*.12,3)<-.15)continue;let a=e.at(i),o=(r()<.5?-1:1)*(2.5+r()*1.2)*kg,s=a.x-a.dz*o,c=a.z+a.dx*o,[l,u]=Sg(s,c);!wg(l,u,1)||j_(s,c)<2.05||av(s,c)||p_(l,u,2)||Mg(s,c)<2.2||Dm(t,n,P_,{kind:r()<.25?`round`:`bush`,x:s,z:c,seed:0,scale:1.1+r()*.6,leaf:q.leaf.clone().lerp(q.deepLeaf,r()*.7)},r)}for(let[e,i]of E_)for(let a=0,o=2+Math.floor(r()*3);a<o;a++){let[a,o]=xg(e+(r()-.5)*2.6,i+(r()-.5)*1.8);nv(a,o,.6)||Dm(t,n,P_,{kind:`bush`,x:a,z:o,seed:0,scale:1+r()*.5,leaf:q.leaf.clone().lerp(q.emerald,r())},r)}for(let e of O_)for(let i=.5;i<e.length;i+=1.15+r()*.5){let a=e.at(i),o=(r()-.5)*.5,s=a.x-a.dz*o,c=a.z+a.dx*o,[l,u]=Sg(s,c);!wg(l,u,1)||j_(s,c)<1.55||p_(l,u,1)||(r()<.06?Dm(t,n,P_,{kind:`broadleaf`,x:s,z:c,seed:0,scale:1.1+r()*.5,leaf:q.leaf.clone().lerp(q.deepLeaf,.2+r()*.5)},r):Dm(t,n,P_,{kind:`bush`,x:s,z:c,seed:0,scale:1.15+r()*.45,leaf:q.emerald.clone().lerp(q.deepLeaf,r()*.6).lerp(q.leaf,r()*.3)},r))}let i=[q.leaf,q.deepLeaf,q.emerald.clone().lerp(q.deepLeaf,.4),q.leaf.clone().lerp(q.teal,.3),q.leafLight.clone().lerp(q.deepLeaf,.5)];for(let e=-86;e<87;e+=4.2)for(let a=-86;a<87;a+=4.2){let o=a+(r()-.5)*3.5,s=e+(r()-.5)*3.5,c=Math.max(J(70,76,s),J(-80,-86,s)*.7,J(79,85,o)*.85,J(-80,-86,o)*.8,J(36,46,s)*J(-58,-68,o)),l=xm(o*.06+17,s*.06-5)*.5+.5;if(r()>c*(.35+.75*l))continue;let[u,d]=xg(o,s);if(nv(u,d,1))continue;let f=r(),p=f<.14?`cypress`:f<.3?`round`:`broadleaf`,m={kind:p,x:u,z:d,seed:0,scale:p===`cypress`?1.2+r()*.5:p===`round`?1.1+r()*.4:1.3+r()*.8,leaf:p===`cypress`?q.cypress:i[Math.floor(r()*i.length)]};iv.push(m),Dm(t,n,P_,m,r)}e.add(t.build(),`paint`),e.add(n.build(),`foliage`)}var iv=[];function av(e,t){let[n,r]=Sg(e,t);return[...[...__,...v_,b_,...C_()].map(([e,t])=>[e,t]),...y_,...x_,...w_,T_].some(([e,t])=>Math.hypot(n-e,r-t)<2.2)}function ov(e){let t=new G(`paint`),n=new G(`foliage`),r=vm(83);for(let e of r_)for(let i=.8;i<e.length;i+=1.9){let a=e.at(i);Dm(t,n,P_,{kind:`round`,x:a.x,z:a.z,seed:0,scale:.7+r()*.15,leaf:q.leaf.clone().lerp(q.emerald,r()*.5)},r)}e.add(t.build(),`paint`),e.add(n.build(),`foliage`)}function sv(e){let t=new G(`foliage`),n=new G(`ink`),r=vm(131),i=(e,t)=>{let[n,r]=xg(e,t);return{x:n,z:r,y:N_(n,r)}},a=K(10123464),o=K(6969512),s=K(8032368);if(I_!==`summer`){let e=K(9084038),t=I_===`spring`?a:I_===`autumn`?K(10129052):e,n=I_===`spring`?.15:I_===`autumn`?.45:0;a.copy(e).lerp(t,n),o.copy(K(6716012)).lerp(t,n*.5)}for(let e=Yg.v0+1;e<Yg.v1;e+=1.7)for(let n=Yg.u0+.6;n<Yg.u1;n+=.9+(r()-.5)*.1){if(Wg(Yg,n,e)<.3)continue;let c=i(n+(r()-.5)*.1,e);jm(t,c.x,c.y,c.z,.5+r()*.08,.5+r()*.08,a.clone().lerp(o,r()*.5),s,26,r)}let c=K(8038544),l=K(4881002);for(let e=Xg.v0+.6;e<Xg.v1;e+=.9)for(let n=Xg.u0+.5;n<Xg.u1;n+=.6+(r()-.5)*.06){if(Wg(Xg,n,e)<.3)continue;let a=i(n+(r()-.5)*.08,e+(r()-.5)*.08);jm(t,a.x,a.y,a.z,.3+r()*.05,.28,c.clone().lerp(l,r()*.4),l,10,r)}let u=q.timber.clone().lerp(q.fence,.5),d=[K(6989898),K(4885082),K(9091146),K(5937786)],f=[];for(let e=0;e<4;e++)f.push([58.5+e*5.4,-13.5]),f.push([58.5+e*5.4,-10.3]);f.push([59,-5.5],[59,-2.7]),f.forEach(([e,a],o)=>{let s=i(e,a),c=Math.PI/4+Math.PI/2*0,l=new bt().setFromEuler(new Mn(0,c,0));for(let[e,t,i,a]of[[0,-.6,5,.08],[0,.6,5,.08],[-2.5,0,.08,1.28],[2.5,0,.08,1.28]]){let o=new R(e,0,t).applyQuaternion(l);n.addGeometry(new qr(i,.32,a),new V().compose(new R(s.x+o.x,s.y+.12,s.z+o.z),l,new R(1,1,1)),u.clone().offsetHSL(0,0,(r()-.5)*.06),[2,1,0,0])}n.addGeometry(new qr(4.92,.05,1.12),new V().compose(new R(s.x,s.y+.24,s.z),l,new R(1,1,1)),q.soil.clone().multiplyScalar(.8),[0,1,0,0]);let f=o%4;for(let e=-2.2;e<=2.2;e+=f===1?.55:.4)for(let i of f===3?[0]:[-.28,.28]){let a=new R(e,0,i).applyQuaternion(l),o=s.x+a.x,c=s.z+a.z;if(f===3)n.addGeometry(new qr(.035,1.3,.035),new V().makeTranslation(o,s.y+.85,c),q.fence,[0,1,0,0]),(I_===`summer`||I_===`autumn`)&&jm(t,o,s.y+.3,c,.25,.95,K(5147194),K(4091446),16,r,q.apple);else{let e=d[(f+Math.floor(r()*2))%d.length];jm(t,o,s.y+.24,c,f===1?.27:.2,f===1?.26:.22,e.clone().offsetHSL(0,0,(r()-.5)*.06),e.clone().multiplyScalar(.75),9,r)}}}),e.add(t.build(),`foliage`,{cover:`none`,seasonal:!0}),e.add(n.build(),`ink`)}function cv(e){let t=new G(`ink`),n=vm(97),r=(e,n,r,i,a,o)=>t.addGeometry(new qr(e,n,r),new V().compose(i,new bt().setFromEuler(new Mn(0,a,0)),new R(1,1,1)),o,[0,1,0,0]),i=(e,t,n)=>{let[r,i]=xg(e,t),a=N_(r,i);return(e,t,o)=>new R(r+e*Math.cos(n)+o*Math.sin(n),a+t,i-e*Math.sin(n)+o*Math.cos(n))},a=(e,n,r)=>t.addGeometry(new Ea(e,1),new V().makeTranslation(n.x,n.y,n.z),r,[0,1,0,0]),o=()=>q.apple.clone().offsetHSL((n()-.5)*.05,0,(n()-.5)*.1),s=(e,t,s,c,l=0)=>{let u=i(e,t,s),d=q.crate.clone().offsetHSL(0,0,(n()-.5)*.06),f=1.4,p=.95,m=.62;r(f,.07,p,u(0,l+.05,0),s,d);for(let[e,t,n,i]of[[0,-.95/2,f,.06],[0,p/2,f,.06],[-1.4/2,0,.06,p],[f/2,0,.06,p]])for(let a=.14;a<m;a+=.2)r(n,.15,i,u(e,l+a,t),s,d);for(let e of[-1.4/2,f/2])for(let t of[-.95/2,p/2])r(.1,m,.1,u(e,l+m/2,t),s,d.clone().multiplyScalar(.85));if(c){r(1.2999999999999998,.42,.85,u(0,l+.52/2,0),s,q.apple.clone().multiplyScalar(.7));for(let e=0;e<34;e++)a(.085,u((n()-.5)*1.2,l+m-.05+n()*.08,(n()-.5)*.75),o())}};for(let[e,t,n]of __)s(e,t,n,!0);for(let[e,t,n]of v_)s(e,t,n,!1),s(e,t,n+.08,!1,.66);for(let[e,r]of y_){let[s,,c]=i(e,r,n()*3)(0,0,0).toArray(),l=N_(s,c);t.addGeometry(new ba(.34,.26,.32,8,1,!0),new V().makeTranslation(s,l+.16,c),q.timber,[2,1,0,0]),t.addGeometry(new Oa(.34,.035,4,12),new V().makeRotationX(Math.PI/2).setPosition(s,l+.32,c),q.timber.clone().multiplyScalar(.8),[0,1,0,0]),t.addGeometry(new ba(.3,.28,.06,8),new V().makeTranslation(s,l+.27,c),q.apple.clone().multiplyScalar(.7),[0,1,0,0]);for(let e=0;e<9;e++){let e=n()*6.28,t=n()*.22;a(.075,new R(s+Math.cos(e)*t,l+.33+n()*.06,c+Math.sin(e)*t),o())}}{let[e,s,c]=b_,l=i(e,s,c),u=K(5212778);r(1.1,.08,.7,l(0,.42,0),c,u);for(let e of[-.35,.35])r(1.1,.26,.05,l(0,.55,e),c,u);for(let e of[-.55,.55])r(.05,.26,.7,l(e,.55,0),c,u);for(let e of[-.22,.22])r(1.9,.06,.06,l(-.25,.38,e),c,q.timber),r(.06,.38,.06,l(-.5,.19,e),c,q.timber);t.addGeometry(new ba(.24,.24,.08,12).rotateX(Math.PI/2).rotateY(c),new V().makeTranslation(...l(.75,.24,0).toArray()),q.bark,[0,1,0,0]);for(let e=0;e<10;e++)a(.08,l((n()-.5)*.8,.56+n()*.05,(n()-.5)*.45),o())}let c=[K(15917752),K(10275032),K(15775904),K(13162650)];x_.forEach(([e,a],o)=>{let s=i(e,a,.8+(n()-.5)*.2),l=.8,u=c[o%c.length];r(.62,.2,.62,s(0,.1,0),l,q.timber.clone().multiplyScalar(.8));for(let e=0;e<2+o%2;e++)r(.55,.26,.55,s(0,.33+e*.27,0),l,u.clone().offsetHSL(0,0,e%2*.04));let d=.33+(2+o%2)*.27-.08;t.addGeometry(new xa(.48,.18,4,1).rotateY(Math.PI/4+l),new V().makeTranslation(...s(0,d+.09,0).toArray()),q.ceramic,[0,1,0,0])});for(let[e,r,a]of C_()){let o=i(e,r,a),s=.62,c=K(14860138).offsetHSL((n()-.5)*.02,0,(n()-.5)*.06);t.addGeometry(new ba(s,s,1.15,18).rotateX(Math.PI/2).rotateY(a),new V().makeTranslation(...o(0,.57,0).toArray()),c,[2,1,0,0])}for(let[e,n]of w_){let r=i(e,n,0)(0,0,0);t.addGeometry(new ba(.3,.3,.85,12),new V().makeTranslation(r.x,r.y+.42,r.z),q.crate.clone().multiplyScalar(.9),[2,1,0,0]);for(let e of[.15,.7])t.addGeometry(new ba(.315,.315,.05,12),new V().makeTranslation(r.x,r.y+e,r.z),q.brass.clone().multiplyScalar(.7),[0,1,0,0])}{let e=i(56,18,Math.PI/4+Math.PI/2);for(let r=0;r<4;r++)for(let i=0;i<9-r;i++)t.addGeometry(new ba(.1,.1,.6,7).rotateX(Math.PI/2).rotateY(Math.PI/4+Math.PI/2),new V().makeTranslation(...e(-.9+i*.2+r*.1,.1+r*.18,0).toArray()),q.bark.clone().lerp(q.timber,.3+n()*.3),[2,1,0,0]);let a=i(-10,-44.5,Math.PI/4+.2),o=Math.PI/4+.2;r(1.6,.06,.4,a(0,.45,0),o,q.timber);for(let e of[-.65,.65])r(.08,.45,.36,a(e,.22,0),o,q.timber.clone().multiplyScalar(.85));r(1.6,.3,.05,a(0,.72,-.2),o,q.timber)}let[l,u]=xg(...T_),d=N_(l,u),f=.5,p=(e,t,n)=>new R(l+e*Math.cos(f)+n*Math.sin(f),d+t,u-e*Math.sin(f)+n*Math.cos(f));r(2,.08,.9,p(0,.76,0),f,q.timber),r(1.7,.02,.75,p(0,.81,0),f,K(15261900));for(let e of[-.8,.8])r(.1,.74,.7,p(e,.37,0),f,q.timber.clone().multiplyScalar(.85));for(let e of[-.75,.75]){r(1.9,.07,.3,p(0,.45,e),f,q.timber);for(let t of[-.75,.75])r(.08,.42,.25,p(t,.21,e),f,q.timber.clone().multiplyScalar(.85))}let m=[q.apple,K(15902778),K(9225290),K(10111664)];for(let e=0;e<5;e++){let t=-.7+e*.35;r(.26,.12,.24,p(t,.88,(n()-.5)*.3),f,q.crate),r(.22,.05,.2,p(t,.95,0),f,m[e%m.length])}e.add(t.build(),`ink`)}function lv(e){let t=new G(`paint`),n=vm(91),r=(e,r,i,a,o)=>{for(let s of Og)for(let c=0;c<e*s.length/70;c++){let e=s.at(n()*s.length),c=(r+n()*(i-r))*kg,l=n()<.5?-1:1,u=e.x-e.dz*c*l,d=e.z+e.dx*c*l,[f,p]=Sg(u,d);!wg(f,p,1)||jg(f,p)<0||Om(t,P_,u,d,a+n()*o,.4,n,A_)}};r(170,0,1.5,.07,.13),r(40,1.35,2.3,.18,.28);for(let e=0;e<120;e++){let e=n()*Math.PI*2,r=.92+n()*.2,[i,a]=xg(Ag.u+Math.cos(e)*Ag.a*r,Ag.v+Math.sin(e)*Ag.b*r);j_(i,a)<1.35||Om(t,P_,i,a,.08+n()*.2,.4,n,A_)}for(let[e,r,i,a]of[[-33,10,3,.3],[-29,6.8,3,.3],[-20,8,3,.3],[-34,15,3,.3],[-58,41,9,.7],[-54,46,6,.6],[-47,60,4,.45],[20,74,5,.6],[-70,-26,4,.5]])for(let o=0;o<i;o++){let[o,s]=xg(e+(n()-.5)*(2+i*.5),r+(n()-.5)*(1.5+i*.4));Om(t,P_,o,s,a+n()*a*1.1,.35,n)}for(let e of D_)for(let r=0;r<e.length;r+=.42){let i=e.at(r),[a,o]=Sg(i.x,i.z);if(!wg(a,o,.8)||j_(i.x,i.z)<1.4500000000000002||Mg(i.x,i.z)<2.2)continue;let s=N_(i.x,i.z);for(let e=0;e<2;e++){let r=(n()-.5)*.08;Om(t,P_,i.x-i.dz*r,i.z+i.dx*r,.26+n()*.06,0,n,-1/0,s+e*.3-.05)}n()<.4&&Om(t,P_,i.x,i.z,.22,0,n,-1/0,s+.55)}for(let e=0;e<9;e++){let[r,i]=xg(-33+e*1.6+(n()-.5)*.4,-30+e*.9+(n()-.5)*.4);Om(t,P_,r,i,.28+n()*.06,.45,n)}e.add(t.build(),`paint`,{under:!0});let i=new G(`grass`);for(let e of Og)for(let t=0;t<90*e.length/70;t++){let t=e.at(n()*e.length),r=(n()<.5?-1:1)*(1.45+n()*.5)*kg,a=t.x-t.dz*r,o=t.z+t.dx*r,[s,c]=Sg(a,o);!wg(s,c,1)||jg(s,c)<.5||Am(i,P_,a,o,n)}for(let e=0;e<200;e++){let e=n()*Math.PI*2;if(n()>.35+.65*Math.max(0,Math.sin(e)))continue;let t=.93+n()*.12,[r,a]=xg(Ag.u+Math.cos(e)*Ag.a*t,Ag.v+Math.sin(e)*Ag.b*t);j_(r,a)<1.65||Mg(r,a)<1.2||Am(i,P_,r,a,n)}e.add(i.build(),`grass`,{castShadow:!1})}function uv(e){let t=new G(`grass`),n=new G(`foliage`),r=new G(`grass`),i=new G(`foliage`),a=vm(77),o=(e,t)=>{let[n,r]=Sg(e,t);return!wg(n,r)||Ug(n,r)>-.2||j_(e,t)<.9500000000000001||Mg(e,t)<1.6||e_(n,r,.2)||p_(n,r,.3)||g_.some(n=>Math.abs(e-n.x)<1&&Math.abs(t-n.z)<1&&Math.hypot(e-n.x,t-n.z)<.4*(n.scale??1))},s=(e,t)=>{let n=xm(e*.07+11,t*.07-4)*.5+.5;return q.meadow.clone().lerp(q.lime,J(.45,.85,n)*.8).lerp(q.emerald,J(.55,.9,1-n)*.7)},c=g_.filter(e=>(e.scale??1)>.5),l=0;for(let e=0;l<46e3&&e<9e5;e++){let[e,n]=xg((a()*2-1)*_g,(a()*2-1)*_g);if(o(e,n))continue;let[i,u]=Sg(e,n),d=0;for(let t of c){let r=e-t.x,i=n-t.z,a=2.2*(t.scale??1);Math.abs(r)<a&&Math.abs(i)<a&&(d=Math.max(d,1-J(.4,a,Math.hypot(r,i))))}let f=Math.max(1-J(1.6,3.4,Mg(e,n)),1-J(zg,2.25,j_(e,n)),1-J(.2,1.6,-Ug(i,u)),d),p=Math.min(1,Math.max(f,J(.55,.9,xm(e*.09+40,n*.09)*.5+.5)*.7));a()>p*.95+.04||(l++,km(h_(e,n)?r:t,P_,e,n,.18+p*.32,s(e,n),a))}let u=[K(15764400),K(16249572),K(16109374),K(10975960),K(15226698)],d={spring:300,summer:380,autumn:120,winter:0}[I_];for(let e=0;e<d;e++){let[t,r]=[(a()*2-1)*_g,(a()*2-1)*_g];e%4==0&&(t=-40+(a()-.5)*30,r=50+(a()-.5)*24);let[s,c]=xg(t,r);Mm(h_(s,c,1.4)?i:n,P_,s,c,u[Math.floor(a()*u.length)],6+Math.floor(a()*14),a,(e,t)=>!o(e,t))}e.add(t.build(),`grass`,{castShadow:!1}),e.add(n.build(),`foliage`,{castShadow:!1,cover:`none`})}var dv=class{gl;gpu;frames=[];ext;pool=[];current=null;frame={cpu:{},queries:[]};waiting=[];constructor(e){this.gl=e,this.ext=e.getExtension(`EXT_disjoint_timer_query_webgl2`),this.gpu=this.ext!==null}mark(e,t=!0){let n=performance.now(),r=this.gl,i=this.ext;if(this.current&&(this.frame.cpu[this.current.name]=(this.frame.cpu[this.current.name]??0)+n-this.current.cpu,i&&this.current.gpu&&r.endQuery(i.TIME_ELAPSED_EXT)),this.current=e===null?null:{name:e,cpu:n,gpu:t},e!==null&&i&&t){let t=this.pool.pop()??r.createQuery();r.beginQuery(i.TIME_ELAPSED_EXT,t),this.frame.queries.push([e,t])}}endFrame(){this.mark(null);let e={cpu:this.frame.cpu,gpu:null};this.frames.push(e),this.ext&&this.waiting.push({times:e,queries:this.frame.queries}),this.frame={cpu:{},queries:[]},this.poll()}poll(){let e=this.gl,t=this.ext;if(t){if(e.getParameter(t.GPU_DISJOINT_EXT))for(let t of this.waiting.splice(0))for(let[,n]of t.queries)e.deleteQuery(n);else for(;this.waiting.length;){let t=this.waiting[0];if(!t.queries.every(([,t])=>e.getQueryParameter(t,e.QUERY_RESULT_AVAILABLE)))break;this.waiting.shift();let n={};for(let[r,i]of t.queries)n[r]=(n[r]??0)+e.getQueryParameter(i,e.QUERY_RESULT)/1e6,this.pool.push(i);t.times.gpu=n}}}async settle(){for(let e=0;this.waiting.length&&e<600;e++)await new Promise(e=>setTimeout(e,5)),this.poll()}reset(){this.frames.length=0}},fv=[`setup`,`shelter`,`clouds`,`shadow`,`under`,`reflect`,`main`,`post`],pv=[`ground`,`paint`,`grass`,`foliage`,`crop`,`ink`,`water`,`debris`,`rain`],mv=sf.storm;function hv(){let e=[[`720p`,1280,720],[`1080p`,1920,1080],[`1440p`,2560,1440],[`4K`,3840,2160]],t=[];for(let[n,r,i]of e)t.push({label:`${n} calm`,width:r,height:i,wind:0}),t.push({label:`${n} storm`,width:r,height:i,wind:mv});for(let e of pv)t.push({label:`1080p storm, no ${e}`,width:1920,height:1080,wind:mv,hide:[e]});return t.push({label:`1080p storm, shelter every frame`,width:1920,height:1080,wind:mv,shelter:!0}),t.push({label:`1080p storm, fog`,width:1920,height:1080,wind:mv,weather:Mp.fog}),t.push({label:`1080p storm, dust`,width:1920,height:1080,wind:mv,weather:Mp.dust}),t.push({label:`1080p storm, heat wave`,width:1920,height:1080,wind:mv,weather:Mp[`heat-wave`]}),t}async function gv(e,t,n,r,i=()=>{},a=90){let o=e.gl.getContext(),s=new dv(o),c=new Uint8Array(4),l=()=>o.readPixels(0,0,1,1,o.RGBA,o.UNSIGNED_BYTE,c),u=()=>new Promise(e=>requestAnimationFrame(e)),d=[],f=20,p=e.view,m=p.zoom,h=new Gt(1,1,{depthBuffer:!1});e.output=h;try{for(let[c,g]of r.entries()){e.resize(g.width/e.pixelRatio,g.height/e.pixelRatio),h.setSize(o.drawingBufferWidth,o.drawingBufferHeight),p.zoom=m*g.height/1080,p.update(0,!0),n(),g.weather&&e.setWeather(g.weather,!0);let r=uf(g.wind,31*Math.PI/180);e.setWind(r,r,0);for(let t of pv)e.setVisible(t,!g.hide?.includes(t));let _=n=>{g.shelter&&e.shelter.changed(),t(n)};for(let e=0;e<20;e++)_(f+=1/60),e%5==4&&(l(),await u());l(),e.timer=s,s.reset();let v=[];for(let e=0;e<a;e++){let t=performance.now();_(f+=1/60),v.push(performance.now()-t),e%6==5&&await u()}e.timer=null,await s.settle();let y=s.frames.filter(e=>e.gpu),b=s.gpu&&y.length?_v(y.map(e=>e.gpu)):null,x={..._v(s.frames.map(e=>e.cpu)),frame:vv(v)};l();let S=performance.now();for(let e=0;e<30;e++)_(f+=1/60);l();let C={label:g.label,width:g.width,height:g.height,gpu:b,cpu:x,uncapped:(performance.now()-S)/30};d.push(C),i(C,c)}}finally{e.output=null,h.dispose(),e.timer=null;for(let t of pv)e.setVisible(t,!0);p.zoom=m,p.update(0,!0),n()}return d}function _v(e){let t={};for(let n of fv)t[n]=vv(e.map(e=>e[n]??0));return t.frame=fv.reduce((e,n)=>e+t[n],0),t}function vv(e){let t=[...e].sort((e,t)=>e-t);return t.length?t.length%2?t[(t.length-1)/2]:(t[t.length/2-1]+t[t.length/2])/2:0}function yv(e){let t=[`case`,...fv.slice(1).map(e=>`${e}`),`GPU`,`CPU`,`uncapped`,`fps`],n=[t,...e.map(e=>[e.label,...fv.slice(1).map(t=>e.gpu?e.gpu[t].toFixed(2):`-`),e.gpu?e.gpu.frame.toFixed(2):`-`,e.cpu.frame.toFixed(2),e.uncapped.toFixed(2),(1e3/e.uncapped).toFixed(0)])],r=t.map((e,t)=>Math.max(...n.map(e=>e[t].length))),i=n.map(e=>e.map((e,t)=>t?e.padStart(r[t]):e.padEnd(r[t])).join(`  `)).join(`
`);return e.some(e=>e.gpu&&e.gpu.frame>e.uncapped*1.5)?`${i}\n\nThe GPU timers here add up to far more than the uncapped frame: they count waiting, not work. Read the uncapped column.`:i}var bv=[1,3],xv=.12,Sv=Mp.fog.haze.color,Cv={shower:{keys:[{hour:0,cloud:0,rain:0},{hour:1.5,cloud:0,rain:0},{hour:3,cloud:.45,rain:0},{hour:4.5,cloud:.85,rain:0},{hour:5.5,cloud:1,rain:.55},{hour:7,cloud:1,rain:.6},{hour:8,cloud:.8,rain:0},{hour:10,cloud:.25,rain:0},{hour:11.5,cloud:0,rain:0},{hour:12,cloud:0,rain:0}],phase:e=>e<1.5?`clear`:e<4.5?`cloud building`:e<8?`a shower`:`clearing`},fog:{keys:[{hour:0,cloud:.5,rain:0,haze:.7,top:4.5},{hour:1.5,cloud:.5,rain:0,haze:.7,top:4.5},{hour:4,cloud:.25,rain:0,haze:.4,top:1},{hour:5.5,cloud:.1,rain:0,haze:0,top:0},{hour:8,cloud:0,rain:0,haze:0,top:0},{hour:9.5,cloud:.1,rain:0,haze:.4,top:1},{hour:12,cloud:.5,rain:0,haze:.7,top:4.5}],phase:e=>e<1.5?`fog`:e<5.5?`the fog lifting`:e<8?`clear`:`mist gathering`},dust:{keys:[{hour:0,cloud:0,rain:0,heat:.4,wind:3},{hour:1,cloud:0,rain:0,heat:.4,wind:9},{hour:2.5,cloud:.2,rain:0,heat:.4,wind:17,haze:.4,top:3},{hour:3.5,cloud:.4,rain:0,heat:.5,wind:24,haze:.8,top:7},{hour:6,cloud:.4,rain:0,heat:.5,wind:22,haze:.75,top:7},{hour:7.5,cloud:.2,rain:0,heat:.4,wind:11,haze:.35,top:3},{hour:9,cloud:0,rain:0,heat:.3,wind:5,haze:0,top:1},{hour:10,cloud:0,rain:0,heat:.4,wind:3}],haze:{color:Mp.dust.haze.color,kind:`dust`},phase:e=>e<1?`still`:e<3.5?`the dust coming in`:e<6?`a dust storm`:e<9?`dropping`:`still`},flood:{keys:[{hour:0,cloud:.1,rain:0,wind:4,rise:0,flow:1,mud:0},{hour:1,cloud:.3,rain:0,wind:5,rise:0,flow:1,mud:0},{hour:2.5,cloud:1,rain:.7,wind:12,rise:.05,flow:1.6,mud:.3},{hour:4,cloud:1,rain:1,wind:16,rise:.18,flow:3.5,mud:.75},{hour:6,cloud:.9,rain:.5,wind:10,rise:.38,flow:3,mud:.9},{hour:7.5,cloud:.6,rain:0,wind:6,rise:.42,flow:2.5,mud:.9},{hour:10,cloud:.3,rain:0,wind:5,rise:.2,flow:2,mud:.7},{hour:13,cloud:.1,rain:0,wind:4,rise:.08,flow:1.3,mud:.4},{hour:16,cloud:.1,rain:0,wind:4,rise:0,flow:1,mud:.1},{hour:17,cloud:.1,rain:0,wind:4,rise:0,flow:1,mud:0}],phase:e=>e<1?`fair`:e<4?`the stream swelling`:e<7.5?`a flood`:e<16?`draining`:`fair`}},wv=e=>Cv[e].keys[Cv[e].keys.length-1].hour,Tv=(e,t,n)=>(t*n/10%wv(e)+wv(e))%wv(e),Ev=e=>e*e*(3-2*e);function Dv(e,t,n,r){let i=Cv[e].keys,a=Tv(e,Math.floor(t*4)/4,n),o=0;for(;o<i.length-2&&a>=i[o+1].hour;)o++;let s=i[o],c=i[o+1],l=Ev((a-s.hour)/(c.hour-s.hour));return r(s)+(r(c)-r(s))*l}function Ov(e,t=1,n=`shower`){let r=r=>Dv(n,e,t,r),i=r(e=>e.rain),a=r(e=>e.haze??0),o=Cv[n].haze;return{cloud:r(e=>e.cloud),rain:i>=xv?i:0,heat:r(e=>e.heat??0),haze:a>0?{amount:a,color:o?.color??Sv,top:r(e=>e.top??0),kind:o?.kind??`fog`}:null}}function kv(e,t=1,n=`shower`){return Cv[n].keys[0].wind===void 0?null:Math.round(Dv(n,e,t,e=>e.wind??0)*2)/2}function Av(e,t=1,n=`shower`){if(Cv[n].keys[0].rise===void 0)return null;let r=r=>Dv(n,e,t,r);return{rise:r(e=>e.rise??0),flow:r(e=>e.flow??1),mud:r(e=>e.mud??0)}}function jv(e,t=1,n=`shower`){return Cv[n].phase(Tv(n,e,t))}var Mv={rise:0,flow:1,mud:0},Nv=.35,Pv=.25,Fv=class{ground;channel;land;alongX;alongZ;stream;constructor(e,t){this.stream=e;let{nx:n,nz:r,cell:i,x0:a,z0:o}=e.grid,s=n*r;this.ground=new Float32Array(s),this.channel=new Uint8Array(s),this.land=new Uint8Array(s),this.alongX=new Float32Array(s),this.alongZ=new Float32Array(s);for(let s=0;s<r;s++)for(let r=0;r<n;r++){let c=s*n+r,l=a+(r+.5)*i,u=o+(s+.5)*i;this.ground[c]=t(l,u),this.land[c]=!e.land||e.land(l,u)?1:0,this.land[c]&&e.channel(l,u)&&(this.channel[c]=1,[this.alongX[c],this.alongZ[c]]=e.along(l,u))}}map(e){let{nx:t,nz:n}=this.stream.grid,r=t*n,i=new Float32Array(r).fill(NaN),a=new Float32Array(r),o=new Float32Array(r),s=new Float32Array(r).fill(e.mud),c=this.stream.level+e.rise,l=Nv*e.flow,u=[];for(let e=0;e<r;e++)this.channel[e]&&(i[e]=c,a[e]=this.alongX[e]*l,o[e]=this.alongZ[e]*l,u.push(e));for(;u.length;){let e=[];for(let r of u){let s=r%t,l=(r-s)/t;for(let[u,d]of[[1,0],[-1,0],[0,1],[0,-1]]){let f=s+u,p=l+d;if(f<0||p<0||f>=t||p>=n)continue;let m=p*t+f;if(!Number.isNaN(i[m])||!this.land[m]||this.ground[m]>=c)continue;i[m]=c;let h=this.channel[r]?Pv:1;a[m]=a[r]*h,o[m]=o[r]*h,e.push(m)}}u=e}return{...this.stream.grid,level:i,flowX:a,flowZ:o,mud:s}}},Iv=1e-6,Lv=class{prev=null;cur=null;stepMs=0;safetyHits=0;obstacles=null;queue=[];inFlight=1;clock=0;saves=[];disposed=!1;idlers=[];listeners=[];worker;constructor(e,t,n,r,i={}){this.worker=e,e.onmessage=e=>this.receive(e.data),e.postMessage({type:`init`,grid:t,obstacles:n,goal:r,options:i})}receive(e){if(e.type===`obstacles`)this.obstacles={solid:e.solid,drag:e.drag};else if(e.type===`save`)this.saves.shift()?.resolve(e.save);else{this.prev=e.restored?e.snap:this.cur??e.snap,this.cur=e.snap,e.ms&&(this.stepMs=e.ms),this.safetyHits=e.safetyHits,this.inFlight--;for(let t of this.listeners)t(e.snap);this.pump()}}setGoal(e){this.queue.push({goal:structuredClone(e)}),this.pump()}advance(e){this.clock+=e/Zp;let t=Math.floor(this.clock+Iv);if(t>0){this.clock=Math.max(0,this.clock-t);let e=this.queue[this.queue.length-1];e&&`ticks`in e?e.ticks+=t:this.queue.push({ticks:t})}this.pump()}save(){return this.disposed?Promise.reject(Error(`The wind is disposed`)):new Promise((e,t)=>{this.queue.push({save:{resolve:e,reject:t}}),this.pump()})}restore(e){for(let e=this.queue.length-1;e>=0&&!(`save`in this.queue[e]);e--)`ticks`in this.queue[e]&&this.queue.splice(e,1);this.clock=0,this.queue.push({restore:structuredClone(e)}),this.pump()}get alpha(){return this.inFlight>0||this.queue.some(e=>`ticks`in e)?1:Math.min(1,this.clock)}idle(){return new Promise(e=>{this.idlers.push(e),this.pump()})}onTick(e){this.listeners.push(e)}at(e,t,n=0){return!this.prev||!this.cur?[0,0]:tm(this.prev,this.cur,this.alpha,e,t,n)}pump(){for(;!this.disposed&&this.inFlight===0&&this.queue.length;){let e=this.queue[0];if(`goal`in e)this.queue.shift(),this.worker.postMessage({type:`goal`,goal:e.goal});else if(`save`in e)this.queue.shift(),this.saves.push(e.save),this.worker.postMessage({type:`save`});else if(`restore`in e)this.queue.shift(),this.inFlight=1,this.worker.postMessage({type:`restore`,save:e.restore});else{let t=Math.min(e.ticks,4);e.ticks-=t,e.ticks||this.queue.shift(),this.inFlight=t,this.worker.postMessage({type:`step`,ticks:t})}}if(this.disposed||this.inFlight===0&&!this.queue.length)for(let e of this.idlers.splice(0))e()}dispose(){this.disposed=!0,this.worker.terminate?.();let e=Error(`The wind is disposed`);for(let t of this.queue)`save`in t&&t.save.reject(e);for(let t of this.saves)t.reject(e);this.queue.length=0,this.saves.length=0;for(let e of this.idlers.splice(0))e()}},Rv=[[.07,.1,.25],[.1,.32,.52],[.2,.62,.62],[.72,.8,.45],[1,.97,.8]],zv=[[.15,.12,.35],[.16,.38,.6],[.3,.68,.55],[.85,.86,.35]];function Bv(e,t){let n=Math.min(1,Math.max(0,t))*(e.length-1),r=Math.min(e.length-2,Math.floor(n)),i=n-r;return[0,1,2].map(t=>255*(e[r][t]+(e[r+1][t]-e[r][t])*i))}var Vv=class{living;el;mode=`wind`;canvas=document.createElement(`canvas`);field=document.createElement(`canvas`);info=document.createElement(`div`);mask=null;constructor(e){this.living=e,this.el=document.createElement(`div`),this.el.id=`wind-view`,this.canvas.width=this.canvas.height=360;let t=Object.assign(document.createElement(`button`),{textContent:`wind`});t.title=`Show how hard the wind blows, or the shelter memory (how well the free air above still reaches down)`,t.onclick=()=>{this.mode=this.mode===`wind`?`shelter`:`wind`,t.textContent=this.mode},this.el.append(this.canvas,t,this.info)}obstacleMask(e,t){let n=this.living().obstacles;if(this.mask||!n)return this.mask;this.mask=Object.assign(document.createElement(`canvas`),{width:e,height:t});let r=this.mask.getContext(`2d`),i=r.createImageData(e,t);for(let e=0;e<n.solid.length;e++)n.solid[e]?i.data.set([255,255,255,255],e*4):n.drag[e]>0&&i.data.set([20,70,30,Math.min(255,60+n.drag[e]*20)],e*4);return r.putImageData(i,0,0),this.mask}draw(e,t,n){let r=this.living(),i=r.prev,a=r.cur;if(!i||!a)return;let o=r.alpha,s=Math.max(.5,i.speed+(a.speed-i.speed)*o);(this.field.width!==a.nx||this.field.height!==a.nz)&&Object.assign(this.field,{width:a.nx,height:a.nz});let c=this.field.getContext(`2d`),l=c.createImageData(a.nx,a.nz),u=0,d=0;for(let e=0;e<a.u.length;e++){let t=i.u[e]+(a.u[e]-i.u[e])*o,n=i.v[e]+(a.v[e]-i.v[e])*o,r=Math.hypot(t,n);u+=r,d=Math.max(d,r);let c=this.mode===`wind`?Bv(Rv,r/(2*s)):Bv(zv,i.k[e]+(a.k[e]-i.k[e])*o);l.data.set([c[0],c[1],c[2],255],e*4)}c.putImageData(l,0,0);let f=this.canvas.getContext(`2d`),p=this.canvas.width;f.setTransform(1,0,0,1,0,0),f.fillStyle=`#141824`,f.fillRect(0,0,p,p);let m=p/(Math.max(a.nx,a.nz)*a.cell*Math.SQRT2),h=Math.cos(n),g=Math.sin(n),_={x:a.x0+a.nx*a.cell/2,z:a.z0+a.nz*a.cell/2};f.setTransform(h*m,g*m,-g*m,h*m,p/2,p/2),f.translate(-_.x,-_.z),f.imageSmoothingEnabled=!0,f.drawImage(this.field,a.x0,a.z0,a.nx*a.cell,a.nz*a.cell),f.imageSmoothingEnabled=!1;let v=this.obstacleMask(a.nx,a.nz);v&&f.drawImage(v,a.x0,a.z0,a.nx*a.cell,a.nz*a.cell),this.arrows(f,i,a,o,s,m),f.strokeStyle=`#ff5a8a`,f.lineWidth=2/m,f.beginPath(),f.moveTo(e-4,t),f.lineTo(e+4,t),f.moveTo(e,t-4),f.lineTo(e,t+4),f.stroke(),this.info.textContent=`tick ${a.tick} · ${(a.nx*a.cell).toFixed(0)} m square, ${a.cell} m cells · step ${r.stepMs.toFixed(1)} ms · ground mean ${(u/a.u.length).toFixed(2)} m/s, peak ${d.toFixed(1)}${r.safetyHits?` · safety hits ${r.safetyHits}`:``}`}arrows(e,t,n,r,i,a){e.strokeStyle=`rgba(255, 255, 255, 0.75)`,e.lineWidth=1.2/a,e.beginPath();let o=Math.round(10/n.cell);for(let a=o>>1;a<n.nz;a+=o)for(let s=o>>1;s<n.nx;s+=o){let o=a*n.nx+s,c=t.u[o]+(n.u[o]-t.u[o])*r,l=t.v[o]+(n.v[o]-t.v[o])*r,u=n.x0+(s+.5)*n.cell,d=n.z0+(a+.5)*n.cell,f=5/(2*i),p=u+c*f,m=d+l*f,h=Math.hypot(c,l)*f;if(h<.3)continue;let g=(p-u)/h,_=(m-d)/h;e.moveTo(u-c*f,d-l*f),e.lineTo(p,m),e.moveTo(p,m),e.lineTo(p-1.6*g+1.1*_,m-1.6*_-1.1*g),e.moveTo(p,m),e.lineTo(p-1.6*g-1.1*_,m-1.6*_+1.1*g)}e.stroke()}},X=new URLSearchParams(location.search),Z=(e,t)=>X.has(e)?Number(X.get(e)):t,Hv=document.getElementById(`view`),Uv=X.get(`scene`)??`farm`,Wv=Uv===`farm`,Q=new hm(Hv,{shadowRadius:34,shadowFollow:Wv,shadowMapSize:Z(`shadowMap`,Wv?4096:2048),pixelRatio:X.has(`dpr`)?Z(`dpr`,1):X.has(`profile`)?1:void 0,samples:X.has(`samples`)?Z(`samples`,4):void 0,shelterSize:Z(`shelterSize`,1024)});!X.has(`dpr`)&&!X.has(`profile`)&&(Q.maxPixels=2073600);var Gv=X.get(`season`),Kv=X.get(`character`),qv=Jl.includes(Gv)?Gv:null,Jv=Yl.includes(Kv)?Kv:null;qv&&Q.setSeason({season:qv,character:Jv,sunrise:X.has(`sunrise`)?Z(`sunrise`,6):void 0,sunset:X.has(`sunset`)?Z(`sunset`,20):void 0});var Yv=Wv?R_(Q,qv??`summer`):null,Xv=Yv??Xm(Q,qv??`summer`),Zv=Yv?.ready??Promise.resolve(),Qv=!1;Zv.then(()=>{Qv=!0});var $v={usual:Mv,spate:{rise:.15,flow:3.5,mud:.75},flood:{rise:.4,flow:2.5,mud:.9}},ey=new Fv(Xv.stream,Xv.height),ty=$v[X.get(`water`)??`usual`]??Mv,ny={rise:Z(`rise`,ty.rise),flow:Z(`flow`,ty.flow),mud:Z(`mud`,ty.mud)},ry=``;function iy(e,t=!1){let n=JSON.stringify(e);n!==ry&&(ry=n,Q.setWater(ey.map(e),t?0:void 0))}iy(ny,!0);var ay=Q.view;ay.view=Z(`view`,0),ay.zoom=Z(`zoom`,40),ay.target.set(Z(`x`,Wv?0:-1),0,Z(`z`,0)),ay.update(0,!0),Q.settings.lines=Z(`lines`,1)!==0,Q.settings.shadows=Z(`shadows`,1)!==0,Q.settings.prepass=Z(`prepass`,1)!==0,Q.settings.waterScissor=Z(`scissor`,1)!==0,Q.settings.equalDepth=Z(`equal`,1)!==0,Q.settings.shelterDebug=X.has(`shelter`)&&X.get(`shelter`)!==`0`;var oy={ground:2048,crop:1024,grass:1024};for(let e of[`ground`,`crop`,`grass`])X.get(e)!==`live`&&Q.setFields(e,oy[e])||(oy[e]=0);var sy=e=>oy[e]?`baked ${oy[e]}`:`live`,cy={dawn:`Dawn`,noon:`Noon`,golden:`Golden hour`,sunset:`Sunset`,night:`Night`},ly=X.get(`hour`)??`noon`,uy=ly in cy?hu(Q.day)[cy[ly]]:Number(ly),dy=()=>Object.entries(hu(Q.day)).find(([,e])=>Math.abs(e-uy)<.01)?.[0];function fy(){let e=new URLSearchParams(X),t=dy();for(let t of[`weather`,`cloud`,`rain`,`snow`,`heat`,`haze`,`hazeColor`,`hazeTop`,`hazeBase`,`hazeKind`,`timeline`])e.delete(t);if(Wy)e.set(`timeline`,String(Gy));else if(Dy)e.set(`weather`,Dy);else{for(let t of[`cloud`,`rain`,`snow`,`heat`])e.set(t,String($[t]));let t=$.haze;e.set(`haze`,String(t.amount)),e.set(`hazeColor`,t.color.toString(16).padStart(6,`0`)),e.set(`hazeTop`,String(t.top)),t.base!==void 0&&e.set(`hazeBase`,String(t.base)),t.kind&&e.set(`hazeKind`,t.kind)}return e.set(`sunUnder`,String(jy)),e.set(`wind`,my.speed.toFixed(2)),e.set(`windDir`,(my.direction*180/Math.PI).toFixed(1)),e.set(`gust`,String(my.gust??.5)),e.set(`rhythm`,String(hy)),e.set(`rise`,String(ny.rise)),e.set(`flow`,String(ny.flow)),e.set(`mud`,String(ny.mud)),e.set(`view`,String(ay.view)),e.set(`zoom`,ay.zoom.toFixed(1)),e.set(`x`,ay.target.x.toFixed(2)),e.set(`z`,ay.target.z.toFixed(2)),e.set(`hour`,t?Object.keys(cy).find(e=>cy[e]===t):uy.toFixed(2)),e}var py=X.get(`wind`),my={speed:py===null?sf.breeze:py in sf?sf[py]:Number(py),direction:Z(`windDir`,31)*Math.PI/180,gust:Z(`gust`,.5)},hy=Z(`rhythm`,.5),gy=()=>({speed:my.speed,direction:my.direction,gustiness:my.gust,rhythm:hy}),_y=10,vy=Z(`windSeed`,1);function yy(){let e=new Lv(new Worker(new URL(new URL(`worker-sjaiVBhx.js`,import.meta.url).href,``+import.meta.url),{type:`module`}),{nx:200,nz:200,cell:1,x0:-100,z0:-100},Xv.wind,gy(),{seed:vy});return e.advance(X.has(`shot`)?_y-Zp:_y+(by??0)),e}var by=X.has(`t`)?Z(`t`,0):null,xy=yy(),Sy=()=>!!xy.cur&&xy.cur.tick>=Math.round(_y/.1);function Cy(){if(Sy())Q.setWind(xy.prev,xy.cur,xy.alpha);else{let e=uf(my.speed,my.direction);Q.setWind(e,e,0)}}var wy=new Vv(()=>xy),Ty=X.has(`windMap`)&&X.get(`windMap`)!==`0`;Ty&&document.body.append(wy.el);var Ey=X.get(`weather`),Dy=Ey!==null&&Ey in Mp?Ey:null,Oy=Mp[Dy??`clear`],ky=Oy.haze??{amount:0,color:13620952,top:4},$={cloud:Z(`cloud`,Oy.cloud),rain:Z(`rain`,Oy.rain??0),snow:Z(`snow`,Oy.snow??0),heat:Z(`heat`,Oy.heat??0),haze:{amount:Z(`haze`,ky.amount),color:X.has(`hazeColor`)?parseInt(X.get(`hazeColor`),16):ky.color,top:Z(`hazeTop`,ky.top),base:X.has(`hazeBase`)?Z(`hazeBase`,0):ky.base,kind:X.get(`hazeKind`)===`dust`?`dust`:X.get(`hazeKind`)===`fog`?`fog`:ky.kind}};[`cloud`,`rain`,`snow`,`heat`,`haze`,`hazeColor`,`hazeTop`,`hazeBase`,`hazeKind`].some(e=>X.has(e))&&(Dy=null);var Ay=Z(`cloudSeed`,1),jy=Z(`sunUnder`,0),My={x:0,z:0,vx:0,vz:0,at:0};function Ny(){let e=Eu(my.speed);return{vx:Math.cos(my.direction)*e,vz:Math.sin(my.direction)*e}}function Py(e){let t=Ny();return e>=My.at?(My.x+=My.vx*(e-My.at),My.z+=My.vz*(e-My.at)):(My.x=t.vx*e,My.z=t.vz*e),Object.assign(My,t,{at:e}),{x:My.x,z:My.z,vx:My.vx,vz:My.vz}}var Fy={nx:200,nz:200,cell:1,x0:-100,z0:-100},Iy=new Float32Array(Fy.nx*Fy.nz),Ly=new Float32Array(Iy.length);for(let e=0;e<Fy.nz;e++)for(let t=0;t<Fy.nx;t++){let n=Fy.x0+t+.5,r=Fy.z0+e+.5;Iy[e*Fy.nx+t]=Xv.bare(n,r),Ly[e*Fy.nx+t]=Xv.height(n,r)}var Ry=-1;function zy(e){if(Math.abs(e-Ry)<.02)return;Ry=e;let t=Math.max(0,1-2*e);Q.setDustSource({...Fy,lift:Iy.map(e=>e*t),ground:Ly})}var By=$;function Vy(e,t=!1,n=Hy){By={...e},zy(Math.max(e.rain??0,e.snow??0)),Q.setWeather({sunUnder:jy,...e,drift:Py(n),cloudSeed:Ay},t)}var Hy=0;Vy($,!0,0),Q.settings.falling=Z(`falling`,1)!==0,Q.settings.fallingShare=Z(`fallingShare`,1);var Uy=(X.get(`rainLook`)??``)in Af?X.get(`rainLook`):`a`;Q.rain.look=Af[Uy];var Wy=X.has(`timeline`),Gy=Number(X.get(`timeline`))||1,Ky=(X.get(`spell`)??``)in Cv?X.get(`spell`):`shower`;Wy&&(Dy=null);var qy=null,Jy=``;(X.has(`still`)||X.has(`profile`))&&document.body.classList.add(`still`);var Yy=!1;function Xy(){Yy||Q.resize(Hv.clientWidth,Hv.clientHeight)}addEventListener(`resize`,Xy),Xy();var Zy=null;Hv.addEventListener(`pointerdown`,e=>{Yy||(Zy={x:e.clientX,y:e.clientY},Hv.setPointerCapture(e.pointerId))}),Hv.addEventListener(`pointermove`,e=>{Zy&&=(ay.pan((e.clientX-Zy.x)*Q.screenRatio,(e.clientY-Zy.y)*Q.screenRatio),{x:e.clientX,y:e.clientY})}),Hv.addEventListener(`pointerup`,()=>{Zy=null}),Hv.addEventListener(`wheel`,e=>{if(e.preventDefault(),!Yy){ay.zoom=Math.min(192,Math.max(16,ay.zoom*(e.deltaY<0?1.15:1/1.15)));for(let e of nb)e()}},{passive:!1}),addEventListener(`keydown`,e=>{if(Yy)return;let t=e.key.toLowerCase();t===`q`?ay.turn(-1):t===`e`?ay.turn(1):t===`l`?Q.settings.lines=!Q.settings.lines:t===`s`?Q.settings.shadows=!Q.settings.shadows:t>=`1`&&t<=`5`&&(uy=Object.values(hu(Q.day))[Number(t)-1]),$y()});var Qy=document.getElementById(`hud`);function $y(){Qy.innerHTML=``,nb.length=0;for(let[e,t]of Object.entries(hu(Q.day))){let n=document.createElement(`button`);n.textContent=e,n.title=tb(t),n.className=Math.abs(t-uy)<.01?`on`:``,n.onclick=()=>{uy=t,$y()},Qy.append(n)}let e=document.createElement(`select`);for(let t of[`none`,...Jl])e.append(new Option(t,t,!1,t===(qv??`none`)));e.title=`The level's season (none: the looks' own day, the sun up 6 to 20); the scene is built again in it`,e.onchange=()=>{let t=fy();e.value===`none`?t.delete(`season`):t.set(`season`,e.value),location.search=`?${t}`},e.onkeydown=e=>e.stopPropagation(),Qy.append(Object.assign(document.createElement(`label`),{textContent:`Season`}),e);let t=Object.assign(document.createElement(`span`),{textContent:`${tb(uy)} · sun ${tb(Q.day.sunrise)}–${tb(Q.day.sunset)}`});Qy.append(t);let n=document.createElement(`button`);n.textContent=`Lines`,n.className=Q.settings.lines?`on`:``,n.onclick=()=>{Q.settings.lines=!Q.settings.lines,$y()},Qy.append(n);let r=document.createElement(`button`);r.textContent=`Shelter`,r.className=Q.settings.shelterDebug?`on`:``,r.title=`What's under cover: blue under a roof, teal under a crown, yellow the roofs' tops; the map from above in the corner`,r.onclick=()=>{Q.settings.shelterDebug=!Q.settings.shelterDebug,$y()},Qy.append(r);let i=document.createElement(`button`);i.textContent=`Wind map`,i.className=Ty?`on`:``,i.title=`The living wind from above, turned as the camera is: how hard it blows (or the shelter), which way, and the obstacles`,i.onclick=()=>{Ty=!Ty,Ty?document.body.append(wy.el):wy.el.remove(),$y()},Qy.append(i);let a=e=>t=>{e(t),xy.setGoal(gy()),Vy(By)};Qy.append(rb(`Wind`,0,45,.5,()=>my.speed,a(e=>{my.speed=e}),e=>`${cf(e)} ${e.toFixed(1)} m/s`)),Qy.append(rb(`towards`,0,360,5,()=>my.direction*180/Math.PI,a(e=>{my.direction=e*Math.PI/180}),e=>`${e.toFixed(0)}°`)),Qy.append(rb(`gusts`,0,1,.05,()=>my.gust??.5,a(e=>{my.gust=e}),e=>e.toFixed(2),!0)),Qy.append(rb(`rhythm`,0,1,.05,()=>hy,a(e=>{hy=e}),e=>`${e<.35?`rare, strong`:e>.65?`frequent, mild`:`between`} ${e.toFixed(2)}`)),Qy.append(rb(`Zoom`,Math.log2(16),Math.log2(192),.01,()=>Math.log2(ay.zoom),e=>{ay.zoom=2**e},e=>`${(2**e).toFixed(0)} px/m`,!0));let o=document.createElement(`span`);o.textContent=`drag to pan · wheel to zoom · Q/E to turn`,Qy.append(o),Qy.append(Object.assign(document.createElement(`div`),{className:`break`}));let s=document.createElement(`select`);for(let e of[`custom`,...Object.keys(Mp)])s.append(new Option(e.replace(`-`,` `),e,!1,e===(Dy??`custom`)));s.onchange=()=>{if(!(s.value in Mp))return;let e=Mp[s.value];Object.assign($,{cloud:e.cloud,rain:e.rain??0,snow:e.snow??0,heat:e.heat??0}),$.haze=e.haze?{...e.haze}:{...$.haze,amount:0},Dy=s.value,Wy=!1,eb.textContent=``,Vy($),$y()},s.onkeydown=e=>e.stopPropagation(),Qy.append(Object.assign(document.createElement(`label`),{textContent:`Weather`}),s);let c=e=>t=>{e(t),Dy=null,s.value=`custom`,Wy=!1,m.className=``,eb.textContent=``,Vy($)},l=e=>e.toFixed(2);Qy.append(rb(`Cloud`,0,1,.01,()=>$.cloud,c(e=>{$.cloud=e}),l,!0)),Qy.append(rb(`low sun`,0,1,.01,()=>jy,e=>{jy=e,Vy(By)},l,!0)),Qy.append(rb(`Rain`,0,1,.01,()=>$.rain,c(e=>{$.rain=e}),l,!0));let u=Object.keys(Af),d=Object.assign(document.createElement(`button`),{textContent:`rain look ${Uy.toUpperCase()}`});d.title=`The falling rain's look, candidates for #11: A soft washes, B fine and crisp, C brush dashes (rainLook=a|b|c)`,d.onclick=()=>{Uy=u[(u.indexOf(Uy)+1)%u.length],Q.rain.look=Af[Uy],X.set(`rainLook`,Uy);let e=new URL(location.href);e.searchParams.set(`rainLook`,Uy),history.replaceState(null,``,e),$y()},Qy.append(d),Qy.append(rb(`Snow`,0,1,.01,()=>$.snow,c(e=>{$.snow=e}),l,!0)),Qy.append(rb(`Heat`,0,1,.01,()=>$.heat,c(e=>{$.heat=e}),l,!0)),Qy.append(rb(`Haze`,0,1,.01,()=>$.haze.amount,c(e=>{$.haze.amount=e}),l,!0)),Qy.append(rb(`from`,-2,20,.25,()=>Math.max(-2,$.haze.base??-2),c(e=>{$.haze.base=e<=-2?void 0:e}),e=>e<=-2?`ground`:`${e.toFixed(1)} m`,!0)),Qy.append(rb(`up to`,-1,30,.25,()=>$.haze.top,c(e=>{$.haze.top=e}),e=>`${e.toFixed(1)} m`,!0));let f=Object.assign(document.createElement(`input`),{type:`color`,value:`#${$.haze.color.toString(16).padStart(6,`0`)}`});f.oninput=()=>c(e=>{$.haze.color=e})(parseInt(f.value.slice(1),16));let p=Object.assign(document.createElement(`button`),{textContent:$.haze.kind??`fog`});p.title=`What the haze is: fog lingers and the wind thins it; dust is carried by the wind and turns the light orange`,p.onclick=()=>{let e=($.haze.kind??`fog`)===`fog`?`dust`:`fog`;c(()=>{$.haze.kind=e})(0),p.textContent=e},nb.push(()=>{p.textContent=$.haze.kind??`fog`,f.value=`#${$.haze.color.toString(16).padStart(6,`0`)}`}),Qy.append(f,p);let m=Object.assign(document.createElement(`button`),{textContent:`Timeline`,className:Wy?`on`:``});m.title=`The scripted weather, sent as the game sends it`;let h=document.createElement(`select`),g=e=>e===`fog`?`morning fog`:e===`dust`?`dust storm`:e;for(let e of Object.keys(Cv))h.append(new Option(g(e),e,!1,e===Ky));h.title=`shower: clear, cloud building, a shower, clearing again · morning fog: a fog lifting, then mist gathering in the evening · dust storm: the wind getting up and blowing a dust storm through · flood: a storm swelling the stream, which floods the land and drains`,h.onchange=()=>{Ky=h.value,qy=null,Jy=``},h.onkeydown=e=>e.stopPropagation(),m.onclick=()=>{Wy=!Wy,qy=null,Jy=``,Wy?(Dy=null,s.value=`custom`):eb.textContent=``,m.className=Wy?`on`:``};let _=Object.assign(document.createElement(`button`),{textContent:`${Gy}× speed`});_.title=`The game's speed: a day is 4 minutes at 1×`,_.onclick=()=>{let e=bv[(bv.indexOf(Gy)+1)%bv.length];Wy&&qy!==null&&(qy=Hy-(Hy-qy)*Gy/e),Gy=e,_.textContent=`${Gy}× speed`},Qy.append(m,h,_,eb),Qy.append(Object.assign(document.createElement(`div`),{className:`break`}));let v=e=>t=>{e(t),iy({...ny})};Qy.append(rb(`Water`,-.3,1.2,.01,()=>ny.rise,v(e=>{ny.rise=e}),e=>`${e>=0?`+`:``}${e.toFixed(2)} m`,!0)),Qy.append(rb(`flow`,0,5,.05,()=>ny.flow,v(e=>{ny.flow=e}),e=>`${e.toFixed(2)}×`,!0)),Qy.append(rb(`mud`,0,1,.01,()=>ny.mud,v(e=>{ny.mud=e}),l,!0))}var eb=document.createElement(`span`);function tb(e){let t=Math.round((e%24+24)%24*60);return`${String(Math.floor(t/60)%24).padStart(2,`0`)}:${String(t%60).padStart(2,`0`)}`}var nb=[];function rb(e,t,n,r,i,a,o,s=!1){let c=document.createElement(`label`),l=Object.assign(document.createElement(`input`),{type:`range`,min:String(t),max:String(n),step:String(r),value:String(i())}),u=Object.assign(document.createElement(`output`),{className:s?`short`:``});return u.textContent=o(i()),l.oninput=()=>{let e=Number(l.value);a(e),u.textContent=o(e)},l.onkeydown=e=>e.stopPropagation(),nb.push(()=>{l.value=String(i()),u.textContent=o(i())}),c.append(e,l,u),c}$y();function ib(e){return{cloud:e.cloud,rain:e.rain??0,snow:e.snow??0,heat:e.heat??0,haze:e.haze??null}}function ab(e){if(!Wy)return;qy??=e;let t=Ov(e-qy,Gy,Ky),n=JSON.stringify(t);eb.textContent=jv(e-qy,Gy,Ky);let r=kv(e-qy,Gy,Ky);if(r!==null&&r!==my.speed){my.speed=r,xy.setGoal(gy());for(let e of nb)e()}let i=Av(e-qy,Gy,Ky);if(i){Object.assign(ny,i),iy({...ny});for(let e of nb)e()}if(n===Jy)return;Jy=n;let{haze:a,...o}=ib(t);Object.assign($,o,{haze:a?{...a}:{...$.haze,amount:0}}),Vy($,!1,e);for(let e of nb)e()}if(X.has(`shot`)){let e=-Zp,t=null,n=JSON.stringify(gy()),r=async(r,i,a)=>{let o=JSON.stringify(i);o!==n&&!a&&(xy.dispose(),xy=yy(),t=null,e=-Zp,Q.wind.restart(),Q.trees.restart(),Q.dust.restart()),n=o,t??=xy.save();let s=await t;r<e-1e-9&&(xy.restore(s),e=-Zp),xy.setGoal(i),xy.advance(r-e),e=r,await xy.idle()},i=async(e,t={})=>{e&&(ay.target.set(e.x,0,e.z),ay.zoom=e.zoom,ay.view=e.view,ay.update(0,!0)),t.hour!==void 0&&(uy=t.hour),t.wind&&Object.assign(my,t.wind);let n=t.time??by??0;if(t.weather&&Vy(typeof t.weather==`string`?ib(Mp[t.weather]):{...$,...t.weather},!t.ease,n),t.timeline){let e=t.timeline,r=kv(e.time,e.speed??Gy,e.spell??Ky);r!==null&&(my.speed=r),Vy(ib(Ov(e.time,e.speed??Gy,e.spell??Ky)),!t.ease,n);let i=Av(e.time,e.speed??Gy,e.spell??Ky);i&&Object.assign(ny,i)}t.water&&Object.assign(ny,t.water),Q.shared.uTime.value=n,iy({...ny},!t.ease),!t.weather&&!t.timeline&&Vy(By,!1,n),await r(n,gy(),!!t.ease),Cy(),Ty&&wy.draw(ay.target.x,ay.target.z,ay.heading);for(let e of[`ground`,`paint`,`crop`,`ink`,`water`,`foliage`,`grass`,`debris`,`rain`])Q.setVisible(e,!t.hide?.includes(e));let i=Q.settings.grain;t.grain===!1&&(Q.settings.grain=0),Q.setHour(t.dayHour===void 0?uy:du(t.dayHour,Q.day));for(let e=0;e<2;e++)Q.render(n);Q.settings.grain=i};Zv.then(()=>Object.assign(window,{__renderer:Q,__draw:i,__profile:e=>ob(e),__profileTable:yv,__shot:async()=>(await i(),Hv.toDataURL(`image/png`))}))}else requestAnimationFrame(fb);async function ob(e=hv(),t){await Zv,Yy=!0;try{return await gv(Q,e=>{Q.setHour(uy),Q.render(e)},()=>Vy($,!0,0),e,t)}finally{Yy=!1,Xy()}}X.has(`profile`)&&sb();function sb(){let e=document.createElement(`div`);e.id=`profile`;let t=Q.gl.getContext(),n=t.getExtension(`WEBGL_debug_renderer_info`),r=String(t.getParameter(n?n.UNMASKED_RENDERER_WEBGL:t.RENDERER)),i=t.getExtension(`EXT_disjoint_timer_query_webgl2`)!==null,a=()=>`scene ${Uv} · GPU ${r} · ${i?`GPU timers`:`no GPU timers (only the uncapped frame and the CPU)`}\nhour ${uy} · x ${ay.target.x.toFixed(2)} · z ${ay.target.z.toFixed(2)} · zoom ${ay.zoom.toFixed(1)} · view ${ay.view} · samples ${Z(`samples`,4)} · shadow map ${Z(`shadowMap`,Wv?4096:2048)} · lines ${Q.settings.lines?`on`:`off`} · shadows ${Q.settings.shadows?`on`:`off`} · prepass ${Q.settings.prepass?`on`:`off`} · water scissor ${Q.settings.waterScissor?`on`:`off`} · equal depth ${Q.settings.equalDepth?`on`:`off`} · ground ${sy(`ground`)} · crop ${sy(`crop`)} · grass ${sy(`grass`)} · weather ${Dy??JSON.stringify($)}\n${location.href}\n${navigator.userAgent}`,o=Object.assign(document.createElement(`pre`),{textContent:`${a()}\n\nPlug the laptop in, close other apps, then Run. It takes a minute or two.`}),s=Object.assign(document.createElement(`button`),{textContent:`Run`}),c=Object.assign(document.createElement(`button`),{textContent:`Copy`,disabled:!0}),l=Object.assign(document.createElement(`a`),{textContent:`profile the ${Wv?`meadow`:`farm`}`}),u=new URLSearchParams(X);u.set(`scene`,Wv?`meadow`:`farm`),l.href=`?${u}`,s.onclick=async()=>{s.disabled=!0,c.disabled=!0;let e=hv(),t=[],n=a();o.textContent=`${n}\n\nRunning…`,await ob(e,(r,i)=>{t.push(r),o.textContent=`${n}\n\n${yv(t)}\n\n${i+1} of ${e.length}…`}),o.textContent=`${n}\n\n${yv(t)}\n\nms per frame; GPU per pass, CPU for the whole frame; uncapped: frames drawn back to back.`,s.disabled=!1,c.disabled=!1},c.onclick=()=>navigator.clipboard.writeText(o.textContent??``),e.append(s,c,l,o),document.body.append(e)}var cb=performance.now(),lb=cb,ub=0,db=-1;function fb(e){if(Yy){requestAnimationFrame(fb);return}let t=Math.min((e-lb)/1e3,.1);lb=e,ay.update(t);let n=by??(e-cb)/1e3;Hy=n,ab(n),by===null&&xy.advance(t),Cy(),Ty&&wy.draw(ay.target.x,ay.target.z,ay.heading),Math.floor(n*4)!==db&&(db=Math.floor(n*4),Vy(By,!1,n)),Q.setHour(uy),Q.render(n),++ub>=3&&Qv&&Sy()&&(window.__ready=!0),requestAnimationFrame(fb)}