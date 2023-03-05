import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const items = {
    id: 'auctions',
    title: 'Аукционы',
    type: 'group',
    children: [
        {
            id: 'auctions',
            title: 'Аукционы',
            type: 'item',
            url: '/auctions',
            icon: Inventory2OutlinedIcon,
            breadcrumbs: false
        },
    ]
};

export default items;
