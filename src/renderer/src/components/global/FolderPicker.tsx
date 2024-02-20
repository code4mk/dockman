// FolderPicker.tsx

import React, { useState } from 'react';

interface FolderPickerProps {
  onFolderSelected: (selectedFolder: string) => void;
}

const FolderPicker: React.FC<FolderPickerProps> = ({ onFolderSelected }) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  const pickFolder = () => {
    // Trigger click on the file input element
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    } else {
      // Display a message for browsers that don't support file input
      alert("Folder selection not supported in this browser.");
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      // Get the relative path of the first file (assuming it's a directory)
      const relativePath = selectedFiles[0].path

      if (relativePath) {
        // Full path may include the file name, so we remove it to get the folder path
        const folderPath = relativePath.substring(0, relativePath.lastIndexOf('/'));

        // Update the selectedFolder state
        setSelectedFolder(folderPath);

        // Pass the selected folder to the parent component
        onFolderSelected(folderPath);
      } else {
        // Handle the case when webkitRelativePath is not available
        alert("Unable to get folder information in this browser.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form>
        {/* For browsers that support directory selection */}
        <input
          type="folder"
          name="datafile"
          className="hidden"
          onChange={handleFileInputChange}
          webkitdirectory="true"
          directory="true"
          mozdirectory=""
          msdirectory=""
          odirectory="true"
        />

        {/* Display the selected folder */}
        {selectedFolder && (
          <p className="text-center mb-4">Selected Folder: {selectedFolder}</p>
        )}

        {/* Add a button to trigger file input click */}
        <button
          type="button"
          onClick={pickFolder}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Pick Folder
        </button>
      </form>
    </div>
  );
};

export default FolderPicker;
