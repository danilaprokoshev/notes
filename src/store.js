import { configureStore } from '@reduxjs/toolkit';

import notesInfoReducer from './slices/notesInfo/notesInfoSlice';

export default () => configureStore({
  reducer: {
    notesInfo: notesInfoReducer
  },
});
