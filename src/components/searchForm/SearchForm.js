import { Formik, Field, Form, ErrorMessage  } from 'formik';
import * as yup from 'yup';
import { useState } from 'react/cjs/react.development';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';


import './searchForm.scss';

const SearchForm = () => {

    const [error, setError] = useState(false);
    const [id,setId] = useState(null);

    const {getCharacterByNameChar} = useMarvelService();


    

    const search = async (name)=> {
        setError(false);
        await getCharacterByNameChar(name)
            .then(char => {
                if(char != null){  
                    setId(char.id)
                }
                else {
                    setError(true);
                }
            })
    }
    const errorFind = (
        <div className="error-message">The character was not found. Check the name and try again</div>
    )
    const findOk = (
        <div className="search-form__wrapper-find-ok">
            <div className="search-form__message">{`There is! Visit page?`}</div>
            <button className="button button__secondary">
                <div className="inner">
                    <Link to={`/char/${id}`}>
                        TO PAGE
                    </Link>
                </div>
            </button>
        </div>
    )
    
    return (
        <div className='search-form'>
            <div className="search-form__title">Or find a character by name:</div>
            <Formik
                initialValues={{ name: ''}}
                validationSchema ={yup.object({
                    name: yup.string().required("This field is required")
                })}
                onSubmit={(values, { setSubmitting })=> {
                    search(values.name);
                }}>
                <Form action="" className="search-form__form">
                    <div className="search-form__wrapper">
                        <Field type="text" name='name' className='search-form__input' placeholder='Enter name'/>
                        <button type='submit' className="button button__main">
                            <div className="inner">
                                FIND
                            </div>
                        </button>
                    </div>
                    <ErrorMessage name="name" component={'div'} className="error-message"/>
                </Form>
            </Formik>
            {error? errorFind: id != null ? findOk: null }

        </div>
    )
}

export default SearchForm;
