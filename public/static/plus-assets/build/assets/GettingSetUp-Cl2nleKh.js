import{j as e}from"./app-SNu2a1YS.js";import{c as n,x as s,D as i}from"./Layout-B6dIh5PN.js";import"./client-qyRSZoVl.js";import"./Head-DYX4xxzR.js";import"./tabs-D_d5MLxY.js";function a(){return e.jsxs(n,{children:[e.jsx("h2",{id:"requirements",children:"Requirements"}),e.jsx("p",{children:"All of the components in Tailwind Plus are designed for the latest version of Tailwind CSS, which is currently Tailwind CSS v4.1. To make sure that you are on the latest version of Tailwind, update via npm:"}),e.jsx(s,{language:"bash",children:"npm install tailwindcss@latest"}),e.jsxs("p",{children:["If you're new to Tailwind CSS, you'll want to"," ",e.jsx("a",{href:"/docs",children:"read the Tailwind CSS documentation"})," as well to get the most out of Tailwind Plus."]}),e.jsx("h2",{id:"add-the-inter-font-family",children:"Add the Inter font family"}),e.jsxs("p",{children:["We've used ",e.jsx("a",{href:"https://rsms.me/inter",children:"Inter"})," for all of the Tailwind Plus examples because it's a beautiful font for UI design and is completely open-source and free. Using a custom font is nice because it allows us to make the components look the same on all browsers and operating systems."]}),e.jsx("p",{children:"You can use any font you want in your own project of course, but if you'd like to use Inter, the easiest way is to first add it via the CDN:"}),e.jsx(s,{language:"html",children:'<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />'}),e.jsx("p",{children:'Then add "InterVariable" to your "sans" font family in your Tailwind theme:'}),e.jsx(s,{language:"css",children:`@theme {
            --font-sans: InterVariable, sans-serif;
            --font-sans--font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
          }`}),e.jsxs("p",{children:["If you're still on Tailwind CSS v3.x, you can do this in your"," ",e.jsx("code",{children:"tailwind.config.js"})," file:"]}),e.jsx(s,{language:"js",children:`const defaultTheme = require('tailwindcss/defaultTheme')

          module.exports = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
                },
              },
            },
            // ...
          }`}),e.jsx("h2",{id:"dark-mode-support",children:"Dark mode support"}),e.jsxs("p",{children:["If you're using dark mode components, add the ",e.jsx("code",{children:"dark:scheme-dark"})," class to your"," ",e.jsx("code",{children:"<html>"})," element to ensure that the browser renders scrollbars and other native UIs correctly in dark mode. Also include the ",e.jsx("code",{children:"dark:bg-gray-950"})," class to provide a dark background for the entire page:"]}),e.jsx(s,{language:"html",children:'<html class="bg-white dark:bg-gray-950 scheme-light dark:scheme-dark">'})]})}a.layout=t=>e.jsx(i,{title:"Getting set up",children:t});export{a as default};
