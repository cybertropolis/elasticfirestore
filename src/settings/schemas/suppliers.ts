import { Path } from '../../path';

export const suppliers: Path = {
    index: 'suppliers',
    type: 'suppliers',
    path: 'suppliers',

    fields: ['picture', 'cnpj', 'fantasyName'],

    warmers: {},

    aliases: {
        suppliers: {}
    },

    mappings: {
        suppliers: {
            properties: {
                picture: {
                    type: 'object',
                    properties: {
                        path: {
                            type: 'text',
                        },
                        url: {
                            type: 'text'
                        }
                    }
                },
                cnpj: {
                    type: 'text',
                    fields: {
                        cnpj: {
                            type: 'text'
                        },
                        raw: {
                            type: 'text'
                        },
                        sort: {
                            type: 'text',
                            fielddata: true,
                            analyzer: 'without_space'
                        }
                    }
                },
                fantasyName: {
                    type: 'text',
                    fields: {
                        fantasyName: {
                            type: 'text'
                        },
                        raw: {
                            type: 'text'
                        },
                        sort: {
                            type: 'text',
                            fielddata: true,
                            analyzer: 'without_space'
                        }
                    }
                }
            }
        }
    },

    settings: {
        analysis: {
            analyzer: {
                without_space: {
                    filter: [
                        'lowercase',
                        'whitespace_remove',
                        'asciifolding'
                    ],
                    type: 'custom',
                    tokenizer: 'keyword'
                }
            },
            filter: {
                whitespace_remove: {
                    type: 'pattern_replace',
                    pattern: ' ',
                    replacement: ''
                }
            }
        }
    },
}
