import React, { Component } from 'react';
import { Button,Popover,Badge } from 'antd';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.clickListItem = this.props.onClick;
    this.clickEditar = this.props.clickEditar;

    console.log(this.props.marcador);

  }

  componentWillReceiveProps = (nextProps) =>{
  }

  // clickListItem = () => {
  //   this.props.On
  // }

  render() {
    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );
    return (
      <div
        className="listItemSingle">
        <h3 onClick={() => this.clickListItem(this.props.marcador)}>
          this.props.marcador.name
        </h3>
        <span className="stateOfItem">
           <Badge status="success" text={"this.props.marcador.state"}/>
        </span>
        {this.props.type?
           <Button onClick={()=> this.clickListItem(this.props.marcador)} type="dashed" icon="check"/>
          :<Button onClick={()=> this.clickEditar(this.props.marcador)} type="dashed" icon="edit"/>}
      </div>
    )
  }
}
