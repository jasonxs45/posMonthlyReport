// const Home = r => require.ensure([], () => r(require('pages/Home')), 'Home')
const Overview = r => require.ensure([], () => r(require('pages/Overview')), 'Overview')
const OverviewTotal = r => require.ensure([], () => r(require('pages/overview/Total')), 'OverviewTotal')
const OverviewQuality = r => require.ensure([], () => r(require('pages/overview/Quality')), 'OverviewQuality')
const Monthly = r => require.ensure([], () => r(require('pages/Monthly')), 'Monthly')
const MonthlyTotal = r => require.ensure([], () => r(require('pages/monthly/Total')), 'MonthlyTotal')
const MonthlyQuality = r => require.ensure([], () => r(require('pages/monthly/Quality')), 'MonthlyQuality')
const Type = r => require.ensure([], () => r(require('pages/Type')), 'Type')
const TypeTotal = r => require.ensure([], () => r(require('pages/type/Total')), 'TypeTotal')
const TypeQuality = r => require.ensure([], () => r(require('pages/type/Quality')), 'TypeQuality')
const Floor = r => require.ensure([], () => r(require('pages/Floor')), 'Floor')
const FloorTotal = r => require.ensure([], () => r(require('pages/floor/Total')), 'FloorTotal')
const FloorQuality = r => require.ensure([], () => r(require('pages/floor/Quality')), 'FloorQuality')
const Shop = r => require.ensure([], () => r(require('pages/Shop')), 'Shop')
const ShopMain = r => require.ensure([], () => r(require('pages/shop/Main')), 'ShopMain')
const ShopAll = r => require.ensure([], () => r(require('pages/shop/All')), 'ShopAll')
const ShopNew = r => require.ensure([], () => r(require('pages/shop/New')), 'ShopNew')
const SingleShop = r => require.ensure([], () => r(require('pages/shop/SingleShop')), 'SingleShop')
export default [
  {
    path: '/',
    name: '',
    component: Overview,
    redirect: '/overview/total'
  },
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
    redirect: '/overview/total',
    children: [
      {
        path: 'total',
        name: 'overviewtotal',
        component: OverviewTotal
      },
      {
        path: 'quality',
        name: 'overviewquality',
        component: OverviewQuality
      }
    ]
  },
  {
    path: '/monthly',
    name: 'monthly',
    component: Monthly,
    redirect: '/monthly/total',
    children: [
      {
        path: 'total',
        name: 'monthlytotal',
        component: MonthlyTotal
      },
      {
        path: 'quality',
        name: 'monthlyquality',
        component: MonthlyQuality
      }
    ]
  },
  {
    path: '/type',
    name: 'type',
    component: Type,
    redirect: '/type/total',
    children: [
      {
        path: 'total',
        name: 'typetotal',
        component: TypeTotal
      },
      {
        path: 'quality',
        name: 'typequality',
        component: TypeQuality
      }
    ]
  },
  {
    path: '/floor',
    name: 'floor',
    component: Floor,
    redirect: '/floor/total',
    children: [
      {
        path: 'total',
        name: 'floortotal',
        component: FloorTotal
      },
      {
        path: 'quality',
        name: 'floorquality',
        component: FloorQuality
      }
    ]
  },
  {
    path: '/shop',
    name: 'shop',
    component: Shop,
    redirect: '/shop/all',
    children: [
      {
        path: 'main',
        name: 'main',
        component: ShopMain
      },
      {
        path: 'all',
        name: 'shopall',
        component: ShopAll
      },
      {
        path: 'new',
        name: 'new',
        component: ShopNew
      }
    ]
  },
  {
    path: '/shop/singleshop',
    name: 'singleshop',
    component: SingleShop
  }
]
