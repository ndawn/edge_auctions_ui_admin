import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    isOpen: [],
    opened: true,
    borderRadius: 12,
};

const customizationSlice = createSlice({
    initialState,
    name: 'customization',
    reducers: {
        openMenu (state, { payload }) {
            state.isOpen = [payload];
        },
        setMenu (state, { payload }) {
            state.opened = payload;
        },
    },
});

export const { openMenu, setMenu } = customizationSlice.actions;

export default customizationSlice.reducer;
