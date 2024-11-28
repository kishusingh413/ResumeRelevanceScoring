import React, { useCallback, useState } from 'react';
import { Flag } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogTrigger, DialogDescription, DialogHeader } from '../ui/dialog';
import { updateJobDetails } from '../../redux/taskSlice';
import { runTask } from '../../redux/service';

const EditDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { job } = useAppSelector((state) => state.task);
  const [role, setRole] = useState(job.role);
  const [jobDescription, setJobDescription] = useState(job.description);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleSubmit = () => {
    dispatch(updateJobDetails({role, description: jobDescription}));
    handleRunTask();
    setIsDialogOpen(false);
  };

  const handleRunTask = useCallback(async () => {
    await dispatch(runTask());
  }, [dispatch]);

  const handleRoleChange = (text: string) => {
    setRole(text);
  };

  const handleDescriptionChange = (text: string) => {
    setJobDescription(text);
  };

  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="sm:w-3/12" onClick={() => setIsDialogOpen(true)}>Edit Job</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Card className="border flex p-2 mb-2 w-fit">
            <Flag />
          </Card>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Edit the job description
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid gap-4 pb-4 pt-2">
          <div>
            <Label htmlFor="role" className="text-right">
              Role*
            </Label>
            <Input id="role" value={role || ''} className="col-span-3" onChange={(event) => handleRoleChange(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="description" className="text-right">
              Job Description*
            </Label>
            <Textarea id="description" placeholder="Type job description here." value={jobDescription || ''} onChange={(event) => handleDescriptionChange(event.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter className="flex justify-between w-full grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
