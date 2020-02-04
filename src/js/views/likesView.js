import { elements } from "./base";
import { limitDrinkTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
  document.querySelector(".recipe__love use").setAttribute("href", `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
};

export const renderLikes = like => {
  const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.thumb}" alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitDrinkTitle(like.title)}</h4>
                <p class="likes__author">${like.alcoholic}</p>
            </div>
        </a>
    </li>
    `;
  elements.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = id => {
  const el = document
    .querySelector(`.likes__link[href="#${id}"]`).parentElement;
  if (el) el.parentElement.removeChild(el);
};
