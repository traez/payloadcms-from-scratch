# PayloadCMS From Scratch

Attempts at creating working PayloadCMS prototype for freelancing

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
  - [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [Author](#author)
  - [Acknowledgments](#acknowledgments)

## Overview

### The Challenge/User Stories

As a freelance developer exploring PayloadCMS for client-ready projects, I wanted to build a working prototype that goes beyond basic setup—one that connects a real Postgres database, integrates Tailwind and ShadCN, uses proper access controls, and runs seamlessly inside a Next.js app. Along the way, I tackled practical issues like URI encoding in connection strings, version mismatches between React and React-DOM, missing dependencies, and type generation quirks. The goal was to understand how Payload’s collections, globals, hooks, and Local API all fit together to create a flexible, type-safe CMS foundation I can confidently reuse across future freelance work.

### Screenshot

![](/public/screenshot-desktop.png)

### Links

- Solution URL: [https://github.com/traez/payloadcms-from-scratch](https://github.com/traez/payloadcms-from-scratch)
- Live Site URL: [https://payloadcms-from-scratch.vercel.app/](https://payloadcms-from-scratch.vercel.app/)

## My process

### Built with

## Core Stack
- **[Next.js](https://nextjs.org/)** – React framework for hybrid rendering
- **[React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)** – Type-safe component development
- **[Node.js](https://nodejs.org/)** – Backend runtime
- **[PostgreSQL](https://www.postgresql.org/)** via `@payloadcms/db-postgres` – Relational database
- **[Payload CMS](https://payloadcms.com/)** – Headless CMS, integrated with Next.js
## Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** + **[PostCSS](https://postcss.org/)** – Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** – Accessible component library built with:
- `@radix-ui/react-dialog` – Modal dialogs
- `@radix-ui/react-slot` – Composable component primitives
- **[Lucide React](https://lucide.dev/)** – Icon library
- `clsx` – Conditional class names
- `class-variance-authority` – Type-safe variant styling
- `tailwind-merge` – Merge Tailwind classes without conflicts
- **[nextjs-toploader](https://www.npmjs.com/package/nextjs-toploader)** – Page transition loader
## Payload Ecosystem
- `@payloadcms/next` – Next.js integration
- `@payloadcms/payload-cloud` – Payload Cloud deployment support
- `@payloadcms/richtext-lexical` – Lexical rich text editor
- `@payloadcms/plugin-form-builder` – Form builder plugin
- `@payloadcms/storage-vercel-blob` – File uploads via Vercel Blob
- `@payloadcms/ui` – Admin panel UI components
## Other Utilities
- **[dotenv](https://www.npmjs.com/package/dotenv)** – Environment variable management
- **[GraphQL](https://graphql.org/)** – Optional GraphQL support
- **[Sharp](https://sharp.pixelplumbing.com/)** – High-performance image processing
- **[cross-env](https://www.npmjs.com/package/cross-env)** – Consistent environment variable handling across OS  

### What I learned

**1 Starter Templates**  
When you run `npx create-payload-app`, you're presented with 3 template options:
- **Blank** - A minimal starter with just the basics
- **Website** - A template with pages and posts collections. Meant for blog/portfolio/etc.
- **E-commerce** - A template with products, orders, and customers collections (opensource-odyssey chose this) 

**2 React and React-DOM Dependency Issues**  
This could occur as I experienced: After installing Next.js and then PayloadCMS, "react" was installed but "react-dom" wasn't. So I encountered a dependency mismatch because Next.js internally manages react-dom without listing it in your `package.json`, while PayloadCMS requires it to be explicitly defined for its server-side rendering and build processes. This discrepancy arose even though the type definitions for react-dom were present, necessitating an explicit installation of the react-dom package to ensure both frameworks operate correctly together. 

**3 React Version Mismatch Fix**  
Also experienced this: Your project is throwing errors because react is pinned to version 19.1.0 while react-dom is being pulled in at 19.1.1 through another dependency, and Payload requires them to match exactly. Since react-dom isn't explicitly listed in your `package.json`, pnpm resolved it to a different patch version, causing the mismatch. The fix is to explicitly add `react-dom@19.1.0` to your dependencies, delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install` and restart, which will align both packages and stop the errors. 

**4 ESLint Configuration Issue**  
Experienced this: That error happens because ESLint is trying to load `@eslint/eslintrc` but it isn't installed in your project. Some Next.js ESLint configs (like `eslint-config-next`) rely on it indirectly, but pnpm doesn't hoist it unless you explicitly add it.
**Fix:** Run this to install the missing package:
```shellscript
pnpm add -D @eslint/eslintrc
```
Then re-run: `pnpm run lint`  

**5 Environment Variables: dotenv vs t3-env**  
`dotenv` is a small library that loads environment variables from a `.env` file into `process.env`, and Payload CMS includes it by default so you don't have to install or configure it yourself. `t3-env`, on the other hand, is an optional helper built for TypeScript projects that uses Zod to validate and type-check env vars, making sure they exist and match the right format before your app runs. In practice, dotenv handles the loading, while t3-env adds an extra layer of safety, but since Payload already ships with dotenv, you can rely on it alone unless you specifically want strict validation and type safety.  

**6 Main Configuration File**  
`payload-config.ts` - the main CMS configuration file. It defines, among others, database configuration, added collections, global settings, plugins, and many other options.  

**7 Telemetry Configuration**  
If you don't set a telemetry option in your `payload.config.ts`, Payload enables it by default and sends anonymous usage data back to the team to help them track growth. The option is completely optional—leaving it out won't cause errors—but it means telemetry stays on. To turn it off, you just add `telemetry: false` at the top level of your config.  

**8 Absolute vs Relative Imports**  
Using absolute imports (like `@/components/Button`) instead of long relative paths (`../../../components/Button`) is generally seen as best practice in modern projects because it makes code easier to maintain and refactor. With absolute paths, moving files around won't break imports, and copy-pasting code between folders works without extra fixes. It also keeps imports shorter, cleaner, and more consistent across the project. Relative imports are still fine for files in the same folder or one level up, but for shared components, utils, or models, absolute imports are the clearer choice.  

**9 PostgreSQL Connection String Encoding**  
Postgres passwords can include almost any printable ASCII character, but when you use them in a connection string (URI) only letters (a–z, A–Z), numbers (0–9), hyphen (-), underscore (_), period (.), and tilde (~) are safe to use directly. Other characters like `&`, `$`, `@`, `:`, `/`, `?`, and `#` must be URL-encoded (e.g. `&` → `%26`, `$` → `%24`) or they'll break the URI parsing. If the password isn't encoded properly, Postgres may ignore part of the connection string and default to trying the username "postgres", leading to the common error `password authentication failed for user "postgres"`. Always encode special characters in your password before pasting into `.env` connection strings to avoid this issue.    

**10 SQL Query Generation**  
Yes—when you call the Payload Local API, it translates your request into real SQL queries against your PostgreSQL database. Payload takes your collection schema and query options (where, sort, depth, etc.), builds the appropriate SQL, runs it through Postgres, and then shapes the results back into documents (handling relationships, access control, and localization if needed). So while you don't write SQL directly, under the hood it's standard SQL powering all your Local API calls.  

**11 Collections Structure**  
`src/collections` - place for collections, which are the data structures that Payload is based on. Collections are defined in code, which eliminates the need for manual clicking ("click ops"), as is the case in competitive Strapi.  

**12 Collections Explained**  
**Collections:** A Collection is a group of records, called Documents, that all share a common schema. Each Collection is stored in the Database based on the Fields that you define. [More details](https://payloadcms.com/docs/configuration/collections). Examples: User, Media, Post.

**13 Globals Explained**  
**Globals:** Globals are in many ways similar to Collections, except they correspond to only a single Document. Each Global is stored in the Database based on the Fields that you define. [More details](https://payloadcms.com/docs/configuration/globals).  

**14 Configuring Collections**  
To configure collections, just add a reference to the collection in the collections array in the file `payload-config.ts`.   

**15 Auto-Generated Types**  
`payload-types.ts` contains all generated TypeScript types for working with your collections. This file is automatically generated by Payload and **should never be edited manually**. After modifying your Payload config, regenerate types by running `payload generate:types`.

**16 Timestamps Configuration**  
`timestamps` as a Config Option tells Payload to automatically add and maintain `createdAt` and `updatedAt` fields for this collection. If you set to `false`, it disables documents' automatically generated `createdAt` and `updatedAt` timestamps.   

**17 Built-in Authentication**  
PayloadCMS includes its own built-in authentication system tied to a users collection in your database, so all user credentials and profile data are stored alongside the rest of your content. It uses JWTs for sessions, which makes it a stateless auth approach by default, though you can extend or customize it if you need more stateful session handling. Out of the box, it covers email/password login, password resets, email verification, and role-based access control, so you typically don't need external auth libraries unless you require extras like social logins, SSO, or drop-in UI components.  

**18 Access Control Types**  
Access Control determines what a user can and cannot do with any given Document, as well as what they can and cannot see within the Admin Panel. There are three main types of Access Control in Payload:
- Collection Access Control
- Global Access Control
- Field Access Control  

**19 Local API Access Control**  
Payload's Local API is meant for server-side code that you fully trust. By default, it skips all access control so your backend can read, create, update, or delete any data without restriction. This makes server operations simpler and faster. If you want access rules to apply in server code, you can set `overrideAccess: false` in your requests. [Learn more](https://payloadcms.com/docs/access-control/overview)

In your Posts collection, the read access function is `() => true`, which always allows reading. That's why your frontend, which uses the Local API to fetch posts, works as expected even without `overrideAccess: false`. The other rules (`update: editor`, `create: admin`, `delete: admin`) are only enforced when access control is applied, such as in the Admin Panel. This is why users without the proper roles cannot update or delete posts there.

The Admin Panel itself uses Payload's REST/GraphQL APIs for operations like create, update, and delete. This is documented in Payload Admin Overview, and it's why your role-based restrictions work in the admin panel even though the Local API bypasses them. Essentially, Local API is trusted server-side code, while the public/admin APIs enforce access control for untrusted clients.  

**20 Fields Overview**  
**Fields:** In Payload, fields define the schema of your documents and automatically generate the matching UI in the Admin Panel. They can store data (like text, numbers, arrays, etc.) or serve presentational purposes.  

**21 Text Field Configuration**  
**Type: text**
Text Field: The Text Field is one of the most commonly used fields. It saves a string to the database and provides the Admin Panel with a simple text input. Below are 3 Config Options possible under it:
- `unique: true` → no two posts can share the same slug
- `index: true` → improves lookup performance for queries filtering by slug
- `admin.position: 'sidebar'` → in the admin UI, this field appears in the sidebar instead of the main form  

**22 Blocks Field Type**  
**Blocks** are fields that store arrays of objects, where each object (or "block") has its own custom schema. They let you build flexible, reusable content structures for a variety of use cases.  

**23 Rich Text Editor Evolution**  
Payload CMS originally used Slate, a React-based rich text framework created in 2016 that offered lots of flexibility but was heavy to maintain and could slow down with large documents. In 2022, Meta released Lexical, a faster, more modern editor that Payload adopted as its new default in v2 because it's lightweight, accessible, and easier to build advanced features on. Payload still supports Slate for older projects, but recommends migrating to Lexical, with a guide available to help convert content.  

**24 Content Management Philosophy**  
With Payload, instead of hardcoding things like forms, navigation, or site settings directly into your code, you define them as collections or globals so they can be managed through the dashboard. This separates content from code, making it easy for non-developers to update data without redeploying, ensures consistency through schema validation, and keeps your frontend focused on rendering rather than storing values. The payoff is flexibility and scalability—you set up the structure once in Payload, and then the site can grow or change just by updating entries in the admin panel.  

**25 What to Hardcode vs. Configure**  
In Payload, hardcode most stuff, but set up collections and globals for things like Products/Listings (with fields for pricing, stock, descriptions, images, and categories) and Blog/News/Case Studies (with titles, slugs, content, featured images, authors, dates, and SEO). Set up access controls so clients can add or edit items in these collections but don't have permission to touch sensitive areas. 

**26 Plugin Philosophy**  
**Plugins:** Payload could have made official plugins "part of the framework," but by making them plugins, they send the signal that everything outside the bare essentials is optional and modular—even their own work. 

**27 Form Builder Plugin**  
The Payload Form Builder plugin lets admins create and manage custom forms from the Admin Panel without hard-coding forms every time. Makes stuff DRY. To install:
```shellscript
pnpm add @payloadcms/plugin-form-builder
``` 

**28 Version Mismatch Warning**  
**Common issue:** Payload version mismatch. All `@payloadcms/*` packages must be on the exact same version as `payload`. If one is different (e.g. `@payloadcms/plugin-form-builder@3.54.0` but `payload@3.53.0`), you'll see errors like:
```plaintext
Error: Mismatching "payload" dependency versions found
```
**Fix:** Update `package.json` so all `@payloadcms/*` packages use the same version, then reinstall. Example:
```json
"dependencies": {
  "payload": "3.53.0",
  "@payloadcms/plugin-form-builder": "3.53.0",
  "@payloadcms/next": "3.53.0",
}
```
Then run: `pnpm install` 

**29 Server-Side API Best Practice**  
**Best practice:** Stay with Payload Local API. The Payload Local API can only run on the server, so you can't call it directly from a client component like a button click. Instead, you expose a server-side function that wraps your Local API query and then trigger that from the client. In Next.js, the two main ways to do this are server actions (call the server function directly from your component) or API routes/route handlers (client makes a fetch to an API endpoint that runs the query). Either way, the client never talks to the database directly—it always goes through a server function that uses the Local API under the hood.  

**30 Console Logs for Unused Variables**  
Console logs were added in `src/app/my-route/route.ts` to make use of request and payload, preventing ESLint unused variable warnings. But in the future I can turn this file into a real API endpoint that queries Payload CMS collections—for example, fetching documents from posts or creating new entries based on request data. It could also handle custom logic like filtering results, checking authentication headers, or exposing a lightweight API for the frontend. 

**31 Tailwind CSS Installation**  
Tailwind documentation now states install command as dependency, no longer devDependency. No worries though, just follow along:
```shellscript
pnpm add tailwindcss @tailwindcss/postcss postcss
``` 

**32 ShadCN Integration**  
ShadCN installation is easy too, as in documentation. In summary, adding Tailwind/ShadCN to frontend is easy and straightforward. But there are many different guides on doing the same to the backend admin side. I didn't bother and instead use inline CSS for minimal styling of the any admin content on very rare occasions.  

**33 Root Components Customization**  
[Root Components](https://payloadcms.com/docs/custom-components/root-components) are those that affect the Admin Panel at a high-level, such as the logo or the main nav. You can swap out these components with your own Custom Components to create a completely custom look and feel. Unconventional approach by my standards but it works. Used below Config Options: `beforeLogin`, `graphics.Icon`, `graphics.Logo`.  

**34 Meta Admin Options**  
All root-level options for the Admin Panel are defined in your Payload Config under the `admin` property. `meta` is base metadata to use for the Admin Panel. Root Metadata is the metadata that is applied to all pages within the Admin Panel. Note that you can also customize metadata on the Collection, Global, and Document levels through their respective configs. 

**35 Hooks Overview**  
PayloadCMS Hooks Overview: Hooks are functions/methods that allow you to execute your own side effects during specific events of the Document lifecycle. They allow you to do things like mutate data, perform business logic, integrate with third-parties, or anything else, all during precise moments within your application.
There are four main types of Hooks in Payload, each with their own subdivisions:
- Root Hooks
- Collection Hooks
- Global Hooks
- Field Hooks 

**36 Collection Hooks for Lifecycle Events**  
Collection hooks in PayloadCMS are lifecycle functions that run automatically when documents in a collection are created, updated, or deleted. They let you add custom logic—like generating slugs, syncing to external services, or invalidating caches—without touching your main app code. For example, `afterChange` runs after a document is saved and `afterDelete` after one is removed, with access to useful arguments like the new doc, the previousDoc, the operation type, and the request object. This makes it easy to automate side effects and keep your app consistent whenever content changes. 

**37 Cache Invalidation with Hooks**  
In this project, the Posts collection uses hooks for both content handling and cache invalidation. A `beforeValidate` hook (`generateSlugAndPublishedAt`) ensures each post has a clean slug, sets `publishedAt` when needed, normalizes tags, and slugifies author names before saving. After changes, the `revalidatePosts` and `revalidatePostsAfterDelete` hooks call Next.js's `revalidateTag` to clear the `['tags']` and `['authors']` caches. This allows layout-level helpers like `getSortedTags` and `getSortedAuthors` to rely on long-lived caching for performance while still reflecting editor updates immediately, much like WordPress.  

**38 Vercel Blob Storage Integration**  
Your Payload app saves uploads to Vercel Blob through the storage adapter, which only needs the `BLOB_READ_WRITE_TOKEN` to talk to Vercel's Blob API. That token is tied to your Vercel account and decides where files go, so there's no need to "link" Blob to your project manually in the Vercel dashboard. The database stores just the metadata, while the actual files live in Blob storage, which you can view via the Vercel CLI (`vercel blob ls`) or under Storage → Blobs in your Vercel account. Since I already set up the blob token in project `.env`, it's no longer even possible to manually add it via Vercel dashboard.  

**39 Multi-Tenancy Concept**  
Multi-tenancy in PayloadCMS means you can run one CMS app that serves many different clients or projects (tenants), each with its own content and settings, without needing separate codebases or deployments. The multi-tenant plugin tags all content with a tenant ID so data stays isolated—Tenant A only sees Tenant A's data, Tenant B only sees Tenant B's data. Think of it like one apartment building (the CMS) with many apartments (tenants), where each has its own keys and furniture but shares the same structure. 

**40 AI Prompt for Dummy Content**  
AI prompt for getting dummy blog post data:
```plaintext
share a very random 300 word blog post with 
title 
2 tags 
author first and last name 
excerpt 200 characters
The title shouldn't start with "The", be creative with Title choices
``` 

**41 Useful Resources**  
**Official Docs:** [https://payloadcms.com/docs/getting-started/installation](https://payloadcms.com/docs/getting-started/installation)  
**GitHub:** [https://github.com/payloadcms/payload](https://github.com/payloadcms/payload)  
**PayloadCMS from Scratch Part 1 to 5** (Nice volunteer intro to ecosystem plus Tailwind/ShadCN) published Q1 2025: [https://adrianmaj.com/en/blog](https://adrianmaj.com/en/blog)  
**NLV Codes PayloadCMS Tutorials:** [https://www.youtube.com/@nlv_codes/videos](https://www.youtube.com/@nlv_codes/videos)  
**OpenSource-Odyssey** (PayloadCMS series guy with Repo! Run through all his videos. Discovered him from 1 month YouTube search for payloadCMS):  
- YouTube: [https://www.youtube.com/@OpenSource-Odyssey/videos](https://www.youtube.com/@OpenSource-Odyssey/videos)  
- GitLab: [https://gitlab.com/opensource-odyssey/opensource-odyssey-website](https://gitlab.com/opensource-odyssey/opensource-odyssey-website)  
- Website: [https://opensource-odyssey.net/](https://opensource-odyssey.net/)  

**Active Payload CMS development:** [https://github.com/search?q=payloadcms%20blog&type=repositories](https://github.com/search?q=payloadcms%20blog&type=repositories)  

### Continued development

- More projects; increased competence!

### Useful resources

Stackoverflow  
YouTube  
Google  
ChatGPT

## Author

- Website - [Zeeofor Technologies](https://zeeofor.tech)
- Twitter - [@trae_z](https://twitter.com/trae_z)

## Acknowledgments

-Jehovah that keeps breath in my lungs
