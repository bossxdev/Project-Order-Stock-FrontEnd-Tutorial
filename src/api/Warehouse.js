import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'
import { HTTP_STATUS_CODE } from 'utils/constants'

export const warehouse = async (data) => {
    try {
        const response = await API.get(EndPoints.WAREHOUSE)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}
