import { jwtDecode } from "jwt-decode";

type userLoginType = {
    username: string,
    password: string,
}

type JwtPayload = {
    userId?: string
}

interface AuthData {
    userId?: string
    authorization?: string
    authError?: string
}

export const getAuthData = async (user: userLoginType): Promise<AuthData> => {
    try {
        const response = await fetch('https://6dota27wl8.execute-api.us-east-1.amazonaws.com/dev/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const responseData = await response.json();
        const jwtToken = responseData.data?.accessToken

        if (!jwtToken) {
            return { authError: "Authentication failed" } as AuthData
        }

        const decoded: JwtPayload = jwtDecode(jwtToken);

        if (!decoded.userId) {
            return { authError: "User ID missing from decoded JWT" } as AuthData
        }

        return { userId: decoded.userId, authorization: jwtToken } as AuthData

    } catch (e) {
        return { authError: e } as AuthData
    }

}