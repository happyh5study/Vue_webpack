const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // 模式: 生产环境
 // mode:'production',
  // 入口
  entry:{
    app:path.resolve(__dirname,'src/index.js')
  },
  // 出口(打包生成js)
  output:{
    filename:'static/js/[name].bundle.js',
    path:path.resolve(__dirname,'dist'),
    publicPath: '/', // 引入打包文件的路径左侧以 / 开头
  },
  // 模块加载器
  module:{
    rules:[
      //处理ES6
      {
        test: /\.js$/, // 用于匹配文件(对哪些文件进行处理)
        // exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')], // 只针对哪些处理
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                'corejs': 2 // 处理一些新语法的实现
              }]
            ], // 预设包: 包含多个常用插件包的一个大包

            plugins: [
              
              ['component', {
                "libraryName": "mint-ui", // 针对mint-ui库实现按需引入打包
                "style": true // 自动打包对应的css
              }]
            ]
            // Error: .plugins[0][1] must be an object, false, or undefined
          }
        }
      },
      
      //处理CSS
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'], // 多个loader从右到左处理
      },
      //处理图片
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'static/img/[name].[hash:7].[ext]' // 相对于output.path
        }
      },

      //处理vue单文件组件模块
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  // 插件
  plugins:[
    new HtmlWebpackPlugin({
      template:'index.html',//将那个页面作为模板页面处理
      filename:'index.html'//生成页面（在output指定的path下）
    }) ,
    new VueLoaderPlugin()

  ],
  //配置开发服务器
  devServer: {
    port:8088,
    open: true, // 自动打开浏览器
    quiet: true, // 不做太多日志输出
    proxy: {
      // 处理以/api开头路径的请求
      // '/api': 'http://localhost:4000'   // http://localhost:4000/api/search/users
      '/api': {
        target: 'http://localhost:4000', // 转发的目标地址
        pathRewrite: {
          '^/api' : ''  // 转发请求时去除路径前面的/api
        },
      },

      '/gh': {
        target: 'https://api.github.com', // 转发的目标地址
        pathRewrite: {
          '^/gh' : ''  // 转发请求时去除路径前面的/api
        },
        changeOrigin: true, // 支持跨域, 如果协议/主机也不相同, 必须加上
      }
    },
        historyApiFallback: true, // 任意的 404 响应都被替代为 index.html
  },

  //配置开启source-map调试
  devtool: 'cheap-module-eval-source-map',//提示那个文件哪一行出了问题
  
  //引入模块解析
  resolve:{
    extensions:['.js','.vue','.json'],//可以省略的后缀
    alias:{//路径别名（简写方式）
      'vue$':'vue/dist/vue.esm.js',//表示精准匹配
      '@': path.resolve(__dirname, 'src'),
    }
  }

}