import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useSpring, animated } from 'react-spring';

const AnimatedModal = ({ isOpen, onRequestClose, children }) => {
    const [visible, setVisible] = useState(isOpen);
    
    const animation = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(-50%)',
        config: { tension: 200, friction: 30 }, // Adjust the friction value to make the animation last longer
        onRest: () => {
            if (!isOpen) setVisible(false);
        }
    });

    useEffect(() => {
        if (isOpen) setVisible(true);
    }, [isOpen]);

    return visible ? (
        <animated.div style={{ ...animation, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        padding: '20px',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        transform: 'translate(-50%, -50%)',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
                ariaHideApp={false}
            >
                {children}
            </Modal>
        </animated.div>
    ) : null;
};

export default AnimatedModal;
