import { HelpCircle } from "lucide-react";

import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export function RelevanceHoverPopup() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <HelpCircle className="w-4 text-muted-foreground" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col justify-between space-y-1">
          <h4 className="text-sm font-semibold">Relevance Score</h4>
          <span className="text-xs text-muted-foreground">
            Gauge of how closely candidate's resume matches job description.
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
