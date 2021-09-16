# eslint-plugin-vue-pug-sfc

## Motivation

- https://github.com/vuejs/eslint-plugin-vue/issues/640
- https://github.com/vuejs/eslint-plugin-vue/issues/310
- https://github.com/vuejs/vue-eslint-parser/issues/29

## How to

```shell
yarn add -D eslint-plugin-vue-pug-sfc
```

In `eslint` config:

```jsonc
{
  "plugins": ["vue-pug-sfc"],
  "rules": {
    "vue-pug-sfc/this-in-template": "warn"
  }
}
```
