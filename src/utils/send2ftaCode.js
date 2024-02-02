async function send2ftaCode(sendTfaCode, phone) {
    showLoading()
    await fetch(sendTfaCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({cellphone: phone})
    });
    hideLoading()
}
