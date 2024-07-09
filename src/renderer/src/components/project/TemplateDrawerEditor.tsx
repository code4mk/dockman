import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { githubLightTheme } from '@utils/monaco/github-theme'

interface TheProps {
  content: string
  language: string
  onContentChange: any
  monacoConfig?: any
}

function TemplateDrawerEditor({
  content,
  language,
  onContentChange,
  monacoConfig
}: TheProps): JSX.Element {
  const monacoRef: any = useRef(null)
  const [theData, setTheData] = useState('')

  function handleEditorWillMount(monaco): void {
    // TODO:
  }

  function handleEditorDidMount(editor, monaco): void {
    /* set github light theme */
    monaco.editor.defineTheme('github-light', githubLightTheme)
    monaco.editor.setTheme('github-light')
  }

  useEffect(() => {
    setTheData(content)
  }, [content])

  useEffect(() => {
    onContentChange(theData)
  }, [theData])

  const handleContentChange = (newValue: any, event: any) => {
    setTheData(newValue)
  }

  return (
    <>
      <MonacoEditor
        language={language}
        theme="vs"
        value={theData}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          wordWrap: 'on',
          minimap: {
            enabled: true
          },
          fixedOverflowWidgets: false
          // renderWhitespace: 'all'
          // ... other options
        }}
        height="54vh"
        width="100%"
        onChange={handleContentChange}
      />
    </>
  )
}

export default TemplateDrawerEditor
