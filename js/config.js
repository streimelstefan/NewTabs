const config = {
    searchproviders: [
        {
            name: 'Google',
            searchPrefix: 'https://www.google.com/search?q='
        }
    ],
    commands: [
        {
            key: 'g',
            action: googleAction
        },
        {
            key: 'y',
            action: yahooAction
        },
        {
            key: 'd',
            action: duckduckgoAction
        },
        {
            key: 'b',
            action: bingAction
        },
        {
            key: 'standart',
            action: standardAction
        }
    ]
}