import dayjs from 'utils/dayjs';

export const getSetName = (set) => {
  const date = new Date(Date.parse(set.dateDue));
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  return `Аукционы до ${date.getUTCDate()}.${month}`;
};

export const getDateDue = (dateDue) => {
  const date = new Date(dateDue).toLocaleDateString('ru', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = new Date(dateDue).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  return `${date} в ${time}`;
};

export const getMaxBid = (auction) => (
  Math.max(0, Math.max(...auction.bids.map((bid) => bid.value === -1 ? auction.buyNowPrice : bid.value)))
);

export const getTotalIncome = (set) => (
  set.auctions.map((auction) => getMaxBid(auction))
    .reduce((sum, value) => sum + value, 0)
);

export const getOffsetString = () => {
  const offsetHours = dayjs().utcOffset() / 60;
  const offsetSign = offsetHours < 0 ? '' : '+';
  const offsetAlias = dayjs.tz.guess();
  const offsetAliasSuffix = offsetAlias ? ` — ${offsetAlias}` : '';
  return `UTC${offsetSign}${offsetHours}${offsetAliasSuffix}`;
};
