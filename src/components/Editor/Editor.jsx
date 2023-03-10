import { Editor as EditorComponent } from 'draft-js';

const Editor = ({ editorState, onChange, handleKeyCommand }) => {
  const getBlockStyle = block => {
    switch (block.getType()) {
      case 'blockquote':
        return 'border-l-4 text-slate-700 italic my-4 py-2 px-5';
      case 'code-block':
        return 'bg-slate-100 text-base';
      case 'header-one':
        return 'text-5xl font-extrabold';
      case 'header-two':
        return 'text-4xl font-bold';
      case 'header-three':
        return 'text-3xl font-bold';
      case 'header-four':
        return 'text-2xl font-bold';
      case 'header-five':
        return 'text-xl font-bold';
      case 'header-six':
        return 'text-lg font-bold';
      default:
        return null;
    }
  };

  return (
    <div className="h-full cursor-text border-t pt-3">
      <EditorComponent
        editorState={editorState}
        onChange={onChange}
        handleKeyCommand={handleKeyCommand}
        blockStyleFn={getBlockStyle}
        placeholder="Введите текст..."
      />
    </div>
  );
};

export default Editor;
