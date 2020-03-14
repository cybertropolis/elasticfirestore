import { Path } from '../../path';

export const outputs: Path = {
    index: 'outputs',
    type: 'outputs',
    path: 'outputs',

    fields: ['description', 'totalValue', 'date', 'quantity'],

    warmers: {},

    aliases: {
        outputs: {}
    },

    mappings: {
        outputs: {
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
                totalValue: {
                    type: 'long'
                },
                date: {
                    type: 'date'
                },
                quantity: {
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
