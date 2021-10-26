"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);

/***
 *  Shows Submit form on click
 */
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
$submitClick.on("click", navSubmitClick);

/***
 * Shows favorited stories on click
 */
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  viewFavoriteStories();
}
$favoritesNavClick.on("click", navFavoritesClick);

/***
 *  Shows my stories on click
 */
function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  viewMyStories();
  $ownStories.show();
}
$myStoriesClick.on("click", navMyStoriesClick);

/***
 * Show user details on click
 */
function showUserDetailsClick(evt) {
  console.debug("showUserDetailsClick");
  hidePageComponents();
  $viewUserDetails.show();
}
$navUserProfile.on("click", showUserDetailsClick);

/***
 *  Show login/signup on click on "login"
 */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/***
 *  When a user first logins in, update the navbar to reflect that.
 */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  hidePageComponents();
  putStoriesOnPage();
  $navLogin.hide();
  $loginForm.hide();
  $signupForm.hide();
  $navLogOut.show();
  $navLeft.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
