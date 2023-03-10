import { DocumentPlusIcon } from '@heroicons/react/24/solid';
import cn from 'classnames';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { useDispatch, useSelector } from 'react-redux';

import {
  setCurrentNoteId,
  addNote,
  incrementNoteId
} from '../slices/notesInfo/notesInfoSlice';
import DropdownButton from './DropdownButton';

const NoteList = () => {
  const dispatch = useDispatch();
  const currentNoteId = useSelector(state => state.notesInfo.currentNoteId);
  const noteIdCounter = useSelector(state => state.notesInfo.noteIdCounter);
  const notes = useSelector(state => state.notesInfo.notes);

  const handleAddNote = () => {
    const addingNoteId = noteIdCounter + 1;
    dispatch(incrementNoteId());
    const editorState = EditorState.createEmpty();
    const contentState = convertToRaw(editorState.getCurrentContent());
    dispatch(addNote({ id: addingNoteId, editorState: contentState }));
    dispatch(setCurrentNoteId(addingNoteId));
  };

  const renderNoteTitle = note => {
    const noteNamesClasses = cn(
      'flex justify-between my-2 rounded',
      note.id === currentNoteId ? 'bg-slate-100' : 'bg-white'
    );
    const noteButtonClasses = cn('h-full w-[190px] truncate text-left px-2', {
      'font-bold text-slate-700': note.id === currentNoteId
    });
    const noteEditorState = convertFromRaw(note.editorState);
    const noteText = noteEditorState.getPlainText();

    const handleClick = id => () => {
      dispatch(setCurrentNoteId(id));
    };

    return (
      <li key={note.id} className={noteNamesClasses}>
        <button
          type="button"
          className={noteButtonClasses}
          onClick={handleClick(note.id)}
        >
          {noteText || 'Новая заметка'}
        </button>
        <DropdownButton noteId={note.id} />
      </li>
    );
  };

  return (
    <>
      <div className="mb-3 mt-5 flex justify-between p-4">
        <span>Список заметок</span>
        <button type="button" onClick={handleAddNote}>
          <DocumentPlusIcon className="h-6 w-6 text-blue-400" />
        </button>
      </div>
      <ul className="flex flex-col px-4">
        {notes.length > 0 ? (
          notes.map(renderNoteTitle)
        ) : (
          <li className="my-4 text-center text-slate-400">Пусто</li>
        )}
      </ul>
    </>
  );
};

export default NoteList;
