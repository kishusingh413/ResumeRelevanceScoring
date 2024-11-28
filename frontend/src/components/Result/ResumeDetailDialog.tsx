import React from "react";
import { CalendarDays, CalendarFold } from "lucide-react";

import { ResumeType } from "../types";
import { getInitials } from "../lib/helpers";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";

export function ResumeDetailDialog({ resume }: { readonly resume: ResumeType }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50em] p-4">
        <DialogHeader className="flex mb-4">
          <Avatar className="mr-2 mb-2 border">
            <AvatarFallback>{getInitials(resume.candidate_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-lg">{resume.candidate_name}</p>
            <span className="text-sm text-muted-foreground">{resume.email}</span>
          </div>
        </DialogHeader>
        <Tabs defaultValue="college" className="grid gap-1">
          <TabsList className="w-3/4 grid grid-cols-3 gap-2 border">
            <TabsTrigger value="college">College</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="professional_experience">Professional Experience</TabsTrigger>
          </TabsList>
          <TabsContent value="college">
            <ScrollArea className="sm:h-[15em] rounded-md border">
              <CardContent className="mt-4 space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(resume.college).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-5 gap-2">
                      <p className="text-sm font-medium col-span-1 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:&emsp;&emsp;&emsp;</p>
                      <span className="text-sm col-span-4 text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="project">
            <ScrollArea className="sm:h-[15em] rounded-md border">
              <CardContent className="space-y-4">
                {resume.projects?.map((project, index, array) => (
                  <div key={index} className={`w-full ${index < array.length - 1 ? 'border-b border-gray-200 pb-4' : ''} my-4`}>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium flex">{project.project_title} <Badge variant="secondary" className="ml-2 text-primary">Relevancy: {project.relevancy}</Badge></p>
                      <div className="flex flex-row items-center space-x-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-3"/>
                        <span className="text-sm">Start: {project.time_duration.start} - End: {project.time_duration.end}</span>
                        <CalendarFold className="w-3"/>
                        <span className="text-sm">{project.time_duration.duration_months} month</span>
                      </div>
                      <span className="text-sm mt-3 mb-1">{project.short_description}</span>
                      <span className="text-sm text-muted-foreground">Tech Stack: {project.tech_stack?.join(", ")}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="professional_experience">
            <ScrollArea className="sm:h-[15em] rounded-md border">
              <CardContent className="space-y-4">
                {resume.professional_experience?.map((experience, index, array) => (
                  <div key={index} className={`w-full ${index < array.length - 1 ? 'border-b border-gray-200 pb-4' : ''}  my-4`}>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium flex">{experience.role} | {experience.organization} <Badge variant="secondary" className="ml-2 text-primary">Relevancy: {experience.relevancy}</Badge></p>
                      <div className="flex flex-row items-center space-x-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-3"/>
                        <span className="text-sm">Start: {experience.time_duration.start} - End: {experience.time_duration.end}</span>
                        <CalendarFold className="w-3"/>
                        <span className="text-sm">{experience.time_duration.duration_months} month</span>
                      </div>
                      <p className="text-sm  mt-3 mb-1">{experience.short_description}</p>
                      <p className="text-sm text-sm text-muted-foreground">Tech Stack: {experience.tech_stack?.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
