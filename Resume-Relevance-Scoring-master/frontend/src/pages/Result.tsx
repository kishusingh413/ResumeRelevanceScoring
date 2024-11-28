import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { useAppSelector } from '../hooks';
import { ResumeType } from '../components/types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ResumeTable } from '../components/Result/ResumeTable';
import EditDialog from '../components/Result/EditDialog';

const Result: React.FC = () => {
  const { result } = useAppSelector((state) => state.task);
  const [requiredRelevancy, setRequiredRelevancy] = useState(50);
  const [fitResumes, setFitResumes] = useState<Array<ResumeType>>([]);
  const [unfitResumes, setUnfitResumes] = useState<Array<ResumeType>>([]);

  const handleFilter = () => {
    if (result.length > 0) {
      setFitResumes(result.filter(e => e.relevance_score >= requiredRelevancy));
      setUnfitResumes(result.filter(e => e.relevance_score < requiredRelevancy));
    }
  };

  useEffect(() => {
    handleFilter();
  }, [result]);

  return (
    <div className="py-10">
      <div className="flex justify-between grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <h1 className="text-2xl font-medium">{fitResumes.length} Resumes filtered</h1>
          <span className="text-sm text-muted-foreground">Purpose selection</span>
        </div>
        <div className="flex items-center col-span-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap mr-2">Required Relevancy Score:</span>
          <Input value={requiredRelevancy} onChange={(event) => setRequiredRelevancy(Number(event.target.value))} />
          <Button variant="outline" className="ml-2" onClick={handleFilter}><ArrowRight className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center col-span-1 justify-end">
          <EditDialog />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 border-t border-gray-200 pt-4 mt-4">
        <div className="col-span-1">
          <h1 className="text-l font-medium">Recommended Profiles</h1>
          <span className="text-sm text-muted-foreground">Resumes fit for the Job role</span>
        </div>
        <div className="col-span-3">
          <ResumeTable data={fitResumes} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 border-t border-gray-200 pt-4 my-4">
        <div className="col-span-1">
          <h1 className="text-l font-medium">Non - Recommended Profiles</h1>
          <span className="text-sm text-muted-foreground">Resumes that don't fit for the Job role</span>
        </div>
        <div className="col-span-3">
          <ResumeTable data={unfitResumes} />
        </div>
      </div>
    </div>
  );
}

export default Result;
