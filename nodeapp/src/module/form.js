import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import qs from 'qs';

class EditComponent extends React.Component{

 constructor(props){
   super(props);
   this.state = {
     campNumber: "",
     campMessage: ""
   }
 } 

 render(){
  return (
    <div>
      <div class="form-row justify-content-center">
        <div class="form-group col-md-6">
          <label for="input1">Destinatário</label>
          <input type="text" class="form-control"  placeholder="Destinatário" value={this.state.campNumber} onChange={(value)=> this.setState({campNumber:value.target.value})}/>
        </div>
        <div class="form-group col-md-6">
          <label for="input2">Mensagem</label>
          <input type="email" class="form-control"  placeholder="Mensagem" value={this.state.campMessage} onChange={(value)=> this.setState({campMessage:value.target.value})}/>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" onClick={()=>this.sendAction()}>Enviar</button>
    </div>
  );
}

sendAction(){
  if (this.state.campNumber==="") {
    alert("Seleccione el tipo de Role")
  }
  else if (this.state.campMessage==="") {
     alert("Digite el campo de telefono")
  }
  else {

    var data = qs.stringify({
      'id': this.state.campNumber,
      'message': this.state.campMessage 
    });
    var config = {
      method: 'post',
      url: 'http://localhost:3333/message/text?key=1234',
      headers: { },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

}


export default EditComponent;