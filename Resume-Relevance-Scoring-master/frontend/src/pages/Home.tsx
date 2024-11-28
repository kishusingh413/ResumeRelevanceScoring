import React, { useCallback, useEffect, useRef, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { addResumes, createTask, runTask } from '../redux/service';

import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import FileCard from '../components/Home/FileCard';
import UploadCard from '../components/Home/UploadCard';
import CancelAlert from '../components/Home/CancelAlert';
import SubmissionDialog from '../components/Home/SubmissionDialog';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isTaskCreated, isLoading } = useAppSelector((state) => state.task)

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgresses, setUploadProgresses] = useState<{ [key: string]: number }>({});
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isTaskCreated && !isLoading) {
      dispatch(createTask());
    }
  }, []);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files).filter(file => file.type === 'application/pdf') : [];
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  }, []);

  const removeFile = useCallback((fileToRemove: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    setUploadProgresses(prevProgresses => {
      const updatedProgresses = { ...prevProgresses };
      delete updatedProgresses[fileToRemove.name];
      return updatedProgresses;
    });
  }, []);

  const handleDialogSubmit = async () => {
    setIsUploading(true);
    await uploadFiles(selectedFiles);
  };

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("files", file);
        await dispatch(addResumes({ files: formData })).unwrap();
        setUploadProgresses(prev => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadProgresses(prev => ({ ...prev, [file.name]: -1 }));
      }
    }
    setIsUploading(false);
    handleRunTask();
  };

  const handleRunTask = useCallback(async () => {
    const response = await dispatch(runTask());
    if (response.meta.requestStatus === "fulfilled") {
      navigate('/result');
    }
  }, [dispatch, navigate]);

  const confirmCancellation = () => {
    setSelectedFiles([]);
    setIsAlertOpen(false);
  };

  const handleAttachFilesClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="container mx-auto p-4 mt-14 flex flex-col items-center">
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <UploadCard handleUpload={handleAttachFilesClick} />
      <ScrollArea className="sm:h-[30em] sm:w-1/2 w-1/3 rounded-md space-y-4">
        {selectedFiles.map((file: File) => (
          <FileCard
            key={file.name}
            file={file}
            onRemove={removeFile}
            uploadProgress={uploadProgresses[file.name as keyof typeof uploadProgresses] || 0}
            isUploading={isUploading}
          />
        ))}
      </ScrollArea>
      {selectedFiles.length > 0 && (
        <div className="flex justify-center sm:w-1/2 w-1/3 mt-4 grid grid-cols-2 gap-2">
          <CancelAlert
            isOpen={isAlertOpen}
            onOpenChange={setIsAlertOpen}
            onConfirm={confirmCancellation}
          />
          <SubmissionDialog onSubmit={handleDialogSubmit} />
        </div>
      )}
    </div>
  );
};

export default Home;
