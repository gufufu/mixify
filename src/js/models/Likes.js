export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, alcoholic, thumb) {
        const like ={id, title, alcoholic, thumb};
        this.likes.push(like);
        // Persist data in localStorage
        this.persistData();
        //Return results
        return like;
    }

    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id)
        this.likes.splice(index, 1);
        // Persist data in localStorage
        this.persistData();
    }

    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumbLikes() {
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('Likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
};