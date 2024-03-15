import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { githubLightTheme } from '@utils/monaco/github-theme'
import { nginxTokenConf } from '@utils/monaco/nginx-lang/nginx'
import suggestions from '@utils/monaco/nginx-lang/suggestions'
import directives from '@utils/monaco/nginx-lang/directives.json'

interface TheProps {
  content: string
  language: string
  onContentChange: any
}

function NginxEditor({ content, language, onContentChange }: TheProps): JSX.Element {
  const monacoRef: any = useRef(null)
  const [theData, setTheData] = useState('')

  function handleEditorWillMount(monaco): void {
    // TODO:
  }

  function handleEditorDidMount(editor, monaco): void {
    /* set github light theme */
    monaco.editor.defineTheme('github-light', githubLightTheme)
    monaco.editor.setTheme('github-light')

    monaco.languages.setMonarchTokensProvider('nginx', nginxTokenConf)

    monaco.languages.register({
      id: 'nginx'
    })

    monaco.languages.registerCompletionItemProvider('nginx', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }
        return { suggestions: suggestions(range, monaco) }
      }
    })

    monaco.languages.registerHoverProvider('nginx', {
      provideHover: (model, position, token) => {
        const word = model.getWordAtPosition(position)
        if (!word) return
        const data = directives.find((item) => item.n === word.word || item.n === `$${word.word}`)
        if (!data) return
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        }
        const contents = [{ value: `**\`${data.n}\`** | ${data.m} | ${data.c || ''}` }]
        if (data.s) {
          contents.push({ value: `**syntax:** ${data.s || ''}` })
        }
        if (data.v) {
          contents.push({ value: `**default:** ${data.v || ''}` })
        }
        if (data.d) {
          contents.push({ value: `${data.d}` })
        }
        return {
          contents: [...contents],
          range: range
        }
      }
    })
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
          readOnly: false,
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

export default NginxEditor
