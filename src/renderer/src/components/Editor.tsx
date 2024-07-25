import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const slashCommands = {
  Text: [
    { name: 'Normal Text', icon: 'T', format: 'clean' },
    { name: 'Heading 1', icon: 'H₁', format: 'header', value: 1 },
    { name: 'Heading 2', icon: 'H₂', format: 'header', value: 2 },
    { name: 'Heading 3', icon: 'H₃', format: 'header', value: 3 },
    { name: 'Heading 4', icon: 'H₄', format: 'header', value: 4 },
    { name: 'Bulleted List', icon: '•', format: 'list', value: 'bullet' },
    { name: 'Numbered List', icon: '1.', format: 'list', value: 'ordered' },
    { name: 'Checklist', icon: '☐', format: 'list', value: 'check' },
    { name: 'Toggle List', icon: '▶', format: 'list', value: 'toggle' },
    { name: 'Code Block', icon: '{ }', format: 'code-block' },
    { name: 'Quote', icon: '"', format: 'blockquote' }
  ],
  Formatting: [
    { name: 'Bold', icon: '𝐁', format: 'bold' },
    { name: 'Italic', icon: '𝑰', format: 'italic' },
    { name: 'Strikethrough', icon: 'S̶', format: 'strike' },
    { name: 'Inline code', icon: '`', format: 'code' }
  ]
}

const TextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const slashCommandsRef = useRef<HTMLDivElement>(null)
  const [quill, setQuill] = useState<Quill | null>(null)
  const [showSlashCommands, setShowSlashCommands] = useState(false)
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false)
  const [slashCommandsPos, setSlashCommandsPos] = useState<{ top: number; left: number } | null>(
    null
  )
  const [formattingToolbarPos, setFormattingToolbarPos] = useState<{
    top: number
    left: number
  } | null>(null)
  const [slashCount, setSlashCount] = useState(0)
  const [slashSelection, setSlashSelection] = useState({} as any)

  useEffect(() => {
    if (editorRef.current) {
      const quillInstance = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: false,
          table: true
        },
        placeholder: "Type '/' for commands"
      })
      setQuill(quillInstance)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (slashCommandsRef.current && !slashCommandsRef.current.contains(event.target as Node)) {
        setShowSlashCommands(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (quill) {
      quill.on('text-change', function (delta, oldContents, source) {
        if (source === 'user') {
          const lastDelta = delta.ops.length
          const change = delta.ops[lastDelta - 1]
          console.log(change.insert)
          if (change && change.insert === '/') {
            const position: any = quill.getSelection()
            console.log(position)
            //quill.deleteText(position.index, 1)
          }
        }
      })

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === '/') {
          setSlashCount((prev) => prev + 1)
          const selection = quill.getSelection()
          setSlashSelection(selection)
          console.log(selection)
          if (selection) {
            const bounds: any = quill.getBounds(selection.index)
            const editorRect = editorRef.current!.getBoundingClientRect()
            setSlashCommandsPos({
              left: bounds.left + editorRect.left,
              top: bounds.bottom + editorRect.top + window.scrollY
            })
            setShowSlashCommands(true)
          }
        } else if (event.key === 'Backspace') {
          setSlashCount((prev) => Math.max(0, prev - 1))
          if (slashCount <= 1) {
            setShowSlashCommands(false)
          }
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          // Handle arrow navigation in slash commands
          event.preventDefault()
          // Implement logic to navigate through slash commands
        } else {
          setShowSlashCommands(false)
        }
      }

      quill.root.addEventListener('keydown', handleKeyDown)

      quill.on('selection-change', (range, oldRange, source) => {
        if (range && range.length > 0) {
          const bounds: any = quill.getBounds(range.index, range.length)
          const editorRect = editorRef.current!.getBoundingClientRect()
          setFormattingToolbarPos({
            left: bounds.left + editorRect.left,
            top: bounds.bottom + editorRect.top + 10 + window.scrollY
          })
          setShowFormattingToolbar(true)
        } else {
          setShowFormattingToolbar(false)
        }
      })

      return () => {
        quill.root.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [quill, slashCount])

  const applySlashFormat = (format: string, value?: any) => {
    if (quill) {
      const selection = quill.getSelection()
      console.log(selection)
    }
    if (quill) {
      const selection = slashSelection
      console.log(selection)
      quill.format(format, value)
      quill.deleteText(selection.index, 1)
      setShowSlashCommands(false)
      quill.focus()
    }
  }

  const applyFormat = (format: string, value?: any) => {
    if (quill) {
      const selection = quill.getSelection()
      if (selection) {
        if (format !== 'clean' && showSlashCommands) {
          quill.deleteText(selection.index - 1, 1) // Remove the '/'
          setSlashCount((prev) => Math.max(0, prev - 1))
        }
        // Check if the format is already applied
        const currentFormat = quill.getFormat(selection.index, selection.length)

        if (format in currentFormat) {
          // If the format exists in currentFormat, toggle it off
          quill.format(format, false)
        } else {
          // If the format doesn't exist, apply it
          quill.format(format, value || true)
        }
      }
      // setShowSlashCommands(false)
      // setShowFormattingToolbar(false)
      // quill.focus()
    }
  }

  return (
    <div className="h-full">
      <div
        ref={editorRef}
        className="!border !border-white rounded-lg p-4 bg-white h-full overflow-auto"
      />

      {showSlashCommands && slashCommandsPos && (
        <div
          ref={slashCommandsRef}
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10"
          style={{
            top: `${slashCommandsPos.top}px`,
            left: `${slashCommandsPos.left}px`,
            maxWidth: '300px'
          }}
        >
          {Object.entries(slashCommands).map(([category, commands]) => (
            <div key={category} className="mb-2">
              <div className="font-bold text-gray-600 text-sm mb-1">{category}</div>
              <div className="grid grid-cols-2 gap-2">
                {commands.map((command) => (
                  <div
                    key={command.name}
                    className="flex items-center p-2 cursor-pointer rounded hover:bg-gray-200"
                    onClick={() => applySlashFormat(command.format, command.value)}
                  >
                    <span className="mr-2">{command.icon}</span>
                    {command.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showFormattingToolbar && formattingToolbarPos && (
        <div
          className="absolute bg-white border-[1px] border-gray-300 rounded flex flex-row gap-4 px-8 py-2 z-10 w-[720px]"
          style={{ top: `${formattingToolbarPos.top}px`, left: `${formattingToolbarPos.left}px` }}
        >
          <button className="" onClick={() => applyFormat('bold')}>
            B
          </button>
          <button className="" onClick={() => applyFormat('italic')}>
            I
          </button>
          <button className="" onClick={() => applyFormat('underline')}>
            U
          </button>
          <button className="" onClick={() => applyFormat('strike')}>
            S
          </button>
        </div>
      )}
    </div>
  )
}

export default TextEditor