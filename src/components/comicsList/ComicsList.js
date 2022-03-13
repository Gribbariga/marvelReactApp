import './comicsList.scss';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import { useState, useEffect} from 'react';

const ComicsList = () => {
    const [comicsItem, setComicsItem] = useState([]);
    const [offset, setOffSet] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const {loading, error, getAllComics} = useMarvelService();


    const onRequest = (offset, initial)=> {
        initial? setNewItemLoading(false): setNewItemLoading(true);
        getAllComics(offset)
            .then(comicsLoaded);
    }

    const comicsLoaded = (newComics)=>{
        let ended = false;
        if(newComics.lenght < 8){
            ended = true;
        }
        setComicsItem(comicsItem=>[...comicsItem , ...newComics]);
        setOffSet(offset + 8);
        setComicsEnded(ended);
        setNewItemLoading(false)
    }


    useEffect(()=>{
        onRequest(offset, true);
    },[])

    const getItems = (arr)=>{
        const items = arr.map((item)=>{
            return(
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{`${item.price}$`}</div>
                    </Link>
                </li>
            )
        })
        return items;
    }
    const items = getItems(comicsItem);
    const loaded = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null
    return (
        <div className="comics__list">
            {loaded}
            {errorMessage}
            <ul className="comics__grid">
                {items}
            </ul>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display':comicsEnded? 'none' : 'block'}}
                onClick={()=>onRequest(offset, false)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;