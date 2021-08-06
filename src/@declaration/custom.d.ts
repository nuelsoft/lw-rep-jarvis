import {AuthClaim} from "../@types";
import {IOrg} from "../models/org";

declare global {
    namespace Express {
        interface Request {
            claims: AuthClaim,
        }
    }
}