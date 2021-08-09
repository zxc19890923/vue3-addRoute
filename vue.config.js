const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 别名需要的变量
const path =  require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
  // 基本路径
  publicPath: './',
  // 构建时的输出目录
  outputDir: 'dist',
  // 放置静态资源的目录
  assetsDir: 'static',
  // html 的输出路径
  indexPath: 'index.html',
  //文件名哈希
  filenameHashing: true,
  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  lintOnSave: false,
  // 是否使用带有浏览器内编译器的完整构建版本
  runtimeCompiler: false,
  // babel-loader 默认会跳过 node_modules 依赖。
  transpileDependencies: [ /* string or regex */ ],
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,
  // 设置生成的 HTML 中 <link rel='stylesheet'> 和 <script> 标签的 crossorigin 属性。
  crossorigin: '',
  // 在生成的 HTML 中的 <link rel='stylesheet'> 和 <script> 标签上启用 Subresource Integrity (SRI)。
  integrity: false,
  // 调整内部的 webpack 配置
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'pro') { // 生产环境不输出日志
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
    // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
    config.externals = {
      // 'vue': 'Vue',
      // 'element-plus': 'ELEMENT',
      // 'vue-router': 'VueRouter',
      // 'vuex': 'Vuex',
      // 'axios': 'axios'
    }
  },
  chainWebpack: (config) => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('static', resolve('src/static'))
    // 修复HMR, 热更新
    config.resolve.symlinks(true)
    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report')
        .use(BundleAnalyzerPlugin, [{
          analyzerMode: 'static',
        }])
    }
  },
  // 配置 webpack-dev-server 行为。
  devServer: {
    hot: true,
    // webpack4.0 开启热更新
		disableHostCheck: true,
    // 压缩
    compress: true,
    open: true,
    host: 'localhost',  // 如果host/port配置的npm run serve运营侯的地址和端口不一致，控制台就会一直报错 sock.js问题
    port: 8080,
    https: true,
    hotOnly: false,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {
      '/service-core': {
        target: 'https://pingtai.dev.bangying.org', // 接口的域名
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { "^/service-core": "service-core" }
      },
      // '/service-core': {
      //   target: 'http://192.168.3.161:9001', // 接口的域名
      //   secure: true, // 如果是https接口，需要配置这个参数
      //   changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      //   pathRewrite: { "^/service-core": "" }
      // }
    }
  },
  css: {
    // css 分离插件
    // extract: true,
    requireModuleExtension: true,
    // css sourceMap
    sourceMap: true,
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        // data: `@import "~assets/scss/variables.scss";$src: "${process.env.VUE_APP_SRC}";`
      }
    }
  },
  // // 三方插件的选项
  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'scss',
  //     patterns: []
  //   }
  // }
}