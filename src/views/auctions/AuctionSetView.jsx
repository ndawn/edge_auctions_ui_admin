import { useMemo, useState } from 'react';

import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useToast } from 'use-toast-mui';

import {
  useDeleteAuctionSetMutation,
  useGetAuctionSetQuery,
  usePublishAuctionSetMutation,
  useUnpublishAuctionSetMutation,
} from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';
import AuctionSet from 'ui-component/auctions/AuctionSet';
import { useNavigate, useParams } from 'react-router';

const AuctionSetView = () => {
  const toast = useToast();
  const params = useParams();
  const navigate = useNavigate();

  const { data: set, refetch } = useGetAuctionSetQuery(params.setId);
  const [ publishAuctionSet, publishAuctionSetResult ] = usePublishAuctionSetMutation();
  const [ unpublishAuctionSet, unpublishAuctionSetResult ] = useUnpublishAuctionSetMutation();
  const [ deleteAuctionSet, deleteAuctionSetResult ] = useDeleteAuctionSetMutation();

  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ isUpdating, setIsUpdating ] = useState(false);

  const isPublishButtonVisible = useMemo(() => set && !set.isPublished, [set]);
  const isUnpublishButtonVisible = useMemo(() => set && set.isPublished, [set]);

  const promptDeleteSet = () => {
    setIsDeleteDialogOpen(true);
  };

  const onDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const updateAuctionSet = (action) => {
    setIsUpdating(true);

    action(set.id).unwrap()
      .then((result) => {
        toast.success('Статус набора обновлен');
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при обновлении статуса набора');
      })
      .finally(() => setIsUpdating(false));
  };

  const performDeleteAuctionSet = () => {
    setIsDeleting(true);

    deleteAuctionSet(params.setId).unwrap()
      .then((result) => {
        toast.success('Набор удален');
        navigate('/auctions');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении набора');
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <MainCard title="Набор аукционов" secondary={[
      isPublishButtonVisible && (
        <LoadingButton
          key="start"
          variant="contained"
          disableElevation
          loading={isUpdating}
          onClick={() => updateAuctionSet(publishAuctionSet)}
          sx={{ marginLeft: '16px' }}
        >Опубликовать</LoadingButton>
      ),
      isUnpublishButtonVisible && (
        <LoadingButton
          key="end"
          loading={isUpdating}
          onClick={() => updateAuctionSet(unpublishAuctionSet)}
          sx={{ marginLeft: '16px' }}
        >Снять с публикации</LoadingButton>
      ),
      <LoadingButton
        key="delete"
        color="error"
        loading={isDeleting}
        onClick={promptDeleteSet}
        sx={{ marginLeft: '16px' }}
      >Удалить</LoadingButton>
    ]}>
      {set && <AuctionSet set={set} />}
      <Dialog open={isDeleteDialogOpen} onClose={onDeleteDialogClose}>
        <DialogTitle fontSize={24}>Удалить набор?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить набор аукционов? Все связанные с ним данные также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteDialogClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={performDeleteAuctionSet}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default AuctionSetView;
