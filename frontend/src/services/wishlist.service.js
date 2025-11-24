import http from "../http-common";

function getWishlist(userId) {
    return http.get(`/wishlist/${userId}`);
}

function addToWishlist(productId, userId, comment = null) {
    const data = {
        product_id: productId,
        user_id: userId,
        comment: comment
    };
    return http.post("/addToWishlist", data);
}

function removeFromWishlist(productId, userId) {
    const data = {
        product_id: productId,
        user_id: userId
    };
    return http.post("/removeFromWishlist", data);
}

export default {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
