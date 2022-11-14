import React, {Component} from 'react';
import './ConceptTile.css';
import './ConceptModal.js';
export class ConceptTile extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount(){

  }

  render(){
    return (
    <div className="concept-tile" concept-id={this.props.concept.conceptId}>
      <div className='displayName'>{this.props.concept.displayName}</div>
      <div className='description'>{this.props.concept.description}</div>
      <button className="alter-button" onClick={() =>{this.props.deleteConcept(this.props.concept.conceptId)}}>Delete</button>
      <button onClick={() =>{this.props.openModal(this.props.concept)}} 
        className="alter-button">Edit</button>
      
    </div>)
  }
}

export default ConceptTile