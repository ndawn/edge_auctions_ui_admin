import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ru');

export default dayjs;
