import express from "express";
import { get_auth_data, set_handshake, get_policy_data } from './helper_functions.js';
const app = express();
const PORT = process.env.PORT || 3000;
// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post('/mock-carrier/policies', async (req, res) => {
    if (!req.body || req.body.username == undefined || req.body.password == undefined) {
        return res.status(403).send('Username or password missing');
    }
    const user = req.body;
    // Call auth endpoint 
    const { userId, authorization, authError } = await get_auth_data(user);
    if (authError) {
        return res.status(403).send(authError);
    }
    // Call handshake endpoint 
    const { session, policyNumber, handshakeError } = await set_handshake(userId, authorization);
    if (handshakeError) {
        return res.status(403).send(handshakeError);
    }
    // Call policies endpoint
    const { policyData, policyRequestError } = await get_policy_data(authorization, session, policyNumber);
    if (policyRequestError) {
        return res.status(403).send(policyRequestError);
    }
    return res.status(200).send(policyData);
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map