import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/solid';
import cn from "classnames";
import { Editor, RichUtils, convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setCurrentEditorState, deleteNote } from '../slices/notesInfo/notesInfoSlice';

const getBlockStyle = (block) => {
	switch (block.getType()) {
		case 'blockquote': return 'border-l-4 text-slate-700 italic my-4 py-2 px-5';
		case 'code-block': return 'bg-slate-100 text-base';
		case 'header-one': return 'text-5xl font-extrabold';
		case 'header-two': return 'text-4xl font-bold';
		case 'header-three': return 'text-3xl font-bold';
		case 'header-four': return 'text-2xl font-bold';
		case 'header-five': return 'text-xl font-bold';
		case 'header-six': return 'text-lg font-bold';
		default: return null;
	}
};

const BLOCK_TYPES = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: 'H4', style: 'header-four' },
	{ label: 'H5', style: 'header-five' },
	{ label: 'H6', style: 'header-six' },
	{ label: 'Blockquote', style: 'blockquote' },
	{ label: 'UL', style: 'unordered-list-item' },
	{ label: 'OL', style: 'ordered-list-item' },
	{ label: 'Code Block', style: 'code-block' }
];

const StyleButton = ({ style, onToggle, active, label }) => {
	const onMouseDown = (e) => {
		e.preventDefault();
		onToggle(style);
	};

  const className = cn('cursor-pointer mr-4 py-1 inline-block', active ? 'text-blue-400' : 'text-slate-400');

	return (
		<span role="button" tabIndex={0} className={className} onMouseDown={onMouseDown}>
			{label}
		</span>
	);
};

const BlockStyleControls = ({editorState, onToggle}) => {
	const selection = editorState.getSelection();
	const blockType = editorState
	.getCurrentContent()
	.getBlockForKey(selection.getStartKey())
	.getType();

	return (
		<div>
			{BLOCK_TYPES.map((type) =>
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={onToggle}
					style={type.style}
				/>
			)}
		</div>
	);
};

const INLINE_STYLES = [
	{label: 'Bold', style: 'BOLD'},
	{label: 'Italic', style: 'ITALIC'},
	{label: 'Underline', style: 'UNDERLINE'},
	{label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = ({ editorState, onToggle }) => {
	const currentStyle = editorState.getCurrentInlineStyle();
	return (
		<div>
			{INLINE_STYLES.map(type =>
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={onToggle}
					style={type.style}
				/>
			)}
		</div>
	);
};

const Note = () => {
  const editorRef = useRef(null);

  const dispatch = useDispatch();
  const currentNoteId = useSelector((state) => state.notesInfo.currentNoteId);
  const notes = useSelector((state) => state.notesInfo.notes);

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    const noteItem = notes.find((note) => note.id === currentNoteId);
    if (noteItem) {
      const contentState = noteItem.editorState;
      setEditorState(() => EditorState.createWithContent(convertFromRaw(contentState)));
    }
  }, [currentNoteId]);

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const toggleBlockType =
    (blockType) => {
      setEditorState(
        RichUtils.toggleBlockType(
          editorState,
          blockType
     ));
  };

  const toggleInlineStyle = (inlineStyle) => {
		setEditorState(
			RichUtils.toggleInlineStyle(
				editorState,
				inlineStyle
			)
		);
	};

  const onChangeHandler = (state) => {
    setEditorState(state);

    const contentState = convertToRaw(state.getCurrentContent());
    dispatch(setCurrentEditorState(contentState));
  };

  const handleDeleteNote = () => {
    dispatch(deleteNote(currentNoteId));
  };

  return (
    <div className="h-full border p-4">
      <div className="flex justify-between items-center">
        <BlockStyleControls
				editorState={editorState}
				onToggle={toggleBlockType}
			  />
        <button type="button" disabled={!notes.length}>
          <ArchiveBoxXMarkIcon className="w-6 h-6 text-blue-400 cursor-pointer" onClick={handleDeleteNote} />
        </button>
      </div>
      <div className="flex justify-between">
        <InlineStyleControls
				  editorState={editorState}
				  onToggle={toggleInlineStyle}
			  />
      </div>

      {notes.length > 0 ? (
        <div className="h-full border-t pt-3 cursor-text">
          <Editor ref={editorRef} editorState={editorState} onChange={onChangeHandler} handleKeyCommand={handleKeyCommand} blockStyleFn={getBlockStyle} placeholder="Введите текст..." />
        </div>
        ) : (<p className="mt-3 italic text-blue-400">Чтобы добавить заметку, нажите на иконку добавления вверху слева</p>)}
    </div>);
};

export default Note;


