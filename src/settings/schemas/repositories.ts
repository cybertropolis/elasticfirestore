import { Path } from '../../path';

export const repositories: Path = {
    index: 'repositories',
    type: 'repositories',
    path: 'repositories',

    fields: ['description', 'storage', 'unit', 'movements'],

    warmers: {},

    aliases: {
        repositories: {}
    },

    mappings: {
        repositories: {
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
                storage: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'text',
                        },
                        description: {
                            type: 'text'
                        }
                    }
                },
                unit: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'text',
                        },
                        description: {
                            type: 'text'
                        }
                    }
                },
                movements: {
                    type: 'object',
                    properties: {
                        balance: {
                            type: 'long',
                        },
                        availability: {
                            type: 'long'
                        },
                        inputs: {
                            type: 'long'
                        },
                        outputs: {
                            type: 'long'
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
