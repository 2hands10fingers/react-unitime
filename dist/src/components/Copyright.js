import React from 'react';

class Copyright extends React.Component {
  state = {
    copyrightYear: 2018,
    currentYear: undefined
  };

  componentDidMount() {
    let currentYear = new Date().getFullYear();
    if (currentYear != this.state.copyrightYear) {
      this.setState({ currentYear: currentYear });
    }
  }

  render() {
    return (
      <footer>
        <p className="copyright">
          ©
          {' '}
          {this.state.copyrightYear}
          {this.state.currentYear && '-' + this.state.currentYear} 
          {' '}
          <a className="copyright__link" href="https://github.com/2hands10fingers" target="_blank">Antonio Nogueras</a>
        </p>
      </footer>
    );
  }
}

export default Copyright;