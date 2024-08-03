import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import ExportPage from "components/export"

export default function Shelf() {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login'); // Redirect to login page if not authenticated
        }
    }, []);

    return (
        <>
            <ExportPage/>
        </>
    );
}