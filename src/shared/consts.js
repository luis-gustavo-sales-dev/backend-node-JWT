module.exports = {
  regexs: {
    emailRegex: /\S+@\S+\.\S+/,
    passwordRegex: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/
  },
  tokenExpirationTimeInDays: 1,
  tokenExpirationTime: '1 day' // 60 seconds, 1 day, 2 days...
}