import { jwtDecode } from "jwt-decode";

type userLoginType = {
    username: string,
    password: string,
}

const get_auth_data = async (user: userLoginType) => {
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
            return { authError: 'Authentication failed' }
        }

        type decodedJwtTokenType = { userId: string }
        const decoded: decodedJwtTokenType = jwtDecode(jwtToken);

        return { userId: decoded.userId, authorization: jwtToken }

    } catch (authError) {
        return { authError: 'Authentication failed' }
    }

}


const set_handshake = async (userId: string, authorization: string) => {
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
            return { handshakeError: responseData.message }
        }
        const { data: { session, policyNumber } } = responseData

        return { session, policyNumber }

    } catch (handshakeError) {
        return { handshakeError }
    }
}


const get_policy_data = async (authorization: string, session: string, policyNumber: string) => {

    try {
        const response = await fetch('https://6dota27wl8.execute-api.us-east-1.amazonaws.com/dev/policies', {
            method: 'POST',
            headers: {
                'Authorization': authorization,
                'X-SESSION-ID': session
            },
            body: JSON.stringify({ policyNumber }),
        });

        const responseData = await response.json();

        const policyData = map_incoming_policy_data(responseData.data)

        return { policyData }


    } catch (policyRequestError) {
        return { policyRequestError }
    }
}

const map_incoming_policy_data = (policyData) => {
    // const coverage_name_to_code_mapping = {
    //     'COLLISION': 'COLL',
    //     'COMPREHENSIVE': 'COMP',
    //     'PROPERTY_DAMAGE': 'PD',
    // }
    return {
        type: 'auto',
        carrier: 'mock-carrier',
        policyNumber: policyData.agreement.displayNumber,
        isActive: new Date() < new Date(policyData.agreement.endDate),
        effectiveDate: policyData.agreement.effectiveDate,
        expirationDate: policyData.agreement.endDate,
        address: {
            addressLine1: policyData.agreement.policyAddress.addressLine1,
            addressLine2: policyData.agreement.policyAddress.addressLine2,
            city: policyData.agreement.policyAddress.city,
            state: policyData.agreement.policyAddress.state,
            postalCode: policyData.agreement.policyAddress.postalCode,
            country: policyData.agreement.policyAddress.country
        },
        coverages: policyData.vehicle.coverages,
        properties: policyData.agreement.vehicles.map(vehicle => (
            {
                type: 'vehicle',
                data: {
                    bodyStyle: vehicle.bodyStyle,
                    vin: vehicle.vin,
                    model: vehicle.model,
                    year: vehicle.year,
                    make: vehicle.make
                }
            }
        ))
    }
}

export { get_auth_data, set_handshake, get_policy_data }