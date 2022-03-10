import type { Rule } from 'eslint';
import { processRule } from '../utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'prevent `<script setup>` variables used in `<template lang="pug">` to be marked as unused',
      categories: ['base'],
      url: 'https://eslint.vuejs.org/rules/script-setup-uses-vars.html',
    },
    schema: [],
  },
  create(context) {
    return processRule(context, () => {
      return {};
    });
  },
} as Rule.RuleModule;
