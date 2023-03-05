import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LoadingButton } from '@mui/lab';
import { useToast } from 'use-toast-mui';

import { useCloseAuctionMutation, useDeleteAuctionMutation, useGetAuctionQuery } from 'store/slices/api';
import Auction from 'ui-component/auctions/Auction';
import MainCard from 'ui-component/cards/MainCard';

const AuctionView = () => {
  const toast = useToast();
  const params = useParams();
  const navigate = useNavigate();

  const { data: auction } = useGetAuctionQuery(params.auctionId);
  const [ closeAuction, closeAuctionResult ] = useCloseAuctionMutation();
  const [ deleteAuction, deleteAuctionResult ] = useDeleteAuctionMutation();

  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState(false);
  const [ isUpdating, setIsUpdating ] = useState(false);

  const performCloseAuction = () => {
    setIsUpdating(true);

    closeAuction(params.auctionId).unwrap()
      .then((result) => {
        toast.success('Аукцион закрыт');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при закрытии набора');
      })
      .finally(() => setIsUpdating(false));
  };

  const promptDeleteAuction = () => {
    setIsDeleteDialogOpen(true);
  };

  const onDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const performDeleteAuction = () => {
    setIsUpdating(true);

    deleteAuction(params.auctionId).unwrap()
      .then((result) => {
        toast.success('Аукцион удален');
        navigate('/auctions/archive');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении аукциона');
      })
      .finally(() => {
        setIsUpdating(false);
        setIsDeleteDialogOpen(false);
      });
  };

  if (!auction) {
    return <Typography></Typography>;
  }

  return (
    <MainCard
      title="Аукцион"
      secondary={[
        auction && auction.startedAt !== null && auction.endedAt === null && (
          <Button key="close" onClick={performCloseAuction}></Button>
        ),
        auction && <Button key="delete" onClick={promptDeleteAuction}></Button>,
      ]}
    >
      <Auction auction={auction} />
      <Dialog open={isDeleteDialogOpen} onClose={onDeleteDialogClose}>
        <DialogTitle fontSize={24}>Удалить аукцион?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить аукцион? Все связанные с ним данные также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteDialogClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isUpdating} onClick={performDeleteAuction}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default AuctionView;
