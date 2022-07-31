import React, { FC, useMemo } from 'react'
import styled from "styled-components";


const JsonContainer = styled.pre`
  flex: 1; 
  overflow: auto;
  margin: 0;

  font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 12px;

  .string { color: #a31515; }
  .number { color: #098658; }
  .boolean { color: #0000ff; }
  .null  { color: magenta; }
  .undefined { color: #3f3f3f; }
  .key { color: #0451a5; }
`;


function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null|undefined)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    } else if (/undefined/.test(match)) {
      cls = 'undefined';
    }

    return '<span class="' + cls + '">' + match + '</span>';
  });
}

const JsonViewer: FC<{ json: any }> = React.memo(({ json }) => {

  console.log('JsonViewer render')

  const stringifyJson = JSON.stringify(json, undefined, 1);
  const htmlJson = useMemo(() => syntaxHighlight(stringifyJson), [stringifyJson]);

  return (
    // <ReactJson
    //   src={json}
    //   name={null}
    //   indentWidth={2}
    //   displayDataTypes={false}
    //   enableClipboard={false}
    //   style={{ flex: 1, overflow: 'auto' }}
    // />
    <JsonContainer dangerouslySetInnerHTML={{ __html: htmlJson }} />
  );
});


export default JsonViewer;
