// const localhost = "http://192.168.8.100:8000";
const localhost = "http://192.168.43.202:8000";

const apiURL = "/api/v1";

export const endpoint = `${localhost}${apiURL}`;

export const authurl = `${endpoint}/accounts`;
export const quizurl = `${endpoint}/quiz`;

// export const authurl = `${endpoint}/users/rest-auth`;
// export const productListURL = `${endpoint}/products/`;
// export const productDetailURL = (uuid) => `${endpoint}/products/${uuid}/`;
// export const addToCartURL = `${endpoint}/products/add-to-cart/`;
