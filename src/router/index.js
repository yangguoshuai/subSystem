import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import Layout1 from '@/views/layout/Layout1'

/* Router Modules */

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }

]

export default new Router({
  // mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  scrollBehavior(to, from, savedPosition) {
  // 保存到 meta 中，备用
    to.meta.savedPosition = savedPosition
    if (savedPosition) {
      return { x: 0, y: 0 }
    }
    return {}
  },
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /** When your routing table is too long, you can split it into small modules**/

  {
    path: '/userManager',
    component: Layout,
    redirect: 'noredirect',
    name: '用户管理',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [
      {
        path: '/user',
        component: () => import('@/views/admin/user/index'),
        name: 'Usermanager',
        meta: { title: '用户', noCache: true }
      },
      // {
      //   path: '/role',
      //   component: () => import('@/views/admin/role/index'),
      //   name: 'Rolemanager',
      //   meta: { title: '角色', noCache: true }
      // }
      {
        path: '/permissionManager',
        component: () => import('@/views/admin/permission/index'),
        name: 'Permissionmanager',
        meta: { title: '权限', noCache: true }
      }
    ]
  },
  {
    path: '/diatrictManager',
    component: Layout,
    redirect: 'noredirect',
    name: '行政区管理',
    meta: {
      title: '行政区管理',
      icon: 'list'
    },
    children: [
      {
        path: '/district',
        component: () => import('@/views/district/district'),
        name: 'DistrictManager',
        meta: { title: '行政区管理', noCache: true }
      }
    ]
  },
  {
    path: '/typeManager',
    component: Layout,
    redirect: 'noredirect',
    name: '源数据管理',
    meta: {
      title: '源数据管理',
      icon: 'list'
    },
    children: [
      {
        path: '/institute',
        component: () => import('@/views/type/institute'),
        name: 'TypeInstituteManager',
        meta: { title: '研究院类型', noCache: true }
      },
      {
        path: '/daimler',
        component: () => import('@/views/type/daimler'),
        name: 'TypeDaimlerManager',
        meta: { title: 'Daimler类型', noCache: true }
      },
      {
        path: '/aisoData',
        component: () => import('@/views/type/aisoData'),
        name: 'AisoDataManager',
        meta: { title: 'Aiso数据', noCache: true }
      },
      {
        path: '/autoai',
        component: () => import('@/views/type/autoai'),
        name: 'AutoAiManager',
        meta: { title: '四维智联类型', noCache: true }
      },
      {
        path: '/TencentData',
        component: () => import('@/views/tencent/index'),
        name: 'TencentDataManager',
        meta: { title: '腾讯类型', noCache: true }
      },
      {
        path: '/DidiData',
        component: () => import('@/views/didi/didiData'),
        name: 'DidiDataManager',
        meta: { title: '滴滴数据', noCache: true }
      }
    ]
  },
  {
    path: '/relationManager',
    component: Layout,
    redirect: 'noredirect',
    name: '数据对应关系',
    meta: {
      title: '数据对应关系',
      icon: 'list'
    },
    children: [
      {
        path: '/aisoInstituteData',
        component: () => import('@/views/aiso/index'),
        name: 'aisoInstituteDatamanager',
        meta: { title: 'aiso-研究院', noCache: true }
      },
      {
        path: '/aisoDaimlerRelation',
        component: () => import('@/views/type/aiso-daimler'),
        name: 'AisoDaimlerRelationManager',
        meta: { title: 'aiso-daimler', noCache: true }
      },
      {
        path: '/TencentAisoRelation',
        component: () => import('@/views/tencent/relation'),
        name: 'TencentAisoRelationManager',
        meta: { title: 'aiso-tencent', noCache: true }
      },
      {
        path: '/AutoaiAisoData',
        component: () => import('@/views/type/autoai-aiso-data'),
        name: 'AutoaiAisoDataManager',
        meta: { title: 'aiso-Autoai', noCache: true }
      },
      {
        path: '/DidiAisoData',
        component: () => import('@/views/didi/didi-aiso-data'),
        name: 'DidiAisoDataManager',
        meta: { title: 'aiso-滴滴', noCache: true }
      }
    ]
  },
  {
    path: '/configDataManager',
    component: Layout,
    redirect: 'noredirect',
    name: '专题配置数据管理',
    meta: {
      title: '专题配置数据管理',
      icon: 'list'
    },
    children: [
      {
        path: '/rawDataManager',
        component: Layout1,
        name: 'Aiso数据',
        meta: { title: 'Aiso数据', icon: 'list' },
        children: [
          {
            path: '/aisoGasDataManager',
            component: Layout1,
            name: '加油站专题',
            meta: { title: '加油站专题', icon: 'list' },
            children: [
              {
                path: '/aisoGasCompanyType',
                component: () => import('@/views/aiso/gas/aisoGasCompanyType'),
                name: 'AisoGasCompanyTypeManager',
                meta: { title: '公司类型', noCache: true }
              },
              {
                path: '/aisoGasFuelType',
                component: () => import('@/views/aiso/gas/aisoGasFuelType'),
                name: 'AisoGasFuelTypeManager',
                meta: { title: '燃料类型', noCache: true }
              },
              {
                path: '/aisoGasOliType',
                component: () => import('@/views/aiso/gas/aisoGasOliType'),
                name: 'AisoGasOliTypeManager',
                meta: { title: '汽油型号', noCache: true }
              },
              {
                path: '/aisoGasPayment',
                component: () => import('@/views/aiso/gas/aisoGasPayment'),
                name: 'AisoGasPaymentManager',
                meta: { title: '支付方式', noCache: true }
              },
              {
                path: '/aisoGasService',
                component: () => import('@/views/aiso/gas/aisoGasService'),
                name: 'AisoGasServiceManager',
                meta: { title: '附属服务类型', noCache: true }
              },
              {
                path: '/aisoGasSP',
                component: () => import('@/views/aiso/gas/aisoGasSP'),
                name: 'AisoGasSPManager',
                meta: { title: '服务提供商', noCache: true }
              },
              {
                path: '/aisoGasStatus',
                component: () => import('@/views/aiso/gas/aisoGasStatus'),
                name: 'AisoGasStatusManager',
                meta: { title: '状态', noCache: true }
              }
            ]
          }
        ]
      },
      {
        path: '/autoRawDataManager',
        component: Layout1,
        name: '四维数据',
        meta: { title: '四维数据', icon: 'list' },
        children: [
          {
            path: '/autoGasDataManager',
            component: Layout1,
            name: '加油站专题',
            meta: { title: '加油站专题', icon: 'list' },
            children: [
              {
                path: '/autoGasBrand',
                component: () => import('@/views/auto/gas/autoGasBrand'),
                name: 'AutoGasBrandManager',
                meta: { title: '品牌', noCache: true }
              },
              {
                path: '/autoGasFuelType',
                component: () => import('@/views/auto/gas/autoGasFuelType'),
                name: 'AutoGasFuelTypeManager',
                meta: { title: '燃料类型', noCache: true }
              },
              {
                path: '/autoGasOliType',
                component: () => import('@/views/auto/gas/autoGasOliType'),
                name: 'AutoGasOliTypeManager',
                meta: { title: '汽油型号', noCache: true }
              },
              {
                path: '/autoGasPayment',
                component: () => import('@/views/auto/gas/autoGasPayment'),
                name: 'AutoGasPaymentManager',
                meta: { title: '支付方式', noCache: true }
              },
              {
                path: '/autoGasService',
                component: () => import('@/views/auto/gas/autoGasService'),
                name: 'AutoGasServiceManager',
                meta: { title: '附属服务类型', noCache: true }
              },
              {
                path: '/autoGasSP',
                component: () => import('@/views/auto/gas/autoGasSP'),
                name: 'AutoGasSPManager',
                meta: { title: '服务提供商', noCache: true }
              }
            ]
          }
        ]
      },
      {
        path: '/youkeDataManager',
        component: Layout1,
        name: '油客网数据',
        meta: { title: '油客网数据', icon: 'list' },
        children: [
          {
            path: '/youkeGasDataManager',
            component: Layout1,
            name: '加油站专题',
            meta: { title: '加油站专题', icon: 'list' },
            children: [
              {
                path: '/youkeGasBrandManager',
                component: () => import('@/views/youke/gasBrand/youkeGasBrand'),
                name: 'youkeGasBrandManager',
                meta: { title: '品牌', noCache: true }
              },
              {
                path: '/youkeOilManager',
                component: () => import('@/views/youke/oil/youkeGasOil'),
                name: 'youkeOilManager',
                meta: { title: '燃料类型', noCache: true }
              },
              {
                path: '/youkeServerManager',
                component: () => import('@/views/youke/serverType/youkeGasServer'),
                name: 'youkeServerManager',
                meta: { title: '附属服务类型', noCache: true }
              },
              {
                path: '/youkeStatusManager',
                component: () => import('@/views/youke/status/youkeGasStatus'),
                name: 'youkeStatusManager',
                meta: { title: '状态', noCache: true }
              },
              {
                path: '/youkeCompanyManager',
                component: () => import('@/views/youke/company/youkeGasCompany'),
                name: 'youkeCompanyManager',
                meta: { title: '公司类型', noCache: true }
              },
              {
                path: '/youkePayMentManager',
                component: () => import('@/views/youke/payment/youkeGasPayment'),
                name: 'youkePayMentManager',
                meta: { title: '支付方式', noCache: true }
              }
            ]
          }
        ]
      },
      {
        path: '/mapbarDataManager',
        component: Layout1,
        name: '研究院数据',
        meta: { title: '研究院数据', icon: 'list' },
        children: [
          {
            path: '/mapbarGasDataManager',
            component: Layout1,
            name: '加油站专题',
            meta: { title: '加油站专题', icon: 'list' },
            children: [
              {
                path: '/mapbarGasBrandManager',
                component: () => import('@/views/mapbar/gasBrand/gasBrand'),
                name: 'MapbarGasBrandManager',
                meta: { title: '品牌', noCache: true }
              },
              {
                path: '/mapbarFuelTypeManager',
                component: () => import('@/views/mapbar/gasFuelType/gasFuelType'),
                name: 'MapbarFuelTypeManager',
                meta: { title: '燃料类型', noCache: true }
              },
              {
                path: '/mapbarOilTypeManager',
                component: () => import('@/views/mapbar/gasOilType/gasOilType'),
                name: 'MapbarOilTypeManager',
                meta: { title: '汽油型号', noCache: true }
              },
              {
                path: '/mapbarPaymentManager',
                component: () => import('@/views/mapbar/gasPayment/gasPayment'),
                name: 'MapbarPaymentManager',
                meta: { title: '支付方式', noCache: true }
              },
              {
                path: '/mapbarServiceManager',
                component: () => import('@/views/mapbar/gasService/gasService'),
                name: 'MapbarServiceManager',
                meta: { title: '附属服务类型', noCache: true }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/configDatarelation',
    component: Layout,
    redirect: 'noredirect',
    name: '专题配置数据映射',
    meta: {
      title: '专题配置数据映射',
      icon: 'list'
    },
    children: [
      {
        path: '/aisoGas-AutoGas-relation',
        component: Layout1,
        name: '四维-Aiso',
        meta: { title: '四维-Aiso', icon: 'list' },
        children: [
          {
            path: '/autoGasRelation',
            component: Layout1,
            name: '加油站专题',
            meta: { title: '加油站专题', icon: 'list' },
            children: [
              {
                path: '/aisoFuelAndAutoFuelRelation',
                component: () => import('@/views/relationship/aisoFuelAndAutoFuelRelation'),
                name: 'aisoFuelAndAutoFuelRelationManager',
                meta: { title: '燃料类型映射', noCache: true }
              },
              {
                path: '/aisoOliAndautoOliRelation',
                component: () => import('@/views/relationship/aisoOliAndautoOliRelation'),
                name: 'aisoOliAndautoOliRelationManager',
                meta: { title: '汽油型号映射', noCache: true }
              },
              {
                path: '/aisoGasPaymentAndAutoGasPaymentRelation',
                component: () => import('@/views/relationship/aisoGasPaymentAndAutoGasPaymentRelation'),
                name: 'aisoGasPaymentAndAutoGasPaymentRelationManager',
                meta: { title: '支付方式映射', noCache: true }
              },
              {
                path: '/aisoGasServiceAndAutoGasServiceRelation',
                component: () => import('@/views/relationship/aisoGasServiceAndAutoGasServiceRelation'),
                name: 'aisoGasServiceAndAutoGasServiceRelationManager',
                meta: { title: '附属服务类型映射', noCache: true }
              },
              {
                path: '/aisoGasSPAndAutoGasSPRelation',
                component: () => import('@/views/relationship/aisoGasSPAndAutoGasSPRelation'),
                name: 'aisoGasSPAndAutoGasSPRelationManager',
                meta: { title: '服务提供商映射', noCache: true }
              }
            ]
          },
          {
            path: '/aisoBrandTypeAndAutoBrandTypeRelation',
            component: () => import('@/views/relationship/aisoBrandTypeAndAutoBrandTypeRelation'),
            name: 'aisoBrandTypeAndAutoBrandTypeRelationManager',
            meta: { title: '品牌映射', noCache: true }
          },
          {
            path: '/aisoFlavorAndAutoFlavorRelation',
            component: () => import('@/views/relationship/aisoFlavorAndAutoFlavorRelation.vue'),
            name: 'AisoFlavorAndAutoFlavorRelationManager',
            meta: { title: '风味映射', noCache: true }
          }
        ]
      },
      {
        path: '/youkeDataRelationManager',
        component: Layout1,
        name: '油客网-Aiso',
        meta: { title: '油客网-Aiso', icon: 'list' },
        children: [
          {
            path: '/youkeGasRelation',
            component: Layout1,
            name: '加油站专题',
            meta: { title: '加油站专题', icon: 'list' },
            children: [
              {
                path: '/youkeBrandRelationManager',
                component: () => import('@/views/youke/gasBrand/youkeGasBrandRelation'),
                name: 'youkeBrandRelationManager',
                meta: { title: '品牌映射', noCache: true }
              },
              {
                path: '/youkeOilRelationManager',
                component: () => import('@/views/youke/oil/youkeOilRelation'),
                name: 'youkeOilRelationManager',
                meta: { title: '燃料类型映射', noCache: true }
              },
              {
                path: '/youkeServerRelationManager',
                component: () => import('@/views/youke/serverType/youkeServerRelation'),
                name: 'youkeServerRelationManager',
                meta: { title: '附属服务类型映射', noCache: true }
              },
              {
                path: '/youkeStatusRelationManager',
                component: () => import('@/views/youke/status/youkeStatusRelation'),
                name: 'youkeStatusRelationManager',
                meta: { title: '状态映射', noCache: true }
              },
              {
                path: '/youkeCompanyRelationManager',
                component: () => import('@/views/youke/company/youkeCompanyRelation'),
                name: 'youkeCompanyRelationManager',
                meta: { title: '公司类型映射', noCache: true }
              },
              {
                path: '/youkePaymentRelationManager',
                component: () => import('@/views/youke/payment/youkePaymentRelation'),
                name: 'youkePaymentRelationManager',
                meta: { title: '支付方式映射', noCache: true }
              }
            ]
          }
        ]
      },
      {
        path: '/mapbarDataRelationManager',
        component: Layout1,
        name: '研究院-Aiso',
        meta: { title: '研究院-Aiso', icon: 'list' },
        children: [
          {
            path: '/mapbarGasRelation',
            component: Layout1,
            name: '加油站专题',
            meta: { title: '加油站专题', icon: 'list' },
            children: [
              {
                path: '/mapbarGasBrandRelationManager',
                component: () => import('@/views/mapbar/gasBrand/gasBrandRelation'),
                name: 'MapbarGasBrandRelationManager',
                meta: { title: '品牌映射', noCache: true }
              },
              {
                path: '/mapbarFuelTypeRelationManager',
                component: () => import('@/views/mapbar/gasFuelType/gasFuelTypeRelation'),
                name: 'MapbarFuelTypeRelationManager',
                meta: { title: '燃料类型映射', noCache: true }
              },
              {
                path: '/mapbarOilTypeRelationManager',
                component: () => import('@/views/mapbar/gasOilType/gasOilTypeRelation'),
                name: 'MapbarOilTypeRelationManager',
                meta: { title: '汽油型号映射', noCache: true }
              },
              {
                path: '/mapbarPaymentRelationManager',
                component: () => import('@/views/mapbar/gasPayment/gasPaymentRelation'),
                name: 'MapbarPaymentRelationManager',
                meta: { title: '支付方式映射', noCache: true }
              },
              {
                path: '/mapbarServiceRelationManager',
                component: () => import('@/views/mapbar/gasService/gasServiceRelation'),
                name: 'MapbarServiceRelationManager',
                meta: { title: '附属服务类型映射', noCache: true }
              }
            ]
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
