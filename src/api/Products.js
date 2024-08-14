import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'
import { HTTP_STATUS_CODE } from 'utils/constants'

export const products = async (data) => {
    try {
        const response = await API.get(EndPoints.PRODUCT)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const createProducts = async (data) => {
    try {
        const response = await API.post(EndPoints.PRODUCT + '/create-product', data)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const updateProducts = async (id, data) => {
    try {
        const response = await API.put(EndPoints.PRODUCT + '/update-product/' + id, data)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const productsById = async (id) => {
    try {
        const response = await API.get(EndPoints.PRODUCT + '/productByWarehouseId/' + id)
        return response.data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const deleteProductById = async (id) => {
    try {
        const response = await API.delete(EndPoints.PRODUCT + '/delete-product/' + id);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

