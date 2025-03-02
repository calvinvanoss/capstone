'use client';

import { MoreVertical, Pencil, Share2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { deleteProject, putProject, shareProject } from '@/lib/server-actions';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function EditProjectDropdown({
  projectId,
  projectName,
  projectDescription,
}: {
  projectId: number;
  projectName: string;
  projectDescription: string;
}) {
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [name, setName] = useState(projectName);
  const [description, setDescription] = useState(projectDescription);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('admin');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleEdit = async () => {
    setIsEditLoading(true);
    await putProject(projectId, name, description);
    router.refresh();
    setIsEditLoading(false);
    setIsEditModalOpen(false);
  };

  const handleShare = async () => {
    setIsShareLoading(true);
    await shareProject(projectId, email, role);
    setIsShareLoading(false);
    setIsShareModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    await deleteProject(projectId);
    router.refresh();
    setIsDeleteLoading(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <DropdownMenu
        key={
          isEditModalOpen
            ? 'editOpen'
            : isShareModalOpen
              ? 'shareOpen'
              : isDeleteModalOpen
                ? 'deleteOpen'
                : 'closed'
        }
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsShareModalOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit project modal */}
      <Dialog
        open={isEditModalOpen || isEditLoading}
        onOpenChange={setIsEditModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Edit project name and description.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  isEditLoading ||
                  (name === projectName && description === projectDescription)
                }
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share project modal */}
      <Dialog
        open={isShareModalOpen || isShareLoading}
        onOpenChange={setIsShareModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Invite a collaborator to your project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleShare}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={role}
                  onValueChange={(val: 'admin' | 'editor' | 'viewer') =>
                    setRole(val)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin" className="hover:bg-gray-200">
                      Admin
                    </SelectItem>
                    <SelectItem value="editor" className="hover:bg-gray-200">
                      Editor
                    </SelectItem>
                    <SelectItem value="viewer" className="hover:bg-gray-200">
                      Viewer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isShareLoading || email === ''}>
                Share
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete project modal */}
      <Dialog
        open={isDeleteModalOpen || isDeleteLoading}
        onOpenChange={setIsDeleteModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{projectName}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isDeleteLoading}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleteLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
