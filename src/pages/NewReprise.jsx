import React, { useState, useRef, useContext, useEffect } from 'react'
import latinNames from '../utils/LatinNameList'
import citys from '../utils/City-list'
import { AuthContext } from '../contexts/Auth'
import firebase from '../utils/firebase-config'
import { Redirect } from 'react-router-dom'

export default function NewReprise(props) {
    const [complete, setComplete] = useState(false)
    const [completeTwo, setCompleteTwo] = useState(false)
    const textInput = useRef()
    const textInputTwo = useRef()
    const [capture, setCapture] = useState()
    const [success, setSuccess] = useState(false)
    const [redirect, setRedirect] = useState(false)

    /**
     * Get data from firestore
     * @return capture
     * @return docId
     */
    useEffect(() => {
        firebase.firestore().collection('captures').doc(props.match.params.doc).get()
            .then(querySnapshot => {
                const data = querySnapshot.data();
                setCapture(data);
            }).catch(error => console.error(error));
    }, []);

    /**
     * Check if input value is in latinName array
     * @param {event} e 
     * @return Complete
     */
    const checkIfInArray = (e) => {
        if (e.target.value !== "") {
            setComplete(latinNames.filter(name => name.includes(e.target.value)))
        } else {
            setComplete(false)
        }
    }

    /**
     * Check if input value is in citys array
     * @param {event} e 
     * @return Complete
     */
    const checkIfInArrayTwo = (e) => {
        if (e.target.value !== "") {
            setCompleteTwo(citys.filter(name => name.includes(e.target.value)))
        } else {
            setCompleteTwo(false)
        }
    }

    /**
     * On click change value of auto-complete input
     * @param {event} e 
     */
    const changeInputValue = (e) => {
        textInput.current.value = e.target.textContent;
        setComplete(false)
    }

    /**
     * On click change value of auto-complete input
     * @param {event} e 
     */
    const changeInputValueTwo = (e) => {
        textInputTwo.current.value = e.target.textContent;
        setCompleteTwo(false)
    }

    /**
     * Get curred logged user
     */
    const { currentUser } = useContext(AuthContext);

    /**
     * Update bird on form submit
     * @param {event} e 
     */
    const submitForm = async (e) => {
        e.preventDefault();
        firebase.firestore().collection('reprises').doc().set({
            weight: e.target.weight.value,
            latin: e.target.latin.value,
            envergure: e.target.envergure.value,
            adiposity: e.target.adiposity.value,
            sexe: e.target.sexe.value,
            age: e.target.age.value,
            captype: e.target.captype.value,
            user: currentUser.email,
            createdAt: new Date(),
            id: Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9),
            ring: e.target.ring.value,
            place: e.target.place.value,
        }).then(
            setSuccess(true)
        );
        
        setRedirect(true)

    }

    
    if (redirect) {
        return <Redirect to={'/reprises'} />
    }

    return (
        <section class="content">
            <div className="capture__wrapper">
                <button className="back" onClick={props.history.goBack}><svg version="1.1" id="Capa_1" x="0px" y="0px"
	 viewBox="0 0 240.823 240.823">
<g>
	<path id="Chevron_Right" d="M57.633,129.007L165.93,237.268c4.752,4.74,12.451,4.74,17.215,0c4.752-4.74,4.752-12.439,0-17.179
		l-99.707-99.671l99.695-99.671c4.752-4.74,4.752-12.439,0-17.191c-4.752-4.74-12.463-4.74-17.215,0L57.621,111.816
		C52.942,116.507,52.942,124.327,57.633,129.007z" />
                        </g>
</svg>Retour</button>
            </div>
            <h2 className="capture__heading heading">{capture ? capture.ring : '/'}</h2>
            {success ? <p className="success">La capture a bien été mis à jour.</p>:''}
            {capture ?
        <form action="/" method="get" className="form" onSubmit={e=> submitForm(e)}>
            <label htmlFor="latin" className="label">Nom latin</label>
            <div className="autocomplete">
                        <input type="text" onChange={(e) => checkIfInArray(e)} ref={textInput} placeholder="Gavia stellata" name="latin" id="latin" className="input" defaultValue={capture.latin ?? ''} autoComplete="false" />
                {complete ?
                    <ul className="autocomplete__list">
                        {
                            complete.map((item, id) => <li key={id} onClick={e => changeInputValue(e)} className="autocomplete__item">{item}</li>)
                        }
                    </ul> : ''
                }
            </div>
            <label htmlFor="place" className="label">Nom latin</label>
            <div className="autocomplete">
                        <input type="text" onChange={(e) => checkIfInArrayTwo(e)} ref={textInputTwo} placeholder="Gavia stellata" name="place" id="place" className="input" defaultValue={capture.place ?? ''}/>
                {completeTwo ?
                    <ul className="autocomplete__list">
                        {
                            completeTwo.map((item, id) => <li key={id} onClick={e => changeInputValueTwo(e)} className="autocomplete__item">{item}</li>)
                        }
                    </ul> : ''
                }
            </div>
            <label htmlFor="envergure" className="label">Envergure (cm)</label>
                <input type="number" className="input" id="envergure" name="envergure" min="0" defaultValue={capture.envergure ?? 0}/>
            <label htmlFor="weight" className="label">Poids (g)</label>
            <input type="number" className="input" id="weight" name="weight" min="0" defaultValue={capture.weight ?? 0} />
            <label htmlFor="adiposity" className="label">Adiposité (%)</label>
            <input type="number" className="input" id="adiposity" name="adiposity" min="0" defaultValue={capture.adiposity ?? 0} />
            <label htmlFor="sexe" className="label">Sexe</label>
            <select className="input" id="sexe" name="sexe" defaultValue={capture.sexe ?? 'DEFAULT'}>
                <option className="option" disabled value='DEFAULT'>Choisir un sexe</option>
                <option className="option">Mâle</option>
                <option className="option">Femelle</option>
            </select>
            <label htmlFor="age" className="label">Âge</label>
            <select className="input" id="age" name="age" defaultValue={capture.age ?? 'DEFAULT'}>
                <option className="option" value="DEFAULT" disabled>Choisir une tranche d’âge</option>
                <option className="option">Enfant</option>
                <option className="option">Adulte</option>
            </select>
            <label htmlFor="captype" className="label">Type de capture</label>
            <select className="input" id="captype" name="captype" defaultValue={capture.captype ?? 'DEFAULT'}>
                <option className="option" value="DEFAULT" disabled>Choisir une méthode de capture</option>
                <option className="option">Nid</option>
                <option className="option">Filet</option>
            </select>
            <input type="hidden" value={capture.ring ?? '/'} name="ring" />        
            <button type="submit" className="btn btn--form">Enregistrer</button>
                </form> : 'Chargement...'
        }
        </section>
    )
}
