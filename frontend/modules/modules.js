import axios from "axios"

// http request 

export const http = (accessToken = null) => {
  const instance = axios.create({
   baseURL: import.meta.env.VITE_BASEURL,
   withCredentials: true
  });
  if(accessToken){
    instance.defaults.headers.common['Authorization'] =`Bearer ${accessToken}`;
  }
  return instance;
};
// trim data 

export const trimData = (obj) => {
  let finalObj = {};
  for (let key in obj) {
    const value = obj[key]
    if (typeof value === "string") {
      finalObj[key] = value.trim().toLocaleLowerCase()
    } else if (typeof value === "number" || typeof value === "boolean") {
      finalObj[key] = value.toString()
    } else {
      finalObj[key] = value
    }
  }
  return finalObj
}

// fetcher
export const fetchData = async (api) => {
  try {
    const httpRequest = http()
    const { data } = await httpRequest.get(api)
    return data
  } catch {
    return null
  }
}

export const uploadFile = async (file, folderName) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const httpRequest = http();
    const response = await httpRequest.post(
      `/api/upload?folderName=${folderName}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

