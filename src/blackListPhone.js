async function blackListPhone(tfaTwilio, blackList, phoneInputId, validateBlackList, saveOnSubmit, event) {
    if (blackList && phoneInputId) {
        const phone = document.getElementById(phoneInputId).value;
        if (phone) {
            showLoading()
            await validatePhoneInBlackList(tfaTwilio, blackList, phone, saveOnSubmit, event)
            hideLoading()
        } else {
            showPhoneInvalidModal()
        }
    }
}

async function validatePhoneInBlackList(tfaTwilio, validateBlackList, phone, saveOnSubmit, event) {
    const token = "j57dmdn2y67071g22fs41v5c5s6hm3ct";
    const verifyPhone = await verifyPhoneBlackListApi(phone, token);
    const verify = await verifyPhone.json();
    if (verify.valid === true && verify.showTfa === true) {
        await phoneInformationModal(phone, event)
    } else if (verify.valid === false && verify.showTfa === true) {
        await phoneInformationModal(phone, event)
    } else if (verify.valid === true && verify.showTfa === false) {
        await saveRecording(saveOnSubmit, event)
    }
}
