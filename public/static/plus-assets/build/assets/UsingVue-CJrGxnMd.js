import{j as e}from"./app-SNu2a1YS.js";import{c as i,x as a,D as s}from"./Layout-B6dIh5PN.js";import"./client-qyRSZoVl.js";import"./Head-DYX4xxzR.js";import"./tabs-D_d5MLxY.js";function o(){return e.jsxs(i,{children:[e.jsx("h2",{id:"installing-dependencies",children:"Installing dependencies"}),e.jsxs("p",{children:["Tailwind Plus for Vue depends on ",e.jsx("a",{href:"https://headlessui.dev",children:"Headless UI"})," to power all of the interactive behavior and ",e.jsx("a",{href:"https://heroicons.com",children:"Heroicons"})," for icons, so you'll need to add these two libraries to your project:"]}),e.jsx(a,{language:"bash",children:"npm install @headlessui/vue @heroicons/vue"}),e.jsx("h2",{id:"creating-components",children:"Creating components"}),e.jsx("p",{children:"All Vue examples are provided as a simple single component and make no assumptions about how you want to break things down, what prop APIs you want to expose, or where you get any data from."}),e.jsx("p",{children:"Some data has been extracted into basic local variables just to clean up duplication and make the code easier to read and understand, but we've tried to do as little as possible to avoid enforcing any unnecessarily rigid opinions."}),e.jsx("p",{children:"When you're adapting code from Tailwind Plus for your own projects, you should break the examples down into smaller components as necessary to achieve whatever level of reuse you need for your project."}),e.jsx("p",{children:"For example, you might start with this stacked list component:"}),e.jsx(a,{language:"html",children:`<template>
          <ul class="divide-y divide-gray-200">
            <li v-for="person in people" :key="person.email" class="flex py-4">
              <img class="size-10 rounded-full" :src="person.image" alt="" />
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ person.name }}</p>
                <p class="text-sm text-gray-500">{{ person.email }}</p>
              </div>
            </li>
          </ul>
        </template>

        <script>
          const people = [
            {
              name: 'Calvin Hawkins',
              email: 'calvin.hawkins@example.com',
              image: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
              name: 'Kristen Ramos',
              email: 'kristen.ramos@example.com',
              image: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
              name: 'Ted Fox',
              email: 'ted.fox@example.com',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
          ]

          export default {
            setup() {
              return {
                people,
              }
            },
          }
        <\/script>`}),e.jsx("p",{children:"After adapting the content for your own project, breaking it down into separate components, and wiring up your data source, it might look more like this:"}),e.jsx(a,{language:"html",children:`<!-- HockeyTeamList.vue -->
        <template>
          <ul class="divide-y divide-gray-200">
            <HockeyTeamItem v-for="team in teams" :key="team.id" :team="team" />
          </ul>
        </template>

        <script>
          export default {
            props: {
              teams: Array,
            },
          }
        <\/script>

        <!-- HockeyTeamListItem.vue -->
        <template>
          <li class="flex py-4">
            <img class="size-10 rounded-full" :src="team.logo" alt="" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ team.name }}</p>
              <p class="text-sm text-gray-500">{{ team.city }}</p>
            </div>
          </li>
        </template>

        <script>
          export default {
            props: {
              team: Object,
            },
          }
        <\/script>`}),e.jsxs("p",{children:["Tailwind Plus is more like a set of blueprints, patterns, and ideas than a rigid UI kit. The code you end up with at the end of the day is ",e.jsx("em",{children:"yours"}),", and you can factor it however you like."]})]})}o.layout=t=>e.jsx(s,{title:"Using Vue",children:t});export{o as default};
