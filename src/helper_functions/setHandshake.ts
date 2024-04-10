interface HandshakeData {
    session?: string
    policyNumber?: string
    handshakeError?: string
}

export const setHandshake = async (userId: string, authorization: string): Promise<HandshakeData> => {
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
            return { handshakeError: responseData.message } as HandshakeData
        }
        const { data: { session, policyNumber } } = responseData

        // Store Session and PolicyNumber to database here

        return { session, policyNumber } as HandshakeData

    } catch (e) {
        return { handshakeError: e } as HandshakeData
    }
}