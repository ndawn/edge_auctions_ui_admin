import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

const icons = { LaunchOutlinedIcon };

const other = {
    id: 'other',
    title: 'Ссылки',
    type: 'group',
    children: [
        {
            id: 'auctionsLink',
            title: 'Открыть аукционы',
            type: 'item',
            url: 'https://edgecomics.ru/page/auctions',
            icon: icons.LaunchOutlinedIcon,
            external: true,
            target: true,
        },
        {
            id: 'shopLink',
            title: 'Открыть магазин',
            type: 'item',
            url: 'https://edgecomics.ru',
            icon: icons.LaunchOutlinedIcon,
            external: true,
            target: true,
        },
    ]
};

export default other;
