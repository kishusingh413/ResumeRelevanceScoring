import React from 'react';
import { UploadCloud } from 'lucide-react';

import { Card } from '../ui/card';

type UploadCardProps = {
  handleUpload: () => void;
};

const UploadCard: React.FC<UploadCardProps> = ({ handleUpload }) => {
  return (
    <Card className="border-primary w-1/3 h-32 flex flex-col items-center justify-center border-2 sm:w-1/2 hover:bg-muted ease-in-out cursor-pointer" onClick={handleUpload}>
      <UploadCloud className="text-muted-foreground sm:w-16 sm:h-16" />
      <span className="text-sm">
        <span className="text-primary font-medium">Click to upload PDF</span> or drag and drop
      </span>
    </Card>
  );
};

export default UploadCard;
