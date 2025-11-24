import http from "../http-common";

function getCart(userId) {
    return http.get(`/getCart/${userId}`);
}

function addToCart(productId, userId) {
    const data = {
        product_id: productId,
        user_id: userId
    };
    return http.post("/addProductToCart", data);
}

function removeFromCart(productId, userId) {
    const data = {
        product_id: productId,
        user_id: userId
    };
    return http.post("/deleteProductFromCart", data);
}

function checkout(userId) {
    const data = { user_id: userId };
    return http.post(`/checkout`, data);
}

const exportedObject = {
    getCart,
    addToCart,
    removeFromCart,
    checkout: checkout
};

export default exportedObject;
