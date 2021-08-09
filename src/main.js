
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 路由守卫
let registerRouteFresh = true // 定义标识，记录路由是否添加
router.beforeEach(async (to, from, next) => {
  let res = [ // 路由数据，正常情况通过接口获取，这里我使用假数据代替
    {
      "id": 1000,
      "parentId": -1,
      "icon": "user",
      "name": "用户",
      "path": "/user",
      "routerName": 'user',
      "component": "views/user/User.vue",
      "redirect": '/user/set',
      "children": [{
          "id": 1100,
          "parentId": 1000,
          "icon": "use-set",
          "name": "用户管理",
          "routerName": 'userSet',
          "path": "/user/set",
          "component": "views/user/User.vue",
          "redirect": null
      }],
    }, 
    {
      "id": 2000,
      "parentId": -1,
      "icon": "test",
      "name": "测试",
      "path": "/test",
      "routerName": 'test',
      "component": "view/test/index",
      "redirect": '/test/user',
      "children": [{
          "id": 2100,
          "parentId": 2000,
          "icon": "test-user",
          "name": "用户测试",
          "routerName": 'testUser',
          "path": "/test/user",
          "component": "views/user.User.vue",
          "redirect": null
      }]
    },
  ]
  let arr = [] // 整理后台数据，转换为添加路由的格式
  res.filter((value) => {
    let child = []  // 子路由数据格式处理
    if (value.children && value.children.length) {
      value.children.filter((val) => {
        child.push({
          name: val.routeName,
          path: val.path,
          component: () => import(`@/${val.component}`) // 开发中遇到问题，不能使用纯变量，需要字符串拼接才可以，要不然同样的地址报错。
        })
      })
    }
    arr.push({
      name: value.routeName,
      redirect: value.redirect,
      path: value.path,
      component: () => import(`@/${value.component}`),
      children: child
    })
  })
  // 如果首次或者刷新界面，next(...to, replace: true)会循环遍历路由，如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由，
  // 我们的问题在于页面刷新以后异步获取数据，直接执行next()感觉路由添加了但是在next()之后执行的，所以我们没法导航到相应的界面。这里使用变量registerRouteFresh变量做记录，直到找到相应的路由以后，把值设置为false然后走else执行next(),整个流程就走完了，路由也就添加完了。
  if (registerRouteFresh) {
    arr.forEach((val) => {
      router.addRoute(val)
    })
    next({...to, replace: true})
    registerRouteFresh = false
  } else {
    next()
  }
})
createApp(App).use(store).use(router).mount('#app')
