"use client"

import { useState } from "react"
import { useProject } from "./project-provider"
import { TreeView } from "./tree-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useParams, useRouter } from "next/navigation"

export function ProjectSidebar({
  activeTabId,
  activePath,
}: {
  activeTabId: string
  activePath: string
}) {
  const { project, updateProject, addTab, deleteTab } = useProject()
  const [isAddingRootFolder, setIsAddingRootFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedTree, setEditedTree] = useState<any>(null)
  const router = useRouter()
  const params = useParams()

  const activeTab = project?.tabs.find((tab) => tab.id === activeTabId)

  const handleTreeChange = (newTree: any) => {
    if (isEditing) {
      setEditedTree(newTree)
    } else if (project && activeTab) {
      const updatedTabs = project.tabs.map((tab) => (tab.id === activeTab.id ? { ...tab, sidebar: newTree } : tab))
      updateProject({ ...project, tabs: updatedTabs })
    }
  }

  const handleAddRootFolder = () => {
    if (newFolderName.trim() && project) {
      const newFolderId = `folder-${Date.now()}`
      const newFolder = {
        id: newFolderId,
        name: newFolderName.trim(),
        children: [],
      }

      // Create a new tab
      const newTab = {
        id: newFolderId,
        name: newFolderName.trim(),
        sidebar: [newFolder],
      }

      // Add the new tab to the project
      const updatedTabs = [...project.tabs, newTab]

      // Update the project with the new tab
      updateProject({ ...project, tabs: updatedTabs })

      setNewFolderName("")
      setIsAddingRootFolder(false)

      // Navigate to the new tab
      router.push(`/project/${params.id}/${newFolderId}`)
    }
  }

  const handleCancelAddFolder = () => {
    setNewFolderName("")
    setIsAddingRootFolder(false)
  }

  const startEditing = () => {
    setEditedTree(activeTab?.sidebar || [])
    setIsEditing(true)
  }

  const confirmEditing = () => {
    if (editedTree && project && activeTab) {
      const updatedTabs = project.tabs.map((tab) => (tab.id === activeTab.id ? { ...tab, sidebar: editedTree } : tab))
      updateProject({ ...project, tabs: updatedTabs })
    }
    setIsEditing(false)
    setEditedTree(null)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditedTree(null)
  }

  if (!project) return null

  return (
    <div className="w-64 border-r overflow-y-auto bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isAddingRootFolder} onOpenChange={setIsAddingRootFolder}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Root Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Root Folder</DialogTitle>
              <DialogDescription>Enter a name for the new root folder.</DialogDescription>
            </DialogHeader>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelAddFolder}>
                Cancel
              </Button>
              <Button onClick={handleAddRootFolder}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={confirmEditing} className="p-1 h-8 w-8">
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelEditing} className="p-1 h-8 w-8">
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={startEditing} className="p-1 h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      {activeTab && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Current Root Folder:</p>
          <h2 className="text-lg font-semibold">{activeTab.name}</h2>
        </div>
      )}
      <TreeView
        tree={isEditing ? editedTree : activeTab?.sidebar || []}
        onTreeChange={handleTreeChange}
        activePath={activePath}
        activeTabId={activeTabId}
        isEditing={isEditing}
      />
    </div>
  )
}

