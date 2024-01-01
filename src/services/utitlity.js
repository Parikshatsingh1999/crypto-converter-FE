
export const createRequest = async (path, body) => {
    try {
        const baseUrl = "http://localhost:5000/api";
        const fetchBody = {
            method: body?.method || "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "content-type": "application/json"
            }
        }
        if (body?.payload) {
            fetchBody.body = JSON.stringify(body.payload)
        }
        const response = await fetch(`${baseUrl}${path}`, fetchBody).then(res => res.json());
        return response || null;
    } catch (error) {
        console.error(error?.message || `Something went wrong for ${path}`);
        return null
    }
}