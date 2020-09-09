import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import './Modal.css';

const url = 'https://reqres.in/api/unknown?per_page=12';

// const Modal = React.forwardRef((props, ref) => {
//     const {colorProps, toggleModal} = props;
//
//     return <div className='modal'>
//         <div className='modal-content'>
//             Modal
//         </div>
//     </div>
// });

const Modal = (props) => {

    const {colorProps, toggleModal, modalContent} = props;

    console.log(modalContent);

    return <div className='modal-content'>
        {modalContent}
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

    const hoveredStyles = {
        cursor: 'pointer',
        transform: `rotate(${getRandomFromValues([-4, -3, -2, 2, 3, 4])}deg) scale(${getRandomFromValues([1.05, 1.1, 1.15])})`,
        boxShadow: '3px 10px 15px -4px rgba(0,0,0,0.30)',
        transition: `transform .2s`
    };

    return (
        <div
            className={'card'}
            style={Object.assign({}, hovered ? hoveredStyles : {}, cardStyles)}
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
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [colors, setColors] = useState([]);
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
        setIsModalOpen(id);
    }

    function handleMouseDown(e) {
        if (modalRef.current === (e.target)) {
            setIsModalOpen(null);
            console.log('click2');
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoading(false);
                    setColors(result.data);
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

    const cardsJXS = colors.map((color) => {
        return <Card
            key={color.id}
            colorProps={color}
            openModal={openModal}
        />
    });

    const modalJSX = isModalOpen &&
        <div
            className='modal'
            ref={modalRef}
        >
            <Modal
                openModal={openModal}
                modalContent={isModalOpen}
            />
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