export const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/** Check if a token has expired
 * @param userAuth - user auth object
 */
export const checkIfTokenIsValid = (
    // userAuth: CustomTypes.UserAuth,
    // setUnauthStatus: () => void
): boolean => {
    // if (!userAuth || !userAuth.idToken) {
    //     window.localStorage.setItem(
    //         USER_AUTH_KEY,
    //         JSON.stringify(DEFAULT_USER_AUTH)
    //     );
    //     setUnauthStatus();
    //     return false;
    // }
    // try {
    //     // @ts-ignore
    //     const decodedJwt: any = jwtDecode(userAuth.idToken);
    //     if (decodedJwt.exp >= Date.now() / 1000) {
    //         return true;
    //     } else {
    //         window.localStorage.setItem(
    //             USER_AUTH_KEY,
    //             JSON.stringify(DEFAULT_USER_AUTH)
    //         );
    //         setUnauthStatus();
    //         return false;
    //     }
    // } catch (e) {
    //     return false;
    // }
    return true;
};
