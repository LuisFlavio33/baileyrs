import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/src/sweetalert2.scss'
import axios from 'axios';

class ZDGMisc extends React.Component  {

  constructor(props){
    super(props);
    this.state = {
      campZDG: "",
      campInstancia: "",
      campResult: ""
    }
  }

  render()
  {
    return (
      <div>
        <h2>ZDG BAILEYS - MULTISESSÃO</h2>
        <hr></hr>
        <h3>Controle da Sessão</h3>
        <input style={{ marginBottom: 15 }} type="text" class="form-control" value={this.state.campInstancia} onChange={(value)=> this.setState({campInstancia:value.target.value.replace(/\W/g, "")})}/>
        <h3>Consulta</h3>
        <input style={{ marginBottom: 15 }} type="text" class="form-control" value={this.state.campZDG} onChange={(value)=> this.setState({campZDG:value.target.value.replace(/\W/g, "")})}/>
        <button style={{ marginRight: 5 }} class="btn btn-success" onClick={()=>this.ZDGOn()}>WhatsApp ON</button>
        <button style={{ marginRight: 5 }} class="btn btn-primary" onClick={()=>this.ZDGPic()}>Imagem de Perfil</button>
        <button style={{ marginRight: 5 }} class="btn btn-danger" onClick={()=>this.ZDGStatus()}>Status</button>
        <p><br /></p>
        <p>{this.state.campResult}</p>
        <img src={this.state.img} alt=""/>
      </div>
    );
  }

  ZDGOn(){
    const config = {
      method: 'get',
      url: 'http://localhost:3333/misc/onwhatsapp?key=' + this.state.campInstancia + '&id=' + this.state.campZDG,
      headers: { },
    };
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data.data))
      //alert(JSON.stringify(response.data.data))
      this.setState({ campResult: 'WhatsAppON: ' + JSON.stringify(response.data.data)})
    })
    .catch(function (error) {
      console.log(error);
      if (JSON.stringify(error).includes('403')){
        alert('© BOT-ZDG - Token inativo ou não existe.')
      }
      else if (JSON.stringify(error).includes('500')){
        alert('© BOT-ZDG - Número inexistente.')
      }
      else{
        alert('© BOT-ZDG - Número inexistente ou token inativo.')
      }
    });
  }

  ZDGPic(){
    const config = {
      method: 'get',
      url: 'http://localhost:3333/misc/downProfile?key=' + this.state.campInstancia + '&id=' + this.state.campZDG,
      headers: { },
    };
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data.data))
      this.setState({ imgPic: response.data.data });
    })
    .catch(function (error) {
      console.log(error);
      if (JSON.stringify(error).includes('403')){
        alert('© BOT-ZDG - Token inativo ou não existe.')
      }
      else if (JSON.stringify(error).includes('500')){
        alert('© BOT-ZDG - Número inexistente.')
      }
      else{
        alert('© BOT-ZDG - Número inexistente ou token inativo.')
      }
    });
  }

  ZDGStatus(){
    const config = {
      method: 'get',
      url: 'http://localhost:3333/misc/getStatus?key=' + this.state.campInstancia + '&id=' + this.state.campZDG,
      headers: { },
    };
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data.data.status))
      //alert(JSON.stringify(response.data.data.status))
      this.setState({ campResult: 'Status: ' + JSON.stringify(response.data.data.status)})
    })
    .catch(function (error) {
      console.log(error);
      if (JSON.stringify(error).includes('403')){
        alert('© BOT-ZDG - Token inativo ou não existe.')
      }
      else if (JSON.stringify(error).includes('500')){
        alert('© BOT-ZDG - Número inexistente.')
      }
      else{
        alert('© BOT-ZDG - Número inexistente ou token inativo.')
      }
    });
  }


}

export default ZDGMisc;