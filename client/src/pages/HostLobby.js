import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import socketIO from 'socket.io-client';
import Players from '../components/Players';


const HostLobby = (props) => {
  const [players, setPlayers] = useState([]);
  const data = useLocation();
  const pin = data.state;
  const { socket, setTriviaData, BASE_URL } = props;

  console.log('El pin es', pin);

  useEffect(() => {
    console.log('hostsocket', props.socket);
    if (!props.socket) {
      fetch(`http://localhost:5000/trivia/${pin}/${props.trivia}`).then(() => {
        let newSocketHost;
        if (BASE_URL === 'http://localhost:5000') {
          newSocketHost = socketIO(`/${pin}`);
        } else {
          newSocketHost = socketIO(`${BASE_URL}/${pin}`);
        }
        props.setSocket(newSocketHost);
      });
    }
  }, [pin, props, BASE_URL]);

  useEffect(() => {
    if (socket) {
      console.log('hey');
      socket.on('question', (triviaData) => {
        const newTriviaData = triviaData;
        setTriviaData(newTriviaData);
      });
      socket.on('playerlist', (players) => {
        const newPlayers = players;
        setPlayers(newPlayers);
      });
    }
  }, [socket, setTriviaData]);

  return (
    <React.Fragment>
      <div className="bg-primary">
        <div className="container d-flex align-items-center flex-column">
          <h2 className="pin-host-lobby masthead-heading text-uppercase mb-0 text-white">
            The PIN is {pin}
          </h2>
          <div className="divider-custom">
            <div className="divider-custom-line"></div>
            <div className="divider-custom-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="divider-custom-line"></div>
          </div>
          <Link to="/host/trivia">
            <button
              onClick={() => props.socket.emit('start-game')}
              className="start-game-btn text-white bg-secondary btn btn-xl btn-outline-light"
            >
              Start Game
            </button>
          </Link>
          <div className="divider-custom">
            <div className="divider-custom-line"></div>
            <div className="divider-custom-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="divider-custom-line"></div>
          </div>
          <h2 className="pin-host-lobby text-center text-uppercase text-secondary">
            Players connected:
          </h2>
          <br />
          <div className="container d-flex align-items-center justify-content-center flex-column">
            <Players className="" players={players} />
          </div>
          <div className="divider-custom">
            <div className="divider-custom-line"></div>
            <div className="divider-custom-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="divider-custom-line"></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HostLobby;
