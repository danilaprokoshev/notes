import cn from 'classnames';

const StyleButton = ({ style, onToggle, active, label }) => {
  const onMouseDown = e => {
    e.preventDefault();
    onToggle(style);
  };

  const styleButtonClasses = cn(
    'cursor-pointer mr-4 py-1 inline-block',
    active ? 'text-blue-400' : 'text-slate-400'
  );

  return (
    <span
      role="button"
      tabIndex={0}
      className={styleButtonClasses}
      onMouseDown={onMouseDown}
    >
      {label}
    </span>
  );
};

export default StyleButton;
