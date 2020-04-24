import React from 'react';

const AlertMessage = props => {
  return (
    <>
      {props.show ? (
        <div
          style={{
            position: 'fixed',
            top: '0',
            right: '0',
            width: '100%',
            height: '100%',
            zIndex: 5,
            backgroundColor: '#0008',
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '50%',
              right: '50%',
              height: props.height || '100px',
            }}
          >
            <div
              style={{
                position: 'relative',
                top: '-50%',
                right: '-50%',
              }}
            >
              <div
                className="delete"
                style={{ position: 'absolute', top: '-20px', right: '-20px' }}
                onClick={props.closeFn}
              ></div>
              {props.children}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AlertMessage;