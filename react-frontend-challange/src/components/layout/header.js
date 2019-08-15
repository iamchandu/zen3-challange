import React from 'react';

function header() {
        return (
                <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                        <a className="navbar-brand text-white" href="#">Zen3</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                </nav>
        );
}

export default header;