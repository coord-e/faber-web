export function registerFaber(monaco) {
  monaco.languages.register({ id: 'faber' });

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
	  tokenizer: {
		  root: [
        { include: '@whitespace' },
			  { include: '@comment' },
        [/[a-zA-Z_]\w*/, {
				  cases: {
					  '@keywords': { token: 'keyword.$0' },
					  '@default': 'identifier'
				  }
			  }],
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
