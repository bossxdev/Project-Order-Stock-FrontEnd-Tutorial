import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import ShelfPage from "components/shelf";

export default function Shelf() {
    const router = useRouter();
    const { warehouseId } = router.query;

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login'); // Redirect to login page if not authenticated
        }
    }, []);

    return (
        <>
            {warehouseId && <ShelfPage warehouseId={warehouseId} />}
        </>
    );
}
