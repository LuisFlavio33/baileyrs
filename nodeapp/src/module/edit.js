import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/src/sweetalert2.scss'
import axios from 'axios';

class initComponent extends React.Component  {

  constructor(props){
    super(props);
    this.state = {
      campInstancia: "",
    }
  } 

  render()
  {
    return (
      <div>
        <input type="text" class="form-control" placeholder="Mensagem" value={this.state.campInstancia} onChange={(value)=> this.setState({campInstancia:value.target.value})}/>
        <button class="btn btn-primary" onClick={()=>this.ZDGInit()}>Iniciar</button>
        <button class="btn btn-primary" onClick={()=>this.ZDGQr()}>QrCode</button>
        <button class="btn btn-primary" onClick={()=>this.ZDGInfo()}>+ Info</button>
        <button class="btn btn-primary" onClick={()=>this.ZDGLogout()}>Logout</button>
        <button class="btn btn-primary" onClick={()=>this.ZDGDel()}>Deletar</button>
      </div>
    );
  }

  ZDGQr(){
    const newPageUrl = 'http://localhost:3333/instance/qr?key='+ this.state.campInstancia
    //localStorage.setItem("pageData", "Data Retrieved from axios request")
    window.open(newPageUrl, "_blank")
 }

  ZDGInit(){
    const config = {
      method: 'get',
      url: 'http://localhost:3333/instance/init?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      alert(JSON.stringify(response.data))
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  ZDGInfo(){
    const config = {
      method: 'get',
      url: 'http://localhost:3333/instance/info?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      alert(JSON.stringify(response.data))
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  ZDGDel(){
    const config = {
      method: 'delete',
      url: 'http://localhost:3333/instance/delete?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      alert(JSON.stringify(response.data))
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  ZDGLogout(){
    const config = {
      method: 'delete',
      url: 'http://localhost:3333/instance/logout?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      alert(JSON.stringify(response.data))
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

}

export default initComponent;