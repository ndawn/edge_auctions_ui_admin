import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const AuctionsView = Loadable(lazy(() => import('views/auctions/AuctionsView')));
const AuctionSetView = Loadable(lazy(() => import('views/auctions/AuctionSetView')));
const AuctionView = Loadable(lazy(() => import('views/auctions/AuctionView')));
const ItemsView = Loadable(lazy(() => import('views/items')));
const ItemTypesView = Loadable(lazy(() => import('views/item-types')));
const PriceCategoriesView = Loadable(lazy(() => import('views/price-categories')));
const SupplyView = Loadable(lazy(() => import('views/supply')));
const TemplatesView = Loadable(lazy(() => import('views/templates')));
const UsersView = Loadable(lazy(() => import('views/users')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '',
            element: <ItemsView />
        },
        {
            path: 'items/items',
            element: <ItemsView />
        },
        {
            path: 'items/supply',
            element: <SupplyView />
        },
        {
            path: 'auctions',
            element: <AuctionsView />
        },
        {
            path: 'auctions/:auctionId',
            element: <AuctionView />,
        },
        {
            path: 'auctions/set/:setId',
            element: <AuctionSetView />,
        },
        {
            path: 'components/itemTypes',
            element: <ItemTypesView />
        },
        {
            path: 'components/priceCategories',
            element: <PriceCategoriesView />
        },
        {
            path: 'components/templates',
            element: <TemplatesView />
        },
        {
            path: 'users',
            element: <UsersView />
        },
    ]
};

export default MainRoutes;
