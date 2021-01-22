
const onServer = !(typeof window !== 'undefined' && window.document);

export function getIfOnServer() {
    return onServer;
}

