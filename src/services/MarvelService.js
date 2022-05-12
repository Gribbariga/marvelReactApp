import {useHttp} from '../hooks/http.hook'

const useMarvelService = ()=> {
    const {loading, request, error, clearError} = useHttp();
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=168bb79d73bcf68111bcb5ca1a106b37';
    const _baseOffSet  = 210;
    

    const getAllCharaters = async (offset = _baseOffSet) =>{
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    const getCharater = async (id) =>{
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async(offset = _baseOffSet) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);

        return res.data.results.map(_transformComics);

    }

    const getComics = async(id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);

        return _transformComics(res.data.results[0]);
    }
    
    const getComicsByIdChar = async(idChar) => {
        const res = await request(`${_apiBase}characters/${idChar}/comics?${_apiKey}`);
        

        return res.data.results.map(_transformComicsChar);
    }
    const getCharacterByNameChar = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        if(res.data.results.length > 0){
            
            return _transformCharacter(res.data.results[0]);
        }
        else {

            return null;
        }
        
    }

    

    const _transformCharacter = (char) => {
        return {
            id:char.id,
            name:char.name,
            description: char.description,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }

    const _transformComicsChar = (comicsChar)=>{
        return {
            id: comicsChar.id
        }
    }

    const _transformComics = (comics)=>{
        const price = comics.prices[0].price === 0 ? 'not available' : comics.prices[0].price + '$';
        const page = comics.pageCount>0 ? comics.pageCount : 'No info about the number of pages'; 
        return {
            title: comics.title,
            description: comics.description || 'There is no description',
            language: comics?.TextObject?.language || 'en-us',
            price,
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            page,
            id: comics.id
        }
    }


    

    return {loading, error, getAllCharaters, getCharater, clearError, getComics, getAllComics, getComicsByIdChar, getCharacterByNameChar};
}

export default useMarvelService;