export default {
  /**
   * 网页标题
   */
  title: import.meta.env.VITE_APP_TITLE,
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-light',
  /**
   * 是否系统布局配置
   */
  showSettings: true,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * 是否显示全局搜索
   */
  headerSearch: true,

  /**
   * 是否显示多语言
   */
  langSelect: true,

  /**
   * 是否显示面包屑
   */
  breadcrumbVisible: true,

  /**
   * 是否显示面包屑图标
   */
  breadcrumbIconVisible: true,

  /**
   * tab栏样式：google（谷歌风格）或button（按钮风格）
   */
  tabStyle: 'google',

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * 水印设置
   */
  watermark: {
    /**
     * 是否显示水印
     */
    visible: false,
    /**
     * 是否包含用户名
     */
    enableUserName: false,
    /**
     * 水印文本
     */
    text: 'WES Admin'
  },

  /**
   * 是否启用页面动画
   */
  pageAnimate: true,

  /**
   * 页面动画模式
   */
  pageAnimateMode: 'fade-slide',

  /**
   * 滚动模式：wrapper（外层滚动）或 content（内容滚动）
   */
  scrollMode: 'wrapper'
}
