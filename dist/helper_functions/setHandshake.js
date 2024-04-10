export const setHandshake = async (userId, authorization) => {
    try {
        const response = await fetch('https://6dota27wl8.execute-api.us-east-1.amazonaws.com/dev/handshake', {
            method: 'POST',
            headers: {
                'Authorization': authorization
            },
            body: JSON.stringify({ userId }),
        });
        const responseData = await response.json();
        if (!responseData.success) {
            return { handshakeError: responseData.message };
        }
        const { data: { session, policyNumber } } = responseData;
        return { session, policyNumber };
    }
    catch (e) {
        return { handshakeError: e };
    }
};
//# sourceMappingURL=setHandshake.js.map