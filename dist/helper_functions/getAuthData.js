import { jwtDecode } from "jwt-decode";
export const getAuthData = async (user) => {
    try {
        const response = await fetch('https://6dota27wl8.execute-api.us-east-1.amazonaws.com/dev/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        const responseData = await response.json();
        const jwtToken = responseData.data?.accessToken;
        if (!jwtToken) {
            return { authError: "JWT missing from response body" };
        }
        const decoded = jwtDecode(jwtToken);
        if (!decoded.userId) {
            return { authError: "User ID missing from decoded JWT" };
        }
        return { userId: decoded.userId, authorization: jwtToken };
    }
    catch (e) {
        return { authError: e };
    }
};
//# sourceMappingURL=getAuthData.js.map