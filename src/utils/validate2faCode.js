async function validate2faCode(validateTfCode, code, phone) {
    return await fetch(validateTfCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({code: code, cellphone: phone})
    });
}
