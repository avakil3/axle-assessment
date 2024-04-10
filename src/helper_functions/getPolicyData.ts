type PolicyDataType = {
    type: string,
    carrier: string,
    policyNumber: string,
    isActive: boolean,
    effectiveDate: string,
    expirationDate: string,
    address: {
        addressLine1: string,
        addressLine2: string,
        city: string,
        state: string,
        postalCode: string,
        country: string
    },
    coverages: Array<{
        code: string,
        label: string,
        deductible: number,
        limitPerAccident: number,
        limitPerPerson: number
    }>,
    properties: Array<{
        type: string,
        data: {
            bodyStyle: string,
            vin: string,
            model: string,
            year: string,
            make: string
        }
    }>
}

interface PolicyData {
    policyData?: PolicyDataType
    policyRequestError?: string
}

export const getPolicyData = async (authorization: string, session: string, policyNumber: string): Promise<PolicyData> => {

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

        const policyData = mapIncomingPolicyData(responseData.data)

        return { policyData } as PolicyData


    } catch (e) {
        return { policyRequestError: e } as PolicyData
    }
}

const mapIncomingPolicyData = (policyData): PolicyDataType => {
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

