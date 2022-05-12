import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMarvelService from '../../services/MarvelService';
import propTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';


const CharInfo = (props)=>  {
    const [char, setChar] = useState(null);
    const [idComics, setIdComics] = useState(null);

    
    const {loading, error,getCharater, getComicsByIdChar, clearError} = useMarvelService();

    useEffect(()=>{
        updateChar();
    },[])

    useEffect(()=>{
        updateChar();
    },[props.charId])


    // componentDidUpdate(prevProps, prevState){
    //     if(this.props.charId !== prevProps.charId){
    //         this.updateChar();
    //     }
    // }


    const updateChar = ()=>{
        
        const {charId} = props;
        if(!charId){
            return;
        }
        clearError();
        getCharater(charId)
            .then(onCharLoaded);
        getComicsByIdChar(charId)
            .then(onComicsLinkLoaded);
    }
    const descrTransform = (descr, num) =>{


        if(descr !== ""){
            return descr.slice(0,num)+'...';
        }
        else{
            return "Описания нет";
        }
    }
    const onCharLoaded = (char) =>{
        char.description = descrTransform(char.description, 120);
        setChar(char);
    }
    const onComicsLinkLoaded = (comics) =>{
        setIdComics(comics);
    }
    
    
    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char || !idComics)?<View char={char} idComics={idComics}/>: null;


    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )

    
    
}
const View = ({char,idComics}) =>{
    const {name, description, thumbnail, homepage, wiki,comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    
                    comics.length!==0?comics.map((item,i) =>{
                        
                        if(i<9 && typeof idComics[i] !== 'undefined'){
                            return(
                                <li key={i}className="char__comics-item">
                                    <Link to={`/comics/${idComics[i].id}`}>
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        }else{
                            return null;
                        }
                    }):<li>Комиксов у персонажа нет</li>
                }
                
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: propTypes.number
}
export default CharInfo;