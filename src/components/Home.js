import logo from './logo.png';

function Home() {

    return (
        <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <a
                className="App-link"
                href="https://narrativetrails.xyz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </header>
          </div>
    );
}
export default <Home/>