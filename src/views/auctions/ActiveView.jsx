import { useMemo, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { useToast } from 'use-toast-mui';

import { useGetActiveSetQuery, usePublishAuctionSetMutation, useUnpublishAuctionSetMutation } from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';
import AuctionSet from 'ui-component/auctions/AuctionSet';
import AuctionSetCreate from './AuctionSetCreate';

const ActiveView = () => {
  const toast = useToast();

  const { data: active, isFetching, refetch } = useGetActiveSetQuery();
  const [ publishAuctionSet, publishAuctionSetResult ] = usePublishAuctionSetMutation();
  const [ unpublishAuctionSet, unpublishAuctionSetResult ] = useUnpublishAuctionSetMutation();

  const [ isSetUpdating, setIsSetUpdating ] = useState(false);

  const isPublishButtonVisible = useMemo(() => active && !active.isPublished, [active]);
  const isUnpublishButtonVisible = useMemo(() => active && active.isPublished, [active]);

  const updateAuctionSet = (action) => {
    setIsSetUpdating(true);

    action(active.id).unwrap()
      .then((result) => {
        toast.success('Статус набора обновлен');
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при обновлении статуса набора');
      })
      .finally(() => setIsSetUpdating(false));
  };

  return (
    <MainCard title="Активный набор" secondary={[
      isPublishButtonVisible && (
        <LoadingButton
          key="start"
          variant="contained"
          disableElevation
          loading={isSetUpdating}
          onClick={() => updateAuctionSet(publishAuctionSet)}
        >Опубликовать</LoadingButton>
      ),
      isUnpublishButtonVisible && (
        <LoadingButton
          key="end"
          loading={isSetUpdating}
          onClick={() => updateAuctionSet(unpublishAuctionSet)}
        >Снять с публикации</LoadingButton>
      ),
    ]}>
      {active
        ? <AuctionSet set={active} />
        : <AuctionSetCreate onCreated={() => refetch()} />
      }
    </MainCard>
  );
};

export default ActiveView;
