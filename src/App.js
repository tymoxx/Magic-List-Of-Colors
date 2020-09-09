import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import './Modal.css';

const url = 'https://reqres.in/api/unknown?per_page=12';

const Modal = (props) => {

    const {children} = props;

    return <div className='modal-content'>
        {children}
    </div>
};

const Card = (props) => {

    const {colorProps, openModal} = props;
    const [hovered, setHovered] = useState(false);

    const getRandomFromValues = (arr) => {
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };

    const cardStyles = {
        background: `${colorProps.color}`,
        backgroundImage: `linear-gradient(to bottom right, ${colorProps.color} 50%, white 160%)`
    };

    const cardStylesHovered = {
        cursor: 'pointer',
        transform: `rotate(${getRandomFromValues([-4, -3, -2, 2, 3, 4])}deg) scale(${getRandomFromValues([1.05, 1.1, 1.15])})`,
        boxShadow: '3px 10px 15px -4px rgba(0,0,0,0.30)',
        transition: `transform .2s`
    };

    return (
        <div
            className={'card'}
            style={Object.assign({}, hovered ? cardStylesHovered : {}, cardStyles)}
            onClick={() => openModal(colorProps.id)}
            onMouseEnter={() => {
                setHovered(true)
            }}
            onMouseLeave={() => {
                setHovered(false)
            }}
        >
            {colorProps.name.toUpperCase()}
            <span className={'year'}>{colorProps.year}</span>
        </div>
    )
};

const App = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [cards, setCards] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    const appStyles = {
        display: 'flex',
        flexWrap: 'wrap',
    };

    function openModal(id) {
        setSelectedCardId(id);
    }

    function handleMouseDown(e) {
        if (modalRef.current === (e.target)) {
            setSelectedCardId(null);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoading(false);
                    setCards(result.data);
                },
                (error) => {
                    setIsLoading(false);
                    setError(error);
                }
            )
    }, []);

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    const cardsJXS = cards.map((color) => {
        return <Card
            key={color.id}
            colorProps={color}
            openModal={openModal}
        />
    });

    const fullCard = (color) => ({
        padding: '20px 40px 40px 40px',
        background: color,
        border: 'none',
});

    const text = {
        fontSize: '1.2em',
        lineHeight: '2em',
        color: 'white',
        textTransform: 'uppercase',
    };

    const textHeader = {
        fontWeight: 700,
    };

    const currentCard = cards.find((card) => (card.id === selectedCardId));

    const modalJSX = selectedCardId &&
        <div
            className='modal'
            ref={modalRef}
        >
            <Modal>
                <div style={fullCard(currentCard.color)}>
                    <h1 style={{color: 'white'}}>Info:</h1>
                    <span style={{...text, ...textHeader}}>Color:  </span>
                    <span style={text}>{currentCard.name}</span>
                    <br/>
                    <span style={{...text, ...textHeader}}>Year:  </span>
                    <span style={text}>{currentCard.year}</span>
                    <br/>
                    <span style={{...text, ...textHeader}}>HEX:  </span>
                    <span style={text}>{currentCard.color}</span>
                </div>
            </Modal>
        </div>;

    const errorJXS = error && <span>Sorry, an error happened why loading the data. Try again later</span>;

    return (
        <div style={appStyles}>
            {errorJXS}
            {cardsJXS}
            {modalJSX}
        </div>
    );
};

export default App;