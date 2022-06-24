import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    // babel-plugin-import
    import: false,
  },
  model: {},
  mfsu: false,
  request: {},
  dva: {},
  lessLoader: {
    // 通过globalVars在每个less文件头引入antd定义的variable.less文件，里面有less变量和css变量
    // 相关的映射
    globalVars: {
      theme: 'true;@import "~antd/lib/style/themes/variable.less"',
    },
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
