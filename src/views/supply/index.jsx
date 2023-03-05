import { useEffect, useMemo, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useToast } from 'use-toast-mui';


import {
  useDeleteItemMutation,
  useApplySupplySessionMutation,
  useDeleteSupplySessionMutation,
  useGetSupplySessionQuery,
  useProcessItemMutation,
} from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';
import SupplyJoin from 'ui-component/supply/supply-join';
import SupplyCreate from 'views/supply/supply-create';
import SupplySession from 'views/supply/supply-session';

const SupplyView = () => {
  const toast = useToast();

  const { data, error, isFetching, isLoading, refetch } = useGetSupplySessionQuery();
  const [ applySupplySession, applySupplySessionResult ] = useApplySupplySessionMutation();
  const [ deleteSupplySession, deleteSupplySessionResult ] = useDeleteSupplySessionMutation();
  const [ processItem, processItemResult ] = useProcessItemMutation();
  const [ deleteItem, deleteItemResult ] = useDeleteItemMutation();

  const [ content, setContent ] = useState(null);
  const [ session, setSession ] = useState(null);
  const [ updatingList, setUpdatingList ] = useState(new Set());
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
  const [ isDeleteItemsModalOpen, setIsDeleteItemsModalOpen ] = useState(false);
  const [ isApplying, setIsApplying ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ isDeletingItems, setIsDeletingItems ] = useState(false);
  const [ selection, setSelection ] = useState(false);
  const [ joiningItems, setJoiningItems ] = useState(null);

  useEffect(() => {
    if (!isFetching) {
      if (error) {
        if (error.status !== 404) {
          toast.error(error.data?.message || 'Ошибка при получении данных');
        } else {
          setSession(null);
        }
      } else {
        setSession(data);
      }

      if (session) {
        setContent(
          <SupplySession
            session={session}
            isUpdating={updatingList.size > 0}
            joiningItems={joiningItems}
            onSelectChange={onSelectChange}
            onItemUpdated={onItemUpdated}
            onItemDeleted={onItemDeleted}
          />
        );
      } else {
        setContent(<SupplyCreate onCreated={onCreated} />);
        setUpdatingList(new Set());
      }
    }
  }, [isFetching, session, error]);

  useEffect(() => {
    if (!isLoading && session) {
      processItems(session.items.filter((item) => item.parseStatus === 'pending'));
    }
  }, [isLoading, session]);

  const isDeleteItemsButtonVisible = useMemo(() => (selection.length > 0), [selection]);
  const isJoinButtonVisible = useMemo(() => (selection.length === 2), [selection]);
  const canApply = useMemo(() => (session?.items?.filter((item) => item.parseStatus !== 'success') ?? []).length > 0, [session]);

  const onSelectChange = (newSelection) => {
    setSelection(newSelection);
  };

  const onJoinDrawerClose = () => {
    setJoiningItems(null);
  };

  const onJoinButtonClick = () => {
    setJoiningItems(selection);
  };

  const processItems = (items) => items.map((item) => processOneItem(item));

  const processOneItem = (item) => {
    setUpdatingList((previous) => {
      const newSet = new Set(previous);
      newSet.add(item.id);
      return newSet;
    });

    processItem(item.id).unwrap()
      .then((processedItem) => {
        setUpdatingList((previous) => {
          const newSet = new Set(previous);
          newSet.delete(processedItem.id);
          return newSet;
        });
      });
  };

  const onItemUpdated = (item) => {
    if (item.parseStatus === 'pending') {
      processOneItem(item);
    }
  };

  const onItemDeleted = () => refetch();

  const onApplySessionButtonClick = () => {
    setIsApplying(true);
    applySupplySession().unwrap()
      .then(() => toast.success('Сессия применена'))
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при применении сессии');
      })
      .finally(() => setIsApplying(false))
  };

  const onCreated = () => {
    refetch();
  };

  const onDeleteSessionButtonClick = () => {
    setIsDeleteModalOpen(true);
  };

  const onDeleteItemsButtonClick = () => {
    setIsDeleteItemsModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const onDeleteItemsModalClose = () => {
    setIsDeleteItemsModalOpen(false);
  };

  const deleteItems = () => {
    setIsDeletingItems(true);
    deleteItem(selection.map((item) => item.id)).unwrap().then((response) => {
      toast.success('Товары удалены');
      setSelection([]);
      onItemDeleted();
    })
    .catch((err) => {
      console.error(err);
      toast.error('Ошибка при удалении товаров');
    })
    .finally(() => {
      setIsDeletingItems(false);
      setIsDeleteItemsModalOpen(false);
    });
  };

  const deleteSession = () => {
    setIsDeleting(true);
    deleteSupplySession().unwrap()
      .then(() => {
        toast.success('Сессия удалена');
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении сессии');
      })
      .finally(() => {
        setIsDeleting(false);
        onDeleteModalClose();
      });
  };

  return (
    <>
      <MainCard
        title="Загрузки"
        secondary={session ? [
          isDeleteItemsButtonVisible && <Button color="dark" onClick={onDeleteItemsButtonClick} sx={{ marginRight: 2 }} key="deleteItems">Удалить выбранные</Button>,
          isJoinButtonVisible && <Button color="dark" onClick={onJoinButtonClick} sx={{ marginRight: 2 }} key="join">Объединить выбранные</Button>,
          <Button color="error" onClick={onDeleteSessionButtonClick} sx={{ marginRight: 2 }} key="delete">Удалить</Button>,
          <Tooltip key="apply" title={canApply ? '' : 'Для применения сессии необходимо чтобы все товары имели зеленый статус'}>
            <span>
              <LoadingButton
                variant="contained"
                disableElevation
                disabled={canApply}
                loading={isApplying}
                onClick={onApplySessionButtonClick}
              >Применить</LoadingButton>
            </span>
          </Tooltip>,
        ] : null}
      >{content}</MainCard>
      {session && <SupplyJoin items={joiningItems} onClose={onJoinDrawerClose} />}
      <Dialog open={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <DialogTitle fontSize={24}>Удалить сессию?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить сессию? Все загруженные изображения также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteModalClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={deleteSession}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog open={isDeleteItemsModalOpen} onClose={onDeleteItemsModalClose}>
        <DialogTitle fontSize={24}>Удалить товары?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить выбранные товары? Все связанные данные, включая загруженные изображения, также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteItemsModalClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeletingItems} onClick={deleteItems}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupplyView;
