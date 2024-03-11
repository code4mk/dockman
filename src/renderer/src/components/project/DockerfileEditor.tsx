import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { githubLightTheme } from '@utils/monaco/github-theme'

interface TheProps {
  content: string
  language: string
}

function DockerfileEditor({ content, language }: TheProps): JSX.Element {
  const monacoRef: any = useRef(null)
  const monaco: any = useMonaco()
  const [theData, setTheData] = useState('')
  
  useEffect(() => {
    setTheData(content)
  }, [content])

  const handleContentChange = (newValue: any, event: any) => {
    console.log(newValue)
    setTheData(newValue)
  }

  function handleEditorDidMount(editor, monaco): void {
    /* set github light theme */
    monaco.editor.defineTheme('github-light', githubLightTheme)
    monaco.editor.setTheme('github-light')
  }

  return (
    <>
      <MonacoEditor
        language={language}
        theme="vs"
        value={theData}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          wordWrap: 'off',
          minimap: {
            enabled: false
          }
          // ... other options
        }}
        height="100%"
        width="100%"
        onChange={handleContentChange}
      />
    </>
  )
}

export default DockerfileEditor
