

const axios = require('axios')
const dbUrl = 'https://nodejsiut-3d79.restdb.io/rest/article';
const apiKey = 'b2aaee26b7a5c40c32b42190ad18ac0f3e54c';
const headers = {
    headers: {'x-apikey': apiKey}
}

function findById(id){
    return axios.get(dbUrl + "/" + id,headers)
        .catch((error) => {console.log(error)})
}

 function findAll(){
    return axios.get(dbUrl,headers)
        .catch((error) => {console.log(error)})
}

 function removeById(id){
    return axios.delete(dbUrl + '/' + id, headers)
        .catch((error) => {return error.response})
}

 function create(data){

    return axios.post(dbUrl,data, headers)
        .catch((error) => {console.log(error)})
}

function updateById(id,data){
    return axios.put(dbUrl + '/' + id,data, headers)
        .catch((error) => {console.log(error)})
}

async function isCreator(id,user){
    const article = await findById(id);
    return article.data.user === user;
}
module.exports = {
    findById: findById,
    findAll: findAll,
    removeById: removeById,
    create: create,
    updateById : updateById,
    isCreator: isCreator,
}