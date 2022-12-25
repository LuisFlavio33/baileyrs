import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/src/sweetalert2.scss'
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

class ZDG extends React.Component  {

  constructor(props){
    super(props);
    this.state = {
      campInstancias:[],
      campInstancia: "",
      campResult: "",
      campResult2: ""
    }
  }

  render()
  {
    return (
      <div>
        <h2>BAILEYS - MULTISESSÃO</h2>
        <hr></hr>
        <button style={{ marginRight: 5 }} class="btn btn-primary" onClick={()=>this.ZDGList()}>Listar Sessões</button>
        <button class="btn btn-primary" onClick={()=>this.ZDGRestore()}>Restaurar todas</button>
        <textarea 
          class="form-control"
					name="campPergunta" 
					cols="40" 
					rows="3"
					value={this.state.campInstancias} 
					onChange={(value)=> this.setState({campInstancias:value.target.value})}
					required="required"
					placeholder="Sessão #1&#13;&#10;Sessão #2&#13;&#10;..."
          style={{ marginTop: 15, marginBottom: 30 }}
				></textarea>
        <h3>Controle da Sessão</h3>
        <input style={{ marginBottom: 15 }} type="text" class="form-control" placeholder="Sessão (somente letras e numeros)" value={this.state.campInstancia} onChange={(value)=> this.setState({campInstancia:value.target.value.replace(/\W/g, "")})}/>
        <button style={{ marginRight: 5 }} class="btn btn-success" onClick={()=>this.ZDGInit()}>Iniciar</button>
        <button style={{ marginRight: 5 }} class="btn btn-primary" onClick={()=>this.ZDGQr()}>QrCode na Web</button>
        <button style={{ marginRight: 5 }} class="btn btn-primary" onClick={()=>this.ZDGQrBase()}>QrCode Base64</button>
        <button style={{ marginRight: 5 }} class="btn btn-secondary" onClick={()=>this.ZDGInfo()}>Informações</button>
        <button style={{ marginRight: 5 }} class="btn btn-danger" onClick={()=>this.ZDGLogout()}>Logout</button>
        <button class="btn btn-danger" onClick={()=>this.ZDGDel()}>Deletar</button>
        <p><br /></p>
        <p>{this.state.campResult}</p>
        <img src={this.state.img} alt="" />
        <hr></hr>
        <h3>Consulta</h3>
        <input style={{ marginBottom: 15 }} type="text" class="form-control" value={this.state.campZDG} onChange={(value)=> this.setState({campZDG:value.target.value.replace(/\W/g, "")})}/>
        <button style={{ marginRight: 5 }} class="btn btn-success" onClick={()=>this.ZDGOn()}>WhatsApp ON</button>
        <button style={{ marginRight: 5 }} class="btn btn-primary" onClick={()=>this.ZDGPic()}>Imagem de Perfil</button>
        <button style={{ marginRight: 5 }} class="btn btn-danger" onClick={()=>this.ZDGStatus()}>Status</button>
        <p><br /></p>
        <p>{this.state.campResult2}</p>
        <img src={this.state.imgPic} alt=""/>
        <p><br /></p>
        <hr></hr>
        <p><a href="https://site.conectivax.uk"><img src="./logo192.png" alt="" style={{width: 50, height: 50}}/></a> ©Conectiva</p>
      </div>
    );
  }

  ZDGList(){
    const config = {
      method: 'get',
      url: baseUrl + '/instance/list',
      headers: { },
    };
    axios(config)
    .then((response) => {
      const dataZDG = JSON.stringify(response.data.data).replace(/,/g,"\nSessão: ").replace("[","Sessão: ")
      this.setState({ campInstancias: dataZDG.replace(/]|"/g, "")})
    })
    .catch(function (error) {
      console.log(error);
      alert('© BOT - Sem tokens ativos.')
    });
  }

  ZDGRestore(){
    const config = {
      method: 'get',
      url: baseUrl + '/instance/restore',
      headers: { },
    };
    axios(config)
    .then((response) => {
      const dataZDG = JSON.stringify(response.data.data).replace(/,/g,"\nSessão restaurada: ").replace("[","Sessão restaurada: ")
      this.setState({ campInstancias: dataZDG.replace(/]|"/g, "")})
    })
    .catch(function (error) {
      console.log(error);
      alert('© BOT- Sem tokens ativos.')
    });
  }

  ZDGQr(){
    const newPageUrl = baseUrl + '/instance/qr?key='+ this.state.campInstancia
    window.open(newPageUrl, "_blank")
  }

  ZDGQrBase(){
    const config = {
      method: 'get',
      url: baseUrl + '/instance/qrbase64?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      this.setState({ img: response.data.qrcode });
      //console.log(response)
    })
    .catch(function (error) {
      console.log(error);
      alert('© BOT- Token já removido ou não existe.')
    });
  }

  ZDGInit(){
    const config = {
      method: 'get',
      url: baseUrl + '/instance/init?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      //alert('Status: ' + JSON.stringify(response.data.message).replace(/"/g, "") + '. Token: ' + JSON.stringify(response.data.key).replace(/"/g, ""))
      //console.log(response)
      this.setState({ campResult: 'Status: ' + JSON.stringify(response.data.message).replace(/"/g, "") + '. Token: ' + JSON.stringify(response.data.key).replace(/"/g, "")})
    })
    .catch(function (error) {
      console.log(error);
      alert('© BOT- Token não inicializado.')
    });
  }

  ZDGInfo(){
    const config = {
      method: 'get',
      url: baseUrl + '/instance/info?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      //alert("Status: " + JSON.stringify(response.data.instance_data.phone_connected) + ". Token: " + JSON.stringify(response.data.instance_data.instance_key).replace(/\W/g, "") + ". Conta conectada: " + JSON.stringify(response.data.instance_data.user.id).replace(/\D/g, ""))
      //console.log(response)
      this.setState({ campResult: "Status: " + JSON.stringify(response.data.instance_data.phone_connected) + ". Token: " + JSON.stringify(response.data.instance_data.instance_key).replace(/\W/g, "") + ". Conta conectada: " + JSON.stringify(response.data.instance_data.user.id).replace(/\D/g, "")})
    })
    .catch(function (error) {
      console.log(error);
      alert('© BOT- Token já removido ou não existe.')
    });
  }

  ZDGDel(){
    const config = {
      method: 'delete',
      url: baseUrl + '/instance/delete?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      alert(JSON.stringify(response.data.message))
      //console.log(response)
      this.setState({ campInstancias: JSON.stringify(response.data.message)})
    })
    .catch(function (error) {
      console.log(error);
      alert('© BOT- Token já removido ou não existe.')
    });
  }

  ZDGLogout(){
    const config = {
      method: 'delete',
      url: baseUrl + '/instance/logout?key=' + this.state.campInstancia,
      headers: { },
    };
    axios(config)
    .then((response) => {
      alert(JSON.stringify(response.data.message))
      //console.log(response)
    })
    .catch(function (error) {
      console.log(error);
      alert('© BOT- Token já removido ou não existe.')
    });
  }

  ZDGOn(){
    const config = {
      method: 'get',
      url: baseUrl + '/misc/onwhatsapp?key=' + this.state.campInstancia + '&id=' + this.state.campZDG,
      headers: { },
    };
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data.data))
      //alert(JSON.stringify(response.data.data))
      this.setState({ campResult2: 'WhatsAppON: ' + JSON.stringify(response.data.data)})
    })
    .catch(function (error) {
      console.log(error);
      if (JSON.stringify(error).includes('403')){
        alert('© BOT- Token inativo ou não existe.')
      }
      else if (JSON.stringify(error).includes('500')){
        alert('© BOT- Número inexistente.')
      }
      else{
        alert('© BOT- Número inexistente ou token inativo.')
      }
    });
  }

  ZDGPic(){
    const config = {
      method: 'get',
      url: baseUrl + '/misc/downProfile?key=' + this.state.campInstancia + '&id=' + this.state.campZDG,
      headers: { },
    };
    axios(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data.data))
      this.setState({ imgPic: response.data.data });
    })
    .catch(function (error) {
      console.log(error);
      if (JSON.stringify(error).includes('403')){
        alert('© BOT- Token inativo ou não existe.')
      }
      else if (JSON.stringify(error).includes('500')){
        alert('© BOT- Número inexistente.')
      }
      else{
        alert('© BOT-ZDG - Número inexistente ou token inativo.')
      }
    });
  }

  ZDGStatus(){
    const config = {
      method: 'get',
      url: baseUrl + '/misc/getStatus?key=' + this.state.campInstancia + '&id=' + this.state.campZDG,
      headers: { },
    };
    axios(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data.data.status))
      this.setState({ campResult2: 'Status: ' + JSON.stringify(response.data.data.status)})
    })
    .catch(function (error) {
      console.log(error);
      if (JSON.stringify(error).includes('403')){
        alert('© BOT- Token inativo ou não existe.')
      }
      else if (JSON.stringify(error).includes('500')){
        alert('© BOT- Número inexistente.')
      }
      else{
        alert('© BOT- Número inexistente ou token inativo.')
      }
    });
  }

}

export default ZDG;
