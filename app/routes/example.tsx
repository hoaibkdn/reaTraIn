import React from "react";

class Test {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    getMethod() {
        console.log("this in getMethod", this);
        return this.name;
    }
}

class Example extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: "111",
    };
    this.handleClickT = this.handleClick3.bind(this);
  }
  componentDidMount(): void {
    console.log("this ", this);

    console.log(new Test("test").getMethod());
  }
  handleClick1() {
    console.log("Click 1");
  }
  handleClick2() {
    console.log("this ", this);
    this.setState({
        value: "click 3",
    });
  }
  handleClick3() {
    this.setState({
      value: "click 3",
    });
  }
  handleClick4(value: string) {
    this.setState({
      value: value,
    });
  }
  render() {
    return (
      <>
        <button onClick={this.handleClick1}>Click 1</button>
        <button onClick={this.handleClick2}>Click 2</button>
        <button onClick={this.handleClickT}>Click 3</button>
        <button onClick={() => this.handleClick4("click 4")}>Click 4</button>
        <p>Value {this.state?.value}</p>
      </>
    );
  }
}

export default Example;