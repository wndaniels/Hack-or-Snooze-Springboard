"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showFav = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      ${showFav ? createFavIcon(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        ${showDelete ? createDeleteIcon() : ""}
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/***
 * Created delete icon for created stories
 */
function createDeleteIcon() {
  return `<span class="delete">
            <i class="fas fa-trash-alt"></i>
          </span>`;
}

/***
 * Creates favorite icon for favorited stories
 */
function createFavIcon(story, user) {
  const favStory = user.favStory(story);
  const favType = favStory ? "fas" : "far";
  return `<span class="flag">
            <i class="${favType} fa-flag"></i>
          </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/***
 * When Delete Icon is clicked, the users story associated to the click will be removed from $ownStories, and the StoryList over all.
 */

async function deleteStoryClick(evt) {
  console.debug("deleteStoryClick");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.deleteStory(currentUser, storyId);
  await viewMyStories();
}
$ownStories.on("click", ".delete", deleteStoryClick);

/** Submit new story to page upon submission of story cridentials */
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const author = $("#author-input").val();
  const title = $("#title-input").val();
  const url = $("#url-input").val();
  const username = currentUser.username;
  const storyData = { author, title, url, username };
  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

/***
 * When clicking $myStoriesClick the page will render only stories submitted by the user.
 * If no stories are submitted by user "No Stories Created Yet!" will appear.
 */
function viewMyStories() {
  console.debug("viewMyStories");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h4>No Stories Created Yet!</h4>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

/***
 * When clicking $favoritesNavClick the page will render only stories favorited by the user.
 * If no stories are favorited by user "No Favorites Added!" will appear.
 */
function viewFavoriteStories(evt) {
  console.debug("viewFavoriteStories");
  $favoriteStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStories.append("<h4>No Favorites Added!</h4>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}

/***
 * When Favorite Icon is clicked, the status of the icon is changes to the oposite of its current state to the story associated.
 */
async function favoriteStoriesClicked(evt) {
  console.debug("favoriteStoriesClicked");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}
$storiesList.on("click", ".flag", favoriteStoriesClicked);
