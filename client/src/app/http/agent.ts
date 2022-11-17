import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

interface ErrorResponseData {
    data: {
        title: string;
        status: number;
        errors?: any;
    };
    status: number;
}

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true; // needed to attach cookies

const responseBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));


// we use interceptors to handle the error better
axios.interceptors.response.use(
    async (response) => {
        await sleep();
        return response; // onFulfilled (of Axios) if status in the range of 200
    },
    (error: AxiosError) => {
        // console.log("caught by interceptor") // onRejected
        const { data, status } = error.response as ErrorResponseData; // or without interface do error.response as any
        switch (status) {
            case 400:
                if (data.errors) {
                    const modelStateErrors: string[] = [];
                    for (const key in data.errors){
                        if (data.errors[key]) {
                            modelStateErrors.push(data.errors[key])
                        }
                    }
                    throw modelStateErrors.flat(); // we stop execution up to here
                }
                toast.error(data.title);
                break;
            case 401:
                toast.error(data.title);
                break;
            case 404:
                history.push('/notFound', { error: data });
                break;
            case 500:
                history.push('/server-error', { error: data });
                break;
            default:
                break;
        }
        return Promise.reject(error.response);
    }
);

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url).then(responseBody),
    put: (url: string, body: {}) => axios.put(url).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
    list: () => requests.get("products"),
    details: (id: number) => requests.get(`products/${id}`),
    filters: () => requests.get("products/filters"),
};

const TestErrors = {
    get400Error: () => requests.get("Buggy/bad-request"),
    get401Error: () => requests.get("Buggy/unauthorized"),
    get404Error: () => requests.get("Buggy/not-found"),
    get500Error: () => requests.get("Buggy/server-error"),
    getValidationError: () => requests.get("Buggy/validation-error"),
};

const Basket = {
    getBasket: () => requests.get("Basket"),
    addItem: (productId: number, quantity = 1) => requests.post(`Basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`Basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
};

export default agent;
