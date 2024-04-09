import express from "express";
import { get_auth_data, set_handshake, get_policy_data } from './helper_functions.js';
const app = express();
const port = 3000;
// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post('/mock-carrier/policies', async (req, res) => {
    const user = req.body;
    if (user.username == undefined || user.password == undefined) {
        res.status(403).send('Username or password missing');
    }
    // Call auth endpoint 
    const { userId, authorization, authError } = await get_auth_data(user);
    if (authError) {
        res.status(403).send('Authentication failed');
    }
    // Call handshake endpoint 
    const { session, policyNumber, handshakeError } = await set_handshake(userId, authorization);
    if (handshakeError) {
        res.status(403).send('Error: Failed to establish handshake');
    }
    // Call policies endpoint
    const { policyData, policyRequestError } = await get_policy_data(authorization, session, policyNumber);
    if (policyRequestError) {
        res.status(403).send('Error: Failed to request policy data from carrier');
    }
    res.status(200).send(policyData);
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=index.js.map