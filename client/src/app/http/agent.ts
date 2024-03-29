import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
import router from "../router/Router";

interface ErrorResponseData {
    data: {
        title: string;
        status: number;
        errors?: any;
    };
    status: number;
}

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true; // needed to attach cookies

const responseBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.request.use((config) => {
    const token = store.getState().account.user?.token;
    if (token) {
        config.headers!.Authorization = `Bearer ${token}`; // should insist with the ! that the config.headers will exist (as we create it now)
    }

    return config;
});

// we use interceptors to handle the error better
// we use interceptors to take the response header information here
axios.interceptors.response.use(
    async (response) => {
        // if (process.env.NODE_ENV === "development") await sleep();
        if (import.meta.env.DEV) await sleep();
        // attention! when extracting data from headers Axios is working only with lower case, so use "pagination" (not "Pagination")
        const pagination = response.headers["pagination"];
        if (pagination) {
            response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        }
        return response; // onFulfilled (of Axios) if status in the range of 200
    },
    (error: AxiosError) => {
        // console.log("caught by interceptor") // onRejected
        const { data, status } = error.response as ErrorResponseData; // or without interface do error.response as any
        switch (status) {
            case 400:
                if (data.errors) {
                    const modelStateErrors: string[] = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modelStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modelStateErrors.flat(); // we stop execution up to here
                }
                toast.error(data.title);
                break;
            case 401:
                toast.error(data.title);
                break;
            case 403:
                toast.error("You are not allowed to do that!");
                break;
            case 404:
                router.navigate("/notFound", { state: { error: data } });
                break;
            case 500:
                router.navigate("/server-error", { state: { error: data } });
                break;
            default:
                break;
        }
        return Promise.reject(error.response);
    }
);

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    postForm: (url: string, data: FormData) =>
        axios.post(url, data, { headers: { "Content-type": "multipart/form-data" } }).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    putForm: (url: string, data: FormData) =>
        axios.put(url, data, { headers: { "Content-type": "multipart/form-data" } }).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
};

//helper function to transform to FormData the received object
function createFormData(item: any) {
    const formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key]);
    }
    return formData;
}

const Admin = {
    createProduct: (product: any) => requests.postForm("products", createFormData(product)),
    updateProduct: (product: any) => requests.putForm("products", createFormData(product)),
    deleteProduct: (id: number) => requests.delete(`products/${id}`),
};

const Catalog = {
    list: (params: URLSearchParams) => requests.get("products", params),
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
    addItem: (productId: number, quantity = 1) =>
        requests.post(`Basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) =>
        requests.delete(`Basket?productId=${productId}&quantity=${quantity}`),
};

const Account = {
    login: (values: any) => requests.post("Account/login", values),
    register: (values: any) => requests.post("Account/register", values),
    currentUser: () => requests.get("Account/currentUser"),
    savedAddress: () => requests.get("Account/savedAddress"),
};

const Orders = {
    list: () => requests.get("Order"),
    fetch: (id: number) => requests.get(`Order/${id}`),
    create: (values: any) => requests.post(`Order`, values),
};

// connection with API in regards with Stripe
const Payments = {
    createPaymentIntent: () => requests.post("Payments", {}),
};

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments,
    Admin,
};

export default agent;
