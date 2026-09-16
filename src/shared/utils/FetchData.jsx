import { httpClient } from "./HttClient";

// export async function fetchData(url,token){
//     try{
//         const response =await httpClient.get(url,token);
//         if (!Array.isArray(response)) {
//             return response;
//         }

//         const isTokenWrapped = response.some(item => item?.token);
//         if (!isTokenWrapped) {
//             return response;
//         }

//         const user = response.find(item => item.token === token);
//         return user?.data ?? [];
//     }catch(error){
//         return null;
//     }
// }



export async function fetchData(url,token,args=null){
    
    
    try{
        const response =await httpClient.get(url,token);
        if(args!==null){
  const Data=Array.isArray(response)?response.find(item=>item.id===args && item.token===token):null;
  return Data;

    }
        console.log(`ItemToken:${token}`)
        console.log(response)
        console.log(`url:${url}`)
        console.log(Array.isArray(response))
        console.log(response.find(item=>item.token===token))
        const user=Array.isArray(response)? response.find(item=>item.token===token):null;
        console.log(user)
        return user?.data;  
    }catch(error){
        console.log(error)
        return null;
    }}



//     export async function fetchData(url, token, args = null) {
//   try {
//     const response = await httpClient.get(url, token);

//     console.log("response:", response);
//     console.log("token:", token);
//     console.log("url:", url);

//     if (!Array.isArray(response)) {
//       console.log("response is not array");
//       return null;
//     }

//     const user = response.find(
//       item => item.token === token
//     );

//     console.log("user:", user);

//     if (!user) {
//       console.log("User not found");
//       return null;
//     }

//     if (args === null) {
//       return user.data;
//     }

    
//     if (Array.isArray(user.data)) {
//       const account = user.data.find(
//         item => item.id === args
//       );

//       console.log("account details:", account);

//       return account ?? null;
//     }

//     return null;

//   } catch (error) {
//     console.log("fetchData error:", error);
//     return null;
//   }
// }