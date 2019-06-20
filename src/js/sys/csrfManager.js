/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
/**
 * CSRF is an attack that tricks the victim into submitting a malicious request
 *
 * Cross-Site Request Forgery (CSRF) in simple words
 *
 * Assume you are currently logged into your online banking at www.my-bank.com
 * 1- Assume a money transfer from my-bank.com will result in a request of (conceptually) the
 *    form http://www.mybank.com/transfer?to=<Some-Account-Number>;amount=<SomeAmount>.
 *    (Your account number is not needed, because it is implied by your login.)
 * 2- You visit www.cute-cat-pictures.org, not knowing that it is a malicious site.
 *    If the owner of that site knows the form of the above request (easy!) and correctly
 *    guesses you are logged into my-bank.com (requires some luck!), they could include on their
 *    page a request like http://www.mybank.com/transfer?to=123456;amount=10000
 *    (where 123456 is the number of their Cayman Islands account and 10000 is an amount that
 *    you previously thought you were glad to possess).
 *    You retrieved that www.cute-cat-pictures.org page, so your browser will make that request.
 *    Your bank cannot recognize this origin of the request: Your web browser will send the request
 *    along with your www.my-bank.com cookie and it will look perfectly legitimate.
 *    There goes your money!
 *
 * Now for the better one with CSRF tokens:
 * 1- The transfer request is extended with a third argument:
 *    http://www.mybank.com/transfer?to=123456;amount=10000;token=31415926535897932384626433832795028841971.
 * 2- That token is a huge, impossible-to-guess random number that my-bank.com will
 *    include on their own web page when they serve it to you. It is different each
 *    time they serve any page to anybody.
 *    The attacker is not able to guess the token, is not able to convince your web browser to
 *    surrender it (if the browser works correctly...), and so the attacker will
 *    not be able to create a valid request, because requests with the wrong token
 *    (or no token) will be refused by www.my-bank.com.
 */
import { unescape } from './stringEscaping';

let currentToken = null;

function getToken() {
  if (!currentToken) {
    const tokenScript = document.getElementById('csrf');
    if (tokenScript) {
      currentToken = JSON.parse(unescape(tokenScript.innerHTML));
    }
  }
  return currentToken;
}

export default getToken;
