import { defineConfig } from "umi";

export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  history: {
    type: "hash",
  },
  npmClient: "yarn",
  plugins: ['umi-plugin-keep-alive'],
});
