async function send2ftaCode(sendTfaCode, phone, sid, secretKey, from) {
    return await fetch(sendTfaCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({cellphone: phone, sid: sid, secretKey: secretKey, from: from})
    });
}
