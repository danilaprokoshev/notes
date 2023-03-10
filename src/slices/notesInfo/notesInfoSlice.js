import { createSlice } from '@reduxjs/toolkit';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import _ from 'lodash';

import {
  DEFAULT_NOTE_ID,
  NOTES_INFO_LOCALSTORAGE_NAME,
  DEFAULT_NOTE_TEXT
} from '../../constants/constants';

export const getCurrentEditorState = state =>
  _.find(
    state.notesInfo.notes,
    note => note.id === state.notesInfo.currentNoteId
  ).editorState;

const editorState = EditorState.createWithContent(
  ContentState.createFromText(DEFAULT_NOTE_TEXT)
);
const editorStateStoreObject = convertToRaw(editorState.getCurrentContent());

const defaultState = {
  noteIdCounter: DEFAULT_NOTE_ID,
  notes: [{ id: DEFAULT_NOTE_ID, editorState: editorStateStoreObject }],
  currentNoteId: DEFAULT_NOTE_ID
};

const getDefaultState = () => {
  if (localStorage.getItem(NOTES_INFO_LOCALSTORAGE_NAME) !== null) {
    return JSON.parse(localStorage.getItem(NOTES_INFO_LOCALSTORAGE_NAME));
  }

  return defaultState;
};

export const notesInfoSlice = createSlice({
  name: 'notesInfo',
  initialState: getDefaultState(),
  reducers: {
    setCurrentNoteId: (state, action) => {
      _.set(state, 'currentNoteId', action.payload);
    },
    setCurrentEditorState: (state, action) => {
      if (state.notes.length > 0) {
        const currentEditorState = state.notes.find(
          note => note.id === state.currentNoteId
        );
        if (currentEditorState) {
          currentEditorState.editorState = action.payload;
          return;
        }

        state.notes[0].editorState = action.payload;
      }
    },
    addNote: (state, action) => {
      state.notes.push({
        id: action.payload.id,
        editorState: action.payload.editorState
      });
    },
    deleteNote: (state, action) => {
      const currentNoteId =
        state.currentNoteId === action.payload
          ? state.notes[0].id
          : state.currentNoteId;
      _.remove(state.notes, note => note.id === action.payload);
      _.set(state, 'currentNoteId', currentNoteId);
    },
    incrementNoteId: state => {
      state.noteIdCounter += 1;
    }
  }
});

export const {
  setCurrentEditorState,
  setCurrentNoteId,
  addNote,
  deleteNote,
  incrementNoteId
} = notesInfoSlice.actions;

export default notesInfoSlice.reducer;
