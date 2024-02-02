async function blackListPhone(tfaTwilio, blackList, phoneInputId, blackList, saveOnSubmit, event) {
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

async function validatePhoneInBlackList(tfaTwilio, blackList, phone, saveOnSubmit, event) {
    const response = await fetch(blackList, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({cellphone: phone})
    });
    if (response.ok) {
        const data = await response.json();
        if (data === true) {
            if (tfaTwilio === 'true' && tfaTwilio === 'false') {
                await showTfaModal(phone, event)
            } else {
                await saveRecording(saveOnSubmit, event)
            }
        } else {
            await showTfaModal(phone, event)
        }
    }
}

// function phoneInBlackList(saveOnSubmit, event) {
//     const phoneInBlackList = document.createElement("dialog");
//     phoneInBlackList.id = "phoneInList";
//     phoneInBlackList.classList.add("dialog-styles");
//     phoneInBlackList.innerHTML = `
//                 <button class="x" id="closeBtn">X</button>
//                 <h5>Black List Verification</h5>
//                 <p>The following number is blacklisted, do you want to continue?</p>
//                 <button id="continueBtn" type="submit" style="background: #0b5ed7; color: white;">Continue</button>
//                 <button id="closePhoneInList" style="margin-right: 10px">Close</button>
//                             `;
//     document.body.appendChild(phoneInBlackList);
//
//     const  phoneInList = document.getElementById("phoneInList");
//     phoneInList.showModal();
//
//     const closePhoneInList = document.getElementById("closeBtn");
//     closePhoneInList.addEventListener("click", () => {
//         phoneInList.close();
//     });
//
//     const closeBlackListModal = document.getElementById("closePhoneInList");
//     closeBlackListModal.addEventListener("click", () => {
//         phoneInList.close();
//     });
//
//     const continueBlackListPhone = document.getElementById("continueBtn");
//     continueBlackListPhone.addEventListener("click", async () => {
//         await saveRecording(saveOnSubmit, event);
//     });
// }
