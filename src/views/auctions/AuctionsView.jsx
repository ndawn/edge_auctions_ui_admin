import { useMemo, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { useToast } from 'use-toast-mui';

import {
  useCreateAuctionSetMutation,
  useDeleteAuctionSetMutation,
  useGetRandomItemMutation,
  useGetRandomItemSetMutation,
  useListAuctionSetsQuery,
  usePublishAuctionSetMutation,
  useUnpublishAuctionSetMutation,
} from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';
import AuctionSetsTable from 'ui-component/auctions/auction-sets-table';
import AuctionSetCreateForm from 'ui-component/auctions/auction-set-create-form';
import AuctionSetPreview from 'ui-component/auctions/auction-set-preview';
import FullPageMessage from 'ui-component/full-page-message';
import SidebarForm from 'ui-component/sidebar-form';

const AuctionsView = () => {
  const toast = useToast();

  const { data: auctionSets, isFetching, refetch } = useListAuctionSetsQuery();
  const [ publishAuctionSet, publishAuctionSetResult ] = usePublishAuctionSetMutation();
  const [ unpublishAuctionSet, unpublishAuctionSetResult ] = useUnpublishAuctionSetMutation();
  const [ deleteAuctionSet, deleteAuctionSetResult ] = useDeleteAuctionSetMutation();
  const [ createAuctionSet, createAuctionSetResult ] = useCreateAuctionSetMutation();
  const [ getRandomItemSet, getRandomItemSetResult ] = useGetRandomItemSetMutation();
  const [ getRandomItem, getRandomItemResult ] = useGetRandomItemMutation();

  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState(false);
  const [ setToDelete, setSetToDelete ] = useState(null);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ formDrawerOpen, setFormDrawerOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ formData, setFormData ] = useState({});
  const [ items, setItems ] = useState([]);

  const isPreviewDrawerOpen = useMemo(() => items.length > 0, [items]);

  const isPreviewButtonDisabled = useMemo(() => (
    formData?.dateDue === null
    || formData?.antiSniper === ''
    || formData?.counters === null
  ), [formData]);

  const isSubmitButtonDisabled = useMemo(() => (
    isPreviewButtonDisabled
    && items.length > 0
  ), [isPreviewButtonDisabled, items]);

  const promptDeleteSet = (set) => {
    setSetToDelete(set);
    setIsDeleteDialogOpen(true);
  };

  const onDeleteDialogClose = () => {
    setSetToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const performDeleteAuctionSet = () => {
    setIsDeleting(true);

    deleteAuctionSet(setToDelete.id).unwrap()
      .then((result) => {
        toast.success('Набор удален');
        refetch();
      })
      .catch((err) => {
        toast.error('Ошибка при удалении набора');
      })
      .finally(() => {
        setIsDeleting(false);
        onDeleteDialogClose();
      })
  };

  const handlePublishToggle = async (set) => {
    if (set.isPublished) {
      await unpublishAuctionSet(set.id);
    } else {
      await publishAuctionSet(set.id);
    }

    refetch();
  };

  const openFormDrawer = () => {
    setFormDrawerOpen(true);
  };

  const closeFormDrawer = () => {
    setFormDrawerOpen(false);
  };

  const closePreviewDrawer = () => {
    setItems([]);
  };

  const onFormChange = (data) => {
    setFormData(data);
  };

  const getExcludeIds = (targetItem) => (
    items.filter((item) => (
      item.priceCategory.id === targetItem.priceCategory.id
      && item.type.id === targetItem.type.id
    )).map((item) => item.id)
  );

  const rerollItem = (item, index) => {
    getRandomItem({
      itemTypeId: item.type.id,
      priceCategoryId: item.priceCategory.id,
      excludeIds: getExcludeIds(item),
    }).unwrap()
      .then((result) => updateItemInList(result, index))
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при перевыборе товара');
      });
  };

  const updateItemInList = (item, index) => {
    if (item === null) {
      toast.error('Невозможно перевыбрать единственный товар в своей категории');
      return;
    }

    setItems((previousValue) => {
      const copy = previousValue.slice();
      copy[index] = item;
      return copy;
    });
  };

  const performPreviewAuctionSet = () => {
    setIsLoading(true);

    getRandomItemSet(formData.counters).unwrap()
      .then((result) => {
        setItems(result);
      }).catch((err) => {
        console.error(err);
        toast.error('Ошибка при загрузке предпросмотра набора');
      })
      .finally(() => setIsLoading(false));
  };

  const performCreateAuctionSet = () => {
    setIsLoading(true);

    createAuctionSet({
      dateDue: formData.dateDue,
      antiSniper: formData.antiSniper,
      itemIds: items.map((item) => item.id),
    }).unwrap()
      .then((result) => {
        console.log(result);
        toast.success('Набор создан');
        refetch();
        closeFormDrawer();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при создании набора');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <MainCard title="Аукционы" contentSX={{ height: 'calc(100vh - 210px)' }} secondary={
      <Button
        startIcon={<AddIcon />}
        onClick={openFormDrawer}
        sx={{ marginLeft: '16px' }}
      >Создать</Button>
    }>
      {!isFetching
        ? (auctionSets && auctionSets.length > 0
          ? <AuctionSetsTable auctionSets={auctionSets} onPublishToggle={(set) => handlePublishToggle(set)} onDelete={(set) => promptDeleteSet(set)} />
          : (
            <FullPageMessage
              title="Нет наборов"
              description="Наборы аукционов отсутствуют, но вы можете создать новый, нажав на кнопку ниже"
              button={
                <Button variant="contained" disableElevation onClick={openFormDrawer}>
                  <AddIcon />
                  Создать новый набор
                </Button>
              }
            />
          )
        )
        : (
          <Grid container spacing={1}>
            {[...Array(16).keys()].map((index1) =>
              [1, 1, 6, 2, 2].map((size, index2) =>
                <Grid key={`${index1}${index2}`} xs={size}>
                  <Skeleton variant="rounded" height={42} />
                </Grid>
              )
            )}
          </Grid>
        )
      }
      <SidebarForm
        title="Создание нового набора аукционов"
        open={formDrawerOpen}
        isLoading={isLoading}
        onClose={closeFormDrawer}
        bottom={
          <Tooltip title={isPreviewButtonDisabled ? 'Для создания набора необходимо заполнить форму' : ''}>
            <span>
              <Button variant="contained" disableElevation disabled={isPreviewButtonDisabled} onClick={performPreviewAuctionSet}>Предпросмотр</Button>
            </span>
          </Tooltip>
        }
      >
        <AuctionSetCreateForm onChange={onFormChange} />
      </SidebarForm>
      <SidebarForm
        title="Создание нового набора аукционов"
        open={isPreviewDrawerOpen}
        isLoading={isLoading}
        onClose={closePreviewDrawer}
        bottom={
          <Tooltip title={isSubmitButtonDisabled ? 'Для создания набора необходимо заполнить форму' : ''}>
            <span>
              <Button variant="contained" disableElevation disabled={isSubmitButtonDisabled} onClick={performCreateAuctionSet}>Создать</Button>
            </span>
          </Tooltip>
        }
      >
        <AuctionSetPreview
          dateDue={formData.dateDue}
          antiSniper={formData.antiSniper}
          items={items}
          onReroll={(item, index) => rerollItem(item, index)}
        />
      </SidebarForm>
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

export default AuctionsView;
