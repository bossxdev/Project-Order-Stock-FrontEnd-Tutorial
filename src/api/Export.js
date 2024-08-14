import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'
import { HTTP_STATUS_CODE } from 'utils/constants'

export const exports = async () => {
    try {
        const response = await API.get(EndPoints.EXPORT)
        return response.data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const createExports = async (data) => {
    try {
        const response = await API.post(EndPoints.EXPORT + '/create-export', data)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}
