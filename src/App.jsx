import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Note from './components/Note';
import NoteList from './components/NoteList';

const App = () => {
  const notesInfo = useSelector((state) => state.notesInfo);

  useEffect(() => {
    localStorage.setItem("NotesState", JSON.stringify(notesInfo));
  }, [notesInfo]);

  return (
  <div className="flex h-full flex-col bg-slate-100">
    <nav className="bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center py-2 px-4">
        <Link to="/" className="font-bold">Заметки</Link>
      </div>
    </nav>
    <div className="my-4 mx-auto h-full w-full max-w-7xl rounded-xl shadow">
      <div className="flex h-full w-full flex-row justify-between rounded-xl bg-white">
        <div className="flex h-full basis-1/5 flex-col border-r">
          <NoteList />
        </div>
        <div className="p-4 basis-4/5">
          <Note />
        </div>
      </div>
    </div>
  </div>
);};

export default App;
