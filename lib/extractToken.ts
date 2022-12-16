import { NextApiRequest } from "next";

export default function extractToken(req: NextApiRequest) {
    if (req.headers.authorization || req.query.token) {
        const splitAuth = req.headers.authorization?.split(' ') as string[];
        if (req.headers.authorization && splitAuth[0] === 'Bearer') {
            return splitAuth[1];
        } else if (req.query && req.query.id || req.query && req.query.token) {
            return req.query.id || req.query.token;
        }
    } else {
        return null;
    }
}