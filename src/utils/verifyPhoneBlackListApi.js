async function verifyPhoneBlackListApi(phone, token) {
    return await fetch(validateBlackList, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({cellphone: phone, token: token})
    });
}
