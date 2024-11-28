import React from 'react';

import { Button } from '../ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface CancelAlertProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

const CancelAlert: React.FC<CancelAlertProps> = ({ isOpen, onOpenChange, onConfirm }) => {
  const handleCancel = () => {
    onOpenChange(true);
  };

  const handleNoGoBack = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="sm:w-3/4" onClick={handleCancel}>
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center">
        <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
        <AlertDialogDescription>
          This will remove all selected files. <br /> Are you sure you want to continue?
        </AlertDialogDescription>
        <div className="flex w-full items-center grid grid-cols-2 gap-2 mt-2">
          <Button variant="outline" onClick={handleNoGoBack}>
            No, Go Back
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Yes, Cancel
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelAlert;
