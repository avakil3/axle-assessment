import express from "express";
import { getAuthData } from "./helper_functions/getAuthData.js";
import { setHandshake } from "./helper_functions/setHandshake.js";
import { getPolicyData } from "./helper_functions/getPolicyData.js";
const app = express();
const PORT = process.env.PORT || 3000;
// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post('/mock-carrier/policies', async (req, res) => {
    if (!req.body || req.body.username === undefined || req.body.password === undefined) {
        return res.status(403).send('Username or password missing');
    }
    const { username, password } = req.body;
    // Call auth endpoint 
    const { userId, authorization, authError } = await getAuthData({ username, password });
    if (authError) {
        return res.status(403).send(authError);
    }
    // Call handshake endpoint 
    const { session, policyNumber, handshakeError } = await setHandshake(userId, authorization);
    if (handshakeError) {
        return res.status(525).send(handshakeError);
    }
    // Call policies endpoint
    const { policyData, policyRequestError } = await getPolicyData(authorization, session, policyNumber);
    if (policyRequestError) {
        return res.status(500).send(policyRequestError);
    }
    return res.status(200).send(policyData);
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map