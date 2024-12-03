import { EditorContent } from '@tiptap/react'
import React, { useRef } from 'react'

import { LinkMenu } from './LinkMenu'

import './styles/index.css'
import { useBlockEditor } from './hooks/useBlockEditor'
import { TextMenu } from './TextMenu/TextMenu'
import { ContentItemMenu } from './ContentItemMenu/ContentItemMenu'

export const BlockEditor = ({}: {}) => {
  const menuContainerRef = useRef(null)

  const { editor } = useBlockEditor({})

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} /> 
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        {/* <ColumnsMenu editor={editor} appendTo={menuContainerRef} /> */}
        {/* <TableRowMenu editor={editor} appendTo={menuContainerRef} /> */}
        {/* <TableColumnMenu editor={editor} appendTo={menuContainerRef} /> */}
        {/* <ImageBlockMenu editor={editor} appendTo={menuContainerRef} /> */}
      </div>
    </div>
  )
}

export default BlockEditor