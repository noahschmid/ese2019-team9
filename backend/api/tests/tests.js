require('./login.js'); //should not be able to login without confirmed email but can if all tests are run at once.
require('./verify.js');
require('./loginWithVerification.js');
require('./userRequest.js'); //have to use the login token and not verificationtoken one test has to fail
//need to make the cleanup