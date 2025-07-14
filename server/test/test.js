import dotenv from 'dotenv';
dotenv.config();

console.log('PORT:', process.env.DB_TOKEN);
console.log('DB_LINK:', process.env.DB_LINK);