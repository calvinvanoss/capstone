"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProject } from "@/lib/server-actions"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
  projectId: string
}

export function DeleteButton({ projectId }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      setIsDeleting(true)
      try {
        await deleteProject(projectId)
        router.refresh() // This will trigger a re-render of the server components
      } catch (error) {
        console.error("Error deleting project:", error)
        alert("Failed to delete project. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete Project</span>
    </Button>
  )
}

