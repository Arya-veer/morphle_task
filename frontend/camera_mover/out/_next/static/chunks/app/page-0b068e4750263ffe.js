(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{9127:(e,t,r)=>{Promise.resolve().then(r.bind(r,5424))},5424:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var a=r(5155);r(5565);var s=r(2115);let n="http://52.172.219.28/back";function o(){let[e,t]=(0,s.useState)({x:0,y:0}),[r,o]=(0,s.useState)(0),[c,l]=(0,s.useState)(0),[i,d]=(0,s.useState)("white"),h=(0,s.useRef)(null),u={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowRight:[1,0],ArrowLeft:[-1,0]},[x,f]=(0,s.useState)(null);async function p(){let e=await fetch("".concat(n,"/board_settings/")),t=await e.json();o(t.rows),l(t.cols)}async function m(){await fetch("".concat(n,"/reset_camera/"),{method:"POST"})}async function w(){await p(),setInterval(()=>{fetch("".concat(n,"/movement/")).then(e=>{e.json().then(e=>{let r=e.current_position[0],a=e.current_position[1];d(e.color),t({x:r,y:a})})})},1e3)}return(0,s.useEffect)(()=>{w(),h.current&&h.current.focus()},[]),(0,a.jsxs)("div",{className:"h-screen w-screen bg-gray-200 p-4 flex flex-col items-center",ref:h,tabIndex:"0",onKeyUp:e=>{u[e.key]&&fetch("".concat(n,"/movement/"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({x:u[e.key][0],y:u[e.key][1]})}).then(e=>{400===e.status?e.json().then(e=>{f(e.message)}):f(null)})},children:[(0,a.jsxs)("div",{className:" flex flex-row justify-between w-1/2 p-2 mx-auto",children:[(0,a.jsx)("h1",{className:"text-4xl text-center text-black",children:"Camera Mover"}),(0,a.jsx)("div",{className:"w-fit border-red-500 rounded-md p-2 border-2 hover:bg-red-500 hover:text-white cursor-pointer text-red-500",onClick:m,children:"Reset"})]}),(0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(".concat(c,", auto)"),gridTemplateRows:"repeat(".concat(r,", auto)"),border:"2px solid black",width:"80vh",height:"80vh"},children:Array(r).fill(0).map((t,r)=>Array(c).fill(0).map((t,s)=>(0,a.jsx)("div",{style:{backgroundColor:r===e.y&&s===e.x?i:"white",borderRight:"1px solid black",borderBottom:"1px solid black"}},"".concat(r,"-").concat(s))))}),x&&(0,a.jsx)("p",{className:"text-red-500",children:x})]})}}},e=>{var t=t=>e(e.s=t);e.O(0,[565,441,517,358],()=>t(9127)),_N_E=e.O()}]);