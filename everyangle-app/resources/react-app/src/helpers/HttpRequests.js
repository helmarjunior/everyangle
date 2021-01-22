import axios from "axios";
import { toast } from "react-toastify";

const API_HOST = "http://localhost:8000/api";

export function postRequest(endpoint, params, cb_function, cb_data, is_media) {
    let header = {};
    if (is_media) {
        header = { "Content-type": "multipart/form-data" };
    }

    return axios({
        method: "POST",
        timeout: 20000,
        responseType: "json",
        url: API_HOST + endpoint,
        headers: header,
        data: params,
    })
        .then((response) => {
            if (cb_function && typeof cb_function === "function") {
                cb_function(cb_data, response.data);
            }
        })
        .catch((error) => {
            const resp =
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : null;
            toast.error(
                resp
                    ? resp
                    : "it wasn't possible to complete the action, please try it again.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                }
            );
            if (cb_function && typeof cb_function === "function") {
                cb_function(cb_data, null);
            }
        })
        .finally(() => {});
}

export function putRequest(endpoint, params, cb_function, cb_data) {
    return axios({
        method: "PUT",
        timeout: 20000,
        responseType: "json",
        url: API_HOST + endpoint,
        data: params,
    })
        .then((response) => {
            if (cb_function && typeof cb_function === "function") {
                cb_function(cb_data, response.data);
            }
        })
        .catch((error) => {
            const resp =
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : null;
            toast.error(
                resp
                    ? resp
                    : "it wasn't possible to complete the action, please try it again.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                }
            );
            if (cb_function && typeof cb_function === "function") {
                cb_function(cb_data, null);
            }
        })
        .finally(() => {});
}

export function deleteRequest(endpoint, params, cb_function, cb_data) {
    return axios({
        method: "DELETE",
        timeout: 20000,
        responseType: "json",
        url: API_HOST + endpoint,
        data: params,
    })
        .then((response) => {
            if (cb_function && typeof cb_function === "function") {
                cb_function(cb_data, response.data);
            }
        })
        .catch((error) => {
            const resp =
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : null;
            toast.error(
                resp
                    ? resp
                    : "it wasn't possible to complete the action, please try it again.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                }
            );
            if (cb_function && typeof cb_function === "function") {
                cb_function(cb_data, null);
            }
        })
        .finally(() => {});
}
export function getRequest(endpoint, params, cb_function, cb_data) {
    let config = {
        params: params,
    };

    return axios
        .get(API_HOST + endpoint, config)
        .then((response) => {
            if (cb_function && typeof cb_function === "function") {
                cb_function(cb_data, response.data);
            }
        })
        .catch((error) => {
            const resp =
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : null;
            toast.error(
                resp
                    ? resp
                    : "it wasn't possible to complete the action, please try it again.",
                {
                    position: toast.POSITION.TOP_RIGHT,
                }
            );
        })
        .finally(() => {});
}
