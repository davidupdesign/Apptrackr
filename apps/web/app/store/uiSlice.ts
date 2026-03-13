import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingApplicationId: string | null;
}

const initialState: UIState = {
  isAddModalOpen: false,
  isEditModalOpen: false,
  editingApplicationId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddModal(state) {
      state.isAddModalOpen = true;
    },
    closeAddModal(state) {
      state.isAddModalOpen = false;
    },
    openEditModal(state, action: PayloadAction<string>) {
      state.isEditModalOpen = true;
      state.editingApplicationId = action.payload;
    },
    closeEditModal(state) {
      state.isEditModalOpen = false;
      state.editingApplicationId = null;
    },
  },
});

export const { openAddModal, closeAddModal, openEditModal, closeEditModal } =
  uiSlice.actions;
export default uiSlice.reducer;