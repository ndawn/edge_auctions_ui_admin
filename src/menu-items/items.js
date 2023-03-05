import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';

const icons = { ShoppingBagOutlinedIcon, DriveFolderUploadOutlinedIcon };

const items = {
    id: 'items',
    title: 'Товары',
    type: 'group',
    children: [
        {
            id: 'items',
            title: 'Товары',
            type: 'item',
            url: '/items/items',
            icon: icons.ShoppingBagOutlinedIcon,
            external: false,
            breadcrumbs: false
        },
        {
            id: 'supply',
            title: 'Загрузки',
            type: 'item',
            url: '/items/supply',
            icon: icons.DriveFolderUploadOutlinedIcon,
            external: false,
            breadcrumbs: false
        },
    ]
};

export default items;
