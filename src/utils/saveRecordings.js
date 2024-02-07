async function saveRecordings(formProofApiSave, dataSubmit) {
    return await fetch(formProofApiSave, {
        method: 'POST',
        body: JSON.stringify(dataSubmit),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
