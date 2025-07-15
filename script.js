const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-msg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = `~\`!@#$%^&*()_-+={[}]|:;"'<,>.?/`;

let password = "";
let passwordLength = 10;
let checkCount = 0;

// initial setup
handleSlider();
setIndicator("#ccc");
checkBoxListener();

// update slider UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

// indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// random integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// character generators
const generateRandomNumber = () => getRndInteger(0, 10);
const generateLowerCase = () => String.fromCharCode(getRndInteger(97, 123));
const generateUpperCase = () => String.fromCharCode(getRndInteger(65, 91));
const generateSymbol = () => symbols.charAt(getRndInteger(0, symbols.length));

function calcStrength() {
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNum = numbersCheck.checked;
    const hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch {
        copyMsg.innerText = "Failed!";
    }
    copyMsg.classList.add("active");
    setTimeout(() => copyMsg.classList.remove("active"), 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

function handleCheckBoxChange() {
    checkCount = [...allCheckBox].filter(cb => cb.checked).length;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

function checkBoxListener() {
    allCheckBox.forEach(cb => cb.addEventListener("change", handleCheckBoxChange));
}

// events
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
    if (checkCount === 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    const funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining random
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        const randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle
    password = shufflePassword([...password]);
    passwordDisplay.value = password;
    passwordDisplay.classList.add("password-fade");
    setTimeout(() => passwordDisplay.classList.remove("password-fade"), 300);

    calcStrength();
});

// dark mode toggle
const darkModeBtn = document.querySelector("#darkModeBtn");
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
