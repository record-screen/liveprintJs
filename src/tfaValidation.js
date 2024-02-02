async function tfaValidation(tfaTwilio, phoneInputId, sendTfaCode, validateTfCode, saveOnSubmit, event) {
    if (tfaTwilio && phoneInputId) {
        const phone = document.getElementById(phoneInputId).value;
        if (phone) {
            showLoading()
            phoneInformationModal(phone, event)
            hideLoading()
           } else {
               serverError()
           }
        } else {
           showPhoneInvalidModal()
        }
}

function showPhoneInvalidModal() {
    const phoneInvalid = document.createElement("dialog");
    phoneInvalid.id = "invalidPhone";
    phoneInvalid.classList.add("dialog-styles");
    phoneInvalid.innerHTML = `
                <button class="x" id="closePhoneModal">X</button>
                <h5>Invalid Phone</h5>
                <p>Please enter a valid phone number</p>
`;
    document.body.appendChild(phoneInvalid);

    const phoneInvalidDialog = document.getElementById("invalidPhone");
    phoneInvalidDialog.showModal();

    const closeModalPhone = document.getElementById("closePhoneModal");
    closeModalPhone.addEventListener("click", () => {
        phoneInvalidDialog.close();
    });
}

async function showTfaModal(phone, event) {
    const tfaDialog = document.createElement("dialog");
    tfaDialog.id = "tfaTwilio";
    tfaDialog.classList.add("dialog-styles");
    tfaDialog.innerHTML = `
                <button class="x" id="closeBtn">X</button>
                <h5>Two-Factor Authetication</h5>
                <p>Enter the code sent to your authentication method or provide a backup code.</p>
                <b>5-digits code</b>
                <input type="text" id="code" style="padding: 10px">
                <p id="errorText" style="color: red;"></p>
                <p id="sendAnother" style="color: cornflowerblue; cursor: pointer;">Resend Code</p>
                <button id="sendBtn" type="submit" style="background: #0b5ed7; color: white;">Verify</button>
                <button id="closeTfa" style="margin-right: 10px">Close</button>
                            `;
    document.body.appendChild(tfaDialog);

    // showLoading()
    // await send2ftaCode(sendTfaCode, phone)
    // hideLoading()

    const tfaModal = document.getElementById("tfaTwilio");
    tfaModal.showModal();

    const closeTfaDialog = document.getElementById("closeBtn");
    closeTfaDialog.addEventListener("click", () => {
        tfaModal.close();
    });

    const closeTfa = document.getElementById("closeTfa");
    closeTfa.addEventListener("click", () => {
        tfaModal.close();
    });

    verifyTfaCode(phone, event)
}

function verifyTfaCode(phone, event) {
    const sendAnotherLink = document.getElementById("sendAnother");
    sendAnotherLink.addEventListener("click", async () => {
        await send2ftaCode(sendTfaCode, phone)
        console.log('Code resent');
    });

    const sendBtn = document.getElementById("sendBtn");
    sendBtn.addEventListener("click", async () => {
        sendBtn.innerText = "Verifying...";
        const errorText = document.getElementById("errorText");

        const code = document.getElementById("code").value;
        const codeValid = await validate2faCode(validateTfCode, code, phone)
        console.log(codeValid)
        if (codeValid.ok === true) {
            console.log('formproof#onSubmit');
            if (saveOnSubmit) {
                await saveRecording(saveOnSubmit, event)
            }
        } else if (codeValid.status === 409) {
            ftaCodeUsed()
            sendBtn.innerText = "Verify";
        } else if (codeValid.status === 404) {
            errorText.textContent = "Invalid code. Please try again."
            sendBtn.innerText = "Verify";
        } else {
            serverError()
            sendBtn.innerText = "Verify";
        }
    })
}

function showLoading() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loadingIndicator';
    loadingIndicator.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingIndicator);
}

function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

function ftaCodeUsed() {
    const codeUsed = document.createElement("dialog");
    codeUsed.id = "ftaUVerified";
    codeUsed.classList.add("dialog-styles");
    codeUsed.innerHTML = `
        <button class="x" id="closeFtaUsed">X</button>
        <h5>Fta Code Verified</h5>
        <p>This fta code has already been verified, check and try again.</p>
    `;
    document.body.appendChild(codeUsed);

    const ftaUVerified = document.getElementById("ftaUVerified");
    ftaUVerified.showModal();

    const closeFtaUVerified = document.getElementById("closeFtaUsed");
    closeFtaUVerified.addEventListener("click", () => {
        ftaUVerified.close();
    });
}

function serverError() {
    const ftaCodeError = document.createElement("dialog");
    ftaCodeError.id = "ftaCodeError";
    ftaCodeError.classList.add("dialog-styles");
    ftaCodeError.innerHTML = `
        <button class="x" id="closeFtaError">X</button>
        <h5>Internal Server Error</h5>
        <p>An unexpected error has occurred, please try again later</p>
    `;
    document.body.appendChild(ftaCodeError);

    const ftaError = document.getElementById("ftaCodeError");
    ftaError.showModal();

    const closeFtaError = document.getElementById("closeFtaError");
    closeFtaError.addEventListener("click", () => {
        ftaError.close();
    })
}

function phoneInformationModal(phone, event){
    const informationPhone = document.createElement("dialog");
    informationPhone.id = "phoneInfo";
    informationPhone.classList.add("dialog-styles");
    informationPhone.innerHTML = `
        <button class="x" id="closeInfoPhone">X</button>
        <p>We need to validate your identity, we will send a validation code to the following cell phone number</p>
        <b id="cellphone" style=""></b>
        <button id="showTfa" style="background: #0b5ed7; color: white;">Continue</button>
        <button id="closePhone" style="margin-right: 10px">Close</button>
    `;
    document.body.appendChild(informationPhone);

    document.getElementById('cellphone').textContent = phone;
    document.getElementById('cellphone').style.fontSize = '28px';

    const phoneInfo = document.getElementById("phoneInfo");
    phoneInfo.showModal();

    const closePhoneInfo = document.getElementById("closeInfoPhone");
    closePhoneInfo.addEventListener("click", () => {
        phoneInfo.close();
    })

    const show2fa = document.getElementById("showTfa");
    show2fa.addEventListener("click",  async () => {
        showLoading()
        await send2ftaCode(sendTfaCode, phone)
        hideLoading()
        await showTfaModal(phone, event)
    })

    const closePhoneModal = document.getElementById("closePhone");
    closePhoneModal.addEventListener("click", () => {
        phoneInfo.close();
    });
}
