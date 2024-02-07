async function getConfigurationByTokenId() {
    return await fetch(getConfig, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });
}
