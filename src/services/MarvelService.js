

class MarvelService {

    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=168bb79d73bcf68111bcb5ca1a106b37';
    _baseOffSet  = 210;
    

    getResourse = async (url) =>{
        let res = await fetch(url);
    
        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status ${url.status}`);
        }
    
        return await res.json();
    }

    getAllCharaters = async (offset = this._baseOffSet) =>{
        const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }
    getCharater = async (id) =>{
        const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    descrTransform = (descr, num) =>{


        if(descr !== ""){
            return descr.slice(0,num)+'...';
        }
        else{
            return "Описания нет";
        }
    }

    _transformCharacter = (char) => {
        return {
            id:char.id,
            name:char.name,
            description: this.descrTransform(char.description, 120),
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }
}

export default MarvelService;