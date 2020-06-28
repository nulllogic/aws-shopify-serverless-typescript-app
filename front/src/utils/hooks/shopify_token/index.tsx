import React, {useState, useEffect} from "react";
import * as qs from "query-string";

/** Utils */
import {USER_AUTH_KEY} from "../../local-storage";

const useShopifyToken = () => {

    let _shopifyToken = '';

    console.log(window.location.search);

    if(localStorage.getItem(USER_AUTH_KEY)) {
        _shopifyToken = localStorage.getItem(USER_AUTH_KEY).toString();
    }

    const [loading, setLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string>(_shopifyToken);

    const parsedURL = qs.parse(window.location.search);

    useEffect(() => {

        // If token is not set
        if (!token) {

            fetch('//####.execute-api.####.amazonaws.com/prod/token', { // change endpoint here
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shop: !process.env.development ? parsedURL.shop : 'demo-d1.myshopify.com'
                })
            })
                .then(response => response.json())
                .then(response => {

                    if (response.redirect) {
                        window.location.replace('https://####.execute-api.####.amazonaws.com/prod' + window.location.search); // Change endpoint here
                    }

                    if (response.token) {
                        window.localStorage.setItem(
                            USER_AUTH_KEY,
                            response.token.toString()
                        );
                        setToken(response.token);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            setLoading(false);
        }

    }, [loading, token]);

    return {
        loading,
        token
    };
};

export default useShopifyToken;