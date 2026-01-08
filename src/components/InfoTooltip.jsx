import React from 'react';
import { Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

const InfoTooltip = ({ content }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-primary transition-colors cursor-help">
                        <Info className="h-4 w-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="max-w-xs text-sm p-1">
                        {content}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default InfoTooltip;
