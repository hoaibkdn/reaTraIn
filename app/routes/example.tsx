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

const testA = new Test("test");
console.log(testA.getMethod());

class Example extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: "111",
    };
    this.handleClick3 = this.handleClick3.bind(this);
  }
  componentDidMount(): void {
    console.log("this ", this);
  }
  handleClick1() {
    console.log("Click 1");
  }
  handleClick2() {
    console.log("this ", this);
    this.setState({
        value: "click 2",
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
        <button onClick={this.handleClick3}>Click 3</button>
        <button onClick={() => this.handleClick4("click 4")}>Click 4</button>
        <p>Value {this.state?.value}</p>
      </>
    );
  }
}

export default Example;


function Component() {
    useState(0);   // Hook 1
    useEffect(() => {}, []); // Hook 2
}