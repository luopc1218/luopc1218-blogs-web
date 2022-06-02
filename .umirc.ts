import { defineConfig } from 'umi';

export default defineConfig({
  title: 'loading...',
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  mfsu: {},
  dva: {
    immer: true,
    hmr: true,
    lazyLoad: true,
  },
  theme: {
    '@primary-color': '#1DA57A',
  },
  proxy: {
    '/api': {
      // 标识需要进行转换的请求的url
      target: 'http://localhost:8080', // 服务端域名
      changeOrigin: true, // 允许域名进行转换
      pathRewrite: { '^/api': '' },
    },
  },
});
