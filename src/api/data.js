export const getProductsApi = async () => {
    const URLAPI = "https://fakestoreapi.com/products"
    try {        
        const request =  await fetch(URLAPI)
        const response = await request.json()
        // console.log(response);
        // fetch(URLAPI)
        //     .then(res=>res.json())
        //     .then(json=> console.log(json))
        
        return response
      } catch (error) {
        return error     
      }
}