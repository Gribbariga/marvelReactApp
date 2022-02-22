import { Component } from 'react/cjs/react.production.min';
import React, { createRef } from 'react';
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import propTypes from 'prop-types';


class CharList extends Component {
    constructor(props){
        super(props);
        this.itemRefs=[];
        this.state = {
            chars: [],
            loading: true,
            error: false,
            newItemLoading: false,
            offset: 210,
            charEnded: false,
            activeElemet:null
            
        };
    }
    componentDidMount(){
        this.onRequest();
    }


    onRequest = (offset)=>{
        // this.onCharListLoading();
        this.marvelSercive.getAllCharaters(offset)
            .then(this.setChars)
            .catch(this.onError);
    }
    

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    

    marvelSercive = new MarvelService();
    setChars = (newChars)=>{
        let ended = false;

        if(newChars.length < 9) {
            ended = true;
        }


        this.setState(({offset,chars})=>({
            chars:[...chars,...newChars],
            loading:false,
            newItemLoading:false,
            offset: offset + 9,
            charEnded: ended,
        }))
    }

    onCharSelected = (id,e)=>{
        this.props.onCharSelected(id)
    }
    setRef = (ref) => {
        this.itemRefs.push(ref);
    }
    focusOnItem = (id) => {
        console.log(id);
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    getElements = (arr)=>{
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
                    this.props.onCharSelected(item.id);
                    this.focusOnItem(i);
                }}
                ref={this.setRef}
                onKeyPress={(e) => {
                    e.preventDefault()
                    if (e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
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

    
    render(){
        const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;
        
        const items = this.getElements(chars);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display':charEnded? 'none' : 'block'}}
                    onClick={()=> this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

CharList.propTypes = {
    onCharSelected: propTypes.func.isRequired
}

export default CharList;