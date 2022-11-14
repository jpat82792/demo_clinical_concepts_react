import React, {Component} from 'react';
import Row from './Row.js';

export class HelloWorld extends Component{
  
  constructor(props){
    super(props);
      this.state = {data:[
        { 
          conceptId: 1,
          displayName:"Diagnosis",
          description: "Entity Domain",
          parentIds: null,
          childIds:"2,3",
          alternateNames:null
        },
        { 
          conceptId: 2,
          displayName:"Disease of Nervous System",
          description: "Diseases targeting the nervous system",
          parentIds: "1",
          childIds:"4",
          alternateNames:null
        },
        { 
          conceptId: 3,
          displayName:"Disease of Eye",
          description: "Diseases targeting the eye",
          parentIds:"1",
          childIds:"2,3",
          alternateNames:null
        },
        { 
          conceptId: 4,
          displayName:"Multiple Sclerosis (MS)",
          description: "Multiple Sclerosis",
          parentIds: "2,8",
          childIds:"5,6,7",
          alternateNames:"MS,name1,name2"
        }
      ]};
  }

  componentDidMount(){
   // this.getClinicalConcepts();
  }

  getClinicalConcepts(){
      this.setState({data:[
        { 
          conceptId: 1,
          displayName:"Diagnosis",
          description: "Entity Domain",
          parentIds: null,
          childIds:"2,3",
          alternateNames:null
        },
        { 
          conceptId: 2,
          displayName:"Disease of Nervous System",
          description: "Diseases targeting the nervous system",
          parentIds: "1",
          childIds:"4",
          alternateNames:null
        },
        { 
          conceptId: 3,
          displayName:"Disease of Eye",
          description: "Diseases targeting the eye",
          parentIds:"1",
          childIds:"2,3",
          alternateNames:null
        },
        { 
          conceptId: 4,
          displayName:"Multiple Sclerosis (MS)",
          description: "Multiple Sclerosis",
          parentIds: "2,8",
          childIds:"5,6,7",
          alternateNames:"MS,name1,name2"
        }
      ]});
  }

  
  render(){
    console.log(this.state);
    return (<tbody>{
     this.state.data.map((concept, index)=>(
      <tr><td>{concept.conceptId}</td></tr>
     )) 
    }</tbody>);
  }
}
export default HelloWorld