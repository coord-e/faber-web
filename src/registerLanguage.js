export function registerFaber(monaco) {
  monaco.languages.register({ id: 'faber' });

  monaco.languages.setLanguageConfiguration('faber', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '(', close: ')' },
    ],
    surroundingPairs: [
      { open: '(', close: ')' },
    ],
  });

  monaco.languages.setMonarchTokensProvider('faber', {
    defaultToken: '',
    keywords: [
      'name',
      'type',
      'forall',
      'match',
      'with',
      'let',
      'in',
      'where',
      'if',
      'then',
      'else',
    ],
    operators: [
      '=', '==', '+', '-', '*'
    ],
    symbols:  /[=><!~?:&|+\-*/^%]+/,
    brackets: [
      { token: 'delimiter.parenthesis', open: '(', close: ')' },
	  ],
	  tokenizer: {
		  root: [
        { include: '@whitespace' },
			  { include: '@comment' },

        // capital identifiers are conventionally type names
        [/[A-Z][\w$]*/, 'type.identifier' ],
        // show ctor pattern nicely
        [/#[\w$]*/, 'type.identifier' ],

        [/[a-zA-Z_]\w*/, {
				  cases: {
					  '@keywords': { token: 'keyword.$0' },
					  '@default': 'identifier'
				  }
			  }],

        [/[()]/, '@brackets'],

        [/::/, 'annotation'],
        [/^\s*-/, 'delimiter'],
        [/[,|]/, 'delimiter'],

        [/->/, 'keyword'],
        [/=>/, 'keyword'],

        [/@symbols/, { cases: { '@operators': 'delimiter',
                                '@default'  : '' } } ],
			  [/\d+/, 'number'],
		  ],
      whitespace: [
			  [/[ \t\r\n]+/, 'white']
		  ],
		  comment: [
			  [/\/\/.*$/, 'comment'],
			  [/\/\*.*\*\//, 'comment'],
		  ],
	  }
  });
}
