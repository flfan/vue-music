import Vue from 'vue'
import VueRouter from 'vue-router'

const Recommend = () => import('@components/recommend/recommend')
const Singer = () => import('@components/singer/singer')
const Rank = () => import('@components/rank/rank')
const Search = () => import('@components/search/search')
// const Recommend = () => import(/* webpackChunkName: "recommend" */ 'components/recommend/recommend')
// const Singer = () => import(/* webpackChunkName:'singer' */ 'components/singer/singer')
// const Rank = () => import(/* webpackChunkName:'rank' */ 'components/rank/rank')
// const Search = () => import(/* webpackChunkName:'search' */ 'components/search/search')
// const SingerDetail = () => import(/* webpackChunkName:'singer' */ 'components/singer-detail/singer-detail')
// const Disc = () => import(/* webpackChunkName:'disc' */ 'components/disc/disc')
// const TopList = () => import(/* webpackChunkName:'toplist' */ 'components/top-list/top-list')
// const UserCenter = () => import(/* webpackChunkName:'user' */ 'components/user-center/user-center')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/singer',
    component: Singer
  },
  {
    path: '/rank',
    component: Rank
  },
  {
    path: '/search',
    component: Search
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
