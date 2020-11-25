import axios from 'axios';



export default class RestClientObj {
  static instanceAxios = axios.create({
     baseURL: 'http://localhost:5003'
    });
    
  static setInterceptor =(callback) =>{
    RestClientObj.instanceAxios.interceptors.response.use(function (response) {
        return response;
      }, function (error) {
        if(error.response.status === 403) {
          localStorage.removeItem('id_token');
          localStorage.removeItem('profile');

          callback();
          throw Error("Su sesión ha expirado");
        }else{
          console.log("inter");
          throw Error(error.response.data.message);
        };
    });
  }

  static setTokenToAxio = (token) => {
    RestClientObj.instanceAxios.defaults.headers.common['Authorization'] = token;
  }
  static cleartokenAxio = () => {
    RestClientObj.instanceAxios.defaults.headers.common['Authorization'] = undefined;
  }
  static getAllProperties = () => {
    return RestClientObj.instanceAxios.get('/business/properties')
  }
  static getPropertiesList = (filtro) => {
    return RestClientObj.instanceAxios.post('/business/firstSearch',filtro)
  }
   static refinePropertiesList = (filtro) => {
     return RestClientObj.instanceAxios.post('/business/list',filtro)
   }

  static getAreas = () => {
    return RestClientObj.instanceAxios.get('/business/areas')
  }

  static getCategories = () => {
      return RestClientObj.instanceAxios.get('/business/categories')
  }

  static getCountries = () => {
      return RestClientObj.instanceAxios.get('/business/countries')
  }

   static getRoomRanges = () => {
       return RestClientObj.instanceAxios.get('/business/guestRooms')
   }

   static getSpaceRanges = () => {
       return RestClientObj.instanceAxios.get('/business/space')
   }

 static listProperties = () => {
     return RestClientObj.instanceAxios.get('/business/properties')
 }


  static getBrands = () => {
    return RestClientObj.instanceAxios.get('/business/brands')
  }

  static getParameters = () => {
    return RestClientObj.instanceAxios.get('/business/parameters')
  }

  static getGalleryHotel = (hotel) => {
    return RestClientObj.instanceAxios.post('/business/getGalleryByHotel',hotel)
      .then(response=>response.data)
  }

  


}
