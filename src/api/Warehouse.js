import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'

export const warehouse = async () => {
    try {
        const response = await API.get(EndPoints.WAREHOUSE)
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}
