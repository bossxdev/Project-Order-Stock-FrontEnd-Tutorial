import API from 'api/Http'
import * as EndPoints from 'api/EndPoints'

export const shelf = async () => {
    try {
        const response = await API.get(EndPoints.SHELF)
        return response.data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

export const shelfById = async (id) => {
    try {
        const response = await API.get(EndPoints.SHELF + '/shelfById/' + id)
        return response.data;
    } catch (err) {
        console.log(err);
        return err;
    }
}
