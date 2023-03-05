import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'config';

const transformErrorResponse = (response, meta, arg) => {
  if (response?.status === 401) {
    window.location.reload();
    return;
  }

  return response;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = getState().token.accessToken;

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return headers;
    }
  }),
  tagTypes: ['ItemTypes', 'PriceCategories', 'Templates', 'Users', 'Session'],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/me',
      transformErrorResponse,
    }),
    listUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
      transformErrorResponse,
    }),
    updateUser: builder.mutation({
      query: ({ id: userId, ...data }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users'],
      transformErrorResponse,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
      transformErrorResponse,
    }),
    listItemTypes: builder.query({
      query: () => '/item_types',
      providesTags: ['ItemTypes'],
      transformErrorResponse,
    }),
    createItemType: builder.mutation({
      query: (data) => ({
        url: '/item_types',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ItemTypes'],
      transformErrorResponse,
    }),
    updateItemType: builder.mutation({
      query: ({ id: itemTypeId, ...data }) => ({
        url: `/item_types/${itemTypeId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ItemTypes'],
      transformErrorResponse,
    }),
    deleteItemType: builder.mutation({
      query: (itemTypeId) => ({
        url: `/item_types/${itemTypeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ItemTypes'],
      transformErrorResponse,
    }),
    listPriceCategories: builder.query({
      query: () => '/price_categories',
      providesTags: ['PriceCategories'],
      transformErrorResponse,
    }),
    createPriceCategory: builder.mutation({
      query: (data) => ({
        url: '/price_categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PriceCategories'],
      transformErrorResponse,
    }),
    updatePriceCategory: builder.mutation({
      query: ({ id: priceCategoryId, ...data }) => ({
        url: `/price_categories/${priceCategoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PriceCategories'],
      transformErrorResponse,
    }),
    deletePriceCategory: builder.mutation({
      query: (priceCategoryId) => ({
        url: `/price_categories/${priceCategoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PriceCategories'],
      transformErrorResponse,
    }),
    listTemplates: builder.query({
      query: () => '/templates',
      providesTags: ['Templates'],
      transformErrorResponse,
    }),
    createTemplate: builder.mutation({
      query: (data) => ({
        url: '/templates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Templates'],
      transformErrorResponse,
    }),
    updateTemplate: builder.mutation({
      query: ({ id: templateId, ...data }) => ({
        url: `/templates/${templateId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Templates'],
      transformErrorResponse,
    }),
    deleteTemplate: builder.mutation({
      query: (templateId) => ({
        url: `/templates/${templateId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
      transformErrorResponse,
    }),
    listItems: builder.query({
      query: ({ itemTypeId, priceCategoryId }) => {
        const queryParams = new URLSearchParams();

        if (itemTypeId && itemTypeId !== 0) {
          queryParams.append('itemTypeId', itemTypeId);
        }

        if (priceCategoryId && priceCategoryId !== 0) {
          queryParams.append('priceCategoryId', priceCategoryId);
        }

        return `/items?${queryParams.toString()}`;
      },
      transformErrorResponse,
    }),
    getItem: builder.query({
      query: (itemId) => `/items/${itemId}`,
      transformErrorResponse,
    }),
    getItemCounters: builder.query({
      query: () => '/items/counters',
      transformErrorResponse,
    }),
    getRandomItem: builder.mutation({
      query: ({ itemTypeId, priceCategoryId, excludeIds }) => ({
        url: '/items/random_auction',
        method: 'POST',
        body: { itemTypeId, priceCategoryId, excludeIds },
      }),
      transformErrorResponse,
    }),
    getRandomItemSet: builder.mutation({
      query: (amounts) => ({
        url: '/items/random_set',
        method: 'POST',
        body: { amounts },
      }),
      transformErrorResponse,
    }),
    updateItem: builder.mutation({
      query: ({ id: itemId, ...data }) => ({
        url: `/items/${itemId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Session'],
      transformErrorResponse,
    }),
    processItem: builder.mutation({
      query: (itemId) => ({
        url: `/supply/current/${itemId}/process`,
        method: 'POST',
      }),
      invalidatesTags: ['Session'],
      transformErrorResponse,
    }),
    joinItems: builder.mutation({
      query: (data) => ({
        url: '/supply/current/join',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Session'],
      transformErrorResponse,
    }),
    deleteItem: builder.mutation({
      query: (itemIds) => ({
        url: '/items',
        method: 'DELETE',
        body: { itemIds },
      }),
      transformErrorResponse,
    }),
    bulkCreateImages: builder.mutation({
      query (fileList) {
        const formData = new FormData();

        for (let i = 0; i < fileList.length; i++) {
          formData.append('images', fileList[i]);
        }

        return {
          url: '/images/bulk_create',
          method: 'POST',
          body: formData,
        };
      },
      transformErrorResponse,
    }),
    getSupplySession: builder.query({
      query: () => '/supply/current',
      providesTags: ['Session'],
      transformErrorResponse,
    }),
    createSupplySession: builder.mutation({
      query: ({ itemTypeId, imageIds }) => ({
        url: '/supply/start',
        method: 'POST',
        body: { itemTypeId, imageIds },
      }),
      invalidatesTags: ['Session'],
      transformErrorResponse,
    }),
    applySupplySession: builder.mutation({
      query: () => ({
        url: '/supply/current/apply',
        method: 'POST',
      }),
      invalidatesTags: ['Session'],
      transformErrorResponse,
    }),
    deleteSupplySession: builder.mutation({
      query: () => ({
        url: '/supply/current/discard',
        method: 'POST',
      }),
      invalidatesTags: ['Session'],
      transformErrorResponse,
    }),
    listAuctionSets: builder.query({
      query: () => '/auction_sets',
      transformErrorResponse,
    }),
    getAuctionSet: builder.query({
      query: (setId) => `/auction_sets/${setId}`,
      transformErrorResponse,
    }),
    createAuctionSet: builder.mutation({
      query: ({ dateDue, antiSniper, itemIds }) => ({
        url: '/auction_sets',
        method: 'POST',
        body: { dateDue, antiSniper, itemIds },
      }),
      transformErrorResponse,
    }),
    publishAuctionSet: builder.mutation({
      query: (setId) => ({
        url: `/auction_sets/${setId}/publish`,
        method: 'POST',
      }),
      transformErrorResponse,
    }),
    unpublishAuctionSet: builder.mutation({
      query: (setId) => ({
        url: `/auction_sets/${setId}/unpublish`,
        method: 'POST',
      }),
      transformErrorResponse,
    }),
    deleteAuctionSet: builder.mutation({
      query: (setId) => ({
        url: `/auction_sets/${setId}`,
        method: 'DELETE',
      }),
      transformErrorResponse,
    }),
    getAuction: builder.query({
      query: (auctionId) => `/auctions/${auctionId}`,
      transformErrorResponse,
    }),
    closeAuction: builder.mutation({
      query: (auctionId) => ({
        url: `/auctions/${auctionId}/close`,
        method: 'POST',
      }),
      transformErrorResponse,
    }),
    deleteAuction: builder.mutation({
      query: (auctionId) => ({
        url: `/auctions/${auctionId}`,
        method: 'DELETE',
      }),
      transformErrorResponse,
    }),
  })
});

export const {
  useGetMeQuery,
  useListUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  useListItemsQuery,
  useGetItemCountersQuery,
  useGetRandomItemMutation,
  useGetRandomItemSetMutation,
  useDeleteItemMutation,
  useProcessItemMutation,
  useJoinItemsMutation,
  useUpdateItemMutation,

  useListItemTypesQuery,
  useCreateItemTypeMutation,
  useUpdateItemTypeMutation,
  useDeleteItemTypeMutation,

  useListPriceCategoriesQuery,
  useCreatePriceCategoryMutation,
  useUpdatePriceCategoryMutation,
  useDeletePriceCategoryMutation,

  useListTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,

  useBulkCreateImagesMutation,

  useApplySupplySessionMutation,
  useCreateSupplySessionMutation,
  useDeleteSupplySessionMutation,
  useGetSupplySessionQuery,

  useListAuctionSetsQuery,
  useGetAuctionSetQuery,
  useCreateAuctionSetMutation,
  usePublishAuctionSetMutation,
  useUnpublishAuctionSetMutation,
  useDeleteAuctionSetMutation,

  useGetAuctionQuery,
  useCloseAuctionMutation,
  useDeleteAuctionMutation,
} = apiSlice;
