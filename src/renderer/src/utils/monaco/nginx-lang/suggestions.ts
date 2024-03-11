import directives from './directives.json'

function getDirectives(range, monaco): any {
  const uniqueDirectives = Array.from(new Set(directives.map((item) => item.n)))

  return uniqueDirectives.map((directive) => ({
    label: directive,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: directive,
    documentation: directives.find((item) => item.n === directive)?.d,
    range
  }))
}

export default function suggestions(range, monaco): any {
  return [
    ...getDirectives(range, monaco),
    {
      label: 'upstream',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        // eslint-disable-next-line no-template-curly-in-string
        'upstream ${1:upstream_name} {',
        // eslint-disable-next-line no-template-curly-in-string
        '\tserver ${0:127.0.0.1:3110};',
        '}'
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      detail: 'Upstream Example',
      range
    },
    {
      label: 'proxy_pass',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        // eslint-disable-next-line no-template-curly-in-string
        'proxy_pass    ${1:http}://${0192.168.188.222:32001};'
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      detail: 'proxy_pass Example',
      range
    },
    {
      label: 'location',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: [
        // eslint-disable-next-line no-template-curly-in-string
        'location ${1:/} {\n\t${0}\n}'
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      detail: 'proxy_pass Example',
      range
    }
  ]
}
