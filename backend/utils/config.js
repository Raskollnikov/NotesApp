import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/noteuser";

export { PORT, MONGODB_URI };
