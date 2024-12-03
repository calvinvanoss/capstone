import { useEditor } from '@tiptap/react'
import type { Editor } from '@tiptap/core'

// import { ExtensionKit } from '@/extensions/extension-kit'

declare global {
  interface Window {
    editor: Editor | null
  }
}

const initialContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          textAlign: 'left',
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'Create Documentation Here',
          },
        ],
      },
    ]
}

export const useBlockEditor = ({}: {}) => {

  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: ctx => {
          ctx.editor.commands.setContent(initialContent)
          ctx.editor.commands.focus('start', { scrollIntoView: true })
        }
      },
    //   extensions: [
    //     ...ExtensionKit({
    //       provider,
    //     }),
    //   editorProps: {
    //     attributes: {
    //       autocomplete: 'off',
    //       autocorrect: 'off',
    //       autocapitalize: 'off',
    //       class: 'min-h-full',
    //     },
    //   },
    // ]
  )

  window.editor = editor

  return { editor }
}