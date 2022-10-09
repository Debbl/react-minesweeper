const BASE_URL = "https://aiwan-game-api.netlify.app";

class Request {
  get<T>(path: string) {
    return new Promise<T>((resolve, reject) => {
      fetch(BASE_URL + path, { method: "GET" })
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  post<T>(path: string, data: any) {
    return new Promise<T>((resolve, reject) => {
      fetch(BASE_URL + path, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
}
export default new Request();
