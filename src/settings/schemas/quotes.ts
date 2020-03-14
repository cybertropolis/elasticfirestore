import { Path } from '../../path';

export const quotes: Path = {
    index: 'quotes',
    type: 'quotes',
    path: 'quotes',

    fields: ['name'],

    warmers: {},

    aliases: {
        quotes: {}
    },

    mappings: {
        quotes: {
            properties: {
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
