import Axios from "axios";

import config from "../config/env";

const url: string = `https://sms.aakashsms.com/sms/v3/send?auth_token=${config.AAKASH_AUTH}`;

export async function sendSMS(phoneNo: number, message: string) {
    const response = await Axios.get(`${url}&to=${phoneNo}&text=${message}`);
    return response.data;
}
