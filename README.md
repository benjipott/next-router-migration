# next-router-migration

A simple and light-weight `react-router` plugin for Next.js applications.

- ✨ Zero dependencies
- 🦄 TypeScript support 

Although `next-router-migration` supports only essential `react-router` properties, it would be enough for most websites.

If you need advanced `react-router` hooks or component, you are welcome to contribure

This repository is here only to help you to migrate to NextJS easely and remove step by step your legacy code

## Install
```bash
$ npm install next-router-migration
# or with yarn
$ yarn add next-router-migration
```

## Usage

Add `next-router-migration` alias in your `next.config.js` file 

Example:

```tsx
// next.config.ts
module.exports = {
  webpack: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'react-router-dom': 'next-router-migration'
      }
    }
  })
}
```


## Add your routes paths and redirect in your config to replace your Router file but t's optional

```tsx
// next.config.ts
module.exports = {
  rewrites: async () => [
    {
      source:
        '/my-custo-routes',
      destination:
        'home-my-custom-routes',
    },
}
```

There are 2 options to configure default SEO properies.

### Add your routes in `pages/*.tsx`

you can now run your code keep or remove `react-router-dom` in your codebase and replace it with `next/router`