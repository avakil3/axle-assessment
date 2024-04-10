export const getPolicyData = async (authorization, session, policyNumber) => {
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
        const policyData = mapIncomingPolicyData(responseData.data);
        return { policyData };
    }
    catch (e) {
        return { policyRequestError: e };
    }
};
const mapIncomingPolicyData = (policyData) => {
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
        properties: policyData.agreement.vehicles.map(vehicle => ({
            type: 'vehicle',
            data: {
                bodyStyle: vehicle.bodyStyle,
                vin: vehicle.vin,
                model: vehicle.model,
                year: vehicle.year,
                make: vehicle.make
            }
        }))
    };
};
//# sourceMappingURL=getPolicyData.js.map