import { Path } from '../../path';

export const products: Path = {
    index: 'products',
    type: 'products',
    path: 'products',

    fields: ['picture', 'name'],

    warmers: {},

    aliases: {
        products: {}
    },

    mappings: {
        products: {
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
                name: {
                    type: 'text',
                    fields: {
                        name: {
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
