import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'
import { HTTP_STATUS_CODE } from 'utils/constants'

export const exports = async (data) => {
    try {
        const response = await API.get(EndPoints.EXPORT)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const exportsById = async (id) => {
    try {
        const response = await API.get(EndPoints.EXPORT + '/exportByWarehouseId/' + id)
        return response.data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const createExports = async (data) => {
    try {
        const response = await API.post(EndPoints.EXPORT)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}
