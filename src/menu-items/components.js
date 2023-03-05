import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

const icons = { CategoryOutlinedIcon, AttachMoneyIcon, TextSnippetOutlinedIcon, AccountCircleOutlinedIcon };

const items = {
    id: 'components',
    title: 'Компоненты',
    type: 'group',
    children: [
        {
            id: 'itemTypes',
            title: 'Категории',
            type: 'item',
            url: '/components/itemTypes',
            icon: icons.CategoryOutlinedIcon,
            breadcrumbs: false
        },
        {
            id: 'priceCategories',
            title: 'Ценовые категории',
            type: 'item',
            url: '/components/priceCategories',
            icon: icons.AttachMoneyIcon,
            breadcrumbs: false
        },
        {
            id: 'templates',
            title: 'Шаблоны',
            type: 'item',
            url: '/components/templates',
            icon: icons.TextSnippetOutlinedIcon,
            breadcrumbs: false
        },
        {
            id: 'users',
            title: 'Пользователи',
            type: 'item',
            url: '/users',
            icon: icons.AccountCircleOutlinedIcon,
            breadcrumbs: false
        },
    ]
};

export default items;
