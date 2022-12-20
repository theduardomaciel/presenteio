import { NextApiRequest } from "next";

export default function extractToken(req: NextApiRequest) {
    if (req.headers.authorization || req.cookies) {
        const splitAuth = req.headers.authorization?.split(' ') as string[];
        if (req.cookies) {
            return req.cookies['presenteio.token'];
        } else if (req.headers.authorization && splitAuth[0] === 'Bearer') {
            return splitAuth[1];
        }
    } else {
        return null;
    }
}