import { createSlice } from '@reduxjs/toolkit';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import _ from 'lodash';

export const getCurrentEditorState = (state) => _.find(state.notesInfo.notes, (note) => note.id === state.notesInfo.currentNoteId).editorState;

const DEFAULT_NOTE_ID = 1;

const NOTES_INFO_LOCALSTORAGE_NAME = "NotesState";

// const id = _.uniqueId(7);

const DEFAULT_NOTE_TEXT = `Добро пожаловать! \nЭто образец заметки, начните сами и пользуйтесь всеми преимуществами ведения заметок...`;

const editorState = EditorState.createWithContent(ContentState.createFromText(DEFAULT_NOTE_TEXT));
const editorStateStoreObject = convertToRaw(editorState.getCurrentContent());

const defaultState = {
  noteIdCounter: DEFAULT_NOTE_ID,
  notes: [{ id: DEFAULT_NOTE_ID, editorState: editorStateStoreObject }],
  currentNoteId: DEFAULT_NOTE_ID,
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
        const currentEditorState = state.notes.find((note) => note.id === state.currentNoteId);
        if (currentEditorState) {
          currentEditorState.editorState = action.payload;
          return;
        }

        state.notes[0].editorState = action.payload;
      }
    },
    addNote: (state, action) => {
      state.notes.push({ id: action.payload.id, editorState: action.payload.editorState });
      // state.noteIdCounter += 1;
    },
    deleteNote: (state, action) => {
      const currentNoteId = (state.currentNoteId === action.payload)
      ? state.notes[0].id
      : state.currentNoteId;
      _.remove(state.notes, (note) => note.id === action.payload);
      _.set(state, 'currentNoteId', currentNoteId);
    },
    incrementNoteId: (state) => {
      state.noteIdCounter += 1;
    }
  },
});

export const {
  setCurrentEditorState,
  setCurrentNoteId,
  addNote,
  deleteNote,
  incrementNoteId
} = notesInfoSlice.actions;

export default notesInfoSlice.reducer;
