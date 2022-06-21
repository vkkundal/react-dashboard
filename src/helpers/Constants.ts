export const authToken = "authToken" as const;

export const getAuthHeader = () => {
    const res = localStorage.getItem(authToken);
    try {
        if(res){
            return {
                Authorization: "Bearer "+ JSON.parse(res).access_token
            } 
        }
    } finally {
        return {}
    } 
    
}