import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import WarehousePage from "components/warehouse";

export default function Warehouse() {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login'); // Redirect to login page if not authenticated
        }
    }, []);

    return (
        <>
            <WarehousePage/>
        </>
    );
}
