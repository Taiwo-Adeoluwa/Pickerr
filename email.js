const emailTemplate = (name, otp) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>your otp?</title>
    <style>
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.main-section {
    width: 50%;
    height: 100%;
    background-color: grey;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 10px;
    gap: 10px;
}
.upper-div {
    width: 100%;
    height: 30%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    
}
.upper-div-1 {
    width: 100%;
    height: 30%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;

    p {
        align-self: center;
    }
}
.upper-div-2 {
    width: 50%;
    height: 30%;
    background-color: rgb(207, 182, 182);
    display: flex;
    justify-content: center;
    align-items: center;
}
.upper-div-3 {
    width: 100%;
    height: 30%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;

    p {
        align-self: center;
    }

}
.downer-div {
     width: 100%;
    height: 30%;
    background-color: white;   
}
    </style>
<body>
    <div class="main-section">
        <div class="upper-div">
            <div class="upper-div-1">
                <h1>Email OTP Verification</h1>
                <h3>Hello, ${name}</h3>
                <p>Below is your one time passcode that you need to use to complete your authentication. The verification code will be valid for 30 minutes. Please do not share this code with anyone.</p>
            </div>
            <div class="upper-div-2">
                <h2> ${otp} </h2>
            </div>
            <div class="upper-div-3">
                <p>If you are having any issues with your account, please don't hesitate to contact us.</p>
                <p>Enjoy the fastest & most secure way to buy Airtime, Mobile Data & to pay Bills.</p>
            </div>
        </div>
        <div class="downer-div">
            <p>If you would like to know more about our services, please also refer to Helpcenter</p>
            <p>Pickerr Team</p>
        </div>
    </div>
</body>
</html>
    `
}

module.exports = emailTemplate