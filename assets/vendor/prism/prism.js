(function () {
  const javaKeywords = new Set([
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
    "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
    "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native",
    "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
    "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void",
    "volatile", "while", "var", "record", "sealed", "permits", "non-sealed"
  ]);

  const javaTypes = new Set([
    "String", "Object", "Integer", "Long", "Double", "Float", "Boolean", "Character", "Byte", "Short",
    "List", "ArrayList", "LinkedList", "Map", "HashMap", "TreeMap", "Set", "HashSet", "TreeSet",
    "Deque", "ArrayDeque", "Queue", "PriorityQueue", "Stack", "Arrays", "Collections", "Math",
    "StringBuilder", "StringBuffer", "TreeNode", "ListNode", "Node", "Optional"
  ]);

  const tokenPattern = /\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@\w+|\b\d+(?:\.\d+)?(?:[fFdDlL])?\b|\b[A-Za-z_$][\w$]*\b|[{}()[\];,.]|[-+*/%=&|!<>?:~^]+/g;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function wrap(type, value) {
    return `<span class="token ${type}">${escapeHtml(value)}</span>`;
  }

  function classify(token, source, offset) {
    if (token.startsWith("//") || token.startsWith("/*")) return wrap("comment", token);
    if (token.startsWith("\"") || token.startsWith("'")) return wrap("string", token);
    if (token.startsWith("@")) return wrap("annotation", token);
    if (/^\d/.test(token)) return wrap("number", token);
    if (/^[{}()[\];,.]$/.test(token)) return wrap("punctuation", token);
    if (/^[-+*/%=&|!<>?:~^]+$/.test(token)) return wrap("operator", token);
    if (javaKeywords.has(token)) return wrap("keyword", token);
    if (javaTypes.has(token) || /^[A-Z][A-Za-z0-9_$]*$/.test(token)) return wrap("class-name", token);

    const after = source.slice(offset + token.length);
    if (/^\s*\(/.test(after)) return wrap("function", token);
    return escapeHtml(token);
  }

  function highlightJava(source) {
    let html = "";
    let lastIndex = 0;
    String(source).replace(tokenPattern, (token, offset) => {
      html += escapeHtml(String(source).slice(lastIndex, offset));
      html += classify(token, String(source), offset);
      lastIndex = offset + token.length;
      return token;
    });
    html += escapeHtml(String(source).slice(lastIndex));
    return html;
  }

  window.Prism = {
    highlightElement(element) {
      if (!element) return;
      element.innerHTML = highlightJava(element.textContent || "");
    }
  };
})();
