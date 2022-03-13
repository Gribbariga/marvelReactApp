import { useState, useEffect, useRef } from "react";
import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import propTypes from 'prop-types';


const CharList = (props)=> {


    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading]= useState(false);
    const [offset, setOffset]= useState(210);
    const [charEnded, setCharEnded]= useState(false);

    const itemRefs = useRef([]);

    const {loading, error, getAllCharaters} = useMarvelService();

    useEffect(()=>{
        onRequest(offset, true); 
    },[])


    const onRequest = (offset, initial)=>{
        initial?setNewItemLoading(false):setNewItemLoading(true);
        getAllCharaters(offset)
            .then(onCharListLoaded)
    }
    
    const onCharListLoaded = (newChars)=>{
        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }

        setCharList(charList =>[...charList,...newChars]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    // const onCharSelected = (id,e)=>{
    //     this.props.onCharSelected(id)
    // }
    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    function getElements (arr) {
        const items = arr.map((item,i)=>{
        let imgStyle = {'objectFit' : 'cover'};
        if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'};
        }

        return(
            <li 
                className="char__item" 
                key={item.id}
                onClick={(e)=>{
                    props.onCharSelected(item.id);
                    focusOnItem(i);
                }}
                ref={(el)=> itemRefs.current[i] = el}
                onKeyPress={(e) => {
                    e.preventDefault()
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }
                }}
                tabIndex={0}>
                <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                <div className="char__name">{item.name}</div>
            </li>
        )
        })


        return (
        <ul className="char__grid" >
            {items}
        </ul>
        )
    }
        
    const items = getElements(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display':charEnded? 'none' : 'block'}}
                onClick={()=> onRequest(offset, false)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

CharList.propTypes = {
    onCharSelected: propTypes.func.isRequired
}

export default CharList;