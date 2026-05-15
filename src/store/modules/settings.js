import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'

const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle, headerSearch, langSelect, breadcrumbVisible, breadcrumbIconVisible, tabStyle, watermark, pageAnimate, pageAnimateMode, scrollMode } = defaultSettings

const storageSetting = localStorage.getItem('layout-setting')?JSON.parse(localStorage.getItem('layout-setting')) : ''

const useSettingsStore = defineStore(
  'settings',
  {
    state: () => ({
    title: '',
    theme: storageSetting.theme || '#646cff',
      sideTheme: storageSetting.sideTheme || sideTheme,
      showSettings: showSettings,
      topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
      tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
      fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
      sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
      dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
      headerSearch: storageSetting.headerSearch === undefined ? headerSearch : storageSetting.headerSearch,
      langSelect: storageSetting.langSelect === undefined ? langSelect : storageSetting.langSelect,
      breadcrumbVisible: storageSetting.breadcrumbVisible === undefined ? breadcrumbVisible : storageSetting.breadcrumbVisible,
      breadcrumbIconVisible: storageSetting.breadcrumbIconVisible === undefined ? breadcrumbIconVisible : storageSetting.breadcrumbIconVisible,
      tabStyle: storageSetting.tabStyle === undefined ? tabStyle : storageSetting.tabStyle,
      watermark: {
        visible: storageSetting.watermark?.visible === undefined ? watermark.visible : storageSetting.watermark.visible,
        enableUserName: storageSetting.watermark?.enableUserName === undefined ? watermark.enableUserName : storageSetting.watermark.enableUserName,
        text: storageSetting.watermark?.text === undefined ? watermark.text : storageSetting.watermark.text
      },
      pageAnimate: storageSetting.pageAnimate === undefined ? pageAnimate : storageSetting.pageAnimate,
      pageAnimateMode: storageSetting.pageAnimateMode === undefined ? pageAnimateMode : storageSetting.pageAnimateMode,
      scrollMode: storageSetting.scrollMode === undefined ? scrollMode : storageSetting.scrollMode
    }),
    actions: {
      // 修改布局设置
      changeSetting(data) {
        const { key, value } = data
        if (this.hasOwnProperty(key)) {
          this[key] = value
        }
      },
      // 设置网页标题
      setTitle(title) {
        this.title = title
        useDynamicTitle();
      }
    }
  })

export default useSettingsStore
