import React from 'react';

import { truncateFileName } from '../lib/helpers';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import pdfIcon from '../../assets/icons/pdf.svg';
import checkboxIcon from '../../assets/icons/checkbox.svg';

interface FileCardProps {
  file: File;
  onRemove: (file: File) => void;
  uploadProgress: number;
  isUploading: boolean;
}

const FileCard: React.FC<FileCardProps> = ({ file, onRemove, uploadProgress, isUploading }) => {
  const formatFileSize = React.useCallback((size: number) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1048576).toFixed(1)} MB`;
  }, []);

  return (
    <Card className="w-full p-6 flex flex-row items-center justify-between hover:bg-muted ease-in-out mb-2">
      <div className="flex items-center">
        <img src={pdfIcon} className="mr-4" alt="pdf" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{truncateFileName(file.name)}</p>
          <p className="text-xs text-gray-500 flex items-center">
            {formatFileSize(file.size)}
            {isUploading && (
              <span className="ml-2 flex items-center">
                <Progress value={uploadProgress} className="w-24 h-2" />
                &nbsp;{uploadProgress}%
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {uploadProgress === 100 ? (
          <img src={checkboxIcon} alt="uploaded" />
        ) : isUploading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12c0-4.418 3.582-8 8-8v8h8c0 4.418-3.582 8-8 8s-8-3.582-8-8z"></path>
          </svg>
        ) : (
          <Button variant="ghost" onClick={() => onRemove(file)}>
            Remove
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FileCard;
