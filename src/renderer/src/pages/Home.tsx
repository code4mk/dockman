import React, { useState } from 'react';
import BaseLayout from '@layouts/Base';
import { Link } from 'react-router-dom';
import TextEditor from '@components/Editor';

function Home(): JSX.Element {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <BaseLayout>
      <p>Home page</p>
      <Link to="/about">about</Link>
      <div className="h-screen p-10 bg-gray-100">
        <div className="h-[500px] bg-white rounded mt-4 p-4 flex flex-col justify-between">
          <div className="flex items-center">
            {isEditing ? (
              <input
                type="text"
                className="w-full px-4 text-2xl font-bold outline-none resize-none border-none bg-transparent"
                spellCheck={false}
                placeholder="Untitled"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              <h1
                className={`text-2xl font-bold cursor-text w-full px-4 ${title === '' ? 'text-gray-400' : ''}`}
                onClick={handleEditClick}
              >
                {title || 'Untitled'}
              </h1>
            )}
          </div>
          <div className="flex-grow">
            <TextEditor />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Home;
