import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'
import { HTTP_STATUS_CODE } from 'utils/constants'

export const products = async (data) => {
    try {
        const response = await API.get(EndPoints.PRODUCT)
        console.log('response: ', response);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const createProducts = async (data) => {
    try {
        const response = await API.post(EndPoints.PRODUCT + '/create-product', data)
        console.log('response: ', response);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}
