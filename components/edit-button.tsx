import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
}

export function EditButton({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  className = '',
}: EditButtonProps) {
  if (!isEditing) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onEdit}
              variant="outline"
              size="icon"
              className={`w-[72px] justify-center ${className}`}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`flex w-[72px] ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              variant="outline"
              size="icon"
              className="rounded-r-none border-r-0 hover:bg-green-500 hover:text-white flex-1 transition-colors group"
            >
              <Check className="h-4 w-4 text-green-500 group-hover:text-white" />
              <span className="sr-only">Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onCancel}
              variant="outline"
              size="icon"
              className="rounded-l-none hover:bg-red-500 hover:text-white flex-1 transition-colors group"
            >
              <X className="h-4 w-4 text-red-500 group-hover:text-white" />
              <span className="sr-only">Cancel</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cancel changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
