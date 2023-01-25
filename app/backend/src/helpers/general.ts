const isValidEmail = (inputEmail: string) => String(inputEmail)
  .toLowerCase().match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/);

export default isValidEmail;
