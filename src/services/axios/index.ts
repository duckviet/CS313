import ClientRequest from "./ClientRequest";

const clientInstance = ClientRequest.getInstance();
const client = clientInstance.getAxiosInstance();

export { ClientRequest, client, clientInstance };
