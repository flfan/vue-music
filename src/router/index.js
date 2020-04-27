import Vue from 'vue'
import VueRouter from 'vue-router'

const Recommend = () => import('@components/recommend/recommend')
const Singer = () => import('@components/singer/singer')
const Rank = () => import('@components/rank/rank')
const Search = () => import('@components/search/search')
const SingerDetail = () => import('@components/singer-detail/singer-detail')
const Disc = () => import('@components/disc/disc')
const RankList = () => import('@components/rank-list/rank-list')
const UserCenter = () => import('@components/user-center/user-center')
// const Recommend = () => import(/* webpackChunkName: "recommend" */ 'components/recommend/recommend')
// const Singer = () => import(/* webpackChunkName:'singer' */ 'components/singer/singer')
// const Rank = () => import(/* webpackChunkName:'rank' */ 'components/rank/rank')
// const Search = () => import(/* webpackChunkName:'search' */ 'components/search/search')
// const SingerDetail = () => import(/* webpackChunkName:'singer' */ 'components/singer-detail/singer-detail')
// const Disc = () => import(/* webpackChunkName:'disc' */ 'components/disc/disc')
// const TopList = () => import(/* webpackChunkName:'toplist' */ 'components/top-list/top-list')
// const UserCenter = () => import(/* webpackChunkName:'user' */ '@components/user-center/user-center')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/user',
    component: UserCenter
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Disc
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: RankList
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '*',
    redirect: '/recommend'
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
