import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useProject } from "./project-provider"
import { useParams } from "next/navigation"

type BreadcrumbsProps = {
  activeTabId: string
  path: string
}

type TreeItem = {
  id: string
  name: string
  children?: TreeItem[]
}

export function Breadcrumbs({ activeTabId, path }: BreadcrumbsProps) {
  const { project } = useProject()
  const params = useParams()

  console.log("Breadcrumbs props:", { activeTabId, path })
  console.log("Project:", project)

  if (!project) {
    console.log("No project found")
    return null
  }

  const activeTab = project.tabs.find((tab) => tab.id === activeTabId)
  console.log("Active tab:", activeTab)

  if (!activeTab) {
    console.log("No active tab found")
    return null
  }

  const findBreadcrumbsInTree = (items: TreeItem[], targetPath: string): { name: string; path: string }[] => {
    const pathParts = targetPath.split("/").filter(Boolean)
    let currentItems = items
    const breadcrumbs: { name: string; path: string }[] = []

    for (const part of pathParts) {
      const foundItem = currentItems.find((item) => item.id === part || item.id.endsWith(`/${part}`))
      if (foundItem) {
        breadcrumbs.push({ name: foundItem.name, path: foundItem.id })
        if (foundItem.children) {
          currentItems = foundItem.children
        } else {
          break
        }
      } else {
        break
      }
    }

    console.log("Found breadcrumbs:", breadcrumbs)
    return breadcrumbs
  }

  const sidebarBreadcrumbs = findBreadcrumbsInTree(activeTab.sidebar, path)
  const breadcrumbs = [
    { name: activeTab.name, href: `/project/${params.id}/${activeTab.id}` },
    ...sidebarBreadcrumbs.map((item) => ({
      name: item.name,
      href: `/project/${params.id}/${activeTab.id}/${item.path}`,
    })),
  ]

  console.log("Final breadcrumbs:", breadcrumbs)

  // Fallback to path-based breadcrumbs if sidebar structure doesn't match
  if (breadcrumbs.length === 1) {
    const pathParts = path.split("/").filter(Boolean)
    breadcrumbs.push(
      ...pathParts.map((part, index) => ({
        name: part.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()), // Format name
        href: `/project/${params.id}/${activeTab.id}/${pathParts.slice(0, index + 1).join("/")}`,
      })),
    )
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
            <Link
              href={crumb.href}
              className={`inline-flex items-center text-sm font-medium ${
                index === 0
                  ? "text-xl font-bold" // Increase text size for the first item
                  : index === breadcrumbs.length - 1
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
              }`}
            >
              {crumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

