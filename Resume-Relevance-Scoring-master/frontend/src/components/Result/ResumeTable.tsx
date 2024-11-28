import React, { useState } from "react";

import { ResumeType } from "../types";
import PDFViewer from "./PDFViewer";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { RelevanceHoverPopup } from "./RelevanceHoverPopup";
import { ResumeDetailDialog } from "./ResumeDetailDialog";
import { getInitials } from "../lib/helpers";

export function ResumeTable({ data }: Readonly<{ data: ReadonlyArray<ResumeType> }>) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const handleFileView = (file: string) => {
    setFileUrl(`${process.env.REACT_APP_BASE_URL}/api/v1/serve-resume/${file}/`);
    setViewerOpen(true);
  }
  
  return (
    <ScrollArea className="w-[60em] h-[26em] border rounded-md">
      <Table>
        <TableHeader className="sticky top-0 bg-muted">
          <TableRow>
            <TableHead className="col-span-2">Name</TableHead>
            <TableHead className="col-span-2 flex items-center justify-left">Relevance Score<RelevanceHoverPopup /></TableHead>
            <TableHead className="col-span-1 text-left">Resume Link</TableHead>
            <TableHead className="col-span-1 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell className="text-center" colSpan={6}>
                <p className="font-medium text-muted-foreground">No Resumes !</p>
              </TableCell>
            </TableRow>
          ) : (
            data.map((resume: ResumeType) => (
              <TableRow key={resume.id}>
                <TableCell className="flex flex-row items-center col-span-2">
                  <Avatar className="mr-2">
                    <AvatarFallback>{getInitials(resume.candidate_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{resume.candidate_name}</p>
                    <span className="text-sm text-muted-foreground">{resume.email}</span>
                  </div>
                </TableCell>
                <TableCell className="col-span-2">{resume.relevance_score}</TableCell>
                <TableCell className="col-span-1"><Button variant="link" className="text-black" onClick={() => handleFileView(resume.file)}>Link</Button></TableCell>
                <TableCell className="col-span-1 text-right"><ResumeDetailDialog resume={resume} /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {viewerOpen && <PDFViewer fileUrl={fileUrl} onClose={() => setViewerOpen(false)} />}
    </ScrollArea>
  )
}
