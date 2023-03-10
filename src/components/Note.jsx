import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/solid';
import { RichUtils, convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DEFAULT_EDITOR_PLACEHOLDER } from '../constants/constants';
import {
  setCurrentEditorState,
  deleteNote
} from '../slices/notesInfo/notesInfoSlice';
import BlockStyleControls from './Editor/BlockStyleControls';
import Editor from './Editor/Editor';
import InlineStyleControls from './Editor/InlineStyleControls';

const Note = () => {
  const dispatch = useDispatch();
  const currentNoteId = useSelector(state => state.notesInfo.currentNoteId);
  const notes = useSelector(state => state.notesInfo.notes);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const noteItem = notes.find(note => note.id === currentNoteId);
    if (noteItem) {
      const contentState = noteItem.editorState;
      setEditorState(() =>
        EditorState.createWithContent(convertFromRaw(contentState))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNoteId]);

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const toggleBlockType = blockType => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = inlineStyle => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const onChangeHandler = state => {
    setEditorState(state);

    const contentState = convertToRaw(state.getCurrentContent());
    dispatch(setCurrentEditorState(contentState));
  };

  const handleDeleteNote = () => {
    dispatch(deleteNote(currentNoteId));
  };

  return (
    <div className="h-full border p-4">
      <div className="flex items-center justify-between">
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <button type="button" disabled={!notes.length}>
          <ArchiveBoxXMarkIcon
            className="h-6 w-6 cursor-pointer text-blue-400"
            onClick={handleDeleteNote}
          />
        </button>
      </div>
      <div className="flex justify-between">
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </div>
      {notes.length > 0 ? (
        <Editor
          editorState={editorState}
          onChange={onChangeHandler}
          handleKeyCommand={handleKeyCommand}
          placeholder={DEFAULT_EDITOR_PLACEHOLDER}
        />
      ) : (
        <p className="mt-3 italic text-blue-400">
          Чтобы добавить заметку, нажите на иконку добавления вверху слева
        </p>
      )}
    </div>
  );
};

export default Note;
