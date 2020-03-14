import { Path } from '../../path';

export const storages: Path = {
    index: 'storages',
    type: 'storages',
    path: 'storages',

    fields: ['description', 'repositories'],

    warmers: {},

    aliases: {
        storages: {}
    },

    mappings: {
        storages: {
            properties: {
                description: {
                    type: 'text',
                    fields: {
                        description: {
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
                repositories: {
                    type: 'long'
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
