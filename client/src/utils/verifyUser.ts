import { client } from "./client";

export const isLogin = () => {
  const loginToken = localStorage.getItem("token");
  if (loginToken) {
    return loginToken;
  }
  return null;
};

export const getCartFromApi = async (
  route: string,
  body: Object,
  config?: Object
) => {
  const data = await client.post(route, body);
  return data;
};

export const getCart = async () => {
  const loginToken = isLogin();
  if (loginToken) {
    const data = await getCartFromApi(
      "/api/carts/activeCart",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
      }

      //   {
      //   user: user._id,
      // }
    );
    return data;
  }
  const cartId = localStorage.getItem("cartId");

  const data = await getCartFromApi("/api/carts/activeCart", {
    cartId: cartId,
  });
  return data;
};
