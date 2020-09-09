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

    const cardStyles = {
        background: `${colorProps.color}`,
        backgroundImage: `linear-gradient(to bottom right, ${colorProps.color} 50%, white 160%)`
    };

    return (
        <div
            className={'card'}
            style={cardStyles}
            onClick={() => openModal(colorProps.id)}
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
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
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

    return (
        <div style={appStyles}>
            {cardsJXS}
            {modalJSX}
        </div>
    );
};

export default App;