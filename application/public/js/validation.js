const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

var myInput = document.getElementById("password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");


form.addEventListener('submit', e => {  
    e.preventDefault();
    validateInputs();
    e.currentTarget.submit();
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success')
}

const setSuccess = element => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
};


const isValidEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();


  if (usernameValue.length < 3) {
    setError(username, 'Username must be at least 3 character!');
  } else if (!usernameValue.match(/^\D\w{2,}$/)) {
    setError(username, `Username must being with a letter, \n and contain no Special Characters!`);
  } else {
    setSuccess(username);
  }

  if (emailValue === '') {
    setError(email, 'Email is required!');
  } else if (!isValidEmail(emailValue)) {
    setError(email, 'Provide a valid email address!');
  } else {
    setSuccess(email);
  }


  if (passwordValue === '') {
    setError(password, 'Invalid Password!');
  } else {
    setSuccess(password);
  }

  if (password2Value === '') {
    setError(password2, 'Please confirm your password!');
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match!");
  } else {
    setSuccess(password2);
  }
  return true;
};


// Validate Password! 
myInput.onfocus = function () {
  document.getElementById("message").style.display = "block";
}

myInput.onblur = function () {
  document.getElementById("message").style.display = "none";
}

myInput.onkeyup = function () {
  var lowerCaseLetters = /[a-z]/g;
  if (myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }

  var upperCaseLetters = /[A-Z]/g;
  if (myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  var numbers = /[0-9]/g;
  if (myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  if (myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}