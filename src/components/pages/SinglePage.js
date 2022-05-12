import './singleComicPage.scss';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import Helmet from 'react-helmet';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = () => {

    const {pathname} = useLocation();
    const {Id} = useParams();
    const [value, setValue] = useState(null);
    const {loading, error, clearError, getComics, getCharater} = useMarvelService();


    const comicsOrChar = pathname.indexOf('comics');

    useEffect(()=>{
        update();
    },[])

    useEffect(()=>{
        update();
    },[Id])


    // componentDidUpdate(prevProps, prevState){
    //     if(this.props.charId !== prevProps.charId){
    //         this.updateChar();
    //     }
    // }


    const update = ()=>{
        
        clearError();
        if(comicsOrChar != -1) {
            getComics(Id)
                .then(onValueLoaded)
        } else {
            getCharater(Id)
                .then(onValueLoaded)
        }
        
    }
    const onValueLoaded = (value) =>{
        setValue(value);
    }


    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !value)?<View comic={value}/>: null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, description, page, language , price , thumbnail } = comic
    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comics book`}
                    />
                <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                {page? <p className="single-comic__descr">{page} p</p>: null }
                {language?<p className="single-comic__descr">Language:{language}</p>: null}
                {price? <div className="single-comic__price">{price}</div>: null}
            </div>
            <Link to="/" className="single-comic__back">Back to main</Link>
        </div>
    )
}

export default SinglePage;